<?php

namespace App\Services\Bank;

use App\BankAccount;
use Illuminate\Support\Carbon;
use RuntimeException;

/**
 * A bank account's statement, read through Setu with the account holder's consent (PRD §6.4, GAPS #442).
 *
 * 🔴 **READ-ONLY.** It reads statement lines into `bank_transactions` through StatementImporter — the same road a CSV
 * takes — and nothing else. It never matches, settles or posts: deciding what a credit pays is still accounts' job on
 * the reconciliation screen, as it is for a CSV.
 *
 * 🔴 **The account is checked, not assumed.** A consent covers whatever accounts the holder picks in their AA app. Lines
 * are taken only from the shared account whose masked number ends in THIS account's last four digits; anything else
 * is refused with a reason, because a statement read into the wrong account reconciles money that arrived elsewhere.
 *
 * ⚠️ An Account Aggregator does not push new transactions: data comes when a session is asked for. So the sweep
 * (`bank:sync-feeds`) IS the feed — hourly it collects a session that is ready, and once a day it asks for a new one.
 */
class BankFeedService
{
    /** A consent in these states can read; the rest need the holder to act again. */
    public const READABLE = ['active'];

    /** How often a fresh statement is asked for. Collecting a ready one happens on every sweep. */
    private const ASK_EVERY_HOURS = 20;

    public function __construct(
        private readonly SetuAccountAggregator $setu,
        private readonly StatementImporter $importer,
    ) {}

    /** Ask the account holder to share this account. @return string the page where they approve it */
    public function connect(BankAccount $account, string $mobile): ?string
    {
        if (blank($account->last_four)) {
            throw new RuntimeException('Add the account number first — its last four digits are how the shared statement is checked to be this account.');
        }

        if ($account->provider === 'setu' && in_array($account->feed_status, ['pending', 'active'], true)) {
            throw new RuntimeException('This account is already connected, or waiting for approval.');
        }

        $consent = $this->setu->createConsent($mobile,
            now()->subDays((int) config('setu.history_days'))->toDateString(),
            now()->addMonths((int) config('setu.consent_months'))->toDateString());

        $account->forceFill([
            'provider' => 'setu', 'provider_ref' => $consent['id'], 'feed_status' => $consent['status'] ?: 'pending',
            'feed_consent_url' => $consent['url'], 'feed_expires_at' => null, 'feed_session_id' => null,
            'feed_fetched_through' => null, 'feed_synced_at' => null, 'feed_error' => null,
        ])->save();

        return $consent['url'];
    }

    /**
     * Bring the statement in as far as it can go right now: learn the consent's state, collect a ready session, and
     * ask for a new one when the last is old enough (or `$force`, the Fetch-now button).
     *
     * @return array{status: string, imported?: int, repeated?: int, waiting?: bool, error?: string}
     */
    public function sync(BankAccount $account, bool $force = false): array
    {
        if ($account->provider !== 'setu' || blank($account->provider_ref)) {
            return ['status' => 'not_connected'];
        }

        try {
            $consent = $this->setu->consent($account->provider_ref);
            $account->forceFill(['feed_status' => $consent['status'],
                'feed_expires_at' => $consent['expires_at'] ? Carbon::parse($consent['expires_at']) : $account->feed_expires_at])->save();

            if (! in_array($consent['status'], self::READABLE, true)) {
                return ['status' => $consent['status']];
            }

            if ($account->feed_session_id !== null) {
                return $this->collect($account);
            }

            if (! $force && $account->feed_synced_at !== null && $account->feed_synced_at->gt(now()->subHours(self::ASK_EVERY_HOURS))) {
                return ['status' => 'active'];
            }

            $from = $account->feed_fetched_through
                ? $account->feed_fetched_through->copy()->subDays((int) config('setu.overlap_days'))
                : now()->subDays((int) config('setu.history_days'));

            $account->forceFill(['feed_session_id' => $this->setu->createSession($account->provider_ref,
                $from->toDateString(), now()->toDateString())])->save();

            // Often ready at once; if not, the next sweep (or Setu's notice) collects it.
            return $this->collect($account);
        } catch (RuntimeException $e) {
            $account->forceFill(['feed_error' => mb_substr($e->getMessage(), 0, 255)])->save();

            return ['status' => 'error', 'error' => $e->getMessage()];
        }
    }

    /** Stop reading. The holder should also revoke the consent in their AA app — we cannot do it for them. */
    public function disconnect(BankAccount $account): void
    {
        $account->forceFill(['provider' => null, 'provider_ref' => null, 'feed_status' => null, 'feed_consent_url' => null,
            'feed_expires_at' => null, 'feed_session_id' => null, 'feed_error' => null])->save();
    }

    private function collect(BankAccount $account): array
    {
        $session = $this->setu->session($account->feed_session_id);

        if ($session['status'] === 'pending') {
            return ['status' => 'active', 'waiting' => true];
        }

        // Failed or expired: forget it, and the next sweep asks again.
        if (! in_array($session['status'], ['completed', 'partial'], true)) {
            $account->forceFill(['feed_session_id' => null, 'feed_error' => 'The bank did not send the statement (' . $session['status'] . '). It will be asked again.'])->save();

            return ['status' => 'error', 'error' => $account->feed_error];
        }

        $mine = collect($session['accounts'])->first(fn ($a) => substr(preg_replace('/\D/', '', (string) $a['masked']), -4) === $account->last_four);

        if ($mine === null) {
            $shared = collect($session['accounts'])->map(fn ($a) => '…' . substr(preg_replace('/\D/', '', (string) $a['masked']), -4))->implode(', ');
            $account->forceFill(['feed_session_id' => null,
                'feed_error' => "The bank shared {$shared}, not this account (…{$account->last_four}). Nothing was read. Reconnect and choose this account."])->save();

            return ['status' => 'error', 'error' => $account->feed_error];
        }

        $result = $this->importer->import($account->agent_id, array_map([SetuAccountAggregator::class, 'line'], $mine['transactions']), 'setu', $account->id);

        $account->forceFill(['feed_session_id' => null, 'feed_fetched_through' => now()->toDateString(), 'feed_synced_at' => now(),
            'feed_error' => $session['status'] === 'partial' ? 'The bank sent only part of the statement; the rest comes on the next read.' : null])->save();

        return ['status' => 'active'] + $result;
    }
}
