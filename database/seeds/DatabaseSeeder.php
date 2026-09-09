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
        // ⚠️ FULLY QUALIFIED because `SuperSeeder` is the ONE seeder in this directory
        // that declares `namespace Database\Seeders`. `DatabaseSeeder` itself is global,
        // so the bare `SuperSeeder::class` resolved to `\SuperSeeder`, which does not
        // exist — `php artisan db:seed` has been failing on this line, and every seeder
        // after it was unreachable.
        $this->call(\Database\Seeders\SuperSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(CurrencyRateSeeder::class);

        // 🔴 REFERENCE DATA, not demo data — both of these are needed for the product to
        // function at all, and both tables were empty:
        //
        //   system_templates  the coordinate boxes. Empty meant `OcrRoutingService`
        //                     answered "not structured" for every document, so even an
        //                     airway bill was routed to the unstructured reader.
        //   locations         the IATA map. Empty meant a lane read out of a mail could
        //                     never resolve to a code.
        //
        // ⚠️ Both are idempotent, so re-running the seeder is safe. `SystemTemplateSeeder`
        // in particular will not overwrite boxes a tenant has adjusted.
        $this->call(SystemTemplateSeeder::class);
        $this->call(LocationSeeder::class);
    }
}
