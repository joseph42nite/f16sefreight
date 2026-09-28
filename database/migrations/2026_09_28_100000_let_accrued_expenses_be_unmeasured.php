<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * `financial_snapshots.accrued_expenses` may be NULL — "not measured", never 0 (user, 2026-09-28; GAPS #419).
 *
 * The command filled it with the PAYABLES figure: the same money twice under two names. Accrued expenses are costs
 * incurred that no supplier has billed yet, and nothing in the schema values them — a billed shipment with no cost
 * booked is known to exist (Money out ①), but not what it will cost. Until the owner says how to value it, the
 * honest figure is none: 0 would claim there are no such costs.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE financial_snapshots MODIFY accrued_expenses DECIMAL(15,2) NULL');
    }

    public function down(): void
    {
        DB::statement('UPDATE financial_snapshots SET accrued_expenses = 0 WHERE accrued_expenses IS NULL');
        DB::statement('ALTER TABLE financial_snapshots MODIFY accrued_expenses DECIMAL(15,2) NOT NULL');
    }
};
