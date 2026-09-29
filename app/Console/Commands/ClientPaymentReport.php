<?php

namespace App\Console\Commands;

use App\Services\Accounts\ClientPaymentReports;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

/**
 * `php artisan clients:payment-report [--month=2026-09]` — every client's payment report card for a month (GAPS #443).
 * Scheduled on the 1st for the month just ended; re-running a month rewrites its cards from the same evidence.
 */
class ClientPaymentReport extends Command
{
    protected $signature = 'clients:payment-report {--month= : YYYY-MM; the month just ended when left out}';

    protected $description = 'Grade how every client paid, for one month';

    public function handle(ClientPaymentReports $reports): int
    {
        $month = $this->option('month') ? Carbon::createFromFormat('Y-m', $this->option('month'))->startOfMonth()
            : now()->subMonthNoOverflow()->startOfMonth();

        $this->info(sprintf('%d card(s) for %s.', $reports->run($month), $month->format('F Y')));

        return self::SUCCESS;
    }
}
