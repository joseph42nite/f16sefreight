<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The airline's email domain, so an operator picks a carrier instead of typing one.
 *
 * 🔴 **Platform-level reference data, curated by F16s.** An airline's prefix, its name and
 * its domain are the same for every forwarder on earth — `176` is Emirates whoever is
 * looking. Making each branch of each tenant re-key that is how the same carrier ends up
 * spelled four ways, and how a domain gets classified inconsistently across the platform.
 *
 * ⚠️ This is the source the domain directory reads for carriers, so it replaces the need
 * for a tenant to add an airline as a `partners` row purely to teach the platform. Tenant
 * partners stay what they should be: the brokers, truckers and agents that branch actually
 * deals with, with their own state-wise GSTINs.
 */
class AddDomainToAirlines extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('airlines', 'domain')) {
            return;
        }

        Schema::table('airlines', function (Blueprint $table) {
            // Nullable: the prefix and name are useful long before anybody knows the
            // domain, and an airline with no domain simply teaches the directory nothing.
            $table->string('domain', 255)->nullable()->after('country');

            // ⚠️ NOT unique. Carriers share domains — a group operating several prefixes
            // from one office is ordinary, and a unique index would refuse the second one.
            $table->index('domain', 'airlines_domain_idx');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('airlines', 'domain')) {
            return;
        }

        Schema::table('airlines', function (Blueprint $table) {
            $table->dropIndex('airlines_domain_idx');
            $table->dropColumn('domain');
        });
    }
}
