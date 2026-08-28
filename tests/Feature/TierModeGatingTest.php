<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Checkpoint 3 — portal, tier and mode gating.
 *
 * 🔴 **Every login here goes through the real HTTP endpoint with a real Host header.**
 * The guide is explicit that `actingAs()` must never be used: it bypasses both JWT and
 * the Host-derived portal scope, so this file would pass while air users saw sea data in
 * production — the precise failure it exists to catch (guide Step 8).
 */
class TierModeGatingTest extends TestCase
{
    use DatabaseTransactions;

    private const PASSWORD = 'secret123';

    protected function tearDown(): void
    {
        Auth::forgetGuards();
        parent::tearDown();
    }

    /** @return array{0: Company, 1: Agent} */
    private function tenant(string $tier = 'command', string $code = 'ACM'): array
    {
        $company = Company::create(['name' => "Tenant {$code}", 'code' => $code, 'tier' => $tier]);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Branch', 'branch_code' => 'BOM']);

        return [$company, $branch];
    }

    private function staff(Company $company, Agent $branch, string $designation, string $email): User
    {
        $user = User::create([
            'name' => ucfirst($designation), 'email' => $email, 'password' => Hash::make(self::PASSWORD),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => $designation,
        ]);

        // App\Role has no $fillable; insert directly rather than widening a legacy model
        // purely for a test.
        \Illuminate\Support\Facades\DB::table('roles')->insert([
            'email' => $email, 'role' => 'user', 'created_at' => now(), 'updated_at' => now(),
        ]);

        return $user;
    }

    /**
     * ⚠️ The host MUST be given as a full URL.
     *
     * `withHeader('Host', ...)` and `withServerVariables(['HTTP_HOST' => ...])` do NOT
     * reach `$request->getHost()` in Laravel's test client — verified 2026-08-28: both
     * resolved to the null portal while a full URL resolved correctly. A portal test
     * written the obvious way therefore exercises nothing and passes for the wrong
     * reason.
     */
    private function loginAt(string $host, string $email)
    {
        return $this->postJson("http://{$host}/api/auth/login", [
            'email' => $email, 'password' => self::PASSWORD,
        ]);
    }

    // ─── The portal decides who may enter ────────────────────────────────────

    public function test_a_pricing_user_signs_in_at_focusair_and_receives_the_air_scope(): void
    {
        [$company, $branch] = $this->tenant();
        $this->staff($company, $branch, 'pricing', 'pricing-gate@test.local');

        $response = $this->loginAt('focusair.f16sefreight.com', 'pricing-gate@test.local');

        $response->assertOk()
            ->assertJsonPath('portal.key', 'focusair')
            ->assertJsonPath('portal.scope', 'air')
            ->assertJsonPath('context.designation', 'pricing')
            ->assertJsonPath('context.tier', 'command');
    }

    /** An accounts user on an operational portal is a navigation mistake, not an attack. */
    public function test_an_accounts_user_is_refused_at_focusair(): void
    {
        [$company, $branch] = $this->tenant();
        $this->staff($company, $branch, 'accounts', 'accounts-gate@test.local');

        $this->loginAt('focusair.f16sefreight.com', 'accounts-gate@test.local')
            ->assertStatus(403)
            ->assertJsonPath('reason', 'designation');
    }

    public function test_an_accounts_user_signs_in_at_the_accounts_portal(): void
    {
        [$company, $branch] = $this->tenant();
        $this->staff($company, $branch, 'accounts', 'accounts-ok@test.local');

        $this->loginAt('accounts.f16sefreight.com', 'accounts-ok@test.local')
            ->assertOk()
            ->assertJsonPath('portal.key', 'accounts')
            // Cross-mode by design: there is ONE ledger, and invoices span every mode.
            ->assertJsonPath('portal.scope', null);
    }

    /** admin. is the CLIENT tenant's Boss — an ordinary user, fully tenant-bound. */
    public function test_only_the_boss_may_enter_the_tenant_admin_portal(): void
    {
        [$company, $branch] = $this->tenant();
        $this->staff($company, $branch, 'boss', 'boss-gate@test.local');
        $this->staff($company, $branch, 'sales', 'sales-gate@test.local');

        $this->loginAt('admin.f16sefreight.com', 'boss-gate@test.local')
            ->assertOk()
            ->assertJsonPath('portal.key', 'admin')
            ->assertJsonPath('portal.scope', null); // Boss compares modes side by side

        $this->loginAt('admin.f16sefreight.com', 'sales-gate@test.local')
            ->assertStatus(403)
            ->assertJsonPath('reason', 'designation');
    }

    /**
     * 🔴 A tenant user must never reach the platform portal. superadmin. is the only host
     * with no tenant binding — letting an ordinary user in would hand them unfiltered
     * cross-tenant rows.
     */
    public function test_a_tenant_user_is_refused_at_the_platform_portal(): void
    {
        [$company, $branch] = $this->tenant();
        $this->staff($company, $branch, 'boss', 'boss-platform@test.local');

        $this->loginAt('superadmin.f16sefreight.com', 'boss-platform@test.local')
            ->assertStatus(403)
            ->assertJsonPath('reason', 'guard');
    }

    // ─── Tier is checked BEFORE role ─────────────────────────────────────────

    /**
     * The accounts portal is Command-only: below that there is no ledger to run.
     * The response says `tier`, not `designation` — proving tier was evaluated first,
     * which is what stops a Core tenant reaching a role portal by writing a designation
     * straight into the database.
     */
    public function test_a_tactical_tenant_cannot_reach_the_accounts_portal(): void
    {
        [$company, $branch] = $this->tenant('tactical', 'TAC');
        $this->staff($company, $branch, 'accounts', 'accounts-tactical@test.local');

        $this->loginAt('accounts.f16sefreight.com', 'accounts-tactical@test.local')
            ->assertStatus(403)
            ->assertJsonPath('reason', 'tier')
            ->assertJsonPath('current_tier', 'tactical')
            ->assertJsonPath('required_tier', 'command');
    }

    // ─── Backwards compatibility ─────────────────────────────────────────────

    /**
     * 🔴 THE REGRESSION THAT MATTERS. The live application logs in at plain `localhost`,
     * which names no portal. That path must keep working exactly as it did before portal
     * gating existed — no portal key, no rejection, whatever the designation.
     */
    public function test_login_at_a_host_with_no_portal_is_unchanged(): void
    {
        [$company, $branch] = $this->tenant();
        $this->staff($company, $branch, 'accounts', 'legacy-login@test.local');

        $response = $this->loginAt('localhost', 'legacy-login@test.local');

        $response->assertOk()
            ->assertJsonStructure(['token', 'user', 'role'])
            ->assertJsonMissingPath('portal');
    }

    // ─── Role gates ──────────────────────────────────────────────────────────

    /**
     * 🔒 SEGREGATION OF DUTIES. Posting and period control are exclusive to `accounts` —
     * not even the Boss. The role that sets targets must not book the revenue those
     * targets are measured in. The guide calls this the single most likely permission to
     * get wrongly widened during development.
     */
    public function test_a_boss_cannot_post_to_the_ledger_or_manage_periods(): void
    {
        [$company, $branch] = $this->tenant();
        $boss = $this->staff($company, $branch, 'boss', 'boss-sod@test.local');
        $accounts = $this->staff($company, $branch, 'accounts', 'accounts-sod@test.local');

        $this->assertFalse(Gate::forUser($boss)->allows('postLedger'));
        $this->assertFalse(Gate::forUser($boss)->allows('managePeriod'));
        $this->assertFalse(Gate::forUser($boss)->allows('finalizeInvoice'));

        $this->assertTrue(Gate::forUser($accounts)->allows('postLedger'));
        $this->assertTrue(Gate::forUser($accounts)->allows('managePeriod'));

        // The Boss does get read-only financials, and may override a credit hold.
        $this->assertTrue(Gate::forUser($boss)->allows('viewFinancials'));
        $this->assertTrue(Gate::forUser($boss)->allows('overrideCreditHold'));
    }

    /** On core, designation is INERT — every role-scoped ability is closed. */
    public function test_on_the_core_tier_every_role_gate_is_closed(): void
    {
        [$company, $branch] = $this->tenant('core', 'COR');
        $user = $this->staff($company, $branch, 'pricing', 'core-pricing@test.local');

        foreach (['triage', 'convert', 'markLost', 'assignOperator', 'viewAnalytics'] as $ability) {
            $this->assertFalse(
                Gate::forUser($user)->allows($ability),
                "'{$ability}' must be unreachable on core, whatever the designation column says."
            );
        }
    }

    public function test_analytics_are_closed_to_operations_and_pricing(): void
    {
        [$company, $branch] = $this->tenant();
        $ops = $this->staff($company, $branch, 'operations', 'ops-analytics@test.local');
        $pricing = $this->staff($company, $branch, 'pricing', 'pricing-analytics@test.local');
        $sales = $this->staff($company, $branch, 'sales', 'sales-analytics@test.local');

        $this->assertFalse(Gate::forUser($ops)->allows('viewAnalytics'));
        $this->assertFalse(Gate::forUser($pricing)->allows('viewAnalytics'));
        $this->assertTrue(Gate::forUser($sales)->allows('viewAnalytics'));
    }

    /** Only pricing triages; operations may ask for a reassignment but not grant one. */
    public function test_triage_and_assignment_follow_the_role_matrix(): void
    {
        [$company, $branch] = $this->tenant();
        $pricing = $this->staff($company, $branch, 'pricing', 'pricing-matrix@test.local');
        $ops = $this->staff($company, $branch, 'operations', 'ops-matrix@test.local');

        $this->assertTrue(Gate::forUser($pricing)->allows('triage'));
        $this->assertFalse(Gate::forUser($ops)->allows('triage'));

        $this->assertTrue(Gate::forUser($ops)->allows('requestReassignment'));
        $this->assertFalse(Gate::forUser($ops)->allows('assignOperator'));
        $this->assertTrue(Gate::forUser($pricing)->allows('assignOperator'));
    }

    // ─── Mode scoping ────────────────────────────────────────────────────────

    /**
     * An air user must see ZERO sea rows. The scope reads the container binding that
     * BindPortalScope sets from the Host — never a session, which would be empty and
     * would silently return everything.
     */
    public function test_the_portal_scope_filters_by_transport_mode(): void
    {
        [$company, $branch] = $this->tenant();

        foreach ([['air', 'ENQA'], ['sea', 'ENQS'], ['road', 'ENQR']] as [$mode, $prefix]) {
            Enquiry::create([
                'agent_id' => $branch->id, 'transport_mode' => $mode,
                'enquiry_no' => "{$prefix}-ACMBOM-26-0001",
            ]);
        }

        app()->instance('active_portal_scope', 'air');
        $this->assertSame(['air'], Enquiry::withoutTenantScope()->forActivePortal()->pluck('transport_mode')->unique()->values()->all());

        app()->forgetInstance('active_portal_scope');
        app()->instance('active_portal_scope', 'sea');
        $this->assertSame(['sea'], Enquiry::withoutTenantScope()->forActivePortal()->pluck('transport_mode')->unique()->values()->all());

        // Unbound — a queue worker — passes through unfiltered rather than mis-filtered.
        app()->forgetInstance('active_portal_scope');
        $this->assertSame(3, Enquiry::withoutTenantScope()->forActivePortal()->count());
    }
}
