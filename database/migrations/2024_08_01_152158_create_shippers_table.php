<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShippersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipper_deatils', function (Blueprint $table) {
            $table->id();
            $table->integer('awb_id')->nullable();
            $table->string('ship_name')->nullable();
            $table->string('ship_account')->nullable();
            $table->string('ship_address')->nullable();
            $table->string('ship_city')->nullable();
            $table->string('ship_airport_code')->nullable();
            $table->integer('ship_post_code')->nullable();
            $table->string('ship_state')->nullable();
            $table->string('ship_country')->nullable();
            $table->integer('ship_phone')->nullable();
            $table->integer('ship_fax')->nullable();
            $table->integer('ship_telex')->nullable();
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
        Schema::dropIfExists('shippers');
    }
}
