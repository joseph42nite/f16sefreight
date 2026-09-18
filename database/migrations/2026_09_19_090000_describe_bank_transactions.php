<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * What the bank actually said (user, 2026-09-19: "we can check what actually got credited and what was mentioned in
 * the bill").
 *
 * 🔴 An amount alone cannot be compared with a bill. A statement line carries the date the money moved, whether it
 * came in or went out, the narration the bank wrote, who it came from and the transfer reference — that is what makes
 * "credited 18,000 against an invoice of 20,400" a sentence anybody can act on.
 *
 * ⚠️ `plaid_transaction_id` stays as the provider's own id and its UNIQUE index stays the ingestion guard, whichever
 * provider the row came from — Setu in India, Plaid elsewhere (PRD §6.4), or a statement somebody imported by hand.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_transactions', function (Blueprint $table) {
            $table->string('provider', 20)->default('manual')->after('agent_id');
            $table->date('value_date')->nullable()->after('amount');
            $table->string('direction', 6)->default('credit')->after('value_date');
            $table->string('narration', 500)->nullable()->after('direction');
            $table->string('counterparty', 255)->nullable()->after('narration');
            $table->string('reference', 100)->nullable()->after('counterparty');
            $table->string('currency', 3)->default('INR')->after('reference');
        });

        // Rows that pre-date this carried a credit and nothing else; say so rather than leave the date empty.
        DB::table('bank_transactions')->whereNull('value_date')->update(['value_date' => DB::raw('DATE(created_at)')]);
    }

    public function down(): void
    {
        Schema::table('bank_transactions', function (Blueprint $table) {
            $table->dropColumn(['provider', 'value_date', 'direction', 'narration', 'counterparty', 'reference', 'currency']);
        });
    }
};
