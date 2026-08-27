<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * job_documents — every file attached to a shipment: AWBs, invoices, packing lists,
 * certificates of origin, e-docket contents.
 *
 * ── The row is metadata; the bytes live elsewhere ───────────────────────────
 * file_path is a disk or S3 key. file_name preserves what the client actually called it,
 * because "INV_final_v3(2).pdf" is how they will refer to it on the phone.
 *
 * ── CASCADE from jobs, but uploaded_by is RESTRICT ──────────────────────────
 * Deleting a job removes its documents — they have no meaning without it. But the
 * uploader is left RESTRICT (the DDL declares no ON DELETE), so a user who uploaded
 * documents cannot be deleted out from under the audit trail.
 *
 * ── agent_id is stored, not derived through job_id ──────────────────────────
 * Denormalised deliberately: every tenant-scoped document query filters on it directly,
 * and joining through `jobs` on the document list is a hot path.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('job_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id');

            $table->string('document_type', 50);
            $table->string('file_name', 255);   // original uploaded filename
            $table->string('file_path', 500);   // disk or S3 path
            $table->string('mime_type', 50)->nullable();
            $table->integer('file_size')->nullable(); // bytes

            $table->unsignedBigInteger('uploaded_by')->nullable();

            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('job_documents');
    }
};
