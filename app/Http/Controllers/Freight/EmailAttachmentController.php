<?php

namespace App\Http\Controllers\Freight;

use App\EmailAttachment;
use App\EmailMessage;
use App\Http\Controllers\Controller;
use App\MailboxConnection;
use App\Services\Mail\MailProviderRegistry;
use App\Services\VirusScanner;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Opening a mail attachment (guide §4.2).
 *
 * 🔴 LAZY: sync records only the file's name; the bytes are fetched from the mailbox the first
 * time someone opens or extracts it, scanned, and kept for 90 days. Pulling every PDF at sync
 * would be the largest storage and scanning cost in the product, for files most never opened.
 *
 * 🔴 SCANNED BEFORE IT IS STORED OR SERVED, and a scanner that cannot be reached refuses the
 * file rather than letting it through.
 */
class EmailAttachmentController extends Controller
{
    private const KEEP_DAYS = 90;

    /** Types a browser may show in place. Anything else is handed over as a download. */
    private const INLINE = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif'];

    public function show(EmailAttachment $attachment, VirusScanner $scanner): Response|JsonResponse
    {
        $this->authorize('viewInbox');

        // ⚠️ Through the message, which is tenant-scoped: an attachment id from another branch
        // is simply not found.
        $message = EmailMessage::find($attachment->email_message_id);

        if ($message === null) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        if ($attachment->fetch_state === 'blocked') {
            return response()->json([
                'error' => 'This file was blocked by the virus scan and cannot be opened.', 'reason' => 'blocked',
            ], 422);
        }

        $disk = Storage::disk('local');

        if ($attachment->fetch_state === 'cached' && $attachment->file_path && $disk->exists($attachment->file_path)) {
            return $this->serve($attachment, $disk->get($attachment->file_path));
        }

        $connection = MailboxConnection::find($message->mailbox_connection_id);

        if ($connection === null || ! $connection->is_active || blank($attachment->provider_attachment_id)
            || blank($message->provider_message_id)) {
            $attachment->forceFill(['fetch_state' => 'unavailable'])->save();

            return response()->json([
                'error' => 'The mailbox this file arrived on is no longer connected, so it cannot be fetched.',
                'reason' => 'unavailable',
            ], 422);
        }

        try {
            $bytes = app(MailProviderRegistry::class)->for($connection->provider)
                ->attachmentContent($connection, $message->provider_message_id, $attachment->provider_attachment_id);
        } catch (Throwable $e) {
            report($e);

            return response()->json(['error' => 'The mailbox would not return this file. Try again.', 'reason' => 'fetch_failed'], 502);
        }

        try {
            $verdict = $scanner->scan($bytes);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'error' => 'The virus scanner is not available, so the file was not opened.', 'reason' => 'scanner_unavailable',
            ], 503);
        }

        if (! $verdict['clean']) {
            $attachment->forceFill(['fetch_state' => 'blocked', 'file_path' => null])->save();

            return response()->json([
                'error' => 'This file was blocked by the virus scan (' . $verdict['signature'] . ').', 'reason' => 'blocked',
            ], 422);
        }

        $path = 'mail-attachments/' . $attachment->id;
        $disk->put($path, $bytes);

        $attachment->forceFill([
            'file_path' => $path,
            'fetch_state' => 'cached',
            'cache_expires_at' => now()->addDays(self::KEEP_DAYS),
            'size_bytes' => strlen($bytes),
        ])->save();

        return $this->serve($attachment, $bytes);
    }

    private function serve(EmailAttachment $attachment, string $bytes): Response
    {
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
