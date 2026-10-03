<?php

namespace App\Services\Accounts;

use App\Services\BellNotificationService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * The accounts desk's alerts (owner, 2026-10-03 — GAPS #448): a bank account nobody connected, a supplier bill due
 * tomorrow and unpaid, a client's payment that arrived short and was left owed, a client who slipped a grade.
 *
 * Two readers, one set of queries, so the bell can never say something Today does not:
 * - **Today** shows each while it is TRUE, and it clears itself when dealt with (`forToday`).
 * - **The bell** gets ONE card per event, to accounts and the Boss — and, for a client's money, that client's
 *   salesperson (PRD §6.9: sales see payment alerts for their own clients only). `ring()` runs hourly; the card's
 *   `key` is what stops it ringing twice.
 *
 * ⚠️ A bank account with no feed is Today only — it is a standing setup step, not an event, and a bell card about it
 * every hour would teach the desk to stop reading the bell.
 */
class AccountsAlerts
{
    public const BELL_TYPE = 'AccountsAlert';

    /** A short match older than this when first seen is history, not news — the first run must not ring for all of it. */
    private const SHORT_LOOKBACK_DAYS = 2;

    /** @return array<int, array{kind:string,tone:string,text:string,to:array}> */
    public function forToday(array $scope): array
    {
        $out = [];

        $accounts = $this->unconnectedAccounts($scope);
        $active = DB::table('bank_accounts')->whereIn('agent_id', $scope)->where('is_active', true)->count();

        if ($active === 0) {
            $out[] = ['kind' => 'no_bank_account', 'tone' => 'warning',
                'text' => 'No bank account is set up, so nothing that arrives or leaves can be matched. Add one and connect it.',
                'to' => ['path' => '/settings/finance']];
        } elseif ($accounts->isNotEmpty()) {
            $out[] = ['kind' => 'bank_not_connected', 'tone' => 'warning',
                'text' => $accounts->pluck('name')->take(3)->join(', ') . ($accounts->count() > 3 ? ' and others' : '')
                    . ' ' . ($accounts->count() === 1 ? 'is' : 'are') . ' not connected — connect with Setu, or upload a statement.',
                'to' => ['path' => '/settings/finance']];
        }

        $due = $this->dueTomorrow($scope);

        if ($due->isNotEmpty()) {
            $out[] = ['kind' => 'supplier_due_tomorrow', 'tone' => 'warning',
                'text' => $this->dueText($due),
                'to' => ['path' => '/money-out', 'query' => ['stage' => 'due']]];
        }

        $short = $this->shortStillOwed($scope);

        if ($short->isNotEmpty()) {
            $out[] = ['kind' => 'paid_short', 'tone' => 'warning',
                'text' => $short->count() . ' client bill(s) were paid short from the bank and are still owed: '
                    . $short->pluck('client')->unique()->take(3)->join(', ') . '.',
                'to' => ['path' => '/money-in', 'query' => ['stage' => 'issued']]];
        }

        $slipped = $this->slipped($scope);

        if ($slipped->isNotEmpty()) {
            $out[] = ['kind' => 'grade_slipped', 'tone' => 'warning',
                'text' => $slipped->map(fn ($s) => "{$s->client} slipped from {$s->was} to {$s->now}")->take(3)->join('; ')
                    . ($slipped->count() > 3 ? '; and others' : '') . '.',
                'to' => ['path' => '/clients-partners']];
        }

        return $out;
    }

    /** One bell card per new event, for every Command company. @return int cards written */
    public function ring(): int
    {
        $written = 0;

        foreach (DB::table('companies')->where('tier', 'command')->pluck('id') as $companyId) {
            $scope = DB::table('agents_info')->where('company_id', $companyId)->pluck('id')->all();

            if ($scope === []) {
                continue;
            }

            $desk = $this->desk($scope);
            $due = $this->dueTomorrow($scope);

            // One card for the day's bills, not one per bill: a run is made per day, and thirty cards is noise.
            if ($due->isNotEmpty()) {
                $written += $this->send($desk, $scope[0], 'due:' . now()->addDay()->toDateString(), [
                    'kind' => 'supplier_due_tomorrow', 'text' => $this->dueText($due),
                    'to' => ['path' => '/money-out', 'query' => ['stage' => 'due']],
                ]);
            }

            foreach ($this->shortStillOwed($scope, now()->subDays(self::SHORT_LOOKBACK_DAYS)) as $s) {
                $text = "{$s->client} paid {$s->invoice_no} short — {$s->currency} " . number_format($s->owed, 2) . ' is still owed.';
                $written += $this->send($desk, $s->agent_id, 'short:' . $s->receipt_id, [
                    'kind' => 'paid_short', 'text' => $text, 'to' => ['path' => '/money-in', 'query' => ['stage' => 'issued']],
                ]);
                $written += $this->toSales($s->sales_id, $scope, $s->agent_id, 'short:' . $s->receipt_id, $text);
            }

            foreach ($this->slipped($scope) as $s) {
                $text = "{$s->client} slipped from {$s->was} to {$s->now} on paying on time.";
                $key = 'grade:' . $s->customer_id . ':' . $s->month;
                $written += $this->send($desk, $scope[0], $key, [
                    'kind' => 'grade_slipped', 'text' => $text, 'to' => ['path' => '/clients-partners'],
                ]);
                $written += $this->toSales($s->sales_id, $scope, $scope[0], $key, $text);
            }
        }

        return $written;
    }

    /** Active accounts with no live feed and not one statement line — nothing will ever be matched in them. */
    public function unconnectedAccounts(array $scope): Collection
    {
        return DB::table('bank_accounts as a')
            ->whereIn('a.agent_id', $scope)->where('a.is_active', true)
            ->where(fn ($q) => $q->whereNull('a.feed_status')->orWhere('a.feed_status', '!=', 'active'))
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('bank_transactions as t')->whereColumn('t.bank_account_id', 'a.id'))
            ->orderBy('a.name')->get(['a.id', 'a.name']);
    }

    /**
     * Supplier vouchers whose OWN due date is tomorrow, with money left on them.
     *
     * 🔴 Only a recorded due date. Money out ④ stands the document date in for a missing one, which makes such a
     * voucher already overdue — it never "falls due tomorrow", and ringing for it would be a date nobody set.
     */
    private function dueTomorrow(array $scope): Collection
    {
        return DB::table('accounts_purchase_vouchers as v')
            ->join('partners as p', 'p.id', '=', 'v.vendor_id')
            ->leftJoinSub(
                DB::table('accounts_purchase_items')->selectRaw('purchase_voucher_id, SUM(net_amount) AS gross')
                    ->groupBy('purchase_voucher_id'),
                'i', 'i.purchase_voucher_id', '=', 'v.id'
            )
            ->whereIn('v.agent_id', $scope)->where('v.status', '!=', 'void')
            ->whereDate('v.due_date', now()->addDay()->toDateString())
            // The same "still owed" as Money out ④, so the alert and the stage it links to agree.
            ->whereRaw('COALESCE(i.gross, 0) - v.amount_paid > 0.009')
            ->get(['v.id', 'p.name as supplier', DB::raw('COALESCE(i.gross, 0) - v.amount_paid AS owed')]);
    }

    private function dueText(Collection $due): string
    {
        return $due->count() . ' supplier bill(s) fall due tomorrow, ₹' . number_format($due->sum('owed'), 2) . ' unpaid: '
            . $due->pluck('supplier')->unique()->take(3)->join(', ') . '.';
    }

    /**
     * A client's money matched from the bank for less than the bill, with the gap left OWED (no resolution — not
     * written off, not a discount, not TDS), and the bill still not paid. Clears itself when the rest arrives.
     */
    private function shortStillOwed(array $scope, ?Carbon $since = null): Collection
    {
        return DB::table('accounts_receipt_allocations as a')
            ->join('accounts_receipts as r', 'r.id', '=', 'a.receipt_id')
            ->join('accounts_invoices as i', 'i.id', '=', 'a.invoice_id')
            ->join('customers as c', 'c.id', '=', 'i.customer_id')
            ->whereIn('r.agent_id', $scope)
            ->whereNotNull('r.bank_transaction_id')
            ->whereNull('a.resolution')
            ->where('i.status', 'partially_paid')
            ->when($since, fn ($q) => $q->where('r.created_at', '>=', $since))
            ->orderBy('r.id')
            ->get(['r.id as receipt_id', 'r.agent_id', 'i.invoice_no', 'i.currency', 'c.name as client', 'c.sales_id',
                   DB::raw('i.grand_total - i.amount_paid AS owed')]);
    }

    /** Clients whose latest card is a worse LETTER than the month before. Clears when the next card is built. */
    private function slipped(array $scope): Collection
    {
        $companyId = DB::table('agents_info')->whereIn('id', $scope)->value('company_id');
        $latest = DB::table('client_payment_reports')->where('company_id', $companyId)->max('month');

        if ($latest === null) {
            return collect();
        }

        $order = array_keys(config('client_grades.grades'));   // best first
        $before = Carbon::parse($latest)->subMonth()->toDateString();

        return DB::table('client_payment_reports as now')
            ->join('client_payment_reports as was', fn ($j) => $j->on('was.customer_id', '=', 'now.customer_id')->where('was.month', $before))
            ->join('customers as c', 'c.id', '=', 'now.customer_id')
            ->where('now.company_id', $companyId)->where('now.month', $latest)
            // A client of another branch is not this desk's when Today is narrowed to one branch.
            ->where(fn ($q) => $q->whereNull('c.branch_id')->orWhereIn('c.branch_id', $scope))
            ->whereNotNull('now.grade')->whereNotNull('was.grade')
            ->get(['now.customer_id', 'now.month', 'c.name as client', 'c.sales_id', 'now.grade as now', 'was.grade as was'])
            ->filter(fn ($r) => array_search($r->now, $order, true) > array_search($r->was, $order, true))
            ->values();
    }

    /** Accounts and the Boss of these branches' company — the people Today is for. */
    private function desk(array $scope): Collection
    {
        return DB::table('users')->whereIn('branch_name', $scope)->where('is_active', true)
            ->whereIn('designation', ['accounts', 'boss'])->pluck('id');
    }

    /** The client's own salesperson, when they have one in this company and they are not already on the desk. */
    private function toSales(?int $salesId, array $scope, int $agentId, string $key, string $text): int
    {
        if ($salesId === null) {
            return 0;
        }

        $sales = DB::table('users')->where('id', $salesId)->whereIn('branch_name', $scope)->where('is_active', true)
            ->where('designation', 'sales')->pluck('id');

        // Sales cannot open Money in; the client's own page is where they can act.
        return $this->send($sales, $agentId, $key, ['kind' => 'client_payment', 'text' => $text, 'to' => ['path' => '/clients-partners']]);
    }

    private function send(Collection $users, int $agentId, string $key, array $data): int
    {
        $sent = 0;

        foreach ($users as $userId) {
            $already = DB::table('notifications')->where('type', self::BELL_TYPE)
                ->where('notifiable_type', 'App\\User')->where('notifiable_id', $userId)
                ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.key')) = ?", [$key])->exists();

            if (! $already) {
                app(BellNotificationService::class)->notify($agentId, (int) $userId, self::BELL_TYPE, $data + ['key' => $key]);
                $sent++;
            }
        }

        return $sent;
    }
}
