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
use App\SystemTemplate;

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

        // 1. Strict server-side MIME-type sniffing
        try {
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $sniffedMime = $finfo->file($tempPath);
            
            // Allow only standard PDFs and image types
            $allowedMimes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp'
            ];
            
            if (!in_array($sniffedMime, $allowedMimes)) {
                // Reject immediately
                Storage::disk('pdf_temp')->delete($job->temp_file_path);
                $job->update([
                    'status'        => 'failed',
                    'error_message' => 'Security check failed: Unsupported file type (' . $sniffedMime . ').',
                    'completed_at'  => now(),
                ]);
                return;
            }
        } catch (\Throwable $mimeError) {
            Log::error('MIME sniffing failed: ' . $mimeError->getMessage());
        }

        try {
            // Retrieve company tier based on uploading user's company_name relation
            $user = $job->user;
            $company = Company::where('name', $user->company_name)->first();
            $tier = $company ? $company->tier : 'viper_core';
            $documentType = $job->document_type ?: 'ksr';

            // Check if document type is unstructured
            $isUnstructured = in_array($documentType, ['commercial_invoice', 'packing_list']);

            if ($tier === 'viper_core' || !$isUnstructured) {
                // Core tier or coordinate-based templates: Use template coordinate parser
                $ocrUrl = rtrim(config('services.ocr.url'), '/') . '/extract';
                $params = [
                    'document_type' => $documentType,
                ];

                // Pull coordinates from database templates directly
                $template = SystemTemplate::where('key', $documentType)->first();
                if ($template && !empty($template->coordinates)) {
                    $params['coordinates'] = json_encode($template->coordinates);
                }

                $response = Http::timeout(80)
                    ->attach('file', file_get_contents($tempPath), basename($tempPath))
                    ->post($ocrUrl, $params);

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

            } else {
                // Tactical / Command tier with unstructured type: Use Gemini unstructured extraction
                $ocrUrl = rtrim(config('services.ocr.url'), '/') . '/extract-unstructured';
                
                $response = Http::timeout(80)
                    ->attach('file', file_get_contents($tempPath), basename($tempPath))
                    ->post($ocrUrl, [
                        'document_type' => $documentType,
                    ]);

                if ($response->failed()) {
                    throw new \RuntimeException(
                        'FastAPI unstructured OCR error: ' . $response->status() . ' — ' . $response->body()
                    );
                }

                $data = $response->json();

                if (!is_array($data) || !isset($data['extracted_data'])) {
                    throw new \RuntimeException('OCR unstructured response is invalid or missing extracted_data.');
                }

                $job->update([
                    'status'         => 'completed',
                    'extracted_data' => $data['extracted_data'],
                    'completed_at'   => now(),
                ]);

                // Write actual token usage logs
                $tokensIn = $data['tokens_in'] ?? 0;
                $tokensOut = $data['tokens_out'] ?? 0;
                $modelName = $data['model'] ?? 'gemini-1.5-flash';
                
                // Calculate cost: $0.075 / 1M input, $0.30 / 1M output
                $costUsd = ($tokensIn * 0.000000075) + ($tokensOut * 0.00000030);

                LlmUsageLog::create([
                    'job_id' => null, // OCR task runs before operations job creation
                    'model' => $modelName,
                    'tokens_in' => $tokensIn,
                    'tokens_out' => $tokensOut,
                    'cost_usd' => $costUsd,
                ]);
            }

            // Temp PDF no longer needed
            Storage::disk('pdf_temp')->delete($job->temp_file_path);

            // Broadcast real-time WebSocket alert upon completion
            try {
                broadcast(new OcrJobCompleted($job));
            } catch (\Throwable $e) {
                Log::warning('Failed to broadcast OcrJobCompleted event: ' . $e->getMessage());
            }

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
