<?php

namespace App\Services\Accounts;

use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * A client's payment report card for one month (GAPS #443) — worked out, never guessed.
 *
 * 🔴 **"On time" means by the bill's own DUE DATE**, and "paid" means the day the receipt that settled it is dated —
 * not the day a bank line was imported (the snapshot engine's DSO reads that, and a statement imported a week late
 * made a punctual client look a week slow). A bill with no due date is due on its date plus the client's terms.
 *
 * 🔴 **Unpaid bills count, aged to month end.** Leaving them out would make a client who never pays look like the best
 * payer (PRD §7.3.4 F, the survivorship trap).
 *
 * The window is the bills that fell due in the last `window_months` months, so a 15-, 30- or 60-day client is judged
 * on enough bills, and the card still moves when their habit changes. Every figure is in rupees at the bill's own rate.
 */
class ClientPaymentGrader
{
    /** The client's own bills — what they are asked to pay by a date. Credit notes are not a bill to be late on. */
    public const BILLS = ['invoice', 'debit_note', 'consol_invoice'];

    /** Issued and not cancelled. */
    public const ISSUED = ['finalized', 'sent', 'partially_paid', 'paid'];

    /**
     * @return array the card's figures, ready for `client_payment_reports` (without ids or the Jev reading)
     */
    public function grade(object $customer, Carbon $month, ?int $previousScore = null): array
    {
        $end = $month->copy()->endOfMonth()->startOfDay();
        $windowStart = $month->copy()->startOfMonth()->subMonths((int) config('client_grades.window_months') - 1);
        $terms = (int) ($customer->payment_terms_days ?: config('client_grades.default_terms_days'));

        $bills = DB::table('accounts_invoices')->where('customer_id', $customer->id)
            ->whereIn('type', self::BILLS)->whereIn('status', self::ISSUED)
            ->where('document_date', '<=', $end)
            ->get(['id', 'document_date', 'due_date', 'grand_total', 'exchange_rate', 'status']);

        [$settled, $undated] = $this->settledOn($bills, $end);
        // A bill marked paid with no dated evidence of WHEN is not judged at all: its lateness is not measured, and a
        // figure nobody measured is left out — never counted as on time, never as late.
        $bills = $bills->reject(fn ($b) => isset($undated[$b->id]));
        $due = fn ($b) => Carbon::parse($b->due_date ?: Carbon::parse($b->document_date)->addDays($terms))->startOfDay();
        $inr = fn ($b) => round((float) $b->grand_total * (float) ($b->exchange_rate ?: 1), 2);

        // The bills that fell due in the window, each with how late it was paid — or is, if still unpaid.
        $judged = $bills->filter(fn ($b) => $due($b)->between($windowStart, $end))->map(function ($b) use ($settled, $due, $inr, $end) {
            $paidOn = $settled[$b->id] ?? null;
            $late = $paidOn !== null ? max(0, $due($b)->diffInDays($paidOn, false)) : $due($b)->diffInDays($end);

            return ['value' => $inr($b), 'late' => $late];
        });

        // Everything unpaid past its due date at month end, whenever it fell due.
        $overdue = $bills->filter(fn ($b) => ! isset($settled[$b->id]) && $due($b)->lt($end));

        $dueValue = round($judged->sum('value'), 2);
        $onTimeValue = round($judged->where('late', 0)->sum('value'), 2);
        $share = $dueValue > 0 ? round($onTimeValue / $dueValue, 4) : null;
        $avgLate = $dueValue > 0 ? round($judged->sum(fn ($j) => $j['late'] * $j['value']) / $dueValue, 1) : null;
        $oldest = $overdue->isEmpty() ? null : $overdue->max(fn ($b) => $due($b)->diffInDays($end));

        $score = $judged->count() >= (int) config('client_grades.min_bills') && $share !== null
            ? $this->score($share, (float) $avgLate, $oldest) : null;

        return [
            'month' => $month->copy()->startOfMonth()->toDateString(),
            'terms_days' => $terms,
            'bills_due' => $judged->count(),
            'due_value' => $dueValue,
            'on_time_value' => $onTimeValue,
            'on_time_share' => $share,
            'avg_days_late' => $avgLate,
            'overdue_value' => round($overdue->sum($inr), 2),
            'oldest_overdue_days' => $oldest,
            'score' => $score,
            'grade' => $score === null ? null : $this->letter($score),
            'trend' => $score === null || $previousScore === null ? null
                : ($score - $previousScore >= (int) config('client_grades.trend_points') ? 'better'
                    : ($previousScore - $score >= (int) config('client_grades.trend_points') ? 'worse' : 'steady')),
        ];
    }

    /** score = 100 × on-time share − average days late (capped) − a penalty when a bill is very old. */
    public function score(float $share, float $avgLate, ?int $oldestOverdue): int
    {
        $score = 100 * $share
            - min($avgLate, (float) config('client_grades.late_days_cap'))
            - ($oldestOverdue !== null && $oldestOverdue > (int) config('client_grades.very_old_days') ? (int) config('client_grades.very_old_penalty') : 0);

        return (int) max(0, min(100, round($score)));
    }

    public function letter(int $score): string
    {
        foreach (config('client_grades.grades') as $letter => $floor) {
            if ($score >= $floor) {
                return $letter;
            }
        }

        return 'D';
    }

    /**
     * The day each bill was fully paid, by month end: the date of the posted receipt that completed it. A bill marked
     * paid with no receipt on file (paid before receipts existed) takes its matched bank line's value date; with
     * neither, WHEN it was paid is unknown and it is returned as undated — its last update is when somebody edited
     * it, not when the client paid, and reading it as the payment date made punctual clients look months late.
     *
     * Shared with the sales engine's DSO (GAPS #450), so "when did they pay" has one answer.
     *
     * @return array{0: array<int, Carbon>, 1: array<int, true>} bill id => settled on; bill id => undated
     */
    public function settledOn(Collection $bills, Carbon $end): array
    {
        $allocations = DB::table('accounts_receipt_allocations as a')
            ->join('accounts_receipts as r', 'r.id', '=', 'a.receipt_id')
            ->whereIn('a.invoice_id', $bills->pluck('id'))->where('r.is_posted', true)->where('r.receipt_date', '<=', $end)
            ->orderBy('r.receipt_date')
            ->get(['a.invoice_id', 'a.amount', 'a.invoice_amount', 'r.receipt_date'])->groupBy('invoice_id');

        $banked = DB::table('bank_transactions')->whereIn('matched_invoice_id', $bills->where('status', 'paid')->pluck('id'))
            ->groupBy('matched_invoice_id')->selectRaw('matched_invoice_id, MAX(value_date) AS paid_on')->pluck('paid_on', 'matched_invoice_id');

        $settled = [];
        $undated = [];

        foreach ($bills as $bill) {
            $running = 0.0;
            foreach ($allocations[$bill->id] ?? [] as $a) {
                $running += (float) ($a->invoice_amount ?? $a->amount);
                if ($running >= (float) $bill->grand_total - 1) {   // within a rupee: rounding is not a balance
                    $settled[$bill->id] = Carbon::parse($a->receipt_date)->startOfDay();
                    break;
                }
            }

            if (! isset($settled[$bill->id]) && $bill->status === 'paid' && ! isset($allocations[$bill->id])) {
                if (! isset($banked[$bill->id])) {
                    $undated[$bill->id] = true;
                } elseif (($on = Carbon::parse($banked[$bill->id])->startOfDay())->lte($end)) {
                    $settled[$bill->id] = $on;
                }
            }
        }

        return [$settled, $undated];
    }
}
