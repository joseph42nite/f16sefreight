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
        // $schedule->command('inspire')->hourly();
        $schedule->call('App\Http\Controllers\CurrencyRateController@getCurrencyRate')->dailyAt('02:00');

        // Cleanup stale OCR jobs stuck in pending/processing for >30 minutes.
        // FastAPI jobs complete in seconds — anything older than 30 min is genuinely stuck.
        $schedule->call(function () {
            $stale = PdfProcessingJob::whereIn('status', ['pending', 'processing'])
                ->where('created_at', '<', now()->subMinutes(30))
                ->get();

            foreach ($stale as $job) {
                Storage::disk('pdf_temp')->delete($job->temp_file_path);
                $job->update([
                    'status'        => 'failed',
                    'error_message' => 'Timed out — cleaned up by scheduler.',
                    'completed_at'  => now(),
                ]);
            }
        })->everyFifteenMinutes()->name('cleanup-stale-ocr-jobs');
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
