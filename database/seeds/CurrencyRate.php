<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class CurrencyRate extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('currency_rates')->insert([
            'currency' => 'INR',
            'rate' => null
        ]);
        DB::table('currency_rates')->insert([
            'currency' => 'USD',
            'rate' => null
        ]);
        DB::table('currency_rates')->insert([
            'currency' => 'EUR',
            'rate' => null
        ]);
        DB::table('currency_rates')->insert([
            'currency' => 'AED',
            'rate' => null
        ]);
    }
}
