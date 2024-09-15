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
            $table->integer('awb_code')->nullable();
            $table->integer('awb_no')->nullable();
            $table->boolean('awb')->nullable();
            $table->string('consolidated_MAWB')->nullable();
            $table->string('departure_airport')->nullable();
            $table->string('destination_airport')->nullable();
            $table->string('from')->nullable();//first
            $table->string('to')->nullable();
            $table->string('by')->nullable();
            $table->integer('flight')->nullable();
            $table->string('date')->nullable();
            $table->string('from_2')->nullable();//sencond
            $table->string('to_2')->nullable();
            $table->string('by_2')->nullable();
            $table->integer('flight_2')->nullable();
            $table->string('date_2')->nullable();
            $table->string('from_3')->nullable(); //third
            $table->string('to_3')->nullable();
            $table->string('by_3')->nullable();
            $table->integer('flight_3')->nullable();
            $table->string('date_3')->nullable();
            $table->string('customs_origin_code')->nullable();
            $table->boolean('lette_credit')->default(false)->nullable();
            $table->string('other_service_information')->nullable();
            $table->string('special_service_request')->nullable();
            $table->string('accounting_information')->nullable();
            $table->string('shipment_ref_no')->nullable();
            $table->string('supplementary_shipment_Info')->nullable();
            $table->string('extra_print')->nullable();
            $table->integer('shipper_id')->nullable();
            $table->integer('consignee_id')->nullable();
            $table->integer('agent_id')->nullable();
            $table->integer('payment_id')->nullable();
            $table->json('special_handling_code')->nullable();
            $table->json('oci_entries')->nullable();
            // $table->string('oci_country_code')->nullable(); //Other Customs Information(OCI)
            // $table->string('oci_info_identifier')->nullable();
            // $table->string('oci_custom_info_identifier')->nullable();
            // $table->string('oci_supplementary_info')->nullable();
            $table->json('consignee_info')->nullable();
            $table->json('other_charges')->nullable();
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
