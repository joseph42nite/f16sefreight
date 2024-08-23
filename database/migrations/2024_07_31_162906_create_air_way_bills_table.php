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
            $table->string('consolidated_MAWB')->nullable();
            $table->string('departure_airport')->nullable();
            $table->string('destination_airport')->nullable();
            $table->string('from')->nullable();
            $table->string('to')->nullable();
            $table->string('by')->nullable();
            $table->integer('flight')->nullable();
            $table->date('date')->nullable();
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
            $table->integer('occ_id')->nullable(); //other charges code id
            $table->integer('payment_id')->nullable();
            $table->integer('consignee_rate_id')->nullable();
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
