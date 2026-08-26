<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Status-dependent waybill indexes — the second half of the 2026_05_16_060000 fix.
 *
 * 2026_05_16_060000 tried to index (agent_id, status) on both waybill tables, but
 * `status` is not added until 2026_07_15_010000 — two months later in the ordering.
 * That made `php artisan migrate` fail outright on any fresh database.
 *
 * Guarding those two indexes stopped the crash, but on a fresh install it also
 * meant they were silently skipped: no error, just full table scans on the
 * branch-and-status queries in getAirwayBills($status), searchBills and
 * getHouseWayBills. A silently missing index is a slower, subtler bug than a
 * loud one, so the guard alone is only half a fix.
 *
 * This migration recreates them at a point in the order where `status` exists.
 * Idempotent for the same reason as its predecessor: MySQL has no transactional
 * DDL, so a partial failure must be safe to re-run — and on databases migrated
 * before this split (the original SQLite file, production) the indexes are
 * already present and are correctly left alone.
 */
return new class extends Migration
{
    private function addIndex(string $table, array $columns, string $name): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }
        foreach ($columns as $column) {
            if (! Schema::hasColumn($table, $column)) {
                return;
            }
        }
        if ($this->indexExists($table, $name)) {
            return;
        }
        Schema::table($table, fn (Blueprint $t) => $t->index($columns, $name));
    }

    private function indexExists(string $table, string $name): bool
    {
        $connection = Schema::getConnection();

        if ($connection->getDriverName() === 'sqlite') {
            return collect(DB::select("PRAGMA index_list('{$table}')"))
                ->contains(fn ($i) => $i->name === $name);
        }

        return DB::table('information_schema.statistics')
            ->where('table_schema', $connection->getDatabaseName())
            ->where('table_name', $table)
            ->where('index_name', $name)
            ->exists();
    }

    public function up()
    {
        $this->addIndex('air_way_bills', ['agent_id', 'status'], 'awb_agent_status_idx');
        $this->addIndex('house_way_bills', ['status', 'agent_id'], 'hawb_status_agent_idx');
    }

    public function down()
    {
        foreach ([['air_way_bills', 'awb_agent_status_idx'], ['house_way_bills', 'hawb_status_agent_idx']] as [$table, $name]) {
            if (Schema::hasTable($table) && $this->indexExists($table, $name)) {
                Schema::table($table, fn (Blueprint $t) => $t->dropIndex($name));
            }
        }
    }
};
