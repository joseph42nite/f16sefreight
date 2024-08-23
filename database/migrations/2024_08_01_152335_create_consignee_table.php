<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsigneeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consignee_details', function (Blueprint $table) {
            $table->id();
            $table->integer('awb_id')->nullable();
            $table->string('cons_name')->nullable();
            $table->string('cons_account')->nullable();
            $table->string('cons_address')->nullable();
            $table->string('cons_city')->nullable();
            $table->string('cons_airport_code')->nullable();
            $table->integer('cons_post_code')->nullable();
            $table->string('cons_state')->nullable();
            $table->string('cons_country')->nullable();
            $table->string('cons_phone')->nullable();
            $table->integer('cons_fax')->nullable();
            $table->integer('cons_telex')->nullable();
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
        Schema::dropIfExists('consignee');
    }
}
