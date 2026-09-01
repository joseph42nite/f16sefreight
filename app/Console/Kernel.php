<?php

namespace App\Console;

use App\PdfProcessingJob;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Storage;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // ⚠️ NOTHING ELSE REFILLS AN OCR CREDIT BALANCE. Without this the balance only
        // ever decreases and every tenant eventually hard-stops (guide §4.7). The command
        // is idempotent — it skips any company already granted this calendar month — so a
        // retried deploy or a double-fired scheduler cannot double anyone's credits.
        $schedule->command('credits:grant-monthly')
            ->monthlyOn(1, '00:15')
            ->withoutOverlapping()
            ->onOneServer();

        // ⚠️ awaiting_vision_consent is EXCLUDED from the 30-minute stale sweep — an
        // operator may legitimately answer an hour later — so it gets its own 24h expiry,
        // which also deletes the temp PDF still waiting on disk (guide §4.7).
        $schedule->command('pdf:expire-vision-consent')
            ->hourly()
            ->withoutOverlapping()
            ->onOneServer();

        // Debounced via stale_nudged_at, cleared on any new client reply.
        $schedule->command('enquiries:nudge-stale')
            ->hourly()
            ->withoutOverlapping()
            ->onOneServer();

        // 🔴 FIFTEEN MINUTES, NOT ONE. Push (Graph change notifications) is the primary
        // mechanism; this is the reconciliation sweep that catches what push missed. At
        // 1,000 mailboxes minute-polling is ~1.44M calls/day of which almost all return
        // nothing, while push gives ~1s latency for near zero calls (guide §4.2).
        //
        // ⚠️ withoutOverlapping matters more here than elsewhere: a mailbox with a long
        // backlog can run past 15 minutes, and a second sweep entering behind it would
        // read the same cursor twice.
        $schedule->command('mailboxes:poll')
            ->everyFifteenMinutes()
            ->withoutOverlapping()
            ->onOneServer();
    }


    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
