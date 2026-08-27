<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * users — ALTER only, adding the three Freight OS columns from Batch 1a·7.
 *
 * The fourth part of that step — converting `branch_name` to BIGINT UNSIGNED with an FK
 * to agents_info — was already done by 2026_08_27_000000 and is NOT repeated here.
 *
 * ⚠️ `pima_address` ALREADY EXISTS on the live table. Do not add it; the migration fails.
 *
 * ── origin_port_id and origin_airport_code BOTH stay ─────────────────────────
 * They are not duplicates (decided 2026-08-26). `origin_airport_code` is a bare IATA
 * string with no foreign key; `origin_port_id` is an FK into the new `ports` UN/LOCODE
 * master, which covers seaports and inland terminals as well.
 *
 * NULLABLE AND LEFT EMPTY, deliberately. The `ports` directory has not been loaded, so
 * there is nothing to point at and registration cannot require an origin port yet —
 * even though PRD.md §2.2 says it eventually must.
 * ⚠️ The intended backfill (from origin_airport_code) has no join path: `ports` carries
 * no IATA column, so 'BOM' cannot be matched to 'INBOM'. See GAPS.md #1 and #1a — the
 * mitigation is SUBSTRING(locode,3,3) as a reviewed proposal, never a blind UPDATE.
 *
 * ── designation is the IN-TENANT role, a different axis from the `roles` table ──
 * The legacy `roles` table selects the auth GUARD; this selects what the user may do
 * inside their tenant: pricing | operations | sales | accounts | boss. Both survive
 * (CONTEXT.md §6). `superadmin` is deliberately NOT a value here — F16s staff are
 * platform-level and sit outside tier and tenant entirely (PRD.md §2.3).
 *
 * ⚠️ EXISTING USERS ALL BECOME 'operations' via the default. That is harmless today
 * because designation is INERT on the `core` tier (PRD.md §2.3) and every company
 * defaults to core — but the moment a tenant is upgraded to `tactical`, its whole staff
 * is an operations team until someone assigns real designations. Review before any
 * upgrade. The local table has 0 users; production is unverified.
 *
 * ── signature_text ───────────────────────────────────────────────────────────
 * The user-level default email signature, set on the profile settings page.
 * `mailbox_connections.signature_html` overrides it per mailbox, because a user with
 * two connected accounts usually needs two (PRD.md §5.2).
 */
return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('origin_port_id')->nullable()->after('origin_airport_code');
            $table->string('designation', 20)->default('operations')->after('branch_name');
            $table->text('signature_text')->nullable()->after('pima_address');

            $table->foreign('origin_port_id', 'users_origin_port_id_foreign')
                ->references('id')->on('ports');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_origin_port_id_foreign');
            $table->dropColumn(['origin_port_id', 'designation', 'signature_text']);
        });
    }
};
