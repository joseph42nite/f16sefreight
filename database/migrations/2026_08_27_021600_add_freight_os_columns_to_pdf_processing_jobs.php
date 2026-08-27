<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * pdf_processing_jobs — ALTER only. The table is LIVE and driven by
 * app/Jobs/ProcessPdfOcrJob.php.
 *
 * ⚠️ The live table already carries original_filename, temp_file_path, queue_job_id,
 * error_message, started_at and completed_at. The DDL block omits them only because the
 * plan does not reference them — **do not drop them.**
 *
 * Six columns are added: the two attribution keys plus transport_mode (guide §Batch 1b·11)
 * and the three OCR-routing columns specified in guide §4.1.1 / CONTEXT.md §6.
 *
 * ── enquiry_id is the COMMON case, not the exception ───────────────────────
 * Extraction runs pre-conversion at enquiry status step 2. Without one of the two keys
 * the parsed payload is orphaned and CargoDataPromotionService cannot promote it onto
 * anything. Both indexed, both SET NULL.
 *
 * ── extraction_path is REPORTED BY FastAPI, never guessed by Laravel ───────
 * coordinates | text | vision | none. Only the parser knows whether the PDF had a usable
 * text layer, and this drives the credit decision: 'none' means no text layer AND vision
 * was not authorised, so **nothing was spent**.
 *
 * ── page_count exists so the consent prompt can be honest ──────────────────
 * Vision cost scales with pages, so the operator sees "3 pages, 1 credit" rather than an
 * unexplained number. 🔒 Vision is OPT-IN — the system never spends a credit on its own.
 * The first call always runs allow_vision = false; if no text is found the job parks at
 * `status = 'awaiting_vision_consent'` having reserved nothing.
 *
 * ⚠️ `awaiting_vision_consent` must be EXCLUDED from the 30-minute stale sweep — an
 * operator may answer an hour later. It gets its own 24h expiry which also deletes the
 * temp PDF (guide §4.7).
 *
 * ── failure_code is a CODE, not a sentence ─────────────────────────────────
 * credits_exhausted | upgrade_required | unsupported_mime | extraction_failed |
 * ai_unavailable. `error_message` stays free text for humans; tests and UI branch on
 * this deterministically.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::table('pdf_processing_jobs', function (Blueprint $table) {
            if (! Schema::hasColumn('pdf_processing_jobs', 'enquiry_id')) {
                $table->unsignedBigInteger('enquiry_id')->nullable()->after('user_id');
            }
            if (! Schema::hasColumn('pdf_processing_jobs', 'job_id')) {
                $table->unsignedBigInteger('job_id')->nullable()->after('enquiry_id');
            }
            if (! Schema::hasColumn('pdf_processing_jobs', 'transport_mode')) {
                $table->string('transport_mode', 10)->nullable()->after('job_id');
            }
            if (! Schema::hasColumn('pdf_processing_jobs', 'extraction_path')) {
                $table->string('extraction_path', 20)->nullable()->after('extracted_data');
            }
            if (! Schema::hasColumn('pdf_processing_jobs', 'page_count')) {
                $table->integer('page_count')->nullable()->after('extraction_path');
            }
            if (! Schema::hasColumn('pdf_processing_jobs', 'failure_code')) {
                $table->string('failure_code', 30)->nullable()->after('page_count');
            }
        });

        Schema::table('pdf_processing_jobs', function (Blueprint $table) {
            $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('set null');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');

            $table->index(['enquiry_id'], 'idx_pdf_jobs_enquiry');
            $table->index(['job_id'], 'idx_pdf_jobs_job');
        });
    }

    public function down()
    {
        Schema::table('pdf_processing_jobs', function (Blueprint $table) {
            $table->dropForeign(['enquiry_id']);
            $table->dropForeign(['job_id']);
            $table->dropIndex('idx_pdf_jobs_enquiry');
            $table->dropIndex('idx_pdf_jobs_job');
            $table->dropColumn([
                'enquiry_id', 'job_id', 'transport_mode',
                'extraction_path', 'page_count', 'failure_code',
            ]);
        });
    }
};
