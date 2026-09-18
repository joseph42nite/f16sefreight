<?php

namespace App\Services\Bank;

use App\Support\AwbNumber;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * A supplier's statement against our own vouchers (user, 2026-09-19) — an airline's CASS, a trucker's month, a
 * broker's or a warehouse's, all the same question: does what they billed agree with what we booked?
 *
 * 🔴 **Their line is matched to a SHIPMENT, not to a voucher directly.** An airline bills an AWB, a trucker bills a
 * docket against a job; the shipment is the only thing both sides name. Our figure is then everything that shipment's
 * vouchers hold **for that supplier** — a trucker's line must never be compared against the airline's costs.
 *
 * ⚠️ Nothing here posts, pays or edits a voucher. It states the difference; a person decides what it means.
 */
class VendorStatements
{
    /** Where a line ended up after comparing. */
    public const STATES = [
        'agreed' => 'Agrees with our voucher',
        'different' => 'They billed a different amount',
        'not_booked' => 'We have no cost booked for this',
        'unmatched' => 'We cannot find the shipment',
    ];

    /** A rupee either way is rounding, not a dispute. */
    private const TOLERANCE = 1.00;

    /**
     * Import one supplier's statement for one period, replacing that period if it is sent again.
     *
     * @param  array<int, array{reference?: ?string, description?: ?string, charge_date?: ?string,
     *                          chargeable_weight?: float|string|null, rate?: float|string|null, amount: float|string}>  $lines
     */
    public function import(int $agentId, int $vendorId, string $period, array $lines, array $meta = [], ?int $by = null): int
    {
        $vendorType = DB::table('partners')->where('id', $vendorId)->value('partner_type') ?? 'vendor';

        return DB::transaction(function () use ($agentId, $vendorId, $vendorType, $period, $lines, $meta, $by) {
            $existing = DB::table('vendor_statements')
                ->where('agent_id', $agentId)->where('vendor_id', $vendorId)->where('period', $period)->value('id');

            // A period sent again REPLACES it: a statement is the supplier's whole word for that month, and keeping
            // both copies would double what they appear to be owed.
            if ($existing !== null) {
                DB::table('vendor_statement_lines')->where('vendor_statement_id', $existing)->delete();
                DB::table('vendor_statements')->where('id', $existing)->delete();
            }

            $statementId = DB::table('vendor_statements')->insertGetId([
                'agent_id' => $agentId, 'vendor_id' => $vendorId, 'vendor_type' => $vendorType, 'period' => $period,
                'statement_no' => $meta['statement_no'] ?? null,
                'statement_date' => isset($meta['statement_date']) ? Carbon::parse($meta['statement_date'])->toDateString() : null,
                'currency' => strtoupper((string) ($meta['currency'] ?? 'INR')),
                'their_total' => round(collect($lines)->sum(fn ($l) => (float) ($l['amount'] ?? 0)), 2),
                'status' => 'imported', 'imported_by' => $by, 'created_at' => now(), 'updated_at' => now(),
            ]);

            foreach ($lines as $line) {
                DB::table('vendor_statement_lines')->insert([
                    'vendor_statement_id' => $statementId,
                    'reference' => trim((string) ($line['reference'] ?? '')) ?: null,
                    'description' => $line['description'] ?? null,
                    'charge_date' => isset($line['charge_date']) && $line['charge_date'] ? Carbon::parse($line['charge_date'])->toDateString() : null,
                    'chargeable_weight' => $line['chargeable_weight'] ?? null,
                    'rate' => $line['rate'] ?? null,
                    'their_amount' => round((float) ($line['amount'] ?? 0), 2),
                    'state' => 'unmatched',
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }

            $this->compare($statementId);

            return $statementId;
        });
    }

    /**
     * Compare every line against our own vouchers. Run at import, and again whenever somebody asks — the vouchers
     * move, and a line that read "we have no cost booked" last week may be booked today.
     */
    public function compare(int $statementId): array
    {
        $statement = DB::table('vendor_statements')->where('id', $statementId)->first();

        if ($statement === null) {
            return [];
        }

        $counts = array_fill_keys(array_keys(self::STATES), 0);

        foreach (DB::table('vendor_statement_lines')->where('vendor_statement_id', $statementId)->get() as $line) {
            $jobId = $this->shipmentFor($statement->agent_id, (string) $line->reference);
            $ours = $jobId === null ? null : $this->ourCost((int) $jobId, (int) $statement->vendor_id);
            $voucherId = $jobId === null ? null : DB::table('accounts_purchase_vouchers')
                ->where('job_id', $jobId)->where('vendor_id', $statement->vendor_id)->value('id');

            $state = match (true) {
                $jobId === null => 'unmatched',
                $ours === null => 'not_booked',
                abs($ours - (float) $line->their_amount) <= self::TOLERANCE => 'agreed',
                default => 'different',
            };

            DB::table('vendor_statement_lines')->where('id', $line->id)->update([
                'matched_job_id' => $jobId,
                'matched_voucher_id' => $voucherId,
                'our_amount' => $ours,
                'difference' => $ours === null ? null : round((float) $line->their_amount - $ours, 2),
                'state' => $state,
                'updated_at' => now(),
            ]);

            $counts[$state]++;
        }

        return $counts;
    }

    /**
     * The shipment a reference names: an AWB number in any shape an airline writes it, or our own job number.
     *
     * ⚠️ Nothing is guessed from an amount. Two shipments to the same airline in one month routinely cost the same,
     * and a line matched by price alone attributes a cost to the wrong job.
     */
    private function shipmentFor(int $agentId, string $reference): ?int
    {
        $reference = trim($reference);

        if ($reference === '') {
            return null;
        }

        $awb = AwbNumber::normalise($reference);

        if ($awb !== null) {
            return DB::table('jobs')->where('agent_id', $agentId)->where('awb_number', $awb)->value('id');
        }

        return DB::table('jobs')->where('agent_id', $agentId)
            ->where(fn ($q) => $q->where('execution_job_no', $reference)->orWhere('awb_number', $reference))
            ->value('id');
    }

    /** What this shipment's vouchers hold for THIS supplier, or null when nothing is booked for them. */
    private function ourCost(int $jobId, int $vendorId): ?float
    {
        $total = DB::table('accounts_purchase_items as i')
            ->join('accounts_purchase_vouchers as v', 'v.id', '=', 'i.purchase_voucher_id')
            ->where('v.job_id', $jobId)->where('v.vendor_id', $vendorId)
            ->sum('i.net_amount');

        return DB::table('accounts_purchase_vouchers')->where('job_id', $jobId)->where('vendor_id', $vendorId)->exists()
            ? round((float) $total, 2)
            : null;
    }

    /** A supplier's CSV as lines: reference, description, weight, rate, amount — whatever their spelling. */
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
        $money = fn (string $v) => (float) str_replace([',', '₹', ' '], '', $v);

        return array_map(fn ($row) => [
            'reference' => $column($row, ['awb', 'awb no', 'awb number', 'reference', 'ref', 'job', 'job no', 'docket']),
            'description' => $column($row, ['description', 'particulars', 'charge', 'narration']),
            'charge_date' => $column($row, ['date', 'flight date', 'charge date']) ?: null,
            'chargeable_weight' => $money($column($row, ['chargeable weight', 'cw', 'weight'])) ?: null,
            'rate' => $money($column($row, ['rate'])) ?: null,
            'amount' => $money($column($row, ['amount', 'total', 'net', 'charges'])),
        ], $rows);
    }
}
