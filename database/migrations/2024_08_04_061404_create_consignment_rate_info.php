<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsignmentRateInfo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consignment_rate_info', function (Blueprint $table) {
            $table->id();
            $table->integer('awb_id')->nullable();
            $table->integer('pieces')->nullable();
            $table->string('description')->nullable();
            $table->string('rate_class')->nullable();
            $table->string('uld_rate_class')->nullable();
            $table->string('service_code')->nullable();
            $table->string('commodity_item')->nullable();
            $table->string('country_origin_goods')->nullable();
            $table->integer('slac')->nullable();
            $table->integer('hs_code')->nullable();
            $table->string('gross_weight')->nullable();
            $table->integer('chargable_weight')->nullable();
            $table->string('weight_code')->nullable(); //kgs/lbs
            // $table->float('rate');
            $table->integer('rate')->nullable();
            $table->float('height')->nullable();
            $table->decimal('width')->nullable();
            $table->decimal('length')->nullable();
            $table->string('unit')->nullable();
            $table->string('volume')->nullable();
            $table->string('dimention_unit')->nullable();
            $table->string('uld_type')->nullable();
            $table->integer('uld_serial')->nullable();
            $table->string('owner')->nullable();
            $table->string('total_volume')->nullable();
            $table->string('total_amount')->nullable();
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
        Schema::dropIfExists('consignment_rate_info');
    }
}
