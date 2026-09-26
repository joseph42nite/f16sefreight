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

    /**
     * Brokerage and consol — PRD §6.2 documents 4 and 5. A commission receivable is not an ordinary trade
     * receivable and an agent is not a client, so neither shares `1200-AR`: collapsing them would put agent
     * balances into the customer ageing and the credit gate.
     */
    public const COMMISSION_RECEIVABLE = ['code' => '1210-Commission-Receivable', 'name' => 'Commission Receivable'];
    public const COMMISSION_REVENUE = ['code' => '4800-Commission-Revenue', 'name' => 'Commission Revenue'];
    public const AR_AGENTS = ['code' => '1220-AR-Agents', 'name' => 'Accounts Receivable — Agents'];
    public const CONSOL_REVENUE = ['code' => '4050-Consol-Revenue', 'name' => 'Consol Revenue'];
    /**
     * General billing — revenue with no shipment behind it (user, 2026-09-26). Kept out of `4000-Freight-Revenue` so
     * the P&L shows freight as freight, and so the revenue profitability explains by shipment can be told apart
     * from the revenue it cannot.
     */
    public const OTHER_REVENUE = ['code' => '4100-Other-Operating-Revenue', 'name' => 'Other Operating Revenue'];

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
        $gross = round((float) $invoice->grand_total, 2);
        $net = round((float) $invoice->subtotal, 2);
        $tax = round((float) $invoice->tax_amount, 2);

        // 🔴 A CREDIT NOTE IS THE MIRROR, NOT A NEGATIVE INVOICE. Posting it as an invoice with minus signs
        // balances just as well and reports as negative revenue, which is not what happened: the sale stood and
        // an adjustment was made against it. PRD §6.2 names the accounts.
        if ($invoice->type === 'credit_note') {
            return $this->lines(
                debit: [self::SALES_ADJUSTMENTS, $net],
                credit: [self::AR, $gross],
                tax: [self::GST_OUTPUT, $tax, 'debit'],
            );
        }

        // Who owes it and what earned it differ by document; the shape does not.
        [$receivable, $revenue] = match (true) {
            $invoice->type === 'brokerage' => [self::COMMISSION_RECEIVABLE, self::COMMISSION_REVENUE],
            $invoice->type === 'consol_invoice' => [self::AR_AGENTS, self::CONSOL_REVENUE],
            // No shipment behind it: the same client receivable, a different revenue line. A debit note on a
            // general invoice carries the parent's NULL job, so it lands here too.
            $invoice->job_id === null => [self::AR, self::OTHER_REVENUE],
            default => [self::AR, self::REVENUE],   // invoice and debit note both bill the client
        };

        return $this->lines(
            debit: [$receivable, $gross],
            credit: [$revenue, $net],
            tax: [self::GST_OUTPUT, $tax, 'credit'],
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
    public function linesForReceipt(float $received, array $adjustments = [], ?\App\BankAccount $into = null): array
    {
        $lines = [
            $this->bank($into) + ['debit' => round($received, 2), 'credit' => 0.0],
        ];

        // 🔴 **ONE LEG PER RESOLUTION, not one lump.** A receipt can close three invoices three different
        // ways at once — one short-paid and written off as a bank charge, one discounted, one settled net of
        // the TDS the client deducted — and those are an expense, a reduction of revenue, and an asset. They
        // land in three different places on the P&L and the balance sheet. Summing them into a single
        // adjustment account, which is what this did, put a bank charge into Sales Adjustments and would have
        // put recoverable tax there too.
        $adjusted = 0.0;

        foreach ($adjustments as $adjustment) {
            $amount = round((float) $adjustment['amount'], 2);

            if ($amount <= 0.0) {
                continue;
            }

            $lines[] = $adjustment['account'] + ['debit' => $amount, 'credit' => 0.0];
            $adjusted = round($adjusted + $amount, 2);
        }

        $lines[] = self::AR + ['debit' => 0.0, 'credit' => round($received + $adjusted, 2)];

        return $lines;
    }

    /**
     * A payment: payable down, cash out. The exact mirror of a receipt.
     *
     *   Dr  2100-AP                amount paid
     *   Cr  1100-Bank              amount paid
     *
     * ⚠️ No adjustment leg. A supplier settled SHORT is a dispute, not a write-off we take silently — it stays on
     * the voucher as an outstanding balance and goes through the statement comparison, where somebody argues it.
     */
    public function linesForPayment(float $paid, ?\App\BankAccount $from = null, float $tds = 0.0): array
    {
        $tds = round(max(0.0, $tds), 2);

        $lines = [
            // 🔴 The payable comes down by the GROSS. The supplier's invoice really is settled in full — the
            // withheld part was paid to the government in their name, not kept — so crediting AP with only
            // the cash would leave every voucher we deduct from looking part-paid forever.
            self::AP + ['debit' => round($paid, 2), 'credit' => 0.0],
            $this->bank($from) + ['debit' => 0.0, 'credit' => round($paid - $tds, 2)],
        ];

        if ($tds > 0.0) {
            // A LIABILITY, not an expense: we are holding the government's money until the challan is paid.
            $lines[] = \App\Services\TdsService::PAYABLE + ['debit' => 0.0, 'credit' => $tds];
        }

        return $lines;
    }

    /**
     * Which bank the money moved through.
     *
     * 🔴 **Each bank account has its own ledger code** — `1100-Bank-HDFC-4321` — so the trial balance shows them
     * apart, which is the whole reason the master exists. ⚠️ The bare `1100-Bank` remains the fallback for
     * everything posted before the master existed: history is not rewritten, and an entry with no account named
     * is honestly "the bank", not a guess at which one.
     */
    private function bank(?\App\BankAccount $account): array
    {
        return $account === null
            ? self::BANK
            : ['code' => $account->account_code, 'name' => trim($account->bank_name . ' — ' . $account->name, ' —')];
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
     * The GST register row itself — PRD.md §7. Both directions call this with a split
     * already worked out by `GstSplitService`: `InvoiceController` resolves the
     * counterparty from the billed party, `PurchaseVoucherController` from the vendor —
     * this only writes what they decided, the same "dumb executor" split as `write()`
     * above (2026-09-26, GAPS #396: purchase vouchers previously never wrote a row at
     * all, though PRD §1555 says they should — 3B's ITC was computed from the vouchers
     * directly so the figure was right, but the register was outward-only).
     *
     * 🔴 Written only when the split is DETERMINABLE. See `GstSplitService`: an
     * undeterminable split does not affect what anybody is billed, but filing it under
     * the wrong heads — or under invented heads — means a counterparty cannot claim the
     * credit they paid, so a row is better absent (visible, fixable before filing) than
     * present and guessed.
     */
    public function writeGstRegisterRow(int $agentId, string $voucherType, int $voucherId, array $split): void
    {
        if (! $split['determinable'] || $split['kind'] === 'none') {
            return;
        }

        $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');

        DB::table('gst_ledger_entries')->insert([
            'agent_id'     => $agentId,
            'company_id'   => $companyId,
            'voucher_id'   => $voucherId,
            'voucher_type' => $voucherType,
            'cgst_amount'  => $split['cgst'],
            'sgst_amount'  => $split['sgst'],
            'igst_amount'  => $split['igst'],
            'created_at'   => now(), 'updated_at' => now(),
        ]);
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
