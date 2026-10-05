<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A mail to the team can be a salesperson's, not only the Boss's (owner, 2026-10-05; GAPS #457): each quarter the Boss
 * gets a review per client to send to that client's salesperson, and the salesperson gets one to send to the ops and
 * pricing staff who worked the client. NULL owner = the Boss's, as every row was before.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('boss_mail_suggestions', function (Blueprint $table) {
            $table->foreignId('owner_user_id')->nullable()->after('agent_id')->constrained('users')->cascadeOnDelete();
            $table->index(['owner_user_id', 'status'], 'idx_boss_mail_owner_status');
        });
    }

    public function down(): void
    {
        Schema::table('boss_mail_suggestions', function (Blueprint $table) {
            $table->dropForeign(['owner_user_id']);
            $table->dropIndex('idx_boss_mail_owner_status');
            $table->dropColumn('owner_user_id');
        });
    }
};
