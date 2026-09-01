<?php

namespace App\Services\Mail;

use Illuminate\Support\Carbon;

/**
 * One message, in the shape the ingestor understands — guide §4.2.
 *
 * 🔴 **This is the boundary that keeps Gmail from being a rewrite.** Graph calls it
 * `conversationId`, Gmail calls it `threadId`, Graph nests the sender under
 * `from.emailAddress.address` and Gmail buries it in a header array. Every one of those
 * differences dies here, in the provider, rather than spreading through thread matching,
 * classification and the SLA clock.
 */
class NormalisedMessage
{
    /**
     * @param  string       $messageId   RFC 5322 Message-ID — the UNIQUE key that makes an
     *                                   echo of our own send an idempotent upsert
     * @param  ?string      $threadId    the provider's own grouping — thread-match tier 1
     * @param  string[]     $references  In-Reply-To + References chain — tier 2
     * @param  string       $direction   inbound | outbound
     * @param  ?string      $providerId  the provider's message id, for fetching attachments
     */
    public function __construct(
        public readonly string $messageId,
        public readonly ?string $threadId,
        public readonly string $from,
        public readonly array $to,
        public readonly ?string $subject,
        public readonly ?string $snippet,
        public readonly Carbon $receivedAt,
        public readonly string $direction,
        public readonly array $references = [],
        public readonly bool $hasAttachments = false,
        public readonly ?string $providerId = null,
    ) {
    }

    /**
     * The subject with reply and forward prefixes stripped — thread-match tier 3.
     *
     * ⚠️ Deliberately handles non-English prefixes. A German Outlook sends `AW:` and a
     * French one `RE :` with a space; matching only `Re:` silently starts a new thread for
     * every reply from half of Europe, which for a freight forwarder is most of the book.
     */
    public function normalisedSubject(): string
    {
        $subject = (string) $this->subject;

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

    /** Everyone on the message, lower-cased and sorted — the tier 3 participant set. */
    public function participants(): array
    {
        $all = array_map('strtolower', array_filter(array_merge([$this->from], $this->to)));
        sort($all);

        return array_values(array_unique($all));
    }
}
