<?php

namespace App\Http\Middleware;

use App\Support\UserContext;
use Closure;
use Illuminate\Http\Request;

/**
 * Route-level tier gate — guide §3.5.
 *
 *     Route::group(['middleware' => 'tier:tactical,command'], ...);  // mailbox sync, AI extraction
 *     Route::group(['middleware' => 'tier:command'], ...);           // ledger, reconciliation
 *
 * Accepts a LIST of permitted tiers rather than a minimum, matching the guide's examples
 * exactly. Listing tiers explicitly keeps a route's entitlement readable at the call site
 * instead of implied by ordering.
 *
 * A user whose tier cannot be resolved is DENIED. The chain is total by design (every
 * user has a branch, therefore a company, therefore a tier), so an unresolvable tier
 * means something is broken — and a broken chain must fail closed.
 */
class CheckCompanyTier
{
    public function handle(Request $request, Closure $next, string ...$tiers)
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $context = UserContext::for($user);

        if ($context->tier === null || ! in_array($context->tier, $tiers, true)) {
            return response()->json([
                'error'          => 'Your plan does not include this feature.',
                'reason'         => 'tier',
                'current_tier'   => $context->tier,
                'required_tiers' => array_values($tiers),
            ], 403);
        }

        return $next($request);
    }
}
