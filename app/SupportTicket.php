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
        'agent_id', 'user_id', 'route', 'element_selector',
        'screenshot_path', 'console_logs', 'description', 'status',
    ];

    protected $casts = ['console_logs' => 'array'];

    protected $attributes = ['status' => 'open'];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function branch()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
