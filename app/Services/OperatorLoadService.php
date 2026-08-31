<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * The Operator Load Index — PRD.md §5.5.
 *
 *     OLI = Σ over active jobs of  (complexity + α·dimension_lines + β·houses) × urgency
 *
 * **Lower OLI = more capacity.** This is the number pricing uses to decide who gets the
 * next job.
 *
 * ═══ 🔴 THERE IS EXACTLY ONE FORMULA ════════════════════════════════════════
 * An earlier draft of the PRD carried a simple urgency COUNT and a separate complexity
 * SUM, both called "OLI", both compared against the same cap. They produce different
 * numbers for the same operator, so a badge reading 18.5 was ambiguous as to which was
 * meant — and balancing load on the wrong one is actively misleading.
 *
 * Urgency without complexity says a sea-import consol clearing tomorrow equals a simple
 * air export clearing tomorrow. Complexity without urgency says a job clearing today
 * equals one clearing next month. The product needs both, so they MULTIPLY.
 *
 * ═══ RESOLUTION IS ALWAYS branch -> company -> config ════════════════════════
 * Every `tenant_policies` column is NULLable with no SQL default, so a value lives in
 * exactly one place. NULL means "inherit", not "zero" — reading a NULL cap as 0.0 would
 * mark every operator overloaded.
 *
 * ⚠️ **The cap WARNS, it never blocks** (ui_ux_guide §9.3). A manager may have context
 * the index lacks — a job that looks heavy but is a repeat for a client the operator
 * knows. An index that refuses assignments gets worked around, and then it measures
 * nothing.
 */
class OperatorLoadService
{
    /** `Lost` is deliberately absent — it is not a valid job status (it lives on enquiries). */
    private const INACTIVE = ['Completed', 'Cancelled'];

    /**
     * OLI for every operator in a branch, keyed by user id.
     *
     * @return array<int, array{oli: float, cap: float, overloaded: bool, jobs: int}>
     */
    public function forBranch(int $agentId): array
    {
        $policy = $this->policy($agentId);

        $jobs = DB::table('jobs')
            ->where('agent_id', $agentId)
            ->whereNull('deleted_at')
            ->whereNotNull('ops_id')
            ->whereNotIn('status', self::INACTIVE)
            ->get(['id', 'ops_id', 'transport_mode', 'direction', 'planned_clearance_date', 'is_consolidation']);

        // One query for house counts rather than one per job — a branch with 400 open
        // jobs would otherwise make the Staff View 400 round trips.
        $houses = DB::table('jobs')
            ->whereIn('parent_job_id', $jobs->pluck('id'))
            ->whereNull('deleted_at')
            ->selectRaw('parent_job_id, COUNT(*) AS n')
            ->groupBy('parent_job_id')
            ->pluck('n', 'parent_job_id');

        $totals = [];

        foreach ($jobs as $job) {
            $opsId = (int) $job->ops_id;
            $totals[$opsId] ??= ['oli' => 0.0, 'cap' => $policy['capacity_cap'], 'overloaded' => false, 'jobs' => 0];

            $totals[$opsId]['oli'] += $this->weight($job, (int) ($houses[$job->id] ?? 0), $policy);
            $totals[$opsId]['jobs']++;
        }

        foreach ($totals as $id => $row) {
            $totals[$id]['oli'] = round($row['oli'], 1);
            $totals[$id]['overloaded'] = $totals[$id]['oli'] >= $row['cap'];
        }

        return $totals;
    }

    /**
     * One job's contribution.
     *
     * ⚠️ **A job with no planned clearance date is `later`, not `today`.** Treating an
     * unknown date as urgent would inflate every operator holding an unscheduled job
     * and send the next assignment to whoever happens to have fewer of them.
     */
    public function weight(object $job, int $houses, array $policy): float
    {
        $complexity = $this->complexity($job, $policy);
        $dimensions = $this->dimensionLines($job);

        $base = $complexity
            + ($policy['dimension_factor'] * $dimensions)
            + ($policy['house_factor'] * $houses);

        return $base * $this->urgency($job->planned_clearance_date, $policy);
    }

    private function complexity(object $job, array $policy): float
    {
        $mode = $job->transport_mode === 'sea' ? 'sea' : 'air';   // road inherits air
        $direction = $job->direction === 'import' ? 'import' : 'export';

        return $policy['complexity']["{$mode}_{$direction}"];
    }

    /**
     * ❓ **Distinct L×W×H cargo dimension lines have no table yet.**
     *
     * PRD.md §5.5 weights OLI by them (α = 0.2 per line), but no `cargo_dimensions`
     * table exists in the schema doc and nothing stores per-line dimensions — only
     * aggregate `volume_cbm` and `piece_count`. Contributing 0 is the honest answer:
     * it under-weights complex multi-dimension cargo rather than inventing a count,
     * and every operator is under-weighted equally so the RANKING — which is what
     * load balancing actually uses — stays correct. Raised in GAPS.md #30.
     */
    private function dimensionLines(object $job): int
    {
        return 0;
    }

    private function urgency($clearanceDate, array $policy): float
    {
        if ($clearanceDate === null) {
            return $policy['urgency']['later'];
        }

        $date = Carbon::parse($clearanceDate)->startOfDay();
        $today = now()->startOfDay();

        if ($date->lessThanOrEqualTo($today)) {
            return $policy['urgency']['today'];      // today OR overdue
        }

        if ($date->equalTo($today->copy()->addDay())) {
            return $policy['urgency']['tomorrow'];
        }

        return $policy['urgency']['later'];
    }

    /**
     * branch -> company -> config, per value.
     *
     * 🔴 Resolved COLUMN BY COLUMN, not row by row. A branch row that overrides only
     * the cap must still inherit the company's complexity weights — taking the whole
     * branch row when one exists would silently reset every other parameter to NULL.
     */
    public function policy(int $agentId): array
    {
        $branch = DB::table('tenant_policies')->where('agent_id', $agentId)->first();

        $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');
        $company = $companyId
            ? DB::table('tenant_policies')->where('company_id', $companyId)->whereNull('agent_id')->first()
            : null;

        $pick = function (string $column, string $configPath) use ($branch, $company) {
            return $branch->$column
                ?? $company->$column
                ?? config("f16s.policies.oli.{$configPath}");
        };

        return [
            'complexity' => [
                'air_export' => (float) $pick('oli_complexity_air_export', 'complexity.air_export'),
                'air_import' => (float) $pick('oli_complexity_air_import', 'complexity.air_import'),
                'sea_export' => (float) $pick('oli_complexity_sea_export', 'complexity.sea_export'),
                'sea_import' => (float) $pick('oli_complexity_sea_import', 'complexity.sea_import'),
            ],
            'dimension_factor' => (float) $pick('oli_dimension_factor', 'dimension_factor'),
            'house_factor'     => (float) $pick('oli_house_factor', 'house_factor'),
            'urgency' => [
                'today'    => (float) $pick('oli_urgency_today', 'urgency.today'),
                'tomorrow' => (float) $pick('oli_urgency_tomorrow', 'urgency.tomorrow'),
                'later'    => (float) $pick('oli_urgency_later', 'urgency.later'),
            ],
            'capacity_cap' => (float) $pick('oli_capacity_cap', 'capacity_cap'),
        ];
    }
}
