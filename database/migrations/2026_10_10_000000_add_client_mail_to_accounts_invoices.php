<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The invoice mail to the client's accounts (owner, 2026-10-10): drafted when the invoice is finalized, sent, edited or
 * skipped by accounts — never sent on its own. One JSON column on the bill: the waiting draft (to, cc, subject, body),
 * then the decision (sent | skipped, by whom, when). NULL for a bill nobody is mailed about.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::table('accounts_invoices', function (Blueprint $table) {
            $table->json('client_mail')->nullable()->after('reason');
        });
    }

    public function down()
    {
        Schema::table('accounts_invoices', function (Blueprint $table) {
            $table->dropColumn('client_mail');
        });
    }
};
