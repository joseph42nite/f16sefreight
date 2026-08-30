<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Batch 1d — the analytics engine tables.
 *
 * ═══ WHY THESE EXIST AT ALL ═════════════════════════════════════════════════
 * 🔴 **`PRD.md` §2242: never run COUNT/SUM/AVG on live transactional tables for
 * dashboards.** Aggregating `jobs` on page load degrades exactly as a branch grows —
 * the product gets slower the more successful the customer is — and it competes for
 * the same rows operators are writing to all day. These tables hold answers computed
 * once by a background job; the dashboard reads a handful of rows.
 *
 * The trade is staleness, which is why `last_computed_at` is NOT NULL on the two
 * tables that carry it: a dashboard must be able to say how old its numbers are
 * (PRD.md §7 requires a staleness banner past one hour). A nullable column would let
 * a snapshot exist with no idea when it was true.
 *
 * ═══ 🔴 EVERY TABLE IS KEYED BY transport_mode, AND NO ROW EVER BLENDS MODES ═
 * Air sales staff see air only; sea staff see sea only. The unique keys enforce it:
 * `(customer_id, transport_mode, …)`, never `(customer_id, …)`. A blended row cannot
 * be un-blended afterwards, and a rep acting on a cross-mode tonnage figure is acting
 * on a number describing cargo they cannot influence.
 *
 * ═══ 📌 Ordering note ═══════════════════════════════════════════════════════
 * The guide says "build these when Step 7 starts, not before". Built now instead,
 * because §5.5 — two steps EARLIER — is specified to read them and forbidden from
 * aggregating live. The guide's own rule and its own ordering disagree; the rule wins,
 * since the alternative is writing code §5.5 explicitly prohibits and rewriting it at
 * Step 7. Flagged to the owner before building.
 */
return new class extends Migration
{
    public function up()
    {
        // ── 36a. customer_performance_snapshots ──────────────────────────────
        if (! Schema::hasTable('customer_performance_snapshots')) {
            Schema::create('customer_performance_snapshots', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('customer_id');
                $table->string('transport_mode', 10);   // 'air' | 'sea' | 'road' — never blended
                $table->date('snapshot_date');

                // Volume — this mode only.
                $table->decimal('tonnage_mtd', 14, 3)->default(0);
                $table->decimal('tonnage_ytd', 14, 3)->default(0);
                $table->integer('shipment_count_mtd')->default(0);
                $table->integer('enquiry_count_mtd')->default(0);

                // Funnel. 🔴 NULLABLE ON PURPOSE — §7.1: a rate over an empty
                // denominator is NULL, never 0%. "No enquiries this month" and "every
                // enquiry lost" are opposite facts and must not render alike.
                $table->decimal('win_rate', 5, 2)->nullable();
                $table->decimal('service_loss_rate', 5, 2)->nullable();  // delay_in_response — OUR fault
                $table->decimal('price_loss_rate', 5, 2)->nullable();    // rates_high — the market

                // Trend.
                $table->decimal('momentum', 6, 3)->nullable();   // EWMA 90d vs 365d
                $table->decimal('lane_hhi', 5, 3)->nullable();   // Herfindahl concentration

                // Money.
                $table->decimal('revenue_mtd', 15, 2)->default(0);
                $table->decimal('revenue_ytd', 15, 2)->default(0);
                $table->integer('dso_days')->nullable();
                $table->integer('payment_drift_days')->nullable();  // dso − payment_terms_days
                $table->decimal('outstanding_0_30', 15, 2)->default(0);
                $table->decimal('outstanding_31_60', 15, 2)->default(0);
                $table->decimal('outstanding_60_plus', 15, 2)->default(0);
                $table->decimal('credit_utilization', 5, 2)->nullable();

                // Service quality — are WE the problem?
                $table->decimal('ops_health', 5, 2)->nullable();
                $table->decimal('declaration_accuracy', 5, 2)->nullable();

                // Composite. ⚠️ Render the COMPONENTS, never the bare number: a client
                // health score of 62 tells a rep nothing about what to do next.
                $table->decimal('client_health_score', 5, 2)->nullable();

                $table->timestamp('last_computed_at');
                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');

                $table->unique(['customer_id', 'transport_mode', 'snapshot_date'], 'uk_cps_customer_mode_date');
                $table->index(['agent_id', 'transport_mode', 'snapshot_date'], 'idx_cps_scope');
            });
        }

        // ── 36b. customer_lane_stats ─────────────────────────────────────────
        if (! Schema::hasTable('customer_lane_stats')) {
            Schema::create('customer_lane_stats', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('customer_id');
                $table->string('transport_mode', 10);

                // LOCODEs. From *_shipment_details once converted, else enquiries —
                // the declared lane and the actual lane are different facts.
                $table->char('origin_code', 5);
                $table->char('dest_code', 5);
                $table->date('period_month');   // first day of month

                $table->integer('shipment_count')->default(0);
                $table->integer('enquiry_count')->default(0);
                $table->decimal('tonnage', 14, 3)->default(0);
                $table->decimal('revenue', 15, 2)->default(0);
                $table->integer('rates_high_losses')->default(0);  // price pressure ON THIS LANE

                // quoted vs won ⇒ price elasticity. NULL when nothing was quoted.
                $table->decimal('avg_quoted', 15, 2)->nullable();
                $table->decimal('avg_won', 15, 2)->nullable();

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');

                $table->unique(
                    ['customer_id', 'transport_mode', 'origin_code', 'dest_code', 'period_month'],
                    'uk_cls_lane'
                );
                $table->index(['agent_id', 'transport_mode', 'origin_code', 'dest_code'], 'idx_cls_lane_scope');
            });
        }

        // ── 36c. customer_cadence_profiles ───────────────────────────────────
        if (! Schema::hasTable('customer_cadence_profiles')) {
            Schema::create('customer_cadence_profiles', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('customer_id');
                $table->string('transport_mode', 10);   // an air rhythm is not a sea rhythm

                // 🔴 MEDIAN, not mean, and MAD, not standard deviation. One Diwali
                // rush would drag a mean gap far enough that a client three weeks
                // overdue still looks on time — the alert fires after the client has
                // already gone. Robust statistics are the whole point of this table.
                $table->decimal('expected_gap_days', 7, 2)->nullable();
                $table->decimal('volatility_mad', 7, 2)->nullable();

                $table->timestamp('last_shipment_at')->nullable();
                $table->decimal('overdue_ratio', 6, 3)->nullable();
                $table->string('risk_band', 10)->nullable();   // LOW | WATCH | AT_RISK | DORMANT

                // Suppression, not decoration: below 5 shipments there is no rhythm to
                // measure, and a rhythm inferred from three is noise presented as signal.
                $table->integer('sample_size')->default(0);
                $table->boolean('is_irregular')->default(false);  // volatility/expected > 1.2

                $table->timestamp('last_computed_at');
                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');

                $table->unique(['customer_id', 'transport_mode'], 'uk_ccp_customer_mode');
                $table->index(['agent_id', 'transport_mode', 'risk_band'], 'idx_ccp_risk');
            });
        }

        // ── 36d. sales_action_queue ──────────────────────────────────────────
        if (! Schema::hasTable('sales_action_queue')) {
            Schema::create('sales_action_queue', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('customer_id')->nullable(); // NULL = branch-level (Tactical)
                $table->string('transport_mode', 10);
                $table->unsignedBigInteger('sales_id')->nullable();    // Command-tier scoping

                // 🔴 THE STRUCTURAL FIREWALL. See the CHECK constraints below.
                $table->string('audience', 10)->default('internal');

                $table->string('action_type', 40);
                $table->decimal('priority_score', 10, 3);   // impact × urgency ÷ effort
                $table->decimal('impact_value', 15, 2)->nullable();

                // Deterministic inputs handed to the model VERBATIM. Kept so a
                // narration can always be traced back to the numbers that produced it.
                $table->json('fact_packet');

                // NULL is a first-class state: the model was unavailable and the row
                // degrades to numbers only, rather than the action disappearing.
                $table->text('narrated_text')->nullable();
                $table->timestamp('narrated_at')->nullable();

                // Client outreach draft — audience='client' ONLY.
                $table->string('draft_subject', 255)->nullable();
                $table->text('draft_body')->nullable();
                $table->json('draft_to')->nullable();
                // Snapshot of opted-in contacts AT GENERATION TIME, so the rep sees
                // exactly who will receive it and a later contact edit never silently
                // changes an already-drafted email.
                $table->json('draft_cc')->nullable();
                $table->timestamp('draft_generated_at')->nullable();

                $table->timestamp('sent_at')->nullable();
                $table->unsignedBigInteger('sent_by')->nullable();
                $table->string('sent_thread_key', 255)->nullable(); // replies return to the inbox

                $table->string('status', 20)->default('open');   // open | acted | dismissed | expired
                $table->timestamp('expires_at')->nullable();

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
                $table->foreign('sales_id')->references('id')->on('users')->onDelete('set null');
                $table->foreign('sent_by')->references('id')->on('users')->onDelete('set null');

                $table->index(['sales_id', 'transport_mode', 'status', 'priority_score'], 'idx_saq_sales_queue');
                $table->index(['agent_id', 'transport_mode', 'status', 'priority_score'], 'idx_saq_branch_queue');
            });
        }

        $this->addAudienceFirewall();
    }

    /**
     * 🔴 **THE FIREWALL: an internal finding can never carry a client-facing draft.**
     *
     * Enforced at the DATABASE, not in a service, because the consequence of getting
     * it wrong is emailing a client our own analysis of them — "this account is
     * at-risk, renegotiate the rate" reaching the account itself. No amount of
     * application care makes that recoverable, so the constraint refuses the row.
     *
     * ⚠️ **`COLLATE utf8mb4_bin` inside the expression.** The columns collate
     * `utf8mb4_unicode_ci`, so without this a CHECK reports as present and silently
     * accepts `'Client'` — MySQL's own reads stay case-insensitive, but the value is
     * serialised to JSON and `audience === 'client'` in Vue is case-SENSITIVE. The
     * row passes every database check and then fails in every frontend guard. This
     * bit us on `chk_enq_status`; it is not hypothetical.
     */
    private function addAudienceFirewall(): void
    {
        $existing = collect(DB::select(
            "SELECT constraint_name FROM information_schema.table_constraints
             WHERE table_schema = DATABASE() AND table_name = 'sales_action_queue'
               AND constraint_type = 'CHECK'"
        ))->pluck('constraint_name')->all();

        if (! in_array('chk_saq_audience', $existing, true)) {
            DB::statement(
                "ALTER TABLE sales_action_queue ADD CONSTRAINT chk_saq_audience
                 CHECK (audience COLLATE utf8mb4_bin IN ('internal','client'))"
            );
        }

        if (! in_array('chk_saq_internal_no_draft', $existing, true)) {
            DB::statement(
                "ALTER TABLE sales_action_queue ADD CONSTRAINT chk_saq_internal_no_draft
                 CHECK (audience COLLATE utf8mb4_bin = 'client'
                        OR (draft_subject IS NULL AND draft_body IS NULL
                            AND draft_to IS NULL AND draft_cc IS NULL))"
            );
        }
    }

    public function down()
    {
        Schema::dropIfExists('sales_action_queue');
        Schema::dropIfExists('customer_cadence_profiles');
        Schema::dropIfExists('customer_lane_stats');
        Schema::dropIfExists('customer_performance_snapshots');
    }
};
