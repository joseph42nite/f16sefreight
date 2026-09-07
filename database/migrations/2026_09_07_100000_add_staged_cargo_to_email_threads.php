<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What the parser read out of the mail, parked until an operator confirms it.
 *
 * 🔴 PRD §5.2.5 says the parser *"parks the extracted cargo variables on the
 * `email_threads` row"* — and there was nowhere to park them. `extractCargo()` ran and its
 * result was discarded on every message, so the pieces, weight and lane the regex found
 * were computed and thrown away.
 *
 * ⚠️ ONE JSON COLUMN, not five typed ones. This is a SUGGESTION with a confidence on each
 * field, not a record: it is written by a regex, read once when the operator opens the
 * thread, and superseded the moment they confirm. Giving it typed columns would invite
 * queries and reports against numbers nobody has checked, and the confirmed values already
 * have a home on `enquiries`.
 *
 * ⚠️ Nullable and expected to stay NULL on most threads. An airline notice or a vendor
 * invoice has no cargo in it, and NULL says that honestly where an empty object would
 * read as "we looked and found nothing" — which is a different claim.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->json('staged_cargo')->nullable()->after('classification');
        });
    }

    public function down(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->dropColumn('staged_cargo');
        });
    }
};
