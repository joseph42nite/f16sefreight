<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phase 2.5: Add mailbox_connection_id FK to email_threads.
 *
 * This allows the inbox reply logic to deterministically know which
 * OAuth-connected mailbox received a thread and must send the reply
 * from that exact account (Gmail or Outlook) — ensuring the reply
 * appears to the customer as coming from the operator's business address.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->unsignedBigInteger('mailbox_connection_id')->nullable()->after('agent_id');
            $table->string('provider')->nullable()->after('mailbox_connection_id');           // 'gmail' | 'outlook'
            $table->string('provider_thread_id')->nullable()->after('provider');              // native Gmail threadId or Outlook conversationId
            $table->foreign('mailbox_connection_id')
                  ->references('id')
                  ->on('mailbox_connections')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->dropForeign(['mailbox_connection_id']);
            $table->dropColumn('mailbox_connection_id');
            $table->dropColumn('provider');
            $table->dropColumn('provider_thread_id');
        });
    }
};
