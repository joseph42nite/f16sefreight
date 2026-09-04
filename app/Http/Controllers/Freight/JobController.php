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
use App\Services\OperatorLoadService;
use App\Services\BellNotificationService;
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

    /**
     * Restrict a job query to what the caller owns.
     *
     * 🔴 A job carries TWO owners and the right column depends on who is asking:
     * `pricing_id` quoted it, `ops_id` is executing it. Keying both roles off `ops_id`
     * is what previously returned an empty board to pricing staff who owned every job
     * on it.
     *
     * 🔴 ONLY THE ROLES THAT OWN JOBS ARE SCOPED. `accounts` invoices every shipment on
     * the branch and is never assigned one, and `boss` answers for work they must be able
     * to see — narrowing either to "jobs they own" narrows them to NOTHING, because
     * neither ever appears in an ownership column.
     *
     * ⚠️ A designation missing from this map is therefore NOT scoped. That is the
     * deliberate choice between two bad defaults: failing closed blinds a working role
     * silently, which is what an earlier version of this method did to `accounts`, and
     * an invisible empty page is far harder to diagnose than a visible extra row. The
     * blast radius is bounded — `BindPortalScope` and the designation gate have already
     * limited the caller to their own branch and mode before this runs.
     *
     * 🔴 If a new role is added that OWNS jobs, it must be added here. Nothing else will
     * catch it.
     */
    private const OWNERSHIP_COLUMN = [
        'pricing'    => 'pricing_id',
        'operations' => 'ops_id',
    ];

    private function scopeToOwner($query)
    {
        $column = self::OWNERSHIP_COLUMN[auth()->user()->designation] ?? null;

        return $column === null ? $query : $query->where($column, auth()->id());
    }

    public function index(Request $request): JsonResponse
    {
        $jobs = Job::forActivePortal()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            // 🔒 OWNERSHIP SCOPE — every caller sees their OWN shipments and no one
            // else's. Enforced here rather than in the board's filter, because a filter
            // is a convenience and this is a boundary: `?ops_id=` on the old endpoint
            // would otherwise hand any authenticated user a colleague's whole book.
            //
            // The pool is the deliberate exception below: unclaimed work belongs to
            // whoever picks it up, so it is visible to everyone until somebody does.
            ->when(! $request->boolean('unassigned'), fn ($q) => $this->scopeToOwner($q))
            // The Unassigned Pool: PRD §5.5's scroller, and the only place a job with
            // no operator is actionable.
            ->when($request->boolean('unassigned'), fn ($q) => $q->whereNull('ops_id'))
            // The inbox drawer resolves a thread's enquiry to its job for the cost sheet.
            ->when($request->filled('enquiry_id'), fn ($q) => $q->where('enquiry_id', $request->integer('enquiry_id')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('planned_clearance_date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('planned_clearance_date', '<=', $request->date('to')))
            // PRD §5.5 card anatomy needs BOTH names — "so collaborators share context".
            // Eager-loaded: a 50-card board would otherwise be 100 extra queries.
            ->with([
                'opsUser:id,name',
                'pricingOwner:id,name',
                'customer:id,name',
                // `enquiry_no` rides along so a card can show where the shipment CAME FROM.
                // The three identifiers are one ladder — enquiry number, then job number
                // on confirmation, then AWB when the waybill is raised — and a card that
                // shows only the middle rung makes the other two feel like other systems.
                'enquiry:id,enquiry_no,extracted_pieces,extracted_weight,origin_code,dest_code',
            ])
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
        }, EnquirySequenceService::DEADLOCK_ATTEMPTS);

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

        $job->update([
            'ops_id'                   => $data['ops_id'],
            'pending_ops_id'           => null,
            'pending_ops_requested_by' => null,
            // 🔴 The timestamp goes too. Clearing two of the three staging columns leaves
            // a "requested at" for a request that no longer exists, and every
            // how-long-has-this-been-waiting query counts it forever.
            'pending_ops_requested_at' => null,
        ]);

        // 🔴 A direct assignment SUPERSEDES any staged request, so its bell card must go
        // with it. Left behind, the owner is still offered [Accept] / [Reject] for a
        // handover that is gone — and answering returns 422 `nothing_pending`, which
        // reads as the product being broken rather than as a request already resolved.
        app(BellNotificationService::class)->dissolveReassignment($job->id);

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

        // 🔴 A REQUEST NEEDS SOMEBODY TO ASK. Staging on an unowned job raised no
        // notification at all, so the request waited for a decision nobody would ever be
        // asked to make — while the operator who asked saw a 202 and reasonably assumed
        // it was on its way. Refuse rather than accept something undeliverable.
        if ($job->pricing_id === null) {
            return response()->json([
                'error'  => 'This job has no pricing owner to approve a handover.',
                'reason' => 'no_owner',
            ], 422);
        }

        $job->update([
            'pending_ops_id'           => $data['ops_id'],
            'pending_ops_requested_by' => auth()->id(),
            'pending_ops_requested_at' => now(),
        ]);

        // ⚠️ Supersede rather than stack. A second request replaces the first on the job
        // row, so leaving the first card would have the owner answering a request that is
        // no longer current — and a pinned card is precisely the one they cannot ignore.
        app(BellNotificationService::class)->dissolveReassignment($job->id);

        // 🔔 PINNED, because an approval is a request for a DECISION, not an FYI. It
        // sorts above every routine alert until somebody answers it.
        app(BellNotificationService::class)->notify(
            $job->agent_id,
            $job->pricing_id,
            BellNotificationService::REASSIGNMENT,
            [
                'job_id'       => $job->id,
                'job_no'       => $job->execution_job_no,
                'from_ops_id'  => $job->ops_id,
                'to_ops_id'    => $data['ops_id'],
                'requested_by' => auth()->id(),
            ],
            BellNotificationService::PRIORITY_APPROVAL
        );

        return response()->json($job->fresh(), 202);
    }

    /**
     * Withdraw a staged handover.
     *
     * 🔴 **The notification is HARD-DELETED so it auto-dissolves** from the pricing
     * owner's bell (ui_ux_guide §5.6) — no "cancelled" tombstone. A bell is a list of
     * things still needing a decision; a resolved-but-visible row is a decision the
     * owner re-makes every time they look, and after a few of those they stop reading
     * the bell entirely.
     *
     * 🔒 Only the operator who ASKED may withdraw. Letting anyone withdraw would let
     * an operator quietly cancel a colleague's request and keep work that was being
     * handed away.
     */
    public function withdrawReassignment(Job $job): JsonResponse
    {
        $this->authorize('requestReassignment');

        if ($job->pending_ops_id === null) {
            return response()->json([
                'error'  => 'There is no handover staged on this job.',
                'reason' => 'nothing_pending',
            ], 422);
        }

        if ((int) $job->pending_ops_requested_by !== (int) auth()->id()) {
            return response()->json([
                'error'  => 'Only the operator who requested this handover can withdraw it.',
                'reason' => 'not_requester',
            ], 403);
        }

        $job->update([
            'pending_ops_id'           => null,
            'pending_ops_requested_by' => null,
            'pending_ops_requested_at' => null,
        ]);

        $dissolved = app(BellNotificationService::class)->dissolveReassignment($job->id);

        return response()->json(['job' => $job->fresh(), 'notifications_dissolved' => $dissolved]);
    }

    /**
     * Approve or refuse a staged handover — the bell's inline [Accept] / [Reject].
     *
     * 🔒 `assignOperator` — pricing or boss. Operations may ASK; only the owner grants.
     * That asymmetry is the whole reason a handover is staged rather than applied.
     *
     * Either answer dissolves the notification: the decision has been made, and a bell
     * row that outlives its decision is one the owner has to re-read and re-dismiss.
     */
    public function resolveReassignment(Request $request, Job $job): JsonResponse
    {
        $this->authorize('assignOperator');

        $data = $request->validate(['decision' => 'required|string|in:accept,reject']);

        if ($job->pending_ops_id === null) {
            return response()->json([
                'error'  => 'There is no handover staged on this job.',
                'reason' => 'nothing_pending',
            ], 422);
        }

        $accepted = $data['decision'] === 'accept';

        $job->update([
            // 🔴 The live assignment only moves on ACCEPT. A rejected request leaves the
            // job exactly where it was — staging exists so a request cannot move work
            // on its own.
            'ops_id'                   => $accepted ? $job->pending_ops_id : $job->ops_id,
            'pending_ops_id'           => null,
            'pending_ops_requested_by' => null,
            'pending_ops_requested_at' => null,
        ]);

        app(BellNotificationService::class)->dissolveReassignment($job->id);

        $this->audit->record(
            $job->agent_id,
            $accepted ? 'job.handover_accepted' : 'job.handover_rejected',
            'job', $job->id, auth()->id()
        );

        return response()->json($job->fresh());
    }

    /**
     * The Staff View — the cross-staff clearance matrix pricing uses to balance load.
     *
     * 🔒 `assignOperator` — pricing and boss. Operations does NOT get this: PRD.md §9.4
     * says the cross-staff matrix is ABSENT for them, not disabled. An executor seeing
     * every colleague's load invites informal reassignment around the person whose job
     * it is to balance it.
     *
     * ⚠️ Operators with NO open jobs are included at OLI 0.0. They are the whole point
     * of the view — an idle operator missing from the matrix is capacity nobody can see.
     */
    public function staffLoad(Request $request, OperatorLoadService $load): JsonResponse
    {
        $this->authorize('assignOperator');

        $context = \App\Support\UserContext::for(auth()->id() ? auth()->user() : null);
        $agentId = $context->agentId;

        $totals = $load->forBranch($agentId);
        $policy = $load->policy($agentId);

        // ⚠️ OLI is a WHOLE-BOOK number: it weights every open job by complexity and
        // urgency. It answers "is this person busy", not "is this person busy THAT DAY" —
        // and an operator can sit well under their cap while already having four
        // shipments clearing on the one date you are about to add a fifth to.
        // `on_date` is that second question, asked plainly.
        $onDate = $request->filled('date')
            ? DB::table('jobs')
                ->where('agent_id', $agentId)
                ->whereNull('deleted_at')
                ->whereNotNull('ops_id')
                ->whereNotIn('status', ['Completed', 'Cancelled'])
                ->whereDate('planned_clearance_date', $request->date('date'))
                ->selectRaw('ops_id, COUNT(*) AS n')
                ->groupBy('ops_id')
                ->pluck('n', 'ops_id')
            : collect();

        $operators = \App\User::where('branch_name', $agentId)
            ->whereIn('designation', ['operations', 'pricing'])
            ->where('is_active', 1)
            ->get(['id', 'name', 'designation']);

        return response()->json([
            'capacity_cap' => $policy['capacity_cap'],
            'operators' => $operators->map(fn ($u) => [
                'id'          => $u->id,
                'name'        => $u->name,
                'designation' => $u->designation,
                'oli'         => $totals[$u->id]['oli'] ?? 0.0,
                'jobs'        => $totals[$u->id]['jobs'] ?? 0,
                'on_date'     => (int) ($onDate[$u->id] ?? 0),
                // The badge the UI colours. Warns; never blocks.
                'overloaded'  => ($totals[$u->id]['oli'] ?? 0.0) >= $policy['capacity_cap'],
            ])->sortBy('oli')->values(),
        ]);
    }
}
