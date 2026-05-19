<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds the missing agent_id column to saved_addresses so that
     * shipper/consignee/also-notify addresses can be scoped to a branch.
     */
    public function up()
    {
        Schema::table('saved_addresses', function (Blueprint $table) {
            $table->integer('agent_id')->nullable()->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('saved_addresses', function (Blueprint $table) {
            $table->dropColumn('agent_id');
        });
    }
};
