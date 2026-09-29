<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * An airline's commission and its discounts or incentives, as its bill shows them (owner, 2026-09-29: "airlines do
 * give commission and discount for tonnage met — we have to account for that"; GAPS #444).
 *
 * The incentive FORMULA is each company's own contract with its airline and is not modelled: what is recorded is what
 * the bill says. A statement line keeps the airline's breakdown — freight (chargeable weight × rate), charges due
 * carrier, commission, discount — and a payment records the commission and discount taken off what was transferred,
 * as it records TDS. Both work with or without a bank or CASS connection: a CSV or a typed figure does the same.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendor_statement_lines', function (Blueprint $table) {
            // NULL: the statement did not break the line down — its amount is all we know.
            $table->decimal('freight_amount', 15, 2)->nullable()->after('rate');
            $table->decimal('due_carrier_amount', 15, 2)->nullable()->after('freight_amount');
            $table->decimal('commission_amount', 15, 2)->nullable()->after('due_carrier_amount');
            $table->decimal('discount_amount', 15, 2)->nullable()->after('commission_amount');
        });

        Schema::table('accounts_payments', function (Blueprint $table) {
            // Taken off what leaves the bank, like TDS; the supplier's bills are still settled in full.
            $table->decimal('commission_amount', 15, 2)->default(0)->after('tds_rate');
            $table->decimal('discount_amount', 15, 2)->default(0)->after('commission_amount');
        });
    }

    public function down(): void
    {
        Schema::table('vendor_statement_lines', function (Blueprint $table) {
            $table->dropColumn(['freight_amount', 'due_carrier_amount', 'commission_amount', 'discount_amount']);
        });
        Schema::table('accounts_payments', function (Blueprint $table) {
            $table->dropColumn(['commission_amount', 'discount_amount']);
        });
    }
};
