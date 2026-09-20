<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Chasing money: what was said, what was promised, and when to ask again (user, 2026-09-20).
 *
 * 🔴 **A promise is a DATE and an AMOUNT, not a note.** "They said next week" cannot be reported on, cannot be
 * sorted by, and cannot be shown to have been broken. The ageing tells you who owes; this table is the only record
 * of what has been done about it.
 *
 * ⚠️ Against a PARTY, not only against a document. A client is chased for everything they owe in one call, and a
 * follow-up tied to a single invoice would be logged five times for one conversation. `invoice_id` is there for
 * when the conversation really was about one bill.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collection_follow_ups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id')->index();
            // Who is being chased — a client, or a partner on a brokerage or consol bill.
            $table->string('party_type', 20)->default('customer');
            $table->unsignedBigInteger('party_id');
            $table->unsignedBigInteger('invoice_id')->nullable();
            // How they were chased, and what came of it.
            $table->string('channel', 20)->default('email');
            $table->text('note');
            $table->date('promised_date')->nullable();
            $table->decimal('promised_amount', 15, 2)->nullable();
            $table->date('next_action_date')->nullable();
            // open → kept | broken | closed. Never deleted: a broken promise is the most useful row here.
            $table->string('state', 20)->default('open');
            $table->string('outcome_note', 255)->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('invoice_id')->references('id')->on('accounts_invoices');
            $table->index(['party_type', 'party_id', 'state'], 'idx_followup_party');
            $table->index('next_action_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_follow_ups');
    }
};
