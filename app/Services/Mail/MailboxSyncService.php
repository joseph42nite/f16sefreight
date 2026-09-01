<?php

namespace App\Services\Mail;

use App\MailboxConnection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Keeps one mailbox's tokens valid and pulls its changes — guide §4.2.
 *
 * 🔴 **Both paths converge here.** A change-notification webhook carries a notification,
 * not the message, so push and the 15-minute reconciliation sweep both end up calling
 * `sync()` and reading the delta cursor. One idempotent code path means a lost webhook is
 * not a lost message — the sweep simply picks it up.
 */
class MailboxSyncService
{
    /** Refresh this long before expiry, so a slow page does not 401 mid-sync. */
    private const REFRESH_SKEW_SECONDS = 120;

    public function __construct(
        private MailProviderRegistry $providers,
        private MessageIngestor $ingestor,
    ) {
    }

    /**
     * @return array{ok: bool, ingested: int, echoes: int, threads_created: int, pages: int, error: ?string}
     */
    public function sync(MailboxConnection $connection): array
    {
        $result = ['ok' => true, 'ingested' => 0, 'echoes' => 0,
                   'threads_created' => 0, 'pages' => 0, 'error' => null];

        try {
            $provider = $this->providers->for($connection->provider);
            $this->ensureFreshToken($connection, $provider);

            $cursor = $connection->sync_cursor;
            $deltaCursor = null;

            // Bounded. A mailbox with a very long backlog must not hold the sweep open
            // forever and starve every other connection — it resumes on the next run,
            // which is the whole reason the cursor is persisted per page.
            for ($page = 0; $page < 20; $page++) {
                $batch = $provider->delta($connection, $cursor);
                $stats = $this->ingestor->ingest($connection, $batch['messages']);

                $result['ingested'] += $stats['ingested'];
                $result['echoes'] += $stats['echoes'];
                $result['threads_created'] += $stats['threads_created'];
                $result['pages']++;

                // 🔴 Persist AFTER every committed page, never only at the end. A run that
                // dies on page 9 of 12 must resume at 9; restarting from the top re-reads
                // everything and, on a big mailbox, never finishes at all.
                if (filled($batch['next_cursor'])) {
                    $cursor = $batch['next_cursor'];
                    $this->persistCursor($connection, $cursor, final: false);

                    continue;
                }

                $deltaCursor = $batch['delta_cursor'];

                break;
            }

            // ⚠️ Only a deltaLink is a resumable "everything up to now" marker. Storing a
            // nextLink as the standing cursor would replay the same page on every run.
            if (filled($deltaCursor)) {
                $this->persistCursor($connection, $deltaCursor, final: true);
            }
        } catch (Throwable $e) {
            $result['ok'] = false;
            $result['error'] = $e->getMessage();

            // One mailbox failing must not stop the sweep — a single expired consent would
            // otherwise stall every other tenant's mail.
            Log::warning('Mailbox sync failed', [
                'mailbox_connection_id' => $connection->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $result;
    }

    /**
     * Refresh the access token if it is expired or about to be.
     *
     * 🔴 **Never overwrite a refresh token with NULL.** A refresh response does not always
     * carry a new refresh token; blanking the stored one is how a mailbox silently stops
     * syncing an hour after it was connected, with nothing in the logs but a 401 later.
     */
    public function ensureFreshToken(MailboxConnection $connection, MailProviderContract $provider): void
    {
        $expiresAt = $connection->expires_at;

        if ($expiresAt !== null && $expiresAt->subSeconds(self::REFRESH_SKEW_SECONDS)->isFuture()) {
            return;
        }

        if (blank($connection->refresh_token)) {
            // Nothing to refresh with: the mailbox needs re-authorising by its owner. Mark
            // it rather than retrying forever against a credential that cannot work.
            $connection->forceFill(['auth_state' => 'reauth_required'])->save();

            throw new \RuntimeException('No refresh token; mailbox must be reconnected.');
        }

        $tokens = $provider->refresh($connection->refresh_token);

        $connection->forceFill([
            'access_token'  => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token'] ?: $connection->refresh_token,
            'expires_at'    => now()->addSeconds($tokens['expires_in']),
            'auth_state'    => 'connected',
        ])->save();
    }

    private function persistCursor(MailboxConnection $connection, string $cursor, bool $final): void
    {
        $attributes = $final
            ? ['sync_cursor' => $cursor, 'backfill_page_cursor' => null, 'last_synced_at' => now()]
            : ['backfill_page_cursor' => $cursor];

        $connection->forceFill($attributes)->save();
    }
}
