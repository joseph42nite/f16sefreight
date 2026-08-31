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

        if ($job->status === 'failed') {
            $response['error'] = $job->error_message;
        }

        return response()->json($response);
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