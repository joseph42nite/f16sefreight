<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * When an invoice was issued over the client's credit limit, by whom, and why (user, 2026-09-21).
 *
 * 🔴 **The `overrideCreditHold` ability existed and was wired to nothing.** PRD §251 gives accounts the power to
 * override a credit hold; the gate was defined in `AuthServiceProvider` and no endpoint ever checked it, so the
 * only way past the gate was to quietly raise the client's limit — which leaves no record that anything unusual
 * happened and permanently weakens the gate for every future shipment.
 *
 * ⚠️ Recorded on the DOCUMENT, not only in the audit log. "This invoice was issued over the limit, by Vikram, on
 * the 21st, because the Boss agreed it on the phone" is a fact about the invoice, and it has to be visible to
 * whoever opens it a year later rather than only to somebody who knows to go looking through an audit trail.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts_invoices', function (Blueprint $table) {
            $table->string('credit_override_reason', 255)->nullable()->after('reason');
            $table->unsignedBigInteger('credit_override_by')->nullable()->after('credit_override_reason');
            $table->timestamp('credit_override_at')->nullable()->after('credit_override_by');
        });
    }

    public function down(): void
    {
        Schema::table('accounts_invoices', function (Blueprint $table) {
            $table->dropColumn(['credit_override_reason', 'credit_override_by', 'credit_override_at']);
        });
    }
};
