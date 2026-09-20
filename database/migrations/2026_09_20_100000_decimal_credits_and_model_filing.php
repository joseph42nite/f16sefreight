<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Credits learn decimals, and a filing decision records where it came from (user, 2026-09-20).
 *
 * ═══ Why decimals ══════════════════════════════════════════════════════════
 * 🔴 The credit ledger was INTEGER, so every priced thing had to cost a whole document:
 * 0, 1 or 3. Classifying one inbound mail with Jev costs about ₹0.003 against a document's
 * ₹0.025 — a tenth. On an integer ledger that had to be rounded to 1, charging eight times
 * the real cost, or to 0, which tells the tenant the AI reading their mail is free. Neither
 * is a rate; both are a rounding error wearing one.
 *
 * DECIMAL, not float, and the usual reason: `ocr_credits_balance` is money in all but name,
 * it is compared against a floor to decide whether to spend, and binary floats do not hold
 * 0.1. Two decimal places covers every rate in play (0, 0.1, 1, 3) with room under it.
 *
 * ⚠️ Widening INT → DECIMAL(12,2) is lossless and needs no data fix: every existing balance
 * and ledger row is a whole number and stays one. `down()` truncates toward zero, which is
 * why it is a one-way door in practice — a tenant sitting at 4.6 credits comes back as 4.
 *
 * ═══ Why the filing columns ════════════════════════════════════════════════
 * `auto_classification` already records WHAT was decided, which is what Super Admin →
 * Mail filing compares against the operator's correction. It never recorded WHO decided,
 * so "the overrides are up" could not be answered with "the model's are, the domain
 * directory's are not" — and the two have entirely different fixes.
 *
 * `auto_classification_rubric` stamps config/mail_intent.php's version on the decision. The
 * rubric is prose that gets edited; without the version, accuracy telemetry averages over
 * every wording it has ever had and measures nothing.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Raw MODIFY rather than ->change(): the type change is the whole point, and a
        // doctrine/dbal round trip through a table this central is a worse bet than SQL
        // that says exactly what it does.
        DB::statement('ALTER TABLE companies MODIFY ocr_credits_balance DECIMAL(12,2) NOT NULL DEFAULT 0');
        DB::statement('ALTER TABLE companies MODIFY ocr_credits_monthly_allowance DECIMAL(12,2) NULL');
        DB::statement('ALTER TABLE companies MODIFY ocr_credits_limit DECIMAL(12,2) NULL');
        DB::statement('ALTER TABLE ocr_credit_transactions MODIFY amount DECIMAL(12,2) NOT NULL');

        Schema::table('ocr_credit_transactions', function (Blueprint $table) {
            // WHICH mail burned this credit — the mail-side twin of pdf_processing_job_id,
            // and the only way the credits panel can separate mail from documents.
            $table->unsignedBigInteger('email_message_id')->nullable()->after('pdf_processing_job_id');

            $table->foreign('email_message_id')->references('id')->on('email_messages')->onDelete('set null');
        });

        Schema::table('email_threads', function (Blueprint $table) {
            // rule | client | directory | model | none — see MailFilingService::classify().
            $table->string('auto_classification_source', 20)->nullable()->after('auto_classification');
            // The model's own certainty, kept even when it cleared the floor: a folder filed
            // at 0.61 and corrected is a different story from one filed at 0.99 and corrected.
            $table->decimal('auto_classification_confidence', 4, 3)->nullable()->after('auto_classification_source');
            $table->string('auto_classification_rubric', 20)->nullable()->after('auto_classification_confidence');
        });
    }

    public function down(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->dropColumn(['auto_classification_source', 'auto_classification_confidence', 'auto_classification_rubric']);
        });

        Schema::table('ocr_credit_transactions', function (Blueprint $table) {
            $table->dropForeign(['email_message_id']);
            $table->dropColumn('email_message_id');
        });

        // ⚠️ Lossy: a fractional balance or ledger row is truncated toward zero.
        DB::statement('ALTER TABLE ocr_credit_transactions MODIFY amount INT NOT NULL');
        DB::statement('ALTER TABLE companies MODIFY ocr_credits_limit INT NULL');
        DB::statement('ALTER TABLE companies MODIFY ocr_credits_monthly_allowance INT NULL');
        DB::statement('ALTER TABLE companies MODIFY ocr_credits_balance INT NOT NULL DEFAULT 0');
    }
};
