<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Company;
use App\Services\AiUsageService;
use App\Services\CompanyAiBudget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * What Gemma 4 on OpenRouter has cost this month, and the controls on it (user, 2026-09-14).
 *
 * 🔒 Superadmin only: the budget is F16s's money across every tenant, not a client's setting.
 */
class AiUsageController extends Controller
{
    public function __construct(private AiUsageService $usage, private CompanyAiBudget $budget)
    {
    }

    public function index(): JsonResponse
    {
        $settings = $this->usage->settings();
        $rate = (float) $settings->usd_to_inr;
        $since = now()->startOfMonth();

        $byCompany = $this->companies($rate, $since);

        $byUser = DB::table('llm_usage_logs as l')
            ->leftJoin('users as u', 'u.id', '=', 'l.user_id')
            ->where('l.created_at', '>=', $since)
            ->groupBy('u.id', 'u.name', 'u.email')
            ->orderByRaw('SUM(l.cost_usd) DESC')
            ->limit(20)
            ->get(['u.id', 'u.name', 'u.email', DB::raw('COUNT(*) AS calls'), DB::raw('SUM(l.cost_usd) AS cost_usd'),
                   DB::raw("SUM(l.created_at >= '" . today()->toDateTimeString() . "') AS calls_today")])
            ->map(fn ($r) => ['name' => $r->name, 'email' => $r->email, 'calls' => (int) $r->calls,
                              'calls_today' => (int) $r->calls_today, 'cost_inr' => round((float) $r->cost_usd * $rate, 2)]);

        // How the providers have behaved: a slow or often-retried one shows up here first.
        $byProvider = DB::table('llm_usage_logs')
            ->where('created_at', '>=', $since)
            ->groupBy('provider', 'tier', 'purpose')
            ->get(['provider', 'tier', 'purpose', DB::raw('COUNT(*) AS calls'), DB::raw('ROUND(AVG(execution_ms)) AS avg_ms'),
                   DB::raw('SUM(attempts > 1) AS retried')]);

        // 🔴 Cheap first, fast fallback always: how often the fallback (≈ 6× the cost) was needed.
        $tiers = DB::table('llm_usage_logs')->where('created_at', '>=', $since)->whereNotNull('tier')
            ->groupBy('tier')->get(['tier', DB::raw('COUNT(*) AS calls'), DB::raw('SUM(cost_usd) AS cost_usd'),
                                    DB::raw('ROUND(AVG(execution_ms)) AS avg_ms')])->keyBy('tier');
        $tierCalls = (int) $tiers->sum('calls');
        $tierShape = fn (string $tier) => [
            'calls' => (int) ($tiers[$tier]->calls ?? 0),
            'share_percent' => $tierCalls ? round(($tiers[$tier]->calls ?? 0) / $tierCalls * 100, 1) : 0.0,
            'cost_inr' => round((float) ($tiers[$tier]->cost_usd ?? 0) * $rate, 2),
            'avg_seconds' => round((float) ($tiers[$tier]->avg_ms ?? 0) / 1000, 1),
        ];

        return response()->json([
            'settings'    => [
                'monthly_budget_inr'   => (float) $settings->monthly_budget_inr,
                'usd_to_inr'           => $rate,
                'per_user_daily_limit' => (int) $settings->per_user_daily_limit,
                'per_user_daily_questions' => (int) $settings->per_user_daily_questions,
            ],
            'month'       => $this->usage->month(),
            'by_company'  => $byCompany,
            'by_user'     => $byUser,
            'by_provider' => $byProvider,
            'tiers'       => ['economy' => $tierShape('economy'), 'fast' => $tierShape('fast')],
        ]);
    }

    /**
     * Every company with its AI use this month by kind, its monthly limit, and today's rolling budget
     * (CompanyAiBudget). Tenant companies only — calls with no company are F16s's own help indexing.
     */
    private function companies(float $rate, $since)
    {
        $use = DB::table('llm_usage_logs')->where('created_at', '>=', $since)->whereNotNull('company_id')
            ->groupBy('company_id')
            ->get(['company_id', DB::raw('COUNT(*) AS calls'), DB::raw('SUM(cost_usd) AS cost_usd'),
                   DB::raw("SUM(purpose IN ('text', 'vision')) AS documents"), DB::raw("SUM(purpose = 'help') AS help"),
                   DB::raw("SUM(purpose = 'sales_draft') AS drafts")])
            ->keyBy('company_id');

        return Company::withoutGlobalScopes()->orderBy('name')->get()->map(function (Company $c) use ($use, $rate) {
            $u = $use[$c->id] ?? null;

            return ['id' => $c->id, 'company' => $c->name, 'tier' => $c->tier,
                'calls' => (int) ($u->calls ?? 0), 'cost_inr' => round((float) ($u->cost_usd ?? 0) * $rate, 2),
                'documents' => (int) ($u->documents ?? 0), 'help' => (int) ($u->help ?? 0), 'drafts' => (int) ($u->drafts ?? 0),
                'budget' => $this->budget->status($c)];
        })->sortByDesc('cost_inr')->values();
    }

    /** Set a company's monthly AI limit in ₹, or clear it (NULL) to follow the plan. */
    public function updateCompanyLimit(Request $request, int $company): JsonResponse
    {
        $data = $request->validate(['ai_monthly_limit_inr' => ['nullable', 'numeric', 'min:0', 'max:10000000']]);

        Company::withoutGlobalScopes()->findOrFail($company)->update(['ai_monthly_limit_inr' => $data['ai_monthly_limit_inr']]);

        return $this->index();
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'monthly_budget_inr'   => ['required', 'numeric', 'min:0', 'max:10000000'],
            'usd_to_inr'           => ['required', 'numeric', 'min:1', 'max:1000'],
            'per_user_daily_limit' => ['required', 'integer', 'min:0', 'max:100000'],
            'per_user_daily_questions' => ['nullable', 'integer', 'min:0', 'max:100000'],
        ]);

        $data = array_filter($data, fn ($v) => $v !== null);

        $settings = $this->usage->settings();

        DB::table('ai_budget_settings')->where('id', $settings->id)->update($data + [
            'updated_by' => auth('superAdmin-api')->id(),
            'updated_at' => now(),
        ]);

        return $this->index();
    }
}
