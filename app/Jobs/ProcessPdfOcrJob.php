<?php

namespace App\Jobs;

use App\PdfProcessingJob; // Corrected to point to project specific App root location
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProcessPdfOcrJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 90;   // Must be > Http::timeout below (80s) + safety buffer
    public int $backoff = 5;    // retry after 5 seconds

    public int $processingJobId;

    public function __construct(int $processingJobId)
    {
        $this->processingJobId = $processingJobId;
    }

    public function handle(): void
    {
        $job = PdfProcessingJob::findOrFail($this->processingJobId);

        $job->update([
            'status'     => 'processing',
            'started_at' => now(),
        ]);

        $tempPath = Storage::disk('pdf_temp')->path($job->temp_file_path);

        if (!file_exists($tempPath)) {
            $job->update([
                'status'        => 'failed',
                'error_message' => 'Temp PDF file not found on disk.',
                'completed_at'  => now(),
            ]);
            return;
        }

        try {
            // Call FastAPI microservice — no subprocess, no cold start
            $ocrUrl   = rtrim(config('services.ocr.url'), '/') . '/extract';
            
            // Http timeout MUST be less than the job's $timeout property (90s) to ensure
            // the HTTP error path is hit cleanly before the worker process is force-killed.
            $response = Http::timeout(80)
                ->attach('file', file_get_contents($tempPath), basename($tempPath))
                ->post($ocrUrl, [
                    'document_type' => $job->document_type ?: 'ksr'
                ]);

            if ($response->failed()) {
                throw new \RuntimeException(
                    'FastAPI OCR error: ' . $response->status() . ' — ' . $response->body()
                );
            }

            $data = $response->json();

            if (!is_array($data)) {
                throw new \RuntimeException('OCR response is not valid JSON.');
            }

            $job->update([
                'status'         => 'completed',
                'extracted_data' => $data,
                'completed_at'   => now(),
            ]);

            // Temp PDF no longer needed
            Storage::disk('pdf_temp')->delete($job->temp_file_path);

        } catch (\Throwable $e) {
            Log::error('OCR Job Failed', [
                'job_id' => $this->processingJobId,
                'error'  => $e->getMessage(),
            ]);

            $job->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at'  => now(),
            ]);
        }
    }

    public function failed(\Throwable $e): void
    {
        PdfProcessingJob::where('id', $this->processingJobId)->update([
            'status'        => 'failed',
            'error_message' => 'Max retries exceeded: ' . $e->getMessage(),
            'completed_at'  => now(),
        ]);
    }
}
