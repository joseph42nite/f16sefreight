<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Domain classifications are PROPOSED, never applied on their own.
 *
 * 🔴 **Nothing learned automatically may classify anybody's mail until a human at F16s has
 * looked at it.** This directory is platform-wide: one wrong entry misfiles mail for every
 * tenant at once, and the tenant it hurts has no way to see why. A per-tenant rule that
 * goes wrong is one company's problem; a global one is everybody's.
 *
 * ⚠️ So the loop is: observed → proposed → REVIEWED → approved → classifying. The learning
 * is automatic; the applying is not.
 */
class AddReviewStateToGlobalDomainClassifications extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('global_domain_classifications', 'status')) {
            return;
        }

        Schema::table('global_domain_classifications', function (Blueprint $table) {
            // proposed | approved | rejected
            //
            // ⚠️ Default PROPOSED, so a row that arrives by any path — a partner, a
            // promotion, a future import — is inert until somebody says otherwise. A
            // default of `approved` would make every new learning path live by accident.
            $table->string('status', 20)->default('proposed')->after('source');

            $table->unsignedBigInteger('reviewed_by')->nullable()->after('status');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');

            // 🔴 Kept even on rejection, and that is the point: a rejected domain must not
            // be re-proposed every time another partner is added for it. The rejection is
            // the decision, and it has to survive.
            $table->string('review_note', 255)->nullable()->after('reviewed_at');

            $table->index('status', 'gdc_status_idx');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('global_domain_classifications', 'status')) {
            return;
        }

        Schema::table('global_domain_classifications', function (Blueprint $table) {
            $table->dropIndex('gdc_status_idx');
            $table->dropColumn(['status', 'reviewed_by', 'reviewed_at', 'review_note']);
        });
    }
}
