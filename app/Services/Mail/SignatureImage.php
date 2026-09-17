<?php

namespace App\Services\Mail;

use App\MailboxConnection;
use Illuminate\Support\Facades\Storage;

/**
 * The picture under a mailbox's signature (user, 2026-09-17).
 *
 * 🔴 Sent INSIDE the mail as an inline attachment, referenced as `cid:` — the way Outlook sends a signature logo. A
 * link to our server would show nothing until the app has a public address, and pictures written into the HTML
 * itself (data: URIs) are blocked by Gmail and Outlook.
 */
class SignatureImage
{
    public const CONTENT_ID = 'f16s-signature-image';

    /** Shown at most this wide, so a large logo does not fill the mail. */
    public const MAX_WIDTH = 240;

    /** @return ?array{name: string, mime_type: string, bytes: string, content_id: string, width: int} */
    public function for(MailboxConnection $connection): ?array
    {
        $disk = Storage::disk('local');

        if (blank($connection->signature_image_path) || ! $disk->exists($connection->signature_image_path)) {
            return null;
        }

        $bytes = $disk->get($connection->signature_image_path);
        $size = @getimagesizefromstring($bytes);

        return [
            'name' => 'signature.' . (explode('/', (string) $connection->signature_image_mime)[1] ?? 'png'),
            'mime_type' => (string) $connection->signature_image_mime,
            'bytes' => $bytes,
            'content_id' => self::CONTENT_ID,
            'width' => min(self::MAX_WIDTH, (int) ($size[0] ?? self::MAX_WIDTH)),
        ];
    }

    /** For showing on screen (Settings, the composer): the picture itself, as a data URI. Never sent. */
    public function preview(MailboxConnection $connection): ?string
    {
        $image = $this->for($connection);

        return $image ? 'data:' . $image['mime_type'] . ';base64,' . base64_encode($image['bytes']) : null;
    }
}
