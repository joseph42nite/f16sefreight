<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `way_bill_consignment_data.agent_id` — the column the code has always written and the
 * schema never had (GAPS #45).
 *
 * 🔴 **Cargo could not be saved on ANY airway bill.** `ConsignmentData` sets `agent_id` on
 * every write, but no migration ever created it, so each save carrying `entries` died with
 * *"Unknown column 'agent_id' in 'field list'"* — taking pieces, gross weight, goods
 * description and every dimension line with it. The live form sends `entries` on the
 * ordinary path, so this was not an edge case.
 *
 * ⚠️ **BIGINT UNSIGNED with a real foreign key**, unlike `air_way_bills.agent_id` and
 * `house_way_bills.agent_id`, which are signed `INT` with none (GAPS #18). Matching that
 * mistake for consistency would double it; those two need correcting rather than copying.
 *
 * NULLABLE because the branch is only known from the acting user, and rows written by an
 * import or a console command have no user. A NULL here means "not attributed", which is
 * honest — a default of branch 1 would silently file another branch's cargo.
 */
class AddAgentIdToWayBillConsignmentData extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('way_bill_consignment_data', 'agent_id')) {
            return;
        }

        Schema::table('way_bill_consignment_data', function (Blueprint $table) {
            $table->unsignedBigInteger('agent_id')->nullable()->after('awb_id');

            $table->index('agent_id', 'wbcd_agent_id_idx');
            $table->foreign('agent_id', 'wbcd_agent_id_fk')
                ->references('id')->on('agents_info');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('way_bill_consignment_data', 'agent_id')) {
            return;
        }

        Schema::table('way_bill_consignment_data', function (Blueprint $table) {
            $table->dropForeign('wbcd_agent_id_fk');
            $table->dropIndex('wbcd_agent_id_idx');
            $table->dropColumn('agent_id');
        });
    }
}
