<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The billing desk's own columns, and receipts (user, 2026-09-19: "look at whatever is in the billing section and
 * build it so that it matches" — Logi-Sys Billing → Forwarding, Receipts, Data Export, Multiple Bill Printing,
 * E-Invoice).
 *
 * 🔴 **The five sales documents already share `accounts_invoices`** (PRD §6.2): invoice, debit note, credit note,
 * brokerage, consol. Nothing here creates a second table for them — what they were missing is a due date to age
 * against, the narration every bill register prints, and the reason a note exists.
 *
 * 🔴 **A receipt is its own document, not a column on the invoice.** One payment settles several invoices and one
 * invoice is settled by several payments, so `amount_paid` can never be the record of HOW it was paid. The
 * allocations table is that record, and `amount_paid` stays the derived convenience the AR screens already read.
 *
 * ⚠️ E-invoice columns hold what the IRP RETURNS. Nothing here talks to the portal — that needs the company's GSP
 * credentials — so the IRN is recorded, not minted (GAPS #371).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts_invoices', function (Blueprint $table) {
            // Ageing needs a date to age AGAINST; before this every bill was implicitly due the day it was raised.
            $table->date('due_date')->nullable()->after('document_date');
            // What the bill is for, in one line — the column every statement and bill-printing register prints.
            $table->string('narration', 255)->nullable()->after('status');
            // Why a note was raised. PRD §6.2 requires a reason on a debit note and on a credit note.
            $table->string('reason', 255)->nullable()->after('narration');

            // What the IRP gave back, once it has been through it.
            $table->string('irn', 100)->nullable()->after('is_posted');
            $table->string('irn_status', 20)->default('pending')->after('irn');
            $table->string('ack_no', 30)->nullable()->after('irn_status');
            $table->dateTime('ack_date')->nullable()->after('ack_no');
        });

        Schema::create('accounts_receipts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id')->index();
            // The payer. A customer for an ordinary receipt; a partner when an agent settles a brokerage or consol bill.
            $table->string('payer_type', 20)->default('customer');
            $table->unsignedBigInteger('payer_id')->nullable();
            $table->string('receipt_no', 30);
            $table->date('receipt_date');
            // How it arrived, and their reference for it — the UTR, the cheque number.
            $table->string('mode', 20)->default('bank_transfer');
            $table->string('reference', 60)->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->char('currency', 3)->default('INR');
            $table->decimal('exchange_rate', 10, 4)->default(1);
            // The bank line this receipt was identified from, when it came from the statement rather than a person.
            $table->unsignedBigInteger('bank_transaction_id')->nullable();
            $table->string('narration', 255)->nullable();
            $table->boolean('is_posted')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->unique(['agent_id', 'receipt_no'], 'uq_receipt_agent_no');
        });

        Schema::create('accounts_receipt_allocations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('receipt_id');
            $table->unsignedBigInteger('invoice_id');
            $table->decimal('amount', 15, 2)->default(0);
            // A short settlement has to say what the rest WAS: written off, discounted, or still owed (null).
            $table->string('resolution', 20)->nullable();
            $table->timestamps();

            $table->foreign('receipt_id')->references('id')->on('accounts_receipts')->cascadeOnDelete();
            $table->foreign('invoice_id')->references('id')->on('accounts_invoices');
            $table->unique(['receipt_id', 'invoice_id'], 'uq_receipt_invoice');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts_receipt_allocations');
        Schema::dropIfExists('accounts_receipts');

        Schema::table('accounts_invoices', function (Blueprint $table) {
            $table->dropColumn(['due_date', 'narration', 'reason', 'irn', 'irn_status', 'ack_no', 'ack_date']);
        });
    }
};
