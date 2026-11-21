<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * When a person finished or closed the tour of the portal shown on their first sign-in (owner, 2026-11-21).
 * Kept on the account, not in the browser, so it is shown once and not again on another computer.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('tour_seen_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('tour_seen_at');
        });
    }
};
