<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Monthly sales targets per branch and transport mode, set by the Boss (PRD §2.3 "target assigner";
 * user, 2026-09-15: revenue, tonnage and shipments, each branch, monthly, per mode). A NULL figure is
 * "no target set" — never 0, which would read as a goal of nothing.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->unsignedBigInteger('agent_id');
            $table->foreign('agent_id')->references('id')->on('agents_info')->cascadeOnDelete();
            $table->string('transport_mode', 10);
            $table->date('period_month');
            $table->decimal('revenue_inr', 15, 2)->nullable();
            $table->decimal('tonnage_kg', 15, 3)->nullable();
            $table->unsignedInteger('shipments')->nullable();
            $table->foreignId('set_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['agent_id', 'transport_mode', 'period_month'], 'uk_sales_targets_branch_mode_month');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_targets');
    }
};
