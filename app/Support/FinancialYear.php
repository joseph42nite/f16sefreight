<?php

namespace App\Support;

use Illuminate\Support\Carbon;

/**
 * The Indian financial year, 1 April to 31 March — the books' year unless a company picks another (owner, 2026-10-09:
 * "let them select, primarily financial year"; Walk 3 #40).
 *
 * The demo seeders opened "FY26" as 1 Jan to 31 Dec 2026 (`startOfYear()`), a calendar year with a financial year's name,
 * while document numbers (`EnquirySequenceService::fiscalYear()`) already rolled over on 1 April. One rule, one place: any
 * month from April belongs to the year that just started; January to March to the one before.
 */
final class FinancialYear
{
    /** First day of the financial year that `$on` falls in. */
    public static function start(?Carbon $on = null): Carbon
    {
        $on = $on ? $on->copy() : now();

        return Carbon::create($on->month >= 4 ? $on->year : $on->year - 1, 4, 1)->startOfDay();
    }

    /** Last day of that financial year. */
    public static function end(?Carbon $on = null): Carbon
    {
        return self::start($on)->addYear()->subDay()->startOfDay();
    }

    /** "FY 2026-27" — the long form, so it cannot be mistaken for a calendar year. */
    public static function label(?Carbon $on = null): string
    {
        $start = self::start($on);

        return 'FY ' . $start->year . '-' . $start->copy()->addYear()->format('y');
    }
}
