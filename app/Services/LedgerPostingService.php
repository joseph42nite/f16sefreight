<?php

namespace App\Services;

use App\AccountsInvoice;
use App\AccountsPurchaseVoucher;
use Illuminate\Support\Facades\DB;

/**
 * The ledger poster — guide §4.8.
 *
 * ONE place that knows how a document becomes journal lines, for both sides of the
 * book. Invoices and purchase vouchers are mirror images of each other, and writing
 * them in two controllers is how the sell side ends up with a GST split the buy side
 * does not have.
 *
 * 🔴 **GST IS NEVER REVENUE AND NEVER EXPENSE.** Output tax is a LIABILITY owed to the
 * government; input tax is an ASSET reclaimable from it. Folding either into the P&L
 * overstates the business by exactly the tax and leaves the GST register disagreeing
 * with the documents it was built from. The sell side used to do precisely this, and
 * the ledger balanced perfectly while doing it — which is why the tests assert the
 * ACCOUNTS, not merely that debits equal credits.
 *
 * ⚠️ **A zero-tax document writes NO tax line at all**, rather than one for 0.00. An
 * export invoice has no output tax; a zero row in the GST register is a filing claim
 * we did not mean to make.
 */
class LedgerPostingService
{
    /** Sell side — PRD.md §12. */
    public const AR = ['code' => '1200-AR', 'name' => 'Accounts Receivable'];
    public const REVENUE = ['code' => '4000-Freight-Revenue', 'name' => 'Freight Revenue'];
    public const GST_OUTPUT = ['code' => '2200-GST-Output', 'name' => 'GST Output'];

    /** Buy side. */
    public const AP = ['code' => '2100-AP', 'name' => 'Accounts Payable'];
    public const COST = ['code' => '5000-Direct-Costs', 'name' => 'Direct Costs'];
    public const GST_INPUT = ['code' => '1300-GST-Input', 'name' => 'GST Input Credit'];

    /**
     * Settlement — §6.4.
     *
     * ❓ PRD.md names `5500-Forex-Gain-Loss` and `4900-Sales-Adjustments` explicitly
     * but never names the cash or bank-charge accounts. `1100-Bank` and
     * `5100-Bank-Charges` are OUR defaults, chosen to sit in the same numbering
     * bands, and the chart is user-editable in /settings/finance — but they are
     * defaults, not doc-derived. Flagged in GAPS.md rather than presented as spec.
     */
    public const BANK = ['code' => '1100-Bank', 'name' => 'Bank'];
    public const BANK_CHARGES = ['code' => '5100-Bank-Charges', 'name' => 'Bank Charges'];
    public const SALES_ADJUSTMENTS = ['code' => '4900-Sales-Adjustments', 'name' => 'Sales Adjustments'];
    public const FOREX = ['code' => '5500-Forex-Gain-Loss', 'name' => 'Forex Gain / Loss'];

    /**
     * The journal for a sales document.
     *
     *   Dr  1200-AR                grand total
     *   Cr  4000-Freight-Revenue   subtotal
     *   Cr  2200-GST-Output        tax
     *
     * @return list<array{code: string, name: string, debit: float, credit: float}>
     */
    public function linesForInvoice(AccountsInvoice $invoice): array
    {
        return $this->lines(
            debit: [self::AR, round((float) $invoice->grand_total, 2)],
            credit: [self::REVENUE, round((float) $invoice->subtotal, 2)],
            tax: [self::GST_OUTPUT, round((float) $invoice->tax_amount, 2), 'credit'],
        );
    }

    /**
     * The journal for a purchase voucher — the MIRROR of the sales one.
     *
     *   Dr  5000-Direct-Costs      net of tax
     *   Dr  1300-GST-Input         tax          <- an ASSET: reclaimable input credit
     *   Cr  2100-AP                gross
     *
     * ⚠️ Totals come from the ITEMS. A voucher has no header totals in the schema at
     * all — `accounts_purchase_vouchers` carries only status and dates — so summing
     * the lines is not a defensive recomputation here, it is the only source there is.
     */
    public function linesForVoucher(AccountsPurchaseVoucher $voucher): array
    {
        $net = round((float) $voucher->items()->sum('amount'), 2);
        $tax = round((float) $voucher->items()->sum('tax_amount'), 2);

        return $this->lines(
            debit: [self::COST, $net],
            credit: [self::AP, round($net + $tax, 2)],
            tax: [self::GST_INPUT, $tax, 'debit'],
        );
    }

    /**
     * Assemble a two- or three-line journal.
     *
     * The tax line's SIDE differs between the two documents — output tax is credited,
     * input tax is debited — so it is a parameter rather than an assumption.
     */
    private function lines(array $debit, array $credit, array $tax): array
    {
        [$drAccount, $drAmount] = $debit;
        [$crAccount, $crAmount] = $credit;
        [$taxAccount, $taxAmount, $taxSide] = $tax;

        $lines = [
            $drAccount + ['debit' => $drAmount, 'credit' => 0.0],
            $crAccount + ['debit' => 0.0, 'credit' => $crAmount],
        ];

        if ($taxAmount > 0) {
            $lines[] = $taxSide === 'debit'
                ? $taxAccount + ['debit' => $taxAmount, 'credit' => 0.0]
                : $taxAccount + ['debit' => 0.0, 'credit' => $taxAmount];
        }

        return $lines;
    }

    /**
     * A receipt: cash in, receivable down.
     *
     *   Dr  1100-Bank              amount received
     *   Cr  1200-AR                amount received
     *
     * `$adjustment` closes the REST of an invoice that was settled short — a
     * write-off to bank charges, or a discount. It is a separate debit rather than a
     * smaller AR credit, because the receivable really did clear in full and the
     * difference really was an expense: netting them hides the cost entirely.
     */
    public function linesForReceipt(float $received, ?array $adjustmentAccount = null, float $adjustment = 0.0): array
    {
        $lines = [
            self::BANK + ['debit' => round($received, 2), 'credit' => 0.0],
        ];

        if ($adjustmentAccount !== null && $adjustment > 0) {
            $lines[] = $adjustmentAccount + ['debit' => round($adjustment, 2), 'credit' => 0.0];
        }

        $lines[] = self::AR + ['debit' => 0.0, 'credit' => round($received + ($adjustmentAccount !== null ? $adjustment : 0.0), 2)];

        return $lines;
    }

    /** Debits, credits and whether they agree — the summary a preview needs. */
    public function summarise(array $lines): array
    {
        $debits = round(array_sum(array_column($lines, 'debit')), 2);
        $credits = round(array_sum(array_column($lines, 'credit')), 2);

        return [
            'lines'    => $lines,
            'debits'   => $debits,
            'credits'  => $credits,
            'balanced' => $debits === $credits,
        ];
    }

    /**
     * The open period covering a document date, or NULL.
     *
     * 🔒 **The posting gate.** A document dated inside a closed period cannot be
     * posted — that is the whole point of closing one. Reopening is `accounts`-only
     * and audit-logged.
     */
    public function openPeriodFor(int $agentId, $documentDate): ?object
    {
        return DB::table('accounting_periods')
            ->where('agent_id', $agentId)
            ->where('status', 'open')
            ->whereDate('start_date', '<=', $documentDate)
            ->whereDate('end_date', '>=', $documentDate)
            ->first();
    }

    /**
     * Write the journal.
     *
     * 🔴 **Refuses to write an unbalanced journal.** The balance is a service-layer
     * invariant — no database constraint can express "these rows sum to zero" — so
     * this is the only place it can be enforced. A half-written journal is worse than
     * a refused one: it balances the trial balance against nothing.
     *
     * MUST be called inside a transaction by the caller, so the document's own status
     * change and its journal commit or fail together.
     */
    public function write(array $lines, int $agentId, int $periodId, int $sourceId, string $sourceType): void
    {
        $summary = $this->summarise($lines);

        if (! $summary['balanced']) {
            throw new \RuntimeException(sprintf(
                'Refusing to post an unbalanced journal for %s #%d: %s debits against %s credits.',
                $sourceType, $sourceId, $summary['debits'], $summary['credits']
            ));
        }

        foreach ($lines as $line) {
            DB::table('accounts_ledger_entries')->insert([
                'agent_id'             => $agentId,
                'chart_of_account_id'  => $this->accountId($agentId, $line['code'], $line['name']),
                'accounting_period_id' => $periodId,
                'posting_date'         => now()->toDateString(),
                'debit_amount'         => $line['debit'],
                'credit_amount'        => $line['credit'],
                'source_id'            => $sourceId,
                'source_type'          => $sourceType, // morph key, never a class name
                'created_at'           => now(),
                'updated_at'           => now(),
            ]);
        }

        DB::table('unposted_transactions_queue')
            ->where('source_type', $sourceType)->where('source_id', $sourceId)->delete();
    }

    /**
     * Resolve one account, creating it on first use so posting is never blocked by
     * missing setup. A real chart is configured in /settings/finance by accounts.
     */
    public function accountId(int $agentId, string $code, string $name): int
    {
        $id = DB::table('chart_of_accounts')
            ->where('agent_id', $agentId)->where('account_code', $code)->value('id');

        return $id ?: DB::table('chart_of_accounts')->insertGetId([
            'agent_id' => $agentId, 'account_code' => $code, 'account_name' => $name,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
}
