<?php

namespace App\Services;

use App\PdfProcessingJob;
use App\Support\UserContext;
use App\User;
use Illuminate\Support\Facades\DB;

/**
 * What the hosted model has cost, and whether a user may call it again today (user, 2026-09-14).
 *
 * 🔴 Two limits, deliberately different in kind:
 * - the per-user DAILY limit stops that user's calls — the document is still read by labels, and
 *   the panel says why;
 * - the monthly BUDGET never stops anything. It is shown in the superadmin portal when reached,
 *   and the credit limit on the OpenRouter key is the hard stop.
 */
class AiUsageService
{
    /** The single settings row, created with the defaults on first use. */
    public function settings(): object
    {
        $row = DB::table('ai_budget_settings')->orderBy('id')->first();

        if ($row === null) {
            DB::table('ai_budget_settings')->insert(['created_at' => now(), 'updated_at' => now()]);
            $row = DB::table('ai_budget_settings')->orderBy('id')->first();
        }

        return $row;
    }

    /** Documents this user has had read by the model since midnight (app timezone). Help questions are counted separately. */
    public function callsToday(?int $userId): int
    {
        if ($userId === null) {
            return 0;
        }

        return DB::table('llm_usage_logs')->where('user_id', $userId)->whereIn('purpose', ['text', 'vision'])
            ->where('created_at', '>=', today())->count();
    }

    /** Help questions this user has asked since midnight — their own limit (user, 2026-09-14). */
    public function questionsToday(?int $userId): int
    {
        return $userId === null ? 0
            : DB::table('help_questions')->where('user_id', $userId)->where('created_at', '>=', today())->count();
    }

    public function mayAsk(?int $userId): bool
    {
        return $userId === null || $this->questionsToday($userId) < (int) $this->settings()->per_user_daily_questions;
    }

    /**
     * Whether the free Gemma should be tried first now (user, 2026-09-15): between 9pm and 11am India time, and only
     * for the kinds of work superadmin has switched on. `$use` is 'extraction', or 'help' / 'draft'.
     */
    public function freeFirst(string $use): bool
    {
        $settings = $this->settings();
        $on = $use === 'extraction' ? $settings->night_free_extraction : $settings->night_free_help_drafts;
        $hour = now('Asia/Kolkata')->hour;

        return (bool) $on && ($hour >= (int) config('services.openrouter.free_from_hour') || $hour < (int) config('services.openrouter.free_until_hour'));
    }

    /** Whether this user may call the model now. A job with no user is never limited. */
    public function allowed(?int $userId): bool
    {
        return $userId === null || $this->callsToday($userId) < (int) $this->settings()->per_user_daily_limit;
    }

    /**
     * Log one answered call against the job's user and branch.
     *
     * @param  array{model?: string, provider?: ?string, tokens_in?: int, tokens_out?: int,
     *               cost_usd?: float, execution_ms?: int, attempts?: int}  $usage  from the parser
     */
    public function record(PdfProcessingJob $job, array $usage, string $purpose): void
    {
        $this->log($usage, $purpose, $job->user_id ? User::find($job->user_id) : null, [
            'enquiry_id' => $job->enquiry_id, 'job_id' => $job->job_id, 'pdf_processing_job_id' => $job->id,
        ]);
    }

    /**
     * Log any model call: a document, a help question (`help`), or indexing a help document (`help_index`).
     *
     * @param  array  $refs  enquiry_id / job_id / pdf_processing_job_id, where there are any
     */
    public function log(array $usage, string $purpose, ?User $user = null, array $refs = []): void
    {
        $context = $user ? UserContext::for($user) : null;

        DB::table('llm_usage_logs')->insert([
            'agent_id'              => $context?->agentId,
            // The company the call is charged to — its monthly AI limit (CompanyAiBudget).
            'company_id'            => $context?->companyId,
            'user_id'               => $user?->id,
            'enquiry_id'            => $refs['enquiry_id'] ?? null,
            'job_id'                => $refs['job_id'] ?? null,
            'pdf_processing_job_id' => $refs['pdf_processing_job_id'] ?? null,
            'model'                 => mb_substr((string) ($usage['model'] ?? 'unknown'), 0, 50),
            'purpose'               => $purpose,
            'provider'              => isset($usage['provider']) ? mb_substr((string) $usage['provider'], 0, 60) : null,
            'tokens_in'             => (int) ($usage['tokens_in'] ?? 0),
            'tokens_out'            => (int) ($usage['tokens_out'] ?? 0),
            'cost_usd'              => round((float) ($usage['cost_usd'] ?? 0), 6),
            'execution_ms'          => (int) ($usage['execution_ms'] ?? 0),
            'attempts'              => (int) ($usage['attempts'] ?? 1),
            'tier'                  => in_array($usage['tier'] ?? null, ['free', 'economy', 'fast'], true) ? $usage['tier'] : null,
            'created_at'            => now(),
            'updated_at'            => now(),
        ]);
    }

    /**
     * This month's spend against the budget.
     *
     * @return array{spend_usd: float, spend_inr: float, budget_inr: float, used_percent: float, over_budget: bool, calls: int}
     */
    public function month(): array
    {
        $settings = $this->settings();
        $row = DB::table('llm_usage_logs')->where('created_at', '>=', now()->startOfMonth())
            ->selectRaw('COALESCE(SUM(cost_usd), 0) AS usd, COUNT(*) AS calls')->first();

        $inr = round((float) $row->usd * (float) $settings->usd_to_inr, 2);
        $budget = (float) $settings->monthly_budget_inr;

        return [
            'spend_usd'    => round((float) $row->usd, 4),
            'spend_inr'    => $inr,
            'budget_inr'   => $budget,
            'used_percent' => $budget > 0 ? round($inr / $budget * 100, 1) : 0.0,
            'over_budget'  => $budget > 0 && $inr >= $budget,
            'calls'        => (int) $row->calls,
        ];
    }
}
