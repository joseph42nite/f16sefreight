<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SubdomainScopeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();

        if (str_starts_with($host, 'focusair.')) {
            session(['active_portal_scope' => 'air']);
        } elseif (str_starts_with($host, 'focussea.')) {
            session(['active_portal_scope' => 'sea']);
        }

        return $next($request);
    }
}
