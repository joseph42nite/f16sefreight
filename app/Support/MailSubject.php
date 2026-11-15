<?php

namespace App\Support;

/**
 * A mail subject with its reply and forward prefixes removed — what two mails of one conversation have in common.
 *
 * One rule, in one place: the incoming message and the stored row have to be normalised the same way or a reply is
 * filed as a new conversation.
 */
class MailSubject
{
    public static function normalise(?string $subject): string
    {
        $subject = (string) $subject;

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

    /** What `email_messages.subject_key` holds: short and fixed-width, so it can be indexed. Null for no subject. */
    public static function key(?string $subject): ?string
    {
        $normalised = self::normalise($subject);

        return $normalised === '' ? null : md5($normalised);
    }
}
