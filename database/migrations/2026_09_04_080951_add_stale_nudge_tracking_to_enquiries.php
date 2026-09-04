<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Nudging becomes a COUNTED sequence that ends in a decision.
 *
 * `stale_nudged_at` alone could only ever express "nudged, once" — the sweep filtered on
 * `whereNull`, so a client who stayed silent forever was reminded about exactly one time
 * and the enquiry then sat in the funnel as neither won nor lost. Counting the attempts is
 * what lets the sweep give up after the configured number and record the loss.
 *
 * 🔴 `lost_automatically` is NOT decoration. A loss the system declared because nobody
 * ever came back is a different fact from a loss a human diagnosed as "rates too high",
 * and mixing them makes every loss-reason report a lie: the business would read an
 * administrative failure as a commercial one. It is also what lets the UI say "we called
 * this — change it if we were wrong", which is the whole basis for auto-closing at all.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enquiries', function (Blueprint $table) {
            // TINYINT: the ceiling is a small configured number of attempts, not a tally.
            $table->unsignedTinyInteger('stale_nudge_count')
                ->default(0)
                ->after('stale_nudged_at');

            $table->boolean('lost_automatically')
                ->default(false)
                ->after('lost_at');
        });

        // One column per policy, matching the rest of the table — `stale_enquiry_days`
        // sits directly above. NULL means "no override": the resolver falls through
        // branch -> company -> config, so an untouched tenant keeps the default.
        Schema::table('tenant_policies', function (Blueprint $table) {
            $table->integer('stale_nudge_attempts')
                ->nullable()
                ->after('stale_enquiry_days');
        });
    }

    public function down(): void
    {
        Schema::table('enquiries', function (Blueprint $table) {
            $table->dropColumn(['stale_nudge_count', 'lost_automatically']);
        });

        Schema::table('tenant_policies', function (Blueprint $table) {
            $table->dropColumn('stale_nudge_attempts');
        });
    }
};
