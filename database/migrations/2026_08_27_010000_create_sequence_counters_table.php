<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * sequence_counters — the single source of every document number in the product.
 *
 * Enquiry, job, invoice, debit/credit note, brokerage, consol, purchase voucher,
 * cargo arrival notice, cover letter and manifest filing numbers all come from this
 * one table, scoped (agent_id, prefix, fiscal_year) — PRD.md §6.3. There is no second
 * counter anywhere; EnquirySequenceService (guide §4.4) is the only writer.
 *
 * ── Why the UNIQUE key is the load-bearing part ──────────────────────────────
 * Numbering runs as SELECT current_value ... FOR UPDATE inside a transaction, so the
 * row lock is what serialises two operators issuing an invoice at the same instant
 * (PRD.md §6.3 — deliberately NOT a Redis lock; the database row is authoritative).
 * That only works if a scope can never have two rows. uq_counter_agent_prefix_fy is
 * what guarantees it, and it doubles as the lookup index for the FOR UPDATE query —
 * its columns are in the same order the WHERE clause names them, so no separate index
 * is needed.
 *
 * ── Scope is the branch, not the company ─────────────────────────────────────
 * agent_id -> agents_info.id. Each branch numbers independently, so two branches both
 * issuing INV-26-0001 is correct, not a collision.
 *
 * ── fiscal_year is a string, and that is deliberate ──────────────────────────
 * It stores the two-digit fiscal year from fiscalYear() (April 1st rollover for Indian
 * GST), not a calendar year — '26' means FY 2026-27, so February 2027 still emits 26.
 * VARCHAR(6) leaves room for a '2026-27' style label if the format ever widens.
 *
 * ── No ON DELETE clause ──────────────────────────────────────────────────────
 * The FK defaults to RESTRICT. Deleting a branch must not silently discard its
 * counters: numbers are never recycled (PRD.md §6.3), and a counter reset to 0 would
 * re-issue invoice numbers that already exist in the ledger.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('sequence_counters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->string('prefix', 10);
            $table->string('fiscal_year', 6);
            $table->integer('current_value')->default(0);
            $table->timestamps();

            $table->foreign('agent_id', 'sequence_counters_agent_id_foreign')
                ->references('id')->on('agents_info');

            $table->unique(['agent_id', 'prefix', 'fiscal_year'], 'uq_counter_agent_prefix_fy');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sequence_counters');
    }
};
