<?php

namespace App\Http\Middleware;

// use Fideloper\Proxy\TrustProxies as Middleware;
use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     *
     * @var array|string|null
     */
    protected $proxies;

    /**
     * From TRUSTED_PROXIES: a comma list of the load balancer's addresses, or `*` when the app is only reachable
     * through it. Unset means no proxy is trusted — and behind one, every visitor then has the proxy's address and
     * shares one sign-in rate limit (2026-11-10 audit §4).
     */
    protected function proxies()
    {
        $set = trim((string) config('app.trusted_proxies'));

        if ($set === '') {
            return null;
        }

        return $set === '*' ? '*' : array_map('trim', explode(',', $set));
    }

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    // protected $headers = Request::HEADER_X_FORWARDED_ALL;
    protected $headers =
    Request::HEADER_X_FORWARDED_FOR |
    Request::HEADER_X_FORWARDED_HOST |
    Request::HEADER_X_FORWARDED_PORT |
    Request::HEADER_X_FORWARDED_PROTO;
}
