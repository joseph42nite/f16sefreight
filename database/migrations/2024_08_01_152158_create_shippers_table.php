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
            $table->string('ship_name');
            $table->string('ship_account');
            $table->string('ship_address');
            $table->integer('ship_post_code');
            $table->string('ship_state');
            $table->string('ship_country');
            $table->integer('ship_phone');
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
