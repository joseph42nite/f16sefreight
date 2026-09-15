<?php

namespace App\Services\Sales;

use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * What is worth writing to a client about, from the figures the rollup already worked out (PRD §7.3.7).
 *
 * 🔴 CLIENT-SAFE FACTS ONLY. Every figure is the client's own — their rhythm, volume, lanes, lost quotes.
 * Nothing about our staff, response times or margin: those are internal findings, and the database refuses
 * a draft on an internal row.
 *
 * Shipments and enquiries come from `ClientHistory`, the same 12 months every other sales figure uses.
 */
class ClientFindings
{
    /** How far the volume trend must move to be worth an email. */
    private const TREND_THRESHOLD = 0.25;

    /** Share of lost quotes lost on price before a rate review is offered (the loss split's own minimums apply). */
    private const PRICE_LOSS_PERCENT = 40.0;

    /** Shipments a client needs in the window before lanes are offered — below it there is no pattern. */
    private const MIN_SHIPMENTS_FOR_LANES = 3;

    /** A lane the branch shipped at least this often is one it genuinely runs. */
    private const BRANCH_LANE_MIN = 2;

    /**
     * @param  object  $profile  the client's rhythm (risk_band, overdue_ratio, expected_gap_days, last_shipment_at)
     * @return list<array{action_type: string, priority_score: float, facts: array}>
     */
    public function for(object $profile, ?float $trend, array $funnel, Collection $shipments, Collection $branchShipments, Collection $enquiries, Carbon $date): array
    {
        $lanes = $shipments->whereNotNull('lane')->countBy('lane')->sortDesc();
        $usual = $lanes->keys()->take(2)->values()->all();
        $findings = [];

        // A — stopped shipping. The strongest signal, so no volume email is sent on top of it.
        if (in_array($profile->risk_band, ['AT_RISK', 'DORMANT'], true)) {
            $findings[] = $this->finding('client_reactivation', min((float) $profile->overdue_ratio, 5.0) * 20, [
                'usually_ships_every_days' => (int) round((float) $profile->expected_gap_days),
                'days_since_last_shipment' => (int) Carbon::parse($profile->last_shipment_at)->diffInDays($date),
                'usual_lanes' => $usual,
            ]);
        } elseif ($trend !== null && abs($trend) >= self::TREND_THRESHOLD) {
            // B — volume down, or up: up is the moment to secure space and a rate.
            $findings[] = $this->finding($trend < 0 ? 'client_volume_drop' : 'client_volume_growth', min(abs($trend), 2.0) * 50, [
                'volume_change_percent' => (int) round($trend * 100),
                'compared' => 'last 13 weeks against the 12-month weekly average',
                'usual_lanes' => $usual,
            ]);
        }

        // C — quotes lost on price, on the lane where most were lost (lost enquiries are read from the mail).
        if ($funnel['price_loss_rate'] !== null && $funnel['price_loss_rate'] > self::PRICE_LOSS_PERCENT) {
            $lostOn = $enquiries->where('status', 'lost')->where('lost_reason', 'rates_high')->whereNotNull('lane')->countBy('lane')->sortDesc();

            if ($lostOn->isNotEmpty()) {
                $findings[] = $this->finding('client_rate_review', $funnel['price_loss_rate'], [
                    'lane' => $lostOn->keys()->first(),
                    'quotes_lost_on_price_last_12_months' => $lostOn->first(),
                ]);
            }
        }

        // D — lanes the branch runs that this client does not use yet.
        if ($shipments->count() >= self::MIN_SHIPMENTS_FOR_LANES) {
            $offered = $branchShipments->whereNotNull('lane')->countBy('lane')
                ->filter(fn ($n) => $n >= self::BRANCH_LANE_MIN)->sortDesc()
                ->keys()->diff($lanes->keys())->take(3)->values()->all();

            if ($offered !== []) {
                $findings[] = $this->finding('client_new_lanes', 10 + 5 * count($offered), ['lanes_we_run' => $offered, 'usual_lanes' => $usual]);
            }
        }

        return $findings;
    }

    private function finding(string $type, float $score, array $facts): array
    {
        return ['action_type' => $type, 'priority_score' => round($score, 3), 'facts' => $facts];
    }
}
