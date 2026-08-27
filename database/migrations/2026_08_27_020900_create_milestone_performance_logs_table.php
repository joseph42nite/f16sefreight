<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * milestone_performance_logs — an append-only stamp each time a job ENTERS a milestone.
 *
 * ── Why a log table and not columns on `jobs` ───────────────────────────────
 * `jobs.status` holds only the CURRENT state, so it can answer "where is this shipment?"
 * but never "how long did Verification take?" or "which stage is the bottleneck?". One
 * timestamp column per milestone would answer the first question but not re-entry — a
 * job bounced back from Verification to AI Extraction visits the same milestone twice,
 * and a single column silently overwrites the first visit.
 *
 * ── entered_at is supplied, not defaulted ───────────────────────────────────
 * NOT NULL with no default: the caller states when the transition happened. A backfilled
 * or replayed transition must carry its real time, not the moment the row was written.
 * Distinct from created_at, which is when we recorded it — usually the same, and when
 * they differ the difference is the interesting part.
 *
 * ── job_id is RESTRICT, matching the DDL ────────────────────────────────────
 * No ON DELETE clause, so performance history pins the job. That is consistent with
 * this being the substrate for the Operator Load Index and stage-duration analytics —
 * silently dropping history would skew every average it feeds.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('milestone_performance_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id');

            $table->string('milestone_name', 50);
            $table->timestamp('entered_at'); // supplied by the caller — see above

            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs');
        });
    }

    public function down()
    {
        Schema::dropIfExists('milestone_performance_logs');
    }
};
