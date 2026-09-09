<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Register the coordinate templates that already exist in `boxes_config.json`.
 *
 * 🔴 `system_templates` WAS EMPTY, and that made the coordinate path unreachable through
 * `OcrRoutingService`. The routing asks `SystemTemplate::where('key', $documentType)`
 * whether a document is structured; with no rows the answer is always no, so every upload
 * — an airway bill included — was routed to `/extract-unstructured`.
 *
 * ⚠️ The two halves disagreed on vocabulary as well. `STRUCTURED_TYPES` accepts
 * `MAWB`/`HAWB`/`AWB`, but `/extract` needs a template NAME from `boxes_config.json`
 * (`ksr`, `ksr_house1`, …) to know which boxes to crop. So sending `MAWB` routed to
 * coordinates and then failed inside FastAPI with "template not found" — the only two
 * values that reached the right endpoint were the two the endpoint could not use.
 * Registering the real names is what closes that.
 *
 * ⚠️ Coordinates are COPIED, not referenced. `ProcessPdfOcrJob` sends them with the
 * request so a tenant can be given adjusted boxes for a carrier whose form is a
 * millimetre out, without editing a file that ships with the image.
 */
class SystemTemplateSeeder extends Seeder
{
    private const SOURCE = 'python/boxes_config.json';

    public function run(): void
    {
        $path = base_path(self::SOURCE);

        if (! is_file($path)) {
            $this->command->warn(self::SOURCE . ' not found — no templates registered.');

            return;
        }

        $config = json_decode(file_get_contents($path), true);
        $templates = $config['templates'] ?? [];

        if (! $templates) {
            $this->command->warn('No templates in ' . self::SOURCE);

            return;
        }

        foreach ($templates as $key => $coordinates) {
            // updateOrCreate, not insert: this runs on a database that may already hold
            // tenant-adjusted boxes, and re-seeding must not silently reset them to the
            // shipped defaults... which is exactly what it would do on `key`. Only rows
            // that do not exist yet are created.
            DB::table('system_templates')->updateOrInsert(
                ['key' => $key],
                [
                    'coordinates' => json_encode($coordinates),
                    'updated_at'  => now(),
                    'created_at'  => now(),
                ]
            );
        }

        $this->command->info(count($templates) . ' coordinate templates registered.');
    }
}
