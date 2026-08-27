<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * job_entities — the parties on a shipment: shipper, consignee, notify parties, agents,
 * brokers, transporters.
 *
 * ── Polymorphic by design, so no foreign key on the party ───────────────────
 * party_type is 'customer' | 'partner' and party_id points into whichever table. A
 * database FK cannot express that, which is why cross-tenant integrity here is
 * APPLICATION-enforced: every FormRequest must assert the referenced customer or partner
 * shares the acting user's company_id before persisting (PRD.md §2.1, guide §3.2).
 * That check has no database backstop — it is the one place in the schema where getting
 * it wrong leaks another tenant's party onto a shipment.
 *
 * ═══ THE GENERATED COLUMN — the subtlest constraint in the product ═══════════
 *
 * The rule: a job has at most ONE shipper, ONE consignee, ONE origin agent … but may
 * have MANY notify parties. That is partial uniqueness, and MySQL has no partial index.
 *
 *   unique_role_gate = CASE WHEN deleted_at IS NULL AND role <> 'notify_party'
 *                           THEN role END
 *
 * UNIQUE(job_id, unique_role_gate) then enforces it, because every engine ignores NULLs
 * in a unique index — so every notify_party row gates to NULL and may repeat freely,
 * while each other role is single-instance per job.
 *
 * Three rules learned the hard way, all load-bearing:
 *
 * 1. ⚠️ **CASE WHEN, never IF().** `IF()` is MySQL-only and SQLite cannot parse it.
 *    CASE WHEN is ANSI and runs on MySQL 8, SQLite 3.31+ and Postgres alike.
 * 2. ⚠️ **Declare it in the CREATE, never a later ALTER.** SQLite cannot ADD COLUMN a
 *    STORED generated column at all, so a migration that adds it afterwards is
 *    permanently unrunnable on SQLite.
 * 3. ⚠️ **Never "simplify" this to a partial index** (`... WHERE role <> 'notify_party'`).
 *    SQLite and Postgres support those; MySQL does not. This generated column IS the
 *    MySQL-portable workaround — replacing it silently drops the constraint on MySQL.
 *
 * ── Why deleted_at is folded INTO the gate ──────────────────────────────────
 * A soft-deleted row's gate becomes NULL, drops out of the unique index, and stops
 * blocking its replacement. Without that, soft-deleting a shipper would permanently
 * prevent assigning a new one — an ordinary operation, broken by a tombstone.
 * Note this is the OPPOSITE choice to enquiries/jobs number uniques, where the tombstone
 * SHOULD keep holding the number (numbers are never recycled). Same mechanism, opposite
 * intent, decided per table (CONTEXT.md §7 item 14).
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('job_entities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id');
            $table->unsignedBigInteger('job_id');

            // Polymorphic — no FK is possible. See the docblock.
            $table->string('party_type', 50);          // customer | partner
            $table->unsignedBigInteger('party_id');

            $table->string('role', 30);
            $table->string('custom_role_label', 50)->nullable(); // used when role = 'other'

            $table->timestamps();
            // MUST precede the generated column: the expression references it.
            $table->softDeletes();

            $table->string('unique_role_gate', 50)
                ->storedAs("CASE WHEN deleted_at IS NULL AND role <> 'notify_party' THEN role END")
                ->nullable();

            $table->foreign('agent_id')->references('id')->on('agents_info');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('cascade');

            $table->unique(['job_id', 'unique_role_gate'], 'uq_job_entities_role');

            $table->index(['party_type', 'party_id'], 'idx_job_entities_party');
        });

        $this->assertGateIsGenerated();
    }

    /**
     * A plain column would accept writes and silently enforce nothing — the unique index
     * would still exist and still be useless. Prove the column is actually GENERATED.
     */
    private function assertGateIsGenerated(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        $row = DB::selectOne(
            'SELECT extra, generation_expression FROM information_schema.columns
             WHERE table_schema = ? AND table_name = ? AND column_name = ?',
            [Schema::getConnection()->getDatabaseName(), 'job_entities', 'unique_role_gate']
        );

        $extra = strtoupper($row->extra ?? $row->EXTRA ?? '');

        if (! str_contains($extra, 'GENERATED')) {
            throw new RuntimeException(
                'job_entities.unique_role_gate is not a generated column (EXTRA = "'
                . $extra . '"). The partial-uniqueness rule would silently not be enforced.'
            );
        }
    }

    public function down()
    {
        Schema::dropIfExists('job_entities');
    }
};
