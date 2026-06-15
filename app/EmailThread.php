<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EmailThread extends Model
{
    protected $table = 'email_threads';

    protected $fillable = [
        'agent_id',
        'mailbox_connection_id',
        'provider',
        'provider_thread_id',
        'thread_key',
        'subject',
        'latest_message_received_at',
        'participant_emails',
        'status',
        'assigned_operator_id',
        'job_id',
        'first_reply_at',
        'first_triage_at',
    ];

    protected $casts = [
        'participant_emails' => 'array',
        'latest_message_received_at' => 'datetime',
        'first_reply_at' => 'datetime',
        'first_triage_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function assignedOperator()
    {
        return $this->belongsTo(User::class, 'assigned_operator_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function mailboxConnection()
    {
        return $this->belongsTo(MailboxConnection::class, 'mailbox_connection_id');
    }

    public function emails()
    {
        return $this->hasMany(InboundEmail::class, 'thread_key', 'thread_key');
    }
}
