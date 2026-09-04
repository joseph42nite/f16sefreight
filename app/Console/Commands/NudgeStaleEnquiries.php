<?php

namespace App\Console\Commands;

use App\Enquiry;
use App\Enums\EnquiryStatus;
use App\Services\AuditLogger;
use App\TenantPolicy;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Nudges pricing to decide on enquiries the client has gone quiet on — and, after the
 * configured number of unanswered reminders, makes the decision itself.
 *
 * The window resolves **branch → company → config** (`stale_enquiry_days`, default 7), so
 * a tenant or a single branch can tune it without a code change. Every step needs the
 * window to elapse again, so at the defaults:
 *
 *     day  7   nudge 1
 *     day 14   nudge 2
 *     day 21   marked lost automatically (`delay_in_response`)
 *
 * ⚠️ The configured default of 7 days is a STARTING POINT, not a specified value —
 * PRD.md §5.4 says only "the tenant's configured stale window" and never states a number
 * (GAPS.md #9). Confirm with the business before launch: too short nags the desk, too
 * long defeats the point.
 *
 * 🔴 **The auto-close is a claim the desk can overturn, not a verdict.** It is recorded
 * with `lost_automatically = true` precisely so it never masquerades as a human's
 * diagnosis, and reopening clears the whole loss. A system that silently invented
 * "rates were too high" would corrupt the one report the reason field exists for.
 */
class NudgeStaleEnquiries extends Command
{
    protected $signature = 'enquiries:nudge-stale';

    protected $description = 'Prompt pricing to make an explicit keep-or-lose decision on inactive enquiries, and close the ones nobody answered';

    public function __construct(private AuditLogger $audit)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $nudged = 0;
        $closed = 0;

        // Group by branch so each resolves its own window once, rather than per enquiry.
        $branches = DB::table('enquiries')->whereNull('deleted_at')->distinct()->pluck('agent_id');

        foreach ($branches as $agentId) {
            $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');

            if ($companyId === null) {
                continue;
            }

            $days = (int) (TenantPolicy::resolve($companyId, $agentId, 'stale_enquiry_days')
                ?? config('f16s.policies.stale_enquiry_days', 7));

            $attempts = (int) (TenantPolicy::resolve($companyId, $agentId, 'stale_nudge_attempts')
                ?? config('f16s.policies.stale_nudge_attempts', 2));

            // 🔴 CLOSE FIRST, then nudge. Both queries match on the same elapsed window,
            // so nudging first would bump `stale_nudged_at` on the very rows that were
            // due to close — and nothing would ever close, at any setting.
            $closed += $attempts > 0 ? $this->closeExhausted($agentId, $days, $attempts) : 0;
            $nudged += $this->nudge($agentId, $days, $attempts);
        }

        $this->info("{$nudged} stale enquiry/enquiries nudged, {$closed} closed automatically.");

        return self::SUCCESS;
    }

    /** One more reminder, and a record of how many that makes. */
    private function nudge(int $agentId, int $days, int $attempts): int
    {
        $count = 0;

        $stale = Enquiry::withoutGlobalScopes()
            ->where('agent_id', $agentId)
            ->stale($days)
            // Already had every reminder it was going to get; closeExhausted owns it now.
            ->when($attempts > 0, fn ($q) => $q->where('stale_nudge_count', '<', $attempts))
            ->get();

        foreach ($stale as $enquiry) {
            $enquiry->forceFill([
                'stale_nudged_at'   => now(),
                'stale_nudge_count' => $enquiry->stale_nudge_count + 1,
            ])->saveQuietly();

            $count++;
        }

        return $count;
    }

    /**
     * Silent through every reminder. The enquiry is closed so it stops inflating the open
     * pipeline, with the fact that a machine closed it recorded alongside.
     */
    private function closeExhausted(int $agentId, int $days, int $attempts): int
    {
        $count = 0;

        $exhausted = Enquiry::withoutGlobalScopes()
            ->where('agent_id', $agentId)
            ->exhaustedNudges($days, $attempts)
            // ⚠️ A converted enquiry can never be marked lost — EnquiryObserver throws,
            // and an uncaught LogicException here would abort the sweep for every
            // remaining branch. The status filter should already exclude these; this is
            // the belt to that braces, because a scheduler must not be fragile.
            ->doesntHave('jobs')
            ->get();

        foreach ($exhausted as $enquiry) {
            $enquiry->update([
                'status'             => EnquiryStatus::Lost,
                'lost_reason'        => 'delay_in_response',
                'lost_automatically' => true,
            ]);

            // Attributed to the branch's system actor, not to whoever last touched it.
            $this->audit->recordSystem($agentId, 'enquiry.lost_automatically', 'enquiry', $enquiry->id);

            $count++;
        }

        return $count;
    }
}
