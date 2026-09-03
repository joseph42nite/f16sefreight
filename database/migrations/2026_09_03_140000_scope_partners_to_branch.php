<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A partner belongs to a BRANCH, not a company.
 *
 * 🔴 **Because GST registration is per state.** The same customs broker carries a different
 * GSTIN in Maharashtra and in Tamil Nadu — they are separate registrations with separate
 * returns. One `partners` row per company therefore cannot hold the truth: whichever
 * branch saved last would overwrite the other's GSTIN, and the purchase voucher raised
 * against it would claim input credit under the wrong registration.
 *
 * ⚠️ **Carriers are the exception, and they leave this table.** An airline's domain is the
 * same everywhere, which is why it belongs in the platform-level `airlines` list curated by
 * F16s rather than being re-keyed by every branch of every tenant.
 *
 * ── Backfill ────────────────────────────────────────────────────────────────
 * Existing rows are assigned to the company's FIRST branch rather than left NULL. A NULL
 * `agent_id` under a branch-scoped tenant filter is invisible to everybody, so the rows
 * would not be "unassigned" — they would silently vanish from every screen. Landing them
 * somewhere real and visibly wrong beats landing them nowhere.
 */
class ScopePartnersToBranch extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('partners', 'agent_id')) {
            return;
        }

        Schema::table('partners', function (Blueprint $table) {
            $table->unsignedBigInteger('agent_id')->nullable()->after('company_id');
        });

        // Each company's lowest-numbered branch. Deterministic, so a re-run lands the same
        // way, and reviewable — an operator can see which branch got them.
        DB::statement("
            UPDATE partners p
            JOIN (
                SELECT company_id, MIN(id) AS agent_id
                FROM agents_info
                GROUP BY company_id
            ) a ON a.company_id = p.company_id
            SET p.agent_id = a.agent_id
            WHERE p.agent_id IS NULL
        ");

        Schema::table('partners', function (Blueprint $table) {
            $table->index('agent_id', 'partners_agent_id_idx');
            $table->foreign('agent_id', 'partners_agent_id_fk')
                ->references('id')->on('agents_info');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('partners', 'agent_id')) {
            return;
        }

        Schema::table('partners', function (Blueprint $table) {
            $table->dropForeign('partners_agent_id_fk');
            $table->dropIndex('partners_agent_id_idx');
            $table->dropColumn('agent_id');
        });
    }
}
