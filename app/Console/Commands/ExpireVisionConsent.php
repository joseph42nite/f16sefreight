<?php

namespace App\Console\Commands;

use App\PdfProcessingJob;
use App\Services\OcrRoutingService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

/**
 * Cancels vision-consent prompts nobody answered, and cleans up their temp PDFs.
 *
 * ⚠️ **`awaiting_vision_consent` needs its OWN expiry, and the 30-minute stale sweep must
 * EXCLUDE it.** An operator may legitimately answer an hour later — sweeping it at 30
 * minutes would cancel a live prompt while the person is still deciding. But the temp PDF
 * waits on disk meanwhile, so it cannot wait forever either. 24 hours is the compromise
 * (guide §4.7).
 *
 * Nothing was ever reserved for these jobs, so there is no credit to refund.
 */
class ExpireVisionConsent extends Command
{
    protected $signature = 'pdf:expire-vision-consent {--hours=24}';

    protected $description = 'Cancel unanswered vision-consent prompts older than 24h and delete their temp PDFs';

    public function handle(): int
    {
        $cutoff = now()->subHours((int) $this->option('hours'));

        $expired = PdfProcessingJob::withoutGlobalScopes()
            ->awaitingVisionConsent()
            ->where('updated_at', '<=', $cutoff)
            ->get();

        foreach ($expired as $extraction) {
            if (filled($extraction->temp_file_path)) {
                // Best effort — a missing temp file is not a reason to leave the job
                // parked forever.
                rescue(fn () => Storage::delete($extraction->temp_file_path), report: false);
            }

            $extraction->forceFill([
                'status'        => 'cancelled',
                'failure_code'  => null, // not a failure: nobody answered, nothing was spent
                'error_message' => 'Vision consent prompt expired unanswered after '
                    . $this->option('hours') . 'h. No credit was spent.',
                'temp_file_path' => null,
                'completed_at'  => now(),
            ])->save();

            $this->line("  cancelled extraction #{$extraction->id}");
        }

        $this->info("{$expired->count()} unanswered vision prompt(s) expired.");

        return self::SUCCESS;
    }
}
