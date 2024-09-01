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
            $table->integer('awb_id')->nullable();
            $table->string('agent_name')->nullable();
            $table->string('agent_address')->nullable();
            $table->string('agent_issue_sign')->nullable();
            $table->string('agent_issue_loc_code')->nullable();
            $table->string('agent_issue_date')->nullable();
            $table->string('agent_account')->nullable();
            $table->integer('iata_agent_code')->nullable(); //7
            $table->integer('iata_agent_cass')->nullable(); //4
            $table->string('office_airport')->nullable();
            $table->string('office_function_designator')->nullable(); //2
            $table->string('office_company_designator')->nullable();//2
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
