<?php

namespace App\Services;

use App\Company;
use Illuminate\Support\Facades\DB;

/**
 * A company's AI budget (user, 2026-09-15): a monthly limit in ₹ that grows with the team (the larger of the plan
 * minimum and AI users × ₹150), spent through a rolling daily budget, with document extraction first.
 *
 *     today's budget = (monthly limit − spent before today) ÷ days left in the month, today included
 *
 * so what a quiet day leaves carries forward. Within the day:
 *   - up to 70 % — everything: extraction, help questions, email drafts
 *   - 70–100 %   — extraction only; the rest is kept for reading documents
 *   - 100 %      — AI stops until tomorrow; at the monthly limit, until next month
 *
 * When AI is not allowed, the work still happens without it: documents are read by labels, help says to raise
 * a ticket, drafts use the plain template.
 */
class CompanyAiBudget
{
    /** Share of today's budget that help questions and email drafts may use. */
    public const OTHER_USES_SHARE = 0.70;

    /** Extraction purposes — they keep the whole day. */
    private const EXTRACTION = ['text', 'vision'];

    public function __construct(private readonly AiUsageService $usage) {}

    public function limitInr(Company $company): float
    {
        return (float) ($company->ai_monthly_limit_inr ?? $this->planLimit($company));
    }

    /** The plan's limit for this team: the larger of the plan minimum and AI users × the per-user amount. */
    public function planLimit(Company $company): float
    {
        return max(
            (float) config("f16s.ai_monthly_limit_inr.{$company->tier}", 0),
            $this->aiUsers($company) * (float) config("f16s.ai_per_user_inr.{$company->tier}", 0)
        );
    }

    /** Active staff who use AI — pricing, operations and sales — across the company's branches. */
    public function aiUsers(Company $company): int
    {
        return DB::table('users')
            ->whereIn('branch_name', DB::table('agents_info')->where('company_id', $company->id)->select('id'))
            ->whereIn('designation', config('f16s.ai_user_designations'))
            ->where('is_active', 1)
            ->count();
    }

    /**
     * @return array{limit: float, spent_month: float, spent_today: float, days_left: int, today_budget: float,
     *               used_month_percent: ?float, used_today_percent: ?float, overridden: bool}
     */
    public function status(Company $company): array
    {
        $limit = $this->limitInr($company);
        $rate = (float) $this->usage->settings()->usd_to_inr;
        $spent = fn ($from) => (float) DB::table('llm_usage_logs')
            ->where('company_id', $company->id)->where('created_at', '>=', $from)->sum('cost_usd') * $rate;

        $spentMonth = $spent(now()->startOfMonth());
        $spentToday = $spent(today());
        $daysLeft = now()->daysInMonth - now()->day + 1;
        $todayBudget = max($limit - ($spentMonth - $spentToday), 0) / $daysLeft;

        return [
            'limit' => round($limit, 2),
            'spent_month' => round($spentMonth, 2),
            'spent_today' => round($spentToday, 2),
            'days_left' => $daysLeft,
            'today_budget' => round($todayBudget, 2),
            'used_month_percent' => $limit > 0 ? round($spentMonth * 100 / $limit, 1) : null,
            'used_today_percent' => $todayBudget > 0 ? round($spentToday * 100 / $todayBudget, 1) : null,
            'overridden' => $company->ai_monthly_limit_inr !== null,
            // How the plan limit is reached, for superadmin: the larger of the minimum and users × per user.
            'ai_users' => $this->aiUsers($company),
            'per_user' => (float) config("f16s.ai_per_user_inr.{$company->tier}", 0),
            'plan_minimum' => (float) config("f16s.ai_monthly_limit_inr.{$company->tier}", 0),
            'plan_limit' => $this->planLimit($company),
        ];
    }

    /** NULL when this use may call the AI now, else a sentence saying why not. */
    public function refusal(?Company $company, string $purpose): ?string
    {
        // Calls with no company (superadmin indexing help documents) are F16s's own and not limited here.
        if ($company === null) {
            return null;
        }

        $s = $this->status($company);

        if ($s['limit'] <= 0) {
            return 'AI is not included for your company — ask F16s to set an AI limit';
        }

        if ($s['spent_month'] >= $s['limit']) {
            return "your company's AI limit for this month is used up";
        }

        if ($s['spent_today'] >= $s['today_budget']) {
            return "your company's AI budget for today is used up — it continues tomorrow";
        }

        if (! in_array($purpose, self::EXTRACTION, true) && $s['spent_today'] >= $s['today_budget'] * self::OTHER_USES_SHARE) {
            return "today's remaining AI budget is kept for reading documents";
        }

        return null;
    }
}
