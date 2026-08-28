<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Redis circuit breaker for external calls — guide §4.9.
 *
 * Opens after 5 consecutive failures and fails fast for 15 minutes, so a dead dependency
 * costs one timeout rather than one per job for as long as it stays dead.
 *
 * 🔴 **KEY THE BREAKER PER CONNECTION, NEVER GLOBALLY.**
 *     breaker:mailbox:{mailbox_connection_id}     ✅
 *     breaker:graph                               ❌
 * One tenant hitting a 429 must not stop mail sync for every other tenant on the
 * platform. A provider-wide breaker is justified only on a confirmed outage, and should
 * trip on a high threshold across MANY DISTINCT connections — not on one mailbox failing
 * five times.
 *
 * The AI server is the one legitimate exception: it genuinely is a single shared
 * dependency, so it keeps `platform:status:ai_server`.
 */
class CircuitBreaker
{
    public const FAILURE_THRESHOLD = 5;
    public const OPEN_SECONDS = 900; // 15 minutes

    /** The single shared dependency — the one key that is deliberately not per-connection. */
    public const AI_SERVER_KEY = 'platform:status:ai_server';

    public function __construct(private readonly string $key) {}

    public static function forMailbox(int $mailboxConnectionId): self
    {
        return new self("breaker:mailbox:{$mailboxConnectionId}");
    }

    public static function forAiServer(): self
    {
        return new self(self::AI_SERVER_KEY);
    }

    /** Per-tenant, so one tenant's bank outage never blocks another's. */
    public static function forBankConnection(int $companyId): self
    {
        return new self("breaker:bank:{$companyId}");
    }

    public function isOpen(): bool
    {
        return (int) Cache::get($this->failureKey(), 0) >= self::FAILURE_THRESHOLD;
    }

    public function recordFailure(): int
    {
        $failures = (int) Cache::get($this->failureKey(), 0) + 1;

        Cache::put($this->failureKey(), $failures, self::OPEN_SECONDS);

        return $failures;
    }

    /** Clear the key on the next success — a single good call closes the breaker. */
    public function recordSuccess(): void
    {
        Cache::forget($this->failureKey());
    }

    /**
     * Run $operation unless the breaker is open.
     *
     * @throws CircuitOpenException when the breaker is open — the caller decides whether
     *         that is a retry, a refund or a user-visible failure. Swallowing it here
     *         would hide an outage behind an empty result.
     */
    public function call(callable $operation)
    {
        if ($this->isOpen()) {
            throw new CircuitOpenException("Circuit open for {$this->key}; failing fast.");
        }

        try {
            $result = $operation();
        } catch (\Throwable $e) {
            $this->recordFailure();

            throw $e;
        }

        $this->recordSuccess();

        return $result;
    }

    /** Exponential backoff with jitter: 2^attempt x 100ms, capped at 5 attempts. */
    public static function backoffMs(int $attempt): int
    {
        $base = (2 ** max(0, $attempt)) * 100;

        // Jitter matters: without it every failed job in a burst retries in lockstep and
        // hits the recovering dependency simultaneously.
        return $base + random_int(0, (int) ($base * 0.25));
    }

    private function failureKey(): string
    {
        return $this->key . ':failures';
    }
}
