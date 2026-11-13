<?php

namespace App\Concerns;

/**
 * Narrows a query to the portal the request came in on — air, sea or road — when there is one.
 *
 * Chain it EXPLICITLY in HTTP controllers; never make it global. Queue workers, WebSocket broadcasts and crons never
 * run BindPortalScope, so the binding is absent there and this passes through unfiltered — which is exactly right for a
 * daemon processing a sea job. (One rule for Enquiry and Job: 2026-11-10 audit §6.)
 */
trait ScopedToActivePortal
{
    public function scopeForActivePortal($query)
    {
        if (app()->bound('active_portal_scope')) {
            return $query->where('transport_mode', app('active_portal_scope'));
        }

        return $query;
    }
}
