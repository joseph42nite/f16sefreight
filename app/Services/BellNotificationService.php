<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * The bell — ui_ux_guide §5.6, schema doc #45.
 *
 * ═══ 🔴 WITHDRAWAL HARD-DELETES, IT DOES NOT MARK RESOLVED ══════════════════
 * When a handover is withdrawn the matching unread notification is REMOVED, so it
 * fades from the pricing owner's bell and the list reflows. It must not leave a
 * "cancelled" tombstone.
 *
 * This is the one place in the product that hard-deletes anything, and it is right
 * here for the opposite reason to everywhere else: a bell is a list of things that
 * still need doing. A resolved-but-visible row is a decision the owner has to make
 * again every time they look — and after a few of those, they stop reading the bell,
 * which is worse than any single missed alert. The audit trail of what happened lives
 * in `audit_logs`, which is append-only and is where history belongs.
 *
 * ⚠️ **Only the UNREAD one is deleted.** If the owner already read it — and possibly
 * already acted — removing it would erase the record of something they saw. A read
 * notification is history, and history is not the bell's to rewrite.
 */
class BellNotificationService
{
    /** Pins to the top of the bell. Anything routine is 0. */
    public const PRIORITY_APPROVAL = 100;

    public const REASSIGNMENT = 'App\\Notifications\\ReassignmentRequested';

    /**
     * @param  array<string, mixed>  $data
     */
    public function notify(int $agentId, int $recipientId, string $type, array $data, int $priority = 0): string
    {
        $id = (string) Str::uuid();

        DB::table('notifications')->insert([
            'id'              => $id,
            'agent_id'        => $agentId,
            'type'            => $type,
            'notifiable_type' => 'App\\User',   // a morph KEY, never a class rename away
            'notifiable_id'   => $recipientId,
            'data'            => json_encode($data),
            'priority'        => $priority,
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);

        return $id;
    }

    /**
     * One user's bell.
     *
     * 🔴 `priority DESC, created_at DESC` — approvals pin above everything, and within
     * a priority the newest is first. Sorting by date alone would bury an approval
     * request under routine alerts the moment three of them arrive.
     */
    public function forUser(int $userId, int $limit = 50): array
    {
        return DB::table('notifications')
            ->where('notifiable_type', 'App\\User')
            ->where('notifiable_id', $userId)
            ->orderByDesc('priority')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn ($n) => [
                'id'         => $n->id,
                'type'       => $n->type,
                'priority'   => (int) $n->priority,
                'pinned'     => (int) $n->priority >= self::PRIORITY_APPROVAL,
                'data'       => json_decode($n->data, true),
                'read_at'    => $n->read_at,
                'created_at' => $n->created_at,
            ])
            ->all();
    }

    public function unreadCount(int $userId): int
    {
        return DB::table('notifications')
            ->where('notifiable_type', 'App\\User')
            ->where('notifiable_id', $userId)
            ->whereNull('read_at')
            ->count();
    }

    public function markRead(int $userId, string $id): bool
    {
        return DB::table('notifications')
            ->where('id', $id)
            ->where('notifiable_id', $userId)   // yours, or nobody's
            ->whereNull('read_at')
            ->update(['read_at' => now(), 'updated_at' => now()]) === 1;
    }

    /**
     * Auto-dissolve — see the class docblock.
     *
     * @return int rows removed
     */
    public function dissolveReassignment(int $jobId): int
    {
        return DB::table('notifications')
            ->where('type', self::REASSIGNMENT)
            ->whereNull('read_at')
            ->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.job_id')) = ?", [(string) $jobId])
            ->delete();
    }
}
