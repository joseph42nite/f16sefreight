<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Role;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The 2026-11-10 audit's security fixes (docs/plan/AUDIT_2026-11-10.md §1), over real HTTP with a real token and
 * Host — never `actingAs()`, for the reason LifecycleApiTest gives.
 */
class SecurityAuditFixesTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Audit Co', 'code' => 'AUD', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->pricing = $this->makeUser('pricing');
    }

    private function makeUser(string $designation, ?Agent $branch = null): User
    {
        $branch ??= $this->branch;

        $user = User::create([
            'name' => ucfirst($designation), 'email' => $designation . '-' . uniqid() . '@test.local',
            'password' => Hash::make('secret1234'),
            'company_name' => $branch->company_id, 'branch_name' => $branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
        Role::forceCreate(['email' => $user->email, 'role' => 'user']);

        return $user;
    }

    private function as(User $user): self
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json',
        ]);
    }

    private function url(string $path, string $host = 'focusair.f16sefreight.com'): string
    {
        return "http://{$host}/api{$path}";
    }

    private function makeJob(): int
    {
        $enquiry = $this->as($this->pricing)->postJson($this->url('/enquiries'), ['transport_mode' => 'air'])->json();

        return $this->postJson($this->url("/enquiries/{$enquiry['id']}/convert"))->json('job.id');
    }

    // ─── S1: is_active ───────────────────────────────────────────────────────

    public function test_a_deactivated_user_cannot_sign_in(): void
    {
        $this->postJson($this->url('/login'), ['email' => $this->pricing->email, 'password' => 'secret1234'])->assertOk();

        DB::table('users')->where('id', $this->pricing->id)->update(['is_active' => 0]);

        $this->postJson($this->url('/login'), ['email' => $this->pricing->email, 'password' => 'secret1234'])->assertStatus(401);
    }

    public function test_a_token_stops_working_when_the_account_is_deactivated(): void
    {
        $this->as($this->pricing)->getJson($this->url('/jobs'))->assertOk();

        DB::table('users')->where('id', $this->pricing->id)->update(['is_active' => 0]);
        auth()->forgetGuards();

        $this->getJson($this->url('/jobs'))->assertStatus(401);
    }

    // ─── S7: the platform host ───────────────────────────────────────────────

    public function test_a_tenant_token_is_refused_on_the_platform_host(): void
    {
        $this->as($this->pricing)->getJson($this->url('/jobs', 'superadmin.f16sefreight.com'))
            ->assertStatus(403)->assertJsonPath('reason', 'guard');
    }

    // ─── S6: job status ──────────────────────────────────────────────────────

    public function test_sales_cannot_move_a_shipment(): void
    {
        $jobId = $this->makeJob();

        $this->as($this->makeUser('sales'))->putJson($this->url("/jobs/{$jobId}/status"), ['status' => 'Verification'])
            ->assertStatus(403);
        $this->assertSame('Intake', DB::table('jobs')->where('id', $jobId)->value('status'));
    }

    public function test_pricing_cannot_move_a_colleagues_shipment(): void
    {
        $jobId = $this->makeJob();

        $this->as($this->makeUser('pricing'))->putJson($this->url("/jobs/{$jobId}/status"), ['status' => 'Verification'])
            ->assertStatus(404);
    }

    public function test_a_cancelled_shipment_cannot_be_moved_back(): void
    {
        $jobId = $this->makeJob();
        $this->postJson($this->url("/jobs/{$jobId}/cancel"), ['cancellation_reason' => 'client_cancelled'])->assertOk();

        $this->putJson($this->url("/jobs/{$jobId}/status"), ['status' => 'Intake'])
            ->assertStatus(422)->assertJsonPath('reason', 'cancelled');
        $this->assertSame('Cancelled', DB::table('jobs')->where('id', $jobId)->value('status'));
    }

    // ─── S2 / S3: master waybills ────────────────────────────────────────────

    public function test_another_forwarders_master_waybill_is_not_readable_by_number(): void
    {
        $otherCompany = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'command']);
        $otherBranch = Agent::create(['company_id' => $otherCompany->id, 'agent_name' => 'Delhi', 'branch_code' => 'DEL']);

        DB::table('air_way_bills')->insert(['id' => 17655443322, 'awb_code' => '176', 'awb_no' => '55443322',
            'agent_id' => $otherBranch->id, 'departure_airport' => 'DEL', 'destination_airport' => 'DXB']);

        $this->as($this->pricing)->getJson($this->url('/user/load-awb?awb_code=176&awb_no=55443322'))
            ->assertOk()->assertJsonPath('success', false);
        $this->getJson($this->url('/user/fetch-airwaybill-data'))->assertOk()->assertJsonCount(0);

        // Its own branch still reads it.
        $this->as($this->makeUser('pricing', $otherBranch))->getJson($this->url('/user/load-awb?awb_code=176&awb_no=55443322'))
            ->assertOk()->assertJsonPath('success', true);
    }
}
