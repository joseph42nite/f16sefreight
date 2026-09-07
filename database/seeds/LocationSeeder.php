<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Load `locations` from the IATA map the PDF extractor already carries.
 *
 * 🔴 EXPORTED ONCE, NOT CALLED PER MAIL. The map lives in `python/extract_awb_new.py`
 * because that is where it was needed first. Reading a lane out of an enquiry mail needs
 * the same lookup — and getting it by calling the Python service per message would put an
 * HTTP round trip in front of every inbound mail, and a dependency in the mail pipeline
 * that has no business being there. `python/export_locations.py` writes the JSON, this
 * loads it, and PHP then resolves a lane with a SQL lookup.
 *
 * ⚠️ The same code appears under several names — "bombay" and "mumbai" are both BOM — and
 * every one is a spelling a client might type, so none are collapsed. The lookup is by
 * NAME; duplicates on `iata_code` are the point, not a defect.
 */
class LocationSeeder extends Seeder
{
    private const SOURCE = 'app/locations.json';

    public function run(): void
    {
        $path = storage_path(self::SOURCE);

        if (! is_file($path)) {
            $this->command->warn(
                'locations.json missing. Run: python3 python/export_locations.py > storage/' . self::SOURCE
            );

            return;
        }

        $rows = json_decode(file_get_contents($path), true);

        if (! is_array($rows) || $rows === []) {
            $this->command->warn('locations.json is empty or unreadable — nothing loaded.');

            return;
        }

        // Truthful about being a full reload: this is reference data, so a partial merge
        // would leave renamed or withdrawn entries behind with nothing pointing at them.
        DB::table('locations')->truncate();

        $now = now();

        // Chunked because 8,000 single inserts is 8,000 round trips, and one 8,000-row
        // statement exceeds max_allowed_packet on a default MySQL.
        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('locations')->insert(array_map(fn ($r) => [
                'destination' => $r['destination'],
                'iata_code'   => $r['iata_code'],
                'is_active'   => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ], $chunk));
        }

        $this->command->info(count($rows) . ' locations loaded.');
    }
}
