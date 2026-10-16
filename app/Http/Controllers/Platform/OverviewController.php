<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Services\AiUsageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * The platform Overview (owner, 2026-10-11: "graphs to keep a track … so I don't have so many pages to open"). One read
 * for the first page of the superadmin portal: four graphs over the last 90 days, drawn from what F16s already records,
 * and the "needs you" list — each item a count and the page that clears it.
 *
 * Sign-ins and server errors are drawn from `sign_in_events` and `server_errors` (owner, 2026-10-16).
 */
class OverviewController extends Controller
{
    private const DAYS = 90;
    private const TOP = 5;

    public function __construct(private AiUsageService $usage)
    {
    }

    public function index(): JsonResponse
    {
        $from = now()->subDays(self::DAYS - 1)->startOfDay();
        $days = collect(range(0, self::DAYS - 1))->map(fn ($i) => $from->copy()->addDays($i)->toDateString());

        return response()->json([
            'shipments' => $this->shipments($from, $days),
            'mail' => $this->mail($from, $days),
            'ai' => $this->ai($from, $days),
            'tickets' => $this->tickets(),
            'signins' => $this->signIns($from, $days),
            'errors' => $this->errors($from, $days),
            'needs_you' => $this->needsYou(),
            'as_of' => now()->toIso8601String(),
        ]);
    }

    /** Shipments opened per day: a line for each of the five busiest companies, the rest together. */
    private function shipments(Carbon $from, Collection $days): array
    {
        $rows = DB::table('jobs as j')->join('agents_info as a', 'a.id', '=', 'j.agent_id')->join('companies as c', 'c.id', '=', 'a.company_id')
            ->where('j.created_at', '>=', $from)
            ->selectRaw('c.name, DATE(j.created_at) AS d, COUNT(*) AS n')->groupBy('c.name', 'd')->get();

        $totals = $rows->groupBy('name')->map->sum('n')->sortDesc();
        $top = $totals->keys()->take(self::TOP);
        $line = fn (Collection $r) => $days->map(fn ($d) => ['x' => $d, 'y' => (int) $r->where('d', $d)->sum('n')])->values();

        $series = $top->map(fn ($name) => ['name' => $name, 'data' => $line($rows->where('name', $name))])->values();
        $rest = $rows->whereNotIn('name', $top->all());
        if ($rest->isNotEmpty()) {
            $series->push(['name' => 'Others', 'data' => $line($rest)]);
        }

        return ['days' => $days->values(), 'series' => $series, 'total' => (int) $totals->sum()];
    }

    /** Client mail arriving, and conversations triaged, per day. */
    private function mail(Carbon $from, Collection $days): array
    {
        $in = DB::table('email_messages')->where('direction', 'inbound')->where('received_at', '>=', $from)
            ->selectRaw('DATE(received_at) AS d, COUNT(*) AS n')->groupBy('d')->pluck('n', 'd');
        $triaged = DB::table('email_threads')->whereNotNull('first_triage_at')->where('first_triage_at', '>=', $from)
            ->selectRaw('DATE(first_triage_at) AS d, COUNT(*) AS n')->groupBy('d')->pluck('n', 'd');

        return ['series' => [
            ['name' => 'Mail in', 'data' => $days->map(fn ($d) => ['x' => $d, 'y' => (int) ($in[$d] ?? 0)])->values()],
            ['name' => 'Triaged', 'data' => $days->map(fn ($d) => ['x' => $d, 'y' => (int) ($triaged[$d] ?? 0)])->values()],
        ]];
    }

    /** AI spend per day in rupees, and this month's spend against its budget — the AI usage page's own rate. */
    private function ai(Carbon $from, Collection $days): array
    {
        $settings = $this->usage->settings();
        $rate = (float) $settings->usd_to_inr;
        $usd = DB::table('llm_usage_logs')->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) AS d, SUM(cost_usd) AS usd')->groupBy('d')->pluck('usd', 'd');
        $month = (float) DB::table('llm_usage_logs')->where('created_at', '>=', now()->startOfMonth())->sum('cost_usd');

        return [
            'days' => $days->map(fn ($d) => ['x' => $d, 'y' => round((float) ($usd[$d] ?? 0) * $rate, 2)])->values(),
            'month_inr' => round($month * $rate, 2),
            'budget_inr' => (float) $settings->monthly_budget_inr,
        ];
    }

    /** People signed in per day — each person once a day — a line for each of the five busiest companies, the rest together. */
    private function signIns(Carbon $from, Collection $days): array
    {
        $rows = DB::table('sign_in_events as s')->join('companies as c', 'c.id', '=', 's.company_id')
            ->where('s.guard', 'user')->where('s.created_at', '>=', $from)
            ->selectRaw('c.name, DATE(s.created_at) AS d, COUNT(DISTINCT s.account_id) AS n')->groupBy('c.name', 'd')->get();

        $top = $rows->groupBy('name')->map->sum('n')->sortDesc()->keys()->take(self::TOP);
        $line = fn (Collection $r) => $days->map(fn ($d) => ['x' => $d, 'y' => (int) $r->where('d', $d)->sum('n')])->values();

        $series = $top->map(fn ($name) => ['name' => $name, 'data' => $line($rows->where('name', $name))])->values();
        $rest = $rows->whereNotIn('name', $top->all());
        if ($rest->isNotEmpty()) {
            $series->push(['name' => 'Others', 'data' => $line($rest)]);
        }

        return ['series' => $series, 'total' => (int) $rows->sum('n')];
    }

    /** Server errors and failed background jobs per day — a jump after a release is the thing to see. */
    private function errors(Carbon $from, Collection $days): array
    {
        $server = DB::table('server_errors')->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) AS d, COUNT(*) AS n')->groupBy('d')->pluck('n', 'd');
        $jobs = DB::table('failed_jobs')->where('failed_at', '>=', $from)
            ->selectRaw('DATE(failed_at) AS d, COUNT(*) AS n')->groupBy('d')->pluck('n', 'd');

        return ['series' => [
            ['name' => 'Server errors', 'data' => $days->map(fn ($d) => ['x' => $d, 'y' => (int) ($server[$d] ?? 0)])->values()],
            ['name' => 'Failed background jobs', 'data' => $days->map(fn ($d) => ['x' => $d, 'y' => (int) ($jobs[$d] ?? 0)])->values()],
        ], 'total' => (int) ($server->sum() + $jobs->sum())];
    }

    /** Tickets opened and resolved per week, the last 13 weeks. "Resolved" is when it was last changed to resolved. */
    private function tickets(): array
    {
        $start = now()->startOfWeek()->subWeeks(12);
        $weeks = collect(range(0, 12))->map(fn ($i) => $start->copy()->addWeeks($i));
        $opened = DB::table('support_tickets')->where('created_at', '>=', $start)->pluck('created_at');
        $resolved = DB::table('support_tickets')->where('status', 'resolved')->where('updated_at', '>=', $start)->pluck('updated_at');
        $in = fn ($dates, Carbon $w) => $dates->filter(fn ($t) => Carbon::parse($t)->between($w, $w->copy()->endOfWeek()))->count();

        return ['weeks' => $weeks->map(fn ($w) => [
            'x' => $w->toDateString(), 'opened' => $in($opened, $w), 'resolved' => $in($resolved, $w),
        ])->values()];
    }

    /** What is waiting on F16s staff, each with the page that clears it. Only what is there is listed. */
    private function needsYou(): array
    {
        $open = DB::table('support_tickets')->whereIn('status', ['open', 'investigating']);
        $oldest = (clone $open)->min('created_at');
        $settings = $this->usage->settings();
        $monthInr = (float) DB::table('llm_usage_logs')->where('created_at', '>=', now()->startOfMonth())->sum('cost_usd') * (float) $settings->usd_to_inr;

        $items = [
            ['key' => 'tickets', 'count' => (clone $open)->count(), 'to' => '/superadmin/support-desk',
             'label' => 'tickets waiting' . ($oldest ? ', the oldest ' . Carbon::parse($oldest)->diffForHumans(null, true) . ' old' : '')],
            ['key' => 'failed_jobs', 'count' => DB::table('failed_jobs')->count(), 'to' => '/superadmin/monitor',
             'label' => 'background jobs failed'],
            ['key' => 'branches_without_code', 'count' => DB::table('agents_info')->where(fn ($q) => $q->whereNull('branch_code')->orWhere('branch_code', ''))->count(),
             'to' => '/superadmin/tenants', 'label' => 'branches with no branch code — they cannot number an enquiry or a job'],
            ['key' => 'companies_without_branch', 'count' => DB::table('companies')->whereNotExists(fn ($q) => $q->from('agents_info')->whereColumn('agents_info.company_id', 'companies.id'))->count(),
             'to' => '/superadmin/tenants', 'label' => 'companies with no branch yet'],
            ['key' => 'ai_budget', 'count' => $monthInr >= (float) $settings->monthly_budget_inr ? 1 : 0, 'to' => '/superadmin/ai-usage',
             'label' => 'AI spend has reached this month\'s budget'],
        ];

        return array_values(array_filter($items, fn ($i) => $i['count'] > 0));
    }
}
