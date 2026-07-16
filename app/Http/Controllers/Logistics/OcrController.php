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

    /**
     * Multi-File Upload Endpoint
     * POST /api/user/upload-awb-files-multi
     * Accepts multiple PDFs with extraction role assignments for Tactical/Command AI extraction.
     */
    public function extractMulti(Request $request)
    {
        $request->validate([
            'upload_files'   => ['required', 'array', 'min:1', 'max:5'],
            'upload_files.*' => ['required', 'file', 'mimes:pdf', 'max:25600'],
            'roles'          => ['required', 'string'], // JSON array of role assignments
        ]);

        $files = $request->file('upload_files');
        $roles = $request->input('roles');

        // Validate the roles JSON
        $rolesDecoded = json_decode($roles, true);
        if (!is_array($rolesDecoded)) {
            return response()->json([
                'status' => false,
                'error'  => 'Invalid roles format. Must be a JSON array.'
            ], 422);
        }

        try {
            $tempFilePaths = [];
            $originalFilenames = [];

            foreach ($files as $file) {
                $tempFilename = Str::uuid() . '.pdf';
                Storage::disk('pdf_temp')->putFileAs('', $file, $tempFilename);
                $tempFilePaths[] = $tempFilename;
                $originalFilenames[] = $file->getClientOriginalName();
            }

            // Create a single processing job record with multi-file metadata
            $processingJob = PdfProcessingJob::create([
                'user_id'           => Auth::id(),
                'original_filename' => implode(', ', $originalFilenames),
                'temp_file_path'    => json_encode($tempFilePaths), // Store as JSON array
                'document_type'     => 'multi_unstructured',
                'status'            => 'pending',
                'extracted_data'    => ['_meta' => ['roles' => $rolesDecoded, 'file_count' => count($files)]],
            ]);

            // Dispatch the multi-file processing job
            \App\Jobs\ProcessMultiPdfOcrJob::dispatch($processingJob->id)
                ->onQueue('pdf_processing');

            return response()->json([
                'status'     => true,
                'job_id'     => $processingJob->id,
                'job_status' => 'pending',
                'msg'        => 'Successfully loaded ' . count($files) . ' document(s) for analysis.',
            ], 202);

        } catch (\Throwable $e) {
            Log::error('Multi-PDF Upload Dispatch Failure: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => false,
                'error'  => 'Server encountered an issue preparing files for analysis.'
            ], 500);
        }
    }
}