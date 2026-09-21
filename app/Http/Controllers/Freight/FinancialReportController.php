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
    public function __construct(private readonly \App\Services\AuditLogger $audit) {}

    /** Account-code prefixes. PRD.md §12 numbering: 1 assets, 2 liabilities, 4 revenue, 5 expense. */
    private const REVENUE = '4';
    private const EXPENSE = '5';
    private const ASSET = '1';
    private const LIABILITY = '2';

    public function periods(): JsonResponse
    {
        $this->authorize('viewFinancials');

        $context = UserContext::for(auth()->user());

        // One accounts login covers the company (user, 2026-09-18), so periods are listed per branch and the reports
        // take the branch with them. A period belongs to ONE branch: each files its own returns.
        $branches = DB::table('agents_info')->where('company_id', $context->companyId)->orderBy('agent_name')->get(['id', 'agent_name as name']);

        return response()->json([
            'periods' => DB::table('accounting_periods')
                ->whereIn('agent_id', $branches->pluck('id'))
                ->orderByDesc('start_date')
                ->get(['id', 'agent_id', 'period_name', 'start_date', 'end_date', 'status']),
            'branches' => $branches,
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

        // Scoped to the caller's own tenancy: their branch, or every branch of their company for accounts and the
        // Boss (user, 2026-09-18). A period id from another company is not theirs to report on, and ids are guessable.
        $period = DB::table('accounting_periods')
            ->where('id', $data['period_id'])
            ->whereIn('agent_id', $this->reachableBranches($context))
            ->first();

        if ($period === null) {
            return [null, response()->json([
                'error'  => 'That accounting period is not one of yours.',
                'reason' => 'period_not_found',
            ], 404)];
        }

        return [$period, null];
    }

    /** The branches this person may report on: every branch of the company for accounts and the Boss, else their own. */
    private function reachableBranches(UserContext $context): array
    {
        if (in_array($context->designation, ['accounts', 'boss'], true) && $context->companyId !== null) {
            return DB::table('agents_info')->where('company_id', $context->companyId)->pluck('id')->all();
        }

        return [$context->agentId];
    }

    /**
     * Opening a period, and closing one — 🔒 **accounts alone**, not even the Boss (PRD §2.4 "sole").
     *
     * 🔴 Closing is what stops anything else being posted into that month. A period with documents still waiting to
     * reach the ledger is NOT closed: they would have nowhere to go, and the month's figures would be wrong the
     * moment somebody posted them into the next one.
     */
    public function openPeriod(Request $request): JsonResponse
    {
        $this->authorize('managePeriods');
        $context = UserContext::for(auth()->user());

        $data = $request->validate([
            'agent_id' => 'required|integer',
            'period_name' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if (! in_array((int) $data['agent_id'], $this->reachableBranches($context), true)) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        $overlap = DB::table('accounting_periods')->where('agent_id', $data['agent_id'])
            ->where('start_date', '<=', $data['end_date'])->where('end_date', '>=', $data['start_date'])->first(['period_name']);

        if ($overlap !== null) {
            return response()->json(['error' => "Those dates are already covered by {$overlap->period_name}.",
                'reason' => 'overlaps'], 422);
        }

        $id = DB::table('accounting_periods')->insertGetId($data + ['status' => 'open', 'created_at' => now(), 'updated_at' => now()]);
        $this->audit->record((int) $data['agent_id'], 'period.opened', 'accounting_period', $id, auth()->id());

        return response()->json(DB::table('accounting_periods')->find($id), 201);
    }

    public function closePeriod(Request $request, int $periodId): JsonResponse
    {
        $this->authorize('managePeriods');
        $context = UserContext::for(auth()->user());

        $period = DB::table('accounting_periods')->where('id', $periodId)
            ->whereIn('agent_id', $this->reachableBranches($context))->first();

        if ($period === null) {
            return response()->json(['error' => 'That accounting period is not one of yours.', 'reason' => 'period_not_found'], 404);
        }

        if ($period->status !== 'open') {
            return response()->json(['error' => 'That period is already closed.', 'reason' => 'not_open'], 422);
        }

        $waiting = DB::table('unposted_transactions_queue as q')
            ->leftJoin('accounts_invoices as i', fn ($j) => $j->on('i.id', '=', 'q.source_id')->where('q.source_type', '=', 'invoice'))
            ->where('q.agent_id', $period->agent_id)
            ->whereBetween(DB::raw('COALESCE(i.document_date, DATE(q.created_at))'), [$period->start_date, $period->end_date])
            ->count();

        if ($waiting > 0) {
            return response()->json([
                'error' => "{$waiting} document(s) in this period have not reached the ledger. Post or void them before closing it.",
                'reason' => 'unposted_documents', 'unposted' => $waiting,
            ], 422);
        }

        DB::table('accounting_periods')->where('id', $periodId)->update([
            'status' => 'closed', 'closed_at' => now(), 'closed_by' => auth()->id(),
            // A month closed again after a reopen starts a clean sheet: the old reason describes the old close.
            'reopened_at' => null, 'reopened_by' => null, 'reopen_reason' => null,
            'updated_at' => now(),
        ]);
        $this->audit->record((int) $period->agent_id, 'period.closed', 'accounting_period', $periodId, auth()->id());

        return response()->json(DB::table('accounting_periods')->find($periodId));
    }

    /**
     * Reopen a closed month (PRD §251).
     *
     * 🔴 **ONLY THE MOST RECENTLY CLOSED MONTH OF THAT BRANCH.** Reopening an older one while newer ones stay
     * closed is how a ledger quietly goes wrong: every report for the later months was built on the arithmetic
     * of this one being final, and a rupee posted back into it now makes those months' opening figures a lie
     * without anything saying so. To reach an older month you reopen the ones after it first, in order, and see
     * each of those months become unfinal as you go.
     *
     * ⚠️ It needs a reason, and the reason stays on the period. "Reopened on the 11th because the airline's
     * September invoice arrived late" is what makes a reopened month defensible; an unexplained one is not.
     */
    public function reopenPeriod(Request $request, int $periodId): JsonResponse
    {
        $this->authorize('managePeriods');

        $data = $request->validate(['reason' => 'required|string|max:255']);

        $context = UserContext::for(auth()->user());
        $period = DB::table('accounting_periods')->where('id', $periodId)
            ->whereIn('agent_id', $this->reachableBranches($context))->first();

        if ($period === null) {
            return response()->json(['error' => 'That accounting period is not one of yours.',
                'reason' => 'period_not_found'], 404);
        }

        if ($period->status !== 'closed') {
            return response()->json(['error' => 'That period is already open.', 'reason' => 'not_closed'], 422);
        }

        $newer = DB::table('accounting_periods')->where('agent_id', $period->agent_id)
            ->where('status', 'closed')->where('start_date', '>', $period->start_date)
            ->orderBy('start_date')->first();

        if ($newer !== null) {
            return response()->json([
                'error' => sprintf(
                    '%s was closed after this one. Reopen it first — otherwise its opening figures would no '
                    . 'longer match what this month ends at.',
                    $newer->period_name
                ),
                'reason' => 'later_period_closed',
                'blocked_by' => $newer->period_name,
            ], 422);
        }

        DB::table('accounting_periods')->where('id', $periodId)->update([
            'status' => 'open', 'reopened_at' => now(), 'reopened_by' => auth()->id(),
            'reopen_reason' => $data['reason'], 'updated_at' => now(),
        ]);

        $this->audit->record((int) $period->agent_id, 'period.reopened', 'accounting_period', $periodId, auth()->id());

        return response()->json(DB::table('accounting_periods')->find($periodId));
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
