<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * What the regex filed a conversation as, kept after a person changes it (user, 2026-09-17: "show in superadmin so we
 * can work on the regex") — the denominator for "how often is it changed".
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->string('auto_classification', 30)->nullable()->after('classification');
        });

        // Existing conversations: what it was before the first change, else what it is now.
        DB::statement("UPDATE email_threads t SET auto_classification = COALESCE(
            (SELECT o.original_classification FROM email_classification_overrides o WHERE o.email_thread_id = t.id ORDER BY o.created_at, o.id LIMIT 1),
            NULLIF(t.classification, 'unclassified'))");
    }

    public function down(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->dropColumn('auto_classification');
        });
    }
};
