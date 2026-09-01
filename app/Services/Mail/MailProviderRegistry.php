<?php

namespace App\Services\Mail;

use RuntimeException;

/**
 * Resolves `mailbox_connections.provider` to an implementation.
 *
 * ⚠️ Gmail is absent deliberately, not accidentally — it is deferred with GAPS #15, and an
 * unknown provider must fail loudly rather than being treated as Outlook. A mailbox whose
 * provider silently resolved to the wrong implementation would sync one tenant's mail with
 * another provider's cursor and produce nothing, with no error to read.
 */
class MailProviderRegistry
{
    public function __construct(private GraphMailProvider $graph)
    {
    }

    public function for(?string $provider): MailProviderContract
    {
        switch ($provider) {
            case 'outlook':
            case 'microsoft':
                return $this->graph;

            case 'gmail':
            case 'google':
                throw new RuntimeException(
                    'Gmail ingestion is not built yet — deferred with the Google CASA '
                    . 'assessment (GAPS #15). Microsoft Graph is the supported provider.'
                );

            default:
                throw new RuntimeException("Unknown mailbox provider: " . var_export($provider, true));
        }
    }

    /** What a user may connect today. */
    public function available(): array
    {
        return ['outlook'];
    }
}
