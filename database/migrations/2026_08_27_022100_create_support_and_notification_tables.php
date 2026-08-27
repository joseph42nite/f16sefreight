<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * support_tickets + notifications — Batch 1b steps 16 and 17.
 *
 * ═══ support_tickets — in-app bug reports with the context attached ═════════
 * `route`, `element_selector`, `screenshot_path` (html2canvas) and `console_logs` are
 * captured automatically at report time. The point is that a user reports "this button
 * did nothing" and the ticket already carries where they were and what the browser said,
 * instead of a support round-trip that never converges.
 *
 * ═══ notifications ══════════════════════════════════════════════════════════
 * ── UUID primary key, not auto-increment ──────────────────────────────────
 * CHAR(36) — this is Laravel's own notifications shape, and IDs are minted client-side
 * or in queue workers where an auto-increment round-trip is unhelpful.
 *
 * ── priority exists to pin ONE thing to the top of the bell ────────────────
 * Reassignment-approval requests block another person's work, so they must not scroll
 * away under routine noise. The bell orders `priority DESC, created_at DESC` — without
 * the column that ordering is unexpressible and approvals get missed.
 *
 * ── agent_id is present even though notifiable_id identifies the recipient ─
 * Branch isolation applies to notifications too: a query for "this branch's
 * notifications" must not need a join through users to establish tenancy.
 *
 * ── notifiable is polymorphic, so no FK ───────────────────────────────────
 * `notifiable_type` is usually 'App\User'. Same application-enforced tenant check as
 * every other morph in the schema.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('support_tickets')) {
            Schema::create('support_tickets', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('user_id');

                $table->string('route', 255);                    // where they were
                $table->string('element_selector', 255)->nullable();
                $table->string('screenshot_path', 500)->nullable(); // html2canvas capture
                $table->json('console_logs')->nullable();

                $table->text('description');
                $table->string('status', 20)->default('open'); // open | investigating | resolved

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('user_id')->references('id')->on('users');

                $table->index(['status', 'created_at'], 'idx_tickets_status');
            });
        }

        if (! Schema::hasTable('notifications')) {
            Schema::create('notifications', function (Blueprint $table) {
                $table->char('id', 36)->primary(); // UUID
                $table->unsignedBigInteger('agent_id');

                $table->string('type', 255);            // notification class name
                $table->string('notifiable_type', 100); // usually 'App\User'
                $table->unsignedBigInteger('notifiable_id');

                $table->json('data');
                $table->smallInteger('priority')->default(0); // bell sort weight
                $table->timestamp('read_at')->nullable();     // NULL = unread

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');

                // The bell query: this recipient, unread first, priority pinned to top.
                $table->index(['notifiable_type', 'notifiable_id', 'read_at'], 'idx_notifications_recipient');
                $table->index(['agent_id', 'priority', 'created_at'], 'idx_notifications_bell');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('support_tickets');
    }
};
