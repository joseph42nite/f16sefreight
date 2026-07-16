<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Job;
use App\EmailThread;
use App\User;
use App\Company;
use App\Agent;
use App\SalesTarget;
use App\MailboxConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BossAnalyticsController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $user = Auth::user();
            if (!$user || $user->designation !== 'boss') {
                return response()->json(['error' => 'Unauthorized. Boss designation required.'], 403);
            }
            return $next($request);
        });
    }

    /**
     * Resolve all branch names (agent_ids) that belong to this boss's company.
     */
    protected function getCompanyBranchNames(User $boss): array
    {
        // All users in same company → get their distinct branch_names
        return User::where('company_name', $boss->company_name)
            ->whereNotNull('branch_name')
            ->distinct()
            ->pluck('branch_name')
            ->toArray();
    }

    /**
     * Helper: date expression by driver and period
     */
    protected function getDateExpression(string $column = 'created_at', string $period = 'daily'): string
    {
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite') {
            return $period === 'monthly'
                ? "strftime('%Y-%m', $column)"
                : ($period === 'yearly' ? "strftime('%Y', $column)" : "strftime('%Y-%m-%d', $column)");
        }
        return $period === 'monthly'
            ? "DATE_FORMAT($column, '%Y-%m')"
            : ($period === 'yearly' ? "YEAR($column)" : "DATE($column)");
    }

    /**
     * GET /api/user/analytics/boss/branch-summary
     * Per-branch stats for the company.
     */
    public function getBranchSummary(Request $request)
    {
        $boss = Auth::user();
        $branchNames = $this->getCompanyBranchNames($boss);

        if (empty($branchNames)) {
            return response()->json(['status' => true, 'data' => [], 'totals' => []]);
        }

        $period = $request->query('period', 'monthly');
        $daysRange = $period === 'yearly' ? 1825 : ($period === 'monthly' ? 365 : 30);
        $startDate = Carbon::now()->subDays($daysRange);

        $results = [];
        $grandRaised = 0;
        $grandConverted = 0;
        $grandSla = 0;

        foreach ($branchNames as $branchId) {
            $agent = Agent::where('id', $branchId)
                ->orWhere('agent_name', $branchId)
                ->first();
            $branchLabel = $agent ? $agent->agent_name : $branchId;

            $baseQ = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('agent_id', $branchId)
                ->whereNotNull('enquiry_no')
                ->where('created_at', '>=', $startDate);

            $raised    = (clone $baseQ)->count();
            $converted = (clone $baseQ)->whereNotNull('execution_job_no')->count();
            $convRate  = $raised > 0 ? round(($converted / $raised) * 100, 1) : 0;

            $slaBreached = (clone $baseQ)
                ->whereNull('execution_job_no')
                ->where('status', '!=', 'Lost')
                ->whereHas('emailThreads', function ($q) {
                    $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                      ->where('status', '!=', 'replied')
                      ->where('status', '!=', 'archived')
                      ->where('latest_message_received_at', '<', Carbon::now()->subMinutes(15));
                })->count();

            $staffCount = User::where('branch_name', $branchId)->count();

            // Month-on-month trend (6 months)
            $dateExpr = $this->getDateExpression('created_at', 'monthly');
            $trend = (clone $baseQ)
                ->select(DB::raw("$dateExpr as month"), DB::raw('count(*) as total'))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->limit(6)
                ->get()
                ->map(fn ($r) => ['month' => $r->month, 'total' => $r->total])
                ->values();

            $grandRaised    += $raised;
            $grandConverted += $converted;
            $grandSla       += $slaBreached;

            $results[] = [
                'branch_id'       => $branchId,
                'branch_name'     => $branchLabel,
                'raised'          => $raised,
                'converted'       => $converted,
                'conversion_rate' => $convRate,
                'sla_breached'    => $slaBreached,
                'staff_count'     => $staffCount,
                'trend'           => $trend,
            ];
        }

        usort($results, fn ($a, $b) => $b['raised'] <=> $a['raised']);

        return response()->json([
            'status' => true,
            'data'   => $results,
            'totals' => [
                'raised'       => $grandRaised,
                'converted'    => $grandConverted,
                'sla_breached' => $grandSla,
                'branches'     => count($branchNames),
            ],
        ]);
    }

    /**
     * GET /api/user/analytics/boss/staff-all
     * All staff across all branches for this company.
     */
    public function getAllStaff(Request $request)
    {
        $boss = Auth::user();
        $branchNames = $this->getCompanyBranchNames($boss);

        if (empty($branchNames)) {
            return response()->json(['status' => true, 'data' => []]);
        }

        $staff = User::whereIn('branch_name', $branchNames)
            ->where('id', '!=', $boss->id)
            ->get();

        $staffData = $staff->map(function ($member) {
            $activeJobsQuery = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('operator_id', $member->id)
                ->whereNotIn('status', ['Completed', 'Lost']);

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
                $oliScore += ($grossWeight / 1000.0) * $multiplier;
            }

            return [
                'user_id'          => $member->id,
                'name'             => $member->name,
                'designation'      => $member->designation,
                'branch_name'      => $member->branch_name,
                'active_jobs_count' => $activeJobs->count(),
                'oli_score'        => round($oliScore, 2),
            ];
        });

        return response()->json([
            'status' => true,
            'data'   => $staffData->values(),
        ]);
    }

    /**
     * GET /api/user/analytics/boss/action-items
     * Aggregated alert items needing boss attention.
     */
    public function getActionItems(Request $request)
    {
        $boss = Auth::user();
        $branchNames = $this->getCompanyBranchNames($boss);

        $alerts = [];

        foreach ($branchNames as $branchId) {
            $agent = Agent::where('id', $branchId)
                ->orWhere('agent_name', $branchId)
                ->first();
            $branchLabel = $agent ? $agent->agent_name : $branchId;

            // SLA breaches
            $slaBreached = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('agent_id', $branchId)
                ->whereNotNull('enquiry_no')
                ->whereNull('execution_job_no')
                ->where('status', '!=', 'Lost')
                ->whereHas('emailThreads', function ($q) {
                    $q->withoutGlobalScope(\App\Scopes\PortalScope::class)
                      ->where('status', '!=', 'replied')
                      ->where('status', '!=', 'archived')
                      ->where('latest_message_received_at', '<', Carbon::now()->subMinutes(15));
                })->count();

            if ($slaBreached > 0) {
                $alerts[] = [
                    'severity'    => 'danger',
                    'branch_name' => $branchLabel,
                    'type'        => 'sla_breach',
                    'title'       => "$slaBreached SLA Breach" . ($slaBreached > 1 ? 'es' : ''),
                    'description' => "Branch $branchLabel has $slaBreached enquir" . ($slaBreached > 1 ? 'ies' : 'y') . " awaiting reply for >15 min.",
                ];
            }

            // Unassigned jobs (no operator_id)
            $unassigned = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('agent_id', $branchId)
                ->whereNotNull('enquiry_no')
                ->whereNull('operator_id')
                ->whereNotIn('status', ['Completed', 'Lost'])
                ->count();

            if ($unassigned > 0) {
                $alerts[] = [
                    'severity'    => 'warning',
                    'branch_name' => $branchLabel,
                    'type'        => 'unassigned',
                    'title'       => "$unassigned Unassigned Job" . ($unassigned > 1 ? 's' : ''),
                    'description' => "$unassigned active job" . ($unassigned > 1 ? 's have' : ' has') . " no operator assigned in $branchLabel.",
                ];
            }

            // Branches with zero conversions this calendar month
            $monthStart = Carbon::now()->startOfMonth();
            $raised   = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('agent_id', $branchId)
                ->whereNotNull('enquiry_no')
                ->where('created_at', '>=', $monthStart)
                ->count();
            $converted = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->where('agent_id', $branchId)
                ->whereNotNull('execution_job_no')
                ->where('created_at', '>=', $monthStart)
                ->count();

            if ($raised > 0 && $converted === 0) {
                $alerts[] = [
                    'severity'    => 'warning',
                    'branch_name' => $branchLabel,
                    'type'        => 'zero_conversion',
                    'title'       => 'Zero Conversions This Month',
                    'description' => "$branchLabel raised $raised enquir" . ($raised > 1 ? 'ies' : 'y') . " this month but converted 0.",
                ];
            }
        }

        // Sort by severity: danger first
        usort($alerts, function ($a, $b) {
            $weight = ['danger' => 0, 'warning' => 1, 'info' => 2];
            return ($weight[$a['severity']] ?? 9) - ($weight[$b['severity']] ?? 9);
        });

        return response()->json([
            'status' => true,
            'data'   => $alerts,
        ]);
    }

    /**
     * GET /api/user/analytics/boss/client-all
     * All clients across all branches of the company (Command tier only).
     */
    public function getAllClients(Request $request)
    {
        $boss = Auth::user();
        $company = Company::where('name', $boss->company_name)->first();

        if (!$company || $company->tier !== 'viper_command') {
            return response()->json(['error' => 'Viper Command tier required.'], 403);
        }

        $branchNames = $this->getCompanyBranchNames($boss);

        $period = $request->query('period', 'monthly');
        $daysRange = $period === 'yearly' ? 1825 : ($period === 'monthly' ? 365 : 30);
        $startDate = Carbon::now()->subDays($daysRange);

        $driver = DB::connection()->getDriverName();
        $monthExpr = $driver === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        $clientIds = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
            ->whereIn('agent_id', $branchNames)
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('client_id')
            ->whereNotNull('enquiry_no')
            ->distinct()
            ->pluck('client_id');

        $results = [];

        foreach ($clientIds as $clientId) {
            $client = Company::find($clientId);
            if (!$client) continue;

            $baseQ = Job::withoutGlobalScope(\App\Scopes\PortalScope::class)
                ->whereIn('agent_id', $branchNames)
                ->where('client_id', $clientId)
                ->whereNotNull('enquiry_no')
                ->where('created_at', '>=', $startDate);

            $raised    = (clone $baseQ)->count();
            $converted = (clone $baseQ)->whereNotNull('execution_job_no')->count();
            $lost      = (clone $baseQ)->where('status', 'Lost')->count();
            $replied   = (clone $baseQ)->whereHas('emailThreads', function ($q) {
                $q->withoutGlobalScope(\App\Scopes\PortalScope::class)->whereNotNull('first_reply_at');
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

            $trend = (clone $baseQ)
                ->select(DB::raw("$monthExpr as month"), DB::raw('count(*) as total'))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->limit(6)
                ->get()
                ->map(fn ($r) => ['month' => $r->month, 'total' => $r->total])
                ->values();

            // Which branches handle this client
            $activeBranches = (clone $baseQ)
                ->select('agent_id')
                ->distinct()
                ->pluck('agent_id')
                ->toArray();

            $results[] = [
                'client_id'       => $clientId,
                'client_name'     => $client->name,
                'raised'          => $raised,
                'replied'         => $replied,
                'converted'       => $converted,
                'lost'            => $lost,
                'sla_breached'    => $slaBreached,
                'conversion_rate' => $conversionRate,
                'branches'        => count($activeBranches),
                'trend'           => $trend,
            ];
        }

        usort($results, fn ($a, $b) => $b['raised'] <=> $a['raised']);

        return response()->json(['status' => true, 'data' => $results]);
    }

    /**
     * GET /api/user/analytics/boss/sales-targets
     * Fetch sales targets for this company's branches and staff.
     */
    public function getSalesTargets(Request $request)
    {
        $boss = Auth::user();
        $branchNames = $this->getCompanyBranchNames($boss);

        $companyUserIds = User::where('company_name', $boss->company_name)
            ->pluck('id')->toArray();

        $targets = SalesTarget::where(function ($q) use ($branchNames, $companyUserIds) {
            $q->where(function ($inner) use ($branchNames) {
                $inner->where('target_type', 'branch')
                      ->whereIn('target_id', function ($subq) use ($branchNames) {
                          $subq->select('id')
                               ->from('agents_info')
                               ->whereIn('id', $branchNames)
                               ->orWhereIn('agent_name', $branchNames);
                      });
            })->orWhere(function ($inner) use ($companyUserIds) {
                $inner->where('target_type', 'user')
                      ->whereIn('target_id', $companyUserIds);
            });
        })->orderBy('quarter', 'desc')->get();

        $mapped = $targets->map(function ($t) {
            $name = 'Unknown';
            if ($t->target_type === 'branch') {
                $agent = Agent::find($t->target_id);
                $name = $agent ? $agent->agent_name : 'Unknown Branch';
            } else {
                $user = User::find($t->target_id);
                $name = $user ? $user->name : 'Unknown User';
            }
            $t->name = $name;
            return $t;
        });

        return response()->json(['status' => true, 'data' => $mapped]);
    }

    /**
     * POST /api/user/analytics/boss/sales-targets
     * Save/update a sales target (company-scoped, boss only).
     */
    public function saveSalesTarget(Request $request)
    {
        $request->validate([
            'target_type'    => ['required', 'string', 'in:branch,user'],
            'target_id'      => ['required', 'integer'],
            'quarter'        => ['required', 'string', 'max:10'],
            'revenue_target' => ['nullable', 'numeric', 'min:0'],
            'tonnage_target' => ['nullable', 'numeric', 'min:0'],
        ]);

        $boss = Auth::user();
        $branchNames = $this->getCompanyBranchNames($boss);
        $companyUserIds = User::where('company_name', $boss->company_name)
            ->pluck('id')->toArray();

        // Ensure boss can only set targets for their own company
        if ($request->target_type === 'user') {
            if (!in_array($request->target_id, $companyUserIds)) {
                return response()->json(['error' => 'User does not belong to your company.'], 403);
            }
        }

        $target = SalesTarget::updateOrCreate(
            [
                'target_type' => $request->target_type,
                'target_id'   => $request->target_id,
                'quarter'     => $request->quarter,
            ],
            [
                'revenue_target' => $request->revenue_target,
                'tonnage_target' => $request->tonnage_target,
            ]
        );

        return response()->json([
            'status'  => true,
            'message' => 'Sales target saved successfully.',
            'data'    => $target,
        ]);
    }
}
