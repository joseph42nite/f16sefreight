<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('accounts_ledger_entries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('chart_of_account_id');
            $table->date('entry_date')->index();
            $table->string('reference_type', 50);
            $table->unsignedBigInteger('reference_id');
            $table->decimal('debit', 15, 2)->default(0.00);
            $table->decimal('credit', 15, 2)->default(0.00);
            $table->string('narration')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('chart_of_account_id')->references('id')->on('chart_of_accounts');
            $table->index(['reference_type', 'reference_id']);
        });
    }
    public function down() {
        Schema::dropIfExists('accounts_ledger_entries');
    }
};
