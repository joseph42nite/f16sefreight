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
