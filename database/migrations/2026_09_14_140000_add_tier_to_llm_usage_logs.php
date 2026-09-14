<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Which tier answered a model call (user, 2026-09-14: "cheaper options first but we keep fallback
 * always"). `economy` is a provider under the price ceiling; `fast` is the fallback, about six times
 * the cost. Superadmin shows how often the fallback was needed.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('llm_usage_logs', function (Blueprint $table) {
            $table->string('tier', 10)->nullable()->after('provider');
        });
    }

    public function down(): void
    {
        Schema::table('llm_usage_logs', function (Blueprint $table) {
            $table->dropColumn('tier');
        });
    }
};
