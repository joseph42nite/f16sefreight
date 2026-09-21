<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * When a closed month was reopened, by whom, and why (user, 2026-09-22).
 *
 * 🔴 **Closing a month was a one-way door.** PRD §251 gives accounts "open/close/**reopen** accounting_periods";
 * only open and close were ever built. Close September by mistake and there was no way back — every document
 * dated inside it became permanently unpostable, and the only escape was editing the database by hand.
 *
 * ⚠️ Reopening a month that has been reported on is a serious act, so it leaves a permanent mark rather than
 * silently flipping the status back. `closed_at` is kept too: "this month was closed on the 3rd and reopened on
 * the 11th" is the sentence an auditor needs, and a status column alone cannot say it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounting_periods', function (Blueprint $table) {
            $table->timestamp('closed_at')->nullable()->after('status');
            $table->unsignedBigInteger('closed_by')->nullable()->after('closed_at');
            $table->timestamp('reopened_at')->nullable()->after('closed_by');
            $table->unsignedBigInteger('reopened_by')->nullable()->after('reopened_at');
            $table->string('reopen_reason', 255)->nullable()->after('reopened_by');
        });
    }

    public function down(): void
    {
        Schema::table('accounting_periods', function (Blueprint $table) {
            $table->dropColumn(['closed_at', 'closed_by', 'reopened_at', 'reopened_by', 'reopen_reason']);
        });
    }
};
