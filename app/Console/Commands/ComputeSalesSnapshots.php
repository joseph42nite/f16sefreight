<?php

namespace App\Console\Commands;

use App\Services\Sales\ClientFindings;
use App\Services\Sales\ClientHistory;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * The nightly sales rollup. PRD.md §7.3.4.
 *
 *     php artisan sales:compute-snapshots [--date=YYYY-MM-DD] [--agent=ID]
 *
 * The dashboards never aggregate `jobs` or `enquiries` live; this is the only thing that reads them for
 * analytics, and everything the Sales page shows comes from what it writes.
 *
 * ═══ THE RULES EVERY FIGURE FOLLOWS (user, 2026-09-15) ═════════════════════
 *   • One source: `ClientHistory` — AWB figures once the waybill has gone to the airline, the client's
 *     mail otherwise, and lost enquiries always from the mail.
 *   • One window: the last 12 months (`ClientHistory::WINDOW_DAYS`) before the snapshot date.
 *   • Year to date starts on 1 April (the financial year).
 *   • No guessing: a figure without enough data is NULL ("—"), never 0. Minimums: 5 shipment days,
 *     5 closed enquiries, 3 invoices.
 *   • Deterministic: plain SQL and PHP. Gemma only ever words what this produces.
 *   • Per (client, transport mode) — air and sea are never blended.
 *
 * ═══ THE FORMULAS ════════════════════════════════════════════════════════════
 *   A  Rhythm      gaps between distinct shipment days → expected = median gap (≥ 1 day),
 *                  wobble = median absolute deviation, overdue = days since last ÷ expected.
 *                  LOW < 1 · WATCH < 1.5 · AT_RISK < 2.5 · DORMANT. No band when wobble ÷ expected > 1.2.
 *   B  Trend       (average weekly kg over the last 13 weeks − average over 52 weeks) ÷ the 52-week average.
 *                  Empty weeks count as zero. Clamped to [−1, 999.999].
 *   C  Funnel      win rate = converted ÷ (converted + lost); lost on price / on service = that reason ÷ all lost.
 *   D  Lanes       concentration (HHI) = Σ (lane kg ÷ total kg)².
 *   F  Money       revenue and tonnage MTD / YTD; aging 0–30 / 31–60 / 60+ by invoice date;
 *                  DSO = value-weighted days from invoice to payment (bank match date) for paid invoices,
 *                  and to today for unpaid ones past their terms; drift = DSO − payment terms;
 *                  credit use = amount owed ÷ credit limit.
 */
class ComputeSalesSnapshots extends Command
{
    protected $signature = 'sales:compute-snapshots
                            {--agent= : Limit to one branch}
                            {--date= : Snapshot date (defaults to today)}';

    protected $description = 'Roll raw operational data into the sales engine tables';

    private const MIN_SHIPMENT_DAYS = 5;
    private const MIN_CLOSED_ENQUIRIES = 5;
    private const MIN_INVOICES = 3;

    /** DECIMAL(6,3) tops out here. */
    private const RATIO_CAP = 999.999;

    /** Invoices still owed. */
    private const OUTSTANDING = ['finalized', 'sent', 'partially_paid'];

    /** A client email of the same kind, sent or dismissed, is not suggested again for this long. */
    private const REST_DAYS = 30;

    /** When a client has no payment terms on file. */
    private const DEFAULT_TERMS_DAYS = 30;

    public function __construct(private readonly ClientHistory $history, private readonly ClientFindings $findings)
    {
        parent::__construct();
    }

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
     * Per COMPANY, not per branch: the snapshot's unique key is (customer, mode, date), and a client is
     * tenant-wide — rolling per branch let the second branch overwrite the first (GAPS #28).
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

        // Every (client, mode) with ANY enquiry — a client who only ever loses is exactly the one the loss
        // split exists to surface.
        $pairs = DB::table('enquiries')
            ->whereIn('agent_id', $branchIds)->whereNotNull('customer_id')->whereNull('deleted_at')
            ->select('customer_id', 'transport_mode')->distinct()->get();

        // The lanes the branches run, for offering new ones — read once per mode.
        $branchShipments = [];

        foreach ($pairs as $pair) {
            $mode = $pair->transport_mode;
            $branchShipments[$mode] ??= $this->history->shipments($branchIds, null, $mode, $date);
            $this->rollClient($branchIds, (int) $pair->customer_id, $mode, $date, $branchShipments[$mode]);
        }

        return $pairs->count();
    }

    private function rollClient(array $branchIds, int $customerId, string $mode, Carbon $date, Collection $branchShipments): void
    {
        $customer = DB::table('customers')->find($customerId);

        if ($customer === null) {
            return;
        }

        // The managing branch — the only defensible value for a column the unique key does not scope by.
        $agentId = in_array((int) $customer->branch_id, $branchIds, true) ? (int) $customer->branch_id : $branchIds[0];

        $shipments = $this->history->shipments($branchIds, $customerId, $mode, $date);
        $enquiries = $this->history->enquiries($branchIds, $customerId, $mode, $date);
        $invoices = DB::table('accounts_invoices')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)->where('transport_mode', $mode)
            ->get();

        $funnel = $this->funnel($enquiries);
        $money = $this->money($invoices, $customer, $date);
        $momentum = $this->momentum($shipments, $date);
        $monthStart = $date->copy()->startOfMonth();
        $yearStart = ClientHistory::financialYearStart($date);

        DB::table('customer_performance_snapshots')->updateOrInsert(
            ['customer_id' => $customerId, 'transport_mode' => $mode, 'snapshot_date' => $date->toDateString()],
            array_merge([
                'agent_id' => $agentId,
                'tonnage_mtd' => round($shipments->where('day', '>=', $monthStart)->sum('weight'), 3),
                'tonnage_ytd' => round($shipments->where('day', '>=', $yearStart)->sum('weight'), 3),
                'shipment_count_mtd' => $shipments->where('day', '>=', $monthStart)->count(),
                'enquiry_count_mtd' => $enquiries->filter(fn ($e) => Carbon::parse($e->created_at)->gte($monthStart))->count(),
                'momentum' => $momentum,
                'lane_hhi' => $this->laneConcentration($shipments),
                'last_computed_at' => now(),
                'updated_at' => now(),
                'created_at' => now(),
            ], $funnel, $money)
        );

        $profile = $this->rhythm($agentId, $customerId, $mode, $shipments, $date);
        $this->laneStats($agentId, $customerId, $mode, $shipments, $enquiries, $date);
        $this->rankActions($agentId, $customerId, $mode, $customer, $profile, $funnel, $money, $date);
        $this->clientEmails($agentId, $customerId, $mode, $customer, $profile, $momentum, $funnel, $shipments, $branchShipments, $enquiries, $date);
    }

    // ─── A: rhythm (churn risk) ─────────────────────────────────────────────

    /**
     * Distinct shipment DAYS: three consignments on one day are one shipping occasion, and counting them
     * as three would make zero-day gaps and a median of 0. Median and MAD, never mean and stddev, so one
     * peak season does not reset a client's baseline.
     */
    private function rhythm(int $agentId, int $customerId, string $mode, Collection $shipments, Carbon $date): object
    {
        $days = $shipments->pluck('day')->unique(fn ($d) => $d->toDateString())->sort()->values();

        $row = [
            'agent_id' => $agentId, 'sample_size' => $days->count(), 'last_shipment_at' => $days->last(),
            'expected_gap_days' => null, 'volatility_mad' => null, 'overdue_ratio' => null,
            'risk_band' => null, 'is_irregular' => false,
            'last_computed_at' => now(), 'updated_at' => now(), 'created_at' => now(),
        ];

        if ($days->count() >= self::MIN_SHIPMENT_DAYS) {
            $gaps = [];
            for ($i = 1; $i < $days->count(); $i++) {
                $gaps[] = $days[$i]->diffInDays($days[$i - 1]);
            }

            $median = $this->median($gaps);
            $expected = max($median, 1);
            $wobble = $this->median(array_map(fn ($g) => abs($g - $median), $gaps));
            $overdue = min($days->last()->diffInDays($date) / $expected, self::RATIO_CAP);
            $irregular = ($wobble / $expected) > 1.2;

            $row = array_merge($row, [
                'expected_gap_days' => round($expected, 2),
                'volatility_mad' => round($wobble, 2),
                'overdue_ratio' => round($overdue, 3),
                // A genuinely irregular shipper has no rhythm to break.
                'risk_band' => $irregular ? null : match (true) {
                    $overdue < 1.0 => 'LOW',
                    $overdue < 1.5 => 'WATCH',
                    $overdue < 2.5 => 'AT_RISK',
                    default => 'DORMANT',
                },
                'is_irregular' => $irregular,
            ]);
        }

        DB::table('customer_cadence_profiles')->updateOrInsert(['customer_id' => $customerId, 'transport_mode' => $mode], $row);

        return (object) $row;
    }

    // ─── B: volume trend ────────────────────────────────────────────────────

    /**
     * Plain weekly averages (user, 2026-09-15), empty weeks counted as zero: the 12-month window is 52
     * weeks, so the yearly average is its total ÷ 52 and the recent average the last 13 weeks' total ÷ 13.
     *
     * ⚠️ Replaces the PRD's EWMA (α = 0.3): that remembers only about the last six weeks, so its "recent"
     * and "yearly" values were nearly identical and the trend read ~0% even for a client who had stopped.
     */
    private function momentum(Collection $shipments, Carbon $date): ?float
    {
        if ($shipments->pluck('day')->unique(fn ($d) => $d->toDateString())->count() < self::MIN_SHIPMENT_DAYS) {
            return null;
        }

        $yearly = $shipments->sum('weight') / 52;

        if ($yearly <= 0) {
            return null;
        }

        $recent = $shipments->where('day', '>', $date->copy()->subWeeks(13))->sum('weight') / 13;

        return round(max(min(($recent - $yearly) / $yearly, self::RATIO_CAP), -1.0), 3);
    }

    // ─── C: funnel and why quotes were lost ─────────────────────────────────

    private function funnel(Collection $enquiries): array
    {
        $closed = $enquiries->whereIn('status', ['converted', 'lost']);
        $lost = $enquiries->where('status', 'lost');
        $rate = fn (int $part, int $whole) => round($part * 100 / $whole, 2);

        return [
            // Zero losses is "no evidence", not "perfect service" — NULL until there are enough.
            'service_loss_rate' => $lost->count() < self::MIN_CLOSED_ENQUIRIES ? null
                : $rate($lost->where('lost_reason', 'delay_in_response')->count(), $lost->count()),
            'price_loss_rate' => $lost->count() < self::MIN_CLOSED_ENQUIRIES ? null
                : $rate($lost->where('lost_reason', 'rates_high')->count(), $lost->count()),
            'win_rate' => $closed->count() < self::MIN_CLOSED_ENQUIRIES ? null
                : $rate($closed->where('status', 'converted')->count(), $closed->count()),
        ];
    }

    // ─── D: lanes ───────────────────────────────────────────────────────────

    /** HHI over kg share. No lanes is NULL, not 0 — an empty sum would read as "fully diversified". */
    private function laneConcentration(Collection $shipments): ?float
    {
        $byLane = $shipments->whereNotNull('lane')->groupBy('lane')->map->sum('weight');
        $total = $byLane->sum();

        if ($total <= 0) {
            return null;
        }

        return round($byLane->reduce(fn ($hhi, $kg) => $hhi + ($kg / $total) ** 2, 0.0), 3);
    }

    /**
     * The monthly lane table the charts read, rewritten for all 12 months of the window each run, so the
     * tonnage chart has a year of months rather than only the ones the rollup happened to run in.
     */
    private function laneStats(int $agentId, int $customerId, string $mode, Collection $shipments, Collection $enquiries, Carbon $date): void
    {
        $month = fn ($d) => Carbon::parse($d)->startOfMonth()->toDateString();

        $keys = $shipments->whereNotNull('lane')->map(fn ($s) => $month($s->day) . '|' . $s->lane)
            ->merge($enquiries->whereNotNull('lane')->map(fn ($e) => $month($e->created_at) . '|' . $e->lane))
            ->unique();

        foreach ($keys as $key) {
            [$period, $lane] = explode('|', $key);
            [$origin, $dest] = explode(' → ', $lane);
            $shipped = $shipments->filter(fn ($s) => $s->lane === $lane && $month($s->day) === $period);
            $asked = $enquiries->filter(fn ($e) => $e->lane === $lane && $month($e->created_at) === $period);
            $quoted = $asked->whereNotNull('quoted_amount');
            $won = $quoted->where('status', 'converted');

            DB::table('customer_lane_stats')->updateOrInsert(
                ['customer_id' => $customerId, 'transport_mode' => $mode, 'origin_code' => $origin, 'dest_code' => $dest, 'period_month' => $period],
                [
                    'agent_id' => $agentId,
                    'shipment_count' => $shipped->count(),
                    'tonnage' => round($shipped->sum('weight'), 3),
                    'enquiry_count' => $asked->count(),
                    'rates_high_losses' => $asked->where('lost_reason', 'rates_high')->count(),
                    // NULL when nothing was quoted — never 0.00, which would read as free.
                    'avg_quoted' => $quoted->isEmpty() ? null : round($quoted->avg('quoted_amount'), 2),
                    'avg_won' => $won->isEmpty() ? null : round($won->avg('quoted_amount'), 2),
                    'updated_at' => now(), 'created_at' => now(),
                ]
            );
        }
    }

    // ─── F: money ───────────────────────────────────────────────────────────

    private function money(Collection $invoices, object $customer, Carbon $date): array
    {
        $monthStart = $date->copy()->startOfMonth();
        $yearStart = ClientHistory::financialYearStart($date);
        $billed = $invoices->whereNotIn('status', ['draft', 'void']);
        $outstanding = $invoices->whereIn('status', self::OUTSTANDING);
        $owed = fn ($i) => round((float) $i->grand_total - (float) $i->amount_paid, 2);

        $aging = ['outstanding_0_30' => 0.0, 'outstanding_31_60' => 0.0, 'outstanding_60_plus' => 0.0];
        foreach ($outstanding as $i) {
            $age = Carbon::parse($i->document_date)->diffInDays($date);
            $aging[$age <= 30 ? 'outstanding_0_30' : ($age <= 60 ? 'outstanding_31_60' : 'outstanding_60_plus')] += $owed($i);
        }

        $dso = $this->daysToPay($invoices, $customer, $date);
        $exposure = $outstanding->sum($owed);

        return array_map(fn ($v) => round($v, 2), $aging) + [
            'revenue_mtd' => round($billed->filter(fn ($i) => Carbon::parse($i->document_date)->gte($monthStart))->sum('grand_total'), 2),
            'revenue_ytd' => round($billed->filter(fn ($i) => Carbon::parse($i->document_date)->gte($yearStart))->sum('grand_total'), 2),
            'dso_days' => $dso,
            'payment_drift_days' => $dso === null ? null : $dso - (int) ($customer->payment_terms_days ?? self::DEFAULT_TERMS_DAYS),
            // No limit on file is NULL ("not set"), not 0% used — and never a division by zero.
            'credit_utilization' => (float) $customer->credit_limit > 0 ? round($exposure * 100 / (float) $customer->credit_limit, 2) : null,
        ];
    }

    /**
     * Days to pay, weighted by invoice value (PRD §7.3.4 F). Paid invoices count to the day the bank
     * payment was matched (the invoice's last update when no match is on file); unpaid invoices past their
     * terms count to today — leaving them out would make a client who never pays look like the best payer.
     */
    private function daysToPay(Collection $invoices, object $customer, Carbon $date): ?int
    {
        $terms = (int) ($customer->payment_terms_days ?? self::DEFAULT_TERMS_DAYS);
        $paid = $invoices->where('status', 'paid');
        $overdue = $invoices->whereIn('status', self::OUTSTANDING)
            ->filter(fn ($i) => Carbon::parse($i->document_date)->addDays($terms)->lt($date));

        if ($paid->count() + $overdue->count() < self::MIN_INVOICES) {
            return null;
        }

        $matched = DB::table('bank_transactions')->whereIn('matched_invoice_id', $paid->pluck('id'))
            ->groupBy('matched_invoice_id')->selectRaw('matched_invoice_id, MAX(created_at) AS paid_at')
            ->pluck('paid_at', 'matched_invoice_id');

        $days = $paid->map(fn ($i) => [Carbon::parse($i->document_date)->diffInDays(Carbon::parse($matched[$i->id] ?? $i->updated_at)), (float) $i->grand_total])
            ->merge($overdue->map(fn ($i) => [Carbon::parse($i->document_date)->diffInDays($date), (float) $i->grand_total]));

        $value = $days->sum(fn ($d) => $d[1]);

        return $value > 0 ? (int) round($days->sum(fn ($d) => $d[0] * $d[1]) / $value) : null;
    }

    // ─── The worklists ──────────────────────────────────────────────────────

    /**
     * Today's actions for the rep and the branch — INTERNAL findings. Re-derived each run: a stale action
     * for a client who has since shipped is worse than none.
     */
    private function rankActions(int $agentId, int $customerId, string $mode, object $customer, object $profile, array $funnel, array $money, Carbon $date): void
    {
        // ⚠️ Internal rows only: a client email the rep has drafted is theirs until they send or dismiss it.
        DB::table('sales_action_queue')
            ->where('customer_id', $customerId)->where('transport_mode', $mode)
            ->where('audience', 'internal')->where('status', 'open')
            ->delete();

        $actions = [];

        if (in_array($profile->risk_band, ['AT_RISK', 'DORMANT'], true)) {
            $actions[] = ['churn_outreach', round(min((float) $profile->overdue_ratio, 5.0) * 20, 3), $money['revenue_ytd'] > 0 ? $money['revenue_ytd'] : null, [
                'risk_band' => $profile->risk_band,
                'expected_gap_days' => (float) $profile->expected_gap_days,
                'days_since_last' => Carbon::parse($profile->last_shipment_at)->diffInDays($date),
                'overdue_ratio' => (float) $profile->overdue_ratio,
            ]];
        }

        // Lost on service goes to OPERATIONS, never to the rep as a discount — our latency is not fixed by price.
        if ($funnel['service_loss_rate'] !== null && $funnel['service_loss_rate'] > 20.0) {
            $actions[] = ['service_escalation', $funnel['service_loss_rate'], null, [
                'service_loss_rate_pct' => $funnel['service_loss_rate'], 'note' => 'Escalate to operations. Do not renegotiate rates.',
            ]];
        }

        if ($funnel['price_loss_rate'] !== null && $funnel['price_loss_rate'] > 40.0) {
            $actions[] = ['rate_renegotiation', $funnel['price_loss_rate'], null, ['price_loss_rate_pct' => $funnel['price_loss_rate']]];
        }

        if ($money['outstanding_60_plus'] > 0) {
            $actions[] = ['collections_call', round(min($money['outstanding_60_plus'] / 10000, 100), 3), $money['outstanding_60_plus'], [
                'outstanding_60_plus' => $money['outstanding_60_plus'], 'credit_utilization_pct' => $money['credit_utilization'],
            ]];
        }

        foreach ($actions as [$type, $score, $impact, $facts]) {
            $this->queue($agentId, $customerId, $mode, $customer, 'internal', $type, $score, $impact, $facts);
        }
    }

    /**
     * Client emails (PRD §7.3.7) — CLIENT findings the rep drafts and sends. Re-derived each run like the
     * internal list, except one the rep has drafted, or sent or dismissed in the last 30 days.
     */
    private function clientEmails(int $agentId, int $customerId, string $mode, object $customer, object $profile, ?float $momentum, array $funnel, Collection $shipments, Collection $branchShipments, Collection $enquiries, Carbon $date): void
    {
        DB::table('sales_action_queue')
            ->where('customer_id', $customerId)->where('transport_mode', $mode)
            ->where('audience', 'client')->where('status', 'open')->whereNull('draft_generated_at')
            ->delete();

        // A drafted one is the rep's; one sent or dismissed rests for 30 days (user, 2026-09-15).
        $rest = $date->copy()->subDays(self::REST_DAYS);
        $held = DB::table('sales_action_queue')
            ->where('customer_id', $customerId)->where('transport_mode', $mode)->where('audience', 'client')
            ->where(fn ($q) => $q->where('status', 'open')
                ->orWhere(fn ($d) => $d->where('status', 'dismissed')->where('dismissed_at', '>=', $rest))
                ->orWhere(fn ($s) => $s->where('status', 'acted')->where('sent_at', '>=', $rest)))
            ->pluck('action_type')->all();

        foreach ($this->findings->for($profile, $momentum, $funnel, $shipments, $branchShipments, $enquiries, $date) as $f) {
            if (! in_array($f['action_type'], $held, true)) {
                $this->queue($agentId, $customerId, $mode, $customer, 'client', $f['action_type'], $f['priority_score'], null, $f['facts']);
            }
        }
    }

    private function queue(int $agentId, int $customerId, string $mode, object $customer, string $audience, string $type, float $score, ?float $impact, array $facts): void
    {
        DB::table('sales_action_queue')->insert([
            'agent_id' => $agentId, 'customer_id' => $customerId, 'transport_mode' => $mode,
            'sales_id' => $customer->sales_id, 'audience' => $audience, 'action_type' => $type,
            'priority_score' => $score, 'impact_value' => $impact, 'fact_packet' => json_encode($facts),
            'status' => 'open', 'expires_at' => now()->addDays(14),
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** @param list<float|int> $values */
    private function median(array $values): float
    {
        if ($values === []) {
            return 0.0;
        }

        sort($values);
        $mid = intdiv(count($values), 2);

        return count($values) % 2 ? (float) $values[$mid] : ($values[$mid - 1] + $values[$mid]) / 2;
    }
}
