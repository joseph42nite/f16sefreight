<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessPdfOcrJob;
use App\PdfProcessingJob; // Correct internal namespace match
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Services\ExtractionNormaliser;
use App\Services\VisionConsentService;

class OcrController extends Controller
{
    /**
     * Migrated Async Endpoint
     * POST /api/user/upload-awb-file
     * Accepts PDF, saves to temp, dispatches job, returns unique job record tracking ID.
     */
    public function extract(Request $request)
    {
        // Preserving backward-compatible input validation names for seamlessly zero-downtime API swap
        $request->validate([
            'upload_file' => ['required', 'file', 'mimes:pdf', 'max:25600'], // Expanded to 25MB max
            'type'        => ['required', 'string']
        ]);

        $file = $request->file('upload_file');
        
        // Generate cryptographically random uuid to prevent filename clashes
        $tempFilename = Str::uuid() . '.pdf';

        try {
            // 1. Safely persist inside designated internal temp disk bucket
            Storage::disk('pdf_temp')->putFileAs('', $file, $tempFilename);
 
            // 2. Create record entry to track our background microservice job 
            $processingJob = PdfProcessingJob::create([
                'user_id'           => Auth::id(),
                'original_filename' => $file->getClientOriginalName(),
                'temp_file_path'    => $tempFilename,
                'document_type'     => $request->input('type', 'ksr'),
                'status'            => 'pending',
            ]);

            // 3. Push directly onto the dedicated high-speed Redis pipe
            // Note: We only enqueue the ID so it flows instantly
            $laravelJob = ProcessPdfOcrJob::dispatch($processingJob->id)
                ->onQueue('pdf_processing');

            // 4. Optional debug line commented out to fix type-casting mismatch
            // $processingJob->update(['queue_job_id' => (string) $laravelJob]);

            return response()->json([
                'status'  => true,
                'job_id'  => $processingJob->id,
                'job_status' => 'pending',
                'msg'     => 'Successfully loaded and analyzing document.',
            ], 202);

        } catch (\Throwable $e) {
            Log::error('PDF Upload Disptach Failure: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => false, 
                'error'  => 'Server encountered an issue preparing file for translation.'
            ], 500);
        }
    }

    /**
     * NEW Status Polling Engine
     * GET /api/user/ocr-status/{jobId}
     * High speed query engine for live progress trackers
     */
    public function status(int $jobId)
    {
        // Strict security: Must match user ownership constraints to prevent data bleeding
        $job = PdfProcessingJob::where('id', $jobId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $response = [
            'status'            => true,
            'job_id'            => $job->id,
            'job_status'        => $job->status,
            'original_filename' => $job->original_filename,
            'created_at'        => $job->created_at,
        ];

        // Hydrate completion payloads automatically
        if ($job->status === 'completed') {
            // Re-mapping for original Vue frontend response compatibility expecting "data" wrapper
            $response['data']         = $job->extracted_data;
            $response['completed_at'] = $job->completed_at;

            // ── §4.1.2 rule 3, "unify upward" ────────────────────────────────
            // `fields` carries the SAME extraction in one shape — {value, confidence}
            // for every field, whichever extractor produced it. `data` is left exactly
            // as it was so the legacy FocusAir.vue mapping keeps working; the new
            // upload modal reads `fields` and needs no knowledge of which path ran.
            //
            // 🔴 One mapper, or they drift. The guide is explicit that two shapes mean
            // two mappers, and they diverge the first time either side changes.
            $normaliser = app(ExtractionNormaliser::class);
            $fields = $normaliser->normalise(
                is_array($job->extracted_data) ? $job->extracted_data : [],
                $job->document_type === 'unstructured' ? 'model' : 'coordinates'
            );

            $response['fields'] = $fields;
            // The operator's worklist: everything below `high`, dot-pathed.
            $response['needs_review'] = $normaliser->needsReview($fields);
        }

        // 🔴 The consent prompt has to carry its PRICE. "This document needs vision — 1
        // credit" is a decision; an unexplained yes/no is a dark pattern, and an operator
        // who cannot see what they are spending will either always accept or never will.
        if ($job->status === 'awaiting_vision_consent') {
            $response['page_count'] = $job->page_count;
            $response['credit_cost'] = \App\Services\OcrCreditService::VISION_COST;
        }

        if ($job->status === 'failed') {
            $response['error'] = $job->error_message;
            // A CODE the UI branches on — `upgrade_required` is an upsell, not an error,
            // and `credits_exhausted` is a top-up. Both read as "it broke" without this.
            $response['failure_code'] = $job->failure_code;
        }

        return response()->json($response);
    }

    /**
     * Answer a vision-consent prompt.
     * POST /api/user/ocr-consent/{jobId}  { "decision": "accept" | "decline" }
     *
     * 🔒 **The only way a credit is ever spent.** Everything upstream of this — upload,
     * the free text attempt, parking at `awaiting_vision_consent` — costs nothing. This
     * endpoint is the single point where a named human authorises money to be spent, and
     * it is deliberately explicit rather than a flag on the upload: a checkbox ticked once
     * and forgotten is not consent.
     *
     * ⚠️ Ownership is enforced the same way `status()` does it. A consent prompt names a
     * client's document, and answering someone else's is spending someone else's credits.
     */
    public function consent(Request $request, int $jobId, VisionConsentService $consent)
    {
        $data = $request->validate([
            'decision' => ['required', 'string', 'in:' . VisionConsentService::ACCEPT . ',' . VisionConsentService::DECLINE],
        ]);

        $extraction = PdfProcessingJob::where('id', $jobId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $user = Auth::user();

        $result = $data['decision'] === VisionConsentService::ACCEPT
            ? $consent->accept($extraction, $user)
            : $consent->decline($extraction, $user);

        if (! $result['ok']) {
            return response()->json([
                'status'     => false,
                'job_id'     => $extraction->id,
                'job_status' => $result['status'],
                'reason'     => $result['reason'],
                'error'      => $this->consentRefusalMessage($result['reason']),
            ], 422);
        }

        // 🔴 Dispatch AFTER the credit is reserved and committed, never inside the same
        // breath. A worker that picked the job up before the reservation landed would call
        // the paid endpoint against a balance nobody had checked.
        if ($result['status'] === 'processing') {
            ProcessPdfOcrJob::dispatch($extraction->id, true)->onQueue('pdf_processing');
        }

        return response()->json([
            'status'     => true,
            'job_id'     => $extraction->id,
            'job_status' => $result['status'],
            'msg'        => $result['status'] === 'processing'
                ? 'Vision extraction authorised. One credit reserved.'
                : 'Vision extraction declined. No credit was spent.',
        ], 202);
    }

    /** A sentence for the operator; `reason` stays the code the UI branches on. */
    private function consentRefusalMessage(?string $reason): string
    {
        switch ($reason) {
            case VisionConsentService::NOT_AWAITING:
                return 'This document is not waiting for a vision decision. It may have been answered already, or expired.';
            case VisionConsentService::CREDITS_EXHAUSTED:
                return 'Your OCR credit balance is exhausted. Nothing was spent and no extraction was run.';
            case VisionConsentService::NO_TENANT:
                return 'This account is not attached to a company, so no credit balance can be resolved.';
            default:
                return 'The vision decision could not be applied.';
        }
    }

    /**
     * Optional Utility
     * GET /api/user/ocr-history
     */
    public function history()
    {
        $jobs = PdfProcessingJob::forUser(Auth::id())
            ->select(['id', 'original_filename', 'status', 'document_type', 'created_at', 'completed_at'])
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return response()->json(['status' => true, 'data' => $jobs]);
    }
}