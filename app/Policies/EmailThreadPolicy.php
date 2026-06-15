<?php

namespace App\Policies;

use App\User;
use App\EmailThread;

class EmailThreadPolicy
{
    /**
     * Determine if the user can reply to the thread.
     *
     * @param  \App\User  $user
     * @param  \App\EmailThread  $thread
     * @return bool
     */
    public function reply(User $user, EmailThread $thread)
    {
        // Verify branch alignment
        if ($thread->agent_id !== $user->branch_name) {
            return false;
        }

        // Verify company alignment on the mailbox connection to prevent cross-tenant leakage
        if ($thread->mailboxConnection) {
            $connectionUser = $thread->mailboxConnection->user;
            if ($connectionUser && $connectionUser->company_name !== $user->company_name) {
                return false;
            }
        }

        return true;
    }
}
