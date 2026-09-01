<?php

namespace App\Services;

use App\Support\AwbNumber;
use Illuminate\Support\Facades\DB;

/**
 * Joins the two halves of FocusAir — GAPS #39.
 *
 * 🔴 **`air_way_bills.job_id` was written by NOTHING.** The column existed, the foreign key
 * existed, and `JobController::cancel` even cleared it on cancellation — releasing a link
 * that no code path had ever established. So the operational half (enquiry → job → cost
 * sheet → invoice → analytics, all on `jobs.id`) and the document half (MAWB, HAWB,
 * consolidation, PDF, XML, addresses, all on `air_way_bills.id`) were two systems that
 * happened to share a number as loose text.
 *
 * The link is made on the CANONICAL number (`AwbNumber`), within one branch.
 *
 * ⚠️ **Matching is scoped by `agent_id`, and that is load-bearing.** An airline prefix plus
 * serial is unique per airline, not per forwarder — but nothing stops two branches from
 * recording the same number, and a cross-branch match would attach one tenant's document to
 * another tenant's job. Scoping to the branch makes a wrong match impossible rather than
 * unlikely.
 *
 * ⚠️ **An unmatched AWB is normal, not an error.** Documents are routinely raised before the
 * job exists, or for shipments that never became one. `job_id` stays NULL and the linker
 * simply reports nothing — it is called again on the next save.
 */
class AwbJobLinker
{
    /**
     * Link one air waybill to its job, if a job on the same branch claims that number.
     *
     * @return int|null the job id it was linked to, or NULL when nothing matched
     */
    public function link(int $awbKey): ?int
    {
        $awb = DB::table('air_way_bills')
            ->where('id', $awbKey)
            ->first(['id', 'awb_code', 'awb_no', 'agent_id', 'job_id']);

        if ($awb === null || $awb->agent_id === null) {
            return null;
        }

        $canonical = AwbNumber::canonical($awb->awb_code, $awb->awb_no);

        if ($canonical === null) {
            return null;
        }

        $jobId = DB::table('jobs')
            ->where('agent_id', $awb->agent_id)
            ->where('transport_mode', 'air')
            ->where('awb_number', $canonical)
            ->whereNull('deleted_at')
            ->value('id');

        if ($jobId === null) {
            return null;
        }

        // Idempotent: re-saving an AWB must not churn the row or the audit trail.
        if ((int) $awb->job_id === (int) $jobId) {
            return (int) $jobId;
        }

        DB::table('air_way_bills')->where('id', $awb->id)->update([
            'job_id'     => $jobId,
            'updated_at' => now(),
        ]);

        return (int) $jobId;
    }

    /**
     * Link from the other direction: a job that has just been given an AWB number.
     *
     * Both directions exist because either side can come first — a document raised before
     * conversion, or a job numbered before its paperwork is filled in.
     */
    public function linkFromJob(int $jobId): ?int
    {
        $job = DB::table('jobs')->where('id', $jobId)
            ->first(['id', 'agent_id', 'awb_number', 'transport_mode']);

        if ($job === null || $job->transport_mode !== 'air' || blank($job->awb_number)) {
            return null;
        }

        $key = AwbNumber::key($job->awb_number);

        if ($key === null) {
            return null;
        }

        $matched = DB::table('air_way_bills')
            ->where('id', $key)
            ->where('agent_id', $job->agent_id)
            ->exists();

        if (! $matched) {
            return null;
        }

        DB::table('air_way_bills')->where('id', $key)->update([
            'job_id'     => $job->id,
            'updated_at' => now(),
        ]);

        return $key;
    }

    /**
     * Link every air waybill on a branch that can be matched. Used to reconcile documents
     * that were created while nothing wrote `job_id` at all.
     *
     * @return int how many were newly linked
     */
    public function backfill(?int $agentId = null): int
    {
        $query = DB::table('air_way_bills')->whereNull('job_id')->whereNotNull('agent_id');

        if ($agentId !== null) {
            $query->where('agent_id', $agentId);
        }

        $linked = 0;

        foreach ($query->pluck('id') as $id) {
            if ($this->link((int) $id) !== null) {
                $linked++;
            }
        }

        return $linked;
    }
}
