<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\AgeingService;
use App\Services\GstReturnService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Closing the month, as one checklist instead of five screens (guide §11.2, user 2026-09-21).
 *
 * 🔴 **Closing a month was not an action anywhere.** It was five separate screens — the unposted queue, the GST
 * register, the e-invoice list, periods, reports — and nothing told you whether you were done. Six numbered
 * steps, each with a count, and the close refuses while the one step that must be clear is not.
 *
 * 🔴 **BLOCKING AND ADVISORY ARE DIFFERENT, and saying so is the point.** Only "everything posted" stops a close,
 * because that is the ledger's own rule: a period closed with documents outside it is a month whose reports are
 * wrong. An unbilled shipment or a missing IRN is a *warning* — both are routinely and legitimately still open on
 * the day a month closes, and a checklist that refused for them would be one nobody could ever satisfy, which is
 * a checklist people learn to override.
 *
 * ⚠️ Every step counts what its own screen counts; this controller answers "are you done", not "what is it".
 */
class CloseMonthController extends Controller
{
    /** How many rows of detail a step carries. It is a checklist — the full list lives on that step's screen. */
    private const PREVIEW = 20;

    public function __construct(private readonly GstReturnService $returns) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $periods = DB::table('accounting_periods')->whereIn('agent_id', $branches->pluck('id'))
            ->orderByDesc('start_date')
            ->get(['id', 'agent_id', 'period_name', 'start_date', 'end_date', 'status',
                   'closed_at', 'reopened_at', 'reopen_reason']);

        // 🔴 The open month if there is one, otherwise the LAST ONE CLOSED. Defaulting only to an open period
        // meant that closing the final month left this page with nothing selected — and therefore no way to
        // reopen it, which put the one-way door straight back where reopening was meant to remove it.
        $period = $request->filled('period_id')
            ? $periods->firstWhere('id', $request->integer('period_id'))
            : ($periods->firstWhere('status', 'open')
                ?? $periods->where('status', 'closed')->sortByDesc('start_date')->first());

        if ($period === null) {
            return response()->json([
                'period' => null, 'periods' => $periods, 'branches' => $branches, 'steps' => [],
                'note' => 'No accounting period has been opened yet.',
            ]);
        }

        $steps = [
            $this->billed($period),
            $this->costed($period),
            $this->posted($period),
            $this->gst($period),
        ];

        // ⚠️ `can_close` is the BLOCKING steps only — see the class docblock.
        $blocked = collect($steps)->first(fn ($s) => $s['blocking'] && ! $s['clear']);

        // 🔴 Only the LATEST closed month of the branch may be reopened — see `reopenPeriod()`.
        $laterClosed = $period->status !== 'open'
            ? DB::table('accounting_periods')->where('agent_id', $period->agent_id)->where('status', 'closed')
                ->where('start_date', '>', $period->start_date)->orderBy('start_date')->value('period_name')
            : null;

        $steps[] = [
            'step' => 5, 'key' => 'close', 'label' => 'Close the period', 'blocking' => false,
            'clear' => $period->status !== 'open', 'count' => 0,
            'can_reopen' => $period->status !== 'open' && $laterClosed === null,
            'reopen_blocked_by' => $laterClosed,
            'reopened' => $period->reopened_at !== null,
            'note' => $period->status !== 'open'
                ? $period->period_name . ' is closed. Nothing can post into it.'
                    . ($laterClosed !== null
                        ? ' To reopen it, reopen ' . $laterClosed . ' first.'
                        : ' It can be reopened if something dated inside it still has to be posted.')
                : ($period->reopened_at !== null
                    ? $period->period_name . ' was reopened: ' . $period->reopen_reason
                    : ($blocked
                        ? 'Clear step ' . $blocked['step'] . ' first — ' . strtolower($blocked['label'])
                        : 'Ready to close. Nothing will be able to post into it afterwards.')),
        ];

        $steps[] = $this->statements($period);

        return response()->json([
            'period' => $period,
            'periods' => $periods,
            'branches' => $branches,
            'steps' => $steps,
            'can_close' => $period->status === 'open' && $blocked === null,
            'blocked_by' => $blocked['label'] ?? null,
        ]);
    }

    /**
     * ① Shipments that finished in this period and were never billed.
     *
     * ⚠️ A DRAFT is not billed. It carries no number, the client has never seen it, and nothing has reached the
     * ledger — counting it as billed is how a month closes with revenue missing.
     */
    private function billed(object $period): array
    {
        $rows = DB::table('jobs as j')
            ->leftJoin('customers as c', 'c.id', '=', 'j.customer_id')
            ->where('j.agent_id', $period->agent_id)
            ->whereNull('j.deleted_at')
            ->whereBetween(DB::raw('DATE(COALESCE(j.completed_at, j.created_at))'), [$period->start_date, $period->end_date])
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('accounts_invoices as i')
                ->whereColumn('i.job_id', 'j.id')->whereNotIn('i.status', ['draft', 'void']))
            ->orderBy('j.completed_at')
            ->limit(self::PREVIEW)
            ->get(['j.id', 'j.execution_job_no as job_no', 'j.transport_mode as mode',
                   'j.completed_at', 'c.name as customer']);

        $count = DB::table('jobs as j')->where('j.agent_id', $period->agent_id)->whereNull('j.deleted_at')
            ->whereBetween(DB::raw('DATE(COALESCE(j.completed_at, j.created_at))'), [$period->start_date, $period->end_date])
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('accounts_invoices as i')
                ->whereColumn('i.job_id', 'j.id')->whereNotIn('i.status', ['draft', 'void']))
            ->count();

        return [
            'step' => 1, 'key' => 'billed', 'label' => 'Everything billed?', 'blocking' => false,
            'count' => $count, 'clear' => $count === 0, 'rows' => $rows,
            'note' => $count === 0
                ? 'Every shipment that finished in this period has been billed.'
                : $count . ' shipment(s) finished in this period and have not been billed. A draft is not billed.',
            'to' => ['path' => '/money-in', 'query' => ['stage' => 'to_bill']],
        ];
    }

    /**
     * ② Shipments billed in this period with no cost booked against them.
     *
     * 🔴 Their margin reads as pure profit, and the month's P&L is overstated by exactly the missing cost.
     */
    private function costed(object $period): array
    {
        $base = DB::table('accounts_invoices as i')
            ->join('jobs as j', 'j.id', '=', 'i.job_id')
            ->leftJoin('customers as c', 'c.id', '=', 'i.customer_id')
            ->where('i.agent_id', $period->agent_id)
            ->where('i.type', 'invoice')->whereNotIn('i.status', ['draft', 'void'])
            ->whereBetween('i.document_date', [$period->start_date, $period->end_date])
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('accounts_purchase_vouchers as v')
                ->whereColumn('v.job_id', 'i.job_id'));

        $count = (clone $base)->distinct()->count('i.job_id');
        $rows = (clone $base)->orderByDesc('i.grand_total')->limit(self::PREVIEW)
            ->get(['i.id', 'i.invoice_no', 'i.grand_total', 'j.execution_job_no as job_no', 'c.name as customer']);

        return [
            'step' => 2, 'key' => 'costed', 'label' => 'Everything costed?', 'blocking' => false,
            'count' => $count, 'clear' => $count === 0, 'rows' => $rows,
            'note' => $count === 0
                ? 'Every shipment billed in this period has its cost booked.'
                : $count . ' billed shipment(s) have no cost booked, so this month\'s profit is overstated by whatever they cost.',
            'to' => ['path' => '/profitability'],
        ];
    }

    /**
     * ③ Documents raised and not in the ledger. **The one step that blocks.**
     *
     * 🔴 This is the ledger's own rule and the server enforces it on `closePeriod()` independently — the screen
     * shows it early so the refusal is never a surprise at the end of a month-end run.
     */
    private function posted(object $period): array
    {
        $rows = DB::table('unposted_transactions_queue as q')
            ->leftJoin('accounts_invoices as i', fn ($j) => $j->on('i.id', '=', 'q.source_id')->where('q.source_type', '=', 'invoice'))
            ->leftJoin('accounts_purchase_vouchers as v', fn ($j) => $j->on('v.id', '=', 'q.source_id')->where('q.source_type', '=', 'purchase_voucher'))
            ->where('q.agent_id', $period->agent_id)
            ->whereBetween(DB::raw('COALESCE(i.document_date, v.document_date, DATE(q.created_at))'),
                [$period->start_date, $period->end_date])
            ->orderBy('q.created_at')
            ->limit(self::PREVIEW)
            ->get(['q.id', 'q.source_type', 'q.net_amount', 'i.invoice_no', 'i.status as invoice_status', 'v.voucher_no']);

        $count = DB::table('unposted_transactions_queue as q')
            ->leftJoin('accounts_invoices as i', fn ($j) => $j->on('i.id', '=', 'q.source_id')->where('q.source_type', '=', 'invoice'))
            ->leftJoin('accounts_purchase_vouchers as v', fn ($j) => $j->on('v.id', '=', 'q.source_id')->where('q.source_type', '=', 'purchase_voucher'))
            ->where('q.agent_id', $period->agent_id)
            ->whereBetween(DB::raw('COALESCE(i.document_date, v.document_date, DATE(q.created_at))'),
                [$period->start_date, $period->end_date])
            ->count();

        return [
            'step' => 3, 'key' => 'posted', 'label' => 'Everything posted?', 'blocking' => true,
            'count' => $count, 'clear' => $count === 0,
            'rows' => $rows->map(fn ($r) => (array) $r + [
                'number' => $r->invoice_no ?? $r->voucher_no,
                'waiting_for' => $r->invoice_status === 'draft' ? 'Finalize it first' : 'Ready to post',
            ]),
            'note' => $count === 0
                ? 'Every document raised in this period is in the ledger.'
                : $count . ' document(s) are outside the ledger. The period cannot close until they are posted or voided.',
            'to' => ['path' => '/financials', 'query' => ['view' => 'unposted']],
        ];
    }

    /** ④ What the tax authority is owed, and which documents the portal has not acknowledged. */
    private function gst(object $period): array
    {
        // A client with no GSTIN is a B2C sale and never goes to the portal at all.
        $base = DB::table('accounts_invoices as i')
            ->join('customers as c', 'c.id', '=', 'i.customer_id')
            ->where('i.agent_id', $period->agent_id)
            ->whereIn('i.type', ['invoice', 'debit_note', 'credit_note'])
            ->whereNotIn('i.status', ['draft', 'void'])
            ->whereBetween('i.document_date', [$period->start_date, $period->end_date])
            ->whereNotNull('c.gst_no')->where('c.gst_no', '!=', '')
            ->whereNull('i.irn');

        $count = (clone $base)->count();
        $rows = (clone $base)->orderBy('i.document_date')->limit(self::PREVIEW)
            ->get(['i.id', 'i.invoice_no', 'i.type', 'i.document_date', 'i.grand_total', 'c.name as customer', 'c.gst_no']);

        // What the register says was charged in this period — the figure GSTR-1 is filed from.
        $tax = DB::table('accounts_invoices')->where('agent_id', $period->agent_id)
            ->whereNotIn('status', ['draft', 'void'])
            ->whereBetween('document_date', [$period->start_date, $period->end_date])
            ->selectRaw('COALESCE(SUM(CASE WHEN type = ? THEN -1 ELSE 1 END * tax_amount), 0) AS tax', ['credit_note'])
            ->value('tax');

        // ── The return itself (user, 2026-09-22) ────────────────────────────
        // 🔴 A GST return is filed PER CALENDAR MONTH and this period spans a financial year, so the step
        // shows ONE month and says which. Offering the year as one return would be offering something that
        // cannot be filed.
        //
        // 🔴 **THIS MONTH, not the period's last one.** Found by walking it: defaulting to the month the
        // period ENDS in put December on the step all through September — an empty return sitting under
        // "₹6,75,934 of tax was charged", which reads as a contradiction and is really just a month that has
        // not happened yet. The month being filed is the one the desk is working in.
        $month = now()->format('Y-m');
        $firstMonth = date('Y-m', strtotime((string) $period->start_date));
        $lastMonth = date('Y-m', strtotime((string) $period->end_date));

        if ($month < $firstMonth || $month > $lastMonth) {
            // A period wholly in the past (or the future) files its own last month, not today's.
            $month = $lastMonth;
        }
        [$from, $to] = GstReturnService::month($month);
        $gstin = DB::table('agents_info')->where('id', $period->agent_id)->value('gst_no');
        $return = $gstin === null || $gstin === ''
            ? null
            : $this->returns->gstr1((int) $period->agent_id, $from, $to);

        $months = (int) round((strtotime((string) $period->end_date) - strtotime((string) $period->start_date)) / 2629800);

        return [
            'step' => 4, 'key' => 'gst', 'label' => 'GST', 'blocking' => false,
            'count' => $count, 'clear' => $count === 0, 'rows' => $rows,
            'tax_charged' => round((float) $tax, 2),
            'note' => '₹' . number_format((float) $tax, 2) . ' of tax was charged in this period. '
                . ($count === 0
                    ? 'Every B2B document has been registered.'
                    : $count . ' document(s) have not been through the invoice registration portal.'),
            'to' => ['path' => '/billing', 'query' => ['view' => 'einvoice']],
            // 🔴 Without a GSTIN of our own nothing can be filed at all, and the fix is one field in
            // Settings → Finance — so the step says that instead of showing an empty return.
            'gstin' => $gstin ?: null,
            'return_month' => $month,
            // The months this branch actually raised documents in, so the picker offers months that exist.
            'return_months' => DB::table('accounts_invoices')
                ->where('agent_id', $period->agent_id)->where('status', '!=', 'draft')
                ->whereBetween('document_date', [$period->start_date, $period->end_date])
                ->selectRaw("DATE_FORMAT(document_date, '%Y-%m') AS month, COUNT(*) AS documents")
                ->groupBy('month')->orderByDesc('month')->get(),
            // ⚠️ Said out loud when the period is longer than the month being filed, because otherwise the
            // figures on this step look like they disagree with the tax charged just above them.
            'return_is_one_month_of' => $months > 1 ? $months : null,
            'return' => $return === null ? null : [
                'documents' => $return['totals']['documents'],
                'taxable_value' => $return['totals']['taxable_value'],
                'cgst' => $return['totals']['cgst'],
                'sgst' => $return['totals']['sgst'],
                'igst' => $return['totals']['igst'],
                'tax' => $return['totals']['tax'],
                'not_filed' => count($return['exceptions']),
                'not_filed_value' => round(array_sum(array_column($return['exceptions'], 'taxable_value')), 2),
                'warnings' => count($return['warnings']),
            ],
        ];
    }

    /** ⑥ What the ledger proves for the period — and whether it proves anything at all. */
    private function statements(object $period): array
    {
        $balances = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.accounting_period_id', $period->id)
            ->selectRaw('c.account_code, COALESCE(SUM(l.debit_amount),0) AS dr, COALESCE(SUM(l.credit_amount),0) AS cr')
            ->groupBy('c.account_code')->get();

        $debits = round($balances->sum('dr'), 2);
        $credits = round($balances->sum('cr'), 2);
        $signed = fn (string $prefix, bool $creditNatured) => round($balances
            ->filter(fn ($b) => str_starts_with($b->account_code, $prefix))
            ->sum(fn ($b) => $creditNatured ? $b->cr - $b->dr : $b->dr - $b->cr), 2);

        $revenue = $signed('4', true);
        $expense = $signed('5', false);

        return [
            'step' => 6, 'key' => 'statements', 'label' => 'The statements', 'blocking' => false,
            'count' => 0, 'clear' => $debits === $credits && $balances->isNotEmpty(),
            'balanced' => $debits === $credits,
            'figures' => ['revenue' => $revenue, 'expense' => $expense, 'net' => round($revenue - $expense, 2),
                          'debits' => $debits, 'credits' => $credits],
            // 🔴 `balanced` IS the report: if it is false the ledger has a one-sided entry and nothing else from
            // this period can be trusted.
            'note' => $balances->isEmpty()
                ? 'Nothing has been posted into this period yet.'
                : ($debits === $credits
                    ? 'The ledger balances. Revenue ₹' . number_format($revenue, 2) . ' less cost ₹'
                        . number_format($expense, 2) . ' leaves ₹' . number_format($revenue - $expense, 2) . '.'
                    : 'THE LEDGER DOES NOT BALANCE — ₹' . number_format(abs($debits - $credits), 2)
                        . ' out. No report from this period can be trusted until it is found.'),
            'to' => ['path' => '/financials', 'query' => ['view' => 'reports']],
        ];
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
