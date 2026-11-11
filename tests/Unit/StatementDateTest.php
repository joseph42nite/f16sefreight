<?php

namespace Tests\Unit;

use App\Support\StatementDate;
use PHPUnit\Framework\TestCase;

/** 2026-11-10 audit, M8: a statement's dates are read day first, and a date that is not one is nobody's guess. */
class StatementDateTest extends TestCase
{
    /** @dataProvider dates */
    public function test_a_statement_date_is_read_day_first(string $written, ?string $expected): void
    {
        $this->assertSame($expected, StatementDate::parse($written)?->toDateString());
    }

    public function dates(): array
    {
        return [
            'day first, not the American way' => ['05/04/2026', '2026-04-05'],
            'a day past the 12th' => ['13/04/2026', '2026-04-13'],
            'dashes and a short year' => ['5-4-26', '2026-04-05'],
            'dots' => ['05.04.2026', '2026-04-05'],
            'already unambiguous' => ['2026-04-05', '2026-04-05'],
            'the month as a word' => ['05-Apr-2026', '2026-04-05'],
            'no such day' => ['31/02/2026', null],
            'no such month' => ['05/13/2026', null],
            'not a date' => ['opening balance', null],
            'empty' => ['', null],
        ];
    }
}
