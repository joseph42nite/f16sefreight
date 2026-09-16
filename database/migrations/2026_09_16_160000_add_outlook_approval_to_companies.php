<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A client company's IT admin approving F16s for their whole Microsoft 365 once (user, 2026-09-16), so each person
 * connects Outlook without hitting "Need admin approval".
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->timestamp('outlook_approved_at')->nullable();
            $table->string('outlook_tenant_id', 64)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['outlook_approved_at', 'outlook_tenant_id']);
        });
    }
};
