<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * rate_cards, exchange_rates, sla_policies, tenant_policies — Batch 1b step 12.
 *
 * ═══ rate_cards ═════════════════════════════════════════════════════════════
 * A per-party charge tariff: what WE charge this customer, or what THIS partner charges
 * us, for one charge type on one lane in one weight break during one validity window.
 * Polymorphic party (customer | partner), so no FK on party_id — the same
 * application-enforced tenant check as job_entities applies (guide §3.2).
 *
 * ⚠️ NOT the legacy `rates` table, and not a replacement for it. `rates` is an airline
 * tariff lookup keyed by destination airport, zone and carrier prefix — a different
 * grain entirely. Both are kept (CONTEXT.md §5).
 *
 * The port FKs point at `ports`, which is empty until the directory loads (GAPS.md #1) —
 * both are nullable, so a lane-agnostic rate card works today.
 *
 * ═══ exchange_rates ═════════════════════════════════════════════════════════
 * DECIMAL(12,6), never a float. Realized FX gain/loss is computed from the difference
 * between the rate on `document_date` and the rate at settlement, then posted to
 * 5500-Forex-Gain-Loss (PRD.md §6.4) — a float's rounding error would land straight in
 * the ledger. UNIQUE (from, to, date) makes each day's rate a single fact.
 *
 * ═══ sla_policies ═══════════════════════════════════════════════════════════
 * Keyed (company_id, tier). `max_reply_time_minutes` lives HERE and must never be
 * duplicated into tenant_policies — different grain, and two homes for one number
 * eventually disagree.
 *
 * ═══ tenant_policies — the 59th table ═══════════════════════════════════════
 * Four things PRD.md promised were "admin-configurable" had nowhere to live: the OLI
 * coefficients (§5.5), the undo-send window (§5.2.4), the stale-enquiry window (§5.4)
 * and the CASS tolerances (§6.5). `/settings/workload` was a screen with no storage, so
 * those numbers would have been hardcoded.
 *
 * 🔴 **EVERY COLUMN IS NULLABLE WITH NO SQL DEFAULT.** NULL means "inherit from
 * config/f16s.php". Defaults therefore live in exactly ONE place and this table stores
 * only deliberate overrides. A default in both the config and the DDL would give two
 * sources of truth that drift. Resolution is always **branch → company → config**.
 *
 * 🔴 **policy_scope_gate — the same generated-column trick as job_entities, and for the
 * same reason.** A plain `UNIQUE(company_id, agent_id)` permits MANY company-wide rows,
 * because both MySQL and SQLite allow repeated NULLs in a unique index. Folding NULL to
 * 0 makes "one company-wide row per company" actually enforceable.
 *
 * ── No deleted_at ──────────────────────────────────────────────────────────
 * Removing an override means setting the COLUMN back to NULL so it falls through to the
 * config default — never deleting the row. A soft-deleted policy row would also have to
 * be excluded from every resolution query, which is a guaranteed source of "why is this
 * branch still on the old tolerance?" bugs.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('rate_cards')) {
            Schema::create('rate_cards', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');

                $table->string('party_type', 20);      // customer | partner — polymorphic
                $table->unsignedBigInteger('party_id');

                $table->string('charge_type', 50);
                $table->unsignedBigInteger('origin_port_id')->nullable();
                $table->unsignedBigInteger('destination_port_id')->nullable();
                $table->string('cargo_type', 20)->nullable();

                $table->decimal('weight_break_from', 10, 2)->default(0);
                $table->decimal('weight_break_to', 10, 2)->default(0);
                $table->decimal('rate', 15, 2);
                $table->char('currency', 3)->default('INR');

                $table->date('valid_from');
                $table->date('valid_to');

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('origin_port_id')->references('id')->on('ports');
                $table->foreign('destination_port_id')->references('id')->on('ports');

                // The cost-sheet lookup: this party, this charge, valid on this date.
                $table->index(['agent_id', 'party_type', 'party_id', 'charge_type'], 'idx_rate_cards_party');
                $table->index(['valid_from', 'valid_to'], 'idx_rate_cards_validity');
            });
        }

        if (! Schema::hasTable('exchange_rates')) {
            Schema::create('exchange_rates', function (Blueprint $table) {
                $table->id();
                $table->char('from_currency', 3);
                $table->char('to_currency', 3);
                $table->date('rate_date');
                $table->decimal('rate', 12, 6); // never a float — feeds the ledger
                $table->timestamps();

                $table->unique(['from_currency', 'to_currency', 'rate_date'], 'uq_exchange_rate_date');
            });
        }

        if (! Schema::hasTable('sla_policies')) {
            Schema::create('sla_policies', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('company_id');
                $table->string('tier', 30);
                $table->integer('max_reply_time_minutes')->default(15);
                $table->timestamps();

                $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
                $table->unique(['company_id', 'tier'], 'uq_sla_company_tier');
            });
        }

        if (! Schema::hasTable('tenant_policies')) {
            Schema::create('tenant_policies', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('company_id');
                $table->unsignedBigInteger('agent_id')->nullable(); // NULL = company-wide

                // Operator Load Index — PRD §5.5, Boss-owned via /settings/workload.
                $table->decimal('oli_complexity_air_export', 4, 2)->nullable();
                $table->decimal('oli_complexity_air_import', 4, 2)->nullable();
                $table->decimal('oli_complexity_sea_export', 4, 2)->nullable();
                $table->decimal('oli_complexity_sea_import', 4, 2)->nullable();
                $table->decimal('oli_dimension_factor', 4, 2)->nullable();  // alpha
                $table->decimal('oli_house_factor', 4, 2)->nullable();      // beta
                $table->decimal('oli_urgency_today', 4, 2)->nullable();
                $table->decimal('oli_urgency_tomorrow', 4, 2)->nullable();
                $table->decimal('oli_urgency_later', 4, 2)->nullable();
                $table->decimal('oli_capacity_cap', 6, 2)->nullable();

                // 0 is VALID here and means "send immediately, no undo" — which is why
                // it is nullable rather than defaulted: NULL and 0 mean different things.
                $table->integer('undo_send_seconds')->nullable();

                $table->integer('stale_enquiry_days')->nullable();

                // The only genuinely branch-level settings, which is why agent_id exists.
                $table->decimal('cass_weight_tolerance_pct', 5, 2)->nullable();
                $table->decimal('cass_rate_tolerance_pct', 5, 2)->nullable();

                $table->timestamps(); // no softDeletes — see the docblock

                // ⚠️ VIRTUAL, not STORED — and this is forced, not a preference.
                // MySQL 8 REFUSES `ON DELETE CASCADE` on a column that a STORED generated
                // column depends on: agent_id is both the FK column and the gate's base,
                // so the DDL's combination fails with
                //     ERROR 1215 Cannot add foreign key constraint
                // Verified on MySQL 8.0.46, 2026-08-27:
                //     STORED  + CASCADE  -> 1215 FAILS   <- what the DDL specifies
                //     VIRTUAL + CASCADE  -> works
                //     STORED  + RESTRICT -> works
                // VIRTUAL is chosen over dropping the CASCADE because the cascade is the
                // correct semantic: an override for a branch that no longer exists is
                // meaningless, and RESTRICT would let a stale policy row block deleting
                // the branch. Secondary indexes on VIRTUAL columns are fully supported
                // (MySQL 5.7.8+), so uq_tenant_policies_scope is unaffected — and SQLite
                // can even ADD COLUMN a virtual generated column, which STORED forbids.
                //
                // NOTE job_entities.unique_role_gate stays STORED and is fine: its base
                // columns are `role` and `deleted_at`, neither of which carries an FK.
                $table->unsignedBigInteger('policy_scope_gate')
                    ->virtualAs('COALESCE(agent_id, 0)');

                $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
                $table->foreign('agent_id')->references('id')->on('agents_info')->onDelete('cascade');

                $table->unique(['company_id', 'policy_scope_gate'], 'uq_tenant_policies_scope');
            });
        }

        $this->assertScopeGateIsGenerated();
    }

    private function assertScopeGateIsGenerated(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        $row = DB::selectOne(
            'SELECT extra FROM information_schema.columns
             WHERE table_schema = ? AND table_name = ? AND column_name = ?',
            [Schema::getConnection()->getDatabaseName(), 'tenant_policies', 'policy_scope_gate']
        );

        if (! str_contains(strtoupper($row->extra ?? $row->EXTRA ?? ''), 'GENERATED')) {
            throw new RuntimeException(
                'tenant_policies.policy_scope_gate is not generated — a company could then '
                . 'hold many company-wide policy rows and resolution would be ambiguous.'
            );
        }
    }

    public function down()
    {
        Schema::dropIfExists('tenant_policies');
        Schema::dropIfExists('sla_policies');
        Schema::dropIfExists('exchange_rates');
        Schema::dropIfExists('rate_cards');
    }
};
