<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Money out: the payment, and the vouchers it settles (user, 2026-09-21).
 *
 * 🔴 **The exact mirror of `accounts_receipts`.** One payment settles several vouchers and one voucher can be
 * paid across several payments, so the allocation is the record and `accounts_purchase_vouchers.amount_paid` is a
 * DERIVED cache re-summed from it — never incremented, because a corrected payment would leave a running total
 * carrying the old figure forever.
 *
 * ⚠️ **A "payment run" is an ACT, not an entity.** A run pays several vendors at once and produces one payment
 * each, because each is a separate bank transfer; `run_ref` stamps them so the batch can be found again without a
 * third table that exists only to group rows.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id')->index();
            // Who is being paid. A partner — carrier, trucker, broker — never a customer.
            $table->string('payee_type', 20)->default('partner');
            $table->unsignedBigInteger('payee_id')->nullable();
            $table->string('payment_no', 30);
            $table->date('payment_date');
            $table->string('mode', 20)->default('bank_transfer');
            $table->string('reference', 60)->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->char('currency', 3)->default('INR');
            $table->decimal('exchange_rate', 10, 4)->default(1);
            // The batch this was created in, when it was created with others.
            $table->string('run_ref', 40)->nullable()->index();
            $table->unsignedBigInteger('bank_transaction_id')->nullable();
            $table->string('narration', 255)->nullable();
            $table->boolean('is_posted')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->unique(['agent_id', 'payment_no'], 'uq_payment_agent_no');
        });

        Schema::create('accounts_payment_allocations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payment_id');
            $table->unsignedBigInteger('purchase_voucher_id');
            $table->decimal('amount', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('payment_id')->references('id')->on('accounts_payments')->cascadeOnDelete();
            $table->foreign('purchase_voucher_id')->references('id')->on('accounts_purchase_vouchers');
            $table->unique(['payment_id', 'purchase_voucher_id'], 'uq_payment_voucher');
        });

        Schema::table('accounts_purchase_vouchers', function (Blueprint $table) {
            // Derived from the allocations, like `accounts_invoices.amount_paid` — see the class docblock.
            $table->decimal('amount_paid', 15, 2)->default(0)->after('status');
            // A voucher has no due date of its own; terms live with the supplier. Recorded when it is known.
            $table->date('due_date')->nullable()->after('document_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts_payment_allocations');
        Schema::dropIfExists('accounts_payments');

        Schema::table('accounts_purchase_vouchers', function (Blueprint $table) {
            $table->dropColumn(['amount_paid', 'due_date']);
        });
    }
};
