<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `manifest_filings` was five columns; PRD §5.8's CGM Filing screen needs the filing type, custom house, date/time,
 * amendment number, sending method, transaction status and a read-only status log (GAPS #26, #429).
 *
 * The status values are tab 11's (not_filed · submitted · cleared · rejected), so the filing and the bill read the
 * same word. Existing rows were recorded by hand before this screen existed: CGM, manual, submitted.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('manifest_filings', function (Blueprint $table) {
            $table->string('filing_type', 10)->default('CGM')->after('job_id');
            $table->char('custom_house_code', 6)->nullable()->after('filing_type');
            $table->unsignedSmallInteger('amendment_no')->default(0)->after('custom_house_code');
            $table->dateTime('filed_at')->nullable()->after('amendment_no');
            $table->string('sending_method', 10)->default('manual')->after('filed_at');
            $table->string('status', 20)->default('submitted')->after('sending_method');
            $table->json('status_log')->nullable()->after('status');

            // One amendment number per job and filing type — a second "amendment 1" is two filings claiming one slot.
            $table->unique(['job_id', 'filing_type', 'amendment_no']);
        });
    }

    public function down(): void
    {
        Schema::table('manifest_filings', function (Blueprint $table) {
            $table->dropUnique(['job_id', 'filing_type', 'amendment_no']);
            $table->dropColumn(['filing_type', 'custom_house_code', 'amendment_no', 'filed_at', 'sending_method', 'status', 'status_log']);
        });
    }
};
