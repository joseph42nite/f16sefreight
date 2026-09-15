<?php

namespace App\Services\Sales;

use Illuminate\Support\Facades\DB;

/**
 * What is worth writing to a client about, from the trends the rollup already computed (PRD §7.3.7).
 *
 * 🔴 CLIENT-SAFE FACTS ONLY. Every figure here is the client's own: their shipping rhythm, their volume,
 * their lanes, their lost quotes. Nothing about our staff, our response times or our margin — those are
 * internal findings and the database refuses a draft on an internal row.
 *
 * ⚠️ Deterministic, like the rest of the rollup: the numbers are worked out here and Gemma only words them.
 */
class ClientFindings
{
    /** A client needs this many shipments in a year before lanes are offered — below it there is no pattern. */
    private const MIN_SHIPMENTS_FOR_LANES = 3;

    /** How far volume must move (recent 13 weeks against the 52-week average) to be worth an email. */
    private const MOMENTUM_THRESHOLD = 0.25;

    /**
     * @return list<array{action_type: string, priority_score: float, facts: array}>
     */
    public function for(array $branchIds, int $customerId, string $mode, ?object $profile, ?float $momentum, array $funnel): array
    {
        $usualLanes = $this->clientLanes($branchIds, $customerId, $mode);
        $findings = [];

        // A — stopped shipping. The strongest signal, so a volume email is not sent on top of it.
        if ($profile && ! $profile->is_irregular && in_array($profile->risk_band, ['AT_RISK', 'DORMANT'], true)) {
            $findings[] = [
                'action_type' => 'client_reactivation',
                'priority_score' => round(min((float) $profile->overdue_ratio, 5.0) * 20, 3),
                'facts' => [
                    'usually_ships_every_days' => (int) round((float) $profile->expected_gap_days),
                    'days_since_last_shipment' => (int) \Carbon\Carbon::parse($profile->last_shipment_at)->diffInDays(now()),
                    'usual_lanes' => array_keys(array_slice($usualLanes, 0, 2, true)),
                ],
            ];
        } elseif ($momentum !== null && $momentum <= -self::MOMENTUM_THRESHOLD) {
            // B — volume falling.
            $findings[] = [
                'action_type' => 'client_volume_drop',
                'priority_score' => round(abs($momentum) * 100, 3),
                'facts' => [
                    'volume_change_percent' => (int) round($momentum * 100),
                    'compared' => 'last 13 weeks against the 52-week average',
                    'usual_lanes' => array_keys(array_slice($usualLanes, 0, 2, true)),
                ],
            ];
        } elseif ($momentum !== null && $momentum >= self::MOMENTUM_THRESHOLD) {
            // B — volume growing: the moment to secure space and a rate before the peak.
            $findings[] = [
                'action_type' => 'client_volume_growth',
                'priority_score' => round(min($momentum, 2.0) * 50, 3),
                'facts' => [
                    'volume_change_percent' => (int) round($momentum * 100),
                    'compared' => 'last 13 weeks against the 52-week average',
                    'usual_lanes' => array_keys(array_slice($usualLanes, 0, 2, true)),
                ],
            ];
        }

        // C — quotes lost on price (the loss split's own guard: >= 5 losses, > 40% on price).
        if ($funnel['price_loss_rate'] !== null && $funnel['price_loss_rate'] > 40.0) {
            $lane = $this->mostLostOnPrice($branchIds, $customerId, $mode);

            if ($lane !== null) {
                $findings[] = [
                    'action_type' => 'client_rate_review',
                    'priority_score' => round($funnel['price_loss_rate'], 3),
                    'facts' => ['lane' => $lane['lane'], 'quotes_lost_on_price_last_year' => $lane['count']],
                ];
            }
        }

        // D — lanes the branch runs that this client does not use yet.
        if (array_sum($usualLanes) >= self::MIN_SHIPMENTS_FOR_LANES) {
            $offered = array_slice(array_diff(array_keys($this->branchLanes($branchIds, $mode)), array_keys($usualLanes)), 0, 3);

            if ($offered !== []) {
                $findings[] = [
                    'action_type' => 'client_new_lanes',
                    'priority_score' => 10.0 + 5 * count($offered),
                    'facts' => ['lanes_we_run' => array_values($offered), 'usual_lanes' => array_keys(array_slice($usualLanes, 0, 2, true))],
                ];
            }
        }

        return $findings;
    }

    /** The client's shipped lanes in the last year, busiest first: ["BOM → FRA" => 6, …]. */
    private function clientLanes(array $branchIds, int $customerId, string $mode): array
    {
        return $this->lanes(DB::table('enquiries')->where('customer_id', $customerId), $branchIds, $mode, 1);
    }

    /** Lanes the branches shipped for anyone in the last year, at least twice — lanes we genuinely run. */
    private function branchLanes(array $branchIds, string $mode): array
    {
        return $this->lanes(DB::table('enquiries'), $branchIds, $mode, 2);
    }

    private function lanes($query, array $branchIds, string $mode, int $atLeast): array
    {
        return $query->whereIn('agent_id', $branchIds)->where('transport_mode', $mode)
            ->where('status', 'converted')->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subDays(365))
            ->whereNotNull('origin_code')->whereNotNull('dest_code')
            ->selectRaw("CONCAT(origin_code, ' → ', dest_code) AS lane, COUNT(*) AS n")
            ->groupBy('origin_code', 'dest_code')
            ->havingRaw('COUNT(*) >= ?', [$atLeast])
            ->orderByDesc('n')
            ->pluck('n', 'lane')
            ->map(fn ($n) => (int) $n)
            ->all();
    }

    /** @return ?array{lane: string, count: int} the lane where most of this client's quotes were lost on price */
    private function mostLostOnPrice(array $branchIds, int $customerId, string $mode): ?array
    {
        $row = DB::table('enquiries')
            ->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)->where('transport_mode', $mode)
            ->where('status', 'lost')->where('lost_reason', 'rates_high')->whereNull('deleted_at')
            ->where('created_at', '>=', now()->subDays(365))
            ->whereNotNull('origin_code')->whereNotNull('dest_code')
            ->selectRaw("CONCAT(origin_code, ' → ', dest_code) AS lane, COUNT(*) AS n")
            ->groupBy('origin_code', 'dest_code')
            ->orderByDesc('n')
            ->first();

        return $row ? ['lane' => $row->lane, 'count' => (int) $row->n] : null;
    }
}
