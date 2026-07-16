<?php

namespace App\Jobs;

use App\PdfProcessingJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Events\OcrJobCompleted;
use App\LlmUsageLog;
use App\Company;

class ProcessMultiPdfOcrJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 180;  // Longer timeout for multi-file processing
    public int $backoff = 5;

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

        // Decode multi-file paths from JSON
        $tempFilePaths = json_decode($job->temp_file_path, true);
        if (!is_array($tempFilePaths) || empty($tempFilePaths)) {
            $job->update([
                'status'        => 'failed',
                'error_message' => 'No valid file paths found in multi-upload job.',
                'completed_at'  => now(),
            ]);
            return;
        }

        // Retrieve roles from metadata stored in extracted_data
        $meta = $job->extracted_data;
        $roles = $meta['_meta']['roles'] ?? [];

        if (empty($roles)) {
            $job->update([
                'status'        => 'failed',
                'error_message' => 'No extraction role assignments found.',
                'completed_at'  => now(),
            ]);
            return;
        }

        // 1. Validate all files exist and pass MIME checks
        $validatedPaths = [];
        foreach ($tempFilePaths as $idx => $tempFileName) {
            $tempPath = Storage::disk('pdf_temp')->path($tempFileName);

            if (!file_exists($tempPath)) {
                Log::warning("Multi-OCR: File index {$idx} not found: {$tempFileName}");
                continue;
            }

            // MIME-type sniffing
            try {
                $finfo = new \finfo(FILEINFO_MIME_TYPE);
                $sniffedMime = $finfo->file($tempPath);
                $allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];

                if (!in_array($sniffedMime, $allowedMimes)) {
                    Log::warning("Multi-OCR: File index {$idx} rejected: unsupported MIME type ({$sniffedMime})");
                    continue;
                }
            } catch (\Throwable $mimeError) {
                Log::error('Multi-OCR MIME sniffing failed: ' . $mimeError->getMessage());
            }

            $validatedPaths[$idx] = $tempPath;
        }

        if (empty($validatedPaths)) {
            $job->update([
                'status'        => 'failed',
                'error_message' => 'All uploaded files failed validation checks.',
                'completed_at'  => now(),
            ]);
            return;
        }

        try {
            // 2. Build multi-part request to FastAPI
            $ocrUrl = rtrim(config('services.ocr.url'), '/') . '/extract-multi-unstructured';

            $httpRequest = Http::timeout(160);

            // Attach each validated file
            foreach ($validatedPaths as $idx => $filePath) {
                $httpRequest = $httpRequest->attach(
                    'files',
                    file_get_contents($filePath),
                    basename($filePath)
                );
            }

            // Send with roles
            $response = $httpRequest->post($ocrUrl, [
                'roles' => json_encode($roles),
            ]);

            if ($response->failed()) {
                throw new \RuntimeException(
                    'FastAPI multi-OCR error: ' . $response->status() . ' — ' . $response->body()
                );
            }

            $data = $response->json();

            if (!is_array($data) || !isset($data['extracted_data'])) {
                throw new \RuntimeException('Multi-OCR response is invalid or missing extracted_data.');
            }

            $job->update([
                'status'         => 'completed',
                'extracted_data' => $data['extracted_data'],
                'completed_at'   => now(),
            ]);

            // 3. Log token usage
            $tokensIn = $data['tokens_in'] ?? 0;
            $tokensOut = $data['tokens_out'] ?? 0;
            $modelName = $data['model'] ?? 'gemini-1.5-flash';

            // Gemini 1.5 Flash pricing: $0.075/1M input, $0.30/1M output
            $costUsd = ($tokensIn * 0.000000075) + ($tokensOut * 0.00000030);

            LlmUsageLog::create([
                'job_id'     => null,
                'model'      => $modelName,
                'tokens_in'  => $tokensIn,
                'tokens_out' => $tokensOut,
                'cost_usd'   => $costUsd,
            ]);

            // 4. Cleanup temp files
            foreach ($tempFilePaths as $tempFileName) {
                Storage::disk('pdf_temp')->delete($tempFileName);
            }

            // 5. Broadcast real-time completion event
            try {
                broadcast(new OcrJobCompleted($job));
            } catch (\Throwable $e) {
                Log::warning('Failed to broadcast OcrJobCompleted event: ' . $e->getMessage());
            }

        } catch (\Throwable $e) {
            Log::error('Multi-OCR Job Failed', [
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
