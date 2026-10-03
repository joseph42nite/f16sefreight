<?php

namespace App\Services\Sales;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * The Composite Client Health Score (PRD §7.3.4 H) — and its parts, because the PRD says the Sales page shows the
 * component bars, never the bare number: a rep cannot act on "62" without knowing which part pulled it down.
 *
 * Every part is mapped to [0, 1], 1 = healthiest, or NULL when there is too little data. NULL is never read as 0;
 * it is dropped and the remaining weights re-normalised. Fewer than `min_components` parts ⇒ no score.
 *
 * ⚠️ **Payment is the client's report card, not this mode's DSO drift** (owner, 2026-10-03). The card grades the
 * client's bills in air and sea together — the one exception to "air and sea are never blended" (PRD §7.3.2), taken
 * because a client pays one ledger. The same payment part therefore appears on their air and sea scores.
 */
class ClientHealth
{
    /**
     * @param  float|null  $winRate    percent (0–100), as the snapshot stores it
     * @param  float|null  $opsHealth  percent (0–100), as the snapshot column is typed
     * @return array<string, float|null>  part => [0, 1] or NULL
     */
    public function components(?float $momentum, ?string $band, ?float $winRate, ?int $paymentScore, ?float $opsHealth): array
    {
        $clamp = fn (float $v) => round(max(0.0, min(1.0, $v)), 3);

        return [
            'momentum' => $momentum === null ? null : $clamp(($momentum + 1) / 2),
            'churn' => $band === null ? null : (config('client_health.churn_bands')[$band] ?? null),
            'win_rate' => $winRate === null ? null : $clamp($winRate / 100),
            'payment' => $paymentScore === null ? null : $clamp($paymentScore / 100),
            'ops' => $opsHealth === null ? null : $clamp($opsHealth / 100),
        ];
    }

    /** 0–100, or NULL when too few parts have data. */
    public function score(array $components): ?float
    {
        $weights = config('client_health.weights');
        $present = array_filter($components, fn ($v) => $v !== null);

        if (count($present) < (int) config('client_health.min_components')) {
            return null;
        }

        $total = array_sum(array_intersect_key($weights, $present));

        if ($total <= 0) {
            return null;
        }

        $sum = 0.0;
        foreach ($present as $part => $value) {
            $sum += $weights[$part] * $value;
        }

        return round($sum / $total * 100, 2);
    }

    /**
     * The card's score, 0–100: the latest card for a month that has started by `$date`, if it is this month's or
     * last month's — an older card describes a habit that may be gone. An ungraded card (too few bills) is NULL.
     */
    public function paymentScore(int $customerId, Carbon $date): ?int
    {
        $score = DB::table('client_payment_reports')->where('customer_id', $customerId)
            ->where('month', '<=', $date->toDateString())
            ->where('month', '>=', $date->copy()->startOfMonth()->subMonth()->toDateString())
            ->orderByDesc('month')->value('score');

        return $score === null ? null : (int) $score;
    }
}
