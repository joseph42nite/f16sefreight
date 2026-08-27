<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * accounts_invoices and its three detail tables — Batch 1c steps 3 and 4.
 *
 * 🔴 **job_id is ON DELETE RESTRICT — one of only three in the whole schema.**
 * An invoice is a legal document raised against a shipment. Deleting the job would
 * orphan revenue that has been reported, filed for GST and possibly paid. It WILL
 * surprise you in tests (CONTEXT.md §8): a job that has been invoiced cannot be deleted,
 * full stop.
 *
 * ── customer_id is nullable; billed_party is polymorphic. Both, on purpose ──
 * `customer_id` drives AR, collections and credit — all of which are CUSTOMER-only
 * concepts — so it is populated only for customer-billed documents.
 * `billed_party_type`/`billed_party_id` is who the invoice is actually ADDRESSED to,
 * which for brokerage, consol and agent invoices is a PARTNER. Collapsing the two would
 * either put partners into the AR ledger or make partner-billed invoices unaddressable.
 * Polymorphic, so no FK — the same application-enforced tenant check applies (guide §3.2).
 *
 * ── parent_invoice_id is self-referencing ──────────────────────────────────
 * A credit note or debit note points at the invoice it amends. RESTRICT, because the
 * amendment is meaningless without its original.
 *
 * ── amount_paid is a column, not a computed sum ────────────────────────────
 * `grand_total - amount_paid` is the outstanding balance and is read on every AR
 * screen and every credit-limit check. Deriving it from bank_transactions on each read
 * would make the collections dashboard a full ledger scan.
 *
 * ── is_posted vs status ────────────────────────────────────────────────────
 * Different facts. `status` is the commercial lifecycle (draft → finalized → sent →
 * paid/void); `is_posted` is whether the double-entry rows exist in
 * accounts_ledger_entries. An invoice can be 'sent' and unposted.
 *
 * ── No deleted_at anywhere in this file ────────────────────────────────────
 * **NO FINANCIAL TABLE GETS ONE** (PRD.md §9.3). Voiding is a status, not a delete: a
 * void invoice must remain visible in the GST register and the audit trail.
 *
 * ── The two 1-to-1 detail tables ───────────────────────────────────────────
 * brokerage and consol details are separate tables with `invoice_id UNIQUE` rather than
 * nullable columns on accounts_invoices, because they apply to two of five invoice types
 * and would otherwise be NULL on every ordinary invoice. Both cascade — a detail row has
 * no meaning without its invoice.
 *
 * ── house_job_id on the line items ─────────────────────────────────────────
 * Maps a single charge line to a HOUSE shipment inside a consol invoice, which is what
 * makes per-house margin computable on a consolidation. SET NULL: the line is still a
 * real charge even if the house record goes.
 * `accounts_purchase_items.rate` is the BUY rate and **must never reach a sales-facing
 * API response** (PRD.md load-bearing rules) — stripped server-side in the API Resource,
 * not hidden in the component.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('accounts_invoices')) {
            Schema::create('accounts_invoices', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('job_id');
                $table->string('transport_mode', 10)->nullable();

                $table->unsignedBigInteger('customer_id')->nullable(); // AR/credit — customer only
                $table->string('billed_party_type', 20)->nullable();   // customer | partner
                $table->unsignedBigInteger('billed_party_id')->nullable();

                $table->unsignedBigInteger('parent_invoice_id')->nullable(); // credit/debit note origin
                $table->unsignedBigInteger('created_by')->nullable();

                $table->string('invoice_no', 30);
                // invoice | debit_note | credit_note | brokerage | consol_invoice
                $table->string('type', 20);
                $table->date('document_date');
                // draft | finalized | sent | partially_paid | paid | void
                $table->string('status', 20)->default('draft');

                $table->decimal('subtotal', 15, 2)->default(0);
                $table->decimal('tax_amount', 15, 2)->default(0);
                $table->decimal('grand_total', 15, 2)->default(0);
                $table->decimal('amount_paid', 15, 2)->default(0);

                $table->char('currency', 3)->default('INR');
                $table->decimal('exchange_rate', 10, 4)->default(1);

                $table->boolean('is_posted')->default(false); // ledger rows exist?
                $table->string('billed_party_role', 30)->default('client');

                $table->timestamps(); // NO softDeletes — financial table

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('job_id')->references('id')->on('jobs')->onDelete('restrict');
                $table->foreign('customer_id')->references('id')->on('customers');
                $table->foreign('parent_invoice_id')->references('id')->on('accounts_invoices');
                $table->foreign('created_by')->references('id')->on('users');

                $table->unique(['agent_id', 'invoice_no'], 'uq_invoice_agent_no');

                $table->index(['billed_party_type', 'billed_party_id'], 'idx_invoices_billed_party');
                // The AR / collections query: who owes this branch money?
                $table->index(['agent_id', 'status', 'document_date'], 'idx_invoices_ar');
                $table->index(['job_id'], 'idx_invoices_job');
            });
        }

        if (! Schema::hasTable('accounts_invoice_items')) {
            Schema::create('accounts_invoice_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('invoice_id');
                $table->unsignedBigInteger('house_job_id')->nullable();

                $table->string('charge_type', 30);
                $table->string('charge_basis', 20)->nullable();
                $table->string('hsn_sac_code', 10)->nullable(); // Indian GST HSN/SAC
                $table->string('description', 255);

                $table->decimal('quantity', 10, 3)->default(0);
                $table->decimal('rate', 15, 4)->default(0);  // SELL rate
                $table->decimal('amount', 15, 2);            // quantity x rate

                $table->string('tax_status', 20)->default('taxable');
                $table->decimal('tax_percentage', 5, 2)->default(0);
                $table->decimal('tax_amount', 15, 2)->default(0);
                $table->decimal('net_amount', 15, 2)->default(0); // revenue side of margin

                $table->timestamps();

                $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->onDelete('cascade');
                $table->foreign('house_job_id')->references('id')->on('jobs')->onDelete('set null');

                $table->index(['invoice_id', 'charge_type'], 'idx_inv_items_charge');
            });
        }

        foreach (['brokerage' => 'brokerage_basis', 'consol' => 'consol_basis'] as $kind => $basisColumn) {
            $tableName = "accounts_invoice_{$kind}_details";

            if (Schema::hasTable($tableName)) {
                continue;
            }

            Schema::create($tableName, function (Blueprint $table) use ($basisColumn) {
                $table->id();
                $table->unsignedBigInteger('invoice_id')->unique(); // UNIQUE = 1-to-1
                $table->unsignedBigInteger('partner_agent_id');
                $table->string($basisColumn, 30);
                $table->timestamps();

                $table->foreign('invoice_id')->references('id')->on('accounts_invoices')->onDelete('cascade');
                $table->foreign('partner_agent_id')->references('id')->on('partners');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('accounts_invoice_consol_details');
        Schema::dropIfExists('accounts_invoice_brokerage_details');
        Schema::dropIfExists('accounts_invoice_items');
        Schema::dropIfExists('accounts_invoices');
    }
};
