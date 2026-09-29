<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * "Houses come under a master AWB, so it'll be the same enquiry" (owner, 2026-09-29; GAPS #436).
 *
 * A house created inside a consol takes the consol's enquiry — and a consol made directly in FocusSea or FocusAir has
 * none, so the rule becomes: every shipment traces to an enquiry DIRECTLY, or THROUGH its consol. Still never neither.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE jobs DROP CHECK chk_jobs_enquiry_or_master');
        DB::statement('ALTER TABLE jobs ADD CONSTRAINT chk_jobs_enquiry_or_master
            CHECK (enquiry_id IS NOT NULL OR is_consolidation = 1 OR parent_job_id IS NOT NULL)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE jobs DROP CHECK chk_jobs_enquiry_or_master');
        DB::statement('ALTER TABLE jobs ADD CONSTRAINT chk_jobs_enquiry_or_master
            CHECK (enquiry_id IS NOT NULL OR is_consolidation = 1)');
    }
};
