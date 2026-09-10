<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * The currencies the product quotes in.
 *
 * 🔴 `rate` IS SEEDED NULL AND MUST STAY THAT WAY ONCE SET. The rates are filled by a live
 * feed, so `updateOrInsert()` here would overwrite a real rate with NULL on every re-seed —
 * and a NULL rate is not a cosmetic problem: it is what every quotation and invoice line
 * converts against.
 *
 * ⚠️ `currency_rates` has NO unique key on `currency` (verified against the schema), so a
 * plain insert does not fail on a second run — it silently adds a fourth INR row, and
 * whichever one a query happens to pick becomes the rate.
 */
class CurrencyRateSeeder extends Seeder
{
    private const CURRENCIES = ['INR', 'USD', 'EUR', 'AED'];

    public function run()
    {
        foreach (self::CURRENCIES as $currency) {
            if (DB::table('currency_rates')->where('currency', $currency)->exists()) {
                continue;
            }

            DB::table('currency_rates')->insert([
                'currency' => $currency,
                // Filled by the rate feed, never by the seeder.
                'rate' => null,
            ]);
        }
    }
}
