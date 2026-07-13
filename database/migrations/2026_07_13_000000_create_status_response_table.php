<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatusResponseTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('status_response', function (Blueprint $table) {
            $table->id();
            $table->string('message_id')->nullable();
            $table->string('type_code')->nullable();
            $table->string('issue_date_time')->nullable();
            $table->string('conversation_id')->nullable();
            $table->string('primary_id')->nullable();
            $table->string('business_id')->nullable();
            $table->string('business_name')->nullable();
            $table->string('business_type_code')->nullable();
            $table->string('business_status_code')->nullable();
            $table->string('condition_code')->nullable();
            $table->text('reason')->nullable();
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
        Schema::dropIfExists('status_response');
    }
}
