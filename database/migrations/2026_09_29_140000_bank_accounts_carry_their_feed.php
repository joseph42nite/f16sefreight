<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A bank account's live feed (owner, 2026-09-29: "let's build the Setu connection"; PRD §6.4, GAPS #442).
 *
 * The consent is per ACCOUNT: `provider` = 'setu' and `provider_ref` = Setu's consent id, both already on the row.
 * These columns say where that consent stands and how far the account's statement has been read. READ-ONLY: an
 * Account Aggregator consent lets us read the statement, and nothing here can move money.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_accounts', function (Blueprint $table) {
            // NULL = no feed. pending (waiting for the account holder to approve) · active · paused · rejected ·
            // revoked · expired — as Setu reports the consent.
            $table->string('feed_status', 12)->nullable()->after('provider_ref');
            // Where the account holder approves the consent — Setu's page, opened by accounts.
            $table->string('feed_consent_url', 500)->nullable()->after('feed_status');
            $table->timestamp('feed_expires_at')->nullable()->after('feed_consent_url');
            // A statement request in flight; Setu prepares the data and we collect it.
            $table->string('feed_session_id', 64)->nullable()->after('feed_expires_at');
            // The last day the statement has been read up to — the next request starts a little before it.
            $table->date('feed_fetched_through')->nullable()->after('feed_session_id');
            $table->timestamp('feed_synced_at')->nullable()->after('feed_fetched_through');
            // Why the last attempt did not bring the statement in, in words for accounts.
            $table->string('feed_error', 255)->nullable()->after('feed_synced_at');
        });
    }

    public function down(): void
    {
        Schema::table('bank_accounts', function (Blueprint $table) {
            $table->dropColumn(['feed_status', 'feed_consent_url', 'feed_expires_at', 'feed_session_id',
                'feed_fetched_through', 'feed_synced_at', 'feed_error']);
        });
    }
};
