<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * PRD §7.3.4 G as measured facts, one row per client, mode and financial-year quarter (owner, 2026-10-05: "measure
 * first, score later"; GAPS #456). Nothing here is weighted: `customer_performance_snapshots.ops_health` stays NULL until
 * the owner picks weights from what these numbers look like.
 *
 * Every figure is NULL when there is too little to say (PRD guard rails), never 0 — a quiet quarter is not a good one.
 * Rates are percent (0–100). The row for the running quarter is rewritten each night; a past quarter's row is the
 * record the quarterly staff review compares against.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_ops_quarters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->string('transport_mode', 10);
            $table->date('quarter_start');
            $table->unsignedBigInteger('agent_id');

            $table->unsignedInteger('job_count')->default(0);
            // Σ over our own steps of max(client median − branch median, 0), in days; and each step's delta.
            $table->decimal('days_slower', 6, 2)->nullable();
            $table->json('step_deltas')->nullable();
            $table->decimal('cancellation_rate', 5, 2)->nullable();
            // Air only: the share of jobs whose waybill the airline rejected at least once (FNA).
            $table->decimal('fna_rate', 5, 2)->nullable();
            // Median of |actual − declared| ÷ declared (PRD §5.3).
            $table->decimal('weight_gap_pct', 6, 2)->nullable();

            $table->timestamp('computed_at')->nullable();
            $table->timestamps();

            $table->unique(['customer_id', 'transport_mode', 'quarter_start'], 'customer_ops_quarters_unique');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('agent_id')->references('id')->on('agents_info');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_ops_quarters');
    }
};
