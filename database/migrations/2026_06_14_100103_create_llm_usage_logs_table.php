<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('llm_usage_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('job_id')->nullable();
            $table->string('model', 50);
            $table->unsignedInteger('tokens_in')->default(0);
            $table->unsignedInteger('tokens_out')->default(0);
            $table->decimal('cost_usd', 8, 6)->default(0.000000);
            $table->timestamps();

            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
        });
    }
    public function down() {
        Schema::dropIfExists('llm_usage_logs');
    }
};
