<?php

namespace App\Jobs;

use App\PdfProcessingJob; // Corrected to point to project specific App root location
use App\Services\OcrCreditService;
use App\Services\OcrRoutingService;
use App\Services\VisionConsentService;
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

    /**
     * 🔒 Only ever TRUE when a human answered the consent prompt — see
     * OcrController::consent. There is no default, no config flag and no retry path that
     * can turn vision on by itself; a credit is spent because somebody said so.
     */
    public bool $allowVision;

    public function __construct(int $processingJobId, bool $allowVision = false)
    {
        $this->processingJobId = $processingJobId;
        $this->allowVision = $allowVision;
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
            $routing = app(OcrRoutingService::class);
            $documentType = $job->document_type ?: 'ksr';
            $tier = $routing->resolveTier($job->user_id);
            $route = $routing->route($tier, $documentType);

            // 🔴 FAIL BEFORE PROCESSING, not after. A Core tenant uploading an invoice has
            // no coordinate template, so extraction would hand back an empty form that
            // looks broken. Refusing up front turns a dead end into the upgrade moment —
            // and costs no call at all.
            if ($route['action'] === 'fail') {
                $this->discardTempFile($job);

                $job->update([
                    'status'         => 'failed',
                    'failure_code'   => $route['failure_code'],
                    'error_message'  => 'This document type is not available on your plan.',
                    'temp_file_path' => null,
                    'completed_at'   => now(),
                ]);

                return;
            }

            // Call FastAPI microservice — no subprocess, no cold start
            $ocrUrl = rtrim(config('services.ocr.url'), '/') . $route['endpoint'];

            $params = [
                'document_type' => $documentType,
            ];

            if ($route['action'] === 'extract') {
                // Pull coordinates from database directly
                $template = \App\SystemTemplate::where('key', $documentType)->first();
                if ($template && !empty($template->coordinates)) {
                    $params['coordinates'] = json_encode($template->coordinates);
                }
            } else {
                // 🔒 The FIRST unstructured call is always free. Vision is only ever
                // enabled by the consent endpoint handing this job `allowVision = true`.
                $params['allow_vision'] = $this->allowVision ? 'true' : 'false';
            }

            // Http timeout MUST be less than the job's $timeout property (90s) to ensure
            // the HTTP error path is hit cleanly before the worker process is force-killed.
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

            // 🔴 THE PARSER REPORTS THE PATH; Laravel never guesses it. Only the parser
            // knows whether the PDF had a usable text layer, and guessing here is what the
            // consent step exists to avoid.
            $extractionPath = $data['extraction_path'] ?? null;

            if ($routing->needsVisionConsent($tier, $extractionPath) && ! $this->allowVision) {
                // No text layer, and vision is not authorised. Park and ASK — nothing has
                // been spent and nothing will be until somebody answers.
                //
                // ⚠️ The temp PDF deliberately SURVIVES: it is the document the vision run
                // will read if consent is given. ExpireVisionConsent deletes it at 24h if
                // nobody answers, so it does not wait on disk forever.
                $job->update([
                    'status'          => 'awaiting_vision_consent',
                    'extraction_path' => OcrRoutingService::PATH_NONE,
                    'page_count'      => $data['page_count'] ?? null,
                    'failure_code'    => null,
                    'error_message'   => null,
                ]);

                return;
            }

            $job->update([
                'status'          => 'completed',
                'extracted_data'  => $data,
                'extraction_path' => $extractionPath,
                'page_count'      => $data['page_count'] ?? $job->page_count,
                'completed_at'    => now(),
            ]);

            // Temp PDF no longer needed
            $this->discardTempFile($job);

        } catch (\Throwable $e) {
            Log::error('OCR Job Failed', [
                'job_id' => $this->processingJobId,
                'error'  => $e->getMessage(),
            ]);

            // 🔴 A PAID CALL THAT FAILED MUST GIVE THE CREDIT BACK. The tenant authorised
            // one extraction, not one attempt — and this is the only failure path that
            // ever charged anything.
            $this->refundIfReserved($job);

            $job->update([
                'status'        => 'failed',
                'failure_code'  => $this->allowVision ? OcrRoutingService::FAILURE_AI_UNAVAILABLE : null,
                'error_message' => $e->getMessage(),
                'completed_at'  => now(),
            ]);
        }
    }

    /**
     * Return a reserved credit, if this run was the paid one.
     *
     * ⚠️ Safe to call twice. `reverses_transaction_id` is UNIQUE, so a retried job's second
     * refund violates the constraint instead of quietly crediting twice — the guarantee is
     * in the database precisely because retries are when an application-level check gets
     * skipped.
     */
    private function refundIfReserved(PdfProcessingJob $job): void
    {
        if (! $this->allowVision) {
            return;
        }

        $reservation = app(VisionConsentService::class)->reservationFor($job);

        if ($reservation !== null) {
            app(OcrCreditService::class)->refund($reservation);
        }
    }

    /** Best effort — a missing temp file is not a reason to fail a finished extraction. */
    private function discardTempFile(PdfProcessingJob $job): void
    {
        if (blank($job->temp_file_path)) {
            return;
        }

        rescue(fn () => Storage::disk('pdf_temp')->delete($job->temp_file_path), report: false);
    }

    public function failed(\Throwable $e): void
    {
        // The final give-up, after every retry. Refund here too: handle() refunds each
        // failed attempt, but a job that dies before reaching its own catch (worker killed,
        // timeout) never runs that path and would otherwise keep the credit.
        $job = PdfProcessingJob::find($this->processingJobId);

        if ($job !== null) {
            $this->refundIfReserved($job);
        }

        PdfProcessingJob::where('id', $this->processingJobId)->update([
            'status'        => 'failed',
            'failure_code'  => $this->allowVision ? OcrRoutingService::FAILURE_AI_UNAVAILABLE : null,
            'error_message' => 'Max retries exceeded: ' . $e->getMessage(),
            'completed_at'  => now(),
        ]);
    }
}
