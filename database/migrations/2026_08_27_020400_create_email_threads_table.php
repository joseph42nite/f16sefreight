<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * email_threads — one row per conversation, spanning BOTH lifecycles.
 *
 * ⚠️ **BUILT BEFORE `email_messages`, which reverses the guide's ordering.**
 * implementation_guide.md §Batch 1b lists `email_messages` at step 3 and `email_threads`
 * at step 4 — but `email_messages.thread_key` carries an inline FOREIGN KEY to
 * `email_threads.thread_key`, so messages cannot be created first. There is no cycle
 * (email_threads references only agents_info, users, enquiries and jobs), so the fix is
 * simply to build threads first. The guide's order is wrong here; the DDL is right.
 *
 * ── enquiry_id and job_id are BOTH nullable, and both may be set ─────────────
 * The thread spans the whole lifecycle: enquiry_id is stamped at triage, job_id is added
 * on conversion, and the thread keeps both. **Both stay NULL for airline, clearance and
 * trucking mail** — that correspondence never becomes a work item, and forcing it into
 * one would inflate the enquiry count.
 *
 * ── first_response_at vs first_triage_at are DIFFERENT FACTS ────────────────
 * first_response_at is the first OUTBOUND reply and powers real response-latency SLA.
 * first_triage_at is internal triage — somebody looked at it. Conflating them reports
 * an SLA the client never experienced, because nothing was actually sent.
 * ⚠️ first_response_at ships NOW, with the table: trailing history cannot be
 * reconstructed later, so every day it is missing is a permanently blind day.
 *
 * ── Outbound mail is stored but NEVER classified ─────────────────────────────
 * Regex classification runs on INBOUND only. Classifying our own replies mints a second
 * enquiry from the same conversation and inflates the conversion denominator — one of
 * the load-bearing rules in PRD.md.
 *
 * ── thread_key is UNIQUE because it is a foreign-key TARGET ─────────────────
 * email_messages.thread_key references it. provider_thread_id (Gmail threadId / Graph
 * conversationId) is matched FIRST and heuristics only run when the provider gives us
 * nothing — native ids are authoritative.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('email_threads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('assigned_ops_id')->nullable();

            $table->unsignedBigInteger('enquiry_id')->nullable(); // set at triage
            $table->unsignedBigInteger('job_id')->nullable();     // added on conversion

            $table->string('thread_key', 255)->unique();
            $table->string('provider_thread_id', 255)->nullable();
            $table->timestamp('read_state_synced_at')->nullable();

            $table->string('status', 20)->default('unread');
            $table->string('classification', 20)->default('customer_enquiry');

            $table->timestamp('latest_message_received_at'); // last INBOUND message
            $table->timestamp('first_response_at')->nullable();  // first OUTBOUND reply
            $table->timestamp('first_triage_at')->nullable();    // internal, NOT a reply

            $table->json('pending_client_notification')->nullable();

            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('assigned_ops_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('set null');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');

            $table->index(['enquiry_id'], 'idx_threads_enquiry');
            $table->index(['job_id'], 'idx_threads_job');
        });
    }

    public function down()
    {
        Schema::dropIfExists('email_threads');
    }
};
