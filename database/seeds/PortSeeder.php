<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Load `ports` from the UN/LOCODE export.
 *
 *     python3 python/export_ports.py > storage/app/ports.json
 *     php artisan db:seed --class=PortSeeder
 *
 * 🔴 **`locations` names airports and nothing else.** A sea lane is quoted as five-character LOCODEs — INMAA →
 * SGSIN — and a three-letter IATA code cannot address DEHAM, so until this runs every sea lane on the
 * profitability report reads as a bare pair of codes (GAPS.md #375).
 *
 * ⚠️ A full reload, not a merge. This is reference data: a partial merge leaves renamed and withdrawn entries
 * behind with live rows pointing at them. Everything that references a port does so by `id`, so the truncate is
 * deliberately refused when anything already points here — see below.
 */
class PortSeeder extends Seeder
{
    private const SOURCE = 'app/ports.json';

    public function run(): void
    {
        $path = storage_path(self::SOURCE);

        if (! is_file($path)) {
            $this->command->warn(
                'ports.json missing. Run: python3 python/export_ports.py > storage/' . self::SOURCE
            );

            return;
        }

        $rows = json_decode(file_get_contents($path), true);

        if (! is_array($rows) || $rows === []) {
            $this->command->warn('ports.json is empty or unreadable — nothing loaded.');

            return;
        }

        // 🔴 Four foreign keys land on this table (users.origin_port_id, customers.default_port_id,
        // rate_cards.origin_port_id / .destination_port_id). Clearing it under a live row would orphan them, so
        // it is refused in words rather than left to fail as SQLSTATE 23000.
        if ($this->referenced()) {
            $this->command->warn('Ports are already in use by rate cards, users or customers — reload skipped.');

            return;
        }

        // 🔴 DELETE, not TRUNCATE. MySQL refuses to truncate a table that is the target of a foreign key AT ALL —
        // `rate_cards.destination_port_id` alone is enough, even with nothing pointing at it. A delete clears the
        // rows and would still fail, correctly, on any row something really references.
        DB::table('ports')->delete();

        $now = now();

        // Chunked: 25,000 single inserts is 25,000 round trips, and one 25,000-row statement is past
        // max_allowed_packet on a default MySQL.
        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('ports')->insert(array_map(fn ($row) => [
                'locode' => $row['locode'],
                'port_name' => $row['port_name'],
                'country_code' => $row['country_code'],
                'port_type' => $row['port_type'],
                // Everything exported is current: `XX` — the status that means "being removed" — is dropped by
                // the exporter, and `is_active` is for a port that has since closed.
                'is_active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ], $chunk));
        }

        $counts = DB::table('ports')->selectRaw('port_type, COUNT(*) AS n')->groupBy('port_type')
            ->pluck('n', 'port_type')->all();

        $this->command->info(sprintf('%d ports loaded (%s).', count($rows),
            implode(', ', array_map(fn ($k, $v) => "{$v} {$k}", array_keys($counts), $counts))));
    }

    /** Whether anything already points at a port row. */
    private function referenced(): bool
    {
        foreach ([['rate_cards', 'origin_port_id'], ['rate_cards', 'destination_port_id'],
                  ['users', 'origin_port_id'], ['customers', 'default_port_id']] as [$table, $column]) {
            if (\Illuminate\Support\Facades\Schema::hasColumn($table, $column)
                && DB::table($table)->whereNotNull($column)->exists()) {
                return true;
            }
        }

        return false;
    }
}
