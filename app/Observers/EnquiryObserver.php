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

        $this->restartStaleClock($enquiry);

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
        //
        // 🔴 getRawOriginal, NOT getOriginal. `getOriginal()` APPLIES CASTS, so it hands
        // back an EnquiryStatus and `=== 'lost'` was false for every enquiry that ever
        // existed — this entire branch was dead. Nothing was ever stamped `reopened_at`,
        // and a revived enquiry kept its `lost_at` and `lost_reason`, so it sat in the
        // open funnel while still counting as a loss.
        if ($enquiry->getRawOriginal('status') === EnquiryStatus::Lost->value && $new !== EnquiryStatus::Lost) {
            $enquiry->reopened_at = now();
            $enquiry->lost_at = null;
            $enquiry->lost_reason = null;
            // Including a loss the SWEEP declared — reopening overturns the machine's
            // call, and leaving the flag set would keep reporting it as an auto-close.
            $enquiry->lost_automatically = false;
            // 🔴 And the nudge sequence starts over. Carrying an exhausted count into a
            // revived enquiry would let the sweep close it again after a SINGLE further
            // reminder, which is not what "two attempts" means to anyone.
            $enquiry->stale_nudged_at = null;
            $enquiry->stale_nudge_count = 0;
        }
    }

    /**
     * Desk activity restarts the nudge clock.
     *
     * 🔴 This USED TO BE a `saving` hook guarded by `isDirty('updated_at')`, and it never
     * ran. Laravel stamps timestamps in `performUpdate()`, AFTER the `saving` event fires,
     * so `updated_at` is not yet dirty when `saving` is called — the condition was false
     * every time. The documented behaviour ("cleared on any new client reply") was never
     * true for any enquiry, which is exactly the sort of thing that only matters once
     * something starts CLOSING enquiries off the back of it.
     *
     * ⚠️ The COUNT restarts with the timestamp. An enquiry that comes back to life has
     * earned the full sequence over; keeping the old count would close it after a single
     * further reminder rather than the configured number.
     *
     * The terminal statuses are excluded so closing an enquiry does not erase the record
     * of how many reminders it took to get there.
     */
    private function restartStaleClock(Enquiry $enquiry): void
    {
        if (! $enquiry->isDirty('status') || $enquiry->status->isClosed()) {
            return;
        }

        $enquiry->stale_nudged_at = null;
        $enquiry->stale_nudge_count = 0;
    }
}
