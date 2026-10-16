<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Throwable
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);

        // For the platform Overview's error graph (owner, 2026-10-16): each unhandled error the app reports — never a
        // 404, a validation failure or a refused sign-in, which Laravel does not report. Only the class, the first 500
        // characters of the message and the path; never the request body. A failure here must not hide the original.
        if ($this->shouldReport($exception)) {
            try {
                \Illuminate\Support\Facades\DB::table('server_errors')->insert([
                    'exception' => \Illuminate\Support\Str::limit(get_class($exception), 188, ''),
                    'message' => \Illuminate\Support\Str::limit($exception->getMessage(), 497),
                    // A web request has a route; a queue job or a command does not.
                    'path' => request()->route() !== null ? \Illuminate\Support\Str::limit(request()->path(), 252) : 'console',
                    'created_at' => now(),
                ]);
            } catch (Throwable $ignored) {
                // The database may be the thing that failed.
            }
        }
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        return parent::render($request, $exception);
    }
}
