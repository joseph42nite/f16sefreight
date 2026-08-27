<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * email_messages — every message, inbound and outbound.
 *
 * 🔴 **idempotency_key IS DECLARED UNIQUE HERE — the DDL block forgot to.**
 * database_relations_tree.md's column table marks it `UK` and describes it as the
 * ** DOUBLE-SEND GUARD **: *"A retried request (network blip, double-click, queue
 * redelivery) collides on this UNIQUE key and returns the original result instead of
 * sending the mail twice. Sending a client the same message twice is unrecoverable."*
 * The runnable DDL block, however, declares only `idempotency_key CHAR(36) NULL` with
 * the word UNIQUE in a **comment** — no constraint. Without the index the guard does not
 * exist and a double-click sends the client two emails. Declared properly here.
 * NULLABLE + UNIQUE is correct: MySQL permits repeated NULLs, and inbound messages have
 * no idempotency key.
 *
 * ── The undo window, and why it is a timestamp rather than a queue delay ─────
 * scheduled_send_at holds dispatch (default +15s). Cancelling inside the window sets
 * send_state='cancelled' and NOTHING EVER LEAVES — the same principle as the vision-OCR
 * consent gate: a moment of reversibility in front of an irreversible act.
 *
 * ── sent_via_portal recognises our own echo ─────────────────────────────────
 * The Sent folder is synced too, so a message we just sent comes back through polling.
 * Without this flag it is ingested as new inbound mail and classified — minting a
 * phantom enquiry from our own reply.
 *
 * ── is_historical suppresses everything time-sensitive ──────────────────────
 * Backfilled mail must not start SLA countdowns, fire notifications or propose enquiries;
 * a 60-day onboarding import would otherwise detonate the whole workload engine at once.
 *
 * ── body_snippet vs body_storage_path ───────────────────────────────────────
 * Thread lists read ONLY the snippet; full bodies live in S3 (~900GB/yr at 1k mailboxes).
 * body_purge_after implements DPDP retention: the S3 object is purged at 2 years and the
 * ROW SURVIVES, so history and analytics stay intact without holding the content.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('email_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('mailbox_connection_id');

            $table->string('thread_key', 255);
            $table->string('provider_thread_id', 255)->nullable();

            $table->string('direction', 10)->default('inbound'); // inbound | outbound
            $table->boolean('sent_via_portal')->default(false);

            // DOUBLE-SEND GUARD — unique, which the DDL block omitted. See above.
            $table->char('idempotency_key', 36)->nullable()->unique();

            $table->string('send_state', 20)->nullable(); // outbound only
            $table->timestamp('scheduled_send_at')->nullable(); // undo window
            $table->integer('send_attempts')->default(0);
            $table->string('send_error', 500)->nullable();

            $table->string('message_id', 255)->unique();
            $table->string('from', 255);
            $table->string('to', 255)->nullable();
            $table->string('subject', 255)->nullable();

            $table->string('body_snippet', 500)->nullable();
            $table->string('body_storage_path', 500)->nullable();
            $table->timestamp('body_purge_after')->nullable(); // DPDP: purge object, keep row

            $table->timestamp('received_at')->nullable();
            $table->boolean('is_historical')->default(false);

            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('mailbox_connection_id')->references('id')->on('mailbox_connections')->onDelete('cascade');
            $table->foreign('thread_key')->references('thread_key')->on('email_threads');
        });
    }

    public function down()
    {
        Schema::dropIfExists('email_messages');
    }
};
