<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What a receipt allocation settled in the INVOICE's currency, and at what rate (user, 2026-09-26; GAPS #411).
 *
 * `amount` stays what it always was: the rupees that arrived and were placed against the invoice — money from a
 * bank in India is INR, even when the client paid a USD bill. For a USD invoice those rupees settle some dollars at
 * the day's rate, and that is what the invoice's `amount_paid` must count; the difference between the rupees and
 * the dollars' booked value is realised exchange, posted to 5500-Forex-Gain-Loss (PRD §6.4).
 *
 * NULL on both for every allocation before this, and for any against an INR invoice: `amount` IS the invoice
 * amount then, at a rate of 1. Readers use COALESCE(invoice_amount, amount).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts_receipt_allocations', function (Blueprint $table) {
            $table->decimal('invoice_amount', 15, 2)->nullable()->after('amount');
            $table->decimal('exchange_rate', 12, 6)->nullable()->after('invoice_amount');   // never a float — feeds the ledger
        });
    }

    public function down(): void
    {
        Schema::table('accounts_receipt_allocations', function (Blueprint $table) {
            $table->dropColumn(['invoice_amount', 'exchange_rate']);
        });
    }
};
