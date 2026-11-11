<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * 🔒 A token issued before the account was deactivated stops working at once (2026-11-10 audit), rather than
     * living out its TTL. Only an explicit false refuses: a model built in memory without the column is active.
     */
    protected function authenticate($request, array $guards)
    {
        parent::authenticate($request, $guards);

        $user = $this->auth->guard()->user();

        if ($user !== null && $user->is_active !== null && ! $user->is_active) {
            $this->unauthenticated($request, $guards);
        }
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            if ($request->is('api/*')) {
                return null;
            }
            return \Illuminate\Support\Facades\Route::has('login') ? route('login') : null;
        }
    }
}
