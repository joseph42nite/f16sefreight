<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ports — the UN/LOCODE master reference.
 *
 * A shared directory, not tenant data: there is no company_id or agent_id, because
 * INBOM is INBOM for every tenant. Four foreign keys land here as the schema fills in
 * (database_relations_tree.md §3): users.origin_port_id, customers.default_port_id,
 * and rate_cards.origin_port_id / .destination_port_id.
 *
 * ── Why LOCODE and not IATA ──────────────────────────────────────────────────
 * IATA codes only name airports. This directory has to cover seaports and inland
 * terminals as well (port_type: air, sea, land), because sea routing quotes POR/POL/
 * POD/DEL as 5-char LOCODEs — PRD.md §5.2.7 and §5, step 3 of the sea intake. A
 * 3-letter code cannot address DEHAM.
 *
 * ── This table is created EMPTY and stays that way for now ───────────────────
 * The directory data is loaded in a later step (implementation_guide.md §9). Until it
 * exists, users.origin_port_id must stay nullable and registration cannot require a
 * port, even though PRD.md §2.2 says it eventually must (guide §Batch 1a·7).
 *
 * ── Deactivate, do not delete ────────────────────────────────────────────────
 * is_active exists so a closed or superseded port drops out of the pickers while the
 * historical shipments that reference it keep resolving. Deleting a row would orphan
 * rate cards and users pointed at it.
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('ports', function (Blueprint $table) {
            $table->id();
            $table->char('locode', 5)->unique();
            $table->string('port_name', 100);
            $table->char('country_code', 2);
            $table->string('port_type', 20); // 'air', 'sea', 'land'
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ports');
    }
};
