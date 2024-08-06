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
            $table->string('cons_name');
            $table->string('cons_account');
            $table->string('cons_address');
            $table->integer('cons_post_code');
            $table->string('cons_state');
            $table->string('cons_country');
            $table->string('cons_phone');
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
