<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * The sales cockpit — guide §5.5, PRD.md §7.3/§7.4.
 *
 * 🔴 **MARGIN AND BUY-SIDE COST NEVER REACH THIS CONTROLLER'S RESPONSES, AT ANY TIER.**
 * PRD.md §7.2: gross margin is "computed for pricing, accounts and the boss P&L; never
 * surfaced in the sales view." The engine tables carry `revenue`, and revenue is the
 * top line — the spread stays with pricing, accounts and the Boss. Nothing here reads
 * `accounts_purchase_items` at all, which is the strongest form of that guarantee:
 * the column cannot leak from a query that never touches it.
 *
 * ═══ THE TIER SPLIT IS THE PRODUCT, NOT A FILTER ════════════════════════════
 *   Tactical  branch aggregate within the active mode. NO client attribution.
 *   Command   the same numbers partitioned by customers.sales_id = me, plus the
 *             client book, cadence, payment behaviour and the action queue.
 *
 * PRD.md §7.3.8 puts it exactly: *Tactical says the branch's FRA lane is softening.
 * Command says which three accounts caused it and what to say to them.* A Tactical rep
 * seeing client names is not a small leak — that gap IS the upsell, and closing it by
 * accident removes the reason to pay for Command.
 *
 * ⚠️ **Everything is read from the engine tables.** Never `jobs`, never `enquiries`.
 */
class SalesDashboardController extends Controller
{
    /** Past this, the dashboard must say so rather than present stale numbers as live. */
    private const STALE_AFTER_MINUTES = 60;

    /** What each period covers, in the reader's words — one window for every chart on the page. */
    private const WINDOWS = [
        'this_month' => 'this month so far',
        'day' => 'the last 30 days',
        'month' => 'the last 12 months',
        'year' => 'the last 2 years',
    ];

    /** Which funnel view answers a window: within a month the interesting grain is the day. */
    private const FUNNEL_VIEWS = [
        'this_month' => 'dsr_funnel_view',
        'day' => 'dsr_funnel_view',
        'month' => 'msr_funnel_view',
        'year' => 'ysr_funnel_view',
    ];

    /**
     * The cockpit.
     *
     * Shape differs by tier on purpose — a Tactical response that merely omits values
     * would still tell a rep that per-client data exists and is being withheld.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $this->authorize('viewSales');

        $context = UserContext::for(auth()->user());
        $mode = app()->bound('active_portal_scope') ? app('active_portal_scope') : null;

        $isCommand = $context->tier === 'command';
        $ids = $this->branchIds($request, $context);

        $payload = [
            'tier'      => $context->tier,
            'mode'      => $mode,
            'scope'     => $isCommand ? 'my_book' : 'branch',
            'branch'    => $this->branchScoreboard($ids, $mode, $isCommand),
            'staleness' => $this->staleness($ids, $mode),
        ];

        // The Boss sees every branch, and may narrow to one (user, 2026-09-16: "the boss sees everything").
        if ($context->designation === 'boss') {
            $payload['branch_options'] = DB::table('agents_info')->where('company_id', $context->companyId)
                ->orderBy('agent_name')->get(['id', 'agent_name as name']);
            $payload['branch_picked'] = count($ids) === 1 && $request->filled('branch') ? $ids[0] : null;
        }

        if ($isCommand) {
            // 🔒 Command scoping is `customers.sales_id = me` — a rep sees THEIR book,
            // not the branch's. A boss is not sales-scoped and sees every branch in view.
            $payload['book'] = $this->clientBook($context, $mode, $ids);
        }

        return response()->json($payload);
    }

    /**
     * Today's Actions — the ranked top 5, rendered ABOVE the charts (PRD.md §7.4).
     *
     * 🔴 `narrated_text` MAY BE NULL and that is a first-class state, not an error.
     * Layer 3 (the model) is disposable: if the AI server is down the row still carries
     * every number and merely loses its prose. An action that disappears because a
     * narration failed is a lost opportunity nobody knows about.
     */
    public function actions(Request $request): JsonResponse
    {
        $this->authorize('viewSales');

        $context = UserContext::for(auth()->user());
        $mode = app()->bound('active_portal_scope') ? app('active_portal_scope') : null;

        $query = DB::table('sales_action_queue')
            ->where('status', 'open')
            // ⚠️ INTERNAL findings only. A client-audience row carries a drafted email
            // and belongs to the outreach surface, which has its own consent rules.
            ->where('audience', 'internal');

        if ($mode !== null) {
            $query->where('transport_mode', $mode);
        }

        if ($context->tier === 'command' && $context->designation === 'sales') {
            // The rep's own clients, whichever branch manages them (a client's managing branch can be another).
            $query->where('sales_id', $context->userId);
        } else {
            $query->whereIn('agent_id', $this->branchIds($request, $context));
            // Tactical has no client attribution, so only branch-level actions
            // (customer_id IS NULL) are meaningful — a per-client action would name
            // the client the tier is not entitled to see.
            $query->whereNull('customer_id');
        }

        $actions = $query
            ->orderByDesc('priority_score')
            ->limit((int) $request->integer('limit', 5))
            ->get([
                'id', 'action_type', 'priority_score', 'impact_value',
                'customer_id', 'transport_mode', 'fact_packet',
                'narrated_text', 'narrated_at', 'expires_at',
            ]);

        return response()->json([
            'actions' => $actions->map(fn ($a) => [
                'id'             => $a->id,
                'action_type'    => $a->action_type,
                'priority_score' => (float) $a->priority_score,
                'impact_value'   => $a->impact_value === null ? null : (float) $a->impact_value,
                'transport_mode' => $a->transport_mode,
                // The deterministic inputs travel WITH the prose, so a rep can check
                // the claim rather than trust it.
                'facts'          => json_decode($a->fact_packet, true),
                'narrated_text'  => $a->narrated_text,
                'narrated_at'    => $a->narrated_at,
                'expires_at'     => $a->expires_at,
            ]),
        ]);
    }

    /**
     * My Accounts — Command only.
     *
     * 🔒 Returns 403 rather than an empty list below Command. An empty grid reads as
     * "you have no clients", which is a different and demoralising claim from "this
     * view needs an upgrade" — and it is the frontend's cue to render the teaser.
     */
    public function accounts(Request $request): JsonResponse
    {
        $this->authorize('viewSales');

        $context = UserContext::for(auth()->user());

        if ($context->tier !== 'command') {
            return response()->json([
                'error'  => 'The client book is a Command-tier view. Tactical reports at branch level, '
                          . 'without client attribution.',
                'reason' => 'tier',
                'required_tier' => 'command',
            ], 403);
        }

        $mode = app()->bound('active_portal_scope') ? app('active_portal_scope') : null;

        return response()->json(['accounts' => $this->clientBook($context, $mode, $this->branchIds($request, $context), 200)]);
    }

    /**
     * The three chart series — guide Step 6 item 7, PRD.md §7.4.
     *
     * 🔴 **EVERY SERIES COMES FROM A PRE-COMPUTED TABLE OR A VIEW.** Tonnage and lanes
     * from `customer_lane_stats`, the funnel from `*_funnel_view`. Nothing here touches
     * `jobs` — PRD.md §2242, and the rule the whole engine exists to honour.
     *
     * ⚠️ **The same components serve both tiers; only the SCOPE changes.** Tactical
     * charts the branch, Command charts the rep's own book. Two sets of chart code
     * would drift, and the tier difference is a WHERE clause, not a different picture.
     */
    public function charts(Request $request): JsonResponse
    {
        $this->authorize('viewSales');

        $context = UserContext::for(auth()->user());
        $mode = app()->bound('active_portal_scope') ? app('active_portal_scope') : null;

        $grain = $request->string('grain', 'month')->toString();
        $grain = isset(self::WINDOWS[$grain]) ? $grain : 'month';

        // 🔴 ONE WINDOW FOR EVERY CHART (user, 2026-09-16). The period says how far back to look, so tonnage, lanes
        // and win/loss all describe the same stretch of time rather than three different ones.
        // ⚠️ Lane statistics are monthly, so a 30-day window reads from the start of the month it began in — a month
        // cannot be cut in half after the fact.
        $from = $this->windowStart($grain);
        $ids = $this->branchIds($request, $context);

        return response()->json([
            'grain'   => $grain,
            'window'  => ['grain' => $grain, 'from' => $from->toDateString(), 'label' => self::WINDOWS[$grain]],
            'scope'   => $context->tier === 'command' ? 'my_book' : 'branch',
            'tonnage' => $this->tonnageSeries($context, $mode, $from, $ids),
            'lanes'   => $this->laneSeries($context, $mode, $from, $ids),
            'funnel'  => $this->funnelSeries($mode, $grain, $from, $ids, $request),
        ]);
    }

    /**
     * Cross-branch, cross-mode comparison — the Boss view. PRD.md §7.4.
     *
     * 🔒 `viewSales` plus a Boss-only check: this is the one screen that deliberately
     * crosses BOTH partitions the rest of the product maintains. A rep is scoped to
     * their book and a portal is scoped to its mode; the Boss is scoped to neither,
     * because "air is soft this month but sea is carrying it" is a sentence only
     * somebody seeing both can say.
     *
     * ⚠️ Still TENANT-bound. `admin.` has no PORTAL scope; it has never had a licence
     * to read another company's branches, and conflating the two is how a client's
     * Boss would end up reading a competitor's books (CONTEXT.md §6b).
     */
    public function branches(): JsonResponse
    {
        $this->authorize('viewSales');

        $context = UserContext::for(auth()->user());

        if ($context->designation !== 'boss') {
            return response()->json([
                'error'  => 'The cross-branch view is the Boss dashboard. A rep sees their own book.',
                'reason' => 'designation',
            ], 403);
        }

        $branchIds = DB::table('agents_info')->where('company_id', $context->companyId)->pluck('id');
        $latest = DB::table('customer_performance_snapshots')
            ->whereIn('agent_id', $branchIds)->max('snapshot_date');

        if ($latest === null) {
            return response()->json([
                'as_of'    => null,
                'branches' => [],
                'reason'   => 'never_computed',
            ]);
        }

        $rows = DB::table('customer_performance_snapshots as s')
            ->join('agents_info as a', 'a.id', '=', 's.agent_id')
            ->whereIn('s.agent_id', $branchIds)
            ->where('s.snapshot_date', $latest)
            ->selectRaw('s.agent_id, a.agent_name, a.branch_code, s.transport_mode,
                         SUM(s.tonnage_mtd) AS tonnage_mtd,
                         SUM(s.tonnage_ytd) AS tonnage_ytd,
                         SUM(s.shipment_count_mtd) AS shipments_mtd,
                         SUM(s.revenue_mtd) AS revenue_mtd,
                         SUM(s.outstanding_60_plus) AS overdue_60_plus,
                         COUNT(*) AS clients')
            ->groupBy('s.agent_id', 'a.agent_name', 'a.branch_code', 's.transport_mode')
            ->orderBy('a.branch_code')
            ->get();

        // Shaped branch-major with a cell per mode, because the question the screen
        // answers is "how is Chennai doing, air versus sea" — not "list every pair".
        $branches = [];
        foreach ($rows as $r) {
            $branches[$r->agent_id] ??= [
                'agent_id' => $r->agent_id,
                'name'     => $r->agent_name,
                'code'     => $r->branch_code,
                'modes'    => [],
                'totals'   => ['tonnage_ytd' => 0.0, 'revenue_mtd' => 0.0, 'overdue_60_plus' => 0.0],
            ];

            $branches[$r->agent_id]['modes'][$r->transport_mode] = [
                'tonnage_mtd'     => round((float) $r->tonnage_mtd, 3),
                'tonnage_ytd'     => round((float) $r->tonnage_ytd, 3),
                'shipments_mtd'   => (int) $r->shipments_mtd,
                'revenue_mtd'     => round((float) $r->revenue_mtd, 2),
                'overdue_60_plus' => round((float) $r->overdue_60_plus, 2),
                'clients'         => (int) $r->clients,
            ];

            $branches[$r->agent_id]['totals']['tonnage_ytd'] += (float) $r->tonnage_ytd;
            $branches[$r->agent_id]['totals']['revenue_mtd'] += (float) $r->revenue_mtd;
            $branches[$r->agent_id]['totals']['overdue_60_plus'] += (float) $r->overdue_60_plus;
        }

        return response()->json([
            'as_of'    => $latest,
            'modes'    => $rows->pluck('transport_mode')->unique()->values(),
            'branches' => array_values(array_map(function ($b) {
                $b['totals'] = array_map(fn ($v) => round($v, 2), $b['totals']);
                return $b;
            }, $branches)),
        ]);
    }

    /**
     * How each person is doing — the Boss's staff view (user, 2026-09-16: "how each staff is performing").
     *
     * Over the same period window as the charts, for the branches in view:
     *   - pricing:    enquiries they own — raised, converted, lost, still open, and conversion (converted ÷ raised,
     *                 the funnel's own formula)
     *   - operations: shipments assigned to them — completed, still in progress
     *   - sales:      their book — clients, tonnage and shipments (and invoiced revenue on Command), how many of their
     *                 clients are at risk (gone quiet or shipping 25% less), and their branch's progress on this
     *                 month's targets
     */
    public function staff(Request $request): JsonResponse
    {
        $this->authorize('viewSales');

        $context = UserContext::for(auth()->user());
        abort_unless($context->designation === 'boss', 403, 'Staff performance is the Boss view.');

        $grain = isset(self::WINDOWS[$request->string('grain')->toString()]) ? $request->string('grain')->toString() : 'month';
        $from = $this->windowStart($grain);
        $ids = $this->branchIds($request, $context);
        $withMoney = $context->tier === 'command';

        $people = DB::table('users as u')->join('agents_info as a', 'a.id', '=', 'u.branch_name')
            ->whereIn('u.branch_name', $ids)->where('u.is_active', 1)
            ->whereIn('u.designation', ['pricing', 'operations', 'sales'])
            ->orderBy('u.name')
            ->get(['u.id', 'u.name', 'u.designation', 'u.branch_name as agent_id', 'a.agent_name as branch']);
        $of = fn (string $role) => $people->where('designation', $role)->keyBy('id');

        // ── Pricing ────────────────────────────────────────────────────────
        $pricing = $of('pricing');
        $enquiries = DB::table('enquiries')->whereIn('pricing_id', $pricing->keys())
            ->where('created_at', '>=', $from)->whereNull('deleted_at')
            ->groupBy('pricing_id')
            ->selectRaw("pricing_id, COUNT(*) AS raised, SUM(status = 'converted') AS converted, SUM(status = 'lost') AS lost,
                         SUM(status IN ('new', 'quoted', 'awaiting_client')) AS open")
            ->get()->keyBy('pricing_id');

        // ── Operations ─────────────────────────────────────────────────────
        $operations = $of('operations');
        $jobs = DB::table('jobs')->whereIn('ops_id', $operations->keys())
            ->where('created_at', '>=', $from)->whereNull('deleted_at')
            ->groupBy('ops_id')
            ->selectRaw("ops_id, COUNT(*) AS assigned, SUM(status = 'Completed') AS completed,
                         SUM(status NOT IN ('Completed', 'Cancelled')) AS in_progress")
            ->get()->keyBy('ops_id');

        // ── Sales ──────────────────────────────────────────────────────────
        $sales = $of('sales');
        $clients = DB::table('customers')->whereIn('sales_id', $sales->keys())
            ->groupBy('sales_id')->selectRaw('sales_id, COUNT(*) AS clients')->pluck('clients', 'sales_id');
        $volume = DB::table('customer_lane_stats as l')->join('customers as c', 'c.id', '=', 'l.customer_id')
            ->whereIn('c.sales_id', $sales->keys())
            ->where('l.period_month', '>=', $from->copy()->startOfMonth()->toDateString())
            ->groupBy('c.sales_id')
            ->selectRaw('c.sales_id, SUM(l.tonnage) AS tonnage, SUM(l.shipment_count) AS shipments')
            ->get()->keyBy('sales_id');
        // 🔴 Revenue by the standing rules (user, 2026-09-26): NET OF TAX (the subtotal — GST is the government's,
        // not the rep's), in INR at each document's rate, a credit note SUBTRACTS and a debit note adds, and a
        // void never stood. This summed grand totals of invoices alone, VOIDS INCLUDED (`status != draft`), and
        // left credit notes out — so a rep's revenue carried 18% of tax, kept every cancelled bill, and never fell
        // when a client was given money back. General billing to the rep's client counts: it is their revenue.
        $revenue = $withMoney ? DB::table('accounts_invoices as i')->join('customers as c', 'c.id', '=', 'i.customer_id')
            ->whereIn('c.sales_id', $sales->keys())->whereIn('i.type', ['invoice', 'debit_note', 'credit_note'])
            ->whereNotIn('i.status', ['draft', 'void'])
            ->where('i.document_date', '>=', $from->toDateString())
            ->groupBy('c.sales_id')
            ->selectRaw("c.sales_id, SUM(CASE WHEN i.type = 'credit_note' THEN -1 ELSE 1 END * i.subtotal * i.exchange_rate) AS revenue")
            ->pluck('revenue', 'sales_id') : collect();
        // At risk: the rhythm says they have gone quiet, or the latest snapshot shows volume down by a quarter or more.
        $latest = DB::table('customer_performance_snapshots')->max('snapshot_date');
        $atRisk = DB::table('customers as c')
            ->whereIn('c.sales_id', $sales->keys())
            ->where(fn ($q) => $q
                ->whereExists(fn ($e) => $e->select(DB::raw(1))->from('customer_cadence_profiles as p')
                    ->whereColumn('p.customer_id', 'c.id')->whereIn('p.risk_band', ['AT_RISK', 'DORMANT']))
                ->orWhereExists(fn ($e) => $e->select(DB::raw(1))->from('customer_performance_snapshots as s')
                    ->whereColumn('s.customer_id', 'c.id')->where('s.snapshot_date', $latest)->where('s.momentum', '<=', -0.25)))
            ->groupBy('c.sales_id')->selectRaw('c.sales_id, COUNT(*) AS at_risk')->pluck('at_risk', 'sales_id');
        $targets = $this->targetProgress($sales->pluck('agent_id')->unique()->all(), $withMoney);

        return response()->json([
            'window' => ['grain' => $grain, 'from' => $from->toDateString(), 'label' => self::WINDOWS[$grain]],
            'with_money' => $withMoney,
            'pricing' => $pricing->values()->map(fn ($u) => [
                'id' => $u->id, 'name' => $u->name, 'branch' => $u->branch,
                'raised' => (int) ($enquiries[$u->id]->raised ?? 0),
                'converted' => (int) ($enquiries[$u->id]->converted ?? 0),
                'lost' => (int) ($enquiries[$u->id]->lost ?? 0),
                'open' => (int) ($enquiries[$u->id]->open ?? 0),
                // NULL, never 0%, when they raised nothing in the window.
                'conversion_pct' => empty($enquiries[$u->id]->raised) ? null
                    : round($enquiries[$u->id]->converted * 100 / $enquiries[$u->id]->raised, 1),
            ]),
            'operations' => $operations->values()->map(fn ($u) => [
                'id' => $u->id, 'name' => $u->name, 'branch' => $u->branch,
                'assigned' => (int) ($jobs[$u->id]->assigned ?? 0),
                'completed' => (int) ($jobs[$u->id]->completed ?? 0),
                'in_progress' => (int) ($jobs[$u->id]->in_progress ?? 0),
            ]),
            'sales' => $sales->values()->map(fn ($u) => [
                'id' => $u->id, 'name' => $u->name, 'branch' => $u->branch,
                'clients' => (int) ($clients[$u->id] ?? 0),
                'tonnage' => round((float) ($volume[$u->id]->tonnage ?? 0), 1),
                'shipments' => (int) ($volume[$u->id]->shipments ?? 0),
                'revenue' => $withMoney ? round((float) ($revenue[$u->id] ?? 0), 2) : null,
                'at_risk' => (int) ($atRisk[$u->id] ?? 0),
                'target' => $targets[$u->agent_id] ?? null,
            ]),
        ]);
    }

    /**
     * This month's target progress per branch: so far ÷ target, all modes together, per measure.
     * NULL for a measure with no target set — never 0%, which would read as "nothing done".
     *
     * @return array<int, array<string, ?float>>
     */
    private function targetProgress(array $branchIds, bool $withMoney): array
    {
        $month = now()->startOfMonth();
        $targets = DB::table('sales_targets')->whereIn('agent_id', $branchIds)->where('period_month', $month->toDateString())
            ->groupBy('agent_id')
            ->selectRaw('agent_id, SUM(shipments) AS shipments, SUM(tonnage_kg) AS tonnage, SUM(revenue_inr) AS revenue')
            ->get()->keyBy('agent_id');
        $asOf = DB::table('customer_performance_snapshots')->whereIn('agent_id', $branchIds)
            ->whereBetween('snapshot_date', [$month->toDateString(), $month->copy()->endOfMonth()->toDateString()])->max('snapshot_date');
        $actual = $asOf === null ? collect() : DB::table('customer_performance_snapshots')->whereIn('agent_id', $branchIds)
            ->where('snapshot_date', $asOf)->groupBy('agent_id')
            ->selectRaw('agent_id, SUM(shipment_count_mtd) AS shipments, SUM(tonnage_mtd) AS tonnage, SUM(revenue_mtd) AS revenue')
            ->get()->keyBy('agent_id');

        $pct = fn ($done, $target) => $target > 0 ? round((float) $done * 100 / (float) $target, 1) : null;

        return collect($branchIds)->mapWithKeys(fn ($id) => [$id => [
            'shipments_pct' => $pct($actual[$id]->shipments ?? 0, $targets[$id]->shipments ?? 0),
            'tonnage_pct' => $pct($actual[$id]->tonnage ?? 0, $targets[$id]->tonnage ?? 0),
            'revenue_pct' => $withMoney ? $pct($actual[$id]->revenue ?? 0, $targets[$id]->revenue ?? 0) : null,
        ]])->all();
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    /**
     * Branch-level figures, no client attribution — what Tactical is entitled to.
     *
     * Summed from the snapshots rather than the raw tables: the whole point of the
     * engine tables is that this query touches four small rows per customer per mode
     * instead of every job the branch has ever run.
     */
    private function branchScoreboard(array $ids, ?string $mode, bool $withMoney = true): array
    {
        $latest = DB::table('customer_performance_snapshots')
            ->whereIn('agent_id', $ids)
            ->when($mode !== null, fn ($q) => $q->where('transport_mode', $mode))
            ->max('snapshot_date');

        if ($latest === null) {
            // No rollup has run. NOT zeroes — "nothing computed yet" and "a branch that
            // shipped nothing" are different facts, and zeroes would read as the second.
            $empty = ['snapshot_date' => null, 'tonnage_mtd' => null, 'tonnage_ytd' => null,
                      'shipment_count_mtd' => null, 'enquiry_count_mtd' => null];

            return $withMoney ? $empty + ['revenue_mtd' => null] : $empty;
        }

        $row = DB::table('customer_performance_snapshots')
            ->whereIn('agent_id', $ids)
            ->where('snapshot_date', $latest)
            ->when($mode !== null, fn ($q) => $q->where('transport_mode', $mode))
            ->selectRaw('SUM(tonnage_mtd) AS tonnage_mtd, SUM(tonnage_ytd) AS tonnage_ytd,
                         SUM(shipment_count_mtd) AS shipment_count_mtd,
                         SUM(enquiry_count_mtd) AS enquiry_count_mtd,
                         SUM(revenue_mtd) AS revenue_mtd')
            ->first();

        $scoreboard = [
            'snapshot_date'      => $latest,
            'tonnage_mtd'        => (float) $row->tonnage_mtd,
            'tonnage_ytd'        => (float) $row->tonnage_ytd,
            'shipment_count_mtd' => (int) $row->shipment_count_mtd,
            'enquiry_count_mtd'  => (int) $row->enquiry_count_mtd,
        ];

        // 🔴 **MONEY IS COMMAND-ONLY IN THE SALES COCKPIT.** PRD.md §7.4's Tactical list
        // is tonnage, shipment counts, conversion, loss mix, lanes and staff load —
        // revenue appears nowhere in it, and the note beneath states the rep cannot see
        // "any client's revenue or tonnage, or who owes money".
        //
        // Omitted from the payload rather than zeroed or hidden in the component: money
        // IS the upsell, and a Tactical response carrying a revenue figure gives away
        // the thing Command is sold for. Caught by Checkpoint 7, which asks for
        // "branch aggregates with no client names and no money" — the second clause is
        // the one that is easy to read past.
        return $withMoney ? $scoreboard + ['revenue_mtd' => (float) $row->revenue_mtd] : $scoreboard;
    }

    /**
     * One row per client — Command only, scoped to the rep's own book.
     *
     * 🔴 The column list is EXPLICIT, never `select *`. A future column added to the
     * snapshots table must be added here deliberately, so nothing reaches the sales
     * surface by default. That is the whole defence against a margin column appearing
     * in this response the day someone adds one.
     */
    private function clientBook(UserContext $context, ?string $mode, array $ids, int $limit = 50): array
    {
        $latest = DB::table('customer_performance_snapshots')
            ->whereIn('agent_id', $ids)
            ->when($mode !== null, fn ($q) => $q->where('transport_mode', $mode))
            ->max('snapshot_date');

        if ($latest === null) {
            return [];
        }

        return DB::table('customer_performance_snapshots as s')
            ->join('customers as c', 'c.id', '=', 's.customer_id')
            ->leftJoin('customer_cadence_profiles as p', function ($join) {
                $join->on('p.customer_id', '=', 's.customer_id')
                     ->on('p.transport_mode', '=', 's.transport_mode');
            })
            ->whereIn('s.agent_id', $ids)
            ->where('s.snapshot_date', $latest)
            ->when($mode !== null, fn ($q) => $q->where('s.transport_mode', $mode))
            // 🔒 A SALES rep sees their own clients. A boss is not sales-scoped.
            ->when(
                $context->designation === 'sales',
                fn ($q) => $q->where('c.sales_id', $context->userId)
            )
            ->orderByDesc('s.tonnage_ytd')
            ->limit($limit)
            ->get([
                'c.id as customer_id', 'c.name', 'c.email_domain',
                's.transport_mode', 's.tonnage_mtd', 's.tonnage_ytd',
                's.shipment_count_mtd', 's.enquiry_count_mtd',
                's.win_rate', 's.service_loss_rate', 's.price_loss_rate',
                's.momentum', 's.lane_hhi',
                's.revenue_mtd', 's.revenue_ytd',
                's.dso_days', 's.payment_drift_days',
                's.outstanding_0_30', 's.outstanding_31_60', 's.outstanding_60_plus',
                's.credit_utilization', 's.client_health_score',
                'p.risk_band', 'p.overdue_ratio', 'p.last_shipment_at', 'p.is_irregular',
            ])
            ->map(fn ($r) => (array) $r)
            ->all();
    }

    /**
     * Tonnage and shipment counts by month.
     *
     * ⚠️ Months with no shipments are ABSENT, not zero-filled. A gap in a trend line is
     * "we have no data for that month"; a zero is "we moved nothing", and on a lane
     * chart those read as opposite commercial stories. The client draws the gap.
     */
    private function tonnageSeries(UserContext $context, ?string $mode, Carbon $from, array $ids): array
    {
        return DB::table('customer_lane_stats as l')
            ->join('customers as c', 'c.id', '=', 'l.customer_id')
            ->whereIn('l.agent_id', $ids)
            ->where('l.period_month', '>=', $from->copy()->startOfMonth()->toDateString())
            ->when($mode !== null, fn ($q) => $q->where('l.transport_mode', $mode))
            ->when($this->scopedToRep($context), fn ($q) => $q->where('c.sales_id', $context->userId))
            ->selectRaw('l.period_month, SUM(l.tonnage) AS tonnage, SUM(l.shipment_count) AS shipments')
            ->groupBy('l.period_month')
            ->orderBy('l.period_month')
            ->limit(36)
            ->get()
            ->map(fn ($r) => [
                'period'    => $r->period_month,
                'tonnage'   => round((float) $r->tonnage, 3),
                'shipments' => (int) $r->shipments,
            ])
            ->all();
    }

    /**
     * Lane mix — top lanes by TONNAGE, not by shipment count.
     *
     * ⚠️ Ten courier-sized shipments on one lane are not the commercial exposure of one
     * full container on another, and this chart is read as exposure. Ranking by count
     * would put the busiest lane first rather than the biggest one.
     */
    private function laneSeries(UserContext $context, ?string $mode, Carbon $from, array $ids): array
    {
        return DB::table('customer_lane_stats as l')
            ->join('customers as c', 'c.id', '=', 'l.customer_id')
            ->whereIn('l.agent_id', $ids)
            ->where('l.period_month', '>=', $from->copy()->startOfMonth()->toDateString())
            ->when($mode !== null, fn ($q) => $q->where('l.transport_mode', $mode))
            ->when($this->scopedToRep($context), fn ($q) => $q->where('c.sales_id', $context->userId))
            ->selectRaw("CONCAT(l.origin_code, ' → ', l.dest_code) AS lane,
                         SUM(l.tonnage) AS tonnage, SUM(l.shipment_count) AS shipments")
            ->groupBy('lane')
            ->orderByDesc('tonnage')
            ->limit(10)
            ->get()
            ->map(fn ($r) => [
                'lane'      => $r->lane,
                'tonnage'   => round((float) $r->tonnage, 3),
                'shipments' => (int) $r->shipments,
            ])
            ->all();
    }

    /**
     * Won / lost / still open, from the funnel views.
     *
     * 🔴 The yearly view REQUIRES a basis — it is a UNION over fiscal and calendar, and
     * querying it without one counts every enquiry twice.
     */
    private function funnelSeries(?string $mode, string $grain, Carbon $from, array $ids, Request $request): array
    {
        $view = self::FUNNEL_VIEWS[$grain];

        // 🔴 One row per PERIOD. The view holds a row per branch and per mode, so several branches (or air and sea
        // together) would otherwise repeat each period — summed here, and the rate worked out again from the sums.
        $rows = DB::table($view)
            ->whereIn('agent_id', $ids)
            ->where('period_start', '>=', $from->toDateString())
            ->when($mode !== null, fn ($q) => $q->where('transport_mode', $mode))
            ->when($grain === 'year', fn ($q) => $q->where('period_basis', $request->string('basis', 'fiscal')))
            ->groupBy('period_start')
            ->selectRaw('period_start, SUM(enquiries_raised) AS enquiries_raised, SUM(enquiries_converted) AS enquiries_converted,
                         SUM(enquiries_lost) AS enquiries_lost, SUM(enquiries_pending) AS enquiries_pending')
            ->orderByDesc('period_start')
            ->limit(24)
            ->get();

        return [
            'periods' => $rows->reverse()->values()->map(fn ($r) => [
                'period'    => $r->period_start,
                'raised'    => (int) $r->enquiries_raised,
                'converted' => (int) $r->enquiries_converted,
                'lost'      => (int) $r->enquiries_lost,
                'pending'   => (int) $r->enquiries_pending,
                // §7.1 NULL, never 0% — the same formula as the view: converted ÷ raised.
                'conversion_rate_pct' => (int) $r->enquiries_raised === 0 ? null
                    : round($r->enquiries_converted * 100 / $r->enquiries_raised, 2),
            ])->all(),
            // The donut totals across the window.
            'totals' => [
                'converted' => (int) $rows->sum('enquiries_converted'),
                'lost'      => (int) $rows->sum('enquiries_lost'),
                'pending'   => (int) $rows->sum('enquiries_pending'),
            ],
        ];
    }

    /**
     * The branches these figures cover (user, 2026-09-16: "the boss sees everything").
     * The Boss: every branch of the company, or the one they picked. Everyone else: their own branch.
     *
     * @return int[]
     */
    private function branchIds(Request $request, UserContext $context): array
    {
        if ($context->designation !== 'boss') {
            return [(int) $context->agentId];
        }

        $all = DB::table('agents_info')->where('company_id', $context->companyId)->pluck('id')->map(fn ($id) => (int) $id)->all();
        $picked = $request->integer('branch');

        return $picked && in_array($picked, $all, true) ? [$picked] : $all;
    }

    /** Where a period's window starts. Lane statistics are monthly, so they read from that month's first day. */
    private function windowStart(string $grain): Carbon
    {
        return [
            'this_month' => now()->startOfMonth(),
            'day' => now()->subDays(30),
            'month' => now()->subMonths(12),
            'year' => now()->subYears(2),
        ][$grain];
    }

    /** A sales REP is scoped to their own book; a boss is not. */
    private function scopedToRep(UserContext $context): bool
    {
        return $context->tier === 'command' && $context->designation === 'sales';
    }

    /**
     * How old the numbers are.
     *
     * PRD.md §7 requires a staleness banner past one hour. A dashboard that cannot say
     * how fresh it is invites the reader to assume "live", which is the one thing these
     * numbers are deliberately not.
     */
    private function staleness(array $ids, ?string $mode): array
    {
        $computed = DB::table('customer_performance_snapshots')
            ->whereIn('agent_id', $ids)
            ->when($mode !== null, fn ($q) => $q->where('transport_mode', $mode))
            ->max('last_computed_at');

        if ($computed === null) {
            return ['last_computed_at' => null, 'age_minutes' => null, 'is_stale' => true,
                    'reason' => 'never_computed'];
        }

        $age = now()->diffInMinutes(\Illuminate\Support\Carbon::parse($computed));

        return [
            'last_computed_at' => $computed,
            'age_minutes'      => $age,
            'is_stale'         => $age > self::STALE_AFTER_MINUTES,
            'reason'           => $age > self::STALE_AFTER_MINUTES ? 'rollup_overdue' : null,
        ];
    }
}
