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
            $table->string('dest_city_name',100)->default(null);
            $table->string('dest_airport_code',10)->default(null);
            $table->string('carrier_code',10)->default(null);
            $table->string('carrier_prefix',10)->default(null);
            $table->string('product_name',100)->default(null);
            $table->string('dgr',10)->default(null);
            $table->string('effective_from',10)->default(null);
            $table->string('effective_to',10)->default(null);
            $table->string('origin_country_code',10)->default(null);
            $table->string('origin_airport_code',10)->default(null);
            $table->string('currency_code',10)->default(null);
            $table->text('rate_range')->default(null);
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
