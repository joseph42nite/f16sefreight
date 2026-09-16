<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Mails the Boss is offered to send his own team (user, 2026-09-16): next month's targets, a volume drop, top
 * clients gone quiet, a branch behind target, losing on price, slower replies, money overdue. Worked out nightly
 * from the figures, drafted on request, sent only when he presses Send.
 *
 * A table of its own rather than `sales_action_queue`: those rows are a rep's, about one client, and internal ones
 * may not carry a draft by rule. These are the Boss's, about a branch, and always become a mail.
 * `rest_key` names what a suggestion is about, so one sent or dismissed is not offered again for 30 days.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boss_mail_suggestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->unsignedBigInteger('agent_id');
            $table->foreign('agent_id')->references('id')->on('agents_info')->cascadeOnDelete();
            $table->string('kind', 40);
            $table->string('rest_key', 190);
            $table->decimal('priority', 8, 2)->default(0);
            $table->json('facts');
            $table->json('suggested_to');            // user ids
            $table->string('draft_subject')->nullable();
            $table->text('draft_body')->nullable();
            $table->json('draft_to')->nullable();
            $table->json('draft_cc')->nullable();
            $table->timestamp('drafted_at')->nullable();
            $table->string('status', 20)->default('open');   // open · sent · dismissed
            $table->timestamp('sent_at')->nullable();
            $table->foreignId('sent_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('dismissed_reason', 30)->nullable();
            $table->string('dismissed_note', 500)->nullable();
            $table->foreignId('dismissed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('dismissed_at')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'status'], 'idx_boss_mail_company_status');
            $table->index(['company_id', 'rest_key'], 'idx_boss_mail_rest');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boss_mail_suggestions');
    }
};
