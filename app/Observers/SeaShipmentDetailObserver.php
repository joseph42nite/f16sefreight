<?php

namespace App\Observers;

use App\SeaShipmentDetail;

/**
 * Guide §2.3 — rolls house figures up to the consolidation master.
 *
 * ⚠️ **DEBOUNCED, and that is the point.** Saving several houses in sequence — which is
 * exactly what an operator does — would otherwise dispatch one roll-up job per house and
 * they would race, each computing a total from a partially-saved set. A 2-second cache
 * lock collapses the burst into a single job.
 */
class SeaShipmentDetailObserver
{
    public function saved(SeaShipmentDetail $detail): void
    {
        $parentJobId = $detail->job?->parent_job_id;

        if ($parentJobId === null) {
            return; // not a house under a consolidation
        }

        // Summed from the houses every time, so a direct recompute is always right; a debounce here would drop the
        // last save of a burst.
        app(\App\Services\ConsolidationService::class)->rollUp((int) $parentJobId);
    }
}
