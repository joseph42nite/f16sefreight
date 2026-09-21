<?php

namespace App\Http\Controllers\Freight;

use App\AccountsPayment;
use App\AccountsPurchaseVoucher;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\EnquirySequenceService;
use App\Services\LedgerPostingService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Paying suppliers (user, 2026-09-21: "build the payment run then money out").
 *
 * 🔴 **You could see what you owed and not pay it.** There was no payment document at all: a voucher was posted
 * to `2100-AP` and stayed there for ever, so the payable never came down and the bank balance was only ever the
 * receipts side. This is the other half of the ledger.
 *
 * 🔴 **A run produces ONE PAYMENT PER SUPPLIER, not one payment.** Each is a separate bank transfer to a separate
 * account; a single row covering four vendors could never be reconciled against the statement. `run_ref` ties
 * them together so the batch is recoverable.
 *
 * 🔒 `postLedger` — accounts alone. The Boss reads what is owed and does not pay it.
 */
class PaymentController extends Controller
{
    public function __construct(
        private readonly EnquirySequenceService $sequences,
        private readonly LedgerPostingService $ledger,
        private readonly AuditLogger $audit,
    ) {}

    /** What has been paid. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();

        $rows = DB::table('accounts_payments as p')
            ->leftJoin('partners as pt', 'pt.id', '=', 'p.payee_id')
            ->whereIn('p.agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('p.agent_id', $request->integer('agent_id')))
            ->when($request->filled('run_ref'), fn ($q) => $q->where('p.run_ref', $request->string('run_ref')))
            ->orderByDesc('p.payment_date')->orderByDesc('p.id')
            ->limit(500)
            ->get(['p.*', 'pt.name as payee']);

        $allocations = DB::table('accounts_payment_allocations as a')
            ->join('accounts_purchase_vouchers as v', 'v.id', '=', 'a.purchase_voucher_id')
            ->whereIn('a.payment_id', $rows->pluck('id'))
            ->get(['a.payment_id', 'a.amount', 'v.voucher_no'])
            ->groupBy('payment_id');

        foreach ($rows as $row) {
            $row->allocations = $allocations[$row->id] ?? collect();
        }

        return response()->json([
            'rows' => $rows,
            'total' => round($rows->sum('amount'), 2),
            'branches' => $branches,
            'modes' => AccountsPayment::MODES,
        ]);
    }

    /**
     * What is payable: every voucher with a balance, oldest first.
     *
     * ⚠️ **Aged from the DOCUMENT date and the screen says so.** A voucher has no due date of its own unless
     * somebody recorded one — supplier terms are not in the schema — so the strictest reading stands in, visibly,
     * rather than a generous guess nobody can audit.
     */
    public function due(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();

        $rows = DB::table('accounts_purchase_vouchers as v')
            ->join('partners as p', 'p.id', '=', 'v.vendor_id')
            ->leftJoin('jobs as j', 'j.id', '=', 'v.job_id')
            ->leftJoinSub(
                DB::table('accounts_purchase_items')->selectRaw('purchase_voucher_id, SUM(net_amount) AS gross')
                    ->groupBy('purchase_voucher_id'),
                'i', 'i.purchase_voucher_id', '=', 'v.id'
            )
            ->whereIn('v.agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('v.agent_id', $request->integer('agent_id')))
            ->when($request->filled('vendor_id'), fn ($q) => $q->where('v.vendor_id', $request->integer('vendor_id')))
            ->whereRaw('COALESCE(i.gross, 0) - v.amount_paid > 0.009')
            ->orderBy('v.document_date')
            ->get(['v.id', 'v.voucher_no', 'v.document_date', 'v.due_date', 'v.amount_paid', 'v.vendor_id',
                   'p.name as vendor', 'p.email as vendor_email', 'j.execution_job_no as job_no',
                   DB::raw('COALESCE(i.gross, 0) AS gross')]);

        foreach ($rows as $row) {
            $row->outstanding = round((float) $row->gross - (float) $row->amount_paid, 2);
            $row->due_assumed = $row->due_date === null;
            $row->due_on = $row->due_date ?: $row->document_date;
            $row->days_old = max(0, \Illuminate\Support\Carbon::parse($row->due_on)->diffInDays(now(), false));
        }

        // Grouped the way a run is actually made: one payment per supplier.
        $byVendor = $rows->groupBy('vendor_id')->map(fn ($group, $vendorId) => [
            'vendor_id' => (int) $vendorId,
            'vendor' => $group->first()->vendor,
            'email' => $group->first()->vendor_email,
            'vouchers' => $group->count(),
            'outstanding' => round($group->sum('outstanding'), 2),
            'oldest_days' => (int) $group->max('days_old'),
        ])->sortByDesc('outstanding')->values();

        return response()->json([
            'vouchers' => $rows,
            'by_vendor' => $byVendor,
            'total' => round($rows->sum('outstanding'), 2),
            'branches' => $branches,
        ]);
    }

    /**
     * Build a run: one payment per supplier across the vouchers chosen.
     *
     * ⚠️ An allocation may not exceed what the voucher still owes, and is refused rather than clamped — a
     * silently reduced payment is a figure nobody typed and nobody can explain to the supplier.
     */
    public function run(Request $request): JsonResponse
    {
        $this->authorize('postLedger');

        $data = $request->validate([
            'agent_id' => 'required|integer',
            'payment_date' => 'required|date',
            'mode' => 'required|in:' . implode(',', AccountsPayment::MODES),
            'reference' => 'nullable|string|max:60',
            'narration' => 'nullable|string|max:255',
            'allocations' => 'required|array|min:1',
            'allocations.*.purchase_voucher_id' => 'required|integer',
            'allocations.*.amount' => 'required|numeric|min:0.01',
        ]);

        if (! $this->branches()->contains('id', (int) $data['agent_id'])) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        $vouchers = AccountsPurchaseVoucher::withoutGlobalScopes()
            ->whereIn('id', collect($data['allocations'])->pluck('purchase_voucher_id'))
            ->whereIn('agent_id', $this->branches()->pluck('id'))
            ->get()->keyBy('id');

        foreach ($data['allocations'] as $allocation) {
            $voucher = $vouchers[$allocation['purchase_voucher_id']] ?? null;

            if ($voucher === null) {
                return response()->json(['error' => 'One of those vouchers is not one of yours.',
                    'reason' => 'voucher_not_found'], 404);
            }

            if (round((float) $allocation['amount'], 2) > $this->outstanding($voucher) + 0.009) {
                return response()->json([
                    'error' => sprintf('%s has only %s outstanding; you have placed %s against it.',
                        $voucher->voucher_no, number_format($this->outstanding($voucher), 2),
                        number_format((float) $allocation['amount'], 2)),
                    'reason' => 'over_allocated_voucher',
                ], 422);
            }
        }

        $runRef = 'RUN-' . now()->format('Ymd-His');

        $payments = DB::transaction(function () use ($data, $vouchers, $runRef) {
            $made = [];

            // 🔴 Grouped by SUPPLIER: each payment is one transfer to one bank account.
            foreach (collect($data['allocations'])->groupBy(fn ($a) => $vouchers[$a['purchase_voucher_id']]->vendor_id) as $vendorId => $lines) {
                $amount = round(collect($lines)->sum(fn ($l) => (float) $l['amount']), 2);

                $payment = AccountsPayment::create([
                    'agent_id' => $data['agent_id'], 'payee_type' => 'partner', 'payee_id' => (int) $vendorId,
                    'payment_no' => $this->sequences->next((int) $data['agent_id'], 'PAY'),
                    'payment_date' => $data['payment_date'], 'mode' => $data['mode'],
                    'reference' => $data['reference'] ?? null, 'amount' => $amount,
                    'currency' => 'INR', 'exchange_rate' => 1, 'run_ref' => $runRef,
                    'narration' => $data['narration'] ?? null, 'created_by' => auth()->id(),
                ]);

                foreach ($lines as $line) {
                    $payment->allocations()->create([
                        'purchase_voucher_id' => $line['purchase_voucher_id'],
                        'amount' => round((float) $line['amount'], 2),
                    ]);

                    $this->settle((int) $line['purchase_voucher_id']);
                }

                $this->audit->record((int) $data['agent_id'], 'payment.raised', 'payment', $payment->id, auth()->id());
                $made[] = $payment->fresh()->load('allocations');
            }

            return $made;
        }, EnquirySequenceService::DEADLOCK_ATTEMPTS);

        return response()->json([
            'run_ref' => $runRef,
            'payments' => $payments,
            'total' => round(collect($payments)->sum('amount'), 2),
        ], 201);
    }

    /** Post the payment: payable down, cash out. */
    public function post(int $id): JsonResponse
    {
        $this->authorize('postLedger');

        $payment = $this->own($id);

        if ($payment->is_posted) {
            return response()->json(['error' => 'This payment is already posted.', 'reason' => 'already_posted'], 422);
        }

        $period = $this->ledger->openPeriodFor($payment->agent_id, $payment->payment_date);

        if ($period === null) {
            return response()->json(['error' => 'No open accounting period covers this payment date.',
                'reason' => 'no_open_period'], 422);
        }

        DB::transaction(function () use ($payment, $period) {
            $this->ledger->write($this->ledger->linesForPayment((float) $payment->amount),
                $payment->agent_id, $period->id, $payment->id, 'payment');

            $payment->update(['is_posted' => true]);
            $this->audit->record($payment->agent_id, 'payment.posted', 'payment', $payment->id, auth()->id());
        });

        return response()->json($payment->fresh());
    }

    /** The exact journal the post will write. */
    public function postingPreview(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');

        return response()->json($this->ledger->summarise(
            $this->ledger->linesForPayment((float) $this->own($id)->amount)
        ));
    }

    /** What a voucher still owes: its lines, less everything placed against it. */
    private function outstanding(AccountsPurchaseVoucher $voucher): float
    {
        $gross = round((float) $voucher->items()->sum('net_amount'), 2);

        return round($gross - (float) $voucher->amount_paid, 2);
    }

    /**
     * Re-derive what a voucher has been paid, from its allocations.
     *
     * 🔴 Never `increment()`. A payment corrected or re-allocated would leave the running total carrying the old
     * figure for ever; summing the allocations cannot drift.
     */
    private function settle(int $voucherId): void
    {
        $voucher = AccountsPurchaseVoucher::withoutGlobalScopes()->find($voucherId);

        if ($voucher === null) {
            return;
        }

        $paid = round((float) DB::table('accounts_payment_allocations')
            ->where('purchase_voucher_id', $voucherId)->sum('amount'), 2);
        $gross = round((float) $voucher->items()->sum('net_amount'), 2);

        $voucher->update([
            'amount_paid' => $paid,
            'status' => $paid + 0.009 >= $gross ? 'paid' : ($paid > 0 ? 'part_paid' : 'unpaid'),
        ]);
    }

    private function own(int $id): AccountsPayment
    {
        $payment = AccountsPayment::withoutTenantScope()->where('id', $id)
            ->whereIn('agent_id', $this->branches()->pluck('id'))->first();

        abort_if($payment === null, 404, 'That payment is not one of yours.');

        return $payment;
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
