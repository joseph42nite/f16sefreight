<?php

namespace App\Http\Controllers\Freight;

use App\DocumentShareLink;
use App\Http\Controllers\Controller;
use App\JobDocument;
use App\Services\AuditLogger;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Tokenised, expiring links so a document can be SENT AS A LINK rather than an attachment.
 *
 * 🔐 **The raw token exists only in the URL that was handed out.** `DocumentShareLink`
 * stores its SHA-256, so a database dump yields no working links, and there is no way to
 * read a token back — reissuing is the only recovery. Never add a column holding the raw
 * token "for support".
 *
 * 🔴 **The public routes are UNAUTHENTICATED BY DESIGN, so the token is the whole
 * boundary.** Everything else follows from that: 48 random characters (not an id), expiry
 * enforced on every hit, revocation checked separately from expiry, and no tenant, job or
 * client detail in any response beyond the file itself. A client is not a system user.
 *
 * ⚠️ `approver_email` is EVIDENCE of who approved, captured for audit and later matched
 * against `customer_contacts`. **Never build an access decision on it** — anyone holding
 * the link can type any address.
 */
class DocumentShareController extends Controller
{
    public function __construct(private AuditLogger $audit)
    {
    }

    /**
     * Mint a link for one document.
     *
     * ⚠️ The full URL comes back ONCE. The caller must show or send it immediately; asking
     * again mints a second link rather than revealing the first.
     */
    public function create(Request $request, JobDocument $document): JsonResponse
    {
        $data = $request->validate([
            'valid_days'        => ['nullable', 'integer', 'min:1', 'max:90'],
            'requires_approval' => ['nullable', 'boolean'],
        ]);

        $context = UserContext::for(auth()->user());

        // 🔒 The document must belong to the acting branch. Without this, a document id is
        // enough to mint a public link to another tenant's paperwork.
        if ((int) $document->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        [$link, $raw] = DocumentShareLink::issue([
            'agent_id'          => $document->agent_id,
            'job_document_id'   => $document->id,
            'job_id'            => $document->job_id,
            'created_by'        => auth()->id(),
            'requires_approval' => (bool) ($data['requires_approval'] ?? false),
            'view_count'        => 0,
        ], $data['valid_days'] ?? 14);

        $this->audit->record($document->agent_id, 'document.link_issued',
            'job_document', $document->id, auth()->id());

        return response()->json([
            // ⚠️ `/api/d/...` — these routes live in routes/api.php and carry its prefix.
            // A link built without it 404s for the client while looking perfectly valid to
            // the operator who sent it.
            'url'        => url('/api/d/' . $raw),
            'expires_at' => $link->expires_at,
            // ⚠️ Stated, because the operator is about to paste this somewhere permanent.
            'notice'     => 'This link is shown once. Anyone holding it can download the document until it expires.',
        ], 201);
    }

    /**
     * The client's download. Public, token-gated.
     *
     * ⚠️ Every refusal returns the SAME 404. Distinguishing "expired" from "revoked" from
     * "never existed" tells a probing stranger which tokens were once real.
     */
    public function download(string $token)
    {
        $link = DocumentShareLink::findByRawToken($token);

        if ($link === null || $link->revoked_at !== null || $link->expires_at->isPast()) {
            abort(404);
        }

        $document = $link->document;

        if ($document === null || ! Storage::exists($document->file_path)) {
            abort(404);
        }

        // Viewing is evidence: it answers "did the client ever open it?" when a dispute
        // starts. Counted before the file is streamed, so a cancelled download still counts
        // as having been reached.
        DB::table('document_share_links')->where('id', $link->id)->update([
            'first_viewed_at' => $link->first_viewed_at ?? now(),
            'last_viewed_at'  => now(),
            'view_count'      => DB::raw('view_count + 1'),
            'updated_at'      => now(),
        ]);

        return Storage::download($document->file_path, $document->file_name);
    }

    /**
     * The client approves or rejects a draft they were sent.
     *
     * 🔴 Only on links minted with `requires_approval`. A plain share link is for reading;
     * turning every download into an approvable document would let a forwarded link record
     * an approval nobody asked for.
     */
    public function respond(Request $request, string $token): JsonResponse
    {
        $data = $request->validate([
            'decision' => ['required', 'string', 'in:approved,rejected'],
            'name'     => ['required', 'string', 'max:100'],
            'email'    => ['required', 'email', 'max:255'],
            'comment'  => ['nullable', 'string', 'max:2000'],
        ]);

        $link = DocumentShareLink::findByRawToken($token);

        if ($link === null || $link->revoked_at !== null || $link->expires_at->isPast()
            || ! $link->requires_approval) {
            abort(404);
        }

        // ⚠️ Answered once. A second response would overwrite the first, and the first is
        // what the operator acted on.
        if ($link->approval_status !== null) {
            return response()->json([
                'error'  => 'This document has already been answered.',
                'reason' => 'already_answered',
                'status' => $link->approval_status,
            ], 422);
        }

        $link->forceFill([
            'approval_status' => $data['decision'],
            'approver_name'   => $data['name'],
            'approver_email'  => $data['email'],
            'client_comment'  => $data['comment'] ?? null,
            'responded_at'    => now(),
        ])->save();

        // System-attributed: the client is not a user, so there is no acting user id.
        $this->audit->recordSystem($link->agent_id, 'document.client_' . $data['decision'],
            'job_document', (int) $link->job_document_id);

        return response()->json(['status' => true, 'decision' => $data['decision']]);
    }

    /** Revoke a link before it expires. */
    public function revoke(DocumentShareLink $link): JsonResponse
    {
        $context = UserContext::for(auth()->user());

        if ((int) $link->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        $link->forceFill(['revoked_at' => now()])->save();

        $this->audit->record($link->agent_id, 'document.link_revoked',
            'job_document', (int) $link->job_document_id, auth()->id());

        return response()->json(['status' => true]);
    }

    /** Live links for a document, so an operator can see what is outstanding. */
    public function index(JobDocument $document): JsonResponse
    {
        $context = UserContext::for(auth()->user());

        if ((int) $document->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        // 🔐 Never the token, nor its hash — a hash is still a credential to anyone who can
        // reverse a 48-character search space they already know the shape of.
        return response()->json([
            'links' => DocumentShareLink::where('job_document_id', $document->id)
                ->orderByDesc('id')
                ->get(['id', 'expires_at', 'revoked_at', 'requires_approval',
                       'approval_status', 'approver_name', 'responded_at',
                       'first_viewed_at', 'last_viewed_at', 'view_count']),
        ]);
    }
}
