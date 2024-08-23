<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_info', function (Blueprint $table) {
            $table->id();
            $table->string('payment_type')->nullable();
            $table->string('currency')->nullable();
            $table->string('carriage')->nullable();
            $table->string('insurance')->nullable();
            $table->integer('other_charges_due_carrier')->nullable();
            $table->integer('other_charges_due_agent')->nullable();
            $table->integer('taxes')->nullable();
            $table->integer('weight_charge')->nullable();
            $table->integer('total_charges')->nullable();
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
        Schema::dropIfExists('payment_info');
    }
}
