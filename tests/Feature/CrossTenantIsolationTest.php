<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

/**
 * Checkpoint 3 — tenant isolation must hold before a single controller is written.
 *
 * Two tenants, each with a branch, a customer and an enquiry. Every assertion asks the
 * same question: can tenant A ever see tenant B's row?
 *
 * ⚠️ Isolation has TWO GRAINS and they are not interchangeable:
 *   agent_id    branch-scoped — enquiries, jobs, invoices, documents
 *   company_id  tenant-wide  — customers, partners, policies
 * Scoping customers by branch would hide a client from the branch handling their
 * shipment; scoping enquiries by company would leak another branch's pipeline.
 */
class CrossTenantIsolationTest extends TestCase
{
    use DatabaseTransactions;

    private array $acme;
    private array $globex;

    protected function setUp(): void
    {
        parent::setUp();

        $this->acme = $this->makeTenant('Acme Freight', 'ACM', 'BOM');
        $this->globex = $this->makeTenant('Globex Logistics', 'GLX', 'MAA');
    }

    private function makeTenant(string $name, string $code, string $branchCode): array
    {
        $company = Company::create(['name' => $name, 'code' => $code, 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => "{$name} Branch", 'branch_code' => $branchCode]);

        $user = User::create([
            'name' => "{$name} User", 'email' => strtolower($code) . '-iso@test.local', 'password' => 'x',
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing',
        ]);

        // Created WITHOUT an authenticated user, so the global scope is inert here —
        // which is exactly how a seeder or daemon writes cross-tenant fixtures.
        $customer = Customer::create(['company_id' => $company->id, 'name' => "{$name} Client", 'email_domain' => strtolower($code) . '.test']);

        $enquiry = Enquiry::create([
            'agent_id' => $branch->id, 'customer_id' => $customer->id, 'transport_mode' => 'air',
            'enquiry_no' => "ENQA-{$code}{$branchCode}-26-0001",
        ]);

        Job::create([
            'agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
        ]);

        return compact('company', 'branch', 'user', 'customer', 'enquiry');
    }

    /**
     * Act as a user through the real JWT guard.
     *
     * ⚠️ Deliberately NOT actingAs(): the guide warns it bypasses both JWT and the
     * Host-derived portal scope, so a test using it would pass while the real thing
     * leaked (guide Step 8). setUser() puts the user on the actual guard the application
     * reads.
     *
     * ⚠️ And NOT logout() either — on a JWT guard that tries to parse a token out of the
     * request and throws "Token could not be parsed". forgetGuards() resets the resolved
     * guard without touching the token pipeline.
     */
    private function asUser(User $user, callable $fn)
    {
        Auth::guard('user-api')->setUser($user);

        try {
            return $fn();
        } finally {
            Auth::forgetGuards();
        }
    }

    // ─── Branch-scoped tables ────────────────────────────────────────────────

    public function test_a_user_sees_only_their_own_branch_enquiries(): void
    {
        $visible = $this->asUser($this->acme['user'], fn () => Enquiry::pluck('enquiry_no')->all());

        $this->assertSame(['ENQA-ACMBOM-26-0001'], $visible);
    }

    public function test_a_user_cannot_reach_another_tenants_enquiry_by_id(): void
    {
        $otherId = $this->globex['enquiry']->id;

        $found = $this->asUser($this->acme['user'], fn () => Enquiry::find($otherId));

        $this->assertNull($found, 'Knowing the id must not be enough to read another tenant row.');
    }

    public function test_jobs_are_branch_scoped(): void
    {
        $counts = $this->asUser($this->acme['user'], fn () => Job::count());

        $this->assertSame(1, $counts);
        $this->assertSame(2, Job::withoutTenantScope()->count(), 'Both tenants really do have a job.');
    }

    // ─── Tenant-wide tables ──────────────────────────────────────────────────

    /**
     * Customers are shared across a tenant's branches — the isolation boundary is the
     * COMPANY, not the branch. Getting this grain wrong hides a client from the branch
     * actually handling their shipment.
     */
    public function test_customers_are_scoped_to_the_company_not_the_branch(): void
    {
        $company = $this->acme['company'];

        // A second branch of the SAME tenant.
        $secondBranch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Acme Chennai', 'branch_code' => 'MAA']);

        $secondBranchUser = User::create([
            'name' => 'Acme Chennai User', 'email' => 'acm2-iso@test.local', 'password' => 'x',
            'company_name' => $company->id, 'branch_name' => $secondBranch->id, 'designation' => 'sales',
        ]);

        $visible = $this->asUser($secondBranchUser, fn () => Customer::pluck('name')->all());

        $this->assertSame(['Acme Freight Client'], $visible, 'A sibling branch must see the tenant\'s clients...');
        $this->assertNotContains('Globex Logistics Client', $visible, '...but never another tenant\'s.');
    }

    // ─── The escape hatch, and what happens without a user ───────────────────

    /**
     * Queue workers and console commands have no authenticated user and MUST see
     * everything — a daemon resolving a job's tier runs across tenants by design.
     */
    public function test_without_an_authenticated_user_the_scope_is_inert(): void
    {
        $this->assertFalse(Auth::guard('user-api')->check());
        $this->assertSame(2, Enquiry::count(), 'A daemon context must not be silently filtered to zero.');
    }

    /**
     * 🔴 The corollary, and the one way this design can leak: an HTTP route that forgets
     * auth middleware returns unfiltered rows. This test exists to keep that fact visible.
     */
    public function test_the_escape_hatch_crosses_tenants_deliberately(): void
    {
        $all = $this->asUser($this->acme['user'], fn () => Enquiry::withoutTenantScope()->count());

        $this->assertSame(2, $all, 'withoutTenantScope() is an explicit decision to cross tenants.');
    }

    /**
     * The tenancy chain cannot be broken by deletion — the database refuses.
     *
     * This is what makes tier resolution TOTAL (guide §4.1.1): every user has a branch,
     * therefore a company, therefore a tier, and there is no branchless-user case to
     * design around. An earlier version of this test tried to orphan a user by deleting
     * their branch; the foreign key rejected it, which is the better assertion.
     */
    public function test_a_user_cannot_be_orphaned_from_their_branch(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Agent::whereKey($this->acme['branch']->id)->delete();
    }

    /**
     * Fail-closed: if the chain ever DID resolve to nothing, the scope must show nothing
     * rather than everything. Asserted at the scope's decision point, since the database
     * makes the state itself unreachable.
     */
    public function test_an_unresolvable_tenant_shows_no_rows_rather_than_all_rows(): void
    {
        $user = $this->acme['user'];

        // Point the cached context at a tenant that does not exist.
        \Illuminate\Support\Facades\Cache::put(
            \App\Support\UserContext::cacheKey($user->id),
            ['company_id' => null, 'agent_id' => null, 'designation' => 'pricing', 'tier' => null],
            60
        );

        $visible = $this->asUser($user, fn () => Enquiry::count());

        \App\Support\UserContext::forget($user->id);

        $this->assertSame(0, $visible, 'A broken chain must never become "see everything".');
    }
}
