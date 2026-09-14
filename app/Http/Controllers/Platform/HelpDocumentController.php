<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Services\Help\HelpDocumentReader;
use App\Services\Help\HelpIndexer;
use App\Services\Help\HelpSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * The help library the copilot answers from — uploaded by F16s staff (user, 2026-09-14).
 *
 * One .md or .docx per portal page. Uploading again REPLACES that document's text and sections, so
 * the copilot answers from the new version immediately. Superadmin only: every tenant reads the same
 * library, and a wrong document misleads all of them.
 */
class HelpDocumentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'documents' => DB::table('help_documents')->orderBy('route')->orderBy('title')
                ->get(['id', 'title', 'route', 'filename', 'format', 'chunk_count', 'status', 'error', 'updated_at']),
            // What people asked that the library could not answer: the next document to write.
            'unanswered' => DB::table('help_questions')->where('found', false)
                ->where('created_at', '>=', now()->subDays(30))->orderByDesc('id')->limit(50)
                ->get(['id', 'route', 'question', 'best_score', 'created_at']),
        ]);
    }

    public function store(Request $request, HelpDocumentReader $reader, HelpIndexer $indexer): JsonResponse
    {
        $data = $this->validated($request);
        $id = DB::table('help_documents')->insertGetId($this->row($request, $reader, $data) + ['created_at' => now()]);

        $indexer->index($id);

        return response()->json(DB::table('help_documents')->find($id), 201);
    }

    /** Re-upload: the same document, new text. */
    public function update(Request $request, int $document, HelpDocumentReader $reader, HelpIndexer $indexer): JsonResponse
    {
        abort_unless(DB::table('help_documents')->where('id', $document)->exists(), 404);

        $data = $this->validated($request);
        DB::table('help_documents')->where('id', $document)->update($this->row($request, $reader, $data));

        $indexer->index($document);

        return response()->json(DB::table('help_documents')->find($document));
    }

    public function destroy(int $document): JsonResponse
    {
        DB::table('help_documents')->where('id', $document)->delete();
        Cache::forget(HelpSearch::CACHE_KEY);

        return response()->json(['deleted' => true]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:5120'],
            'title' => ['required', 'string', 'max:150'],
            // A portal path, like /inbox. Not a URL: the copilot links within the portal.
            'route' => ['nullable', 'string', 'max:150', 'regex:/^\/[A-Za-z0-9\-\/_]*$/'],
        ]);

        if (! in_array(strtolower($request->file('file')->getClientOriginalExtension()), HelpDocumentReader::FORMATS, true)) {
            abort(response()->json(['errors' => ['file' => ['Upload a .md or .docx file.']]], 422));
        }

        return $data;
    }

    private function row(Request $request, HelpDocumentReader $reader, array $data): array
    {
        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        try {
            $content = $reader->read($file->getRealPath(), $extension);
        } catch (RuntimeException $e) {
            abort(response()->json(['errors' => ['file' => [$e->getMessage()]]], 422));
        }

        if ($content === '') {
            abort(response()->json(['errors' => ['file' => ['This file has no text in it.']]], 422));
        }

        return [
            'title' => $data['title'],
            'route' => $data['route'] ?? null,
            'filename' => mb_substr($file->getClientOriginalName(), 0, 255),
            'format' => $extension === 'markdown' ? 'md' : $extension,
            'content' => $content,
            'content_hash' => hash('sha256', $content),
            'uploaded_by' => auth('superAdmin-api')->id(),
            'updated_at' => now(),
        ];
    }
}
