<?php

namespace App\Services\Mail;

use App\MailboxConnection;
use App\Enquiry;
use App\EmailMessage;
use Illuminate\Support\Facades\DB;

/**
 * Turns normalised messages into `email_threads` / `email_messages` rows — guide §4.2.
 *
 * 🔴 **Provider-agnostic on purpose.** Nothing here knows what Graph or Gmail look like;
 * that died in the provider. This is the part that would otherwise have to be rewritten
 * when Gmail lands (GAPS #15).
 *
 * 🔴 **ECHO SUPPRESSION IS THE POINT OF THE UPSERT.** A message sent through the portal
 * lands in the user's Sent folder and comes back on the next sync. `message_id` is UNIQUE,
 * so the echo is an idempotent upsert rather than an insert — and the upsert refreshes
 * delivery metadata but must NEVER re-fire classification, SLA timers or notifications.
 * Without that, every reply we send re-opens the thread we just answered.
 */
class MessageIngestor
{
    public function __construct(private ThreadMatcher $matcher)
    {
    }

    /**
     * @param  NormalisedMessage[]  $messages
     * @param  bool  $historical  read by a new mailbox's import — no enquiry's reminder clock is restarted
     * @return array{ingested: int, echoes: int, threads_created: int}
     */
    public function ingest(MailboxConnection $connection, array $messages, bool $historical = false): array
    {
        $stats = ['ingested' => 0, 'echoes' => 0, 'threads_created' => 0];

        // Oldest first, so a reply never arrives before the message it answers and tier 2
        // has something to match against.
        usort($messages, fn ($a, $b) => $a->receivedAt <=> $b->receivedAt);

        foreach ($messages as $message) {
            // Each message in its OWN transaction. A page of 50 that fails on the 49th must
            // not roll back the 48 already stored — the cursor would then re-deliver them
            // and the run makes no progress at all.
            $storedId = DB::transaction(function () use ($connection, $message, $historical, &$stats) {
                $existing = DB::table('email_messages')
                    ->where('message_id', $message->messageId)
                    ->first(['id', 'thread_key']);

                if ($existing !== null) {
                    // 🔒 THE ECHO PATH. Refresh what may legitimately have changed and
                    // stop. No thread timestamps, no classification, no notifications.
                    DB::table('email_messages')->where('id', $existing->id)->update([
                        'body_snippet' => $message->snippet,
                        'updated_at'   => now(),
                    ]);

                    $stats['echoes']++;

                    return null;
                }

                $match = $this->matcher->resolve($message, $connection->agent_id, (string) $connection->email_address);

                if ($match['tier'] === 0) {
                    $this->createThread($connection, $message, $match['thread_key']);
                    $stats['threads_created']++;
                } else {
                    $this->touchThread($connection, $match['thread_key'], $message, $historical);
                }

                $id = DB::table('email_messages')->insertGetId([
                    'agent_id'              => $connection->agent_id,
                    'mailbox_connection_id' => $connection->id,
                    'thread_key'            => $match['thread_key'],
                    'provider_thread_id'    => $message->threadId,
                    'direction'             => $message->direction,
                    'sent_via_portal'       => 0,
                    'send_attempts'         => 0,
                    'message_id'            => $message->messageId,
                    'from'                  => $message->from,
                    'to'                    => implode(', ', $message->to),
                    // Stored as sent: everyone who was on the conversation, in order.
                    // This is what reply-all reads, and what GAPS #47 needs to keep the
                    // same people in copy when a new thread is started.
                    // The handle for acting on this message later — replying to it,
                    // fetching its attachments. Captured by the provider since day one
                    // and dropped here until there was a column to put it in.
                    'provider_message_id'   => $message->providerId,
                    'cc'                    => implode(', ', $message->cc) ?: null,
                    'bcc'                   => implode(', ', $message->bcc) ?: null,
                    'subject'               => $message->subject,
                    'body_snippet'          => $message->snippet === null
                        ? null : mb_substr($message->snippet, 0, 500),
                    'received_at'           => $message->receivedAt,
                    'is_historical'         => $historical ? 1 : 0,
                    'created_at'            => now(),
                    'updated_at'            => now(),
                ]);

                $stats['ingested']++;

                // The client's addresses — sender and copied — saved to its contacts.
                if ($message->direction === 'inbound') {
                    app(\App\Services\ClientContacts::class)->record($connection->agent_id, array_merge([$message->from], $message->to, $message->cc), $message->receivedAt);
                }

                return $id;
            });

            // OUTSIDE the transaction: a provider call must not hold the message's row lock,
            // and a failed listing must not undo a message that was stored correctly.
            if ($storedId !== null && $message->hasAttachments && $message->providerId !== null) {
                $this->indexAttachments($connection, $storedId, $message->providerId);
            }

            // 🔴 ALSO OUTSIDE, and for the same reason plus a worse one (2026-09-20). Filing used
            // to be a regex and ran inside the transaction above, which was free. It is a hosted
            // model now: roughly 600ms, up to `mail_intent.timeout` when it hangs. Inside the
            // transaction that call was held open across a `lockForUpdate` on the tenant's
            // companies row — taken to charge the credit — so every other mail for that tenant,
            // AND every document extraction reserving a credit, queued behind one HTTP request.
            //
            // ⚠️ The trade is deliberate and is the one indexAttachments already makes: a crash
            // between the commit and this line leaves a thread `unclassified`. That is a visible
            // state an operator can file from, and it is recoverable. A lock held across a
            // third party's latency is neither.
            if ($storedId !== null) {
                $this->stageClassification($message);
            }
        }

        return $stats;
    }

    /**
     * Record a message's attachments — names, types and sizes, never the bytes (guide §4.2).
     *
     * ⚠️ A listing that fails is logged, not thrown: the mail is still worth having without its
     * chips, and a sync that stopped on one attachment call would stop the whole mailbox.
     */
    private function indexAttachments(MailboxConnection $connection, int $messageId, string $providerMessageId): void
    {
        try {
            $files = app(MailProviderRegistry::class)->for($connection->provider)
                ->attachments($connection, $providerMessageId);
        } catch (\Throwable $e) {
            report($e);

            return;
        }

        foreach ($files as $file) {
            DB::table('email_attachments')->insert([
                'email_message_id'       => $messageId,
                'filename'               => mb_substr($file['name'], 0, 255),
                'provider_attachment_id' => $file['id'],
                'mime_type'              => mb_substr($file['mime_type'], 0, 255),
                'size_bytes'             => $file['size'],
                // Listed, not downloaded: the bytes are fetched when someone opens the file.
                'fetch_state'            => 'remote',
                'created_at'             => now(),
                'updated_at'             => now(),
            ]);
        }
    }

    /**
     * Stage what the classifier thinks this conversation is. It never mints anything.
     *
     * 🔴 Called AFTER the message's transaction has committed — see the call site. It re-reads the
     * message by `message_id` rather than taking one as an argument, which is what makes that safe:
     * it depends on the committed row, not on anything transaction-local.
     *
     * ⚠️ PRD §5.2.3: **the classifier stages, the OPERATOR mints.** Creating an enquiry here would
     * inflate the conversion denominator with conversations nobody ever treated as an
     * enquiry — so this writes one column and stops.
     *
     * 🔴 Only while the thread is still `unclassified`. A later message must never
     * overwrite a human's decision: an operator who filed a thread as `airline` has said
     * something the classifier does not get to argue with, and a client's reply arriving
     * afterwards would otherwise silently undo it.
     */
    private function stageClassification(NormalisedMessage $message): void
    {
        $stored = EmailMessage::where('message_id', $message->messageId)->first();

        if ($stored === null) {
            return;
        }

        $result = app(MailFilingService::class)->classify($stored);

        // NULL means the message must not be classified at all — outbound, or backfilled.
        if ($result === null) {
            return;
        }

        $filed = DB::table('email_threads')
            ->where('thread_key', $stored->thread_key)
            ->where('classification', 'unclassified')
            ->update([
                // What the classifier said, kept when a person later changes it — Super Admin → Mail filing (2026-09-17).
                'auto_classification' => $result['classification'],
                // 🔴 And WHO said it: rule | client | directory | model | none. An override
                // report that cannot name the source cannot tell a bad tenant rule from a bad
                // rubric, and those have nothing in common but the symptom (2026-09-20).
                'auto_classification_source' => $result['source'],
                'auto_classification_confidence' => $result['confidence'],
                'auto_classification_rubric' => $result['rubric'],
                'classification' => $result['classification'],
                // PRD §5.2.5 — the cargo the parser read, parked for the operator to
                // confirm. NULL where nothing was found: an airline notice has no cargo in
                // it, and an empty object would claim we looked and found none, which is a
                // different statement from having nothing to say.
                'staged_cargo'   => $result['cargo'] === [] ? null : json_encode($result['cargo']),
                'updated_at'     => now(),
            ]);

        // Filed as a customer enquiry: it gets its enquiry number now (user, 2026-09-17), so it is in the Kanban pool.
        if ($filed > 0 && $result['classification'] === 'customer_enquiry') {
            app(\App\Services\EnquiryMinter::class)->mintForArrivedMail($stored->thread_key);
        }
    }

    private function createThread(MailboxConnection $connection, NormalisedMessage $message, string $threadKey): void
    {
        DB::table('email_threads')->insert([
            'agent_id'           => $connection->agent_id,
            'thread_key'         => $threadKey,
            'provider_thread_id' => $message->threadId,
            'status'             => 'new',
            // ⚠️ Classification is the REGEX service's job and the operator's decision, not
            // ingestion's. PRD §5.2.3: regex stages, the operator mints — auto-minting an
            // enquiry here corrupts the conversion denominator.
            'classification'     => 'unclassified',
            'latest_message_received_at' => $message->receivedAt,
            // An outbound first message means WE started the conversation (outreach), so
            // the response clock starts already answered rather than running against us.
            'first_response_at'  => $message->direction === 'outbound' ? $message->receivedAt : null,
            'created_at'         => now(),
            'updated_at'         => now(),
        ]);
    }

    private function touchThread(MailboxConnection $connection, string $threadKey, NormalisedMessage $message, bool $historical = false): void
    {
        $thread = DB::table('email_threads')->where('thread_key', $threadKey)
            ->first(['agent_id', 'latest_message_received_at', 'first_response_at', 'enquiry_id', 'assigned_ops_id', 'client_updates']);

        if ($thread === null) {
            return;
        }

        $update = ['updated_at' => now()];

        // 🔴 Only INBOUND moves the clock. An outbound reply that reset
        // `latest_message_received_at` would make every answered thread look like it had
        // just been chased by the client — and would clear the staleness signal that the
        // nudge sweep depends on (PRD §5.2.3).
        if ($message->direction === 'inbound'
            && $message->receivedAt->gt($thread->latest_message_received_at)) {
            $update['latest_message_received_at'] = $message->receivedAt;
        }

        // 🟢 THE RETROACTIVE FILL. A reply typed in Outlook counts exactly like one sent
        // from the portal, which is what makes response latency measurable at all — and
        // what turns `lost_reason = 'delay_in_response'` from an assertion into a
        // provable number (PRD §5.2.3).
        if ($message->direction === 'outbound' && $thread->first_response_at === null) {
            $update['first_response_at'] = $message->receivedAt;
        }

        // 🔴 A first reply typed in Outlook claims the conversation too (user, 2026-09-16): the pricing member who sent
        // it has taken it on, and has already written the acknowledgement, so none is offered.
        if ($message->direction === 'outbound' && $thread->assigned_ops_id === null
            && ($sender = $this->pricingSender($connection, (int) $thread->agent_id, $message->from))) {
            $update['assigned_ops_id'] = $sender;
            $updates = json_decode((string) $thread->client_updates, true) ?: [];
            $updates['claimed'] ??= ['decision' => 'replied', 'by' => $sender, 'at' => now()->toIso8601String()];
            $update['client_updates'] = json_encode($updates);
        }

        DB::table('email_threads')->where('thread_key', $threadKey)->update($update);

        if ($message->direction === 'inbound' && $thread->enquiry_id !== null && ! $historical) {
            $this->restartStaleClock((int) $thread->enquiry_id);
        }
    }

    /** The branch's pricing member who sent this: by their own address, or sent as the mailbox they connected. */
    private function pricingSender(MailboxConnection $connection, int $agentId, string $from): ?int
    {
        $pricing = DB::table('users')->where('branch_name', $agentId)->where('designation', 'pricing')->where('is_active', 1);

        return (clone $pricing)->whereRaw('LOWER(email) = ?', [strtolower($from)])->value('id')
            ?? (strcasecmp($from, (string) $connection->email_address) === 0 ? (clone $pricing)->where('id', $connection->user_id)->value('id') : null);
    }

    /**
     * 🔴 A client who REPLIES is not a client who went quiet.
     *
     * The nudge sweep escalates on `enquiries.updated_at` and closes the enquiry once its
     * reminders go unanswered — but ingestion only ever wrote to `email_threads`, so an
     * enquiry's own row never moved when the client wrote back. The clock therefore ran
     * against enquiries that were actively being answered, and the auto-close would have
     * declared a live conversation dead. That is the worst thing this feature could do,
     * so the reply has to reach the enquiry.
     *
     * Written raw rather than through the model: no observer should interpret an inbound
     * message as a lifecycle event, and `saveQuietly()` would still not stop the global
     * scopes from hiding a row the ingestor legitimately reaches across tenants.
     */
    private function restartStaleClock(int $enquiryId): void
    {
        DB::table('enquiries')
            ->where('id', $enquiryId)
            // Only while the client is still expected to come back. A reply arriving on a
            // CONVERTED enquiry is ordinary shipment traffic, and one on a lost enquiry is
            // the desk's call to reopen — neither is the sweep's business.
            ->whereIn('status', Enquiry::OPEN_STATUSES)
            ->update([
                'stale_nudged_at'   => null,
                'stale_nudge_count' => 0,
                'updated_at'        => now(),
            ]);
    }
}
