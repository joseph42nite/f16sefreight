<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * sea_containers + sea_container_items — the consolidation stuffing grid.
 *
 * ── Two tables because the relationship is many-to-many in practice ─────────
 * `sea_containers` is a physical box on a vessel, owned by the MASTER job.
 * `sea_container_items` records which HOUSE job's cargo sits in it and how many pieces
 * — `job_id` there references the house child card, not the master. One container
 * carries several houses; one house can straddle two containers. Piece counts therefore
 * belong on the link row, never on either job.
 *
 * ── container_number is NOT unique, deliberately ────────────────────────────
 * ISO 6346 numbers are reused constantly — the same physical box carries different
 * cargo every voyage. Uniqueness would be per (job, container) at most, and the DDL
 * declares none at all. Check-digit validation is a form concern (guide §Step 6),
 * not a database constraint.
 *
 * ── sea_containers soft-deletes; sea_container_items does NOT ───────────────
 * PRD.md §9.3 names six soft-deleting tables: jobs, enquiries, sea_shipment_details,
 * job_entities, sea_containers, companies. The item link is not among them — removing
 * cargo from a container is a correction to a working document, not history worth
 * tombstoning.
 *
 * ── All FKs are RESTRICT (the DDL declares no ON DELETE) ────────────────────
 * A container pins its job. That is consistent with jobs.enquiry_id: once a shipment
 * has physical cargo assigned, deleting the record silently would lose the manifest.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('sea_containers')) {
            Schema::create('sea_containers', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('job_id'); // the MASTER job owning the box

                $table->string('container_number', 20); // ISO 6346; reused across voyages
                $table->string('seal_number', 30)->nullable();

                $table->timestamps();
                $table->softDeletes();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('job_id')->references('id')->on('jobs');

                $table->index(['job_id'], 'idx_containers_job');
            });
        }

        if (! Schema::hasTable('sea_container_items')) {
            Schema::create('sea_container_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('container_id');
                $table->unsignedBigInteger('job_id'); // the HOUSE child card, not the master

                $table->integer('piece_count')->default(0);

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('container_id')->references('id')->on('sea_containers');
                $table->foreign('job_id')->references('id')->on('jobs');

                $table->index(['container_id'], 'idx_container_items_container');
                $table->index(['job_id'], 'idx_container_items_job');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('sea_container_items');
        Schema::dropIfExists('sea_containers');
    }
};
