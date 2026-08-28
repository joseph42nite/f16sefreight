<?php

namespace App\Scopes;

use App\Support\UserContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Automatic tenant isolation — guide §3.1.
 *
 * Branches on WHICH COLUMN the table carries, because the schema has two grains:
 *
 *   agent_id    BRANCH-scoped: enquiries, jobs, email_threads, accounts_invoices,
 *               job_documents, every analytics table
 *   company_id  TENANT-scoped: customers, partners, sla_policies, gst_ledger_entries,
 *               unposted_transactions_queue, ocr_credit_transactions
 *
 * ⚠️ **Customers and partners are tenant-WIDE, shared across all of a tenant's branches.**
 * `customers.branch_id` is an advisory managing/proximity branch used for routing and
 * sales assignment — **not** an isolation boundary (PRD.md §1.2). Scoping customers by
 * agent_id would hide a client from the branch that is actually handling their shipment.
 *
 * ── When no user is resolved, this does NOTHING, and that is deliberate ─────
 * Queue workers, console commands, webhooks and broadcasts have no authenticated user.
 * Filtering on a NULL tenant there would return zero rows and quietly break every daemon;
 * passing through unfiltered is the intended behaviour, exactly as the portal scope
 * behaves in the same contexts.
 *
 * 🔴 **The corollary is that HTTP routes MUST be behind auth middleware.** An
 * unauthenticated route touching a scoped model returns unfiltered rows. That is the one
 * way this design can leak, so it is asserted in CrossTenantIsolationTest.
 */
class TenantScope implements Scope
{
    /**
     * Guards that can carry a tenant user, in resolution order.
     *
     * 🔴 **The DEFAULT guard is useless here and checking it is a silent no-op.**
     * config/auth.php defaults to `web`, which is session-based — and under stateless JWT
     * the session is always empty. An earlier version of this scope called
     * `auth()->hasUser()`, which resolves the default guard, so it never matched and the
     * scope was INERT: every query returned every tenant's rows, with nothing raised.
     * Verified against the codebase — every live controller resolves via
     * `auth()->guard('user-api')`. This is the same class of failure the guide flags for
     * session-backed portal scoping (§3.3).
     */
    private const TENANT_GUARDS = ['user-api'];

    public function apply(Builder $builder, Model $model): void
    {
        $user = $this->resolveTenantUser();

        if ($user === null) {
            return; // daemon / console / unauthenticated — see the class docblock
        }

        $context = UserContext::for($user);
        $column = $model->tenantColumn();

        $value = $column === 'company_id' ? $context->companyId : $context->agentId;

        if ($value === null) {
            // A user whose tenancy chain is broken sees NOTHING rather than everything.
            // Failing closed matters more here than any convenience.
            $builder->whereRaw('1 = 0');

            return;
        }

        $builder->where($model->qualifyColumn($column), $value);
    }

    /**
     * Resolve the acting tenant user from the JWT guard.
     *
     * `hasUser()` covers the normal case where auth middleware already resolved it.
     * Otherwise we attempt resolution, catching JWTException — tymon's guard THROWS
     * rather than returning null when no token is present, which is the common case in
     * console and queue contexts.
     */
    private function resolveTenantUser(): ?\App\User
    {
        foreach (self::TENANT_GUARDS as $name) {
            $guard = auth()->guard($name);

            if ($guard->hasUser()) {
                $user = $guard->user();

                return $user instanceof \App\User ? $user : null;
            }

            try {
                $user = $guard->user();
            } catch (\Throwable $e) {
                continue; // no parsable token — not an authenticated HTTP request
            }

            if ($user instanceof \App\User) {
                return $user;
            }
        }

        return null;
    }
}
