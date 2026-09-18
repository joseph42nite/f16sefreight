<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pricing handing the cost sheet to accounts (user, 2026-09-18: "do not send it to accounts yet — give a send button
 * and a pop-up that confirms the price, buy and sell, then send it to accounts").
 *
 * 🔴 Not the same as finalizing. The invoice stays a draft and accounts still finalize it; this records that pricing
 * says the figures are ready, and until it is set the sheet is pricing's own working document.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts_invoices', function (Blueprint $table) {
            $table->timestamp('sent_to_accounts_at')->nullable();
            $table->unsignedBigInteger('sent_to_accounts_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('accounts_invoices', function (Blueprint $table) {
            $table->dropColumn(['sent_to_accounts_at', 'sent_to_accounts_by']);
        });
    }
};
