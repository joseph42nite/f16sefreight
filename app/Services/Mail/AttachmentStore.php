<?php

namespace App\Services\Mail;

use App\EmailAttachment;
use App\EmailMessage;
use App\MailboxConnection;
use App\Services\VirusScanner;
use Illuminate\Support\Facades\Storage;
use Throwable;

/**
 * A mail attachment's bytes: from the cache, or fetched from the mailbox, scanned and kept.
 *
 * One place, because two things need it: opening a file in the inbox, and attaching a file
 * from the conversation to a reply or forward (PRD §5.2.3 — "no re-download" once cached).
 *
 * 🔴 SCANNED BEFORE IT IS STORED OR USED, and a scanner that cannot be reached refuses the
 * file rather than letting it through.
 */
class AttachmentStore
{
    private const KEEP_DAYS = 90;

    public function __construct(private VirusScanner $scanner)
    {
    }

    /** @throws AttachmentException */
    public function bytes(EmailAttachment $attachment): string
    {
        // ⚠️ Through the message, which is tenant-scoped: another branch's file is not found.
        $message = EmailMessage::find($attachment->email_message_id);

        if ($message === null) {
            throw new AttachmentException('Not found.', 'not_found', 404);
        }

        if ($attachment->fetch_state === 'blocked') {
            throw new AttachmentException('This file was blocked by the virus scan and cannot be used.', 'blocked', 422);
        }

        $disk = Storage::disk('local');

        if ($attachment->fetch_state === 'cached' && $attachment->file_path && $disk->exists($attachment->file_path)) {
            return $disk->get($attachment->file_path);
        }

        $connection = MailboxConnection::find($message->mailbox_connection_id);

        if ($connection === null || ! $connection->is_active || blank($attachment->provider_attachment_id)
            || blank($message->provider_message_id)) {
            $attachment->forceFill(['fetch_state' => 'unavailable'])->save();

            throw new AttachmentException(
                'The mailbox this file arrived on is no longer connected, so it cannot be fetched.', 'unavailable', 422
            );
        }

        try {
            $bytes = app(MailProviderRegistry::class)->for($connection->provider)
                ->attachmentContent($connection, $message->provider_message_id, $attachment->provider_attachment_id);
        } catch (Throwable $e) {
            report($e);

            throw new AttachmentException('The mailbox would not return this file. Try again.', 'fetch_failed', 502);
        }

        $this->scan($bytes, $attachment);

        $path = 'mail-attachments/' . $attachment->id;
        $disk->put($path, $bytes);

        $attachment->forceFill([
            'file_path' => $path,
            'fetch_state' => 'cached',
            'cache_expires_at' => now()->addDays(self::KEEP_DAYS),
            'size_bytes' => strlen($bytes),
        ])->save();

        return $bytes;
    }

    /**
     * Scan bytes; refuse them if infected or if there is no verdict.
     *
     * @param  ?EmailAttachment  $attachment  marked `blocked` when infected
     * @throws AttachmentException
     */
    public function scan(string $bytes, ?EmailAttachment $attachment = null, string $name = 'This file'): void
    {
        try {
            $verdict = $this->scanner->scan($bytes);
        } catch (Throwable $e) {
            report($e);

            throw new AttachmentException(
                'The virus scanner is not available, so the file was not used.', 'scanner_unavailable', 503
            );
        }

        if (! $verdict['clean']) {
            $attachment?->forceFill(['fetch_state' => 'blocked', 'file_path' => null])->save();

            throw new AttachmentException(
                ($attachment ? 'This file' : $name) . ' was blocked by the virus scan (' . $verdict['signature'] . ').', 'blocked', 422
            );
        }
    }
}
