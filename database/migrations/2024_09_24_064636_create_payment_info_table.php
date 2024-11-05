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
            $table->string('awb_id', 50)->nullable();
            // $table->string('payment_type')->nullable();
            $table->string('currency')->nullable();
            $table->string('type_of_payment')->nullable();
            // $table->integer('other_charges_due_carrier')->nullable();
            // $table->integer('other_charges_due_agent')->nullable();
            $table->integer('taxes')->nullable();
            $table->integer('weight_charge')->nullable();
            // $table->integer('total_charges')->nullable();
            // $table->string('no_value_declear_carriage')->nullable(); 
            $table->integer('declear_value_carriage')->nullable();  //carriage   NVD
            // $table->string('no_value_declear_customs')->nullable(); 
            $table->integer('declear_value_customs')->nullable();   //customs   NCV
            // $table->string('no_value_declear_insurance')->nullable(); 
            $table->integer('declear_value_insurance')->nullable();  //Insurance   XXX
            $table->integer('total_charges_prepaid')->nullable();
            $table->integer('total_charges_collect')->nullable();
            $table->integer('other_charges_due_agent_prepaid')->nullable();
            $table->integer('other_charges_due_agent_collect')->nullable();
            $table->integer('other_charges_due_carrier_prepaid')->nullable();
            $table->integer('other_charges_due_carrier_collect')->nullable();
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
