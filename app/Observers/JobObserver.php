<?php

namespace App\Observers;

use App\Enums\EnquiryStatus;
use App\Enums\JobStatus;
use App\Job;
use App\Services\BellNotificationService;
use App\MilestonePerformanceLog;
use App\Services\AwbJobLinker;

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
        $this->linkWaybill($job);
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

        // 🔗 GAPS #39, the job side of the link. Either half can come first — a document
        // raised before conversion, or a job numbered before its paperwork is filled in —
        // so both directions have to try. Hooked on the OBSERVER rather than on each
        // controller so every writer of `awb_number` is covered, including imports and
        // console commands that no controller ever sees.
        if ($job->wasChanged('awb_number')) {
            $this->linkWaybill($job);
        }

        if ($job->wasChanged('status') && $job->status === JobStatus::Completed) {
            $this->announceCompletion($job);
        }
    }

    /**
     * Tell the desk a shipment has finished, so somebody can tell the CLIENT.
     *
     * 🔴 It raises a NOTIFICATION, never a mail. The bell card carries a button that
     * opens a pre-filled message the operator reads and sends — because "completed" is a
     * status somebody set, and a status set by mistake would otherwise become a wrong
     * message to the customer, which is not a thing the desk can take back.
     *
     * ⚠️ Only for a shipment with an AWB. A completed air job without a waybill is not a
     * shipment that flew — it is a data problem — and announcing it to a client would
     * turn that data problem into a conversation.
     */
    private function announceCompletion(Job $job): void
    {
        if ($job->awb_number === null) {
            return;
        }

        // The pricing owner, who holds the client relationship. Falling back to the
        // operator means the message still reaches someone rather than nobody.
        $recipient = $job->pricing_id ?? $job->ops_id;

        if ($recipient === null) {
            return;
        }

        // The conversation this shipment came from, and the client on it — so the bell
        // can offer a message without a second lookup, and can say nothing at all when
        // there is no thread to answer on.
        $thread = \Illuminate\Support\Facades\DB::table('email_threads')
            ->where('enquiry_id', $job->enquiry_id)
            ->first(['id', 'thread_key']);

        $client = $thread === null ? null : \Illuminate\Support\Facades\DB::table('email_messages')
            ->where('thread_key', $thread->thread_key)
            ->where('direction', 'inbound')
            ->orderBy('received_at')
            ->value('from');

        app(BellNotificationService::class)->notify(
            $job->agent_id,
            $recipient,
            BellNotificationService::SHIPMENT_COMPLETED,
            [
                'job_id'     => $job->id,
                'job_no'     => $job->execution_job_no,
                'awb_number' => $job->awb_number,
                'thread_id'  => $thread->id ?? null,
                'client'     => $client,
            ],
            // Pinned like an approval: it is a message owed to a customer, and it stops
            // being useful the longer it sits under routine traffic.
            BellNotificationService::PRIORITY_APPROVAL
        );
    }

    /**
     * Attach the air waybill document that carries this job's number, if one exists.
     *
     * ⚠️ Silent when nothing matches, which is the common case: most jobs have no document
     * yet, and an AWB number can be recorded long before the waybill is raised.
     */
    private function linkWaybill(Job $job): void
    {
        if ($job->transport_mode !== 'air' || blank($job->awb_number)) {
            return;
        }

        app(AwbJobLinker::class)->linkFromJob($job->id);
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
