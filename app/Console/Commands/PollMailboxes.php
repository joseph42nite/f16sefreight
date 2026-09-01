<?php

namespace App\Console\Commands;

use App\MailboxConnection;
use App\Services\Mail\MailboxSyncService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * The 15-minute reconciliation sweep — guide §4.2.
 *
 * 🔴 **PUSH IS PRIMARY; THIS IS THE SAFETY NET.** Graph change-notification subscriptions
 * drive sync in ~1s. This exists to catch what push missed, which is why it runs every 15
 * minutes and not every minute: at 1,000 mailboxes, minute-polling is ~1.44M calls a day of
 * which almost all return nothing.
 *
 * 🔴 **FOUR SKIP CONDITIONS, EVERY RUN — and two of them look alike and are not:**
 *   is_active = false      a SUPERADMIN tier downgrade. Tokens are KEPT, so an upgrade
 *                          restores sync with no re-authorisation.
 *   disconnected_at        THE USER removed their own mailbox. Tokens are CLEARED.
 * Treating them as one means a later billing change silently reconnects a mailbox its
 * owner deliberately removed — an action performed by nobody (PRD §3.3).
 *
 * The other two: `auth_state <> 'connected'` (a half-finished or expired consent has
 * nothing to sync), and a `core` tier company (the inbox is not part of that plan).
 */
class PollMailboxes extends Command
{
    protected $signature = 'mailboxes:poll {--connection= : sync one connection id only}';

    protected $description = 'Reconciliation sweep over connected mailboxes (push is primary)';

    public function handle(MailboxSyncService $sync): int
    {
        $connections = $this->due();

        if ($connections->isEmpty()) {
            $this->info('No mailboxes are due for reconciliation.');

            return self::SUCCESS;
        }

        $totals = ['ingested' => 0, 'echoes' => 0, 'threads_created' => 0, 'failed' => 0];

        foreach ($connections as $connection) {
            $result = $sync->sync($connection);

            if (! $result['ok']) {
                $totals['failed']++;
                $this->warn("  #{$connection->id} {$connection->email_address}: {$result['error']}");

                continue;
            }

            $totals['ingested'] += $result['ingested'];
            $totals['echoes'] += $result['echoes'];
            $totals['threads_created'] += $result['threads_created'];

            $this->line("  #{$connection->id} {$connection->email_address}: "
                . "{$result['ingested']} new, {$result['echoes']} echo(es), "
                . "{$result['threads_created']} thread(s)");
        }

        $this->info(sprintf(
            '%d mailbox(es): %d message(s) ingested, %d echo(es) suppressed, %d thread(s) created, %d failed.',
            $connections->count(), $totals['ingested'], $totals['echoes'],
            $totals['threads_created'], $totals['failed']
        ));

        return self::SUCCESS;
    }

    /** @return \Illuminate\Support\Collection<int,MailboxConnection> */
    private function due()
    {
        $query = MailboxConnection::withoutGlobalScopes()
            ->where('is_active', true)
            ->whereNull('disconnected_at')
            ->where('auth_state', 'connected')
            // The tier gate. Joined rather than filtered in PHP so a large estate does not
            // load every connection just to discard most of them.
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('agents_info')
                    ->join('companies', 'companies.id', '=', 'agents_info.company_id')
                    ->whereColumn('agents_info.id', 'mailbox_connections.agent_id')
                    ->where('companies.tier', '!=', 'core');
            });

        if ($this->option('connection')) {
            $query->whereKey((int) $this->option('connection'));
        }

        return $query->get();
    }
}
