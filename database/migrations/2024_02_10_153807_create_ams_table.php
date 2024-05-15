<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAmsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ams', function (Blueprint $table) {
            $table->id();
            $table->string('carrier_code',10)->nullable();
            $table->string('carrier_prefix',10)->nullable();
            $table->string('region',50)->nullable();
            $table->string('dest_airport_code',50)->nullable();
            $table->string('dest_country',50)->nullable();
            $table->string('country_code',50)->nullable();
            $table->string('haul',50)->nullable();
            $table->string('fsc',10)->nullable();
            $table->string('scc',10)->nullable();
            $table->string('xray',10)->nullable();
            $table->string('misc',10)->nullable();
            $table->string('ctg',10)->nullable();
            $table->string('awb_fee',10)->nullable();
            $table->string('fe',50)->nullable();
            $table->string('mawb',10)->nullable();
            $table->string('hawb',10)->nullable();
            $table->string('de_fee',50)->nullable();
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
        Schema::dropIfExists('ams');
    }
}
