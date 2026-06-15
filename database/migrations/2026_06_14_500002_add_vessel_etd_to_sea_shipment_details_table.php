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
        Schema::table('sea_shipment_details', function (Blueprint $table) {
            $table->dateTime('vessel_etd')->nullable()->after('imo_number');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sea_shipment_details', function (Blueprint $table) {
            $table->dropColumn('vessel_etd');
        });
    }
};
