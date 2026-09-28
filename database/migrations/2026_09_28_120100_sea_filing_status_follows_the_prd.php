<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * `sea_shipment_details.filing_status` defaulted to 'pending', a value PRD §5.8 tab 11 does not have
 * (not_filed · submitted · cleared · rejected) and the form cannot show or save (GAPS #424).
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('sea_shipment_details')->where('filing_status', 'pending')->update(['filing_status' => 'not_filed']);
        DB::statement("ALTER TABLE sea_shipment_details MODIFY filing_status VARCHAR(20) NOT NULL DEFAULT 'not_filed'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE sea_shipment_details MODIFY filing_status VARCHAR(20) NOT NULL DEFAULT 'pending'");
    }
};
