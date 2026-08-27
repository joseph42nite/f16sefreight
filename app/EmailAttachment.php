<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Cached attachment metadata, not permanent storage.
 *
 * file_path is the S3 key WHILE cached and NULL once evicted;
 * provider_attachment_id is the re-fetch key. fetch_state separates "we deleted our
 * copy" from "the provider no longer has it" — different UI, different recovery.
 */
class EmailAttachment extends Model
{
    protected $fillable = [
        'email_message_id', 'filename', 'file_path', 'provider_attachment_id',
        'cache_expires_at', 'fetch_state', 'mime_type',
    ];

    protected $casts = ['cache_expires_at' => 'datetime'];

    public function message()
    {
        return $this->belongsTo(EmailMessage::class, 'email_message_id');
    }
}
