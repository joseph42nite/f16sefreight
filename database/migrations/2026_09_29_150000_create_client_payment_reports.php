<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A client's payment report card, once a month (owner, 2026-09-29: "the quality of the client — are their payments
 * on time … do this analysis every month, the payment cycle is usually 15-30-60 days"; GAPS #443).
 *
 * One row per client per month, kept: the history IS the trend. Every figure is worked out in PHP from invoices and
 * the receipts allocated to them (ClientPaymentGrader); Jev only reads the client's mail for what numbers cannot see,
 * and a person confirms that reading.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_payment_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->index();
            $table->unsignedBigInteger('customer_id');
            // The first day of the month the card is for.
            $table->date('month');
            $table->unsignedSmallInteger('terms_days');
            // The bills that fell due in the window (the three months ending with this one), in rupees.
            $table->unsignedSmallInteger('bills_due');
            $table->decimal('due_value', 14, 2);
            $table->decimal('on_time_value', 14, 2);
            // NULL when nothing fell due — "nothing to judge" is not "never on time".
            $table->decimal('on_time_share', 5, 4)->nullable();
            $table->decimal('avg_days_late', 6, 1)->nullable();
            // Still unpaid past its due date at month end, and the oldest such bill.
            $table->decimal('overdue_value', 14, 2)->default(0);
            $table->unsignedSmallInteger('oldest_overdue_days')->nullable();
            // 0–100 and A–D; NULL with too few bills to judge fairly.
            $table->unsignedTinyInteger('score')->nullable();
            $table->char('grade', 1)->nullable();
            // better · steady · worse — against last month's card; NULL for the first.
            $table->string('trend', 8)->nullable();
            // Jev's reading of the client's mail, when it was asked (a slipping client) — see ai_decisions.
            $table->unsignedBigInteger('ai_decision_id')->nullable();
            $table->timestamps();

            $table->unique(['customer_id', 'month'], 'uq_client_payment_month');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('company_id')->references('id')->on('companies');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_payment_reports');
    }
};
