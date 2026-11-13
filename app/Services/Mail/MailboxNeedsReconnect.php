<?php

namespace App\Services\Mail;

use RuntimeException;

/**
 * The provider will not issue another token for this mailbox: the refresh token was revoked or has expired, or the
 * owner's consent was withdrawn. Only the owner signing in again fixes it, so the mailbox is marked
 * `reauth_required` and left out of the sweep instead of being retried every two minutes (2026-11-10 audit §4).
 */
class MailboxNeedsReconnect extends RuntimeException
{
}
