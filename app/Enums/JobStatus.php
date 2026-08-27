<?php

namespace App\Enums;

/**
 * The post-conversion lifecycle. Mirrors chk_jobs_status exactly.
 *
 * 🔴 'Lost' is deliberately ABSENT — it is an enquiries.status value. A shipment that
 * was confirmed and then stopped is Cancelled, not Lost. Blending the two corrupts
 * conversion rate in one direction and execution-failure rate in the other.
 *
 * ⚠️ Values are Title Case with spaces, and the CHECK is CASE-SENSITIVE. 'cancelled'
 * is rejected; only 'Cancelled' is valid.
 */
enum JobStatus: string
{
    case Intake           = 'Intake';
    case AiExtraction     = 'AI Extraction';
    case Verification     = 'Verification';
    case Generation       = 'Generation';
    case PdfGenerated     = 'PDF Generated';
    case SentToAirline    = 'Sent to Airline';
    case AirlineConfirmed = 'Airline Confirmed';
    case Completed        = 'Completed';
    case Cancelled        = 'Cancelled';

    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Cancelled], true);
    }
}
