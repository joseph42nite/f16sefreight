<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The bank accounts master (user, 2026-09-21).
 *
 * 🔴 **`1100-Bank` was ONE account for the whole company.** Every receipt and every payment posted to it, so two
 * bank accounts could not be told apart in the trial balance, in the balance sheet, or anywhere else — and a
 * statement imported from one of them reconciled against money that had arrived in the other.
 *
 * 🔴 **Each account gets its OWN ledger code**, `1100-Bank-<slug>`, rather than a dimension on a single control
 * account. That is how the trial balance comes to show them separately, which is the entire point, and it is how
 * every accountant already expects to see a bank in a chart of accounts. The bare `1100-Bank` stays valid as the
 * fallback for everything posted before this existed — history is not rewritten.
 *
 * 🔐 Account number and IFSC are encrypted at rest, like `customers` and `partners`, which is why the columns
 * are TEXT: the encrypted payload far exceeds the plaintext.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            // Per BRANCH, not per company: a branch's bank account is a branch's, and the ledger is branch-scoped.
            $table->unsignedBigInteger('agent_id')->index();
            $table->string('name', 100);
            $table->string('bank_name', 100)->nullable();
            $table->text('account_no')->nullable();
            $table->text('ifsc_code')->nullable();
            $table->string('branch_name', 100)->nullable();
            $table->char('currency', 3)->default('INR');
            // The chart-of-accounts code this account posts to. Unique per branch — two accounts sharing a code
            // would be the very problem this table exists to end.
            $table->string('account_code', 30);
            // The last four digits, kept in the clear so a statement can be matched to an account by eye.
            $table->string('last_four', 4)->nullable();
            // Which feed it comes from when one is connected (PRD §6.4: Setu in India, Plaid elsewhere).
            $table->string('provider', 20)->nullable();
            $table->string('provider_ref', 100)->nullable();
            $table->boolean('is_default')->default(false);
            // Deactivate, never delete: a closed account must keep resolving for every entry that points at it.
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->unique(['agent_id', 'account_code'], 'uq_bank_account_code');
        });

        // Which account the money moved through. Nullable: every row written before this table existed posted to
        // the single `1100-Bank`, and back-filling a guess would be inventing where money went.
        foreach (['accounts_receipts', 'accounts_payments', 'bank_transactions'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->unsignedBigInteger('bank_account_id')->nullable()->after('agent_id');
                $blueprint->foreign('bank_account_id')->references('id')->on('bank_accounts');
            });
        }
    }

    public function down(): void
    {
        foreach (['accounts_receipts', 'accounts_payments', 'bank_transactions'] as $table) {
            Schema::table($table, function (Blueprint $blueprint) use ($table) {
                $blueprint->dropForeign($table . '_bank_account_id_foreign');
                $blueprint->dropColumn('bank_account_id');
            });
        }

        Schema::dropIfExists('bank_accounts');
    }
};
