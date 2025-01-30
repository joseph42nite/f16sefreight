<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWayBillAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('way_bill_addresses', function (Blueprint $table) {
            $table->id();
            $table->string('awb_id', 50)->nullable();
            $table->string('ship_name')->nullable();
            $table->string('ship_name_2', 150)->nullable();
            $table->string('ship_account')->nullable();
            $table->string('ship_address')->nullable();
            $table->string('ship_address_line_2')->nullable();
            $table->string('ship_city')->nullable();
            $table->string('ship_airport_code')->nullable();
            $table->string('ship_post_code', 15)->nullable();
            $table->string('ship_state')->nullable();
            $table->string('ship_country')->nullable();
            $table->string('ship_phone', 20)->nullable();
            $table->integer('ship_fax')->nullable();
            $table->integer('ship_telex')->nullable();
            $table->string('cons_name')->nullable();
            $table->string('cons_name_2', 150)->nullable();
            $table->string('cons_account')->nullable();
            $table->string('cons_address')->nullable();
            $table->string('cons_address_line_2')->nullable();
            $table->string('cons_city')->nullable();
            $table->string('cons_airport_code')->nullable();
            $table->string('cons_post_code', 15)->nullable();
            $table->string('cons_state')->nullable();
            $table->string('cons_country')->nullable();
            $table->string('cons_phone', 20)->nullable();
            $table->integer('cons_fax')->nullable();
            $table->integer('cons_telex')->nullable();
            $table->string('also_name')->nullable();
            $table->string('also_name_2', 150)->nullable();
            $table->string('also_address')->nullable();
            $table->string('also_address_line_2')->nullable();
            $table->string('also_city')->nullable();
            $table->string('also_airport_code')->nullable();
            $table->string('also_post_code', 15)->nullable();
            $table->string('also_state')->nullable();
            $table->string('also_country')->nullable();
            $table->string('also_phone', 20)->nullable();
            $table->integer('also_fax')->nullable();
            $table->integer('also_telex')->nullable();
            $table->string('carr_name')->nullable();
            $table->string('carr_prefix')->nullable();
            $table->string('carr_address')->nullable();
            $table->string('carr_city')->nullable();
            $table->integer('carr_post_code')->nullable();
            $table->string('carr_state')->nullable();
            $table->string('carr_country')->nullable();
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
        Schema::dropIfExists('way_bill_addresses');
    }
}