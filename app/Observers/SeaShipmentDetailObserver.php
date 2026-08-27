<?php

namespace App\Observers;

use App\SeaShipmentDetail;
use Illuminate\Support\Facades\Cache;

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

        $lockKey = "job_rollup_lock:{$parentJobId}";

        if (! Cache::add($lockKey, true, 2)) {
            return; // a roll-up for this master is already queued
        }

        // ProcessConsolRollupJob arrives with the queue work in Step 4; until then the
        // debounce is in place and the dispatch is deliberately left unwired rather than
        // referencing a class that does not exist.
    }
}
