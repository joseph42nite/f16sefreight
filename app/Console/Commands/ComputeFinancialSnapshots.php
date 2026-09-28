<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * `financial_snapshots` — guide Step 7, PRD.md §6.8.
 *
 *     php artisan snapshots:compute        (every 30 minutes)
 *
 * ═══ 🔴 SO EXECUTIVE DASHBOARDS NEVER SCAN THE RAW LEDGER ═══════════════════
 * The same rule as the sales engine (PRD.md §2242), for the same reason: a P&L that
 * aggregates `accounts_ledger_entries` live gets slower every month the business
 * trades, and it competes with the accountant posting into it.
 *
 * ⚠️ **Thirty minutes, not nightly.** Receivables move during the working day, and a
 * cash figure that is up to 24 hours stale is one a Boss will act on wrongly. The
 * dashboards show a staleness banner past one hour, which is why the cadence has to be
 * comfortably inside that.
 *
 * ═══ 🔴 UNBILLED REVENUE IS THE ONE FIGURE THAT MATTERS MOST ════════════════
 * Completed jobs carrying no invoice — money the branch has EARNED and not asked for.
 * It is the leakage number, and it is invisible in every other report precisely because
 * nothing was ever raised for it.
 */
class ComputeFinancialSnapshots extends Command
{
    protected $signature = 'snapshots:compute {--agent= : Limit to one branch}';

    protected $description = 'Pre-aggregate daily financial indicators so dashboards never scan the ledger';

    /** Money genuinely owed — the ageing's own list, so the two can never disagree about what is owed. */
    private const OUTSTANDING = \App\Services\AgeingService::OWED;

    public function handle(): int
    {
        $date = now()->startOfDay();

        $branches = DB::table('agents_info')
            ->when($this->option('agent'), fn ($q) => $q->where('id', $this->option('agent')))
            ->pluck('id');

        foreach ($branches as $agentId) {
            $this->snapshot((int) $agentId, $date);
        }

        $this->info("  {$branches->count()} branch snapshot(s) written for " . $date->toDateString() . '.');

        return self::SUCCESS;
    }

    private function snapshot(int $agentId, Carbon $date): void
    {
        $receivables = $this->receivables($agentId);
        $payables = $this->payables($agentId);

        DB::table('financial_snapshots')->updateOrInsert(
            ['agent_id' => $agentId, 'snapshot_date' => $date->toDateString()],
            [
                // The period the snapshot FALLS IN, so a closed period's snapshot stays
                // attributable after the fact. NULL when no period covers today —
                // ON DELETE SET NULL on the column says a snapshot outlives its period.
                'accounting_period_id' => $this->periodFor($agentId, $date),
                'total_receivables'    => $receivables,
                'total_payables'       => $payables,
                'cash_on_hand'         => $this->cashOnHand($agentId),
                'net_cash_flow'        => $this->netCashFlow($agentId, $date),
                'unbilled_revenue'     => $this->unbilledRevenue($agentId),
                // NULL, "not measured" — never the payables figure again under another name (GAPS #419).
                'accrued_expenses'     => null,
                'last_computed_at'     => now(),
                'updated_at'           => now(),
                'created_at'           => now(),
            ]
        );
    }

    /**
     * What clients and partners owe, in rupees — as the ageing counts it (GAPS #419): a credit note SUBTRACTS (this
     * added it), and each bill converts at its own rate (this counted USD at face value).
     */
    private function receivables(int $agentId): float
    {
        return round((float) DB::table('accounts_invoices')
            ->where('agent_id', $agentId)
            ->whereIn('status', self::OUTSTANDING)
            ->sum(DB::raw("CASE WHEN type = 'credit_note' THEN -1 ELSE 1 END * (grand_total - amount_paid) * exchange_rate")), 2);
    }

    /**
     * What we owe vendors.
     *
     * ⚠️ Summed from the ITEMS. `accounts_purchase_vouchers` carries no header total at
     * all, so this is not a defensive recomputation — it is the only source there is.
     */
    private function payables(int $agentId): float
    {
        // 🔴 What is still OWED on each — gross less what was paid (a part-paid bill counted in full), and under the
        // status payments actually write: `part_paid`. `partially_paid` is an invoice's word, and no voucher ever
        // carried it, so part-paid bills vanished from the figure altogether (GAPS #419).
        $gross = DB::table('accounts_purchase_items')->selectRaw('purchase_voucher_id, SUM(net_amount) AS gross')
            ->groupBy('purchase_voucher_id');

        return round((float) DB::table('accounts_purchase_vouchers as v')
            ->joinSub($gross, 'g', 'g.purchase_voucher_id', '=', 'v.id')
            ->where('v.agent_id', $agentId)
            ->whereIn('v.status', ['unpaid', 'part_paid'])
            ->sum(DB::raw('GREATEST(g.gross - v.amount_paid, 0)')), 2);
    }

    /** The bank balance as the ledger sees it: debits to cash minus credits. */
    private function cashOnHand(int $agentId): float
    {
        $row = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.agent_id', $agentId)
            // Every bank account — `1100-Bank` and each named one (`1100-Bank-HDFC-4321`, GAPS #386). The exact code
            // alone missed all money that moved through a named account (GAPS #419).
            ->where('c.account_code', 'like', '1100-Bank%')
            ->selectRaw('COALESCE(SUM(l.debit_amount),0) AS dr, COALESCE(SUM(l.credit_amount),0) AS cr')
            ->first();

        return round((float) $row->dr - (float) $row->cr, 2);
    }

    /** Cash in minus cash out, this month only — a flow, not a balance. */
    private function netCashFlow(int $agentId, Carbon $date): float
    {
        $row = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.agent_id', $agentId)
            ->where('c.account_code', 'like', '1100-Bank%')
            ->whereDate('l.posting_date', '>=', $date->copy()->startOfMonth())
            ->selectRaw('COALESCE(SUM(l.debit_amount),0) AS dr, COALESCE(SUM(l.credit_amount),0) AS cr')
            ->first();

        return round((float) $row->dr - (float) $row->cr, 2);
    }

    /**
     * 🔴 THE LEAKAGE NUMBER. Completed jobs with no invoice at all — work delivered and
     * never billed. It appears in no other report, because nothing was ever raised for
     * it to appear on.
     *
     * Valued at the ENQUIRY's quoted amount, which is the only figure that exists for a
     * job nobody invoiced. A job with no quote contributes 0 to the value but is still
     * counted as leakage elsewhere — the alternative is inventing a price.
     */
    private function unbilledRevenue(int $agentId): float
    {
        return round((float) DB::table('jobs as j')
            ->leftJoin('enquiries as e', 'e.id', '=', 'j.enquiry_id')
            ->where('j.agent_id', $agentId)
            ->where('j.status', 'Completed')
            ->whereNull('j.deleted_at')
            // Billed means ASKED FOR: a draft is not (GAPS #419) — it sat in "billed" while no client had seen a bill.
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))
                ->from('accounts_invoices')
                ->whereColumn('accounts_invoices.job_id', 'j.id')
                ->whereNotIn('accounts_invoices.status', ['draft', 'void']))
            // The quote is in rupees here; a quote in another currency is not added at face value, so it is left out.
            ->where(fn ($q) => $q->whereNull('e.quoted_currency')->orWhereIn('e.quoted_currency', ['', 'INR']))
            ->sum(DB::raw('COALESCE(e.quoted_amount, 0)')), 2);
    }

    private function periodFor(int $agentId, Carbon $date): ?int
    {
        return DB::table('accounting_periods')
            ->where('agent_id', $agentId)
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date)
            ->value('id');
    }
}
