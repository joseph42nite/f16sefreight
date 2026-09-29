<?php

namespace App\Console\Commands;

use App\BankAccount;
use App\Services\Bank\BankFeedService;
use Illuminate\Console\Command;

/**
 * `php artisan bank:sync-feeds` — every connected account's statement, brought in (PRD §6.4, GAPS #442).
 *
 * Hourly: collects a statement Setu has ready, and asks for a new one once a day per account. An Account Aggregator
 * does not push transactions, so this sweep is the feed; Setu's notice (BankFeedController::notify) only makes it early.
 */
class SyncBankFeeds extends Command
{
    protected $signature = 'bank:sync-feeds';

    protected $description = 'Read connected bank accounts\' statements through Setu (read-only)';

    public function handle(BankFeedService $feed): int
    {
        $accounts = BankAccount::withoutGlobalScopes()->where('provider', 'setu')->where('is_active', true)
            ->whereIn('feed_status', ['pending', 'active', 'paused'])->get();

        foreach ($accounts as $account) {
            $result = $feed->sync($account);
            $this->line(sprintf('%s: %s%s', $account->account_code, $result['status'],
                isset($result['imported']) ? " — {$result['imported']} new, {$result['repeated']} again" : ''));
        }

        return self::SUCCESS;
    }
}
