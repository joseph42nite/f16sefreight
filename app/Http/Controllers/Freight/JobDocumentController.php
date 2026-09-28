<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Job;
use App\JobDocument;
use App\Services\AuditLogger;
use App\Services\Mail\AttachmentException;
use App\Services\Mail\AttachmentStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * E-Docket — a shipment's documents, labelled by type. PRD §5.8 tab 12 (GAPS #424).
 *
 * 🔴 Every upload is virus-scanned BEFORE it is written, by the same scanner mail attachments go through. A file
 * with no verdict (the scanner down) is refused, not kept "for now": these documents are later shared with
 * clients and agents.
 */
class JobDocumentController extends Controller
{
    /** database_relations_tree.md job_documents.document_type. */
    public const TYPES = [
        'commercial_invoice', 'packing_list', 'awb_copy', 'bl_copy', 'delivery_order',
        'arrival_notice', 'cover_letter', 'other',
    ];

    public function __construct(
        private readonly AttachmentStore $store,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Job $job): JsonResponse
    {
        $this->authorize('viewManifest');

        return response()->json([
            'documents' => JobDocument::where('job_id', $job->id)->latest()
                ->with('uploader:id,name')
                ->get(['id', 'job_id', 'document_type', 'file_name', 'mime_type', 'file_size', 'uploaded_by', 'created_at']),
            'types' => self::TYPES,
        ]);
    }

    public function store(Request $request, Job $job): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'document_type' => 'required|string|in:' . implode(',', self::TYPES),
            // clamd's stream limit is 25 MB — the same cap as a mail attachment.
            'file' => 'required|file|max:25600|mimes:pdf,jpg,jpeg,png,xlsx,xls,docx,doc,csv',
        ]);

        $file = $data['file'];
        $bytes = (string) file_get_contents($file->getRealPath());

        try {
            $this->store->scan($bytes, null, $file->getClientOriginalName());
        } catch (AttachmentException $e) {
            return response()->json(['error' => $e->getMessage(), 'reason' => $e->reason], $e->status);
        }

        $path = 'documents/jobs/' . $job->id . '/' . uniqid('', true) . '.' . strtolower($file->getClientOriginalExtension());
        Storage::put($path, $bytes);

        $document = JobDocument::create([
            'agent_id'      => $job->agent_id,
            'job_id'        => $job->id,
            'document_type' => $data['document_type'],
            'file_name'     => $file->getClientOriginalName(),
            'file_path'     => $path,
            'mime_type'     => $file->getMimeType(),
            'file_size'     => strlen($bytes),
            'uploaded_by'   => auth()->id(),
        ]);

        $this->audit->record($job->agent_id, 'job.document_uploaded', 'job', $job->id, auth()->id());

        return response()->json($document, 201);
    }

    public function download(Job $job, int $document): StreamedResponse|JsonResponse
    {
        $this->authorize('viewManifest');

        $row = JobDocument::where('job_id', $job->id)->find($document);

        if ($row === null || ! Storage::exists($row->file_path)) {
            return response()->json(['error' => 'That document is not on this shipment.', 'reason' => 'not_found'], 404);
        }

        return Storage::download($row->file_path, $row->file_name);
    }
}
