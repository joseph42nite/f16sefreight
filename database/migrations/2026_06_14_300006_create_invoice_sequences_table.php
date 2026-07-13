<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('invoice_sequences', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->enum('type', ['invoice', 'debit_note', 'credit_note', 'brokerage', 'consol_invoice']);
            $table->string('fiscal_year', 4);
            $table->unsignedInteger('current_value')->default(0);
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->unique(['agent_id', 'type', 'fiscal_year']);
        });
    }
    public function down() {
        Schema::dropIfExists('invoice_sequences');
    }
};
