<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * jobs — the POST-CONVERSION lifecycle. Confirmed shipments only.
 *
 * A row exists here ONLY once the client confirms. `[Confirm Shipment]` is the single
 * action in the product that creates one (PRD.md, load-bearing rules).
 *
 * ── enquiry_id is NOT NULL, and it is the ONLY conversion pointer ────────────
 * "Converted" means a job row exists — that is the definition, not a status flag.
 * ⚠️ Do NOT add enquiries.converted_job_id. Two pointers at the same fact drift, and
 * then conversion rate depends on which one you asked.
 * Cardinality is MANY jobs : ONE enquiry — a single client request may split into
 * several shipments, or a consol with several house jobs.
 *
 * ── ON DELETE RESTRICT on enquiry_id — one of only three in the schema ───────
 * Deleting an enquiry that produced a shipment would erase the funnel's numerator while
 * leaving the shipment behind. It will surprise you in tests (CONTEXT.md §8).
 *
 * ── 'Lost' is deliberately ABSENT from chk_jobs_status ───────────────────────
 * Lost lives only on enquiries; Cancelled only on jobs. They are different facts — a
 * lost enquiry never became a shipment, a cancelled job did and then stopped — and
 * blending them corrupts conversion rate one way and execution-failure rate the other.
 * A positive allow-list beats `status <> 'Lost'` because it also blocks typos and any
 * future enquiry-phase state.
 *
 * 🔴 **COLLATE utf8mb4_bin on every comparison — this is not decoration.**
 * The columns collate utf8mb4_unicode_ci, which is CASE-INSENSITIVE, so a plain
 * `status IN (...)` accepts 'cancelled', 'INTAKE' and 'pdf generated'. Proven against
 * MySQL 8.0.46 on 2026-08-27 with chk_enq_status, which reported present in
 * information_schema while silently admitting 'Lost'. It matters because the value is
 * serialised to JSON and Vue compares with `===`, which is case-sensitive: a
 * 'cancelled' row passes every database guard and then fails every frontend check.
 * COLLATE inside the CHECK does not alter the column's collation — indexes, joins and
 * queries are unaffected; only what may be WRITTEN is narrowed.
 *
 * ── execution_job_no is NULLABLE and the drift guard allows for it ───────────
 * A job exists at Intake before its number is minted, so chk_jobs_mode_prefix carries an
 * explicit `execution_job_no IS NULL` arm. Both UNIQUE keys tolerate NULLs (MySQL
 * permits repeated NULLs in a unique index), which is what lets many jobs sit
 * un-numbered at once.
 *
 * ── awb_number is AIR-ONLY ───────────────────────────────────────────────────
 * Sea carries MBL/HBL on sea_shipment_details and leaves this NULL. Enforced in the
 * model boot and asserted in tests, not at the database (PRD.md §5.2.7).
 *
 * ── idx_jobs_ops_clearance is required by the guide, not the DDL ─────────────
 * §Batch 1b·2: the Operator Load Index query depends on (ops_id, planned_clearance_date).
 * The DDL block omits it; adding it later means a table scan on the OLI path.
 *
 * ── pricing_id is RESTRICT while ops_id is SET NULL — asymmetric, per the DDL ─
 * ops_id is the live executor and reassignable; pricing_id is the assignment AUTHORITY,
 * so the DDL declines to null it out silently. Kept as specified.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('jobs')) {
            Schema::create('jobs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('enquiry_id');

                $table->string('transport_mode', 10);
                $table->string('direction', 10)->default('export');
                $table->string('execution_job_no', 30)->nullable(); // JOBA-F16BOM-26-0001
                $table->string('job_order_no', 30)->nullable();
                $table->string('quotation_no', 30)->nullable();

                $table->unsignedBigInteger('customer_id')->nullable();

                $table->unsignedBigInteger('ops_id')->nullable();
                $table->unsignedBigInteger('pending_ops_id')->nullable();
                $table->unsignedBigInteger('pending_ops_requested_by')->nullable();
                $table->timestamp('pending_ops_requested_at')->nullable();
                $table->unsignedBigInteger('pricing_id')->nullable();

                $table->unsignedBigInteger('parent_job_id')->nullable();

                $table->string('status', 30)->default('Intake');

                $table->string('cancellation_reason', 30)->nullable();
                $table->string('cancellation_reason_custom', 255)->nullable();
                $table->timestamp('cancelled_at')->nullable();
                $table->unsignedBigInteger('cancelled_by')->nullable();

                $table->string('cargo_type', 20)->nullable();
                $table->string('consol_type', 20)->nullable();
                $table->string('delivery_mode', 20)->nullable();
                $table->string('booking_thru', 20)->nullable(); // self | agent
                $table->date('planned_clearance_date')->nullable();

                $table->string('awb_number', 20)->nullable(); // AIR only
                $table->string('pickup_address', 500)->nullable();
                $table->string('delivery_address', 500)->nullable();

                $table->boolean('is_sub_shipment')->default(false);
                $table->boolean('is_consolidation')->default(false);
                $table->timestamp('completed_at')->nullable();

                $table->timestamps();
                $table->softDeletes();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('enquiry_id')->references('id')->on('enquiries')->onDelete('restrict');
                $table->foreign('customer_id')->references('id')->on('customers');
                $table->foreign('ops_id')->references('id')->on('users')->onDelete('set null');
                $table->foreign('pending_ops_id')->references('id')->on('users')->onDelete('set null');
                $table->foreign('pending_ops_requested_by')->references('id')->on('users')->onDelete('set null');
                $table->foreign('cancelled_by')->references('id')->on('users')->onDelete('set null');
                $table->foreign('pricing_id')->references('id')->on('users');
                $table->foreign('parent_job_id')->references('id')->on('jobs');

                $table->unique(['agent_id', 'execution_job_no'], 'uq_jobs_agent_job_no');
                $table->unique(['agent_id', 'job_order_no'], 'uq_jobs_agent_job_order');

                $table->index(['enquiry_id'], 'idx_jobs_enquiry');
                $table->index(['agent_id', 'transport_mode', 'status', 'planned_clearance_date'], 'idx_jobs_board');
                $table->index(['ops_id', 'planned_clearance_date'], 'idx_jobs_ops_clearance');
            });
        }

        $this->addCheckConstraints();
        $this->assertChecksExist();
    }

    /** Idempotent — a retry after a partial failure must not trip over its own work. */
    private function addCheckConstraints(): void
    {
        $existing = $this->checkConstraintNames();

        if (! in_array('chk_jobs_status', $existing, true)) {
            DB::statement("
                ALTER TABLE jobs ADD CONSTRAINT chk_jobs_status CHECK (
                    (status COLLATE utf8mb4_bin) IN (
                        'Intake','AI Extraction','Verification','Generation','PDF Generated',
                        'Sent to Airline','Airline Confirmed','Completed','Cancelled'
                    )
                )
            ");
        }

        if (! in_array('chk_jobs_mode_prefix', $existing, true)) {
            DB::statement("
                ALTER TABLE jobs ADD CONSTRAINT chk_jobs_mode_prefix CHECK (
                    ((transport_mode COLLATE utf8mb4_bin) = 'air'
                        AND (execution_job_no COLLATE utf8mb4_bin) LIKE 'JOBA-%') OR
                    ((transport_mode COLLATE utf8mb4_bin) = 'sea'
                        AND (execution_job_no COLLATE utf8mb4_bin) LIKE 'JOBS-%') OR
                    ((transport_mode COLLATE utf8mb4_bin) = 'road'
                        AND (execution_job_no COLLATE utf8mb4_bin) LIKE 'JOBR-%') OR
                    execution_job_no IS NULL
                )
            ");
        }
    }

    /** @return string[] */
    private function checkConstraintNames(): array
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return [];
        }

        $rows = DB::select(
            'SELECT constraint_name FROM information_schema.table_constraints
             WHERE table_schema = ? AND table_name = ? AND constraint_type = ?',
            [Schema::getConnection()->getDatabaseName(), 'jobs', 'CHECK']
        );

        return array_map(fn ($r) => $r->constraint_name ?? $r->CONSTRAINT_NAME, $rows);
    }

    private function assertChecksExist(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        $found = $this->checkConstraintNames();

        foreach (['chk_jobs_status', 'chk_jobs_mode_prefix'] as $name) {
            if (! in_array($name, $found, true)) {
                throw new RuntimeException(
                    "{$name} was not created on `jobs`. MySQL 8.0.16+ is required — earlier "
                    . 'versions parse CHECK and silently ignore it. Server reports: '
                    . DB::selectOne('SELECT VERSION() v')->v
                );
            }
        }
    }

    public function down()
    {
        Schema::dropIfExists('jobs');
    }
};
