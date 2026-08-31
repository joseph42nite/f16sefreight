<?php

/**
 * Issues ONE authenticated HTTP request through the full framework stack, in its own
 * process, and prints the resulting status code.
 *
 * This is the vehicle for genuine concurrency tests against controllers. It runs the
 * real kernel — middleware, portal binding, route model binding, policies, controller —
 * so what is being raced is the ACTUAL endpoint rather than a re-implementation of its
 * query in the test. A test that reproduced the controller's UPDATE by hand would keep
 * passing after the controller stopped doing it.
 *
 * ⚠️ No web server is involved. `Request::create()` plus `Kernel::handle()` exercises the
 * same pipeline an HTTP request takes.
 *
 * Usage:  php tests/Support/http_request.php <method> <url> <bearer-token> [json-body]
 * Prints: "<status> <body>" on stdout. Failures go to stderr with exit 1, so an empty
 * pipe is never mistaken for a refusal.
 */

require __DIR__ . '/../../vendor/autoload.php';

$app = require __DIR__ . '/../../bootstrap/app.php';

[$method, $url, $token] = [$argv[1] ?? 'GET', $argv[2] ?? '/', $argv[3] ?? ''];
$body = $argv[4] ?? null;

try {
    $request = Illuminate\Http\Request::create(
        $url, strtoupper($method), [], [], [],
        [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
            'HTTP_ACCEPT'        => 'application/json',
            'CONTENT_TYPE'       => 'application/json',
        ],
        $body
    );

    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle($request);

    echo $response->getStatusCode(), ' ', $response->getContent(), PHP_EOL;
} catch (Throwable $e) {
    fwrite(STDERR, get_class($e) . ': ' . $e->getMessage() . PHP_EOL);
    exit(1);
}
