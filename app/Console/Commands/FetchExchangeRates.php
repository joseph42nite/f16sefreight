<?php

namespace App\Console\Commands;

use App\Services\ExchangeRateService;
use Illuminate\Console\Command;

/**
 * Today's rates from CurrencyFreaks into `exchange_rates` (GAPS #411). Daily, because the free plan has no history:
 * a day not fetched is a day whose receipts cannot settle a foreign invoice until a rate is on file for it.
 */
class FetchExchangeRates extends Command
{
    protected $signature = 'fx:fetch-rates';

    protected $description = "Store today's exchange rates (rupees per unit) from CurrencyFreaks";

    public function handle(ExchangeRateService $rates): int
    {
        if (blank(config('services.currency_rate.token'))) {
            $this->warn('RATE_TOKEN is not set — no rates fetched.');

            return self::FAILURE;
        }

        $stored = $rates->fetchLatest();
        $this->info("{$stored} rate(s) stored for " . now()->toDateString() . '.');

        return $stored > 0 ? self::SUCCESS : self::FAILURE;
    }
}
