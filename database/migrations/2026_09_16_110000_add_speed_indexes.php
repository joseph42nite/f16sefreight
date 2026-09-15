<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Indexes for the reads that run on every screen load (2026-09-16 speed pass), measured on the demo data:
 *   - status_response by AWB number — the Kanban's in-transit bars, the tracking drawer and the message log; this
 *     table gains a row for every airline message, so a full scan grows without end
 *   - llm_usage_logs by document — the Credits tab asks "was this read by AI?" per document
 *   - email_messages by conversation in time order — every conversation and inbox row reads it that way
 *   - email_threads by branch, newest first — the inbox list's order
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('status_response', fn (Blueprint $t) => $t->index(['business_id', 'business_status_code'], 'idx_status_awb'));
        Schema::table('llm_usage_logs', fn (Blueprint $t) => $t->index('pdf_processing_job_id', 'idx_llm_document'));
        Schema::table('email_messages', fn (Blueprint $t) => $t->index(['thread_key', 'received_at'], 'idx_messages_thread_time'));
        Schema::table('email_threads', fn (Blueprint $t) => $t->index(['agent_id', 'latest_message_received_at'], 'idx_threads_branch_latest'));
    }

    public function down(): void
    {
        Schema::table('status_response', fn (Blueprint $t) => $t->dropIndex('idx_status_awb'));
        Schema::table('llm_usage_logs', fn (Blueprint $t) => $t->dropIndex('idx_llm_document'));
        Schema::table('email_messages', fn (Blueprint $t) => $t->dropIndex('idx_messages_thread_time'));
        Schema::table('email_threads', fn (Blueprint $t) => $t->dropIndex('idx_threads_branch_latest'));
    }
};
