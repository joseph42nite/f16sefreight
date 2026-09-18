<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Settings → Finance (PRD §2.4 `/settings/finance`), 2026-09-18: the chart of accounts and the rate cards.
 *
 * 🔴 **The chart is per branch**, because the ledger is: an account code is where a branch's postings land, and two
 * branches that file their own returns keep their own accounts. Posting creates an account the first time it is needed
 * (`LedgerPostingService::accountId`), so this page is where they are NAMED and read — never where postings move.
 *
 * ⚠️ An account that has already been posted to cannot be removed: the ledger would point at nothing. It can be
 * renamed, which changes only the words on the reports.
 */
class FinanceSettingsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');
        [$branches, $picked] = $this->branches($request);
        $ids = $picked ? [$picked] : $branches->pluck('id')->all();

        $accounts = DB::table('chart_of_accounts as c')
            ->join('agents_info as a', 'a.id', '=', 'c.agent_id')
            ->leftJoin('accounts_ledger_entries as l', 'l.chart_of_account_id', '=', 'c.id')
            ->whereIn('c.agent_id', $ids)
            ->groupBy('c.id', 'c.account_code', 'c.account_name', 'c.agent_id', 'a.agent_name')
            ->orderBy('c.account_code')
            ->get(['c.id', 'c.account_code', 'c.account_name', 'c.agent_id', 'a.agent_name as branch',
                   DB::raw('COUNT(l.id) AS postings')]);

        $rates = DB::table('rate_cards as r')
            ->join('agents_info as a', 'a.id', '=', 'r.agent_id')
            ->leftJoin('partners as p', fn ($j) => $j->on('p.id', '=', 'r.party_id')->where('r.party_type', '=', 'partner'))
            ->leftJoin('customers as cu', fn ($j) => $j->on('cu.id', '=', 'r.party_id')->where('r.party_type', '=', 'customer'))
            ->whereIn('r.agent_id', $ids)
            ->orderByDesc('r.valid_from')
            ->get(['r.id', 'r.charge_type', 'r.party_type', 'r.cargo_type', 'r.weight_break_from', 'r.weight_break_to',
                   'r.rate', 'r.currency', 'r.valid_from', 'r.valid_to', 'r.agent_id', 'a.agent_name as branch',
                   DB::raw('COALESCE(p.name, cu.name) AS party')]);

        return response()->json(['accounts' => $accounts, 'rate_cards' => $rates, 'branches' => $branches, 'branch_picked' => $picked]);
    }

    /** Name an account that does not exist yet, or rename one. Codes are never changed: the ledger points at them. */
    public function saveAccount(Request $request): JsonResponse
    {
        $this->authorize('manageFinanceSettings');
        $context = UserContext::for(auth()->user());

        $data = $request->validate([
            'agent_id' => 'required|integer',
            'account_code' => 'required|string|max:30|regex:/^[0-9A-Za-z\-]+$/',
            'account_name' => 'required|string|max:100',
        ]);

        if (! $this->ownBranch($context, (int) $data['agent_id'])) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        DB::table('chart_of_accounts')->updateOrInsert(
            ['agent_id' => $data['agent_id'], 'account_code' => $data['account_code']],
            ['account_name' => $data['account_name'], 'updated_at' => now(), 'created_at' => now()]
        );

        return $this->index($request);
    }

    /** A rate a client or a supplier is quoted, for a lane and a weight break. */
    public function saveRateCard(Request $request): JsonResponse
    {
        $this->authorize('manageFinanceSettings');
        $context = UserContext::for(auth()->user());

        $data = $request->validate([
            'agent_id' => 'required|integer',
            'charge_type' => 'required|string|max:50',
            'party_type' => 'required|in:customer,partner',
            'party_id' => 'required|integer',
            'cargo_type' => 'nullable|string|max:20',
            // The table requires the end of both ranges, and a rate card should carry them: an open-ended rate is how
            // last year's price is still quoted next year.
            'weight_break_from' => 'required|numeric|min:0',
            'weight_break_to' => 'required|numeric|gte:weight_break_from',
            'rate' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after_or_equal:valid_from',
        ]);

        if (! $this->ownBranch($context, (int) $data['agent_id'])) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        // The lane and cargo type are optional until lane rates are built.
        DB::table('rate_cards')->insert(array_merge([
            'cargo_type' => null, 'origin_port_id' => null, 'destination_port_id' => null,
        ], $data, ['created_at' => now(), 'updated_at' => now()]));

        return $this->index($request);
    }

    public function destroyRateCard(Request $request, int $id): JsonResponse
    {
        $this->authorize('manageFinanceSettings');
        $context = UserContext::for(auth()->user());

        $card = DB::table('rate_cards')->where('id', $id)->first(['agent_id']);

        if ($card === null || ! $this->ownBranch($context, (int) $card->agent_id)) {
            return response()->json(['error' => 'That rate card is not one of yours.', 'reason' => 'not_found'], 404);
        }

        DB::table('rate_cards')->where('id', $id)->delete();

        return $this->index($request);
    }

    private function ownBranch(UserContext $context, int $agentId): bool
    {
        return DB::table('agents_info')->where('id', $agentId)->where('company_id', $context->companyId)->exists();
    }

    /** @return array{0: \Illuminate\Support\Collection, 1: ?int} */
    private function branches(Request $request): array
    {
        $context = UserContext::for(auth()->user());
        $branches = DB::table('agents_info')->where('company_id', $context->companyId)->orderBy('agent_name')->get(['id', 'agent_name as name']);
        $picked = $request->filled('agent_id') && $branches->contains('id', (int) $request->integer('agent_id'))
            ? (int) $request->integer('agent_id') : null;

        return [$branches, $picked];
    }
}
