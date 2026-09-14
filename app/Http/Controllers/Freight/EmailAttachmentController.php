<?php

namespace App\Http\Controllers\Freight;

use App\EmailAttachment;
use App\Http\Controllers\Controller;
use App\Services\Mail\AttachmentException;
use App\Services\Mail\AttachmentStore;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Opening a mail attachment (guide §4.2).
 *
 * 🔴 LAZY: sync records only the file's name; the bytes are fetched from the mailbox the first
 * time someone opens or extracts it, scanned, and kept for 90 days (AttachmentStore). Pulling
 * every PDF at sync would be the largest storage and scanning cost in the product, for files
 * most never opened.
 */
class EmailAttachmentController extends Controller
{
    /** Types a browser may show in place. Anything else is handed over as a download. */
    private const INLINE = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif'];

    public function show(EmailAttachment $attachment, AttachmentStore $store): Response|JsonResponse
    {
        $this->authorize('viewInbox');

        try {
            $bytes = $store->bytes($attachment);
        } catch (AttachmentException $e) {
            return response()->json(['error' => $e->getMessage(), 'reason' => $e->reason], $e->status);
        }

        $inline = in_array(strtolower($attachment->mime_type), self::INLINE, true);
        $name = str_replace(['"', "\r", "\n"], '', $attachment->filename);

        return response($bytes, 200, [
            // ⚠️ An HTML or SVG attachment served in place would run as this site's own page.
            'Content-Type' => $inline ? $attachment->mime_type : 'application/octet-stream',
            'Content-Disposition' => ($inline ? 'inline' : 'attachment') . '; filename="' . $name . '"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
