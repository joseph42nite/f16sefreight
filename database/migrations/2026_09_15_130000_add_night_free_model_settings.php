<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The free Gemma at night (user, 2026-09-15: 9pm–11am, the paid model when it does not answer). Two switches in
 * superadmin: help questions and email drafts (on), document extraction (off until superadmin turns it on).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_budget_settings', function (Blueprint $table) {
            $table->boolean('night_free_help_drafts')->default(true)->after('per_user_daily_questions');
            $table->boolean('night_free_extraction')->default(false)->after('night_free_help_drafts');
        });
    }

    public function down(): void
    {
        Schema::table('ai_budget_settings', function (Blueprint $table) {
            $table->dropColumn(['night_free_help_drafts', 'night_free_extraction']);
        });
    }
};
