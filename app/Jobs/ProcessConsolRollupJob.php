<?php

namespace App\Jobs;

use App\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * ProcessConsolRollupJob
 *
 * Triggered (debounced) by JobObserver when a sub-shipment changes status.
 * Rolls up aggregated weight/pieces/cost totals from all sub-shipments
 * into the parent consolidation job record.
 *
 * Dispatched with a 2-second delay via the debouncing algorithm in JobObserver
 * using a Cache::add lock to collapse rapid concurrent updates.
 */
class ProcessConsolRollupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $parentJobId;

    public function __construct(int $parentJobId)
    {
        $this->parentJobId = $parentJobId;
    }

    public function handle(): void
    {
        $parentJob = Job::with('subShipments')->find($this->parentJobId);

        if (!$parentJob || !$parentJob->is_consolidation) {
            return;
        }

        // Future: Aggregate sub-shipment totals into parent job / consol record.
        // Implemented in Phase 3 when SeaShipmentDetail rollup logic is built.
        // Placeholder ensures the observer->job dispatch chain is functional.
    }
}
