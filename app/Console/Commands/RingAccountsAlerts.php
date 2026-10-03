<?php

namespace App\Console\Commands;

use App\Services\Accounts\AccountsAlerts;
use Illuminate\Console\Command;

/** The accounts desk's bell — one card per event (GAPS #448). Safe to run as often as wanted. */
class RingAccountsAlerts extends Command
{
    protected $signature = 'accounts:alerts';

    protected $description = 'Ring the bell for supplier bills due tomorrow, money matched short and clients who slipped a grade';

    public function handle(AccountsAlerts $alerts): int
    {
        $this->info($alerts->ring() . ' alert card(s) rung.');

        return self::SUCCESS;
    }
}
