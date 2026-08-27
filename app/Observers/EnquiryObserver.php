<?php

namespace App\Observers;

use App\Enquiry;
use App\Enums\EnquiryStatus;

/**
 * Guide §2.3.
 *
 * 🔴 **A converted enquiry can never be marked lost.** If a job exists, the shipment was
 * confirmed and then stopped — that is a CANCELLED JOB, not a lost enquiry. Allowing it
 * would double-count the same request as both a win and a loss, corrupting conversion
 * rate and loss analysis simultaneously.
 */
class EnquiryObserver
{
    public function updating(Enquiry $enquiry): void
    {
        if (! $enquiry->isDirty('status')) {
            return;
        }

        $new = $enquiry->status;

        if ($new === EnquiryStatus::Lost) {
            if ($enquiry->jobs()->exists()) {
                throw new \LogicException(
                    "Enquiry {$enquiry->enquiry_no} has converted to a job and cannot be "
                    . 'marked lost. Cancel the job instead.'
                );
            }

            $enquiry->lost_at ??= now();
        }

        // Revived in place by trailing client mail — the original enquiry_no is KEPT,
        // because a number that was quoted to a client must not change under them.
        if ($enquiry->getOriginal('status') === EnquiryStatus::Lost->value && $new !== EnquiryStatus::Lost) {
            $enquiry->reopened_at = now();
            $enquiry->lost_at = null;
            $enquiry->lost_reason = null;
        }
    }

    /** Any new client activity clears the nudge debounce so the clock restarts. */
    public function saving(Enquiry $enquiry): void
    {
        if ($enquiry->isDirty('updated_at') && $enquiry->isDirty('status')) {
            $enquiry->stale_nudged_at = null;
        }
    }
}
