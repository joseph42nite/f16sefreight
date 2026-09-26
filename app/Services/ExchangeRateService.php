<?php

namespace App\Services;

use App\AccountsInvoice;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Rupees per unit of a foreign currency, and what a rupee receipt settles on a foreign invoice (user, 2026-09-26;
 * GAPS #411: "USD arrives converted to INR; look up the rate").
 *
 * 🔴 **The books are in INR.** An invoice is booked at ITS OWN rate — `accounts_invoices.exchange_rate`, the rate of
 * its document date. Money from a bank in India arrives in rupees; those rupees settle the invoice's currency at the
 * rate of the day they arrived, and the difference against the booked value is realised exchange, posted to
 * `5500-Forex-Gain-Loss` (PRD §6.4). No rate for the day is a REFUSAL, never a guess: a posting at a made-up rate is a
 * wrong figure in the ledger that nothing downstream can detect.
 *
 * Rates come from CurrencyFreaks (`services.currency_rate`), stored a day at a time in `exchange_rates` by
 * `fx:fetch-rates`. The free plan serves today's rates only, so history is what has been stored — which is why a
 * rate is read back rather than asked for.
 */
class ExchangeRateService
{
    public const BASE = 'INR';

    /** A day's rate stands for up to a week — weekends, bank holidays, a missed fetch — and no longer. */
    public const MAX_AGE_DAYS = 7;

    /**
     * Rupees within 2% of a foreign balance at the day's rate pay it IN FULL: the bank's conversion spread is exchange,
     * not a client who short-paid by a few dollars. The same band bank matching already uses.
     */
    public const TOLERANCE = 0.02;

    /** Rupees for one unit of `$currency` on `$date`, or NULL when none is on file for that week. */
    public function rate(?string $currency, $date): ?float
    {
        $currency = strtoupper($currency ?: self::BASE);

        if ($currency === self::BASE) {
            return 1.0;
        }

        $day = Carbon::parse($date)->toDateString();
        $stored = fn () => DB::table('exchange_rates')
            ->where('from_currency', $currency)->where('to_currency', self::BASE)
            ->whereBetween('rate_date', [Carbon::parse($day)->subDays(self::MAX_AGE_DAYS)->toDateString(), $day])
            ->orderByDesc('rate_date')->value('rate');

        $rate = $stored();

        // Today's may simply not have been fetched yet — the only day the provider can still be asked for.
        if ($rate === null && $day === now()->toDateString() && $this->fetchLatest() > 0) {
            $rate = $stored();
        }

        return $rate === null ? null : (float) $rate;
    }

    /**
     * Today's rates from CurrencyFreaks into `exchange_rates`. Returns how many were stored; 0 with no key set or on
     * any failure — logged by status, never with the key.
     */
    public function fetchLatest(): int
    {
        $token = config('services.currency_rate.token');

        if (blank($token)) {
            return 0;
        }

        $symbols = collect(config('services.currency_rate.symbols', []))->map(fn ($s) => strtoupper(trim($s)))
            ->filter()->push(self::BASE)->unique()->implode(',');

        try {
            $response = Http::timeout(10)->get(rtrim(config('services.currency_rate.base'), '/') . '/rates/latest',
                ['apikey' => $token, 'symbols' => $symbols]);
        } catch (\Throwable $e) {
            Log::warning('fx: rate fetch failed', ['error' => class_basename($e)]);

            return 0;
        }

        // The free plan's base is USD: rupees per X = rupees per dollar ÷ X per dollar.
        $rates = $response->ok() ? (array) $response->json('rates', []) : [];
        $inrPerUsd = (float) ($rates[self::BASE] ?? 0);

        if ($inrPerUsd <= 0) {
            Log::warning('fx: no usable rates', ['status' => $response->status()]);

            return 0;
        }

        $day = now()->toDateString();
        $stored = 0;

        foreach ($rates as $code => $perUsd) {
            if ($code === self::BASE || (float) $perUsd <= 0) {
                continue;
            }

            DB::table('exchange_rates')->updateOrInsert(
                ['from_currency' => $code, 'to_currency' => self::BASE, 'rate_date' => $day],
                ['rate' => round($inrPerUsd / (float) $perUsd, 6), 'updated_at' => now(), 'created_at' => now()]
            );
            $stored++;
        }

        return $stored;
    }

    /**
     * What `$inr` received on `$date` settles on `$invoice`, in the invoice's currency, and the exchange in it.
     *
     *   settles  = rupees ÷ the day's rate — the whole balance when within TOLERANCE of it
     *   exchange = rupees − settles × the invoice's own rate      (+ gain, − loss)
     *
     * An INR invoice settles rupee for rupee with no exchange. NULL when the day has no rate on file.
     *
     * @return array{invoice_amount: float, rate: float, forex: float}|null
     */
    public function settle(AccountsInvoice $invoice, float $inr, $date): ?array
    {
        if (strtoupper($invoice->currency ?: self::BASE) === self::BASE) {
            return ['invoice_amount' => round($inr, 2), 'rate' => 1.0, 'forex' => 0.0];
        }

        $rate = $this->rate($invoice->currency, $date);

        if ($rate === null) {
            return null;
        }

        $outstanding = $invoice->outstanding();
        $settles = round($inr / $rate, 2);

        if ($outstanding > 0 && abs($settles - $outstanding) <= round($outstanding * self::TOLERANCE, 2)) {
            $settles = $outstanding;
        }

        return ['invoice_amount' => $settles, 'rate' => $rate, 'forex' => round($inr - $this->booked($invoice, $settles), 2)];
    }

    /** Rupees at the invoice's own rate — what an amount of it is carried at in the books. */
    public function booked(AccountsInvoice $invoice, float $amount): float
    {
        return round($amount * (float) ($invoice->exchange_rate ?: 1), 2);
    }

    /** The refusal every caller gives when the day has no rate. */
    public static function noRate(?string $currency, $date): array
    {
        return [
            'error' => sprintf('No %s rate on file for the week to %s. Fetch today\'s rates in Settings → Finance, or '
                . 'ask whoever manages the rate key (RATE_TOKEN).', strtoupper((string) $currency), Carbon::parse($date)->toDateString()),
            'reason' => 'no_exchange_rate',
        ];
    }
}
