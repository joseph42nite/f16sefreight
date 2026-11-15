<?php

namespace App\Jobs;

use App\MailboxConnection;
use App\Services\Mail\MailboxSyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * One mailbox's reconciliation sync, on a worker of its own.
 *
 * `mailboxes:poll` used to sync every mailbox one after another in the scheduler's process, so one mailbox with a
 * backlog held up all the others (2026-11-10 audit §5). With MAILBOX_SYNC_QUEUED on, the sweep queues one of these
 * per mailbox instead.
 *
 * 🔴 THE QUEUE IS `mailbox-sync` AND NOTHING ELSE MAY WORK IT WITH A SHORT TIMEOUT. A sync can run for minutes; the
 * main worker kills a job at 120 seconds and also reads documents, which a long sync would hold up. The
 * `mail-worker` service in docker-compose.yml is the one that works this queue.
 *
 * Not retried: the next sweep is two minutes away and picks up from the same cursor.
 */
class SyncMailbox implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public const QUEUE = 'mailbox-sync';

    /** The queue connection whose retry_after is longer than $timeout — see config/queue.php. */
    public const CONNECTION = 'redis-long';

    public int $tries = 1;

    /** MailboxSyncService holds its own lock for 900 seconds; this ends a little before it. */
    public int $timeout = 840;

    /** A mailbox still waiting from the last sweep is not queued a second time. */
    public int $uniqueFor = 900;

    public function __construct(public int $connectionId)
    {
    }

    public function uniqueId(): string
    {
        return (string) $this->connectionId;
    }

    public function handle(MailboxSyncService $sync): void
    {
        $connection = MailboxConnection::withoutGlobalScopes()->find($this->connectionId);

        // The sweep's own conditions, asked again: the mailbox may have been removed or switched off while it waited.
        if ($connection === null || ! $connection->is_active || $connection->disconnected_at !== null
            || $connection->auth_state !== 'connected') {
            return;
        }

        $result = $sync->sync($connection);

        if (! $result['ok'] && ! isset($result['skipped'])) {
            Log::warning('Mailbox sync failed', ['connection' => $connection->id, 'error' => $result['error']]);
        }
    }
}
