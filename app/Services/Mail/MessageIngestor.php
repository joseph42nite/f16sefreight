<?php

namespace App\Services\Mail;

use App\MailboxConnection;
use App\Enquiry;
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
     * @return array{ingested: int, echoes: int, threads_created: int}
     */
    public function ingest(MailboxConnection $connection, array $messages): array
    {
        $stats = ['ingested' => 0, 'echoes' => 0, 'threads_created' => 0];

        // Oldest first, so a reply never arrives before the message it answers and tier 2
        // has something to match against.
        usort($messages, fn ($a, $b) => $a->receivedAt <=> $b->receivedAt);

        foreach ($messages as $message) {
            // Each message in its OWN transaction. A page of 50 that fails on the 49th must
            // not roll back the 48 already stored — the cursor would then re-deliver them
            // and the run makes no progress at all.
            DB::transaction(function () use ($connection, $message, &$stats) {
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

                    return;
                }

                $match = $this->matcher->resolve($message, $connection->agent_id, (string) $connection->email_address);

                if ($match['tier'] === 0) {
                    $this->createThread($connection, $message, $match['thread_key']);
                    $stats['threads_created']++;
                } else {
                    $this->touchThread($match['thread_key'], $message);
                }

                DB::table('email_messages')->insert([
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
                    'subject'               => $message->subject,
                    'body_snippet'          => $message->snippet === null
                        ? null : mb_substr($message->snippet, 0, 500),
                    'received_at'           => $message->receivedAt,
                    'is_historical'         => 0,
                    'created_at'            => now(),
                    'updated_at'            => now(),
                ]);

                $stats['ingested']++;
            });
        }

        return $stats;
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

    private function touchThread(string $threadKey, NormalisedMessage $message): void
    {
        $thread = DB::table('email_threads')->where('thread_key', $threadKey)
            ->first(['latest_message_received_at', 'first_response_at', 'enquiry_id']);

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

        DB::table('email_threads')->where('thread_key', $threadKey)->update($update);

        if ($message->direction === 'inbound' && $thread->enquiry_id !== null) {
            $this->restartStaleClock((int) $thread->enquiry_id);
        }
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
