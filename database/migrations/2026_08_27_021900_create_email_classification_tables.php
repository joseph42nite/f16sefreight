<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * email_classification_rules + email_classification_overrides — Batch 1b step 14.
 *
 * ── The overrides table is a FEEDBACK LOOP, not an error log ───────────────
 * Every time an operator corrects a classification, the row records what the system
 * said, what the human said, and WHICH RULE produced the wrong answer
 * (`matched_rule_id`). Paired with `rules.hit_count` / `.override_count`, that makes a
 * rule's accuracy measurable: a rule with 200 hits and 180 overrides is actively
 * harmful and can be found rather than guessed at.
 *
 * `matched_rule_id` is `ON DELETE SET NULL` — deleting a bad rule must not erase the
 * evidence that it was bad.
 *
 * ── priority drives evaluation order ───────────────────────────────────────
 * Rules are evaluated in priority order, so a specific domain_blocklist entry can beat a
 * broad body_keyword. `is_active` retires a rule without deleting it, keeping its
 * historical hit/override counts intact.
 *
 * ── Classification runs on INBOUND mail ONLY ──────────────────────────────
 * One of the load-bearing rules (PRD.md): outbound is stored and stamps
 * `first_response_at`, but is never classified. Classifying our own replies mints a
 * second enquiry from the same conversation and inflates the conversion denominator.
 * Nothing in this schema enforces that — it is a service-layer invariant.
 *
 * ── The override row is append-only in spirit: created_at, no updated_at ──
 * A correction is a point-in-time event; there is nothing to update.
 */
return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('email_classification_rules')) {
            Schema::create('email_classification_rules', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');

                $table->string('rule_name', 100);
                // domain_blocklist | subject_keyword | body_keyword | sender_pattern
                $table->string('rule_type', 30);
                $table->string('pattern', 500);
                $table->string('target_classification', 30);

                $table->integer('priority')->default(10); // lower = evaluated first
                $table->boolean('is_active')->default(true);

                // Accuracy telemetry — the pair is what makes a bad rule findable.
                $table->integer('hit_count')->default(0);
                $table->integer('override_count')->default(0);

                $table->timestamps();

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->index(['agent_id', 'is_active', 'priority'], 'idx_rules_evaluation');
            });
        }

        if (! Schema::hasTable('email_classification_overrides')) {
            Schema::create('email_classification_overrides', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('agent_id');
                $table->unsignedBigInteger('email_thread_id');
                $table->unsignedBigInteger('matched_rule_id')->nullable();

                $table->string('original_classification', 30);
                $table->string('corrected_classification', 30);

                // Snapshotted, not joined: the rule that misfired must stay diagnosable
                // even after the thread is archived or the rule is retired.
                $table->string('email_subject', 255);
                $table->string('sender_domain', 100);
                $table->string('sender_email', 255);

                $table->unsignedBigInteger('corrected_by');

                $table->timestamp('created_at')->nullable(); // no updated_at — see docblock

                $table->foreign('agent_id')->references('id')->on('agents_info');
                $table->foreign('email_thread_id')->references('id')->on('email_threads');
                $table->foreign('matched_rule_id')->references('id')->on('email_classification_rules')->onDelete('set null');
                $table->foreign('corrected_by')->references('id')->on('users');

                $table->index(['matched_rule_id'], 'idx_overrides_rule');
                $table->index(['sender_domain'], 'idx_overrides_domain');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('email_classification_overrides');
        Schema::dropIfExists('email_classification_rules');
    }
};
