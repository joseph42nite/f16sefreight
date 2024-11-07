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
            $table->integer('user_id')->nullable();
            $table->string('agent_name')->nullable();
            $table->string('agent_address')->nullable();
            $table->string('agent_pincode')->nullable();
            $table->string('agent_city')->nullable();
            $table->string('agent_country', 50)->nullable()->default('IN');
            $table->string('agent_issue_sign')->nullable();
            $table->string('agent_issue_loc_code')->nullable();
            $table->string('agent_issue_date')->nullable();
            $table->string('agent_account')->nullable();
            $table->integer('iata_agent_code')->nullable(); //7
            $table->integer('iata_agent_cass')->nullable(); //4
            $table->string('agent_contact_person_phone', 20)->nullable();
            $table->string('agent_contact_person_email', 50)->nullable();
            $table->string('agent_contact_person_email', 50)->nullable();
            $table->string('office_airport')->nullable();
            $table->string('office_function_designator')->nullable();
            $table->string('office_company_designator')->nullable();
            $table->string('office_file_reference')->nullable();
            $table->tinyInteger('participant')->default(0)->nullable();
            $table->string('participant_airport')->nullable();
            $table->string('prticipant_identifer')->nullable();
            $table->string('participant_code')->nullable();
            $table->string('participant_file_reference')->nullable();
            $table->string('ho_name',100)->nullable();
            $table->string('ho_address', 200)->nullable();
            $table->string('ho_city')->nullable();
            $table->string('ho_pincode', 20)->nullable();
            $table->string('ho_state', 100)->nullable();
            $table->string('ho_country')->nullable();
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