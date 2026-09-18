<?php

namespace App\Services\Bank;

use App\BankTransaction;
use Illuminate\Support\Carbon;

/**
 * Statement lines into `bank_transactions` — one road in, whichever way they arrive (user, 2026-09-19).
 *
 * 🔴 **The provider's own reference is the guard.** Setu (India) and Plaid (elsewhere) both deliver the same
 * transaction more than once — a webhook and then the 3-day sweep (PRD §6.4) — and a statement is often imported
 * twice by somebody unsure the first one worked. That reference is UNIQUE, so a repeat refreshes the row it already
 * wrote instead of counting the money again.
 *
 * ⚠️ Nothing here matches anything. Reading the bank and deciding what a payment settles are different jobs, and a
 * matcher that ran at import would settle invoices nobody had looked at.
 */
class StatementImporter
{
    /**
     * @param  array<int, array{reference: string, amount: float|string, value_date: string, direction?: string,
     *                          narration?: ?string, counterparty?: ?string, currency?: ?string}>  $lines
     * @return array{imported: int, repeated: int, skipped: int}
     */
    public function import(int $agentId, array $lines, string $provider = 'manual'): array
    {
        $result = ['imported' => 0, 'repeated' => 0, 'skipped' => 0];

        foreach ($lines as $line) {
            $reference = trim((string) ($line['reference'] ?? ''));
            $amount = round((float) ($line['amount'] ?? 0), 2);

            // A line with no reference cannot be de-duplicated, and a zero is not a transaction.
            if ($reference === '' || $amount <= 0) {
                $result['skipped']++;

                continue;
            }

            $values = [
                'agent_id' => $agentId,
                'provider' => $provider,
                'amount' => $amount,
                'value_date' => Carbon::parse($line['value_date'] ?? now())->toDateString(),
                'direction' => ($line['direction'] ?? 'credit') === 'debit' ? 'debit' : 'credit',
                'narration' => $line['narration'] ?? null,
                'counterparty' => $line['counterparty'] ?? null,
                'reference' => $reference,
                'currency' => strtoupper((string) ($line['currency'] ?? 'INR')),
            ];

            $existing = BankTransaction::withoutTenantScope()->where('plaid_transaction_id', $reference)->first();

            if ($existing !== null) {
                // The same line again: refresh what the bank now says about it, never the match somebody made.
                $existing->forceFill($values)->save();
                $result['repeated']++;

                continue;
            }

            BankTransaction::withoutTenantScope()->create($values + [
                'plaid_transaction_id' => $reference,
                'reconciliation_status' => 'unreconciled',
            ]);
            $result['imported']++;
        }

        return $result;
    }

    /**
     * A bank's CSV as lines: date, reference, narration, credit, debit — the columns Indian banks export.
     *
     * ⚠️ Column names differ by bank, so each field accepts the handful of spellings seen in practice. A column that
     * is missing leaves its field empty rather than shifting the row.
     */
    public function fromCsv(string $csv): array
    {
        $rows = array_values(array_filter(array_map('str_getcsv', preg_split('/\R/', trim($csv)))));
        $header = array_map(fn ($h) => strtolower(trim((string) $h)), array_shift($rows) ?: []);

        $column = function (array $row, array $names) use ($header) {
            foreach ($names as $name) {
                $i = array_search($name, $header, true);

                if ($i !== false && isset($row[$i])) {
                    return trim((string) $row[$i]);
                }
            }

            return '';
        };
        $money = fn (string $value) => (float) str_replace([',', '₹', ' '], '', $value);

        $lines = [];

        foreach ($rows as $row) {
            $credit = $money($column($row, ['credit', 'deposit', 'cr', 'credit amount']));
            $debit = $money($column($row, ['debit', 'withdrawal', 'dr', 'debit amount']));
            $plain = $money($column($row, ['amount']));

            $lines[] = [
                'reference' => $column($row, ['reference', 'ref', 'ref no', 'utr', 'transaction id', 'cheque no']),
                'value_date' => $column($row, ['date', 'value date', 'txn date', 'transaction date']) ?: now()->toDateString(),
                'narration' => $column($row, ['narration', 'description', 'particulars', 'remarks']),
                'counterparty' => $column($row, ['counterparty', 'payer', 'payee', 'name']),
                'amount' => $credit > 0 ? $credit : ($debit > 0 ? $debit : $plain),
                'direction' => $debit > 0 && $credit <= 0 ? 'debit' : 'credit',
            ];
        }

        return $lines;
    }
}
