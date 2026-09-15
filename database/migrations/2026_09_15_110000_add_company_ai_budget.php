<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * AI spend per company, and a monthly limit on it (user, 2026-09-15).
 *
 * `companies.ai_monthly_limit_inr` — NULL follows the plan (config/f16s.php `ai_monthly_limit_inr`), a value
 * is superadmin's override. `llm_usage_logs.company_id` — the company a call is charged to, so the budget is
 * one indexed sum rather than a join on every AI call. Existing rows are filled from their branch.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->decimal('ai_monthly_limit_inr', 10, 2)->nullable()->after('ocr_credits_limit');
        });

        Schema::table('llm_usage_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('company_id')->nullable()->after('agent_id');
            $table->index(['company_id', 'created_at'], 'idx_llm_company_time');
        });

        DB::statement('UPDATE llm_usage_logs l JOIN agents_info a ON a.id = l.agent_id SET l.company_id = a.company_id WHERE l.company_id IS NULL');
    }

    public function down(): void
    {
        Schema::table('llm_usage_logs', function (Blueprint $table) {
            $table->dropIndex('idx_llm_company_time');
            $table->dropColumn('company_id');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('ai_monthly_limit_inr');
        });
    }
};
