<?php

namespace App\Services\Mail;

use RuntimeException;

/** The provider asked us to slow down (Graph: 429, or 503 with Retry-After). Not a failure of the mailbox. */
class MailProviderThrottled extends RuntimeException
{
    public function __construct(public int $retryAfterSeconds, string $message = 'The mail provider asked us to slow down.')
    {
        parent::__construct($message);
    }
}
