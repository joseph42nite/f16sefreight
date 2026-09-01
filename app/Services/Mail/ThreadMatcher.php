<?php

namespace App\Services\Mail;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Which conversation does this message belong to — PRD §5.2.3, three tiers in strict order.
 *
 * | # | Match on                                        | Reliability                    |
 * |---|-------------------------------------------------|--------------------------------|
 * | 1 | `provider_thread_id` (Graph `conversationId`)   | Authoritative — adopt it       |
 * | 2 | `In-Reply-To` / `References` against known ids  | Strong, survives cross-provider|
 * | 3 | Normalised subject + participant overlap, 30d   | Heuristic, LAST RESORT         |
 *
 * 🔴 **Tier 3 must never override tiers 1–2.** Freight subjects are formulaic — half the
 * inbox is "Quote request" or "SHIPMENT DOCS" — so subject+participants will happily merge
 * two genuinely separate enquiries from the same client into one thread. Once merged, one
 * of them stops being visible as an enquiry at all, and the conversion denominator quietly
 * loses a row nobody knows to look for.
 */
class ThreadMatcher
{
    /** How far back tier 3 will reach. Beyond this, a matching subject is a coincidence. */
    private const HEURISTIC_DAYS = 30;

    /**
     * @param  string  $mailboxAddress  the connected mailbox's own address — see below
     * @return array{thread_key: string, tier: int}  tier 0 means "new conversation"
     */
    public function resolve(NormalisedMessage $message, int $agentId, string $mailboxAddress = ''): array
    {
        // ── Tier 1: the provider already decided ────────────────────────────
        if (filled($message->threadId)) {
            $existing = DB::table('email_threads')
                ->where('agent_id', $agentId)
                ->where('provider_thread_id', $message->threadId)
                ->value('thread_key');

            if ($existing !== null) {
                return ['thread_key' => $existing, 'tier' => 1];
            }
        }

        // ── Tier 2: the RFC 5322 reply chain ────────────────────────────────
        if ($message->references !== []) {
            $existing = DB::table('email_messages')
                ->where('agent_id', $agentId)
                ->whereIn('message_id', $message->references)
                ->value('thread_key');

            if ($existing !== null) {
                return ['thread_key' => $existing, 'tier' => 2];
            }
        }

        // ── Tier 3: subject + participants, recent only ─────────────────────
        $subject = $message->normalisedSubject();

        if (filled($subject)) {
            $candidates = DB::table('email_messages')
                ->where('agent_id', $agentId)
                ->where('received_at', '>=', now()->subDays(self::HEURISTIC_DAYS))
                ->get(['thread_key', 'subject', 'from', 'to']);

            $participants = $message->participants();

            foreach ($candidates as $candidate) {
                if ($this->normalise((string) $candidate->subject) !== $subject) {
                    continue;
                }

                // ⚠️ Subject alone is not enough. Two clients can both send "Quote request"
                // on the same day, and merging them would put one client's rates in the
                // other's thread — a confidentiality failure, not just a tidiness one.
                $theirs = array_map('strtolower', array_filter(array_merge(
                    [(string) $candidate->from],
                    preg_split('/\s*,\s*/', (string) $candidate->to, -1, PREG_SPLIT_NO_EMPTY) ?: []
                )));

                // 🔴 **THE MAILBOX ITSELF IS ON EVERY MESSAGE, so it must not count as
                // overlap.** Left in, the participant test is satisfied by definition and
                // tier 3 degrades to subject-only matching — which merged two different
                // clients' "Quote request" threads on the first run of this test. That is
                // the confidentiality failure described above, reached by accident.
                if (array_intersect(
                        $this->counterparties($participants, $mailboxAddress),
                        $this->counterparties($theirs, $mailboxAddress)
                    ) !== []) {
                    return ['thread_key' => $candidate->thread_key, 'tier' => 3];
                }
            }
        }

        return ['thread_key' => (string) Str::uuid(), 'tier' => 0];
    }

    /** Everyone on a message except our own mailbox — see the note in tier 3. */
    private function counterparties(array $addresses, string $mailboxAddress): array
    {
        $mine = strtolower($mailboxAddress);

        return array_values(array_filter($addresses, fn ($a) => $a !== $mine && $a !== ''));
    }

    /** Same rule as NormalisedMessage::normalisedSubject, applied to a stored subject. */
    private function normalise(string $subject): string
    {
        do {
            $before = $subject;
            $subject = preg_replace(
                '/^\s*(re|aw|antw|fwd?|wg|tr|rv|sv|vs|res)\s*(\[\d+\])?\s*:\s*/i',
                '',
                $subject
            );
        } while ($subject !== $before);

        return trim(preg_replace('/\s+/', ' ', $subject));
    }
}
