<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ocr_credit_transactions + pdf_extraction_corrections — Batch 1b step 15.
 *
 * ═══ ocr_credit_transactions — an append-only credit ledger ═════════════════
 * Every movement of OCR credit: monthly_grant, purchase, consumption, refund,
 * custom_override. `companies.ocr_credits_balance` is the running total; THIS is the
 * evidence for it. `created_at` only, no `updated_at` — a ledger line is never amended.
 *
 * 🔴 **UNIQUE on reverses_transaction_id is the entire double-refund guard.**
 * A refund row points at the consumption it undoes. The UNIQUE index makes it
 * PHYSICALLY IMPOSSIBLE for a retried job to refund the same reservation twice —
 * enforced by the database, not by application care. This matters because the refund
 * path exists precisely for the failure case (Gemini times out after reserving), and
 * failure paths are exactly where retries happen.
 *
 * ── pdf_processing_job_id answers "what did we spend this on?" ─────────────
 * Previously unanswerable. Added 2026-08-26 (CONTEXT.md §6). SET NULL, because the
 * spend really happened even if the extraction record is later cleaned up.
 *
 * ── enquiry_id is the common case ─────────────────────────────────────────
 * Credits are usually burned PRE-conversion, on the enquiry.
 *
 * 🔒 **Vision OCR is OPT-IN — the system never spends a credit on its own.** The first
 * call always runs `allow_vision = false`. If no text layer is found, FastAPI returns
 * `extraction_path = 'none'`, **nothing is reserved and no Gemini call is made**, and the
 * job parks at `awaiting_vision_consent`. A human decision sits between the two calls.
 *
 * ⚠️ **Nothing here grants the monthly credits.** `companies.ocr_credits_monthly_allowance`
 * and the `monthly_grant` type both exist, but the `credits:grant-monthly` command
 * (guide §4.7) is what applies them — and it must RESET to the allowance rather than add
 * to it, and be idempotent, or a re-run doubles every tenant's balance. Without that
 * command balances only ever decrease and every tenant eventually hard-stops.
 *
 * ═══ pdf_extraction_corrections — the OCR accuracy feedback loop ════════════
 * What the parser said, what the human changed it to, and the confidence the parser
 * claimed. `confidence_level` is the useful column: a field extracted at "high"
 * confidence that humans keep correcting is a broken template or a bad prompt, and this
 * is the only place that becomes visible.
 * `job_id` here references pdf_processing_jobs (NOT `jobs`) — the DDL names it job_id,
 * which is genuinely confusing, but it is kept to match the schema doc.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('ocr_credit_transactions')) {
            Schema::create('ocr_credit_transactions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('company_id');

                $table->unsignedBigInteger('enquiry_id')->nullable(); // the common case
                $table->unsignedBigInteger('job_id')->nullable();
                $table->unsignedBigInteger('pdf_processing_job_id')->nullable();

                $table->integer('amount'); // signed: consumption is negative
                // monthly_grant | purchase | consumption | refund | custom_override
                $table->string('transaction_type', 30);

                // UNIQUE — see the docblock. This is the guard, not a hint.
                $table->unsignedBigInteger('reverses_transaction_id')->nullable()->unique();

                $table->string('notes', 255)->nullable();

                $table->timestamp('created_at')->nullable(); // no updated_at — append-only

                $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
                $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('set null');
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
                $table->foreign('pdf_processing_job_id')->references('id')->on('pdf_processing_jobs')->onDelete('set null');
                $table->foreign('reverses_transaction_id')->references('id')->on('ocr_credit_transactions');

                $table->index(['company_id', 'created_at'], 'idx_credit_company_time');
                $table->index(['transaction_type'], 'idx_credit_type');
            });
        }

        if (! Schema::hasTable('pdf_extraction_corrections')) {
            Schema::create('pdf_extraction_corrections', function (Blueprint $table) {
                $table->id();
                // NOTE: references pdf_processing_jobs, not `jobs`, despite the name.
                $table->unsignedBigInteger('job_id');

                $table->string('field_name', 50);
                $table->text('original_value')->nullable();
                $table->text('corrected_value')->nullable();
                $table->string('confidence_level', 10)->nullable(); // high | medium | low

                $table->unsignedBigInteger('corrected_by');
                $table->timestamp('created_at')->nullable();

                $table->foreign('job_id')->references('id')->on('pdf_processing_jobs')->onDelete('cascade');
                $table->foreign('corrected_by')->references('id')->on('users');

                // "which fields do humans keep fixing, and at what claimed confidence?"
                $table->index(['field_name', 'confidence_level'], 'idx_corrections_field');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('pdf_extraction_corrections');
        Schema::dropIfExists('ocr_credit_transactions');
    }
};
