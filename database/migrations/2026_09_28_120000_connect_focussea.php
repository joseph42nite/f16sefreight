<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * FocusSea, connected — guide Step 12.1 (GAPS #424).
 *
 * 1. A consol master is created in FocusSea and has no client enquiry behind it (owner, 2026-09-28). `enquiry_id`
 *    may be NULL for a consolidation master ONLY — every client shipment still traces to its enquiry.
 * 2. PRD §5.8 fields that had no column: transshipment hubs, ETD/ETA, service contract, commodity, HS code, marks &
 *    numbers, package code, weight and volume units, BL type, release type, empty depot.
 * 3. Size/type belongs to each container (PRD §5.8 tab 7), not to the shipment. The one value a shipment held is
 *    copied onto its containers before the column goes.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE jobs MODIFY enquiry_id BIGINT UNSIGNED NULL');
        if (! $this->hasCheck('jobs', 'chk_jobs_enquiry_or_master')) {
            DB::statement('ALTER TABLE jobs ADD CONSTRAINT chk_jobs_enquiry_or_master
                CHECK (enquiry_id IS NOT NULL OR is_consolidation = 1)');
        }

        Schema::table('sea_shipment_details', function (Blueprint $t) {
            $add = fn (string $c) => ! Schema::hasColumn('sea_shipment_details', $c);
            if ($add('service_contract_no')) $t->string('service_contract_no', 30)->nullable()->after('imo_number');
            if ($add('ts1_code')) $t->char('ts1_code', 5)->nullable()->after('del_code');
            if ($add('ts2_code')) $t->char('ts2_code', 5)->nullable()->after('ts1_code');
            if ($add('ts3_code')) $t->char('ts3_code', 5)->nullable()->after('ts2_code');
            if ($add('etd')) $t->date('etd')->nullable()->after('ts3_code');
            if ($add('eta')) $t->date('eta')->nullable()->after('etd');
            if ($add('commodity_description')) $t->string('commodity_description', 500)->nullable()->after('eta');
            if ($add('hs_code')) $t->string('hs_code', 10)->nullable()->after('commodity_description');
            if ($add('marks_numbers')) $t->text('marks_numbers')->nullable()->after('hs_code');
            if ($add('package_code')) $t->string('package_code', 10)->nullable()->after('piece_count');
            if ($add('weight_unit')) $t->string('weight_unit', 3)->nullable()->after('chargeable_weight');
            if ($add('volume_unit')) $t->string('volume_unit', 3)->nullable()->after('volume_cbm');
            if ($add('bl_type')) $t->string('bl_type', 30)->nullable()->after('mbl_number');
            if ($add('release_type')) $t->string('release_type', 10)->nullable()->after('bl_type');
            if ($add('empty_depot')) $t->string('empty_depot', 150)->nullable()->after('haulage_provider_id');
        });

        if (! Schema::hasColumn('sea_containers', 'container_type')) {
            Schema::table('sea_containers', function (Blueprint $t) {
                $t->string('container_type', 4)->nullable()->after('container_number');
            });
        }

        if (Schema::hasColumn('sea_shipment_details', 'container_type')) {
            DB::statement('UPDATE sea_containers c JOIN sea_shipment_details d ON d.job_id = c.job_id
                SET c.container_type = d.container_type WHERE c.container_type IS NULL');
            Schema::table('sea_shipment_details', fn (Blueprint $t) => $t->dropColumn('container_type'));
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('sea_shipment_details', 'container_type')) {
            Schema::table('sea_shipment_details', fn (Blueprint $t) => $t->string('container_type', 20)->nullable());
        }
        Schema::table('sea_containers', fn (Blueprint $t) => $t->dropColumn('container_type'));
        Schema::table('sea_shipment_details', fn (Blueprint $t) => $t->dropColumn([
            'service_contract_no', 'ts1_code', 'ts2_code', 'ts3_code', 'etd', 'eta', 'commodity_description',
            'hs_code', 'marks_numbers', 'package_code', 'weight_unit', 'volume_unit', 'bl_type', 'release_type',
            'empty_depot',
        ]));

        if ($this->hasCheck('jobs', 'chk_jobs_enquiry_or_master')) {
            DB::statement('ALTER TABLE jobs DROP CHECK chk_jobs_enquiry_or_master');
        }
        DB::statement('ALTER TABLE jobs MODIFY enquiry_id BIGINT UNSIGNED NOT NULL');
    }

    private function hasCheck(string $table, string $name): bool
    {
        return DB::table('information_schema.table_constraints')
            ->where('constraint_schema', DB::getDatabaseName())
            ->where('table_name', $table)->where('constraint_name', $name)->exists();
    }
};
