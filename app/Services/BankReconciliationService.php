<?php

namespace App\Services;

use App\AccountsInvoice;
use App\BankTransaction;
use Illuminate\Support\Facades\DB;

/**
 * The cash reconciler — guide §4.8, PRD.md §6.4.
 *
 * Matches bank credits against outstanding invoices and ranks the candidates by
 * confidence, so the accountant confirms a suggestion rather than searching a register.
 *
 * ═══ 🔴 WHAT THIS SERVICE CANNOT DO, AND WHY ════════════════════════════════
 *
 * PRD.md §6.4 specifies a TWO-LEVEL matching engine:
 *
 *   Level 1  regex for a job number or AWB in the WIRE MEMO
 *   Level 2  exact amount combined with CLIENT NAME or code
 *
 * `bank_transactions` (database_relations_tree.md #35) has SEVEN columns: id, agent_id,
 * the two match FKs, plaid_transaction_id, amount and reconciliation_status. There is
 * **no memo, no counterparty, no value date and no currency**.
 *
 * So Level 1 is not merely unimplemented — it is unimplementable against this schema,
 * and so is the realized-FX calculation, which needs a settlement date and a currency
 * to compare against the invoice's own. Amount is the only signal that survives.
 *
 * ⚠️ **This is deliberately NOT worked around by inventing columns.** The schema doc is
 * the authority for columns; adding a `memo` here would silently fork our schema from
 * the one the production database will be built from. Raised in GAPS.md instead, and a
 * three-column migration unblocks the rest of this file the day it is answered.
 *
 * The consequence to be honest about: on a day with several invoices of the same value,
 * amount alone cannot separate them, and the service says so by returning them all at
 * `medium` rather than promoting a guess to `high`.
 */
class BankReconciliationService
{
    /** Statuses that can still receive money. A paid or void invoice cannot. */
    private const SETTLEABLE = ['finalized', 'sent', 'partially_paid'];

    /** Under/overpayment within this fraction is a settlement, not a different invoice. */
    private const TOLERANCE = 0.02; // 2%

    /**
     * Candidate invoices for one bank credit, best first.
     *
     * Confidence is `high` ONLY when exactly one invoice matches the amount to the
     * paisa. Two invoices for the same amount are both `medium` — a coin flip
     * presented as a confident match is worse than no suggestion, because the
     * accountant stops checking.
     *
     * @return list<array{invoice: array, confidence: string, reason: string, variance: float}>
     */
    public function candidates(BankTransaction $transaction, int $limit = 10): array
    {
        $amount = round((float) $transaction->amount, 2);

        $open = AccountsInvoice::query()
            ->where('agent_id', $transaction->agent_id)
            ->whereIn('status', self::SETTLEABLE)
            ->with('customer:id,name,email_domain')
            ->get();

        $scored = [];

        foreach ($open as $invoice) {
            $due = round((float) $invoice->grand_total - (float) $invoice->amount_paid, 2);
            if ($due <= 0) {
                continue;
            }

            $variance = round($amount - $due, 2);
            $within = $due > 0 && abs($variance) <= round($due * self::TOLERANCE, 2);

            if ($variance == 0.0) {
                $scored[] = ['invoice' => $invoice, 'confidence' => 'exact', 'variance' => 0.0,
                             'reason' => 'The amount matches the balance exactly.'];
            } elseif ($within) {
                $scored[] = ['invoice' => $invoice, 'confidence' => 'medium', 'variance' => $variance,
                             'reason' => $variance < 0
                                 ? 'Short by ' . number_format(abs($variance), 2) . ' — within tolerance.'
                                 : 'Over by ' . number_format($variance, 2) . ' — within tolerance.'];
            }
        }

        // An `exact` match is only HIGH confidence if it is the ONLY one. See the docblock.
        $exact = array_values(array_filter($scored, fn ($c) => $c['confidence'] === 'exact'));
        $promote = count($exact) === 1;

        foreach ($scored as $i => $c) {
            $scored[$i]['confidence'] = $c['confidence'] === 'exact'
                ? ($promote ? 'high' : 'medium')
                : 'medium';

            if ($c['confidence'] === 'exact' && ! $promote) {
                $scored[$i]['reason'] = 'The amount matches exactly, but so does another invoice — '
                    . 'the memo would be needed to separate them, and the bank feed does not carry one.';
            }
        }

        usort($scored, fn ($a, $b) => [$a['confidence'] === 'high' ? 0 : 1, abs($a['variance'])]
                                  <=> [$b['confidence'] === 'high' ? 0 : 1, abs($b['variance'])]);

        return array_map(fn ($c) => [
            'invoice' => [
                'id'          => $c['invoice']->id,
                'invoice_no'  => $c['invoice']->invoice_no,
                'customer'    => $c['invoice']->customer ? $c['invoice']->customer->name : null,
                'grand_total' => $c['invoice']->grand_total,
                'amount_paid' => $c['invoice']->amount_paid,
                'balance'     => round((float) $c['invoice']->grand_total - (float) $c['invoice']->amount_paid, 2),
            ],
            'confidence' => $c['confidence'],
            'reason'     => $c['reason'],
            'variance'   => $c['variance'],
        ], array_slice($scored, 0, $limit));
    }

    /**
     * How a short settlement is closed — PRD.md §6.4.
     *
     * `short_paid` is the DEFAULT and the only one that leaves money owed. The other
     * two close the invoice and move the difference somewhere it can be reported on:
     * a bank charge is an expense we absorbed, a discount is revenue we gave up. Both
     * are decisions with a P&L consequence, which is why they are three explicit
     * choices rather than one "close it" button.
     */
    public const RESOLUTIONS = ['short_paid', 'write_off', 'discount'];

    /** The account a resolution debits, or NULL when nothing is written off. */
    public function adjustmentAccountFor(string $resolution): ?array
    {
        return match ($resolution) {
            'write_off' => LedgerPostingService::BANK_CHARGES,
            'discount'  => LedgerPostingService::SALES_ADJUSTMENTS,
            default     => null,
        };
    }

    /**
     * Has this bank row already been consumed?
     *
     * Checked before every match: the webhook and the 3-day fallback sweep both
     * deliver the same transaction, and while `plaid_transaction_id` is UNIQUE and
     * stops the row being ingested twice, nothing stops a human matching one row
     * against two invoices in two browser tabs.
     */
    public function isSettled(BankTransaction $transaction): bool
    {
        return $transaction->reconciliation_status !== 'unreconciled'
            || $transaction->matched_invoice_id !== null
            || $transaction->matched_voucher_id !== null;
    }

    /**
     * Claim the bank row for one invoice, atomically.
     *
     * 🔴 **`UPDATE … WHERE reconciliation_status = 'unreconciled'` — the race is
     * decided in the database**, exactly as the job-claim endpoint does it. Reading
     * then writing would let two accountants both see `unreconciled` and settle the
     * same money against two different invoices.
     *
     * @return bool false if someone else got there first.
     */
    public function claim(BankTransaction $transaction, AccountsInvoice $invoice): bool
    {
        return DB::table('bank_transactions')
            ->where('id', $transaction->id)
            ->where('reconciliation_status', 'unreconciled')
            ->whereNull('matched_invoice_id')
            ->update([
                'matched_invoice_id'    => $invoice->id,
                'reconciliation_status' => 'matched',
                'updated_at'            => now(),
            ]) === 1;
    }
}
