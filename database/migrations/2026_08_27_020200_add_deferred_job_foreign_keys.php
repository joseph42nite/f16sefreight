<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Closes the three foreign keys that could not be declared when their columns were added,
 * because `jobs` did not exist yet. Runs immediately after the jobs table is created.
 *
 * 1. enquiries.reinitiated_from_job_id -> jobs.id
 *    A GENUINE cycle: jobs.enquiry_id points at enquiries and this points back. It could
 *    not be inline in either table, which is why the DDL defers it to an ALTER.
 *    Re-quote lineage: freight rates are time-sensitive, so a CANCELLED job spawns a NEW
 *    enquiry rather than reopening the old one — this column records which job it came
 *    from. ON DELETE SET NULL: losing the ancestor must not delete the re-quote.
 *
 * 2. air_way_bills.job_id  -> jobs.id
 * 3. house_way_bills.job_id -> jobs.id
 *    Added unconstrained in Batch 1a·8 (2026_08_27_010800) because `jobs` was two batches
 *    away. Verified at the time as accepting job_id = 999999.
 *    🔴 This is the migration GAPS.md #17 exists to force. Nothing later in the plan
 *    revisits these columns — if the FK is not added here it is never added at all.
 *    ON DELETE SET NULL rather than RESTRICT: a waybill is a real document that was
 *    really issued, and it must survive its job record being removed. Detaching is
 *    correct; blocking the delete or cascading the document away is not.
 *
 * ⚠️ Guarded and idempotent throughout — MySQL has no transactional DDL, so a failure on
 * the second statement leaves the first applied and the migration unrecorded.
 */
return new class extends Migration
{
    public function up()
    {
        if (Schema::hasTable('enquiries') && ! $this->hasForeignKey('enquiries', 'fk_enq_reinitiated_from_job')) {
            Schema::table('enquiries', function (Blueprint $table) {
                $table->foreign('reinitiated_from_job_id', 'fk_enq_reinitiated_from_job')
                    ->references('id')->on('jobs')->onDelete('set null');
            });
        }

        foreach (['air_way_bills', 'house_way_bills'] as $name) {
            $fk = $name . '_job_id_foreign';

            if (! Schema::hasTable($name) || ! Schema::hasColumn($name, 'job_id') || $this->hasForeignKey($name, $fk)) {
                continue;
            }

            Schema::table($name, function (Blueprint $table) use ($fk) {
                $table->foreign('job_id', $fk)->references('id')->on('jobs')->onDelete('set null');
            });
        }
    }

    private function hasForeignKey(string $table, string $constraint): bool
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return false;
        }

        return DB::selectOne(
            'SELECT 1 AS found FROM information_schema.table_constraints
             WHERE table_schema = ? AND table_name = ? AND constraint_name = ?
               AND constraint_type = ?',
            [Schema::getConnection()->getDatabaseName(), $table, $constraint, 'FOREIGN KEY']
        ) !== null;
    }

    public function down()
    {
        foreach (['air_way_bills', 'house_way_bills'] as $name) {
            $fk = $name . '_job_id_foreign';
            if (Schema::hasTable($name) && $this->hasForeignKey($name, $fk)) {
                Schema::table($name, fn (Blueprint $t) => $t->dropForeign($fk));
            }
        }

        if (Schema::hasTable('enquiries') && $this->hasForeignKey('enquiries', 'fk_enq_reinitiated_from_job')) {
            Schema::table('enquiries', fn (Blueprint $t) => $t->dropForeign('fk_enq_reinitiated_from_job'));
        }
    }
};
