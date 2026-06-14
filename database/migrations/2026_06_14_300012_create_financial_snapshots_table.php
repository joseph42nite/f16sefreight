<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('financial_snapshots', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('agent_id');
            $table->date('snapshot_date')->index();
            $table->unsignedBigInteger('accounting_period_id')->nullable();
            $table->decimal('total_receivables', 15, 2)->default(0.00);
            $table->decimal('total_payables', 15, 2)->default(0.00);
            $table->decimal('net_cash_flow', 15, 2)->default(0.00);
            $table->decimal('cash_on_hand', 15, 2)->default(0.00);
            $table->decimal('unbilled_revenue', 15, 2)->default(0.00);
            $table->decimal('accrued_expenses', 15, 2)->default(0.00);
            $table->timestamp('last_computed_at')->useCurrent();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('accounting_period_id')->references('id')->on('accounting_periods')->onDelete('set null');
            $table->unique(['agent_id', 'snapshot_date']);
        });
    }
    public function down() {
        Schema::dropIfExists('financial_snapshots');
    }
};
