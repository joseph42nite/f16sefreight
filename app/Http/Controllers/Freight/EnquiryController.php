<?php

namespace App\Http\Controllers\Freight;

use App\Enquiry;
use App\Enums\EnquiryStatus;
use App\Enums\TransportMode;
use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use App\Services\EnquirySequenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Support\UserContext;
use Illuminate\Support\Facades\DB;

/**
 * The pre-conversion lifecycle — guide §5.2.
 *
 * Every action here is gated on `pricing` (or boss where the matrix allows), and every
 * query is both TENANT-scoped (automatic, via BelongsToTenant) and PORTAL-scoped
 * (explicit, via forActivePortal) — the latter chained by hand precisely because it must
 * NOT apply in queue workers.
 */
class EnquiryController extends Controller
{
    public function __construct(
        private readonly EnquirySequenceService $sequences,
        private readonly AuditLogger $audit,
    ) {}

    /** The pricing board: the pre-conversion pool, mode-scoped to the active portal. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('triage');

        $context = UserContext::for(auth()->user());

        $enquiries = Enquiry::forActivePortal()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            // 🔍 One search box over BOTH identities. An operator looking for "globex"
            // should not have to know whether that client was ever onboarded as a customer
            // — they type the name they know and the row appears either way.
            ->when($request->filled('client'), function ($q) use ($request) {
                $term = '%' . $request->string('client') . '%';

                $q->where(function ($w) use ($term) {
                    $w->whereIn('customer_id', function ($sub) use ($term) {
                        $sub->select('id')->from('customers')
                            ->where('name', 'like', $term)
                            ->orWhere('email_domain', 'like', $term);
                    })
                    // The unonboarded case: no customer row, so match the domain the
                    // conversation arrived from.
                    ->orWhereIn('id', function ($sub) use ($term) {
                        $sub->select('t.enquiry_id')->from('email_threads as t')
                            ->join('email_messages as m', 'm.thread_key', '=', 't.thread_key')
                            ->where('m.direction', 'inbound')
                            ->where('m.from', 'like', $term)
                            ->whereNotNull('t.enquiry_id');
                    });
                });
            })
            // 🔴 THE UNASSIGNED POOL. New mail the regex filed as a client enquiry that
            // nobody has taken over yet — still in the enquiry phase, with no job behind
            // it. The claim lives on the THREAD (`email_threads.assigned_ops_id`), which
            // is the one place the inbox already writes it, so the board reads the same
            // fact rather than keeping a second copy that can drift.
            ->when($request->boolean('unclaimed'), fn ($q) => $q
                ->whereIn('status', Enquiry::OPEN_STATUSES)
                ->doesntHave('jobs')
                ->whereIn('id', function ($sub) {
                    $sub->select('enquiry_id')->from('email_threads')
                        ->whereNotNull('enquiry_id')
                        ->whereNull('assigned_ops_id');
                }))
            ->with('customer:id,name,email_domain')
            ->latest()
            ->paginate(50);

        // 🔴 WHO the enquiry is from, at the grain each tier can act on.
        //
        //   Command  — the customer RECORD, so the row reaches invoicing, credit and the
        //              client group. `customer_id` travels with it.
        //   Tactical — the NAME only. There is no accounts module to reach, so an id is a
        //              handle to nothing; and where no customer was ever onboarded the
        //              sending DOMAIN is the honest label rather than a blank.
        $isCommand = $context->tierAtLeast('command');

        $enquiries->getCollection()->transform(function ($enquiry) use ($isCommand) {
            $domain = $this->senderDomainFor($enquiry);

            $enquiry->client_label = $enquiry->customer->name ?? $domain;
            $enquiry->client_domain = $enquiry->customer->email_domain ?? $domain;

            // ⚠️ The THREAD is what gets claimed, so the pool needs its id to offer the
            // button. Claiming from the board and claiming from the inbox are the same
            // act writing the same column — not two mechanisms that must be kept in step.
            $enquiry->thread_id = DB::table('email_threads')
                ->where('enquiry_id', $enquiry->id)
                ->value('id');

            // ⚠️ Below Command the id is REMOVED, not merely unused. A tier that cannot
            // open a customer record has no business carrying a key to one.
            if (! $isCommand) {
                $enquiry->makeHidden('customer');
                $enquiry->customer_id = null;
            }

            return $enquiry;
        });

        return response()->json($enquiries);
    }

    /**
     * The domain this enquiry arrived from, via its conversation.
     *
     * ⚠️ Derived rather than stored. `email_messages.from` already holds it, and a copy on
     * `enquiries` would be a second place for the same fact to drift — an enquiry created
     * by hand has no thread and therefore, correctly, no domain.
     */
    private function senderDomainFor(Enquiry $enquiry): ?string
    {
        $from = DB::table('email_threads as t')
            ->join('email_messages as m', 'm.thread_key', '=', 't.thread_key')
            ->where('t.enquiry_id', $enquiry->id)
            ->where('m.direction', 'inbound')
            ->orderBy('m.received_at')
            ->value('m.from');

        $at = $from === null ? false : strrpos($from, '@');

        return $at === false ? null : strtolower(substr($from, $at + 1));
    }

    /**
     * Mint an enquiry on operator triage confirmation.
     *
     * 🔴 **The operator mints; the regex only stages.** Classification never creates a row
     * or consumes a number automatically — auto-minting burns document numbers on spam and
     * inflates the conversion denominator (PRD.md §5.2.3).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('triage');

        $data = $request->validate([
            'transport_mode'    => ['required', 'in:air,sea,road'],
            'direction'         => ['nullable', 'in:export,import'],
            'customer_id'       => ['nullable', 'integer', 'exists:customers,id'],
            'extracted_pieces'  => ['nullable', 'integer', 'min:0'],
            'extracted_weight'  => ['nullable', 'numeric', 'min:0'],
            'extracted_volume'  => ['nullable', 'numeric', 'min:0'],
            'cargo_description' => ['nullable', 'string'],
            'origin_code'       => ['nullable', 'string', 'size:5'],
            'dest_code'         => ['nullable', 'string', 'size:5'],
            'quoted_amount'     => ['nullable', 'numeric', 'min:0'],
            'quoted_currency'   => ['nullable', 'string', 'size:3'],
        ]);

        $agentId = $this->agentId();
        $mode = TransportMode::from($data['transport_mode']);

        $enquiry = DB::transaction(function () use ($data, $agentId, $mode) {
            $enquiry = Enquiry::create($data + [
                'agent_id'   => $agentId,
                'enquiry_no' => $this->sequences->next($agentId, $mode->enquiryPrefix()),
            ]);

            $this->audit->record($agentId, 'enquiry.created', 'enquiry', $enquiry->id, auth()->id());

            return $enquiry;
        }, EnquirySequenceService::DEADLOCK_ATTEMPTS);

        return response()->json($enquiry, 201);
    }

    /**
     * Mark an enquiry lost.
     *
     * 🔴 **`422` if a child job exists.** Lost is enquiry-only; a confirmed shipment that
     * then stopped is a CANCELLED JOB. Allowing both would count one client request as a
     * win and a loss simultaneously, corrupting conversion rate and loss analysis at once.
     */
    public function markLost(Request $request, Enquiry $enquiry): JsonResponse
    {
        $this->authorize('markLost');

        $data = $request->validate([
            'lost_reason'        => ['required', 'in:rates_high,delay_in_response,client_cancelled,capacity_issue,other'],
            'lost_reason_custom' => ['nullable', 'string', 'max:255'],
        ]);

        if ($enquiry->jobs()->exists()) {
            return response()->json([
                'error'  => 'This enquiry has converted to a job and cannot be marked lost. Cancel the job instead.',
                'reason' => 'already_converted',
            ], 422);
        }

        $enquiry->update($data + ['status' => EnquiryStatus::Lost]);
        $this->audit->record($enquiry->agent_id, 'enquiry.lost', 'enquiry', $enquiry->id, auth()->id());

        return response()->json($enquiry->fresh());
    }

    /**
     * Revive a lost enquiry IN PLACE.
     *
     * ⚠️ **Keeps the original `enquiry_no`.** A number already quoted to a client must not
     * change under them. Contrast re-initiation after a cancelled JOB, which deliberately
     * mints a NEW enquiry because freight rates are time-sensitive.
     */
    public function reopen(Enquiry $enquiry): JsonResponse
    {
        $this->authorize('triage');

        $enquiry->update(['status' => EnquiryStatus::AwaitingClient]);
        $this->audit->record($enquiry->agent_id, 'enquiry.reopened', 'enquiry', $enquiry->id, auth()->id());

        return response()->json($enquiry->fresh());
    }

    /**
     * 🔴 **THE ONLY PATH THAT CREATES A `jobs` ROW.**
     *
     * One transaction: insert the job, mint its number, set the operator and clearance
     * date. The enquiry flips to `converted` in JobObserver — not here — so it holds
     * however a job is created.
     */
    public function convert(Request $request, Enquiry $enquiry): JsonResponse
    {
        $this->authorize('convert');

        $data = $request->validate([
            'ops_id'                 => ['nullable', 'integer', 'exists:users,id'],
            'planned_clearance_date' => ['nullable', 'date'],
            'awb_number'             => ['nullable', 'string', 'max:20'],
            'customer_id'            => ['nullable', 'integer', 'exists:customers,id'],
        ]);

        if ($enquiry->status === EnquiryStatus::Lost) {
            return response()->json([
                'error'  => 'A lost enquiry must be reopened before it can be converted.',
                'reason' => 'enquiry_lost',
            ], 422);
        }

        $mode = TransportMode::from($enquiry->transport_mode);

        // awb_number is AIR-ONLY; the model guards it too, but a 422 beats a 500.
        if (filled($data['awb_number'] ?? null) && $mode !== TransportMode::Air) {
            return response()->json([
                'error'  => 'awb_number is air-only. Sea and road carry MBL/HBL on the shipment details.',
                'reason' => 'mode_mismatch',
            ], 422);
        }

        // 🔴 CLAIMING AN ENQUIRY IS A PRICING ACT, NOT AN OPERATIONS ONE. The claim
        // button in the inbox means "I have taken this enquiry over" — the shipment is
        // still in the enquiry phase and there is nothing for an operator to execute yet.
        // So the claimer becomes the job's `pricing_id`.
        //
        // ⚠️ `ops_id` is a SEPARATE decision made here, at confirmation, from the operator
        // dropdown — and it stays NULL when nobody is picked, which is a real state: the
        // pricing owner may intend to run the shipment themselves.
        $claimedBy = DB::table('email_threads')
            ->where('enquiry_id', $enquiry->id)
            ->value('assigned_ops_id');

        $job = DB::transaction(function () use ($enquiry, $data, $mode, $claimedBy) {
            $job = Job::create($data + [
                'agent_id'       => $enquiry->agent_id,
                'enquiry_id'     => $enquiry->id,
                'transport_mode' => $enquiry->transport_mode,
                'direction'      => $enquiry->direction,
                'customer_id'    => $data['customer_id'] ?? $enquiry->customer_id,
                'cargo_type'     => $enquiry->cargo_type,
                // Whoever claimed the enquiry owns it; falling back to whoever confirmed
                // covers a shipment confirmed straight off an unclaimed thread.
                'pricing_id'     => $claimedBy ?? auth()->id(),
                'execution_job_no' => $this->sequences->next($enquiry->agent_id, $mode->jobPrefix()),
            ]);

            $this->audit->record($enquiry->agent_id, 'enquiry.converted', 'job', $job->id, auth()->id());

            return $job;
        }, EnquirySequenceService::DEADLOCK_ATTEMPTS);

        return response()->json([
            'job'     => $job,
            'enquiry' => $enquiry->fresh(), // now 'converted', flipped by JobObserver
        ], 201);
    }

    /** The acting user's branch. Tenant binding never comes from the request. */
    private function agentId(): int
    {
        return (int) auth()->user()->branch_name;
    }
}
