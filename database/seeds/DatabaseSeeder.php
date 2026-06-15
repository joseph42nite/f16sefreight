<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        try {
            $this->call(SuperSeeder::class);
        } catch (\Exception $e) {}
        try {
            $this->call(UserSeeder::class);
        } catch (\Exception $e) {}
        try {
            $this->call(CurrencyRateSeeder::class);
        } catch (\Exception $e) {}

        $this->call(PortSeeder::class);
    }
}
