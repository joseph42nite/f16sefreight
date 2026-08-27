<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * air_way_bills + house_way_bills — ALTER only. Batch 1a·8 adds EXACTLY two columns
 * to each: `uuid` and `job_id`. Nothing else.
 *
 * ⚠️ THE DDL BLOCKS FOR BOTH TABLES ARE STALE and must not be applied as written.
 * They describe greenfield tables of 7-8 columns with a VARCHAR primary key built from
 * awb_code + awb_no. The live tables carry 47 and 53 columns respectively (routing
 * legs, handling info, send/status tracking, the ho_* block, master_pcs/master_weight),
 * and their primary keys do not match the DDL either:
 *     air_way_bills.id    = BIGINT UNSIGNED AUTO_INCREMENT  (DDL says VARCHAR(20))
 *     house_way_bills.id  = VARCHAR(50)                     (DDL says VARCHAR(30))
 * Anything in the plan treating air_way_bills.id as the AWB number is wrong against
 * this codebase.
 *
 * ── uuid is the SECURE TRACKER REFERENCE, which is why it is not the PK ──────
 * Shared tracking links must not expose an enumerable identifier: sequential ids let
 * anyone holding one link walk the tenant's entire waybill history by incrementing.
 * The uuid is the outward-facing handle; the integer PK stays internal. UNIQUE so a
 * link resolves to exactly one document.
 * NULLABLE because the live rows predate it — backfill is a data task, not a schema
 * one, and the column cannot be NOT NULL until every row has a value.
 *
 * ── job_id gets NO FOREIGN KEY YET, deliberately ─────────────────────────────
 * It references `jobs`, which does not exist until Batch 1b. The column ships now so
 * the ALTER on these large live tables happens once rather than twice.
 * ⚠️ THE FK IS A FOLLOW-UP, NOT AN OMISSION — add it in Batch 1b immediately after
 * `jobs` is created, or these columns stay unconstrained forever. Recorded in
 * implementation_guide.md §Batch 1b and GAPS.md.
 *
 * ── Guarded on column-existence so a half-applied run is re-runnable ─────────
 * MySQL has no transactional DDL: if the second ALTER fails the first is not rolled
 * back and the migration is not recorded, so a re-run must not trip over its own work.
 * This is the same failure that made 2026_05_16_060000 unrunnable on a fresh database
 * (CONTEXT.md §6).
 */
return new class extends Migration
{
    private const TABLES = ['air_way_bills', 'house_way_bills'];

    public function up()
    {
        foreach (self::TABLES as $name) {
            if (! Schema::hasTable($name)) {
                continue;
            }

            Schema::table($name, function (Blueprint $table) use ($name) {
                if (! Schema::hasColumn($name, 'uuid')) {
                    $table->char('uuid', 36)->nullable()->unique();
                }
                if (! Schema::hasColumn($name, 'job_id')) {
                    // FK deferred to Batch 1b — `jobs` does not exist yet.
                    $table->unsignedBigInteger('job_id')->nullable()->index();
                }
            });
        }
    }

    public function down()
    {
        foreach (self::TABLES as $name) {
            if (! Schema::hasTable($name)) {
                continue;
            }

            Schema::table($name, function (Blueprint $table) use ($name) {
                if (Schema::hasColumn($name, 'uuid')) {
                    $table->dropUnique($name . '_uuid_unique');
                    $table->dropColumn('uuid');
                }
                if (Schema::hasColumn($name, 'job_id')) {
                    $table->dropIndex($name . '_job_id_index');
                    $table->dropColumn('job_id');
                }
            });
        }
    }
};
