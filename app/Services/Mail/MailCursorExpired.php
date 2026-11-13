<?php

namespace App\Services\Mail;

use RuntimeException;

/** The provider no longer honours a stored sync cursor (Graph: 410 Gone). The folder has to be read again. */
class MailCursorExpired extends RuntimeException
{
}
