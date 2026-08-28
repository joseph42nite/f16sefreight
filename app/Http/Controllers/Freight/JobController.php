<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\AccountsPurchaseVoucher;
use App\Enquiry;
use App\Enums\JobStatus;
use App\Enums\TransportMode;
use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use App\Services\EnquirySequenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * The post-conversion lifecycle — guide §5.2.
 */
class JobController extends Controller
{
    public function __construct(
        private readonly EnquirySequenceService $sequences,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $jobs = Job::forActivePortal()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->boolean('mine'), fn ($q) => $q->where('ops_id', auth()->id()))
            ->latest()
            ->paginate(50);

        return response()->json($jobs);
    }

    /** Milestone transitions. Every one writes an SLA row via JobObserver. */
    public function updateStatus(Request $request, Job $job): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', new \Illuminate\Validation\Rules\Enum(JobStatus::class)],
        ]);

        // Cancellation has its own endpoint — it requires a reason and refuses when
        // financial documents are posted. Routing it here would bypass both.
        if ($data['status'] === JobStatus::Cancelled->value) {
            return response()->json([
                'error'  => 'Use POST /api/jobs/{id}/cancel — cancellation requires a reason.',
                'reason' => 'use_cancel_endpoint',
            ], 422);
        }

        $job->update(['status' => JobStatus::from($data['status'])]);

        return response()->json($job->fresh());
    }

    /**
     * Cancel a confirmed shipment.
     *
     * 🔴 **`422` when a posted invoice or voucher exists.** Cancelling a job whose revenue
     * has been booked and filed for GST would leave the ledger describing a shipment the
     * operations side says never happened. The financial RESTRICT foreign keys would block
     * a delete anyway; this returns a usable error instead of a driver exception.
     *
     * **Soft, never destructive** — status plus `cancelled_at`/`cancelled_by`. The row is
     * never hard-deleted; the Boss must be able to review every cancellation and its reason.
     *
     * On success the AWB/HAWB is DETACHED (`job_id → NULL`), releasing the number to stock.
     */
    public function cancel(Request $request, Job $job): JsonResponse
    {
        $data = $request->validate([
            'cancellation_reason'        => ['required', 'string', 'max:30'],
            'cancellation_reason_custom' => ['nullable', 'string', 'max:255'],
        ]);

        $postedInvoices = AccountsInvoice::withoutTenantScope()
            ->where('job_id', $job->id)->where('is_posted', true)->count();

        $vouchers = AccountsPurchaseVoucher::withoutTenantScope()
            ->where('job_id', $job->id)->where('status', '!=', 'void')->count();

        if ($postedInvoices > 0 || $vouchers > 0) {
            return response()->json([
                'error'  => 'This job has posted financial documents and cannot be cancelled. '
                          . 'Void or credit them first.',
                'reason' => 'has_posted_financials',
                'posted_invoices' => $postedInvoices,
                'open_vouchers'   => $vouchers,
            ], 422);
        }

        DB::transaction(function () use ($job, $data) {
            $job->update($data + [
                'status'       => JobStatus::Cancelled,
                'cancelled_at' => now(),
                'cancelled_by' => auth()->id(),
            ]);

            // Release the waybill number back to stock — the document was never flown.
            foreach (['air_way_bills', 'house_way_bills'] as $table) {
                DB::table($table)->where('job_id', $job->id)->update(['job_id' => null]);
            }

            $this->audit->record($job->agent_id, 'job.cancelled', 'job', $job->id, auth()->id());
        });

        return response()->json($job->fresh());
    }

    /**
     * Re-quote a cancelled job.
     *
     * ⚠️ **Creates a FRESH enquiry with a NEW number** — deliberately not a reopen.
     * Freight rates are time-sensitive, so a cancelled shipment is re-quoted rather than
     * revived at a price that may be weeks stale. `reinitiated_from_job_id` preserves the
     * lineage so the two are still connected.
     */
    public function reinitiate(Job $job): JsonResponse
    {
        $this->authorize('triage');

        if ($job->status !== JobStatus::Cancelled) {
            return response()->json([
                'error'  => 'Only a cancelled job can be re-initiated.',
                'reason' => 'not_cancelled',
            ], 422);
        }

        $source = $job->enquiry;
        $mode = TransportMode::from($job->transport_mode);

        $enquiry = DB::transaction(function () use ($job, $source, $mode) {
            $enquiry = Enquiry::create([
                'agent_id'                => $job->agent_id,
                'customer_id'             => $job->customer_id,
                'transport_mode'          => $job->transport_mode,
                'direction'               => $job->direction,
                'enquiry_no'              => $this->sequences->next($job->agent_id, $mode->enquiryPrefix()),
                'reinitiated_from_job_id' => $job->id,
                // Carry the declared cargo forward — the client asked for the same thing.
                'extracted_pieces'  => $source?->extracted_pieces,
                'extracted_weight'  => $source?->extracted_weight,
                'extracted_volume'  => $source?->extracted_volume,
                'cargo_description' => $source?->cargo_description,
                'origin_code'       => $source?->origin_code,
                'dest_code'         => $source?->dest_code,
                // Deliberately NOT carried: quoted_amount. The rate is why we are re-quoting.
            ]);

            $this->audit->record($job->agent_id, 'job.reinitiated', 'enquiry', $enquiry->id, auth()->id());

            return $enquiry;
        });

        return response()->json(['enquiry' => $enquiry, 'from_job' => $job->execution_job_no], 201);
    }

    /**
     * Atomic claim of an unassigned job.
     *
     * 🔴 **`409` when zero rows are affected.** `UPDATE … WHERE ops_id IS NULL` decides the
     * race in the database. Reading then writing would let two operators both see NULL and
     * both claim it, and the second would silently steal the first one's work.
     */
    public function claim(Job $job): JsonResponse
    {
        $claimed = Job::withoutTenantScope()
            ->whereKey($job->id)
            ->whereNull('ops_id')
            ->update(['ops_id' => auth()->id(), 'updated_at' => now()]);

        if ($claimed === 0) {
            return response()->json([
                'error'  => 'This job has already been claimed.',
                'reason' => 'already_claimed',
            ], 409);
        }

        $this->audit->record($job->agent_id, 'job.claimed', 'job', $job->id, auth()->id());

        return response()->json($job->fresh());
    }

    /** Pricing sets the operator directly. Operations must request instead. */
    public function reassign(Request $request, Job $job): JsonResponse
    {
        $this->authorize('assignOperator');

        $data = $request->validate(['ops_id' => ['required', 'integer', 'exists:users,id']]);

        $job->update(['ops_id' => $data['ops_id'], 'pending_ops_id' => null, 'pending_ops_requested_by' => null]);
        $this->audit->record($job->agent_id, 'job.reassigned', 'job', $job->id, auth()->id());

        return response()->json($job->fresh());
    }

    /**
     * Operations stages a reassignment for the pricing owner to approve.
     *
     * The notification carries elevated `priority` so it pins to the top of the bell —
     * this request blocks another person's work and must not scroll away under routine
     * noise.
     */
    public function requestReassignment(Request $request, Job $job): JsonResponse
    {
        $this->authorize('requestReassignment');

        $data = $request->validate(['ops_id' => ['required', 'integer', 'exists:users,id']]);

        $job->update([
            'pending_ops_id'           => $data['ops_id'],
            'pending_ops_requested_by' => auth()->id(),
            'pending_ops_requested_at' => now(),
        ]);

        return response()->json($job->fresh(), 202);
    }
}
