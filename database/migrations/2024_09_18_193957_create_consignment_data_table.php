<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsignmentDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('way_bill_consignment_data', function (Blueprint $table) {
            $table->id();
            $table->string('awb_id', 50)->nullable();
            $table->integer('pieces')->nullable();
            $table->string('description')->nullable();
            $table->string('rate_class')->nullable();
            $table->string('uld_rate_class')->nullable();
            $table->string('service_code')->nullable();
            $table->string('commodity_item')->nullable();
            $table->string('country_origin_goods')->nullable();
            $table->integer('slac')->nullable();
            $table->string('hs_code')->nullable();
            $table->string('gross_weight')->nullable();
            $table->string('weight_code')->nullable(); //kgs/lbs
            $table->integer('chargable_weight')->nullable();
            $table->integer('rate')->nullable();
            $table->text('pieces_info')->nullable();
            $table->string('uld_info', 1000)->nullable();
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
        Schema::dropIfExists('way_bill_consignment_data');
    }
}