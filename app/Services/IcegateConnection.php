<?php

namespace App\Services;

/**
 * Whether this install can transmit to ICEGATE, and if not, exactly why (config/icegate.php, GAPS #429).
 *
 * Two things are needed and they arrive separately: the credentials from ICEGATE's developer portal (env keys), and
 * the message specification a transmitter is built from. Either missing means Auto File is refused.
 */
class IcegateConnection
{
    /** @return list<string> env key names that are not set — names only, never values. */
    public function missing(): array
    {
        $keys = [
            'ICEGATE_BASE_URL'      => config('icegate.base_url'),
            'ICEGATE_CLIENT_ID'     => config('icegate.client_id'),
            'ICEGATE_CLIENT_SECRET' => config('icegate.client_secret'),
        ];

        return array_values(array_filter(
            config('icegate.required', []),
            fn (string $key) => blank($keys[$key] ?? null)
        ));
    }

    public function canTransmit(): bool
    {
        return $this->reason() === null;
    }

    /** NULL when Auto File can run; otherwise the one thing that stops it. */
    public function reason(): ?string
    {
        if ($this->missing() !== []) {
            return 'ICEGATE is not connected: ' . implode(', ', $this->missing()) . ' not set.';
        }

        if (blank(config('icegate.transmitter'))) {
            return 'ICEGATE credentials are set, but the filing format is not built yet — it needs ICEGATE\'s message specification.';
        }

        return null;
    }

    public function status(): array
    {
        return [
            'environment'  => config('icegate.environment'),
            'missing'      => $this->missing(),
            'can_transmit' => $this->canTransmit(),
            'reason'       => $this->reason(),
        ];
    }
}
