<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * One connected Gmail/Outlook mailbox.
 *
 * 🔴 **NO SoftDeletes trait on this model, ever.** `email_address` is globally UNIQUE, so
 * a tombstone would block that mailbox for every tenant forever. PRD.md §9.3 lists six
 * soft-deleting tables and this was deliberately removed from that list.
 *
 * 🔴 **TWO DEACTIVATION AXES, and they are not interchangeable:**
 *   is_active = false    a SUPERADMIN tier downgrade. Tokens KEPT, so an upgrade
 *                        restores sync with no re-authorization.
 *   disconnected_at      THE USER removed their own mailbox. Tokens CLEARED.
 * Sharing one column means a later upgrade silently reconnects a mailbox its owner
 * deliberately removed — triggered by a billing change, performed by nobody.
 *
 * 🔐 access_token, refresh_token and sync_cursor are encrypted at rest. These are live
 * OAuth credentials; without the casts they sit in the database in plaintext.
 */
class MailboxConnection extends Model
{
    protected $fillable = [
        'agent_id', 'user_id', 'email_address', 'provider',
        'access_token', 'refresh_token', 'expires_at', 'is_active',
        'sync_cursor', 'last_synced_at', 'auth_state',
        'signature_html', 'signature_source',
        'disconnected_at', 'disconnected_by',
    ];

    protected $casts = [
        'access_token'          => 'encrypted',
        'refresh_token'         => 'encrypted',
        'sync_cursor'           => 'encrypted',
        'is_active'             => 'boolean',
        'expires_at'            => 'datetime',
        'last_synced_at'        => 'datetime',
        'watch_expires_at'      => 'datetime',
        'disconnected_at'       => 'datetime',
        'backfill_completed_at' => 'datetime',
        'backfill_from'         => 'datetime',
    ];

    protected $hidden = ['access_token', 'refresh_token', 'sync_cursor'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function branch()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function messages()
    {
        return $this->hasMany(EmailMessage::class, 'mailbox_connection_id');
    }

    /**
     * Syncing requires ALL THREE conditions. Any one alone is insufficient.
     */
    public function scopeSyncable($query)
    {
        return $query->where('is_active', true)
            ->whereNull('disconnected_at')
            ->where('auth_state', 'connected');
    }

    /**
     * Mailboxes a tier UPGRADE should reactivate.
     *
     * ⚠️ The `disconnected_at IS NULL` half is load-bearing. Restoring on `is_active`
     * alone reconnects mailboxes their owners deliberately removed and resumes syncing
     * their mail.
     */
    public function scopeRestorableOnUpgrade($query)
    {
        return $query->where('is_active', false)->whereNull('disconnected_at');
    }
}
