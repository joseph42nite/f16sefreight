<?php

namespace App\Enums;

/**
 * Mirrors the transport_mode values admitted by chk_enq_mode_prefix and
 * chk_jobs_mode_prefix.
 *
 * Road ships as a MODE from day one (decided 2026-08-27) while its Vue screens stay
 * deferred — the CHECK constraints and three analytics UNIQUE keys were being authored
 * at the time, and widening a live CHECK afterwards is an outage-shaped job.
 */
enum TransportMode: string
{
    case Air  = 'air';
    case Sea  = 'sea';
    case Road = 'road';

    /** The mode marker in every document number: A = air, S = sea, R = road. */
    public function letter(): string
    {
        return match ($this) {
            self::Air  => 'A',
            self::Sea  => 'S',
            self::Road => 'R',
        };
    }

    public function enquiryPrefix(): string
    {
        return 'ENQ' . $this->letter();
    }

    public function jobPrefix(): string
    {
        return 'JOB' . $this->letter();
    }
}
