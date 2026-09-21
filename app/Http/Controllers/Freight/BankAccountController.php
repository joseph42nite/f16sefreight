<?php

namespace App\Http\Controllers\Freight;

use App\BankAccount;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * The company's own bank accounts (user, 2026-09-21).
 *
 * 🔒 `manageFinanceSettings` to change one — accounts and the Boss. Reading is `viewFinancials`, because every
 * screen that records money needs the list to put in front of somebody.
 *
 * 🔴 **The ledger code is issued once and never changes.** Renaming an account must not move where its history
 * is posted, so `account_code` is stored at creation and the edit form cannot touch it.
 */
class BankAccountController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();

        $accounts = BankAccount::withoutGlobalScopes()
            ->whereIn('agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('agent_id', $request->integer('agent_id')))
            ->when(! $request->boolean('include_closed'), fn ($q) => $q->active())
            ->orderBy('name')
            ->get();

        // What the ledger says is in each one — the figure the balance sheet carries.
        $balances = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->whereIn('l.agent_id', $branches->pluck('id'))
            ->whereIn('c.account_code', $accounts->pluck('account_code'))
            ->groupBy('c.account_code')
            ->selectRaw('c.account_code, SUM(l.debit_amount - l.credit_amount) AS balance')
            ->pluck('balance', 'account_code');

        $branchNames = $branches->pluck('name', 'id');

        foreach ($accounts as $account) {
            $account->setAttribute('branch', $branchNames[$account->agent_id] ?? null);
            $account->setAttribute('balance', round((float) ($balances[$account->account_code] ?? 0), 2));
            // Statement lines imported against it and not yet placed.
            $account->setAttribute('unreconciled', DB::table('bank_transactions')
                ->where('bank_account_id', $account->id)->where('reconciliation_status', 'unreconciled')->count());
        }

        return response()->json([
            'accounts' => $accounts,
            'branches' => $branches,
            // ⚠️ Everything posted before the master existed sits on the single, undifferentiated account.
            'legacy_balance' => round((float) DB::table('accounts_ledger_entries as l')
                ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
                ->whereIn('l.agent_id', $branches->pluck('id'))
                ->where('c.account_code', BankAccount::CODE_PREFIX)
                ->sum(DB::raw('l.debit_amount - l.credit_amount')), 2),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('manageFinanceSettings');

        $data = $this->validated($request);

        if (! $this->branches()->contains('id', (int) $data['agent_id'])) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        $lastFour = BankAccount::lastFour($data['account_no'] ?? null);
        $code = BankAccount::codeFor($data['bank_name'] ?? null, $lastFour, $data['name']);

        if (BankAccount::withoutGlobalScopes()->where('agent_id', $data['agent_id'])
            ->where('account_code', $code)->exists()) {
            return response()->json([
                'error' => 'This branch already has an account that would post to ' . $code
                    . '. Give it a different name, or use the one that exists.',
                'reason' => 'code_taken',
            ], 422);
        }

        $account = DB::transaction(function () use ($data, $code, $lastFour) {
            $account = BankAccount::withoutGlobalScopes()->create(array_merge($data, [
                'account_code' => $code, 'last_four' => $lastFour, 'is_active' => true,
            ]));

            $this->settleDefault($account, $data['is_default'] ?? false);

            return $account;
        });

        $this->audit->record($account->agent_id, 'bank_account.added', 'bank_account', $account->id, auth()->id());

        return response()->json($account->fresh(), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorize('manageFinanceSettings');

        $account = $this->own($id);
        $data = $this->validated($request, $account);

        // 🔴 Never the code, and never the branch: both decide where its history lives.
        unset($data['agent_id']);

        DB::transaction(function () use ($account, $data) {
            $account->update(array_merge($data, ['last_four' => BankAccount::lastFour($data['account_no'] ?? null)
                ?: $account->last_four]));

            $this->settleDefault($account, $data['is_default'] ?? false);
        });

        $this->audit->record($account->agent_id, 'bank_account.updated', 'bank_account', $account->id, auth()->id());

        return response()->json($account->fresh());
    }

    /**
     * Close an account.
     *
     * 🔴 **Deactivate, never delete.** Receipts, payments and statement lines point at it, and its ledger code
     * carries every rupee that ever moved through it; removing the row would orphan all of that.
     */
    public function close(int $id): JsonResponse
    {
        $this->authorize('manageFinanceSettings');

        $account = $this->own($id);
        $account->update(['is_active' => false, 'is_default' => false]);

        $this->audit->record($account->agent_id, 'bank_account.closed', 'bank_account', $account->id, auth()->id());

        return response()->json($account->fresh());
    }

    /** One default per branch: the account a new receipt or payment starts on. */
    private function settleDefault(BankAccount $account, bool $wanted): void
    {
        if (! $wanted) {
            return;
        }

        BankAccount::withoutGlobalScopes()->where('agent_id', $account->agent_id)
            ->where('id', '!=', $account->id)->update(['is_default' => false]);
        $account->update(['is_default' => true]);
    }

    private function validated(Request $request, ?BankAccount $existing = null): array
    {
        return $request->validate([
            'agent_id' => ($existing ? 'nullable' : 'required') . '|integer',
            'name' => 'required|string|max:100',
            'bank_name' => 'nullable|string|max:100',
            'account_no' => 'nullable|string|max:40',
            'ifsc_code' => 'nullable|string|max:20',
            'branch_name' => 'nullable|string|max:100',
            'currency' => 'nullable|string|size:3',
            'provider' => 'nullable|in:setu,plaid,manual',
            'provider_ref' => 'nullable|string|max:100',
            'is_default' => 'nullable|boolean',
        ]);
    }

    private function own(int $id): BankAccount
    {
        $account = BankAccount::withoutGlobalScopes()->where('id', $id)
            ->whereIn('agent_id', $this->branches()->pluck('id'))->first();

        abort_if($account === null, 404, 'That bank account is not one of yours.');

        return $account;
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
