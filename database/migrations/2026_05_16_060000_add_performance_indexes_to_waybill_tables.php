<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Performance Indexes — Air Way Bills & House Way Bills
 *
 * Without these, every dashboard load does a full table scan on agent_id,
 * awb_no, awb_code and status, which degrades as volume grows.
 *
 * ── Why this migration is defensive ──────────────────────────────────────
 *
 * It previously created every index unconditionally, and `php artisan migrate`
 * on a FRESH database therefore failed at the first index touching `status`:
 *
 *     SQLSTATE[42000]: 1072 Key column 'status' doesn't exist in table
 *
 * `status` is added by 2026_07_15_010000_add_tracking_columns_to_waybill_tables,
 * which sorts TWO MONTHS AFTER this file. The bug stayed hidden because
 * production applies schema changes as manual SQL (see it_devops_checklist.md)
 * and local dev ran against an existing SQLite file that already had the column.
 * A fresh install — a new machine, CI, or the test database — hits it every time.
 *
 * MySQL has no transactional DDL, so a partial failure here is NOT rolled back:
 * the first few indexes survive, the migration is not recorded, and re-running
 * then fails with "1061 Duplicate key name". Every index below is therefore
 * guarded on BOTH the columns existing and the index not already existing, so
 * this migration is safe to re-run against a half-applied schema.
 */
return new class extends Migration
{
    /** Add an index only if its columns exist and the index does not. */
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

    private function dropIndexIfExists(string $table, string $name): void
    {
        if (Schema::hasTable($table) && $this->indexExists($table, $name)) {
            Schema::table($table, fn (Blueprint $t) => $t->dropIndex($name));
        }
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
        // air_way_bills — branch dashboard filter, AWB number lookup, branch+status
        $this->addIndex('air_way_bills', ['agent_id'], 'awb_agent_id_idx');
        $this->addIndex('air_way_bills', ['awb_code', 'awb_no'], 'awb_code_no_idx');
        $this->addIndex('air_way_bills', ['agent_id', 'status'], 'awb_agent_status_idx');

        // house_way_bills — same, plus the master-AWB reference used by
        // MessageLogController and ConsolidationController
        $this->addIndex('house_way_bills', ['agent_id'], 'hawb_agent_id_idx');
        $this->addIndex('house_way_bills', ['awb_code', 'awb_no'], 'hawb_code_no_idx');
        $this->addIndex('house_way_bills', ['agent_id', 'awb_code', 'awb_no'], 'hawb_agent_awb_idx');
        $this->addIndex('house_way_bills', ['status', 'agent_id'], 'hawb_status_agent_idx');

        // Always joined on awb_id
        $this->addIndex('way_bill_consignment_data', ['awb_id'], 'consignment_awb_id_idx');
        $this->addIndex('way_bill_addresses', ['awb_id'], 'wayaddr_awb_id_idx');

        // Branch isolation, then address type
        $this->addIndex('saved_addresses', ['agent_id', 'address_type'], 'savedaddr_agent_type_idx');
    }

    public function down()
    {
        $this->dropIndexIfExists('air_way_bills', 'awb_agent_id_idx');
        $this->dropIndexIfExists('air_way_bills', 'awb_code_no_idx');
        $this->dropIndexIfExists('air_way_bills', 'awb_agent_status_idx');

        $this->dropIndexIfExists('house_way_bills', 'hawb_agent_id_idx');
        $this->dropIndexIfExists('house_way_bills', 'hawb_code_no_idx');
        $this->dropIndexIfExists('house_way_bills', 'hawb_agent_awb_idx');
        $this->dropIndexIfExists('house_way_bills', 'hawb_status_agent_idx');

        $this->dropIndexIfExists('way_bill_consignment_data', 'consignment_awb_id_idx');
        $this->dropIndexIfExists('way_bill_addresses', 'wayaddr_awb_id_idx');
        $this->dropIndexIfExists('saved_addresses', 'savedaddr_agent_type_idx');
    }
};
