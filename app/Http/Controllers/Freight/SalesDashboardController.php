<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        $payload = [
            'tier'      => $context->tier,
            'mode'      => $mode,
            'scope'     => $isCommand ? 'my_book' : 'branch',
            'branch'    => $this->branchScoreboard($context->agentId, $mode, $isCommand),
            'staleness' => $this->staleness($context->agentId, $mode),
        ];

        if ($isCommand) {
            // 🔒 Command scoping is `customers.sales_id = me` — a rep sees THEIR book,
            // not the branch's. A boss is not sales-scoped and sees the whole branch.
            $payload['book'] = $this->clientBook($context, $mode);
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
            ->where('agent_id', $context->agentId)
            ->where('status', 'open')
            // ⚠️ INTERNAL findings only. A client-audience row carries a drafted email
            // and belongs to the outreach surface, which has its own consent rules.
            ->where('audience', 'internal');

        if ($mode !== null) {
            $query->where('transport_mode', $mode);
        }

        if ($context->tier === 'command' && $context->designation === 'sales') {
            $query->where('sales_id', $context->userId);
        } else {
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

        return response()->json(['accounts' => $this->clientBook($context, $mode, 200)]);
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
        $grain = in_array($grain, ['day', 'month', 'year'], true) ? $grain : 'month';

        return response()->json([
            'grain'   => $grain,
            'scope'   => $context->tier === 'command' ? 'my_book' : 'branch',
            'tonnage' => $this->tonnageSeries($context, $mode),
            'lanes'   => $this->laneSeries($context, $mode),
            'funnel'  => $this->funnelSeries($context, $mode, $grain, $request),
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
            // ❓ PRD §2.3 gives the Boss a "target assigner (revenue or tonnage)", but
            // no targets table exists in the schema doc. Reported as unavailable rather
            // than faked with a hard-coded goal — see GAPS.md #33.
            'targets'  => ['available' => false, 'reason' => 'no_targets_table'],
        ]);
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    /**
     * Branch-level figures, no client attribution — what Tactical is entitled to.
     *
     * Summed from the snapshots rather than the raw tables: the whole point of the
     * engine tables is that this query touches four small rows per customer per mode
     * instead of every job the branch has ever run.
     */
    private function branchScoreboard(?int $agentId, ?string $mode, bool $withMoney = true): array
    {
        $latest = DB::table('customer_performance_snapshots')
            ->where('agent_id', $agentId)
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
            ->where('agent_id', $agentId)
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
    private function clientBook(UserContext $context, ?string $mode, int $limit = 50): array
    {
        $latest = DB::table('customer_performance_snapshots')
            ->where('agent_id', $context->agentId)
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
            ->where('s.agent_id', $context->agentId)
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
    private function tonnageSeries(UserContext $context, ?string $mode): array
    {
        return DB::table('customer_lane_stats as l')
            ->join('customers as c', 'c.id', '=', 'l.customer_id')
            ->where('l.agent_id', $context->agentId)
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
    private function laneSeries(UserContext $context, ?string $mode): array
    {
        return DB::table('customer_lane_stats as l')
            ->join('customers as c', 'c.id', '=', 'l.customer_id')
            ->where('l.agent_id', $context->agentId)
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
    private function funnelSeries(UserContext $context, ?string $mode, string $grain, Request $request): array
    {
        $view = ['day' => 'dsr_funnel_view', 'month' => 'msr_funnel_view', 'year' => 'ysr_funnel_view'][$grain];

        $rows = DB::table($view)
            ->where('agent_id', $context->agentId)
            ->when($mode !== null, fn ($q) => $q->where('transport_mode', $mode))
            ->when($grain === 'year', fn ($q) => $q->where('period_basis', $request->string('basis', 'fiscal')))
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
                // §7.1 NULL, never 0% — carried to the wire so the chart can show a gap.
                'conversion_rate_pct' => $r->conversion_rate_pct === null ? null : (float) $r->conversion_rate_pct,
            ])->all(),
            // The donut totals across the window.
            'totals' => [
                'converted' => (int) $rows->sum('enquiries_converted'),
                'lost'      => (int) $rows->sum('enquiries_lost'),
                'pending'   => (int) $rows->sum('enquiries_pending'),
            ],
        ];
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
    private function staleness(?int $agentId, ?string $mode): array
    {
        $computed = DB::table('customer_performance_snapshots')
            ->where('agent_id', $agentId)
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
