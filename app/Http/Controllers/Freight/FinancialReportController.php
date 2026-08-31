<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * P&L · Balance Sheet · Trial Balance — PRD.md §6.8, guide Step 7.
 *
 * ═══ 🔴 STRICT PERIOD LOCKOUT ══════════════════════════════════════════════
 * A report is only ever run over CLOSED-or-open periods that exist, and a request for a
 * date range with no period behind it is REFUSED rather than answered from whatever
 * rows happen to fall in it.
 *
 * The reason is that a period is the unit an accountant signs off. Producing a P&L for
 * "1–15 August" — half a period — gives a number nobody can reconcile against anything
 * they have ever filed, and it will be believed because it looks like a report.
 *
 * ═══ ⚠️ THESE READ THE LEDGER, AND THAT IS CORRECT ══════════════════════════
 * PRD.md §2242 forbids live aggregation for DASHBOARDS, and `financial_snapshots`
 * exists so the executive view never scans the ledger. A trial balance is the opposite
 * case: it is an audit artefact whose entire purpose is to prove the ledger balances,
 * so reading a pre-aggregate would defeat it. Run rarely, read directly.
 *
 * 🔒 `viewFinancials` — accounts and boss, Command tier.
 */
class FinancialReportController extends Controller
{
    /** Account-code prefixes. PRD.md §12 numbering: 1 assets, 2 liabilities, 4 revenue, 5 expense. */
    private const REVENUE = '4';
    private const EXPENSE = '5';
    private const ASSET = '1';
    private const LIABILITY = '2';

    public function periods(): JsonResponse
    {
        $this->authorize('viewFinancials');

        $context = UserContext::for(auth()->user());

        return response()->json([
            'periods' => DB::table('accounting_periods')
                ->where('agent_id', $context->agentId)
                ->orderByDesc('start_date')
                ->get(['id', 'period_name', 'start_date', 'end_date', 'status']),
        ]);
    }

    /**
     * Profit & Loss — revenue credits minus expense debits.
     *
     * ⚠️ Signed by NATURE, not by column. A revenue account's balance is credits minus
     * debits; an expense account's is debits minus credits. Summing raw debit and credit
     * columns across both would report a loss on a profitable month.
     */
    public function profitAndLoss(Request $request): JsonResponse
    {
        [$period, $error] = $this->resolvePeriod($request);
        if ($error) {
            return $error;
        }

        $rows = $this->balances($period);

        $revenue = $rows->filter(fn ($r) => str_starts_with($r->account_code, self::REVENUE))
            ->map(fn ($r) => ['code' => $r->account_code, 'name' => $r->account_name,
                              'amount' => round((float) $r->cr - (float) $r->dr, 2)])
            ->values();

        $expense = $rows->filter(fn ($r) => str_starts_with($r->account_code, self::EXPENSE))
            ->map(fn ($r) => ['code' => $r->account_code, 'name' => $r->account_name,
                              'amount' => round((float) $r->dr - (float) $r->cr, 2)])
            ->values();

        $totalRevenue = round($revenue->sum('amount'), 2);
        $totalExpense = round($expense->sum('amount'), 2);

        return response()->json([
            'period'  => $period,
            'revenue' => ['lines' => $revenue, 'total' => $totalRevenue],
            'expense' => ['lines' => $expense, 'total' => $totalExpense],
            'net'     => round($totalRevenue - $totalExpense, 2),
            // 🔴 NULL, never 0%, on no revenue. A period that billed nothing has no
            // margin; reporting 0% would read as "we broke even", which is a claim.
            'margin_pct' => $totalRevenue <= 0.0 ? null : round((($totalRevenue - $totalExpense) / $totalRevenue) * 100, 2),
        ]);
    }

    /** Balance sheet — assets, liabilities, and what the difference implies. */
    public function balanceSheet(Request $request): JsonResponse
    {
        [$period, $error] = $this->resolvePeriod($request);
        if ($error) {
            return $error;
        }

        $rows = $this->balances($period);

        $assets = $rows->filter(fn ($r) => str_starts_with($r->account_code, self::ASSET))
            ->map(fn ($r) => ['code' => $r->account_code, 'name' => $r->account_name,
                              'amount' => round((float) $r->dr - (float) $r->cr, 2)])
            ->values();

        $liabilities = $rows->filter(fn ($r) => str_starts_with($r->account_code, self::LIABILITY))
            ->map(fn ($r) => ['code' => $r->account_code, 'name' => $r->account_name,
                              'amount' => round((float) $r->cr - (float) $r->dr, 2)])
            ->values();

        $totalAssets = round($assets->sum('amount'), 2);
        $totalLiabilities = round($liabilities->sum('amount'), 2);

        return response()->json([
            'period'      => $period,
            'assets'      => ['lines' => $assets, 'total' => $totalAssets],
            'liabilities' => ['lines' => $liabilities, 'total' => $totalLiabilities],
            // Retained earnings as the residual — this is the accounting identity, not
            // an equity ledger, and calling it that would overstate what it is.
            'equity'      => round($totalAssets - $totalLiabilities, 2),
        ]);
    }

    /**
     * Trial balance — every account, proving total debits equal total credits.
     *
     * 🔴 **`balanced` IS THE WHOLE REPORT.** An accountant runs this to answer one
     * question before an audit. If it is false, the ledger has a one-sided entry and no
     * other report from that period can be trusted — so the flag is reported alongside
     * the exact difference rather than left for the reader to subtract.
     */
    public function trialBalance(Request $request): JsonResponse
    {
        [$period, $error] = $this->resolvePeriod($request);
        if ($error) {
            return $error;
        }

        $rows = $this->balances($period);

        $debits = round($rows->sum(fn ($r) => (float) $r->dr), 2);
        $credits = round($rows->sum(fn ($r) => (float) $r->cr), 2);

        return response()->json([
            'period'   => $period,
            'accounts' => $rows->map(fn ($r) => [
                'code' => $r->account_code, 'name' => $r->account_name,
                'debit' => round((float) $r->dr, 2), 'credit' => round((float) $r->cr, 2),
            ])->values(),
            'totals'   => ['debit' => $debits, 'credit' => $credits],
            'balanced' => $debits === $credits,
            'difference' => round($debits - $credits, 2),
        ]);
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    /**
     * 🔴 THE LOCKOUT. A report runs over a PERIOD, never a free date range.
     *
     * @return array{0: ?object, 1: ?JsonResponse}
     */
    private function resolvePeriod(Request $request): array
    {
        $this->authorize('viewFinancials');

        $context = UserContext::for(auth()->user());

        $data = $request->validate(['period_id' => 'required|integer']);

        $period = DB::table('accounting_periods')
            ->where('id', $data['period_id'])
            // Scoped to the caller's branch: a period id from another branch is not
            // theirs to report on, and ids are guessable.
            ->where('agent_id', $context->agentId)
            ->first();

        if ($period === null) {
            return [null, response()->json([
                'error'  => 'That accounting period is not on this branch.',
                'reason' => 'period_not_found',
            ], 404)];
        }

        return [$period, null];
    }

    /**
     * Debit and credit totals per account, for one period.
     *
     * Scoped by `accounting_period_id`, NOT by posting date. An entry posted late but
     * belonging to an earlier period must appear in that period's report — which is
     * exactly why the ledger carries the period as a foreign key rather than relying on
     * a date range.
     */
    private function balances(object $period)
    {
        return DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.accounting_period_id', $period->id)
            ->selectRaw('c.account_code, c.account_name,
                         COALESCE(SUM(l.debit_amount),0) AS dr,
                         COALESCE(SUM(l.credit_amount),0) AS cr')
            ->groupBy('c.account_code', 'c.account_name')
            ->orderBy('c.account_code')
            ->get();
    }
}
