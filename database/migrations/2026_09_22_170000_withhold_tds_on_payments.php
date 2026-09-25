<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What a payment withheld, on the payment itself (user, 2026-09-22).
 *
 * 🔴 **`amount` STAYS THE GROSS.** It is what the supplier's payable is reduced by, and their invoice really is
 * settled in full — the withheld part was paid to the government in their name, not kept. Only the cash leg is
 * smaller. Netting `amount` down instead would leave every voucher looking part-paid forever, and the ageing
 * on the buy side chasing a balance nobody owes.
 *
 * ⚠️ The section and rate are copied onto the payment beside the amount, not looked up from `tds_rates` when
 * the payment is read: the rate that applied is a fact about the day it was made. Same reason
 * `tds_entries.rate` is a copy.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts_payments', function (Blueprint $table) {
            $table->decimal('tds_amount', 15, 2)->default(0)->after('amount');
            $table->string('tds_section', 20)->nullable()->after('tds_amount');
            $table->decimal('tds_rate', 5, 2)->nullable()->after('tds_section');
        });
    }

    public function down(): void
    {
        Schema::table('accounts_payments', function (Blueprint $table) {
            $table->dropColumn(['tds_amount', 'tds_section', 'tds_rate']);
        });
    }
};
