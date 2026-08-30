<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\BankTransaction;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\BankReconciliationService;
use App\Services\LedgerPostingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Bank reconciliation — guide §5.3, PRD.md §6.4.
 *
 * 🔒 `reconcile` — `accounts` only, and not the Boss. Settling cash against a
 * receivable moves both the bank balance and the AR balance; it is bookkeeping, not
 * oversight.
 *
 * ⚠️ **Matching is a LEDGER EVENT, not a flag.** Every match writes a balanced journal
 * — cash up, receivables down — inside the same transaction that flags the bank row.
 * A reconciliation screen that only sets statuses produces a bank feed that agrees
 * with itself and a ledger that agrees with nothing.
 */
class ReconciliationController extends Controller
{
    public function __construct(
        private readonly BankReconciliationService $matcher,
        private readonly LedgerPostingService $ledger,
        private readonly AuditLogger $audit,
    ) {}

    /** The left pane: bank rows still waiting. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $transactions = BankTransaction::query()
            ->when(
                $request->filled('status'),
                fn ($q) => $q->where('reconciliation_status', $request->string('status')),
                fn ($q) => $q->unreconciled()
            )
            ->with(['matchedInvoice:id,invoice_no,grand_total'])
            ->latest('created_at')
            ->paginate(50);

        return response()->json($transactions);
    }

    /** The right pane: confidence-ranked candidates for one bank row. */
    public function candidates(BankTransaction $transaction): JsonResponse
    {
        $this->authorize('viewFinancials');

        return response()->json([
            'transaction' => $transaction->only(['id', 'amount', 'reconciliation_status', 'plaid_transaction_id']),
            'candidates'  => $this->matcher->candidates($transaction),
            // The UI must state WHY suggestions are thin rather than look broken.
            'limitation'  => 'The bank feed carries no memo or counterparty, so amount is '
                           . 'the only signal available. Identical amounts cannot be separated.',
        ]);
    }

    /**
     * Settle a bank credit against an invoice.
     *
     * ⚠️ **An OVERPAYMENT is refused, not absorbed.** Paying more than is owed is a
     * real event — a duplicate transfer, a wrong invoice, an advance — and each has a
     * different correct answer. Silently setting `amount_paid` above `grand_total`
     * picks one of them at random and hides it inside a receivable that now reads as
     * negative.
     */
    public function match(Request $request, BankTransaction $transaction): JsonResponse
    {
        $this->authorize('reconcile');

        $data = $request->validate([
            'invoice_id' => 'required|integer',
            'resolution' => 'nullable|string|in:' . implode(',', BankReconciliationService::RESOLUTIONS),
        ]);

        if ($this->matcher->isSettled($transaction)) {
            return response()->json([
                'error'  => 'This bank transaction has already been reconciled.',
                'reason' => 'already_reconciled',
            ], 422);
        }

        $invoice = AccountsInvoice::where('agent_id', $transaction->agent_id)
            ->find($data['invoice_id']);

        if ($invoice === null) {
            return response()->json([
                'error'  => 'That invoice does not belong to this branch.',
                'reason' => 'invoice_not_found',
            ], 422);
        }

        $due = round((float) $invoice->grand_total - (float) $invoice->amount_paid, 2);
        $received = round((float) $transaction->amount, 2);

        if ($due <= 0) {
            return response()->json([
                'error'  => 'That invoice has nothing outstanding.',
                'reason' => 'nothing_due',
            ], 422);
        }

        if ($received > $due) {
            return response()->json([
                'error'  => sprintf(
                    'The receipt of %s exceeds the %s outstanding. Overpayments are handled as a credit note, not a match.',
                    number_format($received, 2), number_format($due, 2)
                ),
                'reason' => 'overpayment',
            ], 422);
        }

        $resolution = $data['resolution'] ?? 'short_paid';
        $shortfall = round($due - $received, 2);
        $adjustmentAccount = $shortfall > 0 ? $this->matcher->adjustmentAccountFor($resolution) : null;

        $period = $this->ledger->openPeriodFor($transaction->agent_id, now()->toDateString());

        if ($period === null) {
            return response()->json([
                'error'  => 'No open accounting period covers today, so this receipt cannot be posted.',
                'reason' => 'no_open_period',
            ], 422);
        }

        $result = DB::transaction(function () use (
            $transaction, $invoice, $received, $shortfall, $adjustmentAccount, $resolution, $period
        ) {
            // The race is decided in the database — see BankReconciliationService::claim.
            if (! $this->matcher->claim($transaction, $invoice)) {
                return null;
            }

            $this->ledger->write(
                $this->ledger->linesForReceipt($received, $adjustmentAccount, $shortfall),
                $transaction->agent_id, $period->id, $invoice->id, 'receipt'
            );

            // The invoice is closed when nothing is left owing — which, after a
            // write-off or a discount, is true even though less cash arrived.
            $paid = round((float) $invoice->amount_paid + $received, 2);
            $closed = $adjustmentAccount !== null || $paid >= (float) $invoice->grand_total;

            $invoice->update([
                'amount_paid' => $paid,
                'status'      => $closed ? 'paid' : 'partially_paid',
            ]);

            // `audit_logs` carries no metadata column, so the RESOLUTION is encoded in
            // the action itself — 'bank.matched.write_off' is queryable; a detail
            // stuffed into a column that does not exist is not recorded at all.
            $this->audit->record(
                $transaction->agent_id,
                $shortfall > 0 ? "bank.matched.{$resolution}" : 'bank.matched',
                'invoice', $invoice->id, auth()->id()
            );

            return $invoice->fresh();
        });

        if ($result === null) {
            return response()->json([
                'error'  => 'Another user reconciled this transaction first.',
                'reason' => 'already_reconciled',
            ], 409);
        }

        return response()->json([
            'invoice'     => $result,
            'transaction' => $transaction->fresh(),
            'shortfall'   => $shortfall,
            'resolution'  => $shortfall > 0 ? $resolution : null,
        ]);
    }

    /**
     * Unmatch — the bank row goes back to the queue.
     *
     * 🔴 The LEDGER IS NOT REWOUND. A posted receipt is reversed with a contra entry,
     * never by deleting rows: the audit trail has to show that we booked it and then
     * corrected it. This endpoint therefore refuses once a receipt has been posted,
     * rather than leaving a bank row that looks free while its journal still stands.
     */
    public function unmatch(BankTransaction $transaction): JsonResponse
    {
        $this->authorize('reconcile');

        if ($transaction->matched_invoice_id === null) {
            return response()->json([
                'error'  => 'This transaction is not matched to anything.',
                'reason' => 'not_matched',
            ], 422);
        }

        $posted = DB::table('accounts_ledger_entries')
            ->where('source_type', 'receipt')
            ->where('source_id', $transaction->matched_invoice_id)
            ->exists();

        if ($posted) {
            return response()->json([
                'error'  => 'This receipt is already in the ledger. Reverse it with a contra entry rather than unmatching.',
                'reason' => 'receipt_posted',
            ], 422);
        }

        $transaction->update([
            'matched_invoice_id'    => null,
            'reconciliation_status' => 'unreconciled',
        ]);

        return response()->json($transaction->fresh());
    }
}
