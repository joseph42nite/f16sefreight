<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * TDS — tax deducted at source, both directions (user, 2026-09-22: "start").
 *
 * ═══ 🔴 TDS RUNS BOTH WAYS, AND NEITHER WAY EXISTED ════════════════════════
 * A freight forwarder is on both sides of it every month:
 *
 *   • **Clients deduct from us.** An invoice of ₹1,18,000 is settled with ₹1,15,640, the missing ₹2,360
 *     having been paid to the government on our behalf and evidenced in our Form 26AS. Until today the desk
 *     had three ways to close that receipt and **all three were wrong**: `short_paid` leaves it owed, so the
 *     ageing chases a client who paid correctly and in full; `write_off` books it as a bank charge; `discount`
 *     books it as revenue we gave up. It is none of those. It is **tax already paid, recoverable against our
 *     own income-tax liability** — an ASSET. Written off, the money is lost twice: once from profit, and again
 *     as a credit never claimed.
 *   • **We deduct from vendors.** Paying a trucker under 194C means withholding and remitting. The payment run
 *     paid every voucher gross, so nothing was ever withheld — which is not a reporting gap but a default on a
 *     statutory obligation, carrying interest, penalty, and disallowance of 30% of the expense itself.
 *
 * ═══ 🔴 THE RATE IS STAMPED ON THE ENTRY, NOT LOOKED UP LATER ══════════════
 * `tds_entries.rate` is a copy, not a join. Rates change with every Finance Act, and a register that
 * recomputed historical deductions at today's rate would silently restate returns already filed and challans
 * already paid. What was deducted is a fact about a day, not a function of the rate table's current contents.
 *
 * ═══ ⚠️ THE SEEDED RATES ARE DEFAULTS TO BE CHECKED, NOT LAW ═══════════════
 * They are editable in Settings → Finance and the screen says so. Section 194H alone has moved twice in recent
 * years. A number that looks authoritative and is a year stale is worse than an empty field.
 *
 * ── No `deleted_at`. NO FINANCIAL TABLE GETS ONE (PRD.md §9.3).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('tds_rates')) {
            Schema::create('tds_rates', function (Blueprint $table) {
                $table->id();
                // Per branch, like the chart of accounts: a branch files its own returns under its own TAN.
                $table->unsignedBigInteger('agent_id');

                $table->string('section', 20);               // 194C, 194J, 194H…
                $table->string('description', 120);
                $table->decimal('rate', 5, 2);

                // 🔴 Section 206AA: no PAN on record means 20%, not the ordinary rate. It is the single most
                // common way a deduction comes out wrong, and it is a property of the PAYEE, not of the rate.
                $table->decimal('rate_no_pan', 5, 2)->default(20.00);

                // Below these, nothing is deducted at all. Deducting under the threshold is as wrong as
                // missing one — the vendor is short-paid for no lawful reason.
                $table->decimal('threshold_single', 15, 2)->nullable();
                $table->decimal('threshold_annual', 15, 2)->nullable();

                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->unique(['agent_id', 'section'], 'uq_tds_rate_branch_section');
            });
        }

        if (! Schema::hasTable('tds_entries')) {
            Schema::create('tds_entries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                // Both, for the same reason `gst_ledger_entries` carries both: a return is filed per
                // registration while the ledger is kept per branch.
                $table->unsignedBigInteger('company_id');

                // 🔴 The two directions are NOT one column's sign. They are a liability and an asset, they are
                // filed on different forms (26Q outward, 26AS reconciled inward), and netting them in a query
                // by accident would report a company that owes nothing when it owes everything.
                $table->string('direction', 20);            // deducted_by_us | deducted_from_us

                $table->string('counterparty_type', 20);     // partner | customer
                $table->unsignedBigInteger('counterparty_id');
                // ⚠️ Copied, not joined. A PAN corrected next year must not change what was filed this year.
                $table->string('counterparty_pan', 20)->nullable();

                $table->string('section', 20);
                $table->decimal('rate', 5, 2);
                // 🔴 The base EXCLUDES GST. Tax is deducted on the value of the service, never on the tax
                // charged on it — deducting on the gross over-deducts by the rate times the GST.
                $table->decimal('base_amount', 15, 2);
                $table->decimal('tds_amount', 15, 2);

                $table->unsignedBigInteger('source_id');
                $table->string('source_type', 30);           // payment | receipt

                $table->date('deducted_on');
                // Denormalised from `deducted_on` at write time, because every return is filed by quarter and
                // the Indian financial year starts in April — a GROUP BY that has to reproduce that offset in
                // SQL is where an off-by-one quarter hides.
                $table->string('financial_year', 9);         // 2026-27
                $table->string('quarter', 2);                // Q1..Q4

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('company_id')->references('id')->on('companies');

                $table->index(['agent_id', 'direction', 'financial_year', 'quarter'], 'idx_tds_return');
                $table->index(['source_type', 'source_id'], 'idx_tds_source');
                $table->index(['counterparty_type', 'counterparty_id'], 'idx_tds_counterparty');
            });
        }

        // Which section a vendor is deducted under. NULL means none — and NULL is the default, because
        // "deduct nothing" is the only safe thing to assume about a vendor nobody has classified.
        if (! Schema::hasColumn('partners', 'tds_section')) {
            Schema::table('partners', function (Blueprint $table) {
                $table->string('tds_section', 20)->nullable()->after('pan_no');
                // 🔴 Section 197: a vendor may hold a certificate for a LOWER rate, or nil. Deducting the full
                // rate against one is over-deduction the vendor has to reclaim from the department themselves.
                $table->decimal('tds_rate_override', 5, 2)->nullable()->after('tds_section');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('tds_entries');
        Schema::dropIfExists('tds_rates');

        if (Schema::hasColumn('partners', 'tds_section')) {
            Schema::table('partners', function (Blueprint $table) {
                $table->dropColumn(['tds_section', 'tds_rate_override']);
            });
        }
    }
};
