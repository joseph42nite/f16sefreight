<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgentsInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agents_info', function (Blueprint $table) {
            $table->id();
            $table->string('agent_name');
            $table->string('agent_address');
            $table->string('agent_issue_sign');
            $table->string('agent_issue_loc_code');
            $table->string('agent_issue_date');
            $table->string('agent_account');
            $table->integer('iata_agent_code'); //7
            $table->integer('iata_agent_cass')->nullable(); //4
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
        Schema::dropIfExists('agents_info');
    }
}
