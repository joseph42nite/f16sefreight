<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * GAPS #18 — `air_way_bills.agent_id` / `house_way_bills.agent_id` were signed INT with no
 * foreign key, while `agents_info.id` is BIGINT UNSIGNED: an unconstrained, type-mismatched
 * tenancy column on the tables the whole legacy product writes to (the `users.branch_name`
 * defect of CONTEXT.md §6, again).
 *
 * Converted to BIGINT UNSIGNED and constrained to `agents_info.id`. RESTRICT, not CASCADE or
 * SET NULL: a waybill is a document that was really issued, and a branch that issued one must
 * not be deletable out from under it — nor may the waybill lose the tenant it belongs to.
 *
 * ⚠️ Refuses, naming the count, if any row points at a branch that does not exist or holds a
 * negative id — MySQL would otherwise fail the ALTER with a bare 1452, or silently clamp a
 * negative to 0 during the type change. Fix those rows by hand; nothing here can know their branch.
 *
 * Guarded and idempotent — MySQL has no transactional DDL.
 */
return new class extends Migration
{
    private const TABLES = ['air_way_bills', 'house_way_bills'];

    public function up()
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        foreach (self::TABLES as $name) {
            if (! Schema::hasTable($name) || ! Schema::hasColumn($name, 'agent_id')) {
                continue;
            }

            $bad = DB::selectOne(
                "SELECT COUNT(*) AS n FROM `$name` w LEFT JOIN agents_info a ON a.id = w.agent_id
                 WHERE w.agent_id IS NOT NULL AND (w.agent_id < 0 OR a.id IS NULL)"
            )->n;
            if ($bad > 0) {
                throw new RuntimeException(
                    "$name has $bad row(s) whose agent_id is not a branch in agents_info. "
                    . 'Correct them before this migration can add the foreign key (GAPS #18).'
                );
            }
        }

        foreach (self::TABLES as $name) {
            $fk = $name . '_agent_id_foreign';
            if (! Schema::hasTable($name) || ! Schema::hasColumn($name, 'agent_id') || $this->hasForeignKey($name, $fk)) {
                continue;
            }

            DB::statement("ALTER TABLE `$name` MODIFY agent_id BIGINT UNSIGNED NULL");
            DB::statement("ALTER TABLE `$name` ADD CONSTRAINT `$fk` FOREIGN KEY (agent_id) REFERENCES agents_info (id)");
        }
    }

    private function hasForeignKey(string $table, string $constraint): bool
    {
        return DB::selectOne(
            'SELECT 1 AS found FROM information_schema.table_constraints
             WHERE table_schema = ? AND table_name = ? AND constraint_name = ?
               AND constraint_type = ?',
            [Schema::getConnection()->getDatabaseName(), $table, $constraint, 'FOREIGN KEY']
        ) !== null;
    }

    public function down()
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        foreach (self::TABLES as $name) {
            $fk = $name . '_agent_id_foreign';
            if (Schema::hasTable($name) && $this->hasForeignKey($name, $fk)) {
                DB::statement("ALTER TABLE `$name` DROP FOREIGN KEY `$fk`");
                DB::statement("ALTER TABLE `$name` MODIFY agent_id INT NULL");
            }
        }
    }
};
