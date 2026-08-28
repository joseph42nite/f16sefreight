<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * Every message, inbound and outbound.
 *
 * ⚠️ Regex classification runs on INBOUND ONLY. Outbound is stored and stamps
 * first_response_at, but is never classified — classifying our own replies mints a
 * second enquiry from the same conversation and inflates the conversion denominator.
 *
 * `idempotency_key` is the double-send guard, enforced by a UNIQUE index. Sending a
 * client the same message twice is unrecoverable.
 */
class EmailMessage extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'agent_id', 'mailbox_connection_id', 'thread_key', 'provider_thread_id',
        'direction', 'sent_via_portal', 'idempotency_key', 'send_state',
        'scheduled_send_at', 'send_attempts', 'send_error', 'message_id',
        'from', 'to', 'subject', 'body_snippet', 'body_storage_path',
        'body_purge_after', 'received_at', 'is_historical',
    ];

    protected $casts = [
        'sent_via_portal'   => 'boolean',
        'is_historical'     => 'boolean',
        'scheduled_send_at' => 'datetime',
        'body_purge_after'  => 'datetime',
        'received_at'       => 'datetime',
    ];

    public function thread()
    {
        return $this->belongsTo(EmailThread::class, 'thread_key', 'thread_key');
    }

    public function mailbox()
    {
        return $this->belongsTo(MailboxConnection::class, 'mailbox_connection_id');
    }

    public function attachments()
    {
        return $this->hasMany(EmailAttachment::class, 'email_message_id');
    }

    /** Only inbound mail is classified. */
    public function scopeClassifiable($query)
    {
        return $query->where('direction', 'inbound')->where('is_historical', false);
    }

    /** Still inside the undo window — cancelling here means nothing ever leaves. */
    public function scopeCancellable($query)
    {
        return $query->where('send_state', 'queued')->where('scheduled_send_at', '>', now());
    }
}
