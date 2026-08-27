<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * accounts_purchase_vouchers/_items, accounts_ledger_entries, gst_ledger_entries,
 * unposted_transactions_queue — Batch 1c steps 5, 6 and 7.
 *
 * 🔴 **accounts_purchase_vouchers.job_id is ON DELETE RESTRICT** — the third and last of
 * the schema's three RESTRICT foreign keys. A voucher is money owed to a vendor against
 * a shipment; deleting the job would orphan a real liability.
 *
 * ── accounts_purchase_items.rate is the BUY rate ───────────────────────────
 * **It must never reach a sales-facing API response, at any tier** — one of the
 * product's load-bearing rules. Stripped server-side in the API Resource, never merely
 * hidden in the Vue component. Sales sees the top line; the spread stays with pricing,
 * accounts and the Boss P&L.
 *
 * ═══ accounts_ledger_entries — the double-entry ledger ══════════════════════
 * Every posted document writes a BALANCED PAIR of rows: one debit, one credit. The
 * balance itself is a service-layer invariant — no database constraint can express
 * "these two rows sum to zero" — so it is asserted in tests.
 *
 * ⚠️ **NO list or range PARTITIONING on this table**, however large it grows. MySQL
 * requires every UNIQUE/PRIMARY key to contain the partitioning column, which would
 * force the FKs off and break referential integrity — the one property a ledger cannot
 * trade away for speed.
 *
 * `accounting_period_id` is NOT NULL: a posting that belongs to no period cannot be
 * reported on, and closing a period must be able to find everything inside it.
 * Polymorphic source (invoice | purchase_voucher), so no FK on it.
 *
 * ═══ gst_ledger_entries ═════════════════════════════════════════════════════
 * CGST/SGST/IGST kept as three columns rather than one amount plus a type, because a
 * single intra-state document carries CGST *and* SGST simultaneously — one row, two
 * taxes. Carries BOTH agent_id and company_id: GSTR-1 is filed per GSTIN (company) while
 * the ledger is kept per branch.
 *
 * ═══ unposted_transactions_queue ════════════════════════════════════════════
 * The work list behind the accounts `[Post Ledger]` screen: documents finalized but not
 * yet posted. `created_by` is RESTRICT, and a database trigger additionally enforces that
 * it references an `accounts` user (guide §3.4) — that trigger arrives with the
 * designation guards.
 *
 * ── No deleted_at on any table here. NO FINANCIAL TABLE GETS ONE (PRD.md §9.3).
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('accounts_purchase_vouchers')) {
            Schema::create('accounts_purchase_vouchers', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('job_id');
                $table->string('transport_mode', 10)->nullable();
                $table->unsignedBigInteger('vendor_id');
                $table->unsignedBigInteger('created_by')->nullable();

                $table->string('voucher_no', 30);
                $table->date('document_date');
                $table->string('status', 20)->default('unpaid'); // unpaid | partially_paid | paid | void

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('restrict');
                $table->foreign('vendor_id')->references('id')->on('partners');
                $table->foreign('created_by')->references('id')->on('users');

                $table->unique(['agent_id', 'voucher_no'], 'uq_voucher_agent_no');
                $table->index(['agent_id', 'status', 'document_date'], 'idx_vouchers_ap');
                $table->index(['job_id'], 'idx_vouchers_job');
            });
        }

        if (! Schema::hasTable('accounts_purchase_items')) {
            Schema::create('accounts_purchase_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('purchase_voucher_id');
                $table->unsignedBigInteger('house_job_id')->nullable();

                $table->string('charge_type', 30);
                $table->string('hsn_sac_code', 10)->nullable();
                $table->string('description', 255);

                $table->decimal('quantity', 10, 3)->default(0);
                $table->decimal('rate', 15, 4)->default(0);  // BUY rate — never shown to sales
                $table->decimal('amount', 15, 2);

                $table->decimal('tax_percentage', 5, 2)->default(0);
                $table->decimal('tax_amount', 15, 2)->default(0);
                $table->decimal('net_amount', 15, 2)->default(0); // cost side of margin

                $table->timestamps();

                $table->foreign('purchase_voucher_id')->references('id')->on('accounts_purchase_vouchers')->onDelete('cascade');
                $table->foreign('house_job_id')->references('id')->on('jobs')->onDelete('set null');

                $table->index(['purchase_voucher_id', 'charge_type'], 'idx_pur_items_charge');
            });
        }

        if (! Schema::hasTable('accounts_ledger_entries')) {
            Schema::create('accounts_ledger_entries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('chart_of_account_id');
                $table->unsignedBigInteger('accounting_period_id');

                $table->date('posting_date');
                $table->decimal('debit_amount', 15, 2);
                $table->decimal('credit_amount', 15, 2);

                // Polymorphic: invoice | purchase_voucher. No FK possible.
                $table->unsignedBigInteger('source_id');
                $table->string('source_type', 50);

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('chart_of_account_id')->references('id')->on('chart_of_accounts');
                $table->foreign('accounting_period_id')->references('id')->on('accounting_periods');

                // Trial balance: every entry for one account in one period.
                $table->index(['chart_of_account_id', 'accounting_period_id'], 'idx_ledger_account_period');
                $table->index(['source_type', 'source_id'], 'idx_ledger_source');
                $table->index(['agent_id', 'posting_date'], 'idx_ledger_agent_date');
            });
        }

        if (! Schema::hasTable('gst_ledger_entries')) {
            Schema::create('gst_ledger_entries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('company_id'); // GSTR-1 is filed per GSTIN

                $table->unsignedBigInteger('voucher_id');
                $table->string('voucher_type', 50); // polymorphic

                // Three columns, not one: an intra-state document carries CGST AND SGST.
                $table->decimal('cgst_amount', 15, 2)->default(0);
                $table->decimal('sgst_amount', 15, 2)->default(0);
                $table->decimal('igst_amount', 15, 2)->default(0);

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('company_id')->references('id')->on('companies');

                $table->index(['voucher_type', 'voucher_id'], 'idx_gst_voucher');
                $table->index(['company_id', 'created_at'], 'idx_gst_filing');
            });
        }

        if (! Schema::hasTable('unposted_transactions_queue')) {
            Schema::create('unposted_transactions_queue', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('company_id');
                $table->unsignedBigInteger('created_by');

                $table->unsignedBigInteger('source_id');
                $table->string('source_type', 50); // polymorphic
                $table->decimal('net_amount', 15, 2);

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('company_id')->references('id')->on('companies');
                $table->foreign('created_by')->references('id')->on('users');

                $table->index(['agent_id', 'created_at'], 'idx_unposted_queue');
                $table->index(['source_type', 'source_id'], 'idx_unposted_source');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('unposted_transactions_queue');
        Schema::dropIfExists('gst_ledger_entries');
        Schema::dropIfExists('accounts_ledger_entries');
        Schema::dropIfExists('accounts_purchase_items');
        Schema::dropIfExists('accounts_purchase_vouchers');
    }
};
