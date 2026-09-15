<?php

namespace App\Http\Controllers\Freight;

use App\EmailMessage;
use App\Http\Middleware\BindPortalScope;
use App\EmailThread;
use App\MailboxConnection;
use App\EmailAttachment;
use App\Services\Mail\AttachmentException;
use App\Services\Mail\AttachmentStore;
use App\Services\Mail\ThreadMailer;
use App\Enquiry;
use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use App\Services\ClientNotificationService;
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
        private readonly ClientNotificationService $clientUpdates,
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

        $threads = EmailThread::query()->visibleTo(auth()->user())
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
            ->with([
                'assignedOps:id,name',
                'enquiry:id,enquiry_no,status,lost_reason,lost_automatically',
                // The job is what the operator quotes once conversion has happened —
                // eager-loaded so a 50-row list does not become 50 extra queries.
                'enquiry.jobs:id,enquiry_id,execution_job_no,awb_number,status',
            ])
            ->orderByDesc('latest_message_received_at')
            ->paginate(50);

        $mail = $this->mailSummaries($threads->getCollection()->pluck('thread_key'));
        $threads->getCollection()->transform(fn ($t) => $this->shape($t, $mail[$t->thread_key] ?? null));

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
        abort_unless($thread->isVisibleTo(auth()->user()), 404);

        $messages = EmailMessage::where('thread_key', $thread->thread_key)
            ->orderBy('received_at')
            // `cc` rides along so the reading pane can show who else is on the
            // conversation — and so Reply All has the list without a second round trip.
            // The files each message carried, for the chips under it. Names and state only —
            // the bytes are fetched when someone opens one (EmailAttachmentController).
            ->with('attachments:id,email_message_id,filename,mime_type,size_bytes,fetch_state')
            ->get(['id', 'direction', 'from', 'to', 'cc', 'subject', 'body_snippet', 'received_at', 'send_state']);

        return response()->json([
            'thread'   => $this->shape($thread->load([
                'assignedOps:id,name',
                'enquiry:id,enquiry_no,status,lost_reason,lost_automatically',
                'enquiry.jobs:id,enquiry_id,execution_job_no,awb_number,status',
            ])),
            'messages' => $messages,
            // What "Add signature" will put under a reply, shown greyed in the composer.
            'signature' => $this->threadSignature($thread),
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
        $this->authorize('classifyThread');
        abort_unless($thread->isVisibleTo(auth()->user()), 404);

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
            // The words the classifier read. Without them a correction says the regex was
            // wrong but not what it was wrong about, and every tuning session begins by
            // going back to the mailbox to find out.
            'email_snippet'           => $this->latestSnippet($thread),
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
    public function claim(Request $request, EmailThread $thread): JsonResponse
    {
        $this->authorize('viewInbox');
        // Claiming takes on the work; sales read and answer, they do not take shipments on.
        abort_if(auth()->user()->designation === 'sales', 403);

        // The claim pop-up's answer: send the "we have your enquiry" mail as edited, or claim without it.
        $update = $request->filled('client_update.decision') ? $this->clientUpdateInput($request, 'client_update.') : null;

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

        if ($update !== null) {
            $update = $this->clientUpdates->decide($thread->fresh(), auth()->user(), 'claimed', ...$update);
        }

        return response()->json($this->shape($thread->fresh(['assignedOps', 'enquiry'])) + ['client_update_result' => $update]);
    }

    /** The mail a moment would send, for the claim pop-up. Nothing is stored. */
    public function previewClientUpdate(Request $request, EmailThread $thread): JsonResponse
    {
        $this->authorizeClientUpdate($thread);
        $stage = $request->validate(['stage' => ['required', 'in:' . implode(',', array_keys(ClientNotificationService::STAGES))]])['stage'];

        $draft = $thread->classification === 'customer_enquiry' && ! $this->clientUpdates->handled($thread, $stage)
            ? $this->clientUpdates->draft($thread, $stage) : null;

        return response()->json(['draft' => $draft]);
    }

    /** Send or skip the update waiting on this conversation. */
    public function decideClientUpdate(Request $request, EmailThread $thread): JsonResponse
    {
        $this->authorizeClientUpdate($thread);

        $result = $this->clientUpdates->decide($thread, auth()->user(), (string) $request->input('stage'), ...$this->clientUpdateInput($request));

        if (! $result['ok']) {
            return response()->json(['error' => $result['error'], 'reason' => $result['reason']], $result['status']);
        }

        return response()->json($this->shape($thread->fresh(['assignedOps', 'enquiry'])));
    }

    private function authorizeClientUpdate(EmailThread $thread): void
    {
        $this->authorize('viewInbox');
        abort_if(auth()->user()->designation === 'sales', 403);
        abort_unless($thread->isVisibleTo(auth()->user()), 404);
    }

    /** @return array{0: string, 1: array} the decision and the person's edits */
    private function clientUpdateInput(Request $request, string $prefix = ''): array
    {
        $data = $request->validate([
            $prefix . 'decision' => ['required', 'in:send,skip'],
            $prefix . 'to'       => ['nullable', 'array', 'min:1'],
            $prefix . 'to.*'     => ['email'],
            $prefix . 'cc'       => ['nullable', 'array'],
            $prefix . 'cc.*'     => ['email'],
            $prefix . 'subject'  => ['nullable', 'string', 'max:255'],
            $prefix . 'body'     => ['nullable', 'string', 'max:10000'],
        ]);
        $data = $prefix === '' ? $data : $data[rtrim($prefix, '.')];

        return [$data['decision'], array_intersect_key($data, array_flip(['to', 'cc', 'subject', 'body']))];
    }

    /**
     * Hand a conversation to another pricing colleague in the branch (user, 2026-09-15/16). Pricing (and the Boss)
     * assign directly; the new owner is told in their bell. While the enquiry is still open they also become its
     * pricing owner, so the quote and the confirmed shipment follow the person now handling it.
     */
    public function assign(Request $request, EmailThread $thread): JsonResponse
    {
        $this->authorize('assignOperator');
        abort_unless($thread->isVisibleTo(auth()->user()), 404);

        $data = $request->validate(['user_id' => ['required', 'integer']]);

        // Another pricing colleague in this branch (user, 2026-09-16) — operators are chosen when the shipment is confirmed.
        $to = \App\User::whereKey($data['user_id'])->where('branch_name', $thread->agent_id)
            ->where('designation', 'pricing')->where('is_active', 1)->whereKeyNot(auth()->id())->first();

        if ($to === null) {
            return response()->json(['error' => 'Choose another pricing colleague in this branch.', 'reason' => 'not_assignable'], 422);
        }

        $thread->forceFill(['assigned_ops_id' => $to->id])->save();

        $enquiry = $thread->enquiry;
        if ($enquiry && ! $enquiry->jobs()->exists()) {
            $enquiry->forceFill(['pricing_id' => $to->id])->save();
        }

        $this->audit->record($thread->agent_id, 'thread.assigned', 'email_thread', $thread->id, auth()->id());

        $subject = EmailMessage::where('thread_key', $thread->thread_key)->orderBy('received_at')->value('subject');
        app(\App\Services\BellNotificationService::class)->notify($thread->agent_id, $to->id, 'ThreadAssigned', [
            'thread_id' => $thread->id, 'subject' => $subject, 'by' => auth()->user()->name,
        ]);

        return response()->json($this->shape($thread->fresh(['assignedOps', 'enquiry'])));
    }

    /**
     * Reply, reply-all or forward — one endpoint, because they differ only in who the
     * caller puts in `to` and `cc`.
     *
     * 🔴 The recipient list is decided by the CLIENT and validated here, not inferred
     * server-side from a "mode" flag. Reply-all in every mail client is an editable
     * starting point, not a command: the operator routinely drops the airline from a
     * commercial reply, and a server that recomputed the list would silently put them
     * back.
     *
     * 🔴 NO LOCAL ROW IS WRITTEN. The sent message returns on the next delta as an echo
     * and upserts on its unique `message_id`. Writing one here would duplicate it.
     *
     * ⚠️ Sends from the mailbox the THREAD arrived on, not from the operator's own. A
     * client who replies must land back on this conversation, and a reply sent from a
     * different address starts a new one on their side.
     */
    public function reply(Request $request, EmailThread $thread): JsonResponse
    {
        $this->authorize('viewInbox');
        abort_unless($thread->isVisibleTo(auth()->user()), 404);

        $data = $request->validate([
            'to'      => ['required', 'array', 'min:1'],
            'to.*'    => ['email'],
            'cc'      => ['nullable', 'array'],
            'cc.*'    => ['email'],
            'subject' => ['required', 'string', 'max:255'],
            // The body as the composer's HTML. Cleaned below — the editor is not the boundary.
            'body'    => ['required', 'string'],
            // The message being answered. Absent = a new mail on this thread.
            'in_reply_to' => ['nullable', 'integer'],
            // The composer's "Add signature" switch. Absent = on.
            'include_signature' => ['nullable', 'boolean'],
            'mode'    => ['nullable', 'in:reply,forward'],
            // Files from the operator's computer, and files already on this conversation.
            'files'   => ['nullable', 'array'],
            'files.*' => ['file', 'max:' . (self::ATTACHMENT_CAP_BYTES / 1024)],
            'attachment_ids'   => ['nullable', 'array'],
            'attachment_ids.*' => ['integer'],
        ]);

        try {
            $attachments = $this->outgoingAttachments($request, $thread, $data['attachment_ids'] ?? []);
        } catch (AttachmentException $e) {
            return response()->json(['error' => $e->getMessage(), 'reason' => $e->reason], $e->status);
        }

        $result = app(ThreadMailer::class)->send(
            $thread, auth()->user(), $data['to'], $data['cc'] ?? [], $data['subject'], $data['body'], $attachments,
            $data['in_reply_to'] ?? null, $data['include_signature'] ?? true, $data['mode'] ?? 'reply'
        );

        if (! $result['ok']) {
            return response()->json(['error' => $result['error'], 'reason' => $result['reason']], $result['status']);
        }

        $this->audit->record($thread->agent_id, 'thread.replied', 'email_thread', $thread->id, auth()->id());

        // 🔴 The pricing member who answers an unclaimed conversation first has taken it on (user, 2026-09-15/16; PRD
        // §5.4 "the system assigns the first staff member who replies") — the Claim button goes.
        $claimed = auth()->user()->designation === 'pricing' && EmailThread::withoutTenantScope()
            ->whereKey($thread->id)->whereNull('assigned_ops_id')
            ->update(['assigned_ops_id' => auth()->id(), 'updated_at' => now()]) > 0;

        if ($claimed) {
            $this->audit->record($thread->agent_id, 'thread.claimed', 'email_thread', $thread->id, auth()->id());
        }
        if (auth()->user()->designation !== 'sales') {
            $this->clientUpdates->markReplied($thread->fresh());
        }

        return response()->json([
            'ok' => true,
            'threaded' => $result['threaded'],
            'assigned_ops' => $this->shape($thread->fresh(['assignedOps', 'enquiry']))['assigned_ops'],
        ]);
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    /** PRD §5.2.3: the provider cap, for everything attached to one mail together. */
    private const ATTACHMENT_CAP_BYTES = 25 * 1024 * 1024;

    /**
     * The files a reply or forward carries: uploads, and files already on this conversation.
     *
     * 🔴 Every upload is virus-scanned before it leaves, and a conversation's file is fetched and
     * scanned the same way opening it would (AttachmentStore) — a forward re-uses the cached copy.
     * ⚠️ A file id from ANOTHER conversation is refused: the picker only offers this thread's.
     *
     * @return array<int, array{name: string, mime_type: string, bytes: string}>
     * @throws AttachmentException
     */
    private function outgoingAttachments(Request $request, EmailThread $thread, array $attachmentIds): array
    {
        $store = app(AttachmentStore::class);
        $files = [];

        if ($attachmentIds !== []) {
            $onThread = EmailAttachment::whereIn('id', $attachmentIds)
                ->whereIn('email_message_id', EmailMessage::where('thread_key', $thread->thread_key)->select('id'))
                ->get();

            if ($onThread->count() !== count(array_unique($attachmentIds))) {
                throw new AttachmentException('A file you picked is not on this conversation.', 'not_on_thread', 422);
            }

            foreach ($onThread as $attachment) {
                $files[] = ['name' => $attachment->filename, 'mime_type' => $attachment->mime_type, 'bytes' => $store->bytes($attachment)];
            }
        }

        foreach ($request->file('files', []) as $upload) {
            $bytes = (string) file_get_contents($upload->getRealPath());
            $name = $upload->getClientOriginalName();
            $store->scan($bytes, null, $name);
            $files[] = ['name' => $name, 'mime_type' => $upload->getMimeType() ?: 'application/octet-stream', 'bytes' => $bytes];
        }

        $total = array_sum(array_map(fn ($f) => strlen($f['bytes']), $files));

        if ($total > self::ATTACHMENT_CAP_BYTES) {
            throw new AttachmentException(
                'The attachments come to ' . round($total / 1048576, 1) . ' MB; a mail can carry at most 25 MB.', 'too_large', 422
            );
        }

        return $files;
    }

    /** The signature a reply on this thread would carry, or null. */
    private function threadSignature(EmailThread $thread): ?string
    {
        $connection = MailboxConnection::find(
            EmailMessage::where('thread_key', $thread->thread_key)->orderByDesc('received_at')->value('mailbox_connection_id')
        );

        return $connection ? app(ThreadMailer::class)->signatureFor($connection, auth()->user()) : null;
    }

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

    /** The body text the classifier matched against — snippet only, as it reads. */
    private function latestSnippet(EmailThread $thread): ?string
    {
        return EmailMessage::where('thread_key', $thread->thread_key)
            ->where('direction', 'inbound')
            ->orderByDesc('received_at')
            ->value('body_snippet');
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

    /**
     * The list's mail facts for many conversations in four queries, not five per row (2026-09-16 speed pass):
     * the latest message (subject, snippet, the mailbox it came on), the first INBOUND sender, and the count.
     *
     * @return array<string, array{subject: ?string, from: ?string, snippet: ?string, mailbox_address: ?string, message_count: int}>
     */
    private function mailSummaries(\Illuminate\Support\Collection $keys): array
    {
        if ($keys->isEmpty()) {
            return [];
        }

        // One row per conversation: the first by received_at in the given order.
        $first = fn (string $order, ?string $direction = null) => DB::query()->fromSub(
            EmailMessage::whereIn('thread_key', $keys)
                ->when($direction, fn ($q) => $q->where('direction', $direction))
                ->select('thread_key', 'subject', 'from', 'body_snippet', 'received_at', 'mailbox_connection_id')
                ->selectRaw("ROW_NUMBER() OVER (PARTITION BY thread_key ORDER BY received_at {$order}) AS rn"),
            'm'
        )->where('rn', 1)->get()->keyBy('thread_key');

        $latest = $first('DESC');
        $correspondent = $first('ASC', 'inbound');
        $counts = EmailMessage::whereIn('thread_key', $keys)->groupBy('thread_key')->selectRaw('thread_key, COUNT(*) AS n')->pluck('n', 'thread_key');
        $mailboxes = MailboxConnection::whereIn('id', $latest->pluck('mailbox_connection_id')->filter())->pluck('email_address', 'id');

        return $keys->mapWithKeys(fn ($key) => [$key => [
            'subject' => $latest[$key]->subject ?? null,
            // ⚠️ The list shows the CORRESPONDENT — the first INBOUND sender, not the latest one, which on any
            // answered conversation is us.
            'from' => $correspondent[$key]->from ?? ($latest[$key]->from ?? null),
            'snippet' => $latest[$key]->body_snippet ?? null,
            // 🔴 The mailbox the conversation arrived on: reply-all removes it, or the desk copies itself.
            'mailbox_address' => $mailboxes[$latest[$key]->mailbox_connection_id ?? 0] ?? null,
            'message_count' => (int) ($counts[$key] ?? 0),
        ]])->all();
    }

    private function shape(EmailThread $thread, ?array $mail = null): array
    {
        $mail ??= $this->mailSummaries(collect([$thread->thread_key]))[$thread->thread_key];

        // ONE enquiry may split into several jobs (a consol with house shipments).
        $jobs = $thread->enquiry ? $thread->enquiry->jobs->sortByDesc('id')->values() : collect();
        $job  = $jobs->first();

        return [
            'id'             => $thread->id,
            'thread_key'     => $thread->thread_key,
            'status'         => $thread->status,
            'classification' => $thread->classification,
            'mailbox_address' => $mail['mailbox_address'],
            // What the parser read out of the mail, for the operator to check. A
            // suggestion with a confidence per field — never a value anything downstream
            // reads on its own.
            'staged_cargo'   => $thread->staged_cargo
                ? json_decode($thread->staged_cargo, true)
                : null,
            'subject'        => $mail['subject'],
            'from'           => $mail['from'],
            'snippet'        => $mail['snippet'],
            'latest_message_received_at' => $thread->latest_message_received_at,
            'first_response_at' => $thread->first_response_at,
            'first_triage_at'   => $thread->first_triage_at,
            'assigned_ops'   => $thread->assignedOps ? $thread->assignedOps->only(['id', 'name']) : null,
            'enquiry'        => $thread->enquiry ? $thread->enquiry->only(['id', 'enquiry_no', 'status', 'lost_reason', 'lost_automatically']) : null,
            // 🔗 enquiry -> job -> waybill, resolved once here rather than by a second
            // round trip from the drawer. Newest first, matching JobController@index's
            // `latest()`, so both surfaces name the same job out of a consol split.
            'job'            => $job ? $job->only(['id', 'execution_job_no', 'awb_number', 'status']) : null,
            'job_count'      => $jobs->count(),
            'message_count'  => $mail['message_count'],
            // The client update waiting for someone to send or skip it — the card on the conversation.
            'client_update'  => $thread->pending_client_notification,
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
