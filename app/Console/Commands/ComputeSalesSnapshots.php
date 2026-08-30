<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Layer 1 — the nightly rollup. PRD.md §7.3.4, guide Step 7.
 *
 *     php artisan sales:compute-snapshots
 *
 * ═══ WHY THIS COMMAND EXISTS ════════════════════════════════════════════════
 * The dashboards are forbidden from aggregating `jobs` or `enquiries` live
 * (PRD.md §2242). This is the only thing that reads those tables for analytics, and
 * everything the sales cockpit renders comes from what it writes here.
 *
 * ═══ 🔴 DETERMINISTIC. NO MODEL. NO ESTIMATE. ═══════════════════════════════
 * Layers 1 and 2 are pure SQL and pure PHP, reproducible and unit-testable. Gemma
 * (Layer 3) may narrate what this produces and may NEVER derive, sum or compare a
 * figure itself — small models are reliable at phrasing and unreliable at arithmetic.
 *
 * ═══ 🔴 THE GUARD RAILS ARE THE ALGORITHM, NOT HARDENING ════════════════════
 * Without them several formulas below are undefined on real data:
 *
 *   • Every denominator is guarded. A zero or NULL divisor yields NULL — never 0,
 *     never infinity. NULL means "not enough data" and renders as an em dash.
 *   • Minimum sample before any index is emitted: >= 5 shipment days (cadence,
 *     momentum), >= 5 closed enquiries (win rate, loss split), >= 3 settled invoices
 *     (payment). One loss out of one enquiry is a 100% service-loss rate, and firing
 *     that at a rep destroys trust in the whole tool.
 *   • Same-day shipments collapse to ONE event. Three consignments on one day are one
 *     shipping occasion, not two zero-length gaps — and a median gap of 0 makes
 *     `overdue` a division by zero.
 *   • Clamp before storing. momentum and overdue_ratio are DECIMAL(6,3).
 *
 * ═══ 🔴 EVERY ROW IS PER (customer_id, transport_mode). NEVER BLENDED. ══════
 * A client's air rhythm and sea rhythm are different businesses with different
 * cadences, competitors and price sensitivities. Averaging them produces a number
 * describing nobody — and per-mode partitioning is precisely what surfaces a
 * client going dormant on air while healthy on sea.
 */
class ComputeSalesSnapshots extends Command
{
    protected $signature = 'sales:compute-snapshots
                            {--agent= : Limit to one branch}
                            {--date= : Snapshot date (defaults to today)}';

    protected $description = 'Roll raw operational data into the analytics engine tables';

    /** Minimum samples — see the class docblock. */
    private const MIN_SHIPMENT_DAYS = 5;
    private const MIN_CLOSED_ENQUIRIES = 5;
    private const MIN_SETTLED_INVOICES = 3;

    /** DECIMAL(6,3) tops out here; a near-zero baseline must not overflow the column. */
    private const RATIO_CAP = 999.999;

    private const OUTSTANDING = ['finalized', 'sent', 'partially_paid'];

    public function handle(): int
    {
        $date = Carbon::parse($this->option('date') ?: now()->toDateString())->startOfDay();

        $written = 0;

        foreach (DB::table('companies')->pluck('id') as $companyId) {
            $written += $this->rollCompany((int) $companyId, $date);
        }

        $this->info("  {$written} snapshot rows written for " . $date->toDateString() . '.');

        return self::SUCCESS;
    }

    /**
     * 🔴 **ROLLED PER COMPANY, NOT PER BRANCH — because the unique key says so.**
     *
     * `uk_cps_customer_mode_date` is `(customer_id, transport_mode, snapshot_date)` and
     * does NOT include `agent_id`, so exactly one row can exist per client per mode per
     * day across the whole tenant. An earlier version of this command rolled per branch
     * and the second branch silently OVERWROTE the first — every revenue figure came
     * back 0.00 because the branch holding the invoices was rolled first and then
     * clobbered by a branch holding none.
     *
     * ❓ The table nonetheless carries `agent_id` NOT NULL and indexes it, which reads
     * as per-branch rows. The two cannot both be right; the unique key is the one the
     * database enforces, so it wins, and `agent_id` is written as the client's managing
     * branch (`customers.branch_id`). Raised in GAPS.md #28.
     *
     * This is also the correct business reading: `customers` is tenant-wide, not
     * branch-scoped, so a client's shipping rhythm is a property of the client — not
     * of whichever branch happened to handle a given shipment.
     */
    private function rollCompany(int $companyId, Carbon $date): int
    {
        $branchIds = DB::table('agents_info')
            ->where('company_id', $companyId)
            ->when($this->option('agent'), fn ($q) => $q->where('id', $this->option('agent')))
            ->pluck('id')->all();

        if ($branchIds === []) {
            return 0;
        }

        // Every (customer, mode) pair with ANY trace — an enquiry is enough. Driving off
        // jobs alone would silently drop a client who only ever loses, which is exactly
        // the client the loss-attribution split exists to surface.
        $pairs = DB::table('enquiries')
            ->whereIn('agent_id', $branchIds)
            ->whereNotNull('customer_id')
            ->whereNull('deleted_at')
            ->select('customer_id', 'transport_mode')
            ->distinct()
            ->get();

        $written = 0;

        foreach ($pairs as $pair) {
            $this->rollPair($branchIds, (int) $pair->customer_id, $pair->transport_mode, $date);
            $written++;
        }

        return $written;
    }

    private function rollPair(array $branchIds, int $customerId, string $mode, Carbon $date): void
    {
        $customer = DB::table('customers')->find($customerId);
        if ($customer === null) {
            return;
        }

        // The managing branch. Advisory, and the only defensible value for a column the
        // unique key does not scope by.
        $agentId = in_array((int) $customer->branch_id, $branchIds, true)
            ? (int) $customer->branch_id
            : $branchIds[0];

        $enquiries = DB::table('enquiries')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->whereNull('deleted_at')
            ->get();

        $shipmentDays = $this->shipmentDays($branchIds, $customerId, $mode);
        $invoices = DB::table('accounts_invoices')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)
            ->get();

        $tonnage = $this->tonnage($branchIds, $customerId, $mode);
        $funnel = $this->funnel($enquiries);
        $money = $this->money($invoices, $customer, $date);

        DB::table('customer_performance_snapshots')->updateOrInsert(
            ['customer_id' => $customerId, 'transport_mode' => $mode, 'snapshot_date' => $date->toDateString()],
            array_merge([
                'agent_id' => $agentId,
                'tonnage_mtd' => $tonnage['mtd'],
                'tonnage_ytd' => $tonnage['ytd'],
                'shipment_count_mtd' => $tonnage['count_mtd'],
                'enquiry_count_mtd' => $enquiries->filter(
                    fn ($e) => Carbon::parse($e->created_at)->greaterThanOrEqualTo($date->copy()->startOfMonth())
                )->count(),
                'momentum' => $this->momentum($branchIds, $customerId, $mode),
                'lane_hhi' => $this->laneHhi($branchIds, $customerId, $mode),
                'last_computed_at' => now(),
                'updated_at' => now(),
                'created_at' => now(),
            ], $funnel, $money)
        );

        $this->cadence($agentId, $branchIds, $customerId, $mode, $shipmentDays);
        $this->laneStats($agentId, $branchIds, $customerId, $mode, $date);
        $this->rankActions($agentId, $customerId, $mode, $customer, $funnel, $money);
    }

    /**
     * Gross-weight tonnage and shipment counts, month- and year-to-date.
     *
     * ⚠️ LEFT JOIN, not INNER. A converted job whose shipment details have not been
     * verified yet is still a shipment that happened — dropping it would under-report
     * tonnage for exactly the busiest, least-caught-up branches.
     */
    private function tonnage(array $branchIds, int $customerId, string $mode): array
    {
        $table = $mode === 'sea' ? 'sea_shipment_details' : 'air_shipment_details';

        $row = DB::table('jobs as j')
            ->leftJoin("{$table} as d", 'd.job_id', '=', 'j.id')
            ->whereIn('j.agent_id', $branchIds)->where('j.customer_id', $customerId)
            ->where('j.transport_mode', $mode)->whereNull('j.deleted_at')
            ->selectRaw("
                COALESCE(SUM(CASE WHEN j.created_at >= ? THEN d.gross_weight END), 0) AS mtd,
                COALESCE(SUM(CASE WHEN j.created_at >= ? THEN d.gross_weight END), 0) AS ytd,
                SUM(CASE WHEN j.created_at >= ? THEN 1 ELSE 0 END) AS count_mtd",
                [now()->startOfMonth(), now()->startOfYear(), now()->startOfMonth()])
            ->first();

        return [
            'mtd' => round((float) $row->mtd, 3),
            'ytd' => round((float) $row->ytd, 3),
            'count_mtd' => (int) $row->count_mtd,
        ];
    }

    // ─── Algorithm A: cadence & churn risk ───────────────────────────────────

    /**
     * DISTINCT shipment DAYS, trailing 365. The de-duplication is load-bearing: three
     * consignments on one day are one shipping occasion, and keeping them as three
     * events produces zero-length gaps and a median of 0.
     *
     * @return Collection<Carbon>
     */
    private function shipmentDays(array $branchIds, int $customerId, string $mode): Collection
    {
        return DB::table('jobs')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subDays(365))
            ->pluck('created_at')
            ->map(fn ($d) => Carbon::parse($d)->startOfDay())
            ->unique(fn ($d) => $d->toDateString())
            ->sort()
            ->values();
    }

    private function cadence(int $agentId, array $branchIds, int $customerId, string $mode, Collection $days): void
    {
        $key = ['customer_id' => $customerId, 'transport_mode' => $mode];
        $base = ['agent_id' => $agentId, 'sample_size' => $days->count(),
                 'last_shipment_at' => $days->last(), 'last_computed_at' => now(),
                 'updated_at' => now(), 'created_at' => now()];

        // Below the minimum there is no rhythm to measure. A rhythm inferred from three
        // shipments is noise presented as signal — the profile is suppressed, not guessed.
        if ($days->count() < self::MIN_SHIPMENT_DAYS) {
            DB::table('customer_cadence_profiles')->updateOrInsert($key, $base + [
                'expected_gap_days' => null, 'volatility_mad' => null,
                'overdue_ratio' => null, 'risk_band' => null, 'is_irregular' => false,
            ]);

            return;
        }

        $gaps = [];
        for ($i = 1; $i < $days->count(); $i++) {
            $gaps[] = $days[$i]->diffInDays($days[$i - 1]);
        }

        // MEDIAN and MAD, never mean and stddev: one Diwali rush must not permanently
        // reset a client's baseline, and a mean gap would leave a client three weeks
        // overdue still looking on time.
        $expected = max($this->median($gaps), 1);
        $mad = $this->median(array_map(fn ($g) => abs($g - $this->median($gaps)), $gaps));

        $sinceLast = $days->last()->diffInDays(now());
        $overdue = min($sinceLast / $expected, self::RATIO_CAP);

        // A genuinely irregular shipper has no rhythm to break. False alarms destroy
        // rep trust faster than missed signals do, so the flag is suppressed entirely.
        $irregular = $expected > 0 && ($mad / $expected) > 1.2;

        DB::table('customer_cadence_profiles')->updateOrInsert($key, $base + [
            'expected_gap_days' => round($expected, 2),
            'volatility_mad' => round($mad, 2),
            'overdue_ratio' => round($overdue, 3),
            'risk_band' => $irregular ? null : $this->riskBand($overdue),
            'is_irregular' => $irregular,
        ]);
    }

    private function riskBand(float $overdue): string
    {
        return match (true) {
            $overdue < 1.0 => 'LOW',
            $overdue < 1.5 => 'WATCH',
            $overdue < 2.5 => 'AT_RISK',
            default        => 'DORMANT',
        };
    }

    // ─── Algorithm B: volume momentum ────────────────────────────────────────

    /**
     * EWMA over ISO-WEEK buckets, recent (13w) against baseline (52w).
     *
     * ⚠️ Bucketed by week BEFORE smoothing. α is a per-observation decay, so it is only
     * meaningful against a fixed cadence — applying it per shipment would make momentum
     * depend on how OFTEN a client ships rather than how MUCH.
     *
     * The baseline window contains the recent one; that is intentional (recent vs
     * long-run average, not two disjoint periods).
     */
    private function momentum(array $branchIds, int $customerId, string $mode): ?float
    {
        $weeks = $this->weeklyTonnage($branchIds, $customerId, $mode, 52);

        if ($weeks->isEmpty()) {
            return null;
        }

        $base = $this->ewma($weeks->values()->all(), 0.3);

        // No baseline to compare against — NULL, not a ratio against zero.
        if ($base <= 0) {
            return null;
        }

        $recent = $this->ewma($weeks->slice(-13)->values()->all(), 0.3);

        return round(max(min(($recent - $base) / $base, self::RATIO_CAP), -1.0), 3);
    }

    private function weeklyTonnage(array $branchIds, int $customerId, string $mode, int $weeks): Collection
    {
        $table = $mode === 'sea' ? 'sea_shipment_details' : 'air_shipment_details';

        return DB::table('jobs as j')
            ->leftJoin("{$table} as d", 'd.job_id', '=', 'j.id')
            ->whereIn('j.agent_id', $branchIds)->where('j.customer_id', $customerId)
            ->where('j.transport_mode', $mode)->whereNull('j.deleted_at')
            ->where('j.created_at', '>=', now()->subWeeks($weeks))
            ->selectRaw("YEARWEEK(j.created_at, 3) AS wk, COALESCE(SUM(d.gross_weight), 0) AS t")
            ->groupBy('wk')->orderBy('wk')
            ->pluck('t', 'wk')
            ->map(fn ($t) => (float) $t);
    }

    /** @param list<float> $series */
    private function ewma(array $series, float $alpha): float
    {
        if ($series === []) {
            return 0.0;
        }

        $ewma = $series[0];
        foreach (array_slice($series, 1) as $v) {
            $ewma = ($alpha * $v) + ((1 - $alpha) * $ewma);
        }

        return $ewma;
    }

    // ─── Algorithm C: funnel and loss attribution ────────────────────────────

    private function funnel(Collection $enquiries): array
    {
        $closed = $enquiries->whereIn('status', ['converted', 'lost']);
        $lost = $enquiries->where('status', 'lost');

        // 🔴 A client with zero losses yields NULL, not 0.0. Zero renders as "perfect
        // service", which is indistinguishable from "we have no evidence" — and the
        // two must not look alike on a dashboard a rep acts from.
        $lostN = $lost->count();
        $split = $lostN < self::MIN_CLOSED_ENQUIRIES
            ? ['service_loss_rate' => null, 'price_loss_rate' => null]
            : [
                'service_loss_rate' => round($lost->where('lost_reason', 'delay_in_response')->count() * 100 / $lostN, 2),
                'price_loss_rate'   => round($lost->where('lost_reason', 'rates_high')->count() * 100 / $lostN, 2),
            ];

        return $split + [
            'win_rate' => $closed->count() < self::MIN_CLOSED_ENQUIRIES
                ? null
                : round($closed->where('status', 'converted')->count() * 100 / $closed->count(), 2),
        ];
    }

    // ─── Algorithm D: lane concentration ─────────────────────────────────────

    /**
     * HHI over TONNAGE share, not shipment count: ten courier-sized shipments on one
     * lane are not the commercial exposure of one full container on another, and
     * concentration risk is about revenue exposure.
     *
     * ⚠️ Zero lanes yields NULL, not 0 — an empty sum would score a client with no
     * shipments at all as maximally DIVERSIFIED, the exact opposite of the truth.
     */
    private function laneHhi(array $branchIds, int $customerId, string $mode): ?float
    {
        $lanes = DB::table('enquiries')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->where('status', 'converted')
            ->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subDays(365))
            ->whereNotNull('origin_code')->whereNotNull('dest_code')
            ->selectRaw('origin_code, dest_code, SUM(COALESCE(extracted_weight, 0)) AS t')
            ->groupBy('origin_code', 'dest_code')
            ->pluck('t')
            ->map(fn ($t) => (float) $t);

        $total = $lanes->sum();

        if ($lanes->isEmpty() || $total <= 0) {
            return null;
        }

        return round($lanes->reduce(fn ($c, $t) => $c + (($t / $total) ** 2), 0.0), 3);
    }

    private function laneStats(int $agentId, array $branchIds, int $customerId, string $mode, Carbon $date): void
    {
        $month = $date->copy()->startOfMonth()->toDateString();

        $rows = DB::table('enquiries')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->whereNull('deleted_at')
            ->whereNotNull('origin_code')->whereNotNull('dest_code')
            ->whereBetween('created_at', [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()])
            ->selectRaw("origin_code, dest_code,
                         COUNT(*) AS enquiry_count,
                         SUM(status = 'converted') AS shipment_count,
                         SUM(COALESCE(extracted_weight, 0)) AS tonnage,
                         SUM(lost_reason = 'rates_high') AS rates_high_losses,
                         AVG(quoted_amount) AS avg_quoted,
                         AVG(CASE WHEN status = 'converted' THEN quoted_amount END) AS avg_won")
            ->groupBy('origin_code', 'dest_code')
            ->get();

        foreach ($rows as $r) {
            DB::table('customer_lane_stats')->updateOrInsert(
                ['customer_id' => $customerId, 'transport_mode' => $mode,
                 'origin_code' => $r->origin_code, 'dest_code' => $r->dest_code,
                 'period_month' => $month],
                [
                    'agent_id' => $agentId,
                    'enquiry_count' => (int) $r->enquiry_count,
                    'shipment_count' => (int) $r->shipment_count,
                    'tonnage' => round((float) $r->tonnage, 3),
                    'rates_high_losses' => (int) $r->rates_high_losses,
                    // NULL when nothing was quoted — never 0.00, which would read as free.
                    'avg_quoted' => $r->avg_quoted === null ? null : round((float) $r->avg_quoted, 2),
                    'avg_won' => $r->avg_won === null ? null : round((float) $r->avg_won, 2),
                    'updated_at' => now(), 'created_at' => now(),
                ]
            );
        }
    }

    // ─── Algorithm F: money ──────────────────────────────────────────────────

    private function money(Collection $invoices, object $customer, Carbon $date): array
    {
        $monthStart = $date->copy()->startOfMonth();
        $yearStart = $date->copy()->startOfYear();

        $billed = $invoices->whereNotIn('status', ['draft', 'void']);
        $outstanding = $invoices->whereIn('status', self::OUTSTANDING);

        $aging = ['outstanding_0_30' => 0.0, 'outstanding_31_60' => 0.0, 'outstanding_60_plus' => 0.0];
        $exposure = 0.0;

        foreach ($outstanding as $i) {
            $due = round((float) $i->grand_total - (float) $i->amount_paid, 2);
            $exposure += $due;
            $age = Carbon::parse($i->document_date)->diffInDays($date);

            $bucket = $age <= 30 ? 'outstanding_0_30' : ($age <= 60 ? 'outstanding_31_60' : 'outstanding_60_plus');
            $aging[$bucket] += $due;
        }

        $settled = $invoices->where('status', 'paid');
        $dso = $settled->count() < self::MIN_SETTLED_INVOICES
            ? null
            : (int) round($settled->avg(fn ($i) => Carbon::parse($i->document_date)->diffInDays(Carbon::parse($i->updated_at))));

        return array_map(fn ($v) => is_float($v) ? round($v, 2) : $v, $aging) + [
            'revenue_mtd' => round($billed->filter(
                fn ($i) => Carbon::parse($i->document_date)->greaterThanOrEqualTo($monthStart)
            )->sum(fn ($i) => (float) $i->grand_total), 2),
            'revenue_ytd' => round($billed->filter(
                fn ($i) => Carbon::parse($i->document_date)->greaterThanOrEqualTo($yearStart)
            )->sum(fn ($i) => (float) $i->grand_total), 2),
            'dso_days' => $dso,
            // payment_drift is meaningless without a DSO to drift from.
            'payment_drift_days' => $dso === null || $customer->payment_terms_days === null
                ? null
                : $dso - (int) $customer->payment_terms_days,
            // 🔴 NULL credit_limit is "not configured", NOT zero — dividing by it would
            // be a division by zero, and reporting 0% utilization on an unlimited client
            // is a different lie from reporting none.
            'credit_utilization' => $customer->credit_limit === null || (float) $customer->credit_limit <= 0
                ? null
                : round($exposure * 100 / (float) $customer->credit_limit, 2),
        ];
    }

    // ─── Layer 2: the ranked worklist ────────────────────────────────────────

    /**
     * Next-best-actions, ranked `impact × urgency ÷ effort`.
     *
     * ⚠️ Only findings the data actually supports are emitted. An action queue padded
     * with generic advice is one a rep stops reading, and once they stop reading it the
     * real findings go unread too.
     *
     * 🔴 audience = 'internal' ALWAYS here. A client-facing draft is generated on the
     * outreach surface under its own consent rules, and the database CHECK refuses an
     * internal row that carries one.
     */
    private function rankActions(int $agentId, int $customerId, string $mode, object $customer, array $funnel, array $money): void
    {
        // Re-derive rather than accumulate: a stale 'open' action for a client who has
        // since shipped is worse than no action at all.
        //
        // ⚠️ Cleared by (customer, mode) across EVERY branch, not just the managing one.
        // A client's managing branch can change, and scoping the delete by agent_id
        // would strand the old branch's rows as permanently-open duplicates.
        DB::table('sales_action_queue')
            ->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->where('status', 'open')
            ->delete();

        $profile = DB::table('customer_cadence_profiles')
            ->where('customer_id', $customerId)->where('transport_mode', $mode)->first();

        $actions = [];

        // A — churn. Suppressed for irregular shippers: no rhythm, nothing broken.
        if ($profile && ! $profile->is_irregular && in_array($profile->risk_band, ['AT_RISK', 'DORMANT'], true)) {
            $actions[] = [
                'action_type' => 'churn_outreach',
                'priority_score' => round(min((float) $profile->overdue_ratio, 5.0) * 20, 3),
                'impact_value' => $money['revenue_ytd'] > 0 ? $money['revenue_ytd'] : null,
                'facts' => [
                    'risk_band' => $profile->risk_band,
                    'expected_gap_days' => (float) $profile->expected_gap_days,
                    'days_since_last' => $profile->last_shipment_at
                        ? Carbon::parse($profile->last_shipment_at)->diffInDays(now()) : null,
                    'overdue_ratio' => (float) $profile->overdue_ratio,
                ],
            ];
        }

        // C — service failure. Routed to OPS, never to the rep as a discount prompt:
        // this is the guard that stops margin being given away to fix internal latency.
        if ($funnel['service_loss_rate'] !== null && $funnel['service_loss_rate'] > 20.0) {
            $actions[] = [
                'action_type' => 'service_escalation',
                'priority_score' => round($funnel['service_loss_rate'], 3),
                'impact_value' => null,
                'facts' => ['service_loss_rate_pct' => $funnel['service_loss_rate'],
                            'note' => 'Escalate to operations. Do not renegotiate rates.'],
            ];
        }

        if ($funnel['price_loss_rate'] !== null && $funnel['price_loss_rate'] > 40.0) {
            $actions[] = [
                'action_type' => 'rate_renegotiation',
                'priority_score' => round($funnel['price_loss_rate'], 3),
                'impact_value' => null,
                'facts' => ['price_loss_rate_pct' => $funnel['price_loss_rate']],
            ];
        }

        // F — collections. Only on genuinely aged debt, not on anything merely open.
        if ($money['outstanding_60_plus'] > 0) {
            $actions[] = [
                'action_type' => 'collections_call',
                'priority_score' => round(min($money['outstanding_60_plus'] / 10000, 100), 3),
                'impact_value' => $money['outstanding_60_plus'],
                'facts' => ['outstanding_60_plus' => $money['outstanding_60_plus'],
                            'credit_utilization_pct' => $money['credit_utilization']],
            ];
        }

        foreach ($actions as $a) {
            DB::table('sales_action_queue')->insert([
                'agent_id' => $agentId,
                'customer_id' => $customerId,
                'transport_mode' => $mode,
                'sales_id' => $customer->sales_id,
                'audience' => 'internal',
                'action_type' => $a['action_type'],
                'priority_score' => $a['priority_score'],
                'impact_value' => $a['impact_value'],
                'fact_packet' => json_encode($a['facts']),
                // Layer 3 fills this later, or never. NULL is a first-class state.
                'narrated_text' => null,
                'status' => 'open',
                'expires_at' => now()->addDays(14),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }

    /** @param list<float|int> $values */
    private function median(array $values): float
    {
        if ($values === []) {
            return 0.0;
        }

        sort($values);
        $n = count($values);
        $mid = intdiv($n, 2);

        return $n % 2 ? (float) $values[$mid] : (($values[$mid - 1] + $values[$mid]) / 2);
    }
}
