<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Jev in accounts (user, 2026-09-26; implementation_guide §11.7; GAPS #412).
 *
 * ═══ ai_decisions ═══════════════════════════════════════════════════════════
 * One row per question Jev was asked about one thing — a bank line, a partner, a mail — and what the person then
 * did. It is the answer to "why did it suggest that?" and to "how often is it right?", and no confidence floor is
 * lowered without it.
 *
 * 🔒 `state` — exactly what Jev was shown: names, memos, amounts — is ENCRYPTED at rest (Laravel's encrypter,
 * APP_KEY). The log keeps the evidence without keeping a readable copy of the tenant's client data in a table
 * whose whole purpose is to be kept.
 *
 * UNIQUE (subject, question, rubric version): asked ONCE — reopening a bank line neither re-asks nor re-bills, and
 * a rubric edit (a new version) is the only thing that asks again.
 *
 * ═══ ai_decision_switches ═══════════════════════════════════════════════════
 * Per company, per decision point, set by accounts or the Boss. No row = on. Floors are NOT here: they live in
 * config/accounts_decisions.php, never on a screen.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->string('subject_type', 40);
            $table->unsignedBigInteger('subject_id');
            $table->string('question', 40);
            $table->string('rubric_version', 20);
            $table->json('options');                         // the option keys offered — never more than PHP built
            $table->text('state');                           // 🔒 encrypted
            $table->string('answer', 60)->nullable();
            $table->decimal('confidence', 5, 4)->nullable();
            $table->boolean('suggested')->default(false);    // cleared its floor, and was not "none" / "can't tell"
            $table->string('outcome', 12)->nullable();       // accepted · changed
            $table->string('outcome_value', 60)->nullable();
            $table->unsignedBigInteger('decided_by')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();

            $table->unique(['subject_type', 'subject_id', 'question', 'rubric_version'], 'uq_ai_decision');
            $table->index(['company_id', 'question'], 'idx_ai_decision_company_question');
            $table->foreign('agent_id')->references('id')->on('agents_info')->nullOnDelete();
            $table->foreign('decided_by')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('ai_decision_switches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('question', 40);
            $table->boolean('enabled');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->unique(['company_id', 'question'], 'uq_ai_switch');
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });

        // Accounts decisions are charged like mail filing, and identified the same way — by their own reference,
        // never by notes or by amount.
        Schema::table('ocr_credit_transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('ai_decision_id')->nullable()->after('email_message_id');
            $table->index('ai_decision_id', 'idx_credit_ai_decision');
        });
    }

    public function down(): void
    {
        Schema::table('ocr_credit_transactions', function (Blueprint $table) {
            $table->dropIndex('idx_credit_ai_decision');
            $table->dropColumn('ai_decision_id');
        });
        Schema::dropIfExists('ai_decision_switches');
        Schema::dropIfExists('ai_decisions');
    }
};
