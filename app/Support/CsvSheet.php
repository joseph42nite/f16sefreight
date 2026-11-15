<?php

namespace App\Support;

/**
 * A CSV somebody else's system exported, read by column NAME — the bank's statement, a supplier's statement.
 *
 * ⚠️ Column names differ by sender, so a field is asked for by every spelling seen in practice and the first one
 * present wins. A column that is missing leaves its field empty rather than shifting the row.
 */
class CsvSheet
{
    /** @param list<array<int, ?string>> $rows  the lines under the header */
    private function __construct(public readonly array $rows, private readonly array $header)
    {
    }

    public static function read(string $csv): self
    {
        $rows = array_values(array_filter(array_map('str_getcsv', preg_split('/\R/', trim($csv)))));
        $header = array_map(fn ($h) => strtolower(trim((string) $h)), array_shift($rows) ?: []);

        return new self($rows, $header);
    }

    /** The row's value under the first of these column names that the sheet has; '' when it has none of them. */
    public function column(array $row, array $names): string
    {
        foreach ($names as $name) {
            $i = array_search($name, $this->header, true);

            if ($i !== false && isset($row[$i])) {
                return trim((string) $row[$i]);
            }
        }

        return '';
    }

    /** "₹ 1,25,000.50" → 125000.5 */
    public static function money(string $value): float
    {
        return (float) str_replace([',', '₹', ' '], '', $value);
    }
}
