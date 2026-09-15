<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Why a rep dismissed a suggested client email (user, 2026-09-15): every dismissal keeps its reason, so
 * F16s can see in superadmin which suggestions miss and improve them. A dismissed suggestion of the same
 * kind for the same client is not suggested again for 30 days.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_action_queue', function (Blueprint $table) {
            $table->string('dismissed_reason', 30)->nullable()->after('sent_thread_key');
            $table->string('dismissed_note', 500)->nullable()->after('dismissed_reason');
            $table->foreignId('dismissed_by')->nullable()->after('dismissed_note')->constrained('users')->nullOnDelete();
            $table->timestamp('dismissed_at')->nullable()->after('dismissed_by');
            $table->index(['audience', 'dismissed_at'], 'idx_saq_dismissed');
        });
    }

    public function down(): void
    {
        Schema::table('sales_action_queue', function (Blueprint $table) {
            $table->dropIndex('idx_saq_dismissed');
            $table->dropConstrainedForeignId('dismissed_by');
            $table->dropColumn(['dismissed_reason', 'dismissed_note', 'dismissed_at']);
        });
    }
};
