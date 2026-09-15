<?php

namespace App\Http\Controllers\Freight;

use App\Company;
use App\Http\Controllers\Controller;
use App\Services\CompanyAiBudget;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * The Boss's view of their company's AI use (user, 2026-09-15): how much of this month's AI allowance and of
 * today's budget is used, and on what. Shares and counts, not the provider's ₹ costs — the limit is set by F16s.
 */
class CompanyAiUsageController extends Controller
{
    public function show(CompanyAiBudget $budget): JsonResponse
    {
        $context = UserContext::for(auth()->user());
        abort_unless($context->designation === 'boss', 403);

        $company = Company::withoutGlobalScopes()->findOrFail($context->companyId);
        $status = $budget->status($company);

        $use = DB::table('llm_usage_logs')->where('company_id', $company->id)->where('created_at', '>=', now()->startOfMonth())
            ->first([DB::raw("SUM(purpose IN ('text', 'vision')) AS documents"), DB::raw("SUM(purpose = 'help') AS help"),
                     DB::raw("SUM(purpose = 'sales_draft') AS drafts")]);

        return response()->json([
            'has_limit' => $status['limit'] > 0,
            'used_month_percent' => $status['used_month_percent'],
            'used_today_percent' => $status['used_today_percent'],
            'days_left' => $status['days_left'],
            'other_uses_share_percent' => (int) (CompanyAiBudget::OTHER_USES_SHARE * 100),
            'month' => ['documents' => (int) $use->documents, 'help' => (int) $use->help, 'drafts' => (int) $use->drafts],
        ]);
    }
}
