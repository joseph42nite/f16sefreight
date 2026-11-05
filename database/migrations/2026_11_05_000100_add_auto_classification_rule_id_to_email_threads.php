<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * GAPS #51 — which tenant rule filed the thread, when one did. Without it a correction is
 * attributable to the CHANGE but never to the RULE that caused it, so `override_count` never
 * moved and "200 hits, 180 overrides — this rule is harmful" could not be measured.
 *
 * ON DELETE SET NULL: deleting a bad rule must not erase the threads it filed, the same rule
 * `email_classification_overrides.matched_rule_id` follows.
 */
return new class extends Migration
{
    public function up()
    {
        if (Schema::hasColumn('email_threads', 'auto_classification_rule_id')) {
            return;
        }

        Schema::table('email_threads', function (Blueprint $table) {
            $table->unsignedBigInteger('auto_classification_rule_id')->nullable()->after('auto_classification_source');
            $table->foreign('auto_classification_rule_id', 'fk_threads_auto_rule')
                ->references('id')->on('email_classification_rules')->onDelete('set null');
        });
    }

    public function down()
    {
        if (! Schema::hasColumn('email_threads', 'auto_classification_rule_id')) {
            return;
        }

        Schema::table('email_threads', function (Blueprint $table) {
            $table->dropForeign('fk_threads_auto_rule');
            $table->dropColumn('auto_classification_rule_id');
        });
    }
};
