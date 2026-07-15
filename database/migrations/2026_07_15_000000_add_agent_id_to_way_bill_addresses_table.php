<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('way_bill_addresses') && !Schema::hasColumn('way_bill_addresses', 'agent_id')) {
            Schema::table('way_bill_addresses', function (Blueprint $table) {
                $table->integer('agent_id')->nullable()->after('awb_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('way_bill_addresses') && Schema::hasColumn('way_bill_addresses', 'agent_id')) {
            Schema::table('way_bill_addresses', function (Blueprint $table) {
                $table->dropColumn('agent_id');
            });
        }
    }
};
