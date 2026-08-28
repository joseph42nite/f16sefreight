<?php

namespace App\Concerns;

use App\Scopes\TenantScope;

/**
 * Applies automatic tenant isolation — guide §3.1.
 *
 * Declare the grain explicitly on the model:
 *
 *     protected string $tenantColumn = 'company_id';   // tenant-wide
 *     // defaults to 'agent_id'                        // branch-scoped
 *
 * Explicit rather than inferred: guessing from which column happens to exist would
 * silently pick the wrong grain on a table carrying both (accounts_invoices has
 * agent_id; gst_ledger_entries has both), and the wrong grain is a data leak in one
 * direction and missing rows in the other.
 */
trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);
    }

    public function tenantColumn(): string
    {
        return property_exists($this, 'tenantColumn') ? $this->tenantColumn : 'agent_id';
    }

    /**
     * The escape hatch for daemons, console commands, webhooks and supervisors.
     *
     * ⚠️ Every call is a deliberate decision to cross tenant boundaries. It is correct in
     * a queue worker resolving a job's tier, and a security bug in a controller.
     */
    public static function withoutTenantScope(): \Illuminate\Database\Eloquent\Builder
    {
        return static::withoutGlobalScope(TenantScope::class);
    }
}
