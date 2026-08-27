<?php

namespace App\Observers;

use App\Enums\EnquiryStatus;
use App\Job;
use App\MilestonePerformanceLog;

/**
 * Guide §2.3.
 *
 * ── Creating a job IS conversion ───────────────────────────────────────────
 * The enquiry flips to `converted` here rather than at a controller, so it holds however
 * a job is created — API, import, console command. The job row remains the source of
 * truth; the status column is maintained for query convenience.
 */
class JobObserver
{
    public function created(Job $job): void
    {
        $enquiry = $job->enquiry;

        if ($enquiry !== null && $enquiry->status !== EnquiryStatus::Converted) {
            $enquiry->forceFill(['status' => EnquiryStatus::Converted->value])->saveQuietly();
        }

        $this->logMilestone($job);
    }

    /**
     * Every status transition writes an SLA row, which is what makes "how long did
     * Verification take?" answerable. A log row per transition, rather than a timestamp
     * column per milestone, is what allows a job to RE-ENTER a milestone — a job bounced
     * back from Verification visits it twice, and a single column would overwrite the
     * first visit silently.
     */
    public function updated(Job $job): void
    {
        if ($job->wasChanged('status')) {
            $this->logMilestone($job);
        }
    }

    private function logMilestone(Job $job): void
    {
        MilestonePerformanceLog::create([
            'agent_id'       => $job->agent_id,
            'job_id'         => $job->id,
            // Falls back rather than writing an empty name: a milestone row with no
            // milestone is worse than none, since it silently skews stage-duration stats.
            'milestone_name' => $job->status instanceof \BackedEnum
                ? $job->status->value
                : (string) ($job->status ?: \App\Enums\JobStatus::Intake->value),
            // The caller states WHEN the transition happened; created_at records when we
            // wrote it down. Usually identical, and where they differ the gap is the
            // interesting part.
            'entered_at'     => now(),
        ]);
    }
}
