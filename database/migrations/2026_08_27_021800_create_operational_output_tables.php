<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * manifest_filings, approved_drafts_queue, operational_cover_letters — Batch 1b step 13.
 * The three things operations produces once a draft is approved.
 *
 * ── approved_drafts_queue is a QUEUE, not a log ────────────────────────────
 * A row appears when a human approves a draft and is worked off downstream. Polymorphic
 * source (source_type/source_id) because the approved artefact may be an AWB, an HAWB or
 * a manifest — so no FK on it, and the morph map in AppServiceProvider resolves the type.
 * `approved_by` is RESTRICT: the approval is the audit fact, so the approver cannot be
 * deleted out from under it. `job_id` cascades — the queue entry is meaningless without
 * its job.
 *
 * ── operational_cover_letters numbers per agent ────────────────────────────
 * `uq_cl_agent_no (agent_id, cover_letter_no)` — CL-{agent_code}-26-0001 out of
 * sequence_counters, same per-branch scoping as enquiry, job and CAN numbers.
 * `recipient_customer_id` is NOT NULL and RESTRICT: a cover letter that was sent to a
 * client must always resolve to who received it.
 *
 * ── manifest_filings carries the ICEGATE id ────────────────────────────────
 * `icegate_id` is the Indian customs filing reference returned on submission. Both FKs
 * RESTRICT — a filed manifest is a customs record and must not vanish with a cleanup.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('manifest_filings')) {
            Schema::create('manifest_filings', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('job_id');
                $table->string('icegate_id', 50);
                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('job_id')->references('id')->on('jobs');
                $table->index(['job_id'], 'idx_manifest_job');
            });
        }

        if (! Schema::hasTable('approved_drafts_queue')) {
            Schema::create('approved_drafts_queue', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('job_id');
                $table->unsignedBigInteger('approved_by');

                // Polymorphic — awb | hawb | manifest. No FK is possible.
                $table->unsignedBigInteger('source_id');
                $table->string('source_type', 50);

                $table->string('operational_ref', 50);
                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
                $table->foreign('approved_by')->references('id')->on('users');

                $table->index(['source_type', 'source_id'], 'idx_approved_source');
                $table->index(['agent_id', 'created_at'], 'idx_approved_queue');
            });
        }

        if (! Schema::hasTable('operational_cover_letters')) {
            Schema::create('operational_cover_letters', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('recipient_customer_id');
                $table->unsignedBigInteger('job_id');
                $table->unsignedBigInteger('prepared_by');

                $table->string('cover_letter_no', 30); // CL-{agent_code}-26-0001
                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('recipient_customer_id')->references('id')->on('customers');
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
                $table->foreign('prepared_by')->references('id')->on('users');

                $table->unique(['agent_id', 'cover_letter_no'], 'uq_cl_agent_no');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('operational_cover_letters');
        Schema::dropIfExists('approved_drafts_queue');
        Schema::dropIfExists('manifest_filings');
    }
};
