<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** One line of a live chat on a support ticket: from the client's user, an F16s agent, or the system. */
class SupportTicketMessage extends Model
{
    public const SENDERS = ['user', 'agent', 'system'];

    protected $fillable = ['support_ticket_id', 'sender', 'user_id', 'super_admin_id', 'body'];
}
