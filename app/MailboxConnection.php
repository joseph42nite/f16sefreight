<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MailboxConnection extends Model
{
    protected $table = 'mailbox_connections';

    protected $fillable = [
        'user_id',
        'provider',
        'email_address',
        'access_token',
        'refresh_token',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'access_token' => 'encrypted',
        'refresh_token' => 'encrypted',
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function inboundEmails()
    {
        return $this->hasMany(InboundEmail::class, 'mailbox_connection_id');
    }
}
