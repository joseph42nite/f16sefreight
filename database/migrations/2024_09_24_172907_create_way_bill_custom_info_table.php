<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWayBillCustomInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('way_bill_custom_info', function (Blueprint $table) {
            $table->id();
            $table->integer('awb_id')->nullable();
            $table->string('country_code',10)->nullable();
            $table->string('info_identifier', 10)->nullable();
            $table->string('custom_info_identifier',10)->nullable();
            $table->string('supplementary_info',150)->nullable();
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
        Schema::dropIfExists('way_bill_custom_info');
    }
}
