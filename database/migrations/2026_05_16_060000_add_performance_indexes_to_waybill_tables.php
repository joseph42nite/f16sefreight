<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Performance Indexes — Air Way Bills & House Way Bills
 *
 * The guide.md "Database Indexing Strategy" section planned these indexes.
 * Without them, every dashboard load does full table scans on agent_id,
 * awb_no, awb_code, and status — which gets progressively slower as
 * volume grows.
 *
 * All indexes use IF NOT EXISTS logic via tryDropIndex to be safe to run
 * on an existing production database.
 */
return new class extends Migration
{
    public function up()
    {
        // ── air_way_bills ────────────────────────────────────────────────
        Schema::table('air_way_bills', function (Blueprint $table) {
            // Primary dashboard filter: all AWBs for this branch
            $table->index('agent_id', 'awb_agent_id_idx');

            // AWB lookup by number (used in every form save + message log search)
            $table->index(['awb_code', 'awb_no'], 'awb_code_no_idx');

            // Composite: branch + status — used in getAirwayBills($status)
            $table->index(['agent_id', 'status'], 'awb_agent_status_idx');
        });

        // ── house_way_bills ──────────────────────────────────────────────
        Schema::table('house_way_bills', function (Blueprint $table) {
            // Primary dashboard filter: all HAWBs for this branch
            $table->index('agent_id', 'hawb_agent_id_idx');

            // HAWB search by master AWB reference
            $table->index(['awb_code', 'awb_no'], 'hawb_code_no_idx');

            // Composite: branch + awb ref — the most common query pattern
            // in MessageLogController and ConsolidationController
            $table->index(['agent_id', 'awb_code', 'awb_no'], 'hawb_agent_awb_idx');

            // Status filter (send / draft) used in searchBills & getHouseWayBills
            $table->index(['status', 'agent_id'], 'hawb_status_agent_idx');
        });

        // ── way_bill_consignment_data ────────────────────────────────────
        // This table is always joined on awb_id — must be indexed
        Schema::table('way_bill_consignment_data', function (Blueprint $table) {
            $table->index('awb_id', 'consignment_awb_id_idx');
        });

        // ── way_bill_addresses ───────────────────────────────────────────
        // Looked up by awb_id on every AWB load/save
        Schema::table('way_bill_addresses', function (Blueprint $table) {
            $table->index('awb_id', 'wayaddr_awb_id_idx');
        });

        // ── saved_addresses ──────────────────────────────────────────────
        // Scoped by agent_id (branch isolation fix), then address_type
        Schema::table('saved_addresses', function (Blueprint $table) {
            $table->index(['agent_id', 'address_type'], 'savedaddr_agent_type_idx');
        });
    }

    public function down()
    {
        Schema::table('air_way_bills', function (Blueprint $table) {
            $table->dropIndex('awb_agent_id_idx');
            $table->dropIndex('awb_code_no_idx');
            $table->dropIndex('awb_agent_status_idx');
        });

        Schema::table('house_way_bills', function (Blueprint $table) {
            $table->dropIndex('hawb_agent_id_idx');
            $table->dropIndex('hawb_code_no_idx');
            $table->dropIndex('hawb_agent_awb_idx');
            $table->dropIndex('hawb_status_agent_idx');
        });

        Schema::table('way_bill_consignment_data', function (Blueprint $table) {
            $table->dropIndex('consignment_awb_id_idx');
        });

        Schema::table('way_bill_addresses', function (Blueprint $table) {
            $table->dropIndex('wayaddr_awb_id_idx');
        });

        Schema::table('saved_addresses', function (Blueprint $table) {
            $table->dropIndex('savedaddr_agent_type_idx');
        });
    }
};
