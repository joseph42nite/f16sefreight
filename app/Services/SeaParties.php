<?php

namespace App\Services;

use App\Job;
use Illuminate\Support\Facades\DB;

/**
 * The parties a sea bill of lading starts with, by PRD §5.8's HBL/MBL mapping (GAPS #424).
 *
 *   house, export   the client is the SHIPPER    (the actual exporter)
 *   house, import   the client is the CONSIGNEE  (the importer we clear for)
 *   master          the branch is the SHIPPER    (the forwarder itself — party_type 'branch')
 *
 * Only an EMPTY role is filled: a party someone chose is never replaced. The client is the one who onboarded and
 * is billed (owner, 2026-09-28) — the invoice follows the job's customer, never these rows.
 */
class SeaParties
{
    public function prefill(Job $job): void
    {
        if ($job->transport_mode !== 'sea') {
            return;
        }

        if ($job->is_consolidation && $job->parent_job_id === null) {
            $this->fill($job, 'shipper', 'branch', (int) $job->agent_id);

            return;
        }

        if ($job->customer_id !== null) {
            $this->fill($job, $job->direction === 'import' ? 'consignee' : 'shipper', 'customer', (int) $job->customer_id);
        }
    }

    private function fill(Job $job, string $role, string $type, int $id): void
    {
        $taken = DB::table('job_entities')
            ->where('job_id', $job->id)->where('role', $role)->whereNull('deleted_at')->exists();

        if ($taken) {
            return;
        }

        DB::table('job_entities')->insert([
            'agent_id'   => $job->agent_id,
            'job_id'     => $job->id,
            'party_type' => $type,
            'party_id'   => $id,
            'role'       => $role,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
}
