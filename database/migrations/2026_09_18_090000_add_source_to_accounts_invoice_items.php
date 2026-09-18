<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Where a sell line came from (user, 2026-09-18: "keep updating the sell when updating the draft").
 * NULL is a line somebody typed; 'waybill' is one written from the draft air waybill and replaced each time it is saved.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts_invoice_items', function (Blueprint $table) {
            $table->string('source', 20)->nullable()->after('charge_basis');
        });
    }

    public function down(): void
    {
        Schema::table('accounts_invoice_items', function (Blueprint $table) {
            $table->dropColumn('source');
        });
    }
};
