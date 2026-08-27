<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * llm_usage_logs — per-call cost and latency for every AI invocation.
 *
 * ── Attributed to an enquiry OR a job, and enquiry is the COMMON case ───────
 * Extraction normally runs pre-conversion, at enquiry status step 2, so most rows carry
 * `enquiry_id`. Without one of the two the spend is unattributable and per-shipment cost
 * analysis is impossible. Both are `ON DELETE SET NULL`: the cost was really incurred and
 * the row must survive its subject being removed — an orphaned cost line is still true.
 *
 * ⚠️ "Exactly one is set" is NOT enforced at the database. Adding a CHECK would make an
 * 8th, breaking the audited constraint inventory (CONTEXT.md §8), and the rule is really
 * a service-layer invariant. Assert it in tests instead.
 *
 * ── cost_usd is DECIMAL(8,6), not a float ──────────────────────────────────
 * Six decimal places because a single Gemma call costs fractions of a cent; a float would
 * accumulate rounding error across the millions of rows this table is designed to hold,
 * and the whole point is summing them accurately.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('llm_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('enquiry_id')->nullable();
            $table->unsignedBigInteger('job_id')->nullable();

            $table->string('model', 50);
            $table->integer('tokens_in')->default(0);
            $table->integer('tokens_out')->default(0);
            $table->decimal('cost_usd', 8, 6)->default(0);
            $table->integer('execution_ms')->default(0);

            $table->timestamps();

            $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('set null');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');

            $table->index(['model', 'created_at'], 'idx_llm_model_time');
        });
    }

    public function down()
    {
        Schema::dropIfExists('llm_usage_logs');
    }
};
