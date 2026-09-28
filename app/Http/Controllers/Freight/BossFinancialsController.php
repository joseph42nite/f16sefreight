<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * The Boss's money at a glance — PRD §6.8 (GAPS #419).
 *
 * Read from `financial_snapshots`, never summed live: the executive view must not scan the ledger the accountant is
 * posting into (PRD §2251). `snapshots:compute` refreshes it every 30 minutes, and the figures say how old they are —
 * past an hour the screen warns, because a stale cash figure is one a Boss acts on wrongly.
 *
 * 🔒 The Boss, on Command: money is a Command figure, and this is the executive view (PRD §337).
 */
class BossFinancialsController extends Controller
{
    /** Past this, the screen says the figures are old (PRD §6.8). */
    private const STALE_MINUTES = 60;

    private const FIGURES = ['total_receivables', 'total_payables', 'cash_on_hand', 'net_cash_flow', 'unbilled_revenue', 'accrued_expenses'];

    public function index(): JsonResponse
    {
        $this->authorize('viewFinancials');
        $context = UserContext::for(auth()->user());
        abort_unless($context->designation === 'boss', 403, 'This is the Boss\'s view.');

        $branches = DB::table('agents_info')->where('company_id', $context->companyId)->orderBy('agent_name')->get(['id', 'agent_name']);
        $latest = DB::table('financial_snapshots')->whereIn('agent_id', $branches->pluck('id'))
            ->groupBy('agent_id')->selectRaw('agent_id, MAX(snapshot_date) AS snapshot_date');
        $rows = DB::table('financial_snapshots as s')
            ->joinSub($latest, 'l', fn ($j) => $j->on('l.agent_id', '=', 's.agent_id')->on('l.snapshot_date', '=', 's.snapshot_date'))
            ->get(array_merge(['s.agent_id', 's.snapshot_date', 's.last_computed_at'], array_map(fn ($f) => "s.{$f}", self::FIGURES)))
            ->keyBy('agent_id');

        if ($rows->isEmpty()) {
            // Never computed is not "no money" — said as what it is, as the branch comparison does.
            return response()->json(['branches' => [], 'totals' => null, 'reason' => 'never_computed']);
        }

        $shaped = $branches->filter(fn ($b) => isset($rows[$b->id]))->map(function ($b) use ($rows) {
            $r = $rows[$b->id];

            return ['agent_id' => $b->id, 'branch' => $b->agent_name, 'as_of' => $r->last_computed_at]
                + collect(self::FIGURES)->mapWithKeys(fn ($f) => [$f => $r->{$f} === null ? null : (float) $r->{$f}])->all();
        })->values();

        $oldest = $shaped->min('as_of');

        return response()->json([
            'branches' => $shaped,
            // A figure no branch has measured stays NULL in the total too, never 0.
            'totals' => collect(self::FIGURES)->mapWithKeys(fn ($f) => [$f => $shaped->every(fn ($b) => $b[$f] === null)
                ? null : round($shaped->sum($f), 2)])->all(),
            'as_of' => $oldest,
            'stale' => $oldest !== null && Carbon::parse($oldest)->lt(now()->subMinutes(self::STALE_MINUTES)),
        ]);
    }
}
