<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSavedAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('saved_addresses', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable();
            $table->string('address_type',100)->nullable();
            $table->string('name',100)->nullable();
            $table->string('account',100)->nullable();
            $table->string('address',200)->nullable();
            $table->string('address_line_2',200)->nullable();
            $table->string('city',100)->nullable();
            $table->string('airport_code',100)->nullable();
            $table->integer('post_code')->nullable();
            $table->string('state',100)->nullable();
            $table->string('country',100)->nullable();
            $table->integer('phone')->nullable();
            $table->integer('fax')->nullable();
            $table->integer('telex')->nullable();
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
        Schema::dropIfExists('saved_addresses');
    }
}
