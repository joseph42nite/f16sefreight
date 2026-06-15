<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Company;

class CheckCompanyTier
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$allowedTiers
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$allowedTiers)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        // Retrieve company by name matching the user's company_name string
        $company = Company::where('name', $user->company_name)->first();
        if (!$company) {
            return response()->json(['error' => 'Company configuration not found.'], 403);
        }

        // Enforce block on Tier 1 (viper_core) for unstructured upload types
        $type = $request->input('type');
        if (in_array($type, ['commercial_invoice', 'packing_list']) && $company->tier === 'viper_core') {
            return response()->json(['error' => 'Upgrade Required to access unstructured AI features.'], 403);
        }

        // General route-level tier gating
        if (!empty($allowedTiers) && !in_array($company->tier, $allowedTiers)) {
            return response()->json(['error' => 'Upgrade Required.'], 403);
        }

        return $next($request);
    }
}
