<?php

namespace App\Http\Middleware;

use App\Support\Portal;
use App\Support\UserContext;
use Closure;
use Illuminate\Http\Request;

/**
 * The multi-login gate: decides whether THIS user may enter THIS portal.
 *
 * Three checks, in a deliberate order (guide §3.4):
 *
 *   1. Does the host name a real portal?
 *   2. **TIER before ROLE.** On `core` there is exactly ONE login type and every
 *      role-specific portal is unreachable, whatever `designation` the row carries.
 *      Checking tier first is what stops a Core tenant reaching a role-scoped portal by
 *      setting a designation value directly in the database.
 *   3. Does the user's designation belong on this portal?
 *
 * ── Why 404 rather than 403 for an unknown portal ──────────────────────────
 * An unrecognised hostname should not confirm which hostnames exist.
 *
 * ── Why 403 with a reason for a known portal ───────────────────────────────
 * An accounts user landing on focusair has made a navigation mistake, not an attack;
 * telling them where to go is the useful answer. The response names the portal they are
 * on, never which OTHER portals exist for other roles.
 */
class EnforcePortalAccess
{
    public function handle(Request $request, Closure $next)
    {
        /** @var Portal $portal */
        $portal = app()->bound(BindPortalScope::PORTAL_KEY)
            ? app(BindPortalScope::PORTAL_KEY)
            : Portal::fromHost($request->getHost());

        if (! $portal->exists()) {
            return response()->json([
                'error' => 'Unknown portal.',
            ], 404);
        }

        $user = $request->user();

        if ($user === null) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // The platform portal is not a tenant context and carries no designation rules.
        if (! $portal->isTenantBound()) {
            return $next($request);
        }

        $context = UserContext::for($user);

        // 2. TIER FIRST — see the class docblock.
        if (! $context->tierAtLeast($portal->minTier())) {
            return response()->json([
                'error'         => "The {$portal->label()} portal requires the {$portal->minTier()} plan.",
                'reason'        => 'tier',
                'current_tier'  => $context->tier,
                'required_tier' => $portal->minTier(),
            ], 403);
        }

        // 3. THEN ROLE.
        if (! $portal->allowsDesignation($context->designation)) {
            return response()->json([
                'error'  => "Your account is not set up for the {$portal->label()} portal.",
                'reason' => 'designation',
            ], 403);
        }

        return $next($request);
    }
}
