<?php

namespace App\Http\Middleware;

use App\Support\Portal;
use Closure;
use Illuminate\Http\Request;

/**
 * Resolves the portal from the request Host and binds it into the container.
 *
 * 🔴 **Derived from the Host, never from a session** (guide §3.3). This application is
 * stateless JWT, so a session-backed scope would always be empty — and an empty scope
 * returns UNFILTERED rows rather than raising an error. Air users would silently see sea
 * data, which is the precise failure scopeForActivePortal exists to prevent.
 *
 * ⚠️ **This middleware binds the PORTAL only. It does not bind the tenant.**
 * Five of the six portals are tenant-bound; only `superadmin` is not. Tenant binding
 * comes from `user -> branch -> company` (UserContext), never from the hostname. Do not
 * infer "no portal scope" from `accounts.` or `admin.` and conclude "no tenant scope" —
 * that is how a client's Boss ends up reading another tenant's books.
 *
 * ── Nothing is bound when the host names no portal ──────────────────────────
 * Plain `localhost`, the bare apex, an IP — and every CLI, queue and broadcast context,
 * which never runs HTTP middleware at all. `scopeForActivePortal()` then passes through
 * unfiltered, which is exactly right for a daemon: a worker processing a sea job must not
 * be filtered to air because of whatever host last made a web request.
 */
class BindPortalScope
{
    public const CONTAINER_KEY = 'active_portal_scope';
    public const PORTAL_KEY    = 'active_portal';

    public function handle(Request $request, Closure $next)
    {
        $portal = Portal::fromHost($request->getHost());

        // Always bind the portal object — controllers and the login response need to
        // know WHICH portal, including the cross-mode ones that bind no scope.
        app()->instance(self::PORTAL_KEY, $portal);

        // Bind the mode only when there is one. Absence is meaningful: it is what
        // makes the query scope a no-op rather than a filter on NULL.
        if ($portal->scope() !== null) {
            app()->instance(self::CONTAINER_KEY, $portal->scope());
        }

        return $next($request);
    }
}
