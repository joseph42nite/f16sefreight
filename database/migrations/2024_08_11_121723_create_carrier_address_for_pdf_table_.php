<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarrierAddressForPdfTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carrier_address_for_pdf_table_', function (Blueprint $table) {
            $table->id();
            $table->integer('awb_id')->nullable();
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
        Schema::dropIfExists('carrier_address_for_pdf_table_');
    }
}
