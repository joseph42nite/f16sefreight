<?php

namespace App\Console\Commands;

use App\Enquiry;
use App\TenantPolicy;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Bell-nudges pricing to decide on enquiries the client has gone quiet on.
 *
 * The window resolves **branch → company → config** (`stale_enquiry_days`), so a tenant
 * or a single branch can tune it without a code change.
 *
 * ⚠️ The configured default of 7 days is a STARTING POINT, not a specified value —
 * PRD.md §5.4 says only "the tenant's configured stale window" and never states a number
 * (GAPS.md #9). Confirm with the business before launch: too short nags the desk, too
 * long defeats the point.
 *
 * Debounced via `stale_nudged_at`, which is cleared on any new client reply — so a client
 * who answers and then goes quiet again is nudged again, but a silent one is nudged once.
 */
class NudgeStaleEnquiries extends Command
{
    protected $signature = 'enquiries:nudge-stale';

    protected $description = 'Prompt pricing to make an explicit keep-or-lose decision on inactive enquiries';

    public function handle(): int
    {
        $nudged = 0;

        // Group by branch so each resolves its own window once, rather than per enquiry.
        $branches = DB::table('enquiries')->whereNull('deleted_at')->distinct()->pluck('agent_id');

        foreach ($branches as $agentId) {
            $companyId = DB::table('agents_info')->where('id', $agentId)->value('company_id');

            if ($companyId === null) {
                continue;
            }

            $days = (int) (TenantPolicy::resolve($companyId, $agentId, 'stale_enquiry_days')
                ?? config('f16s.policies.stale_enquiry_days', 7));

            $stale = Enquiry::withoutGlobalScopes()
                ->where('agent_id', $agentId)
                ->stale($days)
                ->get();

            foreach ($stale as $enquiry) {
                // The debounce. Cleared elsewhere when a client replies.
                $enquiry->forceFill(['stale_nudged_at' => now()])->saveQuietly();
                $nudged++;
            }
        }

        $this->info("{$nudged} stale enquiry/enquiries nudged.");

        return self::SUCCESS;
    }
}
