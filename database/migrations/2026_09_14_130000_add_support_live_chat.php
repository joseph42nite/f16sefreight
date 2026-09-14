<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * "Connect to Support Agent" (PRD §5.10), as the user decided it on 2026-09-14: it raises a ticket
 * in the support desk and a live chat runs ON that ticket.
 *
 * - `channel`: `report` for the element-picking bug report, `chat` for a conversation with an agent.
 * - The two read markers say what each side has not seen yet: the client's Help button shows a badge
 *   for agent replies, the desk shows which chats are waiting on F16s. ⚠️ They are MESSAGE IDS, not
 *   times: a reply in the same second as the last read counted as read when they were timestamps.
 * - Messages are checked every 3 s while a chat is open (no WebSockets yet, user's choice). When no
 *   agent picks up, the ticket stays in the queue and the reply appears the next time Help is opened.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('support_tickets', function (Blueprint $table) {
            $table->string('channel', 20)->default('report')->after('agent_id');
            $table->timestamp('last_message_at')->nullable()->after('status');
            $table->unsignedBigInteger('user_read_message_id')->nullable()->after('last_message_at');
            $table->unsignedBigInteger('agent_read_message_id')->nullable()->after('user_read_message_id');
            // ⚠️ No composite (user_id, …) index: the user_id foreign key would then depend on it and
            // the rollback could not drop it. A user has a handful of tickets; the FK index is enough.
        });

        Schema::create('support_ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('support_ticket_id');
            // user (the client's staff) | agent (F16s) | system (opened, closed)
            $table->string('sender', 10);
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('super_admin_id')->nullable();
            $table->text('body');
            $table->timestamps();

            $table->foreign('support_ticket_id')->references('id')->on('support_tickets')->cascadeOnDelete();
            $table->index(['support_ticket_id', 'id'], 'idx_ticket_messages');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_ticket_messages');

        Schema::table('support_tickets', function (Blueprint $table) {
            $table->dropColumn(['channel', 'last_message_at', 'user_read_message_id', 'agent_read_message_id']);
        });
    }
};
