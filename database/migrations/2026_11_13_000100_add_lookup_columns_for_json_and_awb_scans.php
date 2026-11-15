<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Four lookups that had to read every row because they compared a computed value (2026-11-10 audit §5):
 *
 *   notifications   "the card for this conversation / this shipment" — the id sits inside the JSON `data`
 *   jobs            "the shipment with this waybill" — the number is stored as typed, compared on its digits
 *   status_response "has this waybill a discrepancy" — the same comparison
 *
 * Each gets a column MySQL works out by itself from the row (virtual: nothing is stored, nothing writes to it) and an
 * index on that column. The code asks for the column instead of repeating the expression.
 *
 * ⚠️ Never name these columns in an insert or update: MySQL refuses a value for a generated column.
 */
return new class extends Migration
{
    private const COLUMNS = [
        ['notifications', 'thread_ref', "left(json_unquote(json_extract(`data`, '$.thread_id')), 64)"],
        ['notifications', 'job_ref', "left(json_unquote(json_extract(`data`, '$.job_id')), 64)"],
        ['jobs', 'awb_digits', "left(replace(replace(`awb_number`, '-', ''), ' ', ''), 64)"],
        ['status_response', 'awb_digits', "left(replace(replace(`business_id`, '-', ''), ' ', ''), 64)"],
    ];

    public function up(): void
    {
        foreach (self::COLUMNS as [$table, $column, $expression]) {
            if (Schema::hasColumn($table, $column)) {
                continue;
            }

            DB::statement("alter table `{$table}` add column `{$column}` varchar(64)"
                . " character set utf8mb4 collate utf8mb4_unicode_ci generated always as ({$expression}) virtual,"
                . " add index `{$table}_{$column}_index` (`{$column}`)");
        }
    }

    public function down(): void
    {
        foreach (self::COLUMNS as [$table, $column]) {
            if (Schema::hasColumn($table, $column)) {
                DB::statement("alter table `{$table}` drop index `{$table}_{$column}_index`, drop column `{$column}`");
            }
        }
    }
};
