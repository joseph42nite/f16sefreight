<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('sequence_counters', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->string('prefix', 10);
            $table->string('fiscal_year', 4);
            $table->unsignedInteger('current_value')->default(0);
            $table->timestamps();
            $table->unique(['agent_id', 'prefix', 'fiscal_year']);
            $table->foreign('agent_id')->references('id')->on('agents_info');
        });
    }
    public function down() {
        Schema::dropIfExists('sequence_counters');
    }
};
