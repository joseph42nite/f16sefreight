<?php

namespace App\Http\Controllers\Freight;

use App\EmailMessage;
use App\Http\Middleware\BindPortalScope;
use App\EmailThread;
use App\Enquiry;
use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use App\Services\EnquirySequenceService;
use App\Services\RegexClassificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Triage — guide §5.1.
 *
 * The unified inbox is where the day starts for pricing and operations. Everything here
 * operates on THREADS, never on individual messages: a conversation is the unit of work,
 * and classifying one message of a five-message thread as an enquiry while the rest stay
 * unclassified is how the same conversation mints two enquiries.
 *
 * ═══ 🔴 CLASSIFICATION IS A LIFECYCLE EVENT, NOT A LABEL ════════════════════
 * Promoting a thread to `customer_enquiry` MINTS an enquiry — a real number, from the
 * shared counter, that reaches clients and customs. Demoting it strands that enquiry,
 * so the enquiry is marked `lost` rather than deleted (Lost lives on enquiries, and
 * nothing in this product hard-deletes a numbered document), and demotion is REFUSED
 * outright once a job exists: a shipment is already moving.
 */
class EmailInboxController extends Controller
{
    /** database_relations_tree.md #21 — the whole vocabulary. */
    /**
     * Every classification the system stores, across all modes.
     *
     * ⚠️ This is the STORAGE vocabulary, not the one an operator is offered. A sea thread
     * classified `shipping_line` stays valid when read from the accounts portal, which has
     * no mode at all — validating against the active portal's shorter list would make a
     * legitimate stored value unreadable from a cross-mode screen.
     *
     * ⚠️ `other` exists so an operator can file mail that is none of these WITHOUT forcing
     * it into a wrong bucket. Without it the honest answer for a bank statement or a
     * newsletter is `customer_enquiry`, which mints nothing but does inflate the pool the
     * conversion rate is measured against.
     */
    public const CLASSIFICATIONS = [
        'customer_enquiry', 'airline', 'shipping_line', 'clearance', 'trucking_road', 'other',
    ];

    /**
     * What an operator on THIS portal may choose.
     *
     * 🔴 **Per mode, because a counterparty belongs to a mode.** An air operator has no use
     * for `shipping_line` and a sea operator has none for `airline` — offering both puts a
     * permanently empty folder on every inbox and a wrong option one slip away. The guide
     * already scopes classification RULES by `transport_mode` for the same reason; the
     * vocabulary has to follow.
     *
     * ⚠️ A cross-mode portal (accounts, admin) gets the union: it is reading, not filing,
     * and it must be able to render a sea thread's classification.
     */
    public static function classificationsForMode(?string $mode): array
    {
        $common = ['customer_enquiry', 'clearance', 'trucking_road', 'other'];

        return match ($mode) {
            'air'  => ['customer_enquiry', 'airline', 'clearance', 'trucking_road', 'other'],
            'sea'  => ['customer_enquiry', 'shipping_line', 'clearance', 'trucking_road', 'other'],
            'road' => $common,
            default => self::CLASSIFICATIONS,
        };
    }

    /** The active portal's transport mode, or NULL on a cross-mode portal. */
    private function activeMode(): ?string
    {
        return app()->bound(BindPortalScope::CONTAINER_KEY)
            ? app(BindPortalScope::CONTAINER_KEY)
            : null;
    }

    public function __construct(
        private readonly EnquirySequenceService $sequences,
        private readonly AuditLogger $audit,
        private readonly RegexClassificationService $classifier,
    ) {}

    /**
     * The thread list — column two of the inbox.
     *
     * Ordered by the LATEST INBOUND message, not by created_at: a conversation that got
     * a reply this morning belongs at the top even if it opened three weeks ago.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewInbox');

        $threads = EmailThread::query()
            ->when($request->filled('classification'), fn ($q) => $q->where('classification', $request->string('classification')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            // The Unassigned Pool: what nobody has claimed yet.
            ->when($request->boolean('unassigned'), fn ($q) => $q->whereNull('assigned_ops_id'))
            ->when($request->filled('q'), function ($q) use ($request) {
                $term = '%' . $request->string('q') . '%';
                $q->whereIn('thread_key', function ($sub) use ($term) {
                    $sub->select('thread_key')->from('email_messages')
                        ->where('subject', 'like', $term)->orWhere('from', 'like', $term);
                });
            })
            ->with(['assignedOps:id,name', 'enquiry:id,enquiry_no,status'])
            ->orderByDesc('latest_message_received_at')
            ->paginate(50);

        $threads->getCollection()->transform(fn ($t) => $this->shape($t));

        // ⚠️ Merged onto the paginator rather than nesting it, so the existing
        // `data`/`total` shape the list already reads is untouched.
        return response()->json($threads->toArray() + [
            // The folders this portal may show — see classificationsForMode().
            'classifications' => self::classificationsForMode($this->activeMode()),
        ]);
    }

    /** One conversation — column three. */
    public function show(EmailThread $thread): JsonResponse
    {
        $this->authorize('viewInbox');

        $messages = EmailMessage::where('thread_key', $thread->thread_key)
            ->orderBy('received_at')
            ->get(['id', 'direction', 'from', 'to', 'subject', 'body_snippet', 'received_at', 'send_state']);

        return response()->json([
            'thread'   => $this->shape($thread->load(['assignedOps:id,name', 'enquiry:id,enquiry_no,status'])),
            'messages' => $messages,
        ]);
    }

    /**
     * Manual operator override of the regex classification.
     *
     * 🔴 **PROMOTION MINTS AN ENQUIRY.** Not a flag — a numbered document. The number
     * comes from the shared counter and is never recycled.
     *
     * ⚠️ **DEMOTION IS REFUSED ONCE A JOB EXISTS (`422`).** By then a shipment is
     * moving against that enquiry; re-labelling the conversation as airline chatter
     * would strand a live job whose origin nobody can explain.
     */
    public function classify(Request $request, EmailThread $thread): JsonResponse
    {
        $this->authorize('triage');

        // 🔴 Validated against THIS PORTAL's set. The union would let an air operator file
        // a thread as `shipping_line` — a value their own folder list cannot show, so the
        // thread would vanish from every folder they have.
        $data = $request->validate([
            'classification' => 'required|string|in:'
                . implode(',', self::classificationsForMode($this->activeMode())),
        ]);

        $to = $data['classification'];
        $from = $thread->classification;

        if ($to === $from) {
            return response()->json($this->shape($thread->fresh()));
        }

        $promoting = $to === 'customer_enquiry';
        $demoting = $from === 'customer_enquiry' && $thread->enquiry_id !== null;

        if ($demoting && Job::withoutTenantScope()->where('enquiry_id', $thread->enquiry_id)->exists()) {
            return response()->json([
                'error'  => 'This conversation already has a shipment against it. '
                          . 'Cancel the job first — re-classifying would strand it.',
                'reason' => 'has_job',
            ], 422);
        }

        // 🔴 THE LEARNING LOOP, and it was never wired. `RegexClassificationService::
        // recordOverride()` existed, wrote the row and incremented `override_count` — and
        // nothing called it. The dropdown is the only place a human tells the system a
        // rule was wrong, so without this the rules could never be measured, only guessed
        // at. AdminHealthController already READS this table, so the reporting end was
        // reporting on data nothing wrote.
        //
        // Captured OUTSIDE the transaction's rollback concern deliberately: a correction
        // is evidence about the classifier, and it stays true even if the promotion that
        // followed it fails.
        $this->classifier->recordOverride([
            'agent_id'                => $thread->agent_id,
            'email_thread_id'         => $thread->id,
            // ⚠️ NULL until the classifier records which rule fired. Today nothing sets a
            // matched rule on the thread, so an override is attributable to the CHANGE but
            // not yet to the rule that caused it — see GAPS.
            'matched_rule_id'         => null,
            'original_classification' => $from,
            'corrected_classification' => $to,
            'email_subject'           => $this->latestSubject($thread),
            'sender_domain'           => $this->senderDomain($thread),
            'sender_email'            => $this->senderEmail($thread),
            'corrected_by'            => auth()->id(),
        ]);

        DB::transaction(function () use ($thread, $to, $promoting, $demoting) {
            if ($promoting && $thread->enquiry_id === null) {
                $enquiry = Enquiry::create([
                    'agent_id'         => $thread->agent_id,
                    'transport_mode'   => $this->modeForBranch($thread->agent_id),
                    'enquiry_no'       => $this->sequences->next($thread->agent_id, $this->prefixForBranch($thread->agent_id)),
                    'status'           => 'new',
                    'cargo_data_source' => 'manual',
                    // 🔗 WHO the enquiry is from, resolved from the sender's domain.
                    // `customers.email_domain` exists precisely for this and nothing was
                    // using it: every promoted enquiry was created with no client at all,
                    // so sales attribution, credit exposure and the client group all had
                    // nothing to hang on.
                    //
                    // ⚠️ NULL when the domain is unknown, and that is a real state — a
                    // brand-new prospect has no customer row yet. The domain is still
                    // recoverable from the thread's first inbound message, which is what
                    // the enquiry list shows when there is no customer to name.
                    'customer_id'      => $this->customerForDomain($thread),
                ]);

                $thread->enquiry_id = $enquiry->id;
                $this->audit->record($thread->agent_id, 'thread.promoted', 'enquiry', $enquiry->id, auth()->id());
            }

            if ($demoting) {
                // Lost, never deleted. Lost lives on enquiries (PRD.md §1), and nothing
                // here hard-deletes a numbered document — the number was issued.
                Enquiry::withoutTenantScope()->whereKey($thread->enquiry_id)->update([
                    'status'      => 'lost',
                    'lost_reason' => 'other',
                    'lost_reason_custom' => 'Re-classified out of the enquiry queue at triage.',
                    'lost_at'     => now(),
                ]);

                $this->audit->record($thread->agent_id, 'thread.demoted', 'enquiry', $thread->enquiry_id, auth()->id());
            }

            $thread->classification = $to;
            // Somebody looked at it. NOT first_response_at — nothing was sent, and
            // conflating the two reports an SLA the client never experienced.
            $thread->first_triage_at = $thread->first_triage_at ?: now();
            $thread->status = 'triaged';
            $thread->save();
        }, EnquirySequenceService::DEADLOCK_ATTEMPTS);

        return response()->json($this->shape($thread->fresh(['assignedOps', 'enquiry'])));
    }

    /**
     * Atomic claim from the Unassigned Pool.
     *
     * 🔴 **`409` when zero rows are affected.** `UPDATE … WHERE assigned_ops_id IS NULL`
     * decides the race in the database. Reading then writing would let two operators
     * both see NULL and both claim it, and the second would silently take over the
     * first one's conversation.
     */
    public function claim(EmailThread $thread): JsonResponse
    {
        $this->authorize('viewInbox');

        $claimed = EmailThread::withoutTenantScope()
            ->whereKey($thread->id)
            ->whereNull('assigned_ops_id')
            ->update(['assigned_ops_id' => auth()->id(), 'updated_at' => now()]);

        if ($claimed === 0) {
            return response()->json([
                'error'  => 'Someone else has already picked this up.',
                'reason' => 'already_claimed',
            ], 409);
        }

        $this->audit->record($thread->agent_id, 'thread.claimed', 'email_thread', $thread->id, auth()->id());

        return response()->json($this->shape($thread->fresh(['assignedOps', 'enquiry'])));
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    /**
     * ⚠️ Response latency is measured, not stored — `first_response_at` minus the first
     * inbound message. Storing a computed latency lets it drift from the timestamps it
     * was computed from.
     */
    /**
     * The client this conversation is with, matched on the sender's domain.
     *
     * ⚠️ Scoped to the acting COMPANY, not the branch. `customers` is tenant-wide and a
     * client group is every row sharing `(company_id, email_domain)` — matching per branch
     * would fail to recognise a client the Chennai office onboarded.
     */
    private function customerForDomain(EmailThread $thread): ?int
    {
        $domain = $this->senderDomain($thread);

        if ($domain === null) {
            return null;
        }

        $companyId = DB::table('agents_info')->where('id', $thread->agent_id)->value('company_id');

        return DB::table('customers')
            ->where('company_id', $companyId)
            ->whereRaw('LOWER(email_domain) = ?', [$domain])
            ->value('id');
    }

    /** The subject as the operator saw it when they corrected the classification. */
    private function latestSubject(EmailThread $thread): ?string
    {
        return EmailMessage::where('thread_key', $thread->thread_key)
            ->orderByDesc('received_at')->value('subject');
    }

    /** The first INBOUND sender — the correspondent, never our own reply address. */
    private function senderEmail(EmailThread $thread): ?string
    {
        return EmailMessage::where('thread_key', $thread->thread_key)
            ->where('direction', 'inbound')->orderBy('received_at')->value('from');
    }

    /**
     * The domain a future `sender_domain_match` rule would be written against.
     *
     * ⚠️ Stored alongside the full address rather than derived at read time: a rule is
     * written from the DOMAIN, and having it precomputed is what makes "which domains do
     * we keep getting wrong?" a query rather than a script.
     */
    private function senderDomain(EmailThread $thread): ?string
    {
        $email = $this->senderEmail($thread);
        $at = $email === null ? false : strrpos($email, '@');

        return $at === false ? null : strtolower(substr($email, $at + 1));
    }

    private function shape(EmailThread $thread): array
    {
        $latest = EmailMessage::where('thread_key', $thread->thread_key)
            ->orderByDesc('received_at')
            ->first(['subject', 'from', 'body_snippet', 'received_at']);

        // ⚠️ The list shows the CORRESPONDENT, taken from the first INBOUND message —
        // not the sender of the latest one. On any thread we have replied to, the
        // latest sender is us, and a mail list showing your own address in every row
        // is unreadable: the column exists to tell you who you are talking to.
        $correspondent = EmailMessage::where('thread_key', $thread->thread_key)
            ->where('direction', 'inbound')
            ->orderBy('received_at')
            ->value('from');

        return [
            'id'             => $thread->id,
            'thread_key'     => $thread->thread_key,
            'status'         => $thread->status,
            'classification' => $thread->classification,
            'subject'        => $latest->subject ?? null,
            'from'           => $correspondent ?? ($latest->from ?? null),
            'snippet'        => $latest->body_snippet ?? null,
            'latest_message_received_at' => $thread->latest_message_received_at,
            'first_response_at' => $thread->first_response_at,
            'first_triage_at'   => $thread->first_triage_at,
            'assigned_ops'   => $thread->assignedOps ? $thread->assignedOps->only(['id', 'name']) : null,
            'enquiry'        => $thread->enquiry ? $thread->enquiry->only(['id', 'enquiry_no', 'status']) : null,
            'message_count'  => EmailMessage::where('thread_key', $thread->thread_key)->count(),
        ];
    }

    /** The branch's portal decides the mode; a cross-mode caller defaults to air. */
    private function modeForBranch(int $agentId): string
    {
        return app()->bound('active_portal_scope') ? app('active_portal_scope') : 'air';
    }

    private function prefixForBranch(int $agentId): string
    {
        return ['air' => 'ENQA', 'sea' => 'ENQS', 'road' => 'ENQR'][$this->modeForBranch($agentId)];
    }
}
