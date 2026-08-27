<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * bank_transactions, accounts_cass_statements, financial_snapshots —
 * Batch 1c steps 8 and 9.
 *
 * ═══ bank_transactions ══════════════════════════════════════════════════════
 * `plaid_transaction_id` is UNIQUE, and that is the ingestion guard. Bank feeds arrive
 * by webhook AND by a scheduled 3-day fallback sweep (PRD.md §6.4) — precisely so a
 * missed webhook never leaves a gap — which means the same transaction routinely arrives
 * twice. Without the unique index every swept transaction would be double-counted into
 * cash.
 *
 * Both match columns are SET NULL: unmatching a payment must not delete the bank row.
 * The money genuinely moved; only our interpretation of it was wrong.
 *
 * ═══ accounts_cass_statements ═══════════════════════════════════════════════
 * ⚠️ **awb_number is a STRING MATCH, not a foreign key, and that is unavoidable.**
 * IATA sends no internal keys — a CASS statement identifies the shipment only by its AWB
 * number. Matching is therefore fuzzy by nature and `reconciliation_status` carries the
 * outcome.
 *
 * ── The weight columns exist to be compared LIKE-FOR-LIKE ──────────────────
 * `cass_chargeable_weight` against `air_shipment_details.chargeable_weight`, within the
 * tolerance in tenant_policies (default 1%, PRD.md §6.5). Storing the airline's figures
 * separately rather than overwriting ours is the whole point: a mismatch is a dispute to
 * raise, and you cannot dispute a number you have already overwritten.
 *
 * ═══ financial_snapshots ════════════════════════════════════════════════════
 * Pre-computed period figures so the finance dashboard never aggregates the live ledger.
 * `unbilled_revenue` is the leakage number — completed jobs carrying no invoice — which
 * is the one figure on the screen that represents money the branch has earned and not
 * asked for.
 * `accounting_period_id` is SET NULL so a snapshot survives its period being removed.
 *
 * ── No deleted_at on any table here. NO FINANCIAL TABLE GETS ONE (PRD.md §9.3).
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('bank_transactions')) {
            Schema::create('bank_transactions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');

                $table->unsignedBigInteger('matched_invoice_id')->nullable();
                $table->unsignedBigInteger('matched_voucher_id')->nullable();

                // UNIQUE — the webhook/sweep double-ingestion guard. See docblock.
                $table->string('plaid_transaction_id', 255)->unique();
                $table->decimal('amount', 15, 2);
                $table->string('reconciliation_status', 20)->default('unreconciled');

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('matched_invoice_id')->references('id')->on('accounts_invoices')->onDelete('set null');
                $table->foreign('matched_voucher_id')->references('id')->on('accounts_purchase_vouchers')->onDelete('set null');

                $table->index(['agent_id', 'reconciliation_status'], 'idx_bank_reconciliation');
            });
        }

        if (! Schema::hasTable('accounts_cass_statements')) {
            Schema::create('accounts_cass_statements', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('airline_id');
                $table->unsignedBigInteger('matched_voucher_id')->nullable();

                // String match to air_way_bills — IATA sends no internal keys.
                $table->string('awb_number', 20);
                $table->string('billing_period', 20)->nullable(); // e.g. '2026-06-W2'

                // The airline's figures, kept SEPARATE from ours so a mismatch is disputable.
                $table->decimal('cass_chargeable_weight', 10, 3)->default(0);
                $table->decimal('cass_gross_weight', 10, 3)->default(0);
                $table->decimal('cass_rate', 10, 4)->default(0);
                $table->decimal('cass_freight_charges', 15, 2)->default(0);
                $table->decimal('cass_other_charges', 15, 2)->default(0);
                $table->decimal('grand_total', 15, 2)->default(0);

                $table->string('reconciliation_status', 20)->default('unmatched');

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('airline_id')->references('id')->on('partners');
                $table->foreign('matched_voucher_id')->references('id')->on('accounts_purchase_vouchers')->onDelete('set null');

                // The matching pass: find our AWB in this airline's statement.
                $table->index(['awb_number'], 'idx_cass_awb');
                $table->index(['agent_id', 'reconciliation_status'], 'idx_cass_status');
            });
        }

        if (! Schema::hasTable('financial_snapshots')) {
            Schema::create('financial_snapshots', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('accounting_period_id')->nullable();

                $table->date('snapshot_date');

                $table->decimal('total_receivables', 15, 2)->default(0);
                $table->decimal('total_payables', 15, 2)->default(0);
                $table->decimal('net_cash_flow', 15, 2)->default(0);
                $table->decimal('cash_on_hand', 15, 2)->default(0);
                $table->decimal('unbilled_revenue', 15, 2)->default(0);  // the leakage number
                $table->decimal('accrued_expenses', 15, 2)->default(0);

                $table->timestamp('last_computed_at');

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('accounting_period_id')->references('id')->on('accounting_periods')->onDelete('set null');

                $table->index(['agent_id', 'snapshot_date'], 'idx_snapshots_agent_date');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('financial_snapshots');
        Schema::dropIfExists('accounts_cass_statements');
        Schema::dropIfExists('bank_transactions');
    }
};
