<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\AgeingService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * The accounts desk's home — what to do today (guide §11.2, user 2026-09-20).
 *
 * 🔴 **Every card is a COUNT AND A FIGURE, and every card is a link.** "4 shipments · ₹4,82,000" tells you both
 * how much work it is and whether it matters; either number alone does not. A card that is not a link is a fact
 * nobody can act on, which is what a dashboard becomes when it is built for looking at rather than for working.
 *
 * ⚠️ **Nothing here is a new source of truth.** Each figure is the same query its own screen runs, so the home
 * can never disagree with the register it links to — a dashboard that computes its own version of "overdue" is
 * the fastest way to lose the desk's trust in both.
 */
class AccountsTodayController extends Controller
{
    public function __construct(private readonly AgeingService $ageing) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $ids = $branches->pluck('id')->all();
        $picked = $request->integer('agent_id') ?: null;
        $scope = $picked ? [$picked] : $ids;

        return response()->json([
            'cards' => $this->cards($scope),
            'exceptions' => $this->exceptions($scope),
            'branches' => $branches,
            'as_of' => now()->toDateString(),
        ]);
    }

    /** The four things a day starts with, in the order money moves. */
    private function cards(array $scope): array
    {
        // ① Pricing has handed these over and nobody has billed them.
        $toBill = DB::table('accounts_invoices')->whereIn('agent_id', $scope)
            ->whereNotNull('sent_to_accounts_at')->where('status', 'draft')
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(grand_total), 0) AS total')->first();

        // ④ Money sitting in the bank that nobody has placed against an invoice.
        $toPlace = DB::table('bank_transactions')->whereIn('agent_id', $scope)
            ->where('direction', 'credit')->where('reconciliation_status', 'unreconciled')
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(amount), 0) AS total')->first();

        // ⑤ What is late, from the one place that knows how ageing is counted.
        $parties = $this->ageing->byParty($scope);
        $overdue = $parties->filter(fn ($p) => $p['overdue'] > 0);

        // ③ of the close: raised and not in the ledger.
        $unposted = DB::table('unposted_transactions_queue')->whereIn('agent_id', $scope)
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(net_amount), 0) AS total')->first();

        return [
            [
                'key' => 'to_bill', 'label' => 'To bill', 'count' => (int) $toBill->n,
                'unit' => 'shipment', 'amount' => round((float) $toBill->total, 2),
                'note' => 'Cost sheets pricing has handed over.',
                'to' => ['path' => '/money-in', 'query' => ['stage' => 'to_bill']],
            ],
            [
                'key' => 'to_place', 'label' => 'Money to place', 'count' => (int) $toPlace->n,
                'unit' => 'payment', 'amount' => round((float) $toPlace->total, 2),
                'note' => 'Arrived in the bank, not yet against an invoice.',
                'to' => ['path' => '/money-in', 'query' => ['stage' => 'money_in']],
            ],
            [
                'key' => 'overdue', 'label' => 'Overdue', 'count' => $overdue->count(),
                'unit' => 'client', 'amount' => round($overdue->sum('overdue'), 2),
                'note' => 'Past its due date and still owed.',
                'tone' => $overdue->sum('overdue') > 0 ? 'warning' : null,
                'to' => ['path' => '/money-in', 'query' => ['stage' => 'overdue']],
            ],
            [
                'key' => 'unposted', 'label' => 'Not posted', 'count' => (int) $unposted->n,
                'unit' => 'document', 'amount' => round((float) $unposted->total, 2),
                'note' => 'Raised, and not yet in the ledger.',
                'to' => ['path' => '/financials', 'query' => ['view' => 'unposted']],
            ],
        ];
    }

    /**
     * The things that need a decision rather than a day's work.
     *
     * ⚠️ Only what is TRUE today. An exceptions list that carries standing conditions stops being read within a
     * week, so each of these clears itself when the thing is dealt with.
     */
    private function exceptions(array $scope): array
    {
        $out = [];

        // 🔴 Nothing can post into a month that is not open, and that is invisible until a post is refused.
        $open = DB::table('accounting_periods')->whereIn('agent_id', $scope)->where('status', 'open')
            ->whereDate('start_date', '<=', now())->whereDate('end_date', '>=', now())->get();

        if ($open->isEmpty()) {
            $out[] = ['kind' => 'no_period', 'tone' => 'critical',
                'text' => 'No accounting period is open for today, so nothing can be posted.',
                'to' => ['path' => '/financials', 'query' => ['view' => 'periods']]];
        }

        foreach ($open as $period) {
            $days = now()->startOfDay()->diffInDays(\Illuminate\Support\Carbon::parse($period->end_date), false);

            if ($days >= 0 && $days <= 7) {
                $out[] = ['kind' => 'period_closing', 'tone' => 'warning',
                    'text' => $period->period_name . ' ends in ' . ($days === 0 ? 'today' : $days . ' day(s)') . '.',
                    'to' => ['path' => '/financials', 'query' => ['view' => 'periods']]];
            }
        }

        // Clients owing more than their limit — the gate that stops cargo, seen before it stops it.
        $held = DB::table('customers as c')
            ->join('accounts_invoices as i', 'i.customer_id', '=', 'c.id')
            ->where('c.company_id', UserContext::for(auth()->user())->companyId)
            ->whereNotNull('c.credit_limit')
            ->whereIn('i.agent_id', $scope)
            ->whereIn('i.status', AgeingService::OWED)
            ->groupBy('c.id', 'c.name', 'c.credit_limit')
            ->havingRaw('SUM(CASE WHEN i.type = ? THEN -1 ELSE 1 END * (i.grand_total - i.amount_paid)) > c.credit_limit', ['credit_note'])
            ->get(['c.id', 'c.name']);

        if ($held->isNotEmpty()) {
            $out[] = ['kind' => 'credit_hold', 'tone' => 'critical',
                'text' => $held->count() . ' client(s) are over their credit limit: ' . $held->pluck('name')->take(3)->join(', ')
                    . ($held->count() > 3 ? ' and others' : '') . '.',
                'to' => ['path' => '/clients-partners']];
        }

        // A supplier says we owe something our vouchers do not agree with.
        $disputed = DB::table('vendor_statement_lines as l')
            ->join('vendor_statements as s', 's.id', '=', 'l.vendor_statement_id')
            ->whereIn('s.agent_id', $scope)->whereIn('l.state', ['different', 'not_booked'])
            ->count();

        if ($disputed > 0) {
            $out[] = ['kind' => 'statement_difference', 'tone' => 'warning',
                'text' => $disputed . ' supplier statement line(s) do not agree with our vouchers.',
                'to' => ['path' => '/financials', 'query' => ['view' => 'vendors']]];
        }

        // 🔴 Billed with nothing costed: the margin on those shipments is not real.
        $uncosted = DB::table('accounts_invoices as i')
            ->whereIn('i.agent_id', $scope)->whereNotIn('i.status', ['draft', 'void'])->where('i.type', 'invoice')
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('accounts_purchase_vouchers as v')
                ->whereColumn('v.job_id', 'i.job_id'))
            ->distinct()->count('i.job_id');

        if ($uncosted > 0) {
            $out[] = ['kind' => 'no_cost_booked', 'tone' => 'warning',
                'text' => $uncosted . ' billed shipment(s) have no cost booked, so their margin reads far too high.',
                'to' => ['path' => '/profitability']];
        }

        // A draft nobody has finalized is revenue nobody has billed. PRD §6.2 calls seven days the warning line.
        $stale = DB::table('accounts_invoices')->whereIn('agent_id', $scope)
            ->where('status', 'draft')->whereNotNull('sent_to_accounts_at')
            ->whereDate('sent_to_accounts_at', '<', now()->subDays(7))->count();

        if ($stale > 0) {
            $out[] = ['kind' => 'stale_draft', 'tone' => 'warning',
                'text' => $stale . ' cost sheet(s) have been waiting to be billed for over a week.',
                'to' => ['path' => '/money-in', 'query' => ['stage' => 'to_bill']]];
        }

        return $out;
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
