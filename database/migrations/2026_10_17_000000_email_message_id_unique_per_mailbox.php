<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 🔒 `email_messages.message_id` was UNIQUE across every tenant. The same mail sent to two branches (or two tenants)
 * arrives once in each mailbox, and the second copy was dropped as an "echo" of the first — so one desk never saw
 * it. An echo is the same message coming back into the SAME mailbox, so the key is (mailbox_connection_id,
 * message_id). The plain `message_id` index stays for the reply-chain lookup (ThreadMatcher tier 2).
 *
 * ⚠️ down() fails if two mailboxes have since stored the same message — that is the case this migration exists for.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::table('email_messages', function (Blueprint $table) {
            $table->unique(['mailbox_connection_id', 'message_id'], 'uniq_messages_mailbox_message');
            $table->dropUnique('email_messages_message_id_unique');
            $table->index('message_id', 'idx_messages_message_id');
        });
    }

    public function down()
    {
        Schema::table('email_messages', function (Blueprint $table) {
            $table->dropIndex('idx_messages_message_id');
            $table->unique('message_id', 'email_messages_message_id_unique');
            $table->dropUnique('uniq_messages_mailbox_message');
        });
    }
};
