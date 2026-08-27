<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The {agent_code} segment of every document number — company abbreviation + branch code.
 *
 * ── Why this migration exists outside the DDL ────────────────────────────────
 * PRD.md §5.2.7 formats numbers as ENQA-{agent_code}-26-0001, but {agent_code} appears
 * in exactly two lines of the entire planning set and has NO column anywhere in
 * database_relations_tree.md. (PRD.md §6.3 contradicted it with a shorter ENQA-26-0001;
 * §5.2.7 wins — owner's decision, 2026-08-27.)
 *
 * Owner's decision on the source, same date: the segment is the COMPANY ABBREVIATION
 * followed by the BRANCH CODE, so the number says which tenant and which branch raised
 * it without a lookup — e.g. ENQA-F16BOM-26-0001 is F16s, Mumbai branch, FY 2026-27,
 * first air enquiry.
 *
 * ── Why two columns and not one ──────────────────────────────────────────────
 * They belong to different rows with different owners: the abbreviation is a property
 * of the tenant, the branch code a property of the branch. Storing the concatenation
 * would duplicate the company part on every branch and let the two disagree.
 *
 * ── Concatenated with no inner separator, deliberately ───────────────────────
 * The number is hyphen-delimited into four parts (prefix / agent_code / fiscal year /
 * sequence). An inner hyphen would make it five and break every parser and the
 * chk_enq_mode_prefix pattern in Batch 1b.
 *
 * ── Uniqueness is what makes this safe ───────────────────────────────────────
 * Sequences are scoped per agent_id, so two branches resolving to the SAME code would
 * emit byte-identical invoice numbers onto customs paperwork. companies.code is unique
 * globally; agents_info.branch_code is unique WITHIN a company (two tenants may both
 * have a 'BOM' branch — F16BOM and ACMBOM stay distinct).
 *
 * ⚠️ NULLABLE FOR NOW, and that is a deferred obligation, not a design choice.
 * Existing rows have no codes and none can be invented here. Both columns must be
 * backfilled and tightened to NOT NULL BEFORE EnquirySequenceService goes live in
 * Step 4.4 — until then a number would format as ENQA--26-0001. Assumed lengths:
 * 6 for the company abbreviation, 5 for the branch. Widen now if either is short.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('code', 6)->nullable()->unique()->after('name');
        });

        Schema::table('agents_info', function (Blueprint $table) {
            $table->string('branch_code', 5)->nullable()->after('agent_name');

            $table->unique(['company_id', 'branch_code'], 'uq_branch_code_per_company');
        });
    }

    public function down()
    {
        Schema::table('agents_info', function (Blueprint $table) {
            $table->dropUnique('uq_branch_code_per_company');
            $table->dropColumn('branch_code');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropUnique(['code']);
            $table->dropColumn('code');
        });
    }
};
