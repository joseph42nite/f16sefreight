<?php

namespace App\Services\Mail;

use App\MailboxConnection;
use App\User;
use Illuminate\Support\Facades\DB;

/**
 * Which desk a mailbox's enquiries belong to — the portal its owner signs in from (owner, 2026-09-28; GAPS #427).
 *
 *   signs in from FocusSea only   → sea    (ENQS, the sea pool)
 *   signs in from FocusAir only   → air    (ENQA, the air pool)
 *   both, or none recorded yet    → NULL   — mixed: a would-be enquiry is filed as Other, and a person files it
 *                                           from their portal, which then names the desk
 *
 * 🔴 Never guessed. An enquiry minted on the wrong desk is invisible to the people who would quote it: the pools,
 * the Kanban and the Enquiries board are all scoped by mode.
 */
class MailboxMode
{
    public static function recordSignIn(User $user, string $mode): void
    {
        $modes = $user->signed_in_modes ?? [];

        if (! in_array($mode, $modes, true)) {
            $modes[] = $mode;
            sort($modes);
            // A query, not save(): the login path must not touch anything else on the row.
            DB::table('users')->where('id', $user->id)->update(['signed_in_modes' => json_encode($modes)]);
        }
    }

    public function for(MailboxConnection $connection): ?string
    {
        $modes = json_decode((string) DB::table('users')->where('id', $connection->user_id)->value('signed_in_modes'), true) ?: [];

        return count($modes) === 1 ? $modes[0] : null;
    }
}
