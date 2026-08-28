<?php

namespace App\Services;

use App\Agent;
use App\User;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * The reserved "System" user each tenant audits its automated actions against.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 * `audit_logs.user_id` is NOT NULL with a foreign key, but the actions most worth
 * auditing have no human actor: OCR overwriting declared cargo, the monthly credit
 * grant, the stale-enquiry sweep, vision-consent expiry. Before this, those rows were
 * simply skipped — so the change nobody witnessed was the one going unrecorded, which
 * inverts the point of the table (GAPS.md #22).
 *
 * The alternative was making `user_id` nullable. Keeping the foreign key means every
 * audit row stays attributable to a real row, and the history drawer shows a named
 * actor rather than a blank.
 *
 * ── One per COMPANY, not per branch ────────────────────────────────────────
 * "System" is one identity per tenant. Minting one per branch would put five identical
 * `System` entries in a multi-branch tenant's user list. `audit_logs.agent_id` still
 * records the branch the action happened in, so nothing is lost.
 *
 * ── It can do nothing, deliberately ────────────────────────────────────────
 *   designation = 'system'  — outside the real set, so it matches NO gate. Every
 *                             role check fails closed for it, with no special-casing.
 *   is_active   = 0         — excluded from operator pickers and assignment lists.
 *   password                — a random unusable hash; there is no login path.
 * It also cannot be assigned to `jobs.ops_id` or `pricing_id`: the designation triggers
 * require 'operations'/'pricing', and 'system' is neither.
 */
class SystemActor
{
    public const DESIGNATION = 'system';
    public const NAME = 'System (F16s)';

    /** @var array<int,int> memoized per company */
    private static array $cache = [];

    /**
     * The system user id for a company, creating it on first use.
     *
     * Self-healing rather than seeded: a tenant onboarded after this shipped gets one
     * the first time an automated action touches it, so there is no migration to
     * remember and no window where a new tenant's automation is unaudited.
     */
    public static function forCompany(int $companyId): int
    {
        if (isset(self::$cache[$companyId])) {
            return self::$cache[$companyId];
        }

        $existing = User::withoutGlobalScopes()
            ->where('company_name', (string) $companyId)
            ->where('designation', self::DESIGNATION)
            ->value('id');

        if ($existing !== null) {
            return self::$cache[$companyId] = (int) $existing;
        }

        // users.branch_name is NOT NULL with a foreign key, so the actor needs a branch.
        // The company's earliest branch is arbitrary but stable — and irrelevant to
        // reporting, because audit_logs.agent_id carries the real one.
        $branchId = Agent::withoutGlobalScopes()
            ->where('company_id', $companyId)
            ->orderBy('id')
            ->value('id');

        if ($branchId === null) {
            throw new RuntimeException(
                "Cannot create a system actor for company #{$companyId}: it has no branch. "
                . 'Every user needs one, including this one.'
            );
        }

        $user = User::withoutGlobalScopes()->create([
            'name'         => self::NAME,
            'email'        => "system+{$companyId}@f16s.internal",
            // Random and discarded — there is deliberately no way to authenticate as this.
            'password'     => bcrypt(Str::random(64)),
            'company_name' => (string) $companyId,
            'branch_name'  => $branchId,
            'designation'  => self::DESIGNATION,
            'is_active'    => 0,
        ]);

        return self::$cache[$companyId] = $user->id;
    }

    /** Resolve from a branch id, which is what most callers actually hold. */
    public static function forBranch(int $agentId): int
    {
        $companyId = Agent::withoutGlobalScopes()->whereKey($agentId)->value('company_id');

        if ($companyId === null) {
            throw new RuntimeException("Cannot resolve a system actor: branch #{$agentId} does not exist.");
        }

        return self::forCompany((int) $companyId);
    }

    public static function isSystem(?User $user): bool
    {
        return $user?->designation === self::DESIGNATION;
    }

    /** Test seam — the cache is per-process and would otherwise leak across cases. */
    public static function flushCache(): void
    {
        self::$cache = [];
    }
}
