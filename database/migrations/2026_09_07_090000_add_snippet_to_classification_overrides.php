<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The text the classifier actually read, kept with the correction.
 *
 * 🔴 An override records that the regex was WRONG but not what it was wrong ABOUT.
 * "Airline mail, corrected to customer enquiry, subject 'Re: booking'" cannot be turned
 * into a better pattern — the words that should have matched are in the body, and without
 * them every tuning session starts by going back to the mailbox to look them up.
 *
 * ⚠️ SNIPPET ONLY, never the full body. This is the same ~500 characters the classifier
 * itself reads, so the record contains nothing the matcher did not already see, and a
 * corpus of corrections does not quietly become a second copy of the client's
 * correspondence sitting outside the 90-day body policy.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_classification_overrides', function (Blueprint $table) {
            $table->string('email_snippet', 500)->nullable()->after('email_subject');
        });
    }

    public function down(): void
    {
        Schema::table('email_classification_overrides', function (Blueprint $table) {
            $table->dropColumn('email_snippet');
        });
    }
};
