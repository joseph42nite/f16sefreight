<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The landing page's "Talk to us" form (2026-11-16) asks for the company and the person's designation, so the team
 * can filter who to call first. Both are optional on old rows.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('company', 150)->nullable()->after('email');
            $table->string('designation', 100)->nullable()->after('company');
            $table->string('source', 40)->nullable()->after('message');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn(['company', 'designation', 'source']);
        });
    }
};
