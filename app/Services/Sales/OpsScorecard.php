<?php

namespace App\Services\Sales;

use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * "Are we the problem?" — PRD §7.3.4 G as facts, per client, mode and financial-year quarter (owner, 2026-10-05;
 * GAPS #456). Measured, not scored: the owner picks weights once real quarters exist.
 *
 * - **Days slower**: on our own steps (config `ops_health.our_steps`), the client's median days per step against the
 *   OTHER clients' median, same branches, mode and quarter; Σ of the positive deltas — only lateness counts. Not a
 *   normal that includes the client (owner, 2026-10-05): a client who is most of the work would set it and read 0.
 * - **Cancellation rate**: cancelled jobs ÷ the client's jobs opened in the quarter.
 * - **FNA rate** (air): jobs whose waybill the airline rejected at least once ÷ jobs it answered. An FNA counts as a
 *   rejection only — how long the airline took is not ours (owner).
 * - **Weight gap**: the median of |actual − declared| ÷ declared (PRD §5.3).
 *
 * Each figure is NULL below the PRD's minimum sample — never 0.
 */
class OpsScorecard
{
    /** The branch's jobs and step lengths, read once per (branches, mode, quarter) in a run — every client compares to them. */
    private array $memo = [];

    /** The financial-year quarter holding `$date`: Apr–Jun, Jul–Sep, Oct–Dec, Jan–Mar. */
    public static function quarterStart(Carbon $date): Carbon
    {
        $month = intdiv($date->month - 1, 3) * 3 + 1;

        return Carbon::create($date->year, $month, 1)->startOfDay();
    }

    /** "Q2 FY 2026-27" — the label the staff reviews and the Sales page use. */
    public static function quarterLabel(Carbon $quarterStart): string
    {
        $fy = ClientHistory::financialYearStart($quarterStart);
        $q = intdiv($quarterStart->diffInMonths($fy), 3) + 1;

        return sprintf('Q%d FY %d-%02d', $q, $fy->year, ($fy->year + 1) % 100);
    }

    /**
     * The quarter's facts for one client, from the quarter's start up to `$until` (the end of the quarter, or today
     * while it is running).
     *
     * @param  int[]  $branchIds  the company's branches — "the branch's normal" is theirs, as the rest of the engine reads it
     */
    public function measure(array $branchIds, int $customerId, string $mode, Carbon $quarterStart, Carbon $until): array
    {
        $key = implode(',', $branchIds) . "|{$mode}|{$quarterStart->toDateString()}|{$until->toDateTimeString()}";

        $this->memo[$key] ??= (function () use ($branchIds, $mode, $quarterStart, $until) {
            $jobs = DB::table('jobs')
                ->whereIn('agent_id', $branchIds)->where('transport_mode', $mode)->whereNull('deleted_at')
                ->where('created_at', '>=', $quarterStart)->where('created_at', '<=', $until)
                ->get(['id', 'customer_id', 'status', 'awb_number', 'enquiry_id']);

            return [$jobs, $this->stepLengths($jobs->pluck('id')->all())];
        })();

        [$jobs, $lengths] = $this->memo[$key];
        $theirs = $jobs->where('customer_id', $customerId);
        [$daysSlower, $deltas] = $this->daysSlower($lengths, $theirs->pluck('id')->all());

        return [
            'job_count' => $theirs->count(),
            'days_slower' => $daysSlower,
            'step_deltas' => $deltas,
            'cancellation_rate' => $this->rate($theirs->where('status', 'Cancelled')->count(), $theirs->count()),
            'fna_rate' => $mode === 'air' ? $this->fnaRate($theirs->where('status', '!=', 'Cancelled')) : null,
            'weight_gap_pct' => $this->weightGap($theirs->where('status', '!=', 'Cancelled')->pluck('id')->all(), $mode),
        ];
    }

    /** Write the quarter's row. */
    public function record(int $agentId, int $customerId, string $mode, Carbon $quarterStart, array $facts): void
    {
        DB::table('customer_ops_quarters')->updateOrInsert(
            ['customer_id' => $customerId, 'transport_mode' => $mode, 'quarter_start' => $quarterStart->toDateString()],
            array_merge($facts, [
                'agent_id' => $agentId,
                'step_deltas' => $facts['step_deltas'] === null ? null : json_encode($facts['step_deltas']),
                'computed_at' => now(), 'updated_at' => now(), 'created_at' => now(),
            ])
        );
    }

    /**
     * @return array{0: ?float, 1: ?array<string, float>}
     */
    private function daysSlower(array $lengths, array $clientJobIds): array
    {
        // The others: every job of the branches in the quarter that is not this client's.
        $others = array_diff_key($lengths, array_flip($clientJobIds));

        $deltas = [];
        foreach (config('ops_health.our_steps') as $step) {
            $branch = array_merge([], ...array_values(array_map(fn ($perJob) => $perJob[$step] ?? [], $others)));
            $client = array_merge([], ...array_values(array_map(
                fn ($id) => $lengths[$id][$step] ?? [], $clientJobIds
            )));

            if (count($client) < (int) config('ops_health.min_step_observations') || $branch === []) {
                continue;
            }

            $deltas[$step] = round($this->median($client) - $this->median($branch), 2);
        }

        if (count($deltas) < (int) config('ops_health.min_steps')) {
            return [null, null];
        }

        $sum = array_sum(array_map(fn ($d) => max($d, 0), $deltas));

        return [min(round($sum, 2), 9999.99), $deltas];
    }

    /**
     * Days spent in each of our steps, per job: a step lasts until the job's next status. A step the job is still in
     * has no length yet and is not counted.
     *
     * @return array<int, array<string, float[]>>
     */
    private function stepLengths(array $jobIds): array
    {
        if ($jobIds === []) {
            return [];
        }

        $ours = config('ops_health.our_steps');
        $out = [];

        DB::table('milestone_performance_logs')->whereIn('job_id', $jobIds)
            ->orderBy('job_id')->orderBy('entered_at')->orderBy('id')
            ->get(['job_id', 'milestone_name', 'entered_at'])
            ->groupBy('job_id')
            ->each(function (Collection $rows, $jobId) use ($ours, &$out) {
                $rows = $rows->values();
                for ($i = 0; $i < $rows->count() - 1; $i++) {
                    $name = $rows[$i]->milestone_name;
                    if (! in_array($name, $ours, true)) {
                        continue;
                    }
                    $seconds = Carbon::parse($rows[$i + 1]->entered_at)->getTimestamp() - Carbon::parse($rows[$i]->entered_at)->getTimestamp();
                    $out[(int) $jobId][$name][] = max($seconds, 0) / 86400;
                }
            });

        return $out;
    }

    /** Of the client's jobs the airline answered, the share it rejected at least once. */
    private function fnaRate(Collection $jobs): ?float
    {
        $awbs = $jobs->pluck('awb_number')->filter()->unique()->values()->all();

        if ($awbs === []) {
            return null;
        }

        // A "Cargo Status" row is tracking (RCS, DEP, DLV…), not the airline's answer to the data we sent.
        $answers = DB::table('status_response')->whereIn('business_id', $awbs)
            ->where('business_name', 'Air Waybill')->where('business_status_code', '!=', 'Cargo Status')
            ->get(['business_id', 'business_status_code'])->groupBy('business_id');

        $rejected = $answers->filter(fn (Collection $rows) => $rows->contains('business_status_code', 'Rejected'))->count();

        return $this->rate($rejected, $answers->count());
    }

    private function weightGap(array $jobIds, string $mode): ?float
    {
        if ($jobIds === []) {
            return null;
        }

        $details = $mode === 'air' ? 'air_shipment_details' : 'sea_shipment_details';

        $gaps = DB::table('jobs as j')
            ->join('enquiries as e', 'e.id', '=', 'j.enquiry_id')
            ->join("{$details} as d", 'd.job_id', '=', 'j.id')
            ->whereIn('j.id', $jobIds)->where('e.extracted_weight', '>', 0)->where('d.gross_weight', '>', 0)
            ->get(['e.extracted_weight as declared', 'd.gross_weight as actual'])
            ->map(fn ($r) => abs((float) $r->actual - (float) $r->declared) / (float) $r->declared * 100)
            ->all();

        if (count($gaps) < (int) config('ops_health.min_jobs')) {
            return null;
        }

        return min(round($this->median($gaps), 2), 9999.99);
    }

    private function rate(int $count, int $of): ?float
    {
        return $of < (int) config('ops_health.min_jobs') ? null : round($count / $of * 100, 2);
    }

    private function median(array $values): float
    {
        sort($values);
        $n = count($values);

        return $n % 2 ? (float) $values[intdiv($n, 2)] : ($values[$n / 2 - 1] + $values[$n / 2]) / 2;
    }
}
