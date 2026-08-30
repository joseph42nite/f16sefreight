<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

/**
 * Platform health and diagnostics — guide §5.6, PRD.md §2.3.6.
 *
 * 🔒 `superadmin` only. This is F16s's own staff, not a client's Boss — the two are
 * different portals for exactly this reason (CONTEXT.md §6b).
 *
 * ═══ 🔴 A HEALTH ENDPOINT MUST NEVER 500 ════════════════════════════════════
 * Every probe below is individually wrapped. If Redis is down, the correct answer is a
 * `200` whose Redis block says `down` with the reason — not a `500` that tells the
 * operator nothing except that something, somewhere, threw. An endpoint that dies when
 * a dependency dies is useless at precisely the moment it is needed.
 */
class AdminHealthController extends Controller
{
    /** The log tail is capped here, not by the caller — see logs(). */
    private const LOG_LINES = 100;

    public function health(): JsonResponse
    {
        return response()->json([
            'checked_at' => now()->toIso8601String(),
            'database'   => $this->probe(fn () => $this->database()),
            'redis'      => $this->probe(fn () => $this->redis()),
            'queues'     => $this->probe(fn () => $this->queues()),
            'ai_server'  => $this->probe(fn () => $this->aiServer()),
            'host'       => $this->probe(fn () => $this->host()),
        ]);
    }

    /**
     * The last 100 lines of today's log.
     *
     * ⚠️ **The path is fixed, never taken from the request.** A `?file=` parameter here
     * would be a directory traversal into anything the web user can read — and this
     * endpoint is reachable by the one role that would not be stopped by anything else.
     *
     * Read from the END rather than loading the file: a production log is routinely
     * hundreds of megabytes, and `file()` on one would exhaust memory and take the
     * monitor down with it.
     */
    public function logs(Request $request): JsonResponse
    {
        $lines = min((int) $request->integer('lines', self::LOG_LINES), 500);
        $path = storage_path('logs/laravel.log');

        if (! is_file($path)) {
            return response()->json([
                'path'  => $path,
                'lines' => [],
                'note'  => 'No log file yet. On a daily channel this is normal before the first write.',
            ]);
        }

        return response()->json([
            'path'      => $path,
            'size_mb'   => round(filesize($path) / 1048576, 2),
            'lines'     => $this->tail($path, $lines),
        ]);
    }

    /**
     * The classification feedback loop — PRD.md §2.3.6.
     *
     * Every row is a human correcting the regex engine, which makes this the training
     * signal for rule tuning. Exported as CSV because it is read in a spreadsheet by
     * whoever is tuning the rules, not by another service.
     */
    public function classificationOverrides()
    {
        $rows = DB::table('email_classification_overrides as o')
            ->leftJoin('email_classification_rules as r', 'r.id', '=', 'o.matched_rule_id')
            ->orderByDesc('o.created_at')
            ->limit(5000)
            ->get([
                'o.created_at', 'o.agent_id', 'o.original_classification',
                'o.corrected_classification', 'o.sender_domain', 'o.email_subject',
                'r.rule_name', 'r.pattern',
            ]);

        $csv = "created_at,agent_id,original,corrected,sender_domain,subject,rule_name,pattern\n";

        foreach ($rows as $r) {
            $csv .= implode(',', array_map(
                // Quote everything: a subject line containing a comma would otherwise
                // shift every later column by one and silently corrupt the export.
                fn ($v) => '"' . str_replace('"', '""', (string) $v) . '"',
                [$r->created_at, $r->agent_id, $r->original_classification,
                 $r->corrected_classification, $r->sender_domain, $r->email_subject,
                 $r->rule_name, $r->pattern]
            )) . "\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="classification-overrides-'
                                     . now()->format('Y-m-d') . '.csv"',
        ]);
    }

    // ─── Probes ──────────────────────────────────────────────────────────────

    /**
     * Run one probe, converting any failure into a reported state.
     *
     * @param  callable():array  $check
     */
    private function probe(callable $check): array
    {
        try {
            return $check();
        } catch (\Throwable $e) {
            return ['status' => 'down', 'error' => $e->getMessage()];
        }
    }

    private function database(): array
    {
        $started = microtime(true);
        DB::select('SELECT 1');

        return [
            'status'  => 'up',
            'latency_ms' => round((microtime(true) - $started) * 1000, 1),
            'driver'  => DB::connection()->getDriverName(),
        ];
    }

    private function redis(): array
    {
        $started = microtime(true);
        Redis::connection()->ping();

        return ['status' => 'up', 'latency_ms' => round((microtime(true) - $started) * 1000, 1)];
    }

    /**
     * Queue depth per named queue — guide §4.10.
     *
     * ⚠️ Reports the SEPARATE queues, never a single total. One number hides the
     * failure the topology exists to prevent: a 30-second OCR job sitting in front of
     * a one-second mail sync. `sync` at 400 and `ocr` at 2 is a different emergency
     * from the reverse, and a combined "402 pending" says neither.
     */
    private function queues(): array
    {
        $names = ['notifications', 'sync', 'mail-out', 'documents', 'ocr', 'backfill', 'analytics'];
        $depths = [];

        foreach ($names as $name) {
            $depths[$name] = (int) Redis::connection()->llen("queues:{$name}");
        }

        return [
            'status'  => 'up',
            'depths'  => $depths,
            'failed'  => DB::table('failed_jobs')->count(),
        ];
    }

    /**
     * The AI server's shared status key — guide §4.9.
     *
     * The ONE breaker that is deliberately global: the AI server genuinely is a single
     * shared dependency, unlike mailboxes, whose breakers are keyed per connection so
     * one tenant's 429 cannot stop sync for everyone.
     */
    private function aiServer(): array
    {
        $state = Redis::connection()->get('platform:status:ai_server');

        return $state === null
            ? ['status' => 'up', 'note' => 'No failure recorded — the key is cleared on success.']
            : ['status' => 'down', 'detail' => $state];
    }

    private function host(): array
    {
        $load = function_exists('sys_getloadavg') ? sys_getloadavg() : null;

        return [
            'status'      => 'up',
            'php'         => PHP_VERSION,
            'load_1m'     => $load[0] ?? null,
            'load_5m'     => $load[1] ?? null,
            'load_15m'    => $load[2] ?? null,
            'memory_mb'   => round(memory_get_usage(true) / 1048576, 1),
            'memory_peak_mb' => round(memory_get_peak_usage(true) / 1048576, 1),
        ];
    }

    /**
     * Read the last N lines without loading the file.
     *
     * @return list<string>
     */
    private function tail(string $path, int $lines): array
    {
        $handle = fopen($path, 'r');
        if ($handle === false) {
            return [];
        }

        $buffer = '';
        $chunk = 4096;
        fseek($handle, 0, SEEK_END);
        $position = ftell($handle);

        while ($position > 0 && substr_count($buffer, "\n") <= $lines) {
            $read = (int) min($chunk, $position);
            $position -= $read;
            fseek($handle, $position);
            $buffer = fread($handle, $read) . $buffer;
        }

        fclose($handle);

        $all = explode("\n", rtrim($buffer, "\n"));

        return array_values(array_slice($all, -$lines));
    }
}
