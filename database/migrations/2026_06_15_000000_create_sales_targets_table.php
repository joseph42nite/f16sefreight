<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesTargetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_targets', function (Blueprint $table) {
            $table->id();
            $table->string('target_type'); // 'branch' or 'user'
            $table->unsignedBigInteger('target_id'); // branch_id (agent_id) or user_id
            $table->string('quarter'); // e.g. '2026-Q1'
            $table->decimal('revenue_target', 15, 2)->nullable();
            $table->decimal('tonnage_target', 15, 2)->nullable();
            $table->timestamps();

            $table->unique(['target_type', 'target_id', 'quarter']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sales_targets');
    }
}
