<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Import or export, as read off the conversation's first mail (GAPS #437): from its lane when it names one (a fact),
 * else from Jev's `direction` answer when it is sure. NULL when neither said — the enquiry then starts as export,
 * as it always did, and pricing corrects it on the enquiry.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->string('auto_direction', 10)->nullable()->after('auto_classification_rubric');
        });
    }

    public function down(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->dropColumn('auto_direction');
        });
    }
};
