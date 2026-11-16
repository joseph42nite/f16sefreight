<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The two waybill tables the controllers write `agent_id` to and that never had it.
 *
 * 🔴 Found 2026-11-16 by the tests for the frontend audit's FW6: saving an other charge or a customs (OCI) line on a
 * master or house waybill answered 500 — "Unknown column 'agent_id'" — and rolled the whole save back. Both tables
 * were empty on the development database, which is what that looks like from the inside. The sibling tables
 * (consignment, addresses) have the column; these two were missed. Guarded, in case a database had it added by hand.
 */
return new class extends Migration
{
    private const TABLES = ['other_charges_code', 'way_bill_custom_info'];

    public function up()
    {
        foreach (self::TABLES as $table) {
            if (Schema::hasTable($table) && ! Schema::hasColumn($table, 'agent_id')) {
                Schema::table($table, fn (Blueprint $t) => $t->unsignedBigInteger('agent_id')->nullable()->index());
            }
        }
    }

    public function down()
    {
        foreach (self::TABLES as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'agent_id')) {
                Schema::table($table, fn (Blueprint $t) => $t->dropColumn('agent_id'));
            }
        }
    }
};
