<?php

namespace App\Services\Sales;

use App\Services\ProfitabilityService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * What the Boss might write to his team, worked out from the figures (user, 2026-09-16: "analyse the internal
 * details … a way to draft a detailed mail — setting sales targets, asking about the drop, why top companies we
 * used to work with are not working").
 *
 * Per branch, nightly. "Months" are COMPLETE months before the snapshot date; a month with no shipments counts as
 * zero, because for a branch that is what it did.
 *
 *   next_month_targets  from the 20th:  base = average of the last 3 months (shipments, tonnage, revenue)
 *                                        trend = (last 3 months avg − the 9 months before avg) ÷ the 9 months avg,
 *                                                held between −10% and +15%
 *                                        proposed = base × (1 + trend)
 *   volume_drop         last 3 months average tonnage at least 25% below the 9 months before (and the branch moved at
 *                       least 500 kg a month before) — with the three clients whose tonnage fell most
 *   top_clients_quiet   the 10 biggest clients by tonnage in the 12 months that ended 3 months ago; quiet = their last
 *                       3 months under a quarter of their usual quarter (those 12 months ÷ 4), from at least 300 kg
 *   behind_target       days 8–25 of the month: month-end pace (so far ÷ days gone × days in month) under 85% of a
 *                       target that is set — each mode's, and the branch's across modes (their targets summed; its
 *                       revenue with general billing, which has no mode)
 *   losing_on_price     last 90 days, per lane: at least 5 enquiries lost because the rate was high, and that is at
 *                       least 40% of the lane's closed enquiries
 *   slow_replies        median hours to the first reply over the last 30 days at least 1.5× the 60 days before, and
 *                       at least 2 hours, with 10 or more enquiries in each
 *   money_overdue       (Command) money overdue 60+ days across the branch's clients reaching ₹1,00,000
 *
 * Tactical never names a client (their domain instead) and never shows money.
 */
class BossMails
{
    public const REST_DAYS = 30;

    public const TITLES = [
        'next_month_targets' => "Next month's targets",
        'volume_drop' => 'Volume drop',
        'top_clients_quiet' => 'Top clients gone quiet',
        'behind_target' => 'Behind target',
        'losing_on_price' => 'Losing on price',
        'slow_replies' => 'Replies getting slower',
        'money_overdue' => 'Money overdue',
    ];

    /** Replace the company's open, undrafted suggestions with tonight's. A drafted one is somebody's work: kept. */
    public function refresh(int $companyId, Carbon $date): int
    {
        $company = DB::table('companies')->find($companyId);
        $findings = $this->findings($companyId, $company->tier === 'command', $date);

        DB::table('boss_mail_suggestions')->where('company_id', $companyId)->where('status', 'open')->whereNull('drafted_at')->delete();

        $resting = DB::table('boss_mail_suggestions')->where('company_id', $companyId)
            ->where(fn ($q) => $q->where('status', 'open')
                ->orWhere('updated_at', '>=', $date->copy()->subDays(self::REST_DAYS)))
            ->pluck('rest_key')->flip();

        $fresh = collect($findings)->reject(fn ($f) => isset($resting[$f['rest_key']]));

        DB::table('boss_mail_suggestions')->insert($fresh->map(fn ($f) => [
            'company_id' => $companyId, 'agent_id' => $f['agent_id'], 'kind' => $f['kind'], 'rest_key' => $f['rest_key'],
            'priority' => $f['priority'], 'facts' => json_encode($f['facts'], JSON_UNESCAPED_UNICODE),
            'suggested_to' => json_encode(array_values(array_unique($f['to']))),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ])->all());

        return $fresh->count();
    }

    /** @return array<int, array{kind: string, agent_id: int, rest_key: string, priority: float, facts: array, to: int[]}> */
    public function findings(int $companyId, bool $command, Carbon $date): array
    {
        $out = [];

        foreach (DB::table('agents_info')->where('company_id', $companyId)->get(['id', 'agent_name']) as $branch) {
            foreach ([
                $this->nextMonthTargets($branch, $command, $date),
                $this->volumeDrop($branch, $command, $date),
                $this->topClientsQuiet($branch, $command, $date),
                $this->behindTarget($branch, $command, $date),
                $this->losingOnPrice($branch, $date),
                $this->slowReplies($branch, $date),
                $command ? $this->moneyOverdue($branch) : null,
            ] as $finding) {
                if ($finding !== null) {
                    $out[] = $finding + ['agent_id' => (int) $branch->id];
                }
            }
        }

        return $out;
    }

    // ─── The seven ───────────────────────────────────────────────────────────

    private function nextMonthTargets(object $branch, bool $command, Carbon $date): ?array
    {
        if ($date->day < 20) {
            return null;
        }

        $next = $date->copy()->startOfMonth()->addMonth();
        $modes = [];

        foreach ($this->monthly($branch->id, $date, 12, 'transport_mode') as $mode => $months) {
            $recent = $this->average($months, 1, 3);
            $before = $this->average($months, 4, 12);

            if ($recent['shipments'] <= 0) {
                continue;
            }

            $trend = $before['tonnage'] > 0 ? max(-0.10, min(0.15, ($recent['tonnage'] - $before['tonnage']) / $before['tonnage'])) : 0.0;

            $modes[$mode] = array_filter([
                'last_3_months_average_shipments' => (int) round($recent['shipments']),
                'last_3_months_average_tonnage_kg' => (int) round($recent['tonnage']),
                'trend_percent' => (int) round($trend * 100),
                'proposed_shipments' => (int) round($recent['shipments'] * (1 + $trend)),
                'proposed_tonnage_kg' => (int) round($recent['tonnage'] * (1 + $trend), -1),
                'proposed_revenue_inr' => $command ? (int) round($recent['revenue'] * (1 + $trend), -3) : null,
            ], fn ($v) => $v !== null);
        }

        return $modes === [] ? null : [
            'kind' => 'next_month_targets',
            'rest_key' => "targets:{$branch->id}:" . $next->format('Y-m'),
            'priority' => 40,
            'facts' => ['branch' => $branch->agent_name, 'month' => $next->format('F Y'), 'modes' => $modes],
            'to' => $this->staff($branch->id, ['sales', 'pricing']),
        ];
    }

    private function volumeDrop(object $branch, bool $command, Carbon $date): ?array
    {
        $months = $this->monthly($branch->id, $date, 12)['all'] ?? [];
        $recent = $this->average($months, 1, 3)['tonnage'];
        $before = $this->average($months, 4, 12)['tonnage'];

        if ($before < 500 || ($recent - $before) / $before > -0.25) {
            return null;
        }

        $clients = $this->byClient($branch->id, $date, 12)
            ->map(fn ($m, $customerId) => ['id' => $customerId, 'fall' => $this->average($m, 4, 12)['tonnage'] - $this->average($m, 1, 3)['tonnage'],
                'before' => $this->average($m, 4, 12)['tonnage'], 'recent' => $this->average($m, 1, 3)['tonnage']])
            ->filter(fn ($c) => $c['fall'] > 0)->sortByDesc('fall')->take(3);

        return [
            'kind' => 'volume_drop',
            'rest_key' => "drop:{$branch->id}",
            'priority' => 70 + round(abs(($recent - $before) / $before) * 100) / 10,
            'facts' => [
                'branch' => $branch->agent_name,
                'change_percent' => (int) round(($recent - $before) / $before * 100),
                'monthly_tonnage_kg_before' => (int) round($before),
                'monthly_tonnage_kg_last_3_months' => (int) round($recent),
                'clients_falling_most' => $clients->map(fn ($c) => [
                    'client' => $this->clientLabel($c['id'], $command),
                    'monthly_kg_before' => (int) round($c['before']), 'monthly_kg_last_3_months' => (int) round($c['recent']),
                ])->values()->all(),
            ],
            'to' => array_merge($this->staff($branch->id, ['sales', 'pricing']), $this->reps($clients->pluck('id')->all())),
        ];
    }

    private function topClientsQuiet(object $branch, bool $command, Carbon $date): ?array
    {
        $quiet = $this->byClient($branch->id, $date, 15)
            ->map(fn ($m, $customerId) => ['id' => $customerId, 'year' => array_sum(array_column(array_slice($m, 3, 12, true), 'tonnage')),
                'recent' => array_sum(array_column(array_slice($m, 0, 3, true), 'tonnage'))])
            ->sortByDesc('year')->take(10)
            ->filter(fn ($c) => $c['year'] / 4 >= 300 && $c['recent'] < 0.25 * ($c['year'] / 4))
            ->values();

        return $quiet->isEmpty() ? null : [
            'kind' => 'top_clients_quiet',
            'rest_key' => "quiet:{$branch->id}:" . $quiet->pluck('id')->sort()->implode(','),
            'priority' => 80,
            'facts' => [
                'branch' => $branch->agent_name,
                'clients' => $quiet->map(fn ($c) => [
                    'client' => $this->clientLabel($c['id'], $command),
                    'usual_quarter_kg' => (int) round($c['year'] / 4),
                    'last_3_months_kg' => (int) round($c['recent']),
                ])->all(),
            ],
            'to' => $this->reps($quiet->pluck('id')->all()) ?: $this->staff($branch->id, ['sales']),
        ];
    }

    private function behindTarget(object $branch, bool $command, Carbon $date): ?array
    {
        if ($date->day < 8 || $date->day > 25) {
            return null;
        }

        $month = $date->copy()->startOfMonth();
        $targets = DB::table('sales_targets')->where('agent_id', $branch->id)->where('period_month', $month->toDateString())->get()->keyBy('transport_mode');
        $asOf = DB::table('customer_performance_snapshots')->where('agent_id', $branch->id)
            ->whereBetween('snapshot_date', [$month->toDateString(), $date->toDateString()])->max('snapshot_date');

        if ($targets->isEmpty() || $asOf === null) {
            return null;
        }

        $actual = DB::table('customer_performance_snapshots')->where('agent_id', $branch->id)->where('snapshot_date', $asOf)
            ->groupBy('transport_mode')
            ->selectRaw('transport_mode, SUM(shipment_count_mtd) AS shipments, SUM(tonnage_mtd) AS tonnage, SUM(revenue_mtd) AS revenue')
            ->get()->keyBy('transport_mode');
        $factor = $month->daysInMonth / Carbon::parse($asOf)->day;
        $short = [];

        foreach ($targets as $mode => $t) {
            foreach (['shipments' => 'shipments', 'tonnage_kg' => 'tonnage', 'revenue_inr' => 'revenue'] as $column => $measure) {
                if ($t->{$column} === null || (float) $t->{$column} <= 0 || ($measure === 'revenue' && ! $command)) {
                    continue;
                }

                $soFar = (float) ($actual[$mode]->{$measure} ?? 0);
                $pace = $soFar * $factor / (float) $t->{$column};

                if ($pace < 0.85) {
                    $short[] = ['mode' => $mode, 'measure' => $measure, 'target' => (int) round($t->{$column}),
                        'so_far' => (int) round($soFar), 'month_end_pace_percent' => (int) round($pace * 100)];
                }
            }
        }

        // The branch as a whole (user, 2026-09-26; GAPS #405): its mode targets summed against everything it did —
        // on revenue, general billing too, which has no mode (#404). Sea can carry a soft air month, and a bill not
        // for a shipment can carry both. Left out where it would only repeat a mode's line word for word.
        $general = $command ? (app(ProfitabilityService::class)->generalByBranch([$branch->id], $month->toDateString(), $asOf)[$branch->id] ?? 0.0) : 0.0;

        foreach (['shipments' => 'shipments', 'tonnage_kg' => 'tonnage', 'revenue_inr' => 'revenue'] as $column => $measure) {
            $targeted = $targets->filter(fn ($t) => $t->{$column} !== null && (float) $t->{$column} > 0);
            if ($targeted->isEmpty() || ($measure === 'revenue' && ! $command)) {
                continue;
            }

            $target = (float) $targeted->sum($column);
            $extra = $measure === 'revenue' ? $general : 0.0;
            $soFar = (float) $actual->sum($measure) + $extra;
            $repeats = $targeted->count() === 1 && abs($soFar - (float) ($actual[$targeted->keys()->first()]->{$measure} ?? 0)) < 0.005;
            $pace = $soFar * $factor / $target;

            if ($pace < 0.85 && ! $repeats) {
                $short[] = array_filter(['mode' => 'all modes', 'measure' => $measure, 'target' => (int) round($target),
                    'so_far' => (int) round($soFar), 'month_end_pace_percent' => (int) round($pace * 100),
                    'of_which_general_billing' => $extra > 0 ? (int) round($extra) : null], fn ($v) => $v !== null);
            }
        }

        return $short === [] ? null : [
            'kind' => 'behind_target',
            'rest_key' => "behind:{$branch->id}:" . $month->format('Y-m'),
            'priority' => 60,
            'facts' => ['branch' => $branch->agent_name, 'month' => $month->format('F Y'),
                'days_left' => $month->daysInMonth - Carbon::parse($asOf)->day, 'behind' => $short],
            'to' => $this->staff($branch->id, ['sales', 'pricing']),
        ];
    }

    private function losingOnPrice(object $branch, Carbon $date): ?array
    {
        $lanes = DB::table('enquiries')->where('agent_id', $branch->id)->whereNull('deleted_at')
            ->where('created_at', '>=', $date->copy()->subDays(90))
            ->whereIn('status', ['converted', 'lost'])->whereNotNull('origin_code')->whereNotNull('dest_code')
            ->groupBy('origin_code', 'dest_code')
            ->selectRaw("origin_code, dest_code, COUNT(*) AS closed, SUM(status = 'lost' AND lost_reason = 'rates_high') AS on_price")
            ->havingRaw("SUM(status = 'lost' AND lost_reason = 'rates_high') >= 5")
            ->get()
            ->filter(fn ($l) => $l->on_price / $l->closed >= 0.40)
            ->sortByDesc('on_price')->values();

        return $lanes->isEmpty() ? null : [
            'kind' => 'losing_on_price',
            'rest_key' => "price:{$branch->id}:" . $lanes->map(fn ($l) => "{$l->origin_code}-{$l->dest_code}")->implode(','),
            'priority' => 55,
            'facts' => ['branch' => $branch->agent_name, 'days' => 90, 'lanes' => $lanes->map(fn ($l) => [
                'lane' => "{$l->origin_code} → {$l->dest_code}", 'lost_on_price' => (int) $l->on_price, 'closed' => (int) $l->closed,
                'share_percent' => (int) round($l->on_price * 100 / $l->closed),
            ])->all()],
            'to' => $this->staff($branch->id, ['pricing']),
        ];
    }

    private function slowReplies(object $branch, Carbon $date): ?array
    {
        $rows = DB::table('email_threads as t')
            ->where('t.agent_id', $branch->id)->where('t.classification', 'customer_enquiry')->whereNotNull('t.first_response_at')
            ->joinSub(DB::table('email_messages')->where('direction', 'inbound')->groupBy('thread_key')
                ->selectRaw('thread_key, MIN(received_at) AS first_in'), 'm', 'm.thread_key', '=', 't.thread_key')
            ->where('m.first_in', '>=', $date->copy()->subDays(90))
            ->get(['m.first_in', 't.first_response_at']);

        $hours = fn ($from, $to) => $rows->filter(fn ($r) => Carbon::parse($r->first_in)->between($from, $to))
            ->map(fn ($r) => max(0, Carbon::parse($r->first_in)->diffInMinutes(Carbon::parse($r->first_response_at), false)) / 60);
        $now = $hours($date->copy()->subDays(30), $date);
        $before = $hours($date->copy()->subDays(90), $date->copy()->subDays(30));

        if ($now->count() < 10 || $before->count() < 10) {
            return null;
        }

        $medianNow = $now->median();
        $medianBefore = $before->median();

        if ($medianNow < 2 || $medianNow < 1.5 * $medianBefore) {
            return null;
        }

        return [
            'kind' => 'slow_replies',
            'rest_key' => "replies:{$branch->id}",
            'priority' => 50,
            'facts' => ['branch' => $branch->agent_name, 'median_hours_last_30_days' => round($medianNow, 1),
                'median_hours_60_days_before' => round($medianBefore, 1),
                'enquiries_lost_for_slow_reply_last_90_days' => DB::table('enquiries')->where('agent_id', $branch->id)
                    ->where('lost_reason', 'delay_in_response')->where('created_at', '>=', $date->copy()->subDays(90))->count()],
            'to' => $this->staff($branch->id, ['pricing']),
        ];
    }

    private function moneyOverdue(object $branch): ?array
    {
        $latest = DB::table('customer_performance_snapshots')->where('agent_id', $branch->id)->max('snapshot_date');
        $rows = $latest === null ? collect() : DB::table('customer_performance_snapshots')->where('agent_id', $branch->id)
            ->where('snapshot_date', $latest)->where('outstanding_60_plus', '>', 0)
            ->groupBy('customer_id')->selectRaw('customer_id, SUM(outstanding_60_plus) AS overdue')
            ->orderByDesc('overdue')->get();
        $total = (float) $rows->sum('overdue');

        return $total < 100000 ? null : [
            'kind' => 'money_overdue',
            'rest_key' => "money:{$branch->id}",
            'priority' => 65,
            'facts' => ['branch' => $branch->agent_name, 'overdue_60_plus_inr' => (int) round($total),
                'clients' => $rows->take(3)->map(fn ($r) => ['client' => $this->clientLabel($r->customer_id, true),
                    'overdue_60_plus_inr' => (int) round($r->overdue)])->all()],
            'to' => array_merge($this->staff($branch->id, ['accounts']), $this->reps($rows->take(3)->pluck('customer_id')->all())),
        ];
    }

    // ─── Reading the figures ─────────────────────────────────────────────────

    /**
     * Month-by-month shipments, tonnage and revenue for a branch, index 1 = last complete month. Grouped by transport
     * mode, or all modes together under 'all'.
     *
     * @return array<string, array<int, array{shipments: float, tonnage: float, revenue: float}>>
     */
    private function monthly(int $agentId, Carbon $date, int $count, ?string $groupBy = null): array
    {
        $start = $date->copy()->startOfMonth();
        $rows = DB::table('customer_lane_stats')->where('agent_id', $agentId)
            ->where('period_month', '>=', $start->copy()->subMonths($count)->toDateString())->where('period_month', '<', $start->toDateString())
            ->groupBy('period_month')->when($groupBy, fn ($q) => $q->groupBy($groupBy))
            ->selectRaw('period_month, ' . ($groupBy ? "{$groupBy} AS grp" : "'all' AS grp") . ', SUM(shipment_count) AS shipments, SUM(tonnage) AS tonnage, SUM(revenue) AS revenue')
            ->get();

        return $rows->groupBy('grp')->map(fn (Collection $g) => $this->series($g, $start, $count))->all();
    }

    /** @return Collection<int, array> month-by-month tonnage per client (index 1 = last complete month) */
    private function byClient(int $agentId, Carbon $date, int $count): Collection
    {
        $start = $date->copy()->startOfMonth();

        return DB::table('customer_lane_stats')->where('agent_id', $agentId)
            ->where('period_month', '>=', $start->copy()->subMonths($count)->toDateString())->where('period_month', '<', $start->toDateString())
            ->groupBy('customer_id', 'period_month')
            ->selectRaw('customer_id, period_month, SUM(shipment_count) AS shipments, SUM(tonnage) AS tonnage, SUM(revenue) AS revenue')
            ->get()->groupBy('customer_id')->map(fn (Collection $g) => $this->series($g, $start, $count));
    }

    /** A zero-filled month series: a month with no shipments did nothing, which for these figures is zero. */
    private function series(Collection $rows, Carbon $start, int $count): array
    {
        $byMonth = $rows->keyBy(fn ($r) => substr((string) $r->period_month, 0, 7));
        $series = [];

        for ($i = 1; $i <= $count; $i++) {
            $r = $byMonth[$start->copy()->subMonths($i)->format('Y-m')] ?? null;
            $series[$i] = ['shipments' => (float) ($r->shipments ?? 0), 'tonnage' => (float) ($r->tonnage ?? 0), 'revenue' => (float) ($r->revenue ?? 0)];
        }

        return $series;
    }

    /** @return array{shipments: float, tonnage: float, revenue: float} the average of months $from..$to ago */
    private function average(array $series, int $from, int $to): array
    {
        $slice = array_filter($series, fn ($i) => $i >= $from && $i <= $to, ARRAY_FILTER_USE_KEY);
        $n = max(1, $to - $from + 1);

        return ['shipments' => array_sum(array_column($slice, 'shipments')) / $n,
            'tonnage' => array_sum(array_column($slice, 'tonnage')) / $n,
            'revenue' => array_sum(array_column($slice, 'revenue')) / $n];
    }

    /** @return int[] the branch's active staff in these roles */
    private function staff(int $agentId, array $roles): array
    {
        return DB::table('users')->where('branch_name', $agentId)->whereIn('designation', $roles)->where('is_active', 1)
            ->pluck('id')->map(fn ($id) => (int) $id)->all();
    }

    /** @return int[] the reps who look after these clients */
    private function reps(array $customerIds): array
    {
        return DB::table('customers')->whereIn('id', $customerIds)->whereNotNull('sales_id')->pluck('sales_id')
            ->map(fn ($id) => (int) $id)->unique()->values()->all();
    }

    /** The client's name on Command; its domain on Tactical, which never names a client. */
    private function clientLabel(int $customerId, bool $command): string
    {
        $c = DB::table('customers')->find($customerId, ['name', 'email_domain']);

        return $command ? (string) $c->name : (string) ($c->email_domain ?: 'a client');
    }
}
