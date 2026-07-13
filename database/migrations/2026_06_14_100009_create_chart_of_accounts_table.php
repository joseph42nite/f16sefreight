<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->string('code', 20);
            $table->string('name', 100);
            $table->enum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->unique(['agent_id', 'code']);
        });
    }
    public function down() {
        Schema::dropIfExists('chart_of_accounts');
    }
};
