<?php

namespace Tests\Unit;

use App\Support\FinancialYear;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\TestCase;

/** The books' year is 1 April to 31 March by default (owner, 2026-10-09; Walk 3 #40). */
class FinancialYearTest extends TestCase
{
    /** @dataProvider days */
    public function test_a_day_belongs_to_the_financial_year_that_started_on_or_before_it(string $day, string $start, string $end, string $label): void
    {
        $on = Carbon::parse($day);

        $this->assertSame($start, FinancialYear::start($on)->toDateString());
        $this->assertSame($end, FinancialYear::end($on)->toDateString());
        $this->assertSame($label, FinancialYear::label($on));
    }

    public function days(): array
    {
        return [
            'October'        => ['2026-10-09', '2026-04-01', '2027-03-31', 'FY 2026-27'],
            'first day'      => ['2026-04-01', '2026-04-01', '2027-03-31', 'FY 2026-27'],
            'last day'       => ['2027-03-31', '2026-04-01', '2027-03-31', 'FY 2026-27'],
            'February'       => ['2027-02-15', '2026-04-01', '2027-03-31', 'FY 2026-27'],
            'March, old year' => ['2026-03-31', '2025-04-01', '2026-03-31', 'FY 2025-26'],
            'new year\'s day' => ['2026-01-01', '2025-04-01', '2026-03-31', 'FY 2025-26'],
        ];
    }
}
