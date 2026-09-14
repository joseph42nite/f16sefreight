<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What the hosted model costs, and the limits on it (user, 2026-09-14).
 *
 * 🔴 The model is Gemma 4 31B through OpenRouter now, paid per call, so every call is logged with
 * WHO made it — `llm_usage_logs` only had an enquiry and a job, which answer neither "how many has
 * this user run today" (the per-user daily limit) nor "what does each customer cost".
 *
 * `ai_budget_settings` is ONE row, edited in the superadmin portal: the monthly budget in rupees,
 * the rate used to show dollars as rupees, and the per-user daily limit. When the month's spend
 * reaches the budget the portal says so and extraction KEEPS RUNNING (user's choice); the hard
 * stop is the credit limit on the OpenRouter key itself.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('llm_usage_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('agent_id')->nullable()->after('id');
            $table->unsignedBigInteger('user_id')->nullable()->after('agent_id');
            $table->unsignedBigInteger('pdf_processing_job_id')->nullable()->after('job_id');
            // `text` or `vision` — a scan costs more, and is paid for with a credit as well.
            $table->string('purpose', 20)->default('text')->after('model');
            // Which OpenRouter provider answered, so a slow or failing one can be named.
            $table->string('provider', 60)->nullable()->after('purpose');
            $table->unsignedTinyInteger('attempts')->default(1)->after('execution_ms');

            $table->index(['user_id', 'created_at'], 'idx_llm_user_time');
            $table->index(['agent_id', 'created_at'], 'idx_llm_agent_time');
        });

        Schema::create('ai_budget_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('monthly_budget_inr', 12, 2)->default(7000);
            $table->decimal('usd_to_inr', 8, 2)->default(88);
            $table->unsignedInteger('per_user_daily_limit')->default(100);
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_budget_settings');

        Schema::table('llm_usage_logs', function (Blueprint $table) {
            $table->dropIndex('idx_llm_user_time');
            $table->dropIndex('idx_llm_agent_time');
            $table->dropColumn(['agent_id', 'user_id', 'pdf_processing_job_id', 'purpose', 'provider', 'attempts']);
        });
    }
};
