<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * General billing — an invoice that is not for a shipment (user, 2026-09-26).
 *
 * Logi-Sys splits Billing into Forwarding and General; General is billing with no shipment behind it — warehousing,
 * consultancy, a service sold on its own. Every invoice here had to name a job, so that billing had nowhere to go.
 *
 * 🔴 **`job_id` becomes NULLABLE, rather than inventing a "general job" to hang these on.** A placeholder job would be
 * counted as a shipment by profitability, by the lane report and by Close-the-month's "everything billed?" — a
 * shipment that never moved, in every report that counts shipments. NULL says what is true: no shipment.
 *
 * 🔴 **Only invoices and the notes raised against them may be general.** A brokerage or consol bill is commission or
 * a share of a consolidation ON a shipment by definition, so the database refuses one without a job — a rule a
 * validator alone would let the next endpoint forget.
 *
 * ⚠️ The foreign key stays `RESTRICT`: a shipment with billing against it still cannot be deleted. NULL is simply
 * not a reference.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE accounts_invoices MODIFY job_id BIGINT UNSIGNED NULL');
        DB::statement("ALTER TABLE accounts_invoices ADD CONSTRAINT chk_invoice_job_for_shipment_documents
            CHECK (job_id IS NOT NULL OR type IN ('invoice', 'debit_note', 'credit_note'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE accounts_invoices DROP CHECK chk_invoice_job_for_shipment_documents');
        // Refuses while any general invoice exists — deliberately: rolling back must not orphan real billing.
        DB::statement('ALTER TABLE accounts_invoices MODIFY job_id BIGINT UNSIGNED NOT NULL');
    }
};
