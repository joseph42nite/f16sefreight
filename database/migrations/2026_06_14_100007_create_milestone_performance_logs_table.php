<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('milestone_performance_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id');
            $table->string('milestone_name', 50);
            $table->timestamp('entered_at');
            $table->timestamp('exited_at')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->unsignedBigInteger('operator_id')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('operator_id')->references('id')->on('users')->onDelete('set null');
        });
    }
    public function down() {
        Schema::dropIfExists('milestone_performance_logs');
    }
};
