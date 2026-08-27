<?php

namespace App\Enums;

/**
 * The pre-conversion lifecycle. Mirrors chk_enq_status exactly.
 *
 * 🔴 'Lost' lives ONLY here — there is no Cancelled. The database CHECK is the
 * authority; this enum only surfaces a violation as a validation error instead of a raw
 * SQL failure. If the two ever disagree, the CHECK wins and the write fails anyway.
 *
 * ⚠️ Values are lowercase and the CHECK is CASE-SENSITIVE (it forces
 * COLLATE utf8mb4_bin). 'Lost' is not a variant of 'lost'; it is rejected.
 */
enum EnquiryStatus: string
{
    case New            = 'new';
    case Quoted         = 'quoted';
    case AwaitingClient = 'awaiting_client';
    case Converted      = 'converted';
    case Lost           = 'lost';

    /** Terminal in the funnel: no further sales action is expected. */
    public function isClosed(): bool
    {
        return in_array($this, [self::Converted, self::Lost], true);
    }
}
