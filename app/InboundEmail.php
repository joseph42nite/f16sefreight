<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InboundEmail extends Model
{
    protected $table = 'inbound_emails';

    protected $fillable = [
        'agent_id',
        'mailbox_connection_id',
        'message_id',
        'thread_key',
        'from',
        'to',
        'subject',
        'body_text',
        'body_html',
        'received_at',
    ];

    protected $casts = [
        'received_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function mailboxConnection()
    {
        return $this->belongsTo(MailboxConnection::class, 'mailbox_connection_id');
    }

    public function thread()
    {
        return $this->belongsTo(EmailThread::class, 'thread_key', 'thread_key');
    }

    public function attachments()
    {
        return $this->hasMany(InboundAttachment::class, 'inbound_email_id');
    }

    public function setBodyHtmlAttribute($value)
    {
        if (!empty($value)) {
            $config = \HTMLPurifier_Config::createDefault();
            $config->set('Cache.DefinitionImpl', null);
            $purifier = new \HTMLPurifier($config);
            $value = $purifier->purify($value);
        }
        $this->attributes['body_html'] = $value;
    }
}
