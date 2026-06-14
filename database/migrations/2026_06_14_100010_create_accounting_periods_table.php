<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounting_periods', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['open', 'closed', 'locked'])->default('open');
            $table->unsignedBigInteger('closed_by')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('closed_by')->references('id')->on('users');
            $table->unique(['agent_id', 'start_date', 'end_date']);
        });
    }
    public function down() {
        Schema::dropIfExists('accounting_periods');
    }
};
