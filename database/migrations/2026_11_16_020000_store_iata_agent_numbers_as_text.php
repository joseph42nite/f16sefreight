<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A branch's IATA agent code (7 digits) and CASS number (4 digits) are identifiers, not quantities.
 *
 * They were whole-number columns, so a CASS of "0042" was stored as 42 — and that is what went onto the waybill PDF
 * and into the airline message (`ram:CargoAgentID`, the agent location `ram:ID`). Found 2026-11-16 by the test for
 * saving them from a waybill form (frontend audit FW15). Both screens that accept them insist on exactly 7 and 4
 * digits, so a shorter stored value can only have lost leading zeros: those are put back.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('agents_info', 'iata_agent_code')) {
            return;
        }

        DB::statement('ALTER TABLE agents_info MODIFY iata_agent_code VARCHAR(7) NULL, MODIFY iata_agent_cass VARCHAR(4) NULL');

        DB::table('agents_info')->whereNotNull('iata_agent_code')->whereRaw('CHAR_LENGTH(iata_agent_code) < 7')
            ->update(['iata_agent_code' => DB::raw("LPAD(iata_agent_code, 7, '0')")]);
        DB::table('agents_info')->whereNotNull('iata_agent_cass')->whereRaw('CHAR_LENGTH(iata_agent_cass) < 4')
            ->update(['iata_agent_cass' => DB::raw("LPAD(iata_agent_cass, 4, '0')")]);
    }

    public function down(): void
    {
        // Back to numbers would drop the leading zeros again; left as text on purpose.
    }
};
