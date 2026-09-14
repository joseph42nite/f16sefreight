<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * An in-app bug report — PRD.md §5.10.
 *
 * 🔴 **NO TenantScope, and that is deliberate.** Superadmin is F16s's own staff and is
 * the ONLY portal that is not tenant-bound: the support desk exists precisely to read
 * across every tenant. Applying the tenant scope here would make the desk show nothing,
 * because a superadmin belongs to no tenant. The tenant-side create path scopes itself
 * explicitly instead — see SupportTicketController::store.
 *
 * ⚠️ `console_logs` and `element_selector` are captured DETERMINISTICALLY by
 * VisualReporter.vue with no LLM in the path (PRD.md §5.10). A hallucinated selector or
 * route makes a bug report worse than useless — it sends a developer to the wrong screen
 * with confident-looking evidence.
 */
class SupportTicket extends Model
{
    /** open -> investigating -> resolved. No other transitions exist. */
    public const STATUSES = ['open', 'investigating', 'resolved'];

    protected $fillable = [
        'agent_id', 'user_id', 'channel', 'route', 'element_selector',
        'screenshot_path', 'console_logs', 'help_transcript', 'description', 'status',
        'last_message_at', 'user_read_message_id', 'agent_read_message_id',
    ];

    protected $casts = [
        'console_logs' => 'array', 'help_transcript' => 'array',
        'last_message_at' => 'datetime',
    ];

    /** `report` from the element-picking reporter; `chat` from "Talk to a support agent". */
    public const CHANNELS = ['report', 'chat'];

    protected $attributes = ['status' => 'open'];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function branch()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function messages()
    {
        return $this->hasMany(SupportTicketMessage::class)->orderBy('id');
    }

    /**
     * Add a line to the chat, and move the ticket's clock with it.
     *
     * ⚠️ The SENDER'S OWN read marker moves too: writing a message means having seen the chat up to it.
     */
    public function post(string $sender, string $body, ?int $userId = null, ?int $superAdminId = null): SupportTicketMessage
    {
        $message = $this->messages()->create([
            'sender' => $sender, 'body' => $body, 'user_id' => $userId, 'super_admin_id' => $superAdminId,
        ]);

        $this->forceFill(array_filter([
            'last_message_at' => $message->created_at,
            'user_read_message_id' => $sender === 'user' ? $message->id : null,
            'agent_read_message_id' => $sender === 'agent' ? $message->id : null,
        ]))->save();

        return $message;
    }
}
