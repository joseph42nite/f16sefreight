<?php

namespace App\Observers;

use App\EmailThread;

/**
 * Guide §2.3 — protects two timestamps that back SLA reporting.
 *
 * 🔴 first_response_at and first_triage_at are WRITE-ONCE. Once populated they cannot be
 * changed, because both feed response-latency SLA and a mutable SLA figure is not a
 * measurement. They are DIFFERENT FACTS and must never be conflated:
 *
 *   first_triage_at    somebody internal looked at it
 *   first_response_at  the client actually received a reply
 *
 * Reporting triage as a response claims an SLA the client never experienced.
 *
 * On re-triage `job_id` and `enquiry_id` may be reset, but first_triage_at SURVIVES as
 * the immutable audit record of the original mistake.
 */
class EmailThreadObserver
{
    public function updating(EmailThread $thread): void
    {
        foreach (['first_response_at', 'first_triage_at'] as $column) {
            if ($thread->isDirty($column) && filled($thread->getOriginal($column))) {
                // Silently restore rather than throw: a legitimate re-triage updates
                // other columns in the same save, and that save must still succeed.
                $thread->{$column} = $thread->getOriginal($column);
            }
        }
    }
}
