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
            $table->integer('pieces');
            $table->string('description');
            $table->string('rate_class');
            $table->string('uld_rate_class');
            $table->string('service_code');
            $table->string('commodity_item');
            $table->string('country_origin_goods');
            $table->integer('slac');
            $table->integer('hs_code');
            $table->string('gross_weight');
            $table->integer('chargeable_weight');
            // $table->float('rate');
            $table->integer('rate');
            $table->float('height');
            $table->decimal('width');
            $table->decimal('length');
            $table->string('unit');
            $table->string('volume');
            $table->string('uld_type');
            $table->integer('uld_serial');
            $table->string('owner');
            $table->string('total_volume');
            $table->string('total_amount');
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
