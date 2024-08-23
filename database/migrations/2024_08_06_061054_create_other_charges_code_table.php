<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOtherChargesCodeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('other_charges_code', function (Blueprint $table) {
            $table->id();
            $table->string('other_charge_code')->nullable();
            $table->string('amount')->nullable();
            $table->string('due_agent')->nullable();
            $table->string('due_carrier')->nullable();
            $table->string('prepaid')->nullable();
            $table->string('collect')->nullable();
            $table->integer('awb_id')->nullable();
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
        Schema::dropIfExists('other_charges_code');
    }
}
