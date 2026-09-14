<?php

namespace App\Services\Mail;

use RuntimeException;

/** Why an attachment could not be used — the message is for the operator, `status` for the response. */
class AttachmentException extends RuntimeException
{
    public function __construct(string $message, public readonly string $reason, public readonly int $status)
    {
        parent::__construct($message);
    }
}
