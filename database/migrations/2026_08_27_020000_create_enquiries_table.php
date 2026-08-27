<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * enquiries — the PRE-CONVERSION lifecycle. Every inbound client request, converted or not.
 *
 * ── Unconverted rows are the product, not leftovers ──────────────────────────
 * An enquiry that never converts stays here permanently. Those rows ARE the funnel and
 * the entire substrate of the Sales Intelligence Engine: conversion %, lost_reason
 * distribution, price elasticity, client cadence. Deleting or archiving them destroys
 * the denominator of every sales metric in the product.
 *
 * ── 'Lost' lives ONLY here; 'Cancelled' lives ONLY on jobs ───────────────────
 * chk_enq_status makes that structural rather than policed by guard logic. They are
 * different facts — a lost enquiry never became a shipment, a cancelled job did and
 * then stopped — and blending them corrupts conversion rate in one direction and
 * execution failure rate in the other.
 *
 * 🔴 **status and transport_mode are NOT NULL, and that is what makes the CHECKs work.**
 * SQL CHECK constraints evaluate NULL as UNKNOWN, which PASSES. A nullable `status`
 * would let a row carrying NULL slip past chk_enq_status entirely — the guard would
 * appear present in SHOW CREATE TABLE while enforcing nothing on exactly the rows most
 * likely to be wrong. The DDL leaves NOT NULL implicit on `status`; it is explicit here.
 *
 * ── chk_enq_mode_prefix is a drift guard, not the source of truth ────────────
 * transport_mode is the SOURCE — it is known from active_portal_scope before any number
 * exists — and enquiry_no's prefix is generated FROM it. The CHECK only makes the two
 * impossible to disagree once both are populated. Every scoped query and index reads
 * transport_mode; the prefix is a display/audit format of the same fact.
 * ⚠️ Requires MySQL 8.0.16+. Earlier versions PARSE CHECK and silently ignore it, which
 * is worse than no constraint because it grants false confidence — so this migration
 * verifies both constraints landed and aborts if they did not.
 *
 * ── DECLARED cargo, never overwritten ────────────────────────────────────────
 * extracted_* is what the client SAID, written by the mode-specific regex at intake and
 * refined by OCR. Actual shipped figures land on air_/sea_shipment_details and NEVER
 * write back: the enquiry-vs-actual gap is the under-declaration signal, so both sides
 * must survive independently.
 *
 * ── origin_code / dest_code ship NOW, with the table ─────────────────────────
 * Lost enquiries never get shipment_details, so without these two columns every
 * lane-level win/loss metric is blind exactly where it matters most. Trailing history
 * cannot be reconstructed later — each day they are missing is a permanently blind day.
 * Same reasoning for quoted_amount: without it, "we lost on rates" cannot answer BY HOW
 * MUCH, which is the only version of the question worth asking.
 *
 * ── UNIQUE (agent_id, enquiry_no) is deliberately NOT soft-delete aware ──────
 * A soft-deleted row keeps holding its number. That is the product rule — numbers are
 * never recycled (PRD.md §6.3) — not an oversight. Contrast job_entities, where the
 * generated gate folds deleted_at in on purpose (CONTEXT.md §7 item 14).
 *
 * ── reinitiated_from_job_id has no FK yet: a REAL cycle ──────────────────────
 * jobs.enquiry_id points here and this points back at jobs. The constraint is added by
 * ALTER once `jobs` exists (Batch 1b step 2). Unlike the customers FKs in Batch 1a, this
 * one genuinely cannot be inline.
 */
return new class extends Migration
{
    public function up()
    {
        // Re-runnable: MySQL has no transactional DDL, so if a later statement in this
        // migration fails the CREATE is NOT rolled back and the migration is NOT
        // recorded. Without this guard the retry dies on 1050 Table already exists.
        if (Schema::hasTable('enquiries')) {
            $this->addCheckConstraints();
            $this->assertChecksExist();
            return;
        }

        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');

            $table->string('transport_mode', 10);            // air | sea | road
            $table->string('direction', 10)->default('export'); // export | import
            $table->string('enquiry_no', 30);                // ENQA-F16BOM-26-0001
            $table->string('quotation_no', 30)->nullable();

            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('sales_id')->nullable();
            $table->unsignedBigInteger('ops_id')->nullable();
            $table->unsignedBigInteger('pricing_id')->nullable();

            // NOT NULL — see the note above: a NULL here would bypass chk_enq_status.
            $table->string('status', 20)->default('new');

            // Declared cargo — what the client said.
            $table->integer('extracted_pieces')->nullable();
            $table->decimal('extracted_weight', 10, 3)->nullable();
            $table->decimal('extracted_volume', 8, 3)->nullable();
            $table->text('cargo_description')->nullable();
            $table->string('cargo_type', 20)->nullable();
            // NULLABLE on purpose: promotion writes only where source IN ('regex', NULL).
            $table->string('cargo_data_source', 10)->nullable()->default('regex');
            $table->timestamp('cargo_data_promoted_at')->nullable();

            $table->char('origin_code', 5)->nullable();
            $table->char('dest_code', 5)->nullable();

            $table->decimal('quoted_amount', 15, 2)->nullable();
            $table->char('quoted_currency', 3)->nullable();

            $table->string('lost_reason', 30)->nullable();
            $table->string('lost_reason_custom', 255)->nullable();
            $table->timestamp('lost_at')->nullable();
            $table->timestamp('reopened_at')->nullable();
            $table->timestamp('stale_nudged_at')->nullable();

            // FK deferred — genuine cycle with jobs. Added in Batch 1b step 2.
            $table->unsignedBigInteger('reinitiated_from_job_id')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('sales_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('ops_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('pricing_id')->references('id')->on('users')->onDelete('set null');

            $table->unique(['agent_id', 'enquiry_no'], 'uq_enq_agent_no');

            $table->index(['agent_id', 'transport_mode', 'status', 'created_at'], 'idx_enq_funnel');
            $table->index(['customer_id', 'transport_mode', 'created_at'], 'idx_enq_customer');
            $table->index(['sales_id', 'transport_mode', 'status', 'created_at'], 'idx_enq_sales');
            $table->index(['agent_id', 'status', 'stale_nudged_at'], 'idx_enq_stale');
        });

        $this->addCheckConstraints();
        $this->assertChecksExist();
    }

    /**
     * Idempotent: skips any constraint already present, so a retry is safe.
     *
     * 🔴 **Every comparison is forced to utf8mb4_bin, and that is load-bearing.**
     * The columns collate utf8mb4_unicode_ci, which is CASE-INSENSITIVE — so a plain
     * `status IN ('new',...,'lost')` accepts 'Lost', 'LOST' and 'LoSt' as valid. Verified
     * against MySQL 8.0.46 on 2026-08-27: the constraint existed, reported as present in
     * information_schema, and silently admitted 'Lost'.
     *
     * Why that matters even though MySQL's own reads stay case-insensitive: the value is
     * serialised into JSON and consumed by Vue, where `status === 'lost'` is CASE-SENSITIVE.
     * A row stored as 'Lost' therefore passes every database check, matches every backend
     * query, and then fails silently in every frontend guard and badge. GROUP BY collapses
     * the variants too, so analytics emit an arbitrary label for a correct count.
     *
     * PRD.md's first load-bearing rule is that Lost/Cancelled separation is "enforced by DB
     * CHECK, not convention". The separation itself did hold — 'Cancelled' was correctly
     * rejected on enquiries — but the vocabulary was only enforced up to casing.
     *
     * COLLATE inside the CHECK does NOT change the column's collation, so indexes, joins
     * and query behaviour are unaffected. It narrows only what may be written.
     */
    private function addCheckConstraints(): void
    {
        $existing = $this->checkConstraintNames();

        if (! in_array('chk_enq_status', $existing, true)) {
            // COLLATE utf8mb4_bin makes the comparison CASE-SENSITIVE. Without it the
            // column's utf8mb4_unicode_ci collation accepts 'Lost', 'LOST' and 'LoSt'
            // as matches for 'lost' — see the note above addCheckConstraints().
            DB::statement("
                ALTER TABLE enquiries ADD CONSTRAINT chk_enq_status CHECK (
                    (status COLLATE utf8mb4_bin)
                        IN ('new','quoted','awaiting_client','converted','lost')
                )
            ");
        }

        if (! in_array('chk_enq_mode_prefix', $existing, true)) {
            // Case-sensitive on both sides: an 'AIR' mode or an 'enqa-' prefix is a bug,
            // not a variant. LIKE is collation-sensitive too, hence the COLLATE there.
            DB::statement("
                ALTER TABLE enquiries ADD CONSTRAINT chk_enq_mode_prefix CHECK (
                    ((transport_mode COLLATE utf8mb4_bin) = 'air'
                        AND (enquiry_no COLLATE utf8mb4_bin) LIKE 'ENQA-%') OR
                    ((transport_mode COLLATE utf8mb4_bin) = 'sea'
                        AND (enquiry_no COLLATE utf8mb4_bin) LIKE 'ENQS-%') OR
                    ((transport_mode COLLATE utf8mb4_bin) = 'road'
                        AND (enquiry_no COLLATE utf8mb4_bin) LIKE 'ENQR-%')
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

        // Raw select, not the query builder: DB::table('information_schema.x') quotes
        // the whole string as ONE identifier and the query fails.
        $rows = DB::select(
            'SELECT constraint_name FROM information_schema.table_constraints
             WHERE table_schema = ? AND table_name = ? AND constraint_type = ?',
            [Schema::getConnection()->getDatabaseName(), 'enquiries', 'CHECK']
        );

        return array_map(fn ($r) => $r->constraint_name ?? $r->CONSTRAINT_NAME, $rows);
    }

    /**
     * MySQL below 8.0.16 parses CHECK and silently discards it. A constraint that is
     * absent but believed present is worse than one that was never written, so prove
     * both exist rather than trusting the ALTER returned without error.
     */
    private function assertChecksExist(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        $found = $this->checkConstraintNames();

        foreach (['chk_enq_status', 'chk_enq_mode_prefix'] as $name) {
            if (! in_array($name, $found, true)) {
                throw new RuntimeException(
                    "{$name} was not created on `enquiries`. MySQL 8.0.16+ is required — "
                    . 'earlier versions parse CHECK and silently ignore it. Server reports: '
                    . DB::selectOne('SELECT VERSION() v')->v
                );
            }
        }
    }

    public function down()
    {
        Schema::dropIfExists('enquiries');
    }
};
