<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * One conversation, spanning BOTH lifecycles.
 *
 * enquiry_id is stamped at triage, job_id added on conversion, and the thread keeps
 * both. Both stay NULL for airline, clearance and trucking mail — that correspondence
 * never becomes a work item, and forcing it into one inflates the enquiry count.
 */
class EmailThread extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'agent_id', 'assigned_ops_id', 'enquiry_id', 'job_id',
        'thread_key', 'provider_thread_id', 'read_state_synced_at',
        'status', 'classification', 'latest_message_received_at',
        'first_response_at', 'first_triage_at', 'pending_client_notification', 'client_updates',
    ];

    protected $casts = [
        'pending_client_notification' => 'array',
        'client_updates'              => 'array',
        'latest_message_received_at'  => 'datetime',
        'first_response_at'           => 'datetime',
        'first_triage_at'             => 'datetime',
        'read_state_synced_at'        => 'datetime',
    ];

    public function enquiry()
    {
        return $this->belongsTo(Enquiry::class, 'enquiry_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function assignedOps()
    {
        return $this->belongsTo(User::class, 'assigned_ops_id');
    }

    /**
     * The conversations this user may open.
     *
     * Sales and the Boss see only mail they are on — sent by them, or to, cc or bcc them (user, 2026-09-15/16).
     * Pricing and operations work the branch inbox, so everything is theirs.
     */
    public function scopeVisibleTo($query, User $user)
    {
        if (! in_array($user->designation, ['sales', 'boss'], true)) {
            return $query;
        }

        $address = '%' . $user->email . '%';

        return $query->whereIn('thread_key', EmailMessage::query()->select('thread_key')
            ->where(fn ($q) => $q->where('from', 'like', $address)->orWhere('to', 'like', $address)
                ->orWhere('cc', 'like', $address)->orWhere('bcc', 'like', $address)));
    }

    public function isVisibleTo(User $user): bool
    {
        return static::whereKey($this->id)->visibleTo($user)->exists();
    }

    public function messages()
    {
        return $this->hasMany(EmailMessage::class, 'thread_key', 'thread_key');
    }
}
