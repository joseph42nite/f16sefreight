<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Job;
use App\EmailThread;
use App\InboundEmail;
use App\User;
use App\SalesTarget;
use App\FinancialSnapshot;
use App\Company;
use App\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $user = Auth::user();
            if ($user && $user instanceof \App\User && in_array($user->designation, ['operations', 'pricing'])) {
                return response()->json(['error' => 'Unauthorized.'], 403);
            }
            return $next($request);
        });
    }

    /**
     * Helper to format dates based on driver.
     */
    protected function getDateExpression($column = 'created_at', $period = 'daily')
    {
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            if ($period === 'monthly') {
                return "strftime('%Y-%m', $column)";
            } elseif ($period === 'yearly') {
                return "strftime('%Y', $column)";
            }
            return "strftime('%Y-%m-%d', $column)";
        } else {
            if ($period === 'monthly') {
                return "DATE_FORMAT($column, '%Y-%m')";
            } elseif ($period === 'yearly') {
                return "YEAR($column)";
            }
            return "DATE($column)";
        }
    }

    /**
     * Compute Funnel Metrics.
     * GET /api/user/analytics/funnel
     * GET /api/superadmin/analytics/funnel
     */
    public function getFunnelMetrics(Request $request)
    {
        $user = Auth::user();
        $isSuperAdmin = $request->is('api/superadmin/*');

        // Base Query
        $jobQuery = Job::whereNotNull('enquiry_no');
        $threadQuery = EmailThread::query();

        // 1. Scoping Isolation
        if (!$isSuperAdmin) {
            // Regular user: branch-level tenant isolation
            $agentId = $user->branch_name;
            $jobQuery->where('agent_id', $agentId);
            $threadQuery->where('agent_id', $agentId);
        } else {
            // Boss/Director: Bypass global PortalScope and AgentScope
            $jobQuery->withoutGlobalScope(\App\Scopes\PortalScope::class);
            $threadQuery->withoutGlobalScope(\App\Scopes\PortalScope::class);
        }

        // Apply filters
        if ($request->filled('transport_mode')) {
            $jobQuery->where('transport_mode', $request->transport_mode);
            // EmailThread does not have transport_mode directly, but it links to Job
            $threadQuery->whereHas('job', function ($q) use ($request) {
                $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                  ->where('transport_mode', $request->transport_mode);
            });
        }

        if ($request->filled('agent_id')) {
            $jobQuery->where('agent_id', $request->agent_id);
            $threadQuery->where('agent_id', $request->agent_id);
        }

        // Period grouping
        $period = $request->query('period', 'daily');
        $daysRange = $period === 'yearly' ? 1825 : ($period === 'monthly' ? 365 : 30);
        $startDate = Carbon::now()->subDays($daysRange);

        if ($request->filled('start_date')) {
            $startDate = Carbon::parse($request->start_date);
        }
        $jobQuery->where('created_at', '>=', $startDate);
        $threadQuery->where('created_at', '>=', $startDate);

        $dateExpr = $this->getDateExpression('created_at', $period);

        // Fetch counts grouped by period
        $raisedGroup = (clone $jobQuery)
            ->select(DB::raw("$dateExpr as date_group"), DB::raw("count(*) as total"))
            ->groupBy('date_group')
            ->orderBy('date_group', 'asc')
            ->get()
            ->pluck('total', 'date_group');

        $convertedGroup = (clone $jobQuery)
            ->whereNotNull('execution_job_no')
            ->select(DB::raw("$dateExpr as date_group"), DB::raw("count(*) as total"))
            ->groupBy('date_group')
            ->orderBy('date_group', 'asc')
            ->get()
            ->pluck('total', 'date_group');

        $repliedGroup = (clone $jobQuery)
            ->whereHas('emailThreads', function ($q) {
                $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                  ->whereNotNull('first_reply_at');
            })
            ->select(DB::raw("$dateExpr as date_group"), DB::raw("count(*) as total"))
            ->groupBy('date_group')
            ->orderBy('date_group', 'asc')
            ->get()
            ->pluck('total', 'date_group');

        // Compile date groups list
        $allGroups = $raisedGroup->keys()->merge($convertedGroup->keys())->merge($repliedGroup->keys())->unique()->sort();

        $chartData = [];
        foreach ($allGroups as $group) {
            $raised = $raisedGroup->get($group, 0);
            $converted = $convertedGroup->get($group, 0);
            $replied = $repliedGroup->get($group, 0);
            $conversionRate = $raised > 0 ? round(($converted / $raised) * 100, 1) : 0;

            // Compute pending SLA breached count
            $pendingSlaBreached = (clone $jobQuery)
                ->where(DB::raw($this->getDateExpression('created_at', $period)), $group)
                ->whereNull('execution_job_no')
                ->where('status', '!=', 'Lost')
                ->whereHas('emailThreads', function ($q) {
                    $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                      ->where('status', '!=', 'replied')
                      ->where('status', '!=', 'archived')
                      ->where('latest_message_received_at', '<', Carbon::now()->subMinutes(15));
                })
                ->count();

            $chartData[] = [
                'period' => $group,
                'raised' => $raised,
                'replied' => $replied,
                'converted' => $converted,
                'pending_sla_breached' => $pendingSlaBreached,
                'conversion_rate' => $conversionRate,
            ];
        }

        // General Snapshot Status for Boss Dashboard
        $latestSnapshot = null;
        if ($isSuperAdmin) {
            $latestSnapshot = FinancialSnapshot::orderBy('last_computed_at', 'desc')->first();
        }

        return response()->json([
            'status' => true,
            'data' => $chartData,
            'totals' => [
                'raised' => (clone $jobQuery)->count(),
                'replied' => (clone $jobQuery)->whereHas('emailThreads', function ($q) {
                    $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                      ->whereNotNull('first_reply_at');
                })->count(),
                'converted' => (clone $jobQuery)->whereNotNull('execution_job_no')->count(),
                'pending_sla_breached' => (clone $jobQuery)->whereNull('execution_job_no')
                    ->where('status', '!=', 'Lost')
                    ->whereHas('emailThreads', function ($q) {
                        $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                          ->where('status', '!=', 'replied')
                          ->where('status', '!=', 'archived')
                          ->where('latest_message_received_at', '<', Carbon::now()->subMinutes(15));
                    })->count(),
            ],
            'snapshot_status' => $latestSnapshot ? [
                'last_computed_at' => $latestSnapshot->last_computed_at->toIso8601String(),
                'is_stale' => $latestSnapshot->isStale()
            ] : null
        ]);
    }

    /**
     * Compute Lost Reasons breakdown.
     * GET /api/user/analytics/lost-reasons
     */
    public function getLostReasons(Request $request)
    {
        $user = Auth::user();
        $isSuperAdmin = $request->is('api/superadmin/*');

        $query = Job::where('status', 'Lost');

        if (!$isSuperAdmin) {
            $query->where('agent_id', $user->branch_name);
        } else {
            $query->withoutGlobalScope(\App\Scopes\PortalScope::class);
        }

        if ($request->filled('transport_mode')) {
            $query->where('transport_mode', $request->transport_mode);
        }

        $lostReasons = $query->select('lost_reason', DB::raw('count(*) as total'))
            ->whereNotNull('lost_reason')
            ->groupBy('lost_reason')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $lostReasons
        ]);
    }

    /**
     * Compute Response Times (SLA Response Latency).
     * GET /api/user/analytics/response-times
     */
    public function getResponseTimes(Request $request)
    {
        $user = Auth::user();
        $isSuperAdmin = $request->is('api/superadmin/*');

        $query = EmailThread::whereNotNull('first_reply_at');

        if (!$isSuperAdmin) {
            $query->where('agent_id', $user->branch_name);
        } else {
            $query->withoutGlobalScope(\App\Scopes\PortalScope::class);
        }

        if ($request->filled('transport_mode')) {
            $query->whereHas('job', function ($q) use ($request) {
                $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                  ->where('transport_mode', $request->transport_mode);
            });
        }

        $period = $request->query('period', 'daily');
        $dateExpr = $this->getDateExpression('created_at', $period);

        // In SQLite and MySQL, calculate difference in seconds between first_reply_at and created_at
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            $latencyExpr = "strftime('%s', first_reply_at) - strftime('%s', created_at)";
        } else {
            $latencyExpr = "TIMESTAMPDIFF(SECOND, created_at, first_reply_at)";
        }

        $latencies = $query->select(
            DB::raw("$dateExpr as date_group"),
            DB::raw("AVG($latencyExpr) as avg_latency_seconds"),
            DB::raw("count(*) as total")
        )
        ->groupBy('date_group')
        ->orderBy('date_group', 'asc')
        ->get();

        return response()->json([
            'status' => true,
            'data' => $latencies
        ]);
    }

    /**
     * Compute Operator Load Index (OLI) for staff.
     * GET /api/user/analytics/staff-load
     */
    public function getStaffLoad(Request $request)
    {
        $user = Auth::user();
        $isSuperAdmin = $request->is('api/superadmin/*');

        if ($isSuperAdmin && $request->filled('agent_id')) {
            $branchId = $request->agent_id;
        } else {
            $branchId = $user->branch_name;
        }

        if (!$branchId) {
            return response()->json(['error' => 'No branch context found.'], 400);
        }

        $operators = User::where('branch_name', $branchId)->get();
        $operatorOliList = [];

        foreach ($operators as $op) {
            // Find active jobs assigned to operator (not completed, not lost)
            $activeJobsQuery = Job::where('operator_id', $op->id)
                ->whereNotIn('status', ['Completed', 'Lost']);
            
            if ($isSuperAdmin) {
                $activeJobsQuery->withoutGlobalScope(\App\Scopes\PortalScope::class);
            }
            
            $activeJobs = $activeJobsQuery->with(['airShipmentDetail', 'seaShipmentDetail'])->get();

            $oliScore = 0.0;
            foreach ($activeJobs as $job) {
                $multiplier = 1.0;
                if ($job->transport_mode === 'air') {
                    $multiplier = $job->direction === 'import' ? 1.5 : 1.0;
                } elseif ($job->transport_mode === 'sea') {
                    $multiplier = $job->direction === 'import' ? 2.5 : 2.0;
                }

                $grossWeight = 0.0;
                if ($job->transport_mode === 'air' && $job->airShipmentDetail) {
                    $grossWeight = $job->airShipmentDetail->gross_weight;
                } elseif ($job->transport_mode === 'sea' && $job->seaShipmentDetail) {
                    $grossWeight = $job->seaShipmentDetail->gross_weight;
                }

                $massInTons = $grossWeight / 1000.0;
                $oliScore += ($massInTons * $multiplier);
            }

            $operatorOliList[] = [
                'operator_id' => $op->id,
                'name' => $op->name,
                'designation' => $op->designation,
                'active_jobs_count' => $activeJobs->count(),
                'oli_score' => round($oliScore, 2),
            ];
        }

        return response()->json([
            'status' => true,
            'data' => $operatorOliList
        ]);
    }

    /**
     * Retrieve LLM Customer Summary.
     * GET /api/user/analytics/client-summary
     */
    public function getClientSummary(Request $request)
    {
        $request->validate([
            'client_id' => ['required', 'integer', 'exists:companies,id']
        ]);

        $user = Auth::user();
        $client = Company::findOrFail($request->client_id);

        // Aggregate client activity over the past 90 days
        $startDate = Carbon::now()->subDays(90);

        $jobsQuery = Job::where('client_id', $client->id)
            ->where('created_at', '>=', $startDate)
            ->withoutGlobalScope(\App\Scopes\PortalScope::class);

        $jobs = $jobsQuery->with(['airShipmentDetail', 'seaShipmentDetail'])->get();

        $totalJobs = $jobs->count();
        $convertedJobs = $jobs->whereNotNull('execution_job_no')->count();
        $conversionRate = $totalJobs > 0 ? round(($convertedJobs / $totalJobs) * 100, 1) : 0;

        $airTonnage = 0.0;
        $seaTonnage = 0.0;
        $lanes = [];

        foreach ($jobs as $job) {
            $origin = '';
            $dest = '';
            
            if ($job->transport_mode === 'air' && $job->airShipmentDetail) {
                $airTonnage += ($job->airShipmentDetail->gross_weight ?: 0.0) / 1000.0;
                $origin = $job->airShipmentDetail->pol_code;
                $dest = $job->airShipmentDetail->pod_code;
            } elseif ($job->transport_mode === 'sea' && $job->seaShipmentDetail) {
                $seaTonnage += ($job->seaShipmentDetail->gross_weight ?: 0.0) / 1000.0;
                $origin = $job->seaShipmentDetail->pol_code;
                $dest = $job->seaShipmentDetail->pod_code;
            }

            if ($origin && $dest) {
                $laneKey = strtoupper($origin) . '-' . strtoupper($dest);
                $lanes[$laneKey] = ($lanes[$laneKey] ?? 0) + 1;
            }
        }

        arsort($lanes);
        $topLanes = array_slice($lanes, 0, 5, true);

        // Assemble metrics payload
        $payload = [
            'total_shipments' => $totalJobs,
            'conversion_rate_pct' => $conversionRate,
            'air_freight_tonnage' => round($airTonnage, 2),
            'sea_freight_tonnage' => round($seaTonnage, 2),
            'top_lanes' => $topLanes,
        ];

        // Call FastAPI
        $ocrUrl = rtrim(config('services.ocr.url'), '/') . '/summarize-client';
        try {
            $response = Http::timeout(10)->post($ocrUrl, [
                'client_name' => $client->name,
                'data' => $payload
            ]);

            if ($response->failed()) {
                throw new \RuntimeException('FastAPI summary error: ' . $response->body());
            }

            $result = $response->json();
            return response()->json([
                'status' => true,
                'summary' => $result['summary'] ?? 'No summary returned.'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'error' => 'LLM Summarizer offline. Technical details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retrieve weekly AI executive brief.
     * GET /api/superadmin/analytics/weekly-brief
     */
    public function getWeeklyBrief(Request $request)
    {
        // Gathers all operations and pricing metrics for this week vs the prior week.
        $thisWeekStart = Carbon::now()->subDays(7);
        $priorWeekStart = Carbon::now()->subDays(14);

        // Compute helper for a date range
        $getStats = function ($start, $end) {
            $jobs = Job::whereBetween('created_at', [$start, $end])
                ->withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->with(['airShipmentDetail', 'seaShipmentDetail'])
                ->get();

            $raised = $jobs->count();
            $converted = $jobs->whereNotNull('execution_job_no')->count();
            $conversionRate = $raised > 0 ? round(($converted / $raised) * 100, 1) : 0;

            $totalTonnage = 0.0;
            $lanes = [];

            foreach ($jobs as $job) {
                $weight = 0.0;
                $origin = '';
                $dest = '';
                if ($job->transport_mode === 'air' && $job->airShipmentDetail) {
                    $weight = $job->airShipmentDetail->gross_weight ?: 0.0;
                    $origin = $job->airShipmentDetail->pol_code;
                    $dest = $job->airShipmentDetail->pod_code;
                } elseif ($job->transport_mode === 'sea' && $job->seaShipmentDetail) {
                    $weight = $job->seaShipmentDetail->gross_weight ?: 0.0;
                    $origin = $job->seaShipmentDetail->pol_code;
                    $dest = $job->seaShipmentDetail->pod_code;
                }

                $totalTonnage += $weight / 1000.0;
                if ($origin && $dest) {
                    $laneKey = strtoupper($origin) . '-' . strtoupper($dest);
                    $lanes[$laneKey] = ($lanes[$laneKey] ?? 0) + 1;
                }
            }

            // Average response latency
            $driver = DB::connection()->getDriverName();
            if ($driver === 'sqlite') {
                $latencyExpr = "strftime('%s', first_reply_at) - strftime('%s', created_at)";
            } else {
                $latencyExpr = "TIMESTAMPDIFF(SECOND, created_at, first_reply_at)";
            }

            $avgLatency = EmailThread::whereBetween('created_at', [$start, $end])
                ->withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->whereNotNull('first_reply_at')
                ->avg(DB::raw($latencyExpr));

            // SLA breaches count
            $slaBreaches = EmailThread::whereBetween('created_at', [$start, $end])
                ->withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('status', '!=', 'replied')
                ->where('status', '!=', 'archived')
                ->where('latest_message_received_at', '<', Carbon::now()->subMinutes(15))
                ->count();

            return [
                'jobs_raised' => $raised,
                'jobs_converted' => $converted,
                'conversion_rate_pct' => $conversionRate,
                'total_tonnage' => round($totalTonnage, 2),
                'avg_response_time_seconds' => round($avgLatency ?: 0.0),
                'sla_breaches' => $slaBreaches,
                'lanes' => $lanes,
            ];
        };

        $thisWeekStats = $getStats($thisWeekStart, Carbon::now());
        $priorWeekStats = $getStats($priorWeekStart, $thisWeekStart);

        $payload = [
            'current_week' => $thisWeekStats,
            'prior_week' => $priorWeekStats,
        ];

        // Call FastAPI
        $ocrUrl = rtrim(config('services.ocr.url'), '/') . '/executive-brief';
        try {
            $response = Http::timeout(15)->post($ocrUrl, [
                'stats' => $payload
            ]);

            if ($response->failed()) {
                throw new \RuntimeException('FastAPI executive-brief error: ' . $response->body());
            }

            $result = $response->json();
            return response()->json([
                'status' => true,
                'brief' => $result['brief'] ?? 'No brief returned.'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'error' => 'LLM Brief Writer offline. Technical details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save quarterly sales target.
     * POST /api/superadmin/analytics/sales-targets
     */
    public function saveSalesTarget(Request $request)
    {
        $request->validate([
            'target_type' => ['required', 'string', 'in:branch,user'],
            'target_id' => ['required', 'integer'],
            'quarter' => ['required', 'string', 'max:10'],
            'revenue_target' => ['nullable', 'numeric', 'min:0'],
            'tonnage_target' => ['nullable', 'numeric', 'min:0'],
        ]);

        // Verify target target_id exists
        if ($request->target_type === 'branch') {
            if (!Agent::where('id', $request->target_id)->exists()) {
                return response()->json(['error' => 'Branch (agent_info) does not exist.'], 422);
            }
        } else {
            if (!User::where('id', $request->target_id)->exists()) {
                return response()->json(['error' => 'User does not exist.'], 422);
            }
        }

        $target = SalesTarget::updateOrCreate(
            [
                'target_type' => $request->target_type,
                'target_id' => $request->target_id,
                'quarter' => $request->quarter,
            ],
            [
                'revenue_target' => $request->revenue_target,
                'tonnage_target' => $request->tonnage_target,
            ]
        );

        return response()->json([
            'status' => true,
            'message' => 'Sales target saved successfully.',
            'data' => $target
        ]);
    }

    /**
     * Fetch all sales targets list.
     * GET /api/superadmin/analytics/sales-targets
     */
    public function getSalesTargets(Request $request)
    {
        $targets = SalesTarget::orderBy('quarter', 'desc')->get();

        // Map names for frontend ease
        $mappedTargets = $targets->map(function ($target) {
            $name = 'Unknown';
            if ($target->target_type === 'branch') {
                $agent = Agent::find($target->target_id);
                $name = $agent ? $agent->agent_name : 'Unknown Branch';
            } else {
                $user = User::find($target->target_id);
                $name = $user ? $user->name : 'Unknown User';
            }
            $target->name = $name;
            return $target;
        });

        return response()->json([
            'status' => true,
            'data'   => $mappedTargets
        ]);
    }

    /**
     * Per-client stats for Command-tier Sales users.
     * GET /api/user/analytics/client-stats
     */
    public function getClientStats(Request $request)
    {
        $user = Auth::user();
        $agentId = $user->branch_name;

        if (!$agentId) {
            return response()->json(['error' => 'No branch context found.'], 400);
        }

        $period = $request->query('period', 'monthly');
        $daysRange = $period === 'yearly' ? 1825 : ($period === 'monthly' ? 365 : 30);
        $startDate = Carbon::now()->subDays($daysRange);

        $driver = DB::connection()->getDriverName();
        $monthExpr = $driver === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        // Fetch all distinct clients that have jobs in this branch
        $clientIds = Job::where('agent_id', $agentId)
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('client_id')
            ->whereNotNull('enquiry_no')
            ->distinct()
            ->pluck('client_id');

        $results = [];

        foreach ($clientIds as $clientId) {
            $client = Company::find($clientId);
            if (!$client) continue;

            $baseQ = Job::where('agent_id', $agentId)
                ->where('client_id', $clientId)
                ->whereNotNull('enquiry_no')
                ->where('created_at', '>=', $startDate);

            $raised    = (clone $baseQ)->count();
            $converted = (clone $baseQ)->whereNotNull('execution_job_no')->count();
            $lost      = (clone $baseQ)->where('status', 'Lost')->count();
            $replied   = (clone $baseQ)->whereHas('emailThreads', function ($q) {
                $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                  ->whereNotNull('first_reply_at');
            })->count();

            $slaBreached = (clone $baseQ)
                ->whereNull('execution_job_no')
                ->where('status', '!=', 'Lost')
                ->whereHas('emailThreads', function ($q) {
                    $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                      ->where('status', '!=', 'replied')
                      ->where('status', '!=', 'archived')
                      ->where('latest_message_received_at', '<', Carbon::now()->subMinutes(15));
                })->count();

            $conversionRate = $raised > 0 ? round(($converted / $raised) * 100, 1) : 0;

            // Month-on-month trend (last 6 months of raised counts)
            $trend = (clone $baseQ)
                ->select(DB::raw("$monthExpr as month"), DB::raw('count(*) as total'))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->limit(6)
                ->get()
                ->map(fn ($r) => ['month' => $r->month, 'total' => $r->total])
                ->values();

            // Top lanes for this client
            $jobs = (clone $baseQ)->with(['airShipmentDetail', 'seaShipmentDetail'])->get();
            $lanes = [];
            foreach ($jobs as $job) {
                $origin = $dest = '';
                if ($job->transport_mode === 'air' && $job->airShipmentDetail) {
                    $origin = $job->airShipmentDetail->pol_code;
                    $dest   = $job->airShipmentDetail->pod_code;
                } elseif ($job->transport_mode === 'sea' && $job->seaShipmentDetail) {
                    $origin = $job->seaShipmentDetail->pol_code;
                    $dest   = $job->seaShipmentDetail->pod_code;
                }
                if ($origin && $dest) {
                    $key = strtoupper($origin) . '→' . strtoupper($dest);
                    $lanes[$key] = ($lanes[$key] ?? 0) + 1;
                }
            }
            arsort($lanes);
            $topLanes = array_slice($lanes, 0, 3, true);

            $results[] = [
                'client_id'       => $clientId,
                'client_name'     => $client->name,
                'raised'          => $raised,
                'replied'         => $replied,
                'converted'       => $converted,
                'lost'            => $lost,
                'sla_breached'    => $slaBreached,
                'conversion_rate' => $conversionRate,
                'top_lanes'       => $topLanes,
                'trend'           => $trend,
            ];
        }

        // Sort by raised desc
        usort($results, fn ($a, $b) => $b['raised'] <=> $a['raised']);

        return response()->json([
            'status' => true,
            'data'   => $results,
        ]);
    }
}
