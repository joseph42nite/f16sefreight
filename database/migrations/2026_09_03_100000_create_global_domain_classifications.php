<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Domain → classification, shared across every tenant on the platform.
 *
 * 🔴 **DELIBERATELY NOT TENANT-SCOPED, and that is the whole point.** `lufthansa.com` is an
 * airline for every forwarder on earth; `email_classification_rules` is per branch, so
 * without this each tenant re-learns the same industry facts from scratch and the product
 * is only ever as good as one customer's typing. This table is what makes the system get
 * better for the next client because of what the last one taught it.
 *
 * 🔐 **THE PRIVACY LINE, and it is narrow on purpose.** Only three things ever cross the
 * tenant boundary: the DOMAIN, the CLASSIFICATION, and a COUNT of how many distinct
 * tenants agreed. Never a subject, a sender address, a thread, a client name, or which
 * tenant said so. "lhcargo.test is an airline" is an industry fact; "Globex emailed us
 * about pharma" is a client's business, and nothing here can carry the second.
 *
 * ⚠️ A tenant's own `email_classification_rules` ALWAYS win over this. An industry default
 * must be overridable locally — a forwarder who uses an airline's domain for something
 * unusual has to be able to say so without arguing with the platform.
 */
class CreateGlobalDomainClassifications extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('global_domain_classifications')) {
            return;
        }

        Schema::create('global_domain_classifications', function (Blueprint $table) {
            $table->bigIncrements('id');

            // One row per domain. A domain that is genuinely two things is a signal to
            // look, not a second row to guess between.
            $table->string('domain', 255)->unique();

            $table->string('classification', 30);

            // partner   — someone added them as an airline/broker/trucker
            // promoted  — enough tenants independently corrected mail from here
            // seed      — shipped with the product
            $table->string('source', 20)->default('promoted');

            /**
             * How many DISTINCT tenants agreed. One tenant's habit is not an industry
             * fact; several independently arriving at the same answer is evidence.
             */
            $table->unsignedInteger('confirmations')->default(1);

            $table->timestamps();

            $table->index('classification', 'gdc_classification_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('global_domain_classifications');
    }
}
