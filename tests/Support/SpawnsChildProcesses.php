<?php

namespace Tests\Support;

/**
 * Spawns real OS processes for concurrency tests.
 *
 * 🔴 **Genuine parallelism is the whole point.** A sequential loop passes against an
 * implementation with no locking at all — that is exactly how a guaranteed deadlock in
 * `EnquirySequenceService` survived every test in the suite (GAPS.md). Anything asserting
 * a concurrency property has to contend for real.
 *
 * ⚠️ **Children do not inherit the test environment, and both ways it differs bite.**
 * `artisan` and a bare bootstrap read `.env` — the DEVELOPMENT database, where the
 * fixtures do not exist — and `phpunit.xml` deliberately overrides `JWT_SECRET` with a
 * value `.env` does not have, so a token minted by the parent is rejected by a child as
 * `401`. Both are forwarded explicitly below. Neither failure announces itself: the first
 * looks like a missing row, the second like a broken policy.
 */
trait SpawnsChildProcesses
{
    /** The environment a child needs to be the same application as the parent. */
    protected function childEnv(): string
    {
        $db = config('database.connections.' . config('database.default'));

        return implode(' ', [
            'APP_ENV=testing',
            'DB_CONNECTION=' . config('database.default'),
            'DB_HOST=' . $db['host'],
            'DB_PORT=' . $db['port'],
            'DB_DATABASE=' . $db['database'],
            'DB_USERNAME=' . $db['username'],
            'DB_PASSWORD=' . escapeshellarg($db['password']),
            'JWT_SECRET=' . escapeshellarg(config('jwt.secret')),
            // Cache and session must not reach for Redis in a short-lived child.
            'CACHE_DRIVER=array',
            'SESSION_DRIVER=array',
        ]);
    }

    /**
     * Launch every command at once, wait for all of them, and return their stdout.
     *
     * Returns `[$outputs, $stderr]`. Callers must assert on how many children actually
     * produced output — a child that died silently would otherwise turn the assertion
     * that follows into a vacuous pass.
     */
    protected function runInParallel(array $commands): array
    {
        $procs = [];
        $pipes = [];

        foreach ($commands as $i => $cmd) {
            $procs[$i] = proc_open($cmd, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes[$i], base_path());
        }

        $outputs = [];
        $stderr = '';

        foreach ($procs as $i => $proc) {
            if (! is_resource($proc)) {
                continue;
            }

            $outputs[$i] = stream_get_contents($pipes[$i][1]);
            $stderr .= stream_get_contents($pipes[$i][2]);
            fclose($pipes[$i][1]);
            fclose($pipes[$i][2]);
            proc_close($proc);
        }

        return [$outputs, $stderr];
    }

    /** Build the command line for one in-process HTTP request child. */
    protected function httpChild(string $method, string $url, string $token, ?string $body = null): string
    {
        return sprintf('%s php %s %s %s %s %s',
            $this->childEnv(),
            escapeshellarg(base_path('tests/Support/http_request.php')),
            escapeshellarg($method),
            escapeshellarg($url),
            escapeshellarg($token),
            $body === null ? '' : escapeshellarg($body));
    }
}
