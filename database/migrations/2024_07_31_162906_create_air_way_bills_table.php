<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirWayBillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('air_way_bills', function (Blueprint $table) {
            $table->id();
            $table->integer('awb_code');
            $table->integer('awb_no');
            $table->string('consolidated_MAWB');
            $table->string('departure_airport');
            $table->string('destination_airport');
            $table->string('from');
            $table->string('to');
            $table->string('by');
            $table->integer('flight');
            $table->date('date');
            $table->string('customs_origin_code');
            $table->string('other_service_information')->nullable();
            $table->string('special_service_request')->nullable();
            $table->string('accounting_information')->nullable();
            $table->string('shipment_ref_no')->nullable();
            $table->string('supplementary_shipment_Info')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('air_way_bills');
    }
}
