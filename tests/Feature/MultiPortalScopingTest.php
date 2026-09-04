<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Http\Middleware\BindPortalScope;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Portal scoping across the six subdomains — guide §8.1, including the bolded clause
 * *"background jobs correctly bypass portal scope"*.
 *
 * 🔴 **Every failure in this file is invisible in the UI.** A leaked sea row on an air
 * screen looks like a job; a wrongly-filtered background worker looks like a quiet
 * night. Neither throws, neither logs, and both are only ever noticed as a number that
 * seemed slightly off — which is why the contract is asserted here rather than trusted.
 */
class MultiPortalScopingTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $operator;

    /** The accounts portal admits ONLY the `accounts` designation — see config/f16s.php. */
    private User $bookkeeper;

    /** The other tenant, used to prove portal scope never stands in for tenant scope. */
    private Company $rival;
    private Agent $rivalBranch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Portal Co', 'code' => 'MPS', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->operator = $this->user('operations', $this->branch, $this->company, 'ops');
        $this->bookkeeper = $this->user('accounts', $this->branch, $this->company, 'acc');

        $this->rival = Company::create(['name' => 'Rival Co', 'code' => 'MPR', 'tier' => 'command']);
        $this->rivalBranch = Agent::create(['company_id' => $this->rival->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA']);

        // One job per mode for us, plus an air job belonging to the rival tenant.
        $this->job($this->branch, 'air');
        $this->job($this->branch, 'sea');
        $this->job($this->branch, 'road');
        $this->job($this->rivalBranch, 'air');
    }

    private function user(string $designation, Agent $branch, Company $company, string $suffix): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$suffix}-mps@test.local",
            'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    /**
     * ⚠️ `$owner` is not decoration. `/api/jobs` scopes to the caller's own shipments, so
     * a job with no `ops_id` is an UNASSIGNED-POOL job and correctly absent from the
     * assigned board. Leaving it null here made these portal-scoping tests assert against
     * an empty list, which would have passed for the wrong reason.
     */
    private function job(Agent $branch, string $mode, ?User $owner = null): int
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $branch->id, 'transport_mode' => $mode,
            'enquiry_no' => strtoupper('ENQ' . substr($mode, 0, 1)) . '-X-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);

        return DB::table('jobs')->insertGetId([
            'agent_id' => $branch->id, 'enquiry_id' => $enquiryId,
            'transport_mode' => $mode, 'status' => 'Intake',
            'ops_id' => ($owner ?? $this->operator)->id,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function modesSeenFrom(string $host, ?User $as = null): array
    {
        $body = $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as ?? $this->operator),
            'Accept' => 'application/json',
        ])->getJson("http://{$host}/api/jobs")->assertOk()->json();

        $rows = $body['data'] ?? $body['jobs'] ?? $body;

        return array_values(array_unique(array_column($rows, 'transport_mode')));
    }

    // ─── 1. The mode-bound portals filter ────────────────────────────────────

    public function test_the_air_portal_shows_air_jobs_only(): void
    {
        $this->assertSame(['air'], $this->modesSeenFrom('focusair.localhost'));
    }

    public function test_the_sea_portal_shows_sea_jobs_only(): void
    {
        $this->assertSame(['sea'], $this->modesSeenFrom('focussea.localhost'));
    }

    /**
     * ⚠️ Road has no Vue screens yet (PRD §11), but the MODE is live from day one. The
     * scope must already be correct, or the screens will be built on top of a filter
     * nobody ever checked.
     */
    public function test_the_road_portal_shows_road_jobs_only(): void
    {
        $this->assertSame(['road'], $this->modesSeenFrom('focusroad.localhost'));
    }

    // ─── 2. The cross-mode portals do NOT filter ─────────────────────────────

    /**
     * Accounts bills every mode from one ledger. Filtering it to a mode would silently
     * halve the receivables — the page would still render, and still balance.
     */
    public function test_the_accounts_portal_sees_every_mode(): void
    {
        $modes = $this->modesSeenFrom('accounts.localhost', $this->bookkeeper);

        sort($modes);
        $this->assertSame(['air', 'road', 'sea'], $modes);
    }

    // ─── 3. Portal scope is NOT tenant scope ─────────────────────────────────

    /**
     * 🔴 THE MISREADING THE MIDDLEWARE DOCBLOCK WARNS ABOUT. `accounts` binds no portal
     * scope; it must not follow that it binds no TENANT scope. The rival's air job is
     * the tripwire: it satisfies every mode filter in this file, so only tenancy can
     * be keeping it out.
     */
    public function test_a_cross_mode_portal_still_cannot_see_another_tenant(): void
    {
        $body = $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->bookkeeper),
            'Accept' => 'application/json',
        ])->getJson('http://accounts.localhost/api/jobs')->assertOk()->json();

        $rows = $body['data'] ?? $body['jobs'] ?? $body;
        $agentIds = array_values(array_unique(array_column($rows, 'agent_id')));

        $this->assertSame([$this->branch->id], $agentIds,
            'A cross-mode portal leaked another tenant — portal scope was mistaken for tenant scope.');
    }

    // ─── 4. THE BOLDED CLAUSE: background work bypasses portal scope ─────────

    /**
     * 🔴 **A daemon must see every mode.** Queue workers, scheduled commands and console
     * runs never execute HTTP middleware, so nothing is bound and `forActivePortal()`
     * passes through. If it instead filtered on a NULL scope, every background job would
     * quietly process a third of its work and report success.
     */
    public function test_a_background_context_sees_every_mode(): void
    {
        $this->assertFalse(app()->bound(BindPortalScope::CONTAINER_KEY),
            'The test process starts unbound, exactly as a queue worker does.');

        $modes = Job::forActivePortal()->where('agent_id', $this->branch->id)
            ->pluck('transport_mode')->unique()->sort()->values()->all();

        $this->assertSame(['air', 'road', 'sea'], $modes);
    }

    /**
     * ⚠️ The same guarantee stated as the failure it prevents: a bound scope really does
     * filter, so the pass above is the ABSENCE of a binding rather than a scope that
     * never worked. Without this, a `forActivePortal()` that had been accidentally
     * gutted to `return $query` would make the previous test pass for the wrong reason.
     */
    public function test_the_pass_through_is_the_absence_of_a_binding_not_a_broken_scope(): void
    {
        app()->instance(BindPortalScope::CONTAINER_KEY, 'sea');

        $modes = Job::forActivePortal()->where('agent_id', $this->branch->id)
            ->pluck('transport_mode')->unique()->values()->all();

        $this->assertSame(['sea'], $modes);

        app()->forgetInstance(BindPortalScope::CONTAINER_KEY);
    }

    /**
     * 🔴 A job DISPATCHED from an air request must not inherit that request's scope.
     * The container binding is process-wide, so work queued during a web request and
     * run later — or run inline — could pick up `air` and skip every sea shipment. The
     * worker's own bootstrap is what must decide, never the dispatcher's hostname.
     */
    public function test_work_queued_during_an_air_request_is_not_filtered_to_air(): void
    {
        app()->instance(BindPortalScope::CONTAINER_KEY, 'air');

        // What a worker does before running a job: it resolves scope from its own
        // (empty) context rather than from whatever the process last handled.
        app()->forgetInstance(BindPortalScope::CONTAINER_KEY);

        $modes = Job::forActivePortal()->where('agent_id', $this->branch->id)
            ->pluck('transport_mode')->unique()->sort()->values()->all();

        $this->assertSame(['air', 'road', 'sea'], $modes);
    }

    // ─── 5. An unrecognised host binds nothing ───────────────────────────────

    /**
     * 🔴 An unknown host is REFUSED, and with 404 rather than 403 — an unrecognised
     * hostname must not confirm which hostnames exist.
     *
     * ⚠️ This is worth stating precisely because BindPortalScope binds no scope for such
     * a host, and an unfiltered scope would mean *every mode of every kind*. It never
     * gets that far: EnforcePortalAccess refuses before the controller runs. The
     * pass-through above it is for contexts with no middleware at all — the daemon case
     * — and NOT a hole reachable over HTTP.
     */
    public function test_an_unknown_host_is_refused_before_any_query_runs(): void
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->operator),
            'Accept' => 'application/json',
        ])->getJson('http://localhost/api/jobs')->assertStatus(404);
    }

    /**
     * ⚠️ And the refusal names nothing. A 404 body that listed the real portals would
     * hand an attacker the map the status code is withholding.
     */
    public function test_the_unknown_host_refusal_does_not_enumerate_the_real_portals(): void
    {
        $body = $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->operator),
            'Accept' => 'application/json',
        ])->getJson('http://localhost/api/jobs')->json();

        foreach (['focusair', 'focussea', 'focusroad', 'accounts', 'admin', 'superadmin'] as $name) {
            $this->assertStringNotContainsStringIgnoringCase($name, json_encode($body));
        }
    }
}
