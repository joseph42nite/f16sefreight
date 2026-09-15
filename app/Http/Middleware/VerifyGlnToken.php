<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * The GLN / IATA status feed is a public URL: anyone could post a fake "departed" or "rejected" for any AWB.
 * With `GLN_WEBHOOK_TOKEN` set, a post must carry it (`?token=` or the `X-GLN-Token` header).
 *
 * ⚠️ Not set = allowed and logged, so the live feed keeps working until the token is added to its URL.
 */
class VerifyGlnToken
{
    public function handle(Request $request, Closure $next)
    {
        $expected = (string) config('services.gln.token');

        if ($expected === '') {
            Log::warning('[GLN] GLN_WEBHOOK_TOKEN is not set; /api/gln-response accepts posts from anyone.');

            return $next($request);
        }

        $given = (string) ($request->header('X-GLN-Token') ?? $request->query('token', ''));

        return hash_equals($expected, $given) ? $next($request) : response()->json(['error' => 'Forbidden'], 403);
    }
}
