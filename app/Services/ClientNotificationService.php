<?php

namespace App\Services;

use App\EmailThread;
use App\Job;
use RuntimeException;

/**
 * Stages consent-gated client emails — guide §4.6.
 *
 * 🔴 **NOTHING IS EMAILED TO A CLIENT WITHOUT EXPLICIT OPERATOR APPROVAL.**
 * One of the product's load-bearing rules. Sending the wrong document to a client is
 * unrecoverable — you cannot unsend a customs document to the wrong consignee.
 *
 * 🔴 **THE CONSENT IS ENFORCED HERE, IN THE SERVICE — NOT IN THE UI.** A gate that lives
 * in a Vue component is bypassed by every other caller: a console command, a queued job,
 * a future API client, or the same component after a refactor. `stage()` writes a draft
 * and returns; only `release()` may hand anything to the sender, and it refuses unless a
 * real operator id is supplied.
 *
 * Drafts live on `email_threads.pending_client_notification` (JSON) rather than in a
 * table of their own: a staged notification is a property of the conversation, and it is
 * replaced rather than accumulated — only the latest pending draft is meaningful.
 */
class ClientNotificationService
{
    /** The four moments the product offers to notify a client. */
    public const STAGE_INTAKE         = 'Intake';
    public const STAGE_AI_EXTRACTION  = 'AI Extraction';
    public const STAGE_SENT_TO_AIRLINE = 'Sent to Airline';
    public const STAGE_REINITIATED    = 'Re-initiated';

    public const STAGES = [
        self::STAGE_INTAKE,
        self::STAGE_AI_EXTRACTION,
        self::STAGE_SENT_TO_AIRLINE,
        self::STAGE_REINITIATED,
    ];

    /**
     * Compose a draft and park it. NOTHING IS SENT.
     *
     * Returns false when the moment is not one the product notifies on, or the job has no
     * thread to hang the draft from.
     */
    public function stage(Job $job, string $stage, array $draft): bool
    {
        if (! in_array($stage, self::STAGES, true)) {
            return false;
        }

        $thread = EmailThread::withoutGlobalScopes()
            ->where('job_id', $job->id)
            ->orderByDesc('latest_message_received_at')
            ->first();

        if ($thread === null) {
            return false;
        }

        $thread->forceFill([
            'pending_client_notification' => [
                'stage'      => $stage,
                'subject'    => $draft['subject'] ?? null,
                'body'       => $draft['body'] ?? null,
                'to'         => $draft['to'] ?? [],
                'cc'         => $draft['cc'] ?? [],
                'attachments'=> $draft['attachments'] ?? [],
                'job_id'     => $job->id,
                'staged_at'  => now()->toIso8601String(),
            ],
        ])->save();

        return true;
    }

    /**
     * Release a staged draft for sending, on an operator's explicit instruction.
     *
     * Reached only from POST /api/jobs/{id}/confirm-notification.
     *
     * @param  int  $approvedByUserId  a REAL operator. Not a default, not a system id.
     * @return array the draft to hand to the sender
     *
     * @throws RuntimeException when nothing is staged, or no operator approved it
     */
    public function release(Job $job, int $approvedByUserId): array
    {
        if ($approvedByUserId <= 0) {
            throw new RuntimeException(
                'A client notification requires an explicit operator approval. '
                . 'There is deliberately no system-initiated path.'
            );
        }

        $thread = EmailThread::withoutGlobalScopes()
            ->where('job_id', $job->id)
            ->whereNotNull('pending_client_notification')
            ->first();

        $draft = $thread?->pending_client_notification;

        if ($thread === null || blank($draft)) {
            throw new RuntimeException("No client notification is staged for job {$job->id}.");
        }

        // Clear on release so a second confirm cannot resend the same draft — the same
        // reasoning as the double-send guard on email_messages.
        $thread->forceFill(['pending_client_notification' => null])->save();

        return $draft + ['approved_by' => $approvedByUserId];
    }

    /** Discard a staged draft without sending. */
    public function discard(Job $job): void
    {
        EmailThread::withoutGlobalScopes()
            ->where('job_id', $job->id)
            ->update(['pending_client_notification' => null]);
    }

    public function pendingFor(Job $job): ?array
    {
        return EmailThread::withoutGlobalScopes()
            ->where('job_id', $job->id)
            ->value('pending_client_notification');
    }
}
