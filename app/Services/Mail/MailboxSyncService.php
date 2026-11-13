<?php

namespace App\Services\Mail;

use App\MailboxConnection;
use Illuminate\Support\Facades\Cache;
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

    /** How far back a newly connected mailbox is imported (user, 2026-09-16). */
    public const IMPORT_MONTHS = 1;

    /** Failed import runs before it stops and says so. */
    private const IMPORT_ATTEMPTS = 5;

    /**
     * Read each folder's changes, page by page.
     *
     * The first sync of a mailbox IS its import: with no cursor yet, each folder's stream
     * starts a month back, and everything read until every folder has its deltaLink is
     * marked historical and counted for the progress bar.
     *
     * @return array{ok: bool, ingested: int, echoes: int, threads_created: int, pages: int, error: ?string}
     */
    public function sync(MailboxConnection $connection, int $pagesPerFolder = 20): array
    {
        $idle = ['ok' => false, 'ingested' => 0, 'echoes' => 0, 'threads_created' => 0, 'pages' => 0];

        // The provider said when to come back; asking sooner only lengthens the wait.
        if (($until = Cache::get(self::backoffKey($connection))) !== null) {
            return $idle + ['error' => 'The mail provider asked us to slow down. Trying again after '
                . \Illuminate\Support\Carbon::createFromTimestamp($until)->format('H:i') . '.', 'skipped' => 'throttled'];
        }

        // 🔴 ONE SYNC OF A MAILBOX AT A TIME. The sweep, "sync now" and the import screen all land here; two at once
        // read the same cursor and file every message twice over (2026-11-10 audit §4). The lock expires by itself,
        // so a killed run cannot hold a mailbox for longer than that.
        $lock = Cache::lock('mailbox-sync:' . $connection->id, self::LOCK_SECONDS);

        if (! $lock->get()) {
            return $idle + ['error' => 'This mailbox is already being synced.', 'skipped' => 'busy'];
        }

        try {
            return $this->run($connection, $pagesPerFolder);
        } finally {
            $lock->release();
        }
    }

    /** Longer than a full run of 20 pages a folder should ever take. */
    private const LOCK_SECONDS = 900;

    /** The longest we will stay away on the provider's say-so. */
    private const MAX_BACKOFF_SECONDS = 900;

    private static function backoffKey(MailboxConnection $connection): string
    {
        return 'mailbox-backoff:' . $connection->id;
    }

    private function run(MailboxConnection $connection, int $pagesPerFolder): array
    {
        $result = ['ok' => true, 'ingested' => 0, 'echoes' => 0,
                   'threads_created' => 0, 'pages' => 0, 'error' => null];
        $importing = $connection->backfill_status !== 'completed';

        try {
            $provider = $this->providers->for($connection->provider);
            $this->ensureFreshToken($connection, $provider);

            if ($importing && $connection->backfill_status !== 'running') {
                $this->startImport($connection, $provider);
            }

            // One cursor per folder, as JSON: the standing deltaLinks, and the page a run stopped on.
            $cursors = json_decode((string) $connection->sync_cursor, true) ?: [];
            $pages = json_decode((string) $connection->backfill_page_cursor, true) ?: [];
            $since = $connection->backfill_from ? \Illuminate\Support\Carbon::parse($connection->backfill_from) : null;

            foreach ($provider->folders() as $folder) {
                // Bounded. A mailbox with a long backlog must not hold the sweep open and
                // starve every other connection — it resumes on the next run.
                for ($page = 0; $page < $pagesPerFolder; $page++) {
                    try {
                        $batch = $provider->delta($connection, $folder, $pages[$folder] ?? $cursors[$folder] ?? null, $since);
                    } catch (MailCursorExpired $e) {
                        // The stored cursor is dead and would fail the same way on every run. Read the folder again
                        // from a day before the last complete sync; what is already filed is recognised and skipped.
                        unset($pages[$folder], $cursors[$folder]);
                        $batch = $provider->delta($connection, $folder, null, $this->restartFrom($connection, $since));
                    }
                    $stats = $this->ingestor->ingest($connection, $batch['messages'], historical: $importing);

                    $result['ingested'] += $stats['ingested'];
                    $result['echoes'] += $stats['echoes'];
                    $result['threads_created'] += $stats['threads_created'];
                    $result['pages']++;

                    if (filled($batch['next_cursor'])) {
                        $pages[$folder] = $batch['next_cursor'];
                    } else {
                        // ⚠️ Only a deltaLink is a resumable "everything up to now" marker. Storing a
                        // nextLink as the standing cursor would replay the same page on every run.
                        unset($pages[$folder]);
                        $cursors[$folder] = $batch['delta_cursor'] ?? $cursors[$folder] ?? null;
                    }

                    // 🔴 Persist AFTER every page, never only at the end: a run that dies on page 9
                    // resumes at 9.
                    $connection->forceFill([
                        'sync_cursor' => json_encode($cursors),
                        'backfill_page_cursor' => $pages === [] ? null : json_encode($pages),
                        'backfill_processed' => $connection->backfill_processed + ($importing ? count($batch['messages']) : 0),
                    ])->save();

                    if (! isset($pages[$folder])) {
                        break;
                    }
                }
            }

            $done = $pages === [] && count(array_filter($cursors)) === count($provider->folders());

            if ($done) {
                $connection->forceFill(['last_synced_at' => now()])->save();
            }

            if ($importing && $done) {
                $connection->forceFill(['backfill_status' => 'completed', 'backfill_completed_at' => now()])->save();
            }
        } catch (MailProviderThrottled $e) {
            // Not a failure of the mailbox or of its import: come back when asked to.
            $wait = min($e->retryAfterSeconds, self::MAX_BACKOFF_SECONDS);
            Cache::put(self::backoffKey($connection), now()->addSeconds($wait)->getTimestamp(), $wait);

            $result['ok'] = false;
            $result['error'] = $e->getMessage();
            $result['skipped'] = 'throttled';
        } catch (Throwable $e) {
            $result['ok'] = false;
            $result['error'] = $e->getMessage();

            if ($importing && $connection->backfill_status === 'running' && ! $e instanceof MailboxNeedsReconnect) {
                $attempts = (int) $connection->backfill_attempts + 1;
                $connection->forceFill(['backfill_attempts' => $attempts,
                    'backfill_status' => $attempts >= self::IMPORT_ATTEMPTS ? 'failed' : 'running'])->save();
            }

            // One mailbox failing must not stop the sweep — a single expired consent would
            // otherwise stall every other tenant's mail.
            Log::warning('Mailbox sync failed', [
                'mailbox_connection_id' => $connection->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $result;
    }

    /** Where a folder is read from again after its cursor expired. */
    private function restartFrom(MailboxConnection $connection, ?\Illuminate\Support\Carbon $since): \Illuminate\Support\Carbon
    {
        if ($connection->last_synced_at !== null) {
            return \Illuminate\Support\Carbon::parse($connection->last_synced_at)->subDay();
        }

        return $since ?? now()->subMonths(self::IMPORT_MONTHS)->startOfDay();
    }

    /**
     * Make the mailbox usable for one call outside a sync — a send, an attachment fetch. Null when it is; otherwise
     * what to tell the user. Sends used the stored access token as it was, so an hour after the last sync they
     * failed with the provider's "token expired" (2026-11-10 audit §4).
     */
    public function refusalToUse(MailboxConnection $connection): ?string
    {
        try {
            $this->ensureFreshToken($connection, $this->providers->for($connection->provider));

            return null;
        } catch (Throwable $e) {
            report($e);

            return $connection->auth_state === 'reauth_required'
                ? 'This mailbox has to be reconnected in Settings before it can be used.'
                : 'The mail provider could not be reached. Try again in a minute.';
        }
    }

    /** The first run of an import: the window, and roughly how much there is to read. */
    private function startImport(MailboxConnection $connection, MailProviderContract $provider): void
    {
        $from = now()->subMonths(self::IMPORT_MONTHS)->startOfDay();

        try {
            $estimate = collect($provider->folders())->sum(fn ($folder) => $provider->count($connection, $folder, $from));
        } catch (Throwable $e) {
            $estimate = null; // the bar shows a count without "of about N"
        }

        $connection->forceFill([
            'backfill_status' => 'running', 'backfill_from' => $from, 'backfill_estimate' => $estimate,
            'backfill_processed' => 0, 'backfill_attempts' => 0,
            'sync_cursor' => null, 'backfill_page_cursor' => null,
        ])->save();
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

        try {
            $tokens = $provider->refresh($connection->refresh_token);
        } catch (MailboxNeedsReconnect $e) {
            // 🔴 The same state as "no refresh token": the sweep reads only `connected` mailboxes, so this one stops
            // being retried and Settings asks its owner to reconnect.
            $connection->forceFill(['auth_state' => 'reauth_required'])->save();

            throw $e;
        }

        $connection->forceFill([
            'access_token'  => $tokens['access_token'],
            'refresh_token' => $tokens['refresh_token'] ?: $connection->refresh_token,
            'expires_at'    => now()->addSeconds($tokens['expires_in']),
            'auth_state'    => 'connected',
        ])->save();
    }
}
