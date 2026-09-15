<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Automated client updates (user, 2026-09-16): which moments of a shipment the client has been told about, so each
 * is prepared once — `{"claimed": {"decision": "sent", "by": 12, "at": "…"}, …}`. The draft waiting for approval
 * stays in `pending_client_notification`.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->json('client_updates')->nullable()->after('pending_client_notification');
        });
    }

    public function down(): void
    {
        Schema::table('email_threads', function (Blueprint $table) {
            $table->dropColumn('client_updates');
        });
    }
};
