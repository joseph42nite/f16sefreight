<?php

namespace App\Support;

use App\User;
use Illuminate\Support\Facades\Cache;

/**
 * Per-request entitlement context: company_id, agent_id, designation, tier.
 *
 * 🔴 **Read from the DATABASE each request, never from the JWT** (guide §3.0 rule 2,
 * §3.6). `User::getJWTCustomClaims()` stays empty on purpose. If `tier` or `designation`
 * were token claims, a demotion or a tier downgrade would not take effect until the
 * token expired — someone stripped of the `accounts` role would keep posting to the
 * ledger for the rest of their token's life.
 *
 * Memoized in the cache under `user_ctx:{id}` with a short TTL, and BUSTED ON SAVE of
 * the User or Company (see AppServiceProvider). The TTL is a backstop, not the
 * mechanism — a demotion must apply on the next request, not in five minutes.
 *
 * ── Resolution is TOTAL, and that is a project rule ─────────────────────────
 * Every user has a branch (users.branch_name is NOT NULL with an FK), therefore a
 * company, therefore a tier. There is no branchless-user case to design around, which
 * is what lets ProcessPdfOcrJob route on tier without a fallback to invent.
 * If the chain ever does break, this returns NULLs rather than inventing a tier —
 * denying access is correct; guessing 'command' is not.
 */
class UserContext
{
    public const TTL_SECONDS = 300;

    public function __construct(
        public readonly int $userId,
        public readonly ?int $companyId,
        public readonly ?int $agentId,
        public readonly ?string $designation,
        public readonly ?string $tier,
    ) {}

    public static function for(User $user): self
    {
        $data = Cache::remember(
            self::cacheKey($user->id),
            self::TTL_SECONDS,
            fn () => self::resolve($user)
        );

        return new self(
            $user->id,
            $data['company_id'],
            $data['agent_id'],
            $data['designation'],
            $data['tier'],
        );
    }

    /** @return array{company_id:?int,agent_id:?int,designation:?string,tier:?string} */
    private static function resolve(User $user): array
    {
        // Eager-load the whole chain in one go: this runs on every authenticated request.
        $branch = $user->relationLoaded('branch')
            ? $user->getRelation('branch')
            : $user->branch()->with('companyName')->first();

        $company = $branch?->relationLoaded('companyName')
            ? $branch->getRelation('companyName')
            : $branch?->companyName()->first();

        return [
            'company_id'  => $company?->id,
            'agent_id'    => $branch?->id,
            'designation' => $user->designation,
            // No ?? 'core' fallback: a missing company means the chain is broken, and a
            // broken chain must deny rather than silently grant the lowest tier.
            'tier'        => $company?->tier,
        ];
    }

    public static function cacheKey(int $userId): string
    {
        return "user_ctx:{$userId}";
    }

    public static function forget(int $userId): void
    {
        Cache::forget(self::cacheKey($userId));
    }

    public function tierAtLeast(?string $tier): bool
    {
        if ($tier === null) {
            return true;
        }

        $have = array_search($this->tier, \App\Company::TIERS, true);
        $need = array_search($tier, \App\Company::TIERS, true);

        return $have !== false && $need !== false && $have >= $need;
    }

    /** @return array<string,mixed> Shape consumed by Vue route guards. */
    public function toArray(): array
    {
        return [
            'user_id'     => $this->userId,
            'company_id'  => $this->companyId,
            'agent_id'    => $this->agentId,
            'designation' => $this->designation,
            'tier'        => $this->tier,
        ];
    }
}
