<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Making a client and its branches from the platform portal (owner, 2026-10-11: "see the client making process and the
 * branch making process is sorted out"). Found clicking it: a branch made there had no branch code, so it could not
 * number a single enquiry or job; no GSTIN; IATA codes demanded of a sea-only branch; `company_id max:100` refused the
 * 101st company; and a person could be put in one company's branch while filed under another company.
 */
class TenantSetupTest extends TestCase
{
    use DatabaseTransactions;

    private function staff(): self
    {
        $admin = SuperAdmin::firstOrCreate(['email' => 'tenant-setup@f16s.test'], ['name' => 'Staff', 'password' => Hash::make('x')]);

        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($admin), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://superadmin.localhost/api/superadmin' . $path;
    }

    private function branch(array $overrides = []): array
    {
        return $overrides + ['agent_name' => 'Kochi', 'agent_address' => 'Willingdon Island, Cochin Port', 'agent_pincode' => '682003',
            'agent_city' => 'Kochi', 'branch_code' => 'COK', 'gst_no' => '32AABCK1234E1Z2'];
    }

    public function test_a_branch_made_here_can_number_its_work_and_carries_its_gstin(): void
    {
        $company = Company::create(['name' => 'Kerala Freight', 'code' => 'KRL', 'tier' => 'tactical']);

        // A sea-only branch: no IATA agent code or CASS, and no air waybill signing details.
        $id = $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => $company->id]))
            ->assertOk()->json('agent.id');

        $this->assertDatabaseHas('agents_info', ['id' => $id, 'branch_code' => 'COK', 'gst_no' => '32AABCK1234E1Z2']);
        $this->assertSame('KRLCOK', app(\App\Services\EnquirySequenceService::class)->agentCode($id));
    }

    public function test_the_branch_code_is_required_and_one_per_company_and_the_gstin_well_formed(): void
    {
        $company = Company::create(['name' => 'Kerala Freight', 'code' => 'KRL', 'tier' => 'tactical']);
        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => $company->id]))->assertOk();

        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => $company->id, 'branch_code' => '']))
            ->assertStatus(422)->assertJsonValidationErrors('branch_code');
        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => $company->id, 'agent_name' => 'Kochi 2']))
            ->assertStatus(422)->assertJsonValidationErrors('branch_code');
        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => $company->id, 'branch_code' => 'TVM', 'gst_no' => 'NOT-A-GSTIN']))
            ->assertStatus(422)->assertJsonValidationErrors('gst_no');
        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => $company->id, 'branch_code' => 'TVM', 'iata_agent_code' => '12']))
            ->assertStatus(422)->assertJsonValidationErrors('iata_agent_code');

        // The same code in another company is that company's own.
        $other = Company::create(['name' => 'Coast Cargo', 'code' => 'CST', 'tier' => 'core']);
        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => $other->id]))->assertOk();
    }

    public function test_any_existing_company_may_have_branches_however_many_there_are(): void
    {
        $company = Company::create(['name' => 'Big Number Co', 'code' => 'BIGN', 'tier' => 'core']);
        DB::table('companies')->where('id', $company->id)->update(['id' => 5000]);

        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => 5000]))->assertOk();
        $this->staff()->postJson($this->url('/create-branch'), $this->branch(['company_id' => 999999, 'branch_code' => 'XX']))
            ->assertStatus(422)->assertJsonValidationErrors('company_id');
    }

    public function test_a_person_belongs_to_their_branchs_company(): void
    {
        $mine = Company::create(['name' => 'Kerala Freight', 'code' => 'KRL', 'tier' => 'tactical']);
        $other = Company::create(['name' => 'Coast Cargo', 'code' => 'CST', 'tier' => 'core']);
        $branch = Agent::create(['company_id' => $mine->id, 'agent_name' => 'Kochi', 'branch_code' => 'COK']);

        $this->staff()->postJson($this->url('/create-user'), ['name' => 'Anu', 'email' => 'anu-tenant@test.local', 'password' => 'secret1',
            'designation' => 'pricing', 'branch_name' => $branch->id, 'company_name' => $other->id, 'origin_airport_code' => 'COK', 'can_send' => 1])
            ->assertOk();

        $this->assertSame((string) $mine->id, (string) User::where('email', 'anu-tenant@test.local')->value('company_name'));
    }

    public function test_the_tenants_page_shows_each_company_with_its_branches_and_people(): void
    {
        $company = Company::create(['name' => 'Kerala Freight', 'code' => 'KRL', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Kochi', 'branch_code' => 'COK', 'gst_no' => '32AABCK1234E1Z2']);
        User::create(['name' => 'Anu', 'email' => 'anu2-tenant@test.local', 'password' => Hash::make('x'), 'company_name' => $company->id,
            'branch_name' => $branch->id, 'designation' => 'boss', 'is_active' => 1]);

        $row = collect($this->staff()->getJson($this->url('/tenants'))->assertOk()->json('companies'))->firstWhere('id', $company->id);
        $this->assertSame(['Kerala Freight', 'KRL', 'tactical', 1, 1], [$row['name'], $row['code'], $row['tier'], $row['branches'], $row['people']]);

        $one = $this->staff()->getJson($this->url("/tenants/{$company->id}"))->assertOk()->json();
        $this->assertSame(['COK', '32AABCK1234E1Z2', 1], [$one['branches'][0]['branch_code'], $one['branches'][0]['gst_no'], $one['branches'][0]['people']]);
        $this->assertSame(['Anu', 'boss', 'Kochi'], [$one['people'][0]['name'], $one['people'][0]['designation'], $one['people'][0]['branch']]);
        $this->assertArrayNotHasKey('password', $one['people'][0]);
    }
}
