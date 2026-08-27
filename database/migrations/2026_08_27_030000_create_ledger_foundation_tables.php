<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * chart_of_accounts + accounting_periods — Batch 1c steps 1 and 2.
 *
 * ── Both are BRANCH-scoped, not company-scoped ─────────────────────────────
 * agent_id, because each branch keeps its own ledger and closes its own periods.
 * `uq_coa_agent_code (agent_id, account_code)` therefore lets two branches both run a
 * '5500-Forex-Gain-Loss' without colliding.
 *
 * ── accounting_periods.status is the posting gate ──────────────────────────
 * 'open' | 'closed'. Opening, closing and reopening a period is EXCLUSIVE to the
 * `accounts` designation — not even the Boss may do it (PRD.md §2.3.4). That is a policy
 * gate, enforced in Step 3, not here.
 *
 * ❓ **The guide names a self-referencing `parent_account_id`; the schema doc does not.**
 * `implementation_guide.md` §Batch 1c·1 says "(self-referencing parent_account_id)", but
 * the column appears in exactly that one line of the entire planning set — it is absent
 * from both the column table and the DDL in database_relations_tree.md, and no PRD
 * behaviour needs it (the roll-ups the PRD describes are shipment and customer roll-ups,
 * not account-tree roll-ups). Following the schema doc, which is the authority for
 * columns. A hierarchical chart of accounts is a real thing an accountant may want, so
 * this is flagged rather than silently dismissed — see GAPS.md.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('chart_of_accounts')) {
            Schema::create('chart_of_accounts', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');

                $table->string('account_code', 30);
                $table->string('account_name', 100);

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->unique(['agent_id', 'account_code'], 'uq_coa_agent_code');
            });
        }

        if (! Schema::hasTable('accounting_periods')) {
            Schema::create('accounting_periods', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');

                $table->string('period_name', 50);
                $table->date('start_date');
                $table->date('end_date');
                $table->string('status', 20)->default('open'); // open | closed

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');

                // "which period does this document date fall in, and is it still open?"
                $table->index(['agent_id', 'start_date', 'end_date'], 'idx_periods_range');
                $table->index(['agent_id', 'status'], 'idx_periods_status');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('accounting_periods');
        Schema::dropIfExists('chart_of_accounts');
    }
};
