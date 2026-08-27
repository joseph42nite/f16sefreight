<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * cargo_arrival_notices — issued to consignees and brokers on flight/vessel arrival,
 * carrying free storage days and the demurrage start date (PRD.md §6.2).
 *
 * ── notice_number is UNIQUE PER AGENT, not globally ─────────────────────────
 * `uq_can_agent_no (agent_id, notice_number)` — every branch runs its own CAN- sequence
 * out of `sequence_counters`, so two branches both issuing CAN-…-26-0001 is correct,
 * not a collision. Same scoping rule as enquiry and job numbers.
 *
 * ── No deleted_at ───────────────────────────────────────────────────────────
 * A CAN is a document that was sent to a client and starts a demurrage clock. It is not
 * one of the six soft-deleting tables, and a tombstone would hold the number anyway —
 * numbers are never recycled.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('cargo_arrival_notices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id');

            $table->string('notice_number', 30); // CAN-{agent_code}-26-0001

            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs');

            $table->unique(['agent_id', 'notice_number'], 'uq_can_agent_no');
            $table->index(['job_id'], 'idx_can_job');
        });
    }

    public function down()
    {
        Schema::dropIfExists('cargo_arrival_notices');
    }
};
