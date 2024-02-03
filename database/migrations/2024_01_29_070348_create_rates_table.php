<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rates', function (Blueprint $table) {
            $table->id();
            $table->string('dest_city_name',100)->nullable();
            $table->string('dest_airport_code',10)->nullable();
            $table->string('carrier_code',10)->nullable();
            $table->string('carrier_prefix',10)->nullable();
            $table->string('product_name',100)->nullable();
            $table->string('dgr',10)->nullable();
            $table->string('effective_from',10)->nullable();
            $table->string('effective_to',10)->nullable();
            $table->string('origin_country_code',10)->nullable();
            $table->string('origin_airport_code',10)->nullable();
            $table->string('currency_code',10)->nullable();
            $table->text('rate_range')->nullable();
            $table->boolean('is_active')->default(true);
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
        Schema::dropIfExists('rates');
    }
}
