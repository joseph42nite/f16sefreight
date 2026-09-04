<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The provider's own id for a message — the handle needed to act ON it.
 *
 * 🔴 `GraphMailProvider` has always read `$raw['id']` into `NormalisedMessage::providerId`,
 * and the ingestor then dropped it: there was no column. `message_id` (RFC 5322) identifies
 * a message but is NOT addressable — you cannot ask Graph to reply to it. Without this,
 * a reply can only ever be a NEW message, which lands in the client's mailbox as a separate
 * conversation and reads to them as if we lost the thread.
 *
 * ⚠️ Nullable, because historical rows have none and never will. Code that threads a reply
 * has to cope with NULL by falling back to a fresh send.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_messages', function (Blueprint $table) {
            $table->string('provider_message_id', 512)->nullable()->after('message_id');
        });
    }

    public function down(): void
    {
        Schema::table('email_messages', function (Blueprint $table) {
            $table->dropColumn('provider_message_id');
        });
    }
};
