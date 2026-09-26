<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\ProfitabilityService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Sales targets for the Boss (PRD §2.3; user, 2026-09-15): each branch, each month, each transport mode — revenue,
 * tonnage and shipments — against what the branch has done so far and where it is heading by month end.
 *
 * Actuals are the rollup's month-to-date for the clients each branch manages, the same figures as the branch
 * comparison above it. Revenue is a Command figure: Tactical has no invoicing, so it has no revenue target.
 * Each branch also gets an "all modes" total, where general billing — no shipment, so no mode — counts (GAPS #404).
 * 🔒 Only the Boss sets targets — "the role that sets targets must not book the revenue they are measured in".
 */
class SalesTargetController extends Controller
{
    private const MODES = ['air', 'sea'];

    public function index(Request $request): JsonResponse
    {
        $context = $this->boss();
        $month = $this->month($request->input('month'));
        $withRevenue = $context->tierAtLeast('command');

        $branches = DB::table('agents_info')->where('company_id', $context->companyId)->orderBy('branch_code')->get(['id', 'agent_name', 'branch_code']);
        $targets = DB::table('sales_targets')->where('company_id', $context->companyId)->where('period_month', $month->toDateString())
            ->get()->keyBy(fn ($t) => $t->agent_id . '|' . $t->transport_mode);

        // The rollup's latest day in that month: month-to-date as of then.
        $asOf = DB::table('customer_performance_snapshots')->whereIn('agent_id', $branches->pluck('id'))
            ->whereBetween('snapshot_date', [$month->toDateString(), $month->copy()->endOfMonth()->toDateString()])
            ->max('snapshot_date');

        $actuals = $asOf === null ? collect() : DB::table('customer_performance_snapshots')
            ->whereIn('agent_id', $branches->pluck('id'))->where('snapshot_date', $asOf)
            ->groupBy('agent_id', 'transport_mode')
            ->get(['agent_id', 'transport_mode', DB::raw('SUM(revenue_mtd) AS revenue'), DB::raw('SUM(tonnage_mtd) AS tonnage'), DB::raw('SUM(shipment_count_mtd) AS shipments')])
            ->keyBy(fn ($a) => $a->agent_id . '|' . $a->transport_mode);

        // Month-end pace = so far ÷ days gone × days in the month; only while the month is still running.
        $pace = $asOf !== null && Carbon::parse($asOf)->isSameMonth(now())
            ? $month->daysInMonth / Carbon::parse($asOf)->day
            : null;

        // General billing — a bill not for a shipment — has no mode, so it counts toward the branch total below and
        // never toward air or sea (user, 2026-09-26). To the rollup's day, the same month to date as the rest.
        $general = $withRevenue ? app(ProfitabilityService::class)->generalByBranch($branches->pluck('id')->all(),
            $month->toDateString(), $asOf ?? $month->copy()->endOfMonth()->toDateString()) : [];

        $columns = collect(['shipments' => 'shipments', 'tonnage' => 'tonnage_kg', 'revenue' => 'revenue_inr'])
            ->reject(fn ($col, $key) => $key === 'revenue' && ! $withRevenue);
        $measure = fn (?float $target, ?float $actual) => [
            'target' => $target,
            'actual' => $actual,
            'percent' => $target && $actual !== null ? round($actual * 100 / $target, 1) : null,
            'month_end' => $pace !== null && $actual !== null ? round($actual * $pace, 2) : null,
        ];

        $rows = [];
        foreach ($branches as $b) {
            $byMode = [];
            foreach (self::MODES as $mode) {
                $t = $targets[$b->id . '|' . $mode] ?? null;
                $a = $actuals[$b->id . '|' . $mode] ?? null;

                $byMode[] = $rows[] = [
                    'agent_id' => $b->id, 'branch' => $b->agent_name, 'code' => $b->branch_code, 'mode' => $mode,
                    'measures' => $columns->map(fn ($col, $key) => $measure(
                        $t && $t->{$col} !== null ? (float) $t->{$col} : null,
                        $a ? round((float) $a->{$key}, 2) : null,
                    )),
                ];
            }

            // The branch as a whole: its mode targets summed, and on revenue what it billed not for a shipment.
            $billedGeneral = $general[$b->id] ?? 0.0;
            $rows[] = [
                'agent_id' => $b->id, 'branch' => $b->agent_name, 'code' => $b->branch_code, 'mode' => 'total',
                'general' => $withRevenue ? $billedGeneral : null,
                'measures' => $columns->map(function ($col, $key) use ($byMode, $measure, $billedGeneral) {
                    $parts = collect($byMode)->pluck("measures.{$key}");
                    $targets = $parts->pluck('target')->filter(fn ($v) => $v !== null);
                    $actuals = $parts->pluck('actual')->filter(fn ($v) => $v !== null);
                    $extra = $key === 'revenue' ? $billedGeneral : 0.0;

                    return $measure(
                        $targets->isEmpty() ? null : (float) $targets->sum(),
                        $actuals->isEmpty() && $extra == 0 ? null : round($actuals->sum() + $extra, 2),
                    );
                }),
            ];
        }

        return response()->json(['month' => $month->format('Y-m'), 'as_of' => $asOf, 'with_revenue' => $withRevenue, 'rows' => $rows]);
    }

    /** Save the month's targets. An empty figure clears it. */
    public function update(Request $request): JsonResponse
    {
        $context = $this->boss();

        $data = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
            'targets' => ['required', 'array'],
            'targets.*.agent_id' => ['required', 'integer'],
            'targets.*.mode' => ['required', 'in:' . implode(',', self::MODES)],
            'targets.*.shipments' => ['nullable', 'integer', 'min:0'],
            'targets.*.tonnage' => ['nullable', 'numeric', 'min:0'],
            'targets.*.revenue' => ['nullable', 'numeric', 'min:0'],
        ]);

        $month = $this->month($data['month']);
        $branchIds = DB::table('agents_info')->where('company_id', $context->companyId)->pluck('id')->all();

        foreach ($data['targets'] as $t) {
            abort_unless(in_array((int) $t['agent_id'], $branchIds, true), 422, 'That branch is not in your company.');

            DB::table('sales_targets')->updateOrInsert(
                ['agent_id' => $t['agent_id'], 'transport_mode' => $t['mode'], 'period_month' => $month->toDateString()],
                [
                    'company_id' => $context->companyId,
                    'shipments' => $t['shipments'] ?? null,
                    'tonnage_kg' => $t['tonnage'] ?? null,
                    // Revenue is a Command figure.
                    'revenue_inr' => $context->tierAtLeast('command') ? ($t['revenue'] ?? null) : null,
                    'set_by' => auth()->id(), 'updated_at' => now(), 'created_at' => now(),
                ]
            );
        }

        return $this->index(new Request(['month' => $data['month']]));
    }

    private function boss(): UserContext
    {
        $this->authorize('viewSales');
        $context = UserContext::for(auth()->user());
        abort_unless($context->designation === 'boss', 403, 'Targets are set by the Boss.');

        return $context;
    }

    private function month(?string $value): Carbon
    {
        return ($value ? Carbon::createFromFormat('Y-m', $value) : now())->startOfMonth()->startOfDay();
    }
}
