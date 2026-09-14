<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Services\AiUsageService;
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
    public function __construct(private AiUsageService $usage)
    {
    }

    public function index(): JsonResponse
    {
        $settings = $this->usage->settings();
        $rate = (float) $settings->usd_to_inr;
        $since = now()->startOfMonth();

        $byCompany = DB::table('llm_usage_logs as l')
            ->leftJoin('agents_info as a', 'a.id', '=', 'l.agent_id')
            ->leftJoin('companies as c', 'c.id', '=', 'a.company_id')
            ->where('l.created_at', '>=', $since)
            ->groupBy('c.id', 'c.name')
            ->orderByRaw('SUM(l.cost_usd) DESC')
            ->get(['c.id', 'c.name', DB::raw('COUNT(*) AS calls'), DB::raw('SUM(l.cost_usd) AS cost_usd')])
            ->map(fn ($r) => ['company' => $r->name ?? 'No branch', 'calls' => (int) $r->calls,
                              'cost_inr' => round((float) $r->cost_usd * $rate, 2)]);

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
            ->groupBy('provider', 'purpose')
            ->get(['provider', 'purpose', DB::raw('COUNT(*) AS calls'), DB::raw('ROUND(AVG(execution_ms)) AS avg_ms'),
                   DB::raw('SUM(attempts > 1) AS retried')]);

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
        ]);
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
