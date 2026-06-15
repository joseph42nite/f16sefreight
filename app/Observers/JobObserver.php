<?php

namespace App\Observers;

use App\Job;
use App\MilestonePerformanceLog;
use Illuminate\Support\Facades\Cache;
use App\Jobs\ProcessConsolRollupJob;

class JobObserver
{
    /**
     * Fires when a new Job is created.
     *
     * Seeds the initial 'Intake' milestone record to begin SLA tracking
     * for the enquiry lifecycle.
     */
    public function created(Job $job): void
    {
        MilestonePerformanceLog::create([
            'agent_id'       => $job->agent_id,
            'job_id'         => $job->id,
            'milestone_name' => 'Intake',
            'entered_at'     => now(),
        ]);
    }

    /**
     * Fires when a Job is updated.
     *
     * When the job status changes, log the milestone transition.
     * Also triggers a debounced consol rollup if this is a sub-shipment.
     */
    public function updated(Job $job): void
    {
        // Log status change milestones
        if ($job->isDirty('status')) {
            MilestonePerformanceLog::create([
                'agent_id'       => $job->agent_id,
                'job_id'         => $job->id,
                'milestone_name' => $job->status->value,
                'entered_at'     => now(),
            ]);
        }

        // Debounced rollup for consolidation parent jobs
        if ($job->is_sub_shipment && $job->parent_job_id) {
            $this->dispatchDebouncedRollup($job->parent_job_id);
        }
    }

    /**
     * Debouncing algorithm:
     * Uses a 2-second cache lock to collapse rapid successive updates
     * into a single deferred rollup job, preventing duplicate DB writes.
     */
    private function dispatchDebouncedRollup(int $parentJobId): void
    {
        $lockKey = "job_rollup_lock:{$parentJobId}";

        if (!Cache::add($lockKey, true, 2)) {
            // Debounced: skip if triggered within 2 seconds
            return;
        }

        ProcessConsolRollupJob::dispatch($parentJobId)->delay(now()->addSeconds(2));
    }
}
