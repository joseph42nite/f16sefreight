<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * mailbox_connections — one row per connected Gmail/Outlook mailbox.
 *
 * 🔴 **TWO DEACTIVATION AXES. THEY ARE NOT INTERCHANGEABLE.**
 * This is the single most important thing about this table (CONTEXT.md §6, PRD.md §2.3.7).
 *
 *   is_active = false            -> a SUPERADMIN tier downgrade. Whole tenant, platform
 *                                   action on companies.tier. Tokens are KEPT, so an
 *                                   upgrade restores sync with no re-authorization.
 *   disconnected_at/_by          -> THE USER removed their own mailbox in
 *                                   /settings/mailboxes. Tokens CLEARED, auth_state
 *                                   reset to 'not_connected'. Only they can undo it,
 *                                   via fresh OAuth.
 *
 * **The bug this separation prevents:** PRD §3.3 has a tier upgrade reactivate
 * downgraded mailboxes. If both actors shared one column, a later upgrade would silently
 * reconnect a mailbox its owner deliberately removed and resume syncing their mail —
 * triggered by a billing change, performed by nobody.
 *
 *   Restore on upgrade MUST read:  WHERE is_active = 0 AND disconnected_at IS NULL
 *   Sync requires ALL THREE:       is_active = 1 AND disconnected_at IS NULL
 *                                  AND auth_state = 'connected'
 *
 * ── NO SoftDeletes on this table, deliberately ──────────────────────────────
 * `email_address` is globally UNIQUE, so a soft-deleted row would block that mailbox for
 * every tenant forever. PRD.md §9.3 lists SIX soft-deleting tables and this is not one —
 * it was removed from that list on purpose. **Do not put the trait on this model.**
 *
 * ── There is no `status` column, and that is intentional ─────────────────────
 * It duplicated `auth_state` (same three values) and was dropped 2026-08-26. Two columns
 * describing one fact eventually disagree. `auth_state` is the sole connection-state
 * column and is what PRD.md §5.2.1's four UI states are written against.
 * Repeated backfill failure sets `auth_state = 'reauth_required'` — NOT 'failed', which
 * is not one of its values.
 *
 * ── 🔐 Encrypted at rest via the model's `encrypted` cast (Step 2) ───────────
 * access_token, refresh_token and sync_cursor. TEXT rather than VARCHAR for the same
 * reason as the bank columns: the encrypted payload is far longer than the plaintext.
 * ⚠️ The column type encrypts nothing — until the cast exists these hold live OAuth
 * tokens in plaintext, which is strictly worse than the bank columns. See GAPS.md #3.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('mailbox_connections', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('user_id');

            $table->string('email_address', 100)->unique();
            $table->string('provider', 20); // google | microsoft

            $table->text('access_token')->nullable();  // 🔐 encrypted cast
            $table->text('refresh_token')->nullable(); // 🔐 encrypted cast
            $table->timestamp('expires_at')->nullable();

            // SUPERADMIN axis only — tier downgrade. Never a user removing their mailbox.
            $table->boolean('is_active')->default(true);

            $table->text('sync_cursor')->nullable();   // 🔐 encrypted cast
            $table->timestamp('last_synced_at')->nullable();

            $table->string('backfill_status', 20)->default('pending');
            $table->timestamp('backfill_from')->nullable();
            $table->timestamp('backfill_completed_at')->nullable();
            $table->text('backfill_page_cursor')->nullable();
            $table->integer('backfill_processed')->default(0);
            $table->integer('backfill_estimate')->nullable();
            $table->integer('backfill_attempts')->default(0);

            $table->timestamp('watch_expires_at')->nullable();

            $table->text('signature_html')->nullable(); // overrides users.signature_text
            $table->string('signature_source', 20)->nullable();

            $table->string('auth_state', 30)->default('not_connected');

            // USER axis — the owner removed their own mailbox.
            $table->timestamp('disconnected_at')->nullable();
            $table->unsignedBigInteger('disconnected_by')->nullable();

            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('disconnected_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('mailbox_connections');
    }
};
