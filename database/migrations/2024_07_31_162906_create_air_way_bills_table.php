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
            $table->integer('awb_no', 50)->nullable();
            $table->integer('awb_code')->nullable();
            $table->string('reference_id', 50)->nullable();
            $table->boolean('awb')->nullable();
            $table->string('consolidated_mawb')->nullable();
            $table->string('departure_airport')->nullable();
            $table->string('destination_airport')->nullable();
            $table->string('from')->nullable(); //first
            $table->string('to')->nullable();
            $table->string('by')->nullable();
            $table->integer('flight')->nullable();
            $table->dateTime('date')->nullable();
            $table->string('to_2')->nullable(); //second
            $table->string('by_2')->nullable();
            $table->integer('flight_2')->nullable();
            $table->dateTime('date_2')->nullable();
            $table->string('to_3')->nullable(); //third
            $table->string('by_3')->nullable();
            $table->integer('flight_3')->nullable();
            $table->dateTime('date_3')->nullable();
            $table->string('customs_origin_code')->nullable();
            $table->string('letter_credit')->nullable();
            $table->string('other_service_information')->nullable();
            $table->string('special_service_request')->nullable();
            $table->string('accounting_information')->nullable();
            $table->string('shipment_ref_no')->nullable();
            $table->string('supplementary_shipment_info')->nullable();
            $table->string('extra_print')->nullable();
            $table->integer('shipper_id')->nullable();
            $table->integer('consignee_id')->nullable();
            $table->integer('agent_id')->nullable();
            $table->integer('payment_id')->nullable();
            $table->text('special_handling_info')->nullable();
            // $table->text('oci_info')->nullable(); //other custome information
            $table->string('total_volume', 20)->nullable();
            $table->string('dimention_unit')->nullable();
            $table->string('total_amount', 20)->nullable();
            $table->dateTime('execution_date_time')->nullable();
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