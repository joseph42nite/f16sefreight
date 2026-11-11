<?php

namespace App\Support;

use Illuminate\Support\Carbon;

/**
 * A date as a bank or a supplier writes it on a statement (2026-11-10 audit, M8).
 *
 * 🔴 **Day first.** Indian statements write 05/04/2026 for the 5th of April. `Carbon::parse` reads that the American
 * way — the 4th of May — and throws on 13/04/2026, which stopped an import half way through. A date that is not a
 * date answers NULL, never an exception and never a guess.
 */
final class StatementDate
{
    public static function parse(mixed $value): ?Carbon
    {
        if ($value instanceof \DateTimeInterface) {
            return Carbon::instance($value)->startOfDay();
        }

        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        // 05/04/2026, 5-4-26, 05.04.2026 — day, month, year.
        if (preg_match('/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4}|\d{2})$/', $value, $m)) {
            $year = strlen($m[3]) === 2 ? 2000 + (int) $m[3] : (int) $m[3];

            return checkdate((int) $m[2], (int) $m[1], $year) ? Carbon::create($year, (int) $m[2], (int) $m[1]) : null;
        }

        // 2026-04-05, with or without a time: already unambiguous.
        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})/', $value, $m) && ! checkdate((int) $m[2], (int) $m[3], (int) $m[1])) {
            return null;
        }

        // 05-Apr-2026, 5 April 2026 and the like — the month is a word, so there is nothing to mistake.
        try {
            return Carbon::parse($value)->startOfDay();
        } catch (\Throwable) {
            return null;
        }
    }
}
