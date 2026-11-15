<?php

namespace App\Services\Bank;

use App\BankTransaction;

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
    public function import(int $agentId, array $lines, string $provider = 'manual', ?int $bankAccountId = null): array
    {
        // All of the statement or none of it: a failure part-way must not leave half the lines in.
        return \Illuminate\Support\Facades\DB::transaction(fn () => $this->importLines($agentId, $lines, $provider, $bankAccountId));
    }

    private function importLines(int $agentId, array $lines, string $provider, ?int $bankAccountId): array
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

            // 🔴 Read day first, as the bank wrote it (2026-11-10 audit, M8). A line whose date cannot be read is
            // skipped and counted — never booked on a guessed day, and never an exception that stops the import with
            // half the statement in. A line with no date at all is today's.
            $given = trim((string) ($line['value_date'] ?? ''));
            $valueDate = $given === '' ? now() : \App\Support\StatementDate::parse($line['value_date']);

            if ($valueDate === null) {
                $result['skipped']++;

                continue;
            }

            $values = [
                'agent_id' => $agentId,
                // 🔴 Which of OUR accounts the line came from. A statement imported against the wrong account
                // reconciles money that arrived somewhere else (user, 2026-09-21).
                'bank_account_id' => $bankAccountId,
                'provider' => $provider,
                'amount' => $amount,
                'value_date' => $valueDate->toDateString(),
                'direction' => ($line['direction'] ?? 'credit') === 'debit' ? 'debit' : 'credit',
                'narration' => $line['narration'] ?? null,
                'counterparty' => $line['counterparty'] ?? null,
                'reference' => $reference,
                'currency' => strtoupper((string) ($line['currency'] ?? 'INR')),
            ];

            // 🔴 A repeat is the same reference on the same branch's same account — never another tenant's line. A CSV
            // reference like `123456` is only unique inside one bank's statement, so matching it globally would
            // overwrite (and move) somebody else's transaction.
            $existing = BankTransaction::withoutTenantScope()
                ->where('agent_id', $agentId)
                ->where(fn ($q) => $bankAccountId === null
                    ? $q->whereNull('bank_account_id')
                    : $q->where('bank_account_id', $bankAccountId))
                ->where(fn ($q) => $q->where('reference', $reference)->orWhere('plaid_transaction_id', $reference))
                ->first();

            if ($existing !== null) {
                // The same line again: refresh what the bank now says about it, never the match somebody made.
                $existing->forceFill($values)->save();
                $result['repeated']++;

                continue;
            }

            // `plaid_transaction_id` is UNIQUE across all tenants: when another branch or account already holds this
            // reference, this line's key is namespaced by its own branch and account so both can exist.
            $key = BankTransaction::withoutTenantScope()->where('plaid_transaction_id', $reference)->exists()
                ? "{$reference}#{$agentId}-" . ($bankAccountId ?? 0)
                : $reference;

            BankTransaction::withoutTenantScope()->create($values + [
                'plaid_transaction_id' => $key,
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
        $sheet = \App\Support\CsvSheet::read($csv);
        $rows = $sheet->rows;
        $column = fn (array $row, array $names) => $sheet->column($row, $names);
        $money = fn (string $value) => \App\Support\CsvSheet::money($value);

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
