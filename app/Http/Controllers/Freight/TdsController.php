<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\TdsService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * The TDS register, both directions (user, 2026-09-22).
 *
 * 🔴 **THE TWO DIRECTIONS ARE NEVER NETTED.** Tax we deducted from vendors is a LIABILITY owed to the
 * government by the 7th of next month; tax clients deducted from us is an ASSET we claim on our own return.
 * They are filed on different forms, they sit on opposite sides of the balance sheet, and a screen that showed
 * one figure for "TDS" would report a company holding nothing when it is holding both.
 *
 * ⚠️ **The window is a QUARTER of the Indian financial year, which starts in April.** Form 26Q is quarterly;
 * the deposit is monthly. Both are shown, because the desk has to act on the monthly one and file the
 * quarterly one.
 *
 * 🔒 `viewFinancials`: accounts, and the Boss read-only.
 */
class TdsController extends Controller
{
    public function __construct(private readonly TdsService $tds) {}

    /** What was deducted, by whom, in one quarter. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        [$branch, $financialYear, $quarter, $error] = $this->window($request);

        if ($error !== null) {
            return $error;
        }

        $entries = $this->entries($branch->id, $financialYear, $quarter);

        return response()->json([
            'branch' => $branch,
            'branches' => $this->branches(),
            'financial_year' => $financialYear,
            'quarter' => $quarter,
            'quarters' => $this->quarters($branch->id),
            // Owed to the government: what we withheld and have not yet deposited.
            'payable' => $this->side($entries, TdsService::OUTWARD),
            // Ours to claim: what clients withheld from us, to be reconciled against Form 26AS.
            'receivable' => $this->side($entries, TdsService::INWARD),
            // 🔴 What the ledger says, beside what the register says. They are written in the same
            // transaction, so a difference is not a timing lag — it is a posting that went somewhere else.
            'ledger' => $this->ledgerBalances($branch->id),
            // ⚠️ Vendors being paid with no section set: every one is a deduction not being made.
            'unclassified_vendors' => $this->unclassifiedVendors($branch->id, $financialYear),
            'deposit_due' => $this->depositDue($branch->id),
        ]);
    }

    /**
     * Form 26Q, as a CSV.
     *
     * ⚠️ **This is the deductee-wise annexure, not the full return.** The portal's own RPU takes a fixed-width
     * file with a challan section that needs the BSR code, the challan serial and the deposit date of money
     * that has not been paid yet — facts that exist only after the challan is filed at the bank, and nowhere
     * in this system. What is produced is the half we hold: every deductee, their PAN, the section, the rate,
     * the base and the tax. That is what goes into the RPU by hand or by import, and it is the half that takes
     * the time.
     */
    public function form26q(Request $request): Response|JsonResponse
    {
        $this->authorize('viewFinancials');

        [$branch, $financialYear, $quarter, $error] = $this->window($request);

        if ($error !== null) {
            return $error;
        }

        $entries = $this->entries($branch->id, $financialYear, $quarter)
            ->where('direction', TdsService::OUTWARD);

        $csv = fopen('php://temp', 'r+');

        fputcsv($csv, ['Form 26Q — deductee annexure', $branch->agent_name,
                       $financialYear, $quarter, 'Generated ' . now()->toDateString()]);
        fputcsv($csv, []);
        fputcsv($csv, ['Deductee', 'PAN', 'Section', 'Rate %', 'Amount paid or credited', 'TDS deducted',
                       'Date of payment', 'Document', 'Reason PAN is absent']);

        foreach ($entries as $entry) {
            fputcsv($csv, [
                $entry->counterparty, $entry->counterparty_pan ?: '', $entry->section, $entry->rate,
                $entry->base_amount, $entry->tds_amount, $entry->deducted_on, $entry->document_no,
                // 🔴 A missing PAN is not a blank field on this form: it is why the rate is 20% under
                // s.206AA, and the return is rejected without it flagged. Said in the file, not assumed.
                $entry->counterparty_pan ? '' : 'No PAN on record — deducted at the s.206AA rate',
            ]);
        }

        fputcsv($csv, []);
        fputcsv($csv, ['TOTAL', '', '', '', round($entries->sum('base_amount'), 2),
                       round($entries->sum('tds_amount'), 2), '', '', '']);

        rewind($csv);

        return response((string) stream_get_contents($csv), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="Form26Q-' . $branch->branch_code . '-'
                . $financialYear . '-' . $quarter . '.csv"',
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────

    /** Every entry of one quarter, with the counterparty named and the document it came from. */
    private function entries(int $agentId, string $financialYear, string $quarter)
    {
        return DB::table('tds_entries as t')
            ->leftJoin('partners as p', fn ($j) => $j->on('p.id', '=', 't.counterparty_id')
                ->where('t.counterparty_type', '=', 'partner'))
            ->leftJoin('customers as c', fn ($j) => $j->on('c.id', '=', 't.counterparty_id')
                ->where('t.counterparty_type', '=', 'customer'))
            ->leftJoin('accounts_payments as pay', fn ($j) => $j->on('pay.id', '=', 't.source_id')
                ->where('t.source_type', '=', 'payment'))
            ->leftJoin('accounts_receipts as rec', fn ($j) => $j->on('rec.id', '=', 't.source_id')
                ->where('t.source_type', '=', 'receipt'))
            ->where('t.agent_id', $agentId)
            ->where('t.financial_year', $financialYear)
            ->where('t.quarter', $quarter)
            ->orderBy('t.deducted_on')->orderBy('t.id')
            ->get([
                't.id', 't.direction', 't.section', 't.rate', 't.base_amount', 't.tds_amount',
                't.deducted_on', 't.counterparty_type', 't.counterparty_id', 't.counterparty_pan',
                't.source_type', 't.source_id',
                DB::raw('COALESCE(p.name, c.name) AS counterparty'),
                DB::raw('COALESCE(pay.payment_no, rec.receipt_no) AS document_no'),
            ]);
    }

    /** One direction: the rows, the totals, and the split by section that the return is filed by. */
    private function side($entries, string $direction): array
    {
        $rows = $entries->where('direction', $direction)->values();

        return [
            'rows' => $rows,
            'total' => round($rows->sum('tds_amount'), 2),
            'base' => round($rows->sum('base_amount'), 2),
            'deductions' => $rows->count(),
            'by_section' => $rows->groupBy('section')->map(fn ($group, $section) => [
                'section' => $section,
                'deductions' => $group->count(),
                'base' => round($group->sum('base_amount'), 2),
                'tds' => round($group->sum('tds_amount'), 2),
            ])->values(),
            // 🔴 Counted separately, because a deductee with no PAN is what gets a 26Q return REJECTED —
            // and it is invisible in any total, being the same rupees as everybody else's.
            'without_pan' => $rows->filter(fn ($r) => empty($r->counterparty_pan))->count(),
        ];
    }

    /** What `2300-TDS-Payable` and `1400-TDS-Receivable` actually hold, for comparison with the register. */
    private function ledgerBalances(int $agentId): array
    {
        $balances = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.agent_id', $agentId)
            ->whereIn('c.account_code', [TdsService::PAYABLE['code'], TdsService::RECEIVABLE['code']])
            ->groupBy('c.account_code')
            ->get(['c.account_code',
                   DB::raw('COALESCE(SUM(l.credit_amount) - SUM(l.debit_amount), 0) AS net_credit')])
            ->keyBy('account_code');

        return [
            // A liability is credit-natured; an asset is the other way round, so its sign is flipped rather
            // than both being reported as "the balance" and one of them reading negative on screen.
            'payable' => round((float) ($balances[TdsService::PAYABLE['code']]->net_credit ?? 0), 2),
            'receivable' => round(-1 * (float) ($balances[TdsService::RECEIVABLE['code']]->net_credit ?? 0), 2),
        ];
    }

    /**
     * Vendors paid this year with no TDS section set.
     *
     * ⚠️ Not an error, and not blocking — plenty of payees are legitimately outside TDS. But a trucker with
     * no section is a deduction never made, and the only moment anybody would notice is a notice.
     */
    private function unclassifiedVendors(int $agentId, string $financialYear)
    {
        $startYear = (int) substr($financialYear, 0, 4);

        return DB::table('accounts_payments as p')
            ->join('partners as v', 'v.id', '=', 'p.payee_id')
            ->where('p.agent_id', $agentId)->where('p.payee_type', 'partner')
            ->whereBetween('p.payment_date', [$startYear . '-04-01', ($startYear + 1) . '-03-31'])
            ->where(fn ($q) => $q->whereNull('v.tds_section')->orWhere('v.tds_section', ''))
            ->groupBy('v.id', 'v.name')
            ->orderByDesc(DB::raw('SUM(p.amount)'))
            ->get(['v.id', 'v.name', DB::raw('COUNT(*) AS payments'), DB::raw('ROUND(SUM(p.amount), 2) AS paid')]);
    }

    /**
     * What was deducted last month and is due to be deposited.
     *
     * 🔴 **The 7th of the following month**, and the 30th of April for anything deducted in March. That March
     * exception is the one everybody misses, so it is computed rather than described.
     */
    private function depositDue(int $agentId): array
    {
        $lastMonth = now()->subMonthNoOverflow();

        $amount = round((float) DB::table('tds_entries')
            ->where('agent_id', $agentId)->where('direction', TdsService::OUTWARD)
            ->whereBetween('deducted_on', [$lastMonth->copy()->startOfMonth()->toDateString(),
                                           $lastMonth->copy()->endOfMonth()->toDateString()])
            ->sum('tds_amount'), 2);

        $due = (int) $lastMonth->format('n') === 3
            ? $lastMonth->copy()->addMonthNoOverflow()->setDay(30)   // March deducts, April 30th deposits
            : $lastMonth->copy()->addMonthNoOverflow()->setDay(7);

        return [
            'month' => $lastMonth->format('Y-m'),
            'amount' => $amount,
            'due_on' => $due->toDateString(),
            'overdue' => $amount > 0 && now()->gt($due),
        ];
    }

    /** The quarters there is anything to file for, newest first. */
    private function quarters(int $agentId)
    {
        return DB::table('tds_entries')->where('agent_id', $agentId)
            ->groupBy('financial_year', 'quarter')
            ->orderByDesc('financial_year')->orderByDesc('quarter')
            ->get(['financial_year', 'quarter', DB::raw('COUNT(*) AS deductions')]);
    }

    /** @return array{0: ?object, 1: ?string, 2: ?string, 3: ?JsonResponse} */
    private function window(Request $request): array
    {
        $branches = $this->branches();

        $branch = $request->filled('agent_id')
            ? $branches->firstWhere('id', $request->integer('agent_id'))
            : ($branches->firstWhere('id', UserContext::for(auth()->user())->agentId) ?? $branches->first());

        if ($branch === null) {
            return [null, null, null, response()->json([
                'error' => 'That branch is not one of this company\'s.', 'reason' => 'branch_not_found',
            ], 404)];
        }

        [$thisYear, $thisQuarter] = TdsService::period(now()->toDateString());

        $financialYear = $request->string('financial_year')->toString() ?: $thisYear;
        $quarter = strtoupper($request->string('quarter')->toString()) ?: $thisQuarter;

        if (! preg_match('/^\d{4}-\d{2}$/', $financialYear) || ! preg_match('/^Q[1-4]$/', $quarter)) {
            return [null, null, null, response()->json([
                'error' => 'A TDS return is filed for one quarter. Give the year as 2026-27 and the quarter as Q1 to Q4.',
                'reason' => 'quarter_invalid',
            ], 422)];
        }

        return [$branch, $financialYear, $quarter, null];
    }

    private function branches()
    {
        return DB::table('agents_info')
            ->where('company_id', UserContext::for(auth()->user())->companyId)
            ->orderBy('agent_name')
            ->get(['id', 'agent_name', 'branch_code']);
    }
}
