<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VerifyOpenClawSignature
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
        $signature = $request->header('x-openclaw-signature');
        $timestamp = $request->header('x-openclaw-timestamp');
        $nonce = $request->header('x-openclaw-nonce');

        $secret = env('OPENCLAW_HMAC_SECRET');

        if (!$secret) {
            Log::error('[OPENCLAW] HMAC Secret is not configured in .env');
            return response()->json(['error' => 'HMAC Secret not configured'], 500);
        }

        if (!$signature) {
            return response()->json(['error' => 'Missing signature header'], 401);
        }

        // 1. Verify Signature
        $rawPayload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $rawPayload, $secret);

        if (!hash_equals($expectedSignature, $signature)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        // 2. Verify Timestamp
        if ($timestamp) {
            $eventTime = strtotime($timestamp);
            if ($eventTime === false || abs(time() - $eventTime) > 300) { // 5 minutes window
                return response()->json(['error' => 'Timestamp outside acceptable window'], 409);
            }
        }

        // 3. Verify Nonce
        if ($nonce) {
            $existing = DB::table('openclaw_nonces')->where('nonce', $nonce)->first();
            if ($existing) {
                return response()->json(['error' => 'Duplicate nonce — possible replay attack'], 409);
            }

            DB::table('openclaw_nonces')->insert([
                'nonce' => $nonce,
                'received_at' => now(),
            ]);

            // Clean up old nonces (older than 10 minutes)
            DB::table('openclaw_nonces')->where('received_at', '<', now()->subMinutes(10))->delete();
        }

        return $next($request);
    }
}
