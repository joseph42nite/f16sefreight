<?php

namespace App\Support;

/**
 * The six portals, resolved from the request Host.
 *
 * Reads config('f16s.portals') — the single source of truth for the topology settled
 * 2026-08-27 (PRD.md §1.3). Nothing else in the codebase may hardcode a hostname.
 *
 * 🔴 TWO INDEPENDENT AXES. Do not collapse them:
 *     scope()       which transport mode is visible; NULL = cross-mode
 *     isTenantBound() whether the request lives inside ONE customer's data
 *
 * `accounts` and `admin` have NO scope yet ARE tenant-bound. Only `superadmin` — F16s's
 * own staff — is not tenant-bound. Reading "no portal scope" as "no tenant scope" is how
 * a client's Boss would end up reading another tenant's books.
 */
class Portal
{
    private function __construct(
        public readonly ?string $key,
        public readonly array $config,
    ) {}

    /**
     * Resolve from a Host header.
     *
     * Matches the FIRST label only: `focusair.f16sefreight.com`, `focusair.f16s.local`
     * and `focusair.localhost:8000` all resolve identically, so local development,
     * staging and production share one code path.
     *
     * An unrecognised host (plain `localhost`, the bare apex, an IP) resolves to the
     * null portal — no scope, no portal-gated login. Same shape as a queue worker.
     */
    public static function fromHost(?string $host): self
    {
        $label = strtolower(trim(explode('.', (string) $host)[0] ?? ''));

        // Strip any port that survived on a single-label host, e.g. "localhost:8000".
        $label = explode(':', $label)[0];

        $portals = config('f16s.portals', []);

        return isset($portals[$label])
            ? new self($label, $portals[$label])
            : new self(null, []);
    }

    /** True when the host named a real portal. */
    public function exists(): bool
    {
        return $this->key !== null;
    }

    /** 'air' | 'sea' | 'road', or NULL for the cross-mode portals. */
    public function scope(): ?string
    {
        return $this->config['scope'] ?? null;
    }

    /**
     * NOTE the default: an UNKNOWN portal is treated as tenant-bound.
     * Failing closed matters more here than convenience — the alternative default
     * would hand unfiltered cross-tenant rows to any unrecognised hostname.
     */
    public function isTenantBound(): bool
    {
        return $this->config['tenant_bound'] ?? true;
    }

    public function guard(): string
    {
        return $this->config['guard'] ?? 'user-api';
    }

    public function label(): string
    {
        return $this->config['label'] ?? 'Unknown';
    }

    /** NULL means any authenticated tenant user may enter. */
    public function designations(): ?array
    {
        return $this->config['designations'] ?? null;
    }

    public function minTier(): ?string
    {
        return $this->config['min_tier'] ?? null;
    }

    public function allowsDesignation(?string $designation): bool
    {
        $allowed = $this->designations();

        if ($allowed === null) {
            return true;
        }

        return $designation !== null && in_array($designation, $allowed, true);
    }
}
