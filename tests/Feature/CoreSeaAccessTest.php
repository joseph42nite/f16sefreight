<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * What each plan gets on FocusSea (owner, 2026-09-29): "FocusSea is the same as FocusAir. Core only gets the
 * documentation, the consol part and search — not the inbox, Kanban and everything. Tactical gets the inbox and
 * everything, but only Command gets accounts and the job cost sheet."
 *
 * Core has one login type (its designation is inert), so every Core user works the bills; manifest filing and
 * import stay Tactical, and the cost sheet stays Command.
 */
class CoreSeaAccessTest extends TestCase
{
    use DatabaseTransactions;

    private function user(string $tier, string $designation, string $code): User
    {
        $company = Company::create(['name' => "Plan {$code}", 'code' => $code, 'tier' => $tier]);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => "Plan {$code} Mumbai", 'branch_code' => 'BOM']);

        return User::create(['name' => $designation, 'email' => strtolower($code) . "-{$designation}@test.local",
            'password' => Hash::make('x'), 'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => $designation, 'is_active' => 1]);
    }

    private function as(User $user): self
    {
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);

        return $this;
    }

    private function url(string $path): string
    {
        return "http://focussea.f16sefreight.com/api{$path}";
    }

    public function test_core_works_the_bills_the_consol_and_the_search(): void
    {
        // A Core login whose designation says pricing — inert on Core, so it must not matter.
        $core = $this->user('core', 'pricing', 'CSA');

        $master = $this->as($core)->postJson($this->url('/sea-shipments'), ['cargo_type' => 'fcl'])->assertCreated()->json('job');
        $this->as($core)->getJson($this->url('/sea-shipments?q=JOBS'))->assertOk();
        $this->as($core)->postJson($this->url("/jobs/{$master['id']}/sea-shipment"), ['vessel_name' => 'MSC ANNA'])->assertOk();
        $this->as($core)->get($this->url("/jobs/{$master['id']}/bl.pdf"))->assertOk();
        $this->as($core)->getJson($this->url("/jobs/{$master['id']}/entities"))->assertOk();

        // A house is made inside the master — Core has no enquiries to confirm one from.
        $house = $this->as($core)->postJson($this->url("/sea-shipments/{$master['id']}/houses"), ['hbl_number' => 'HBLCORE1'])
            ->assertCreated()->json('job');
        $this->assertSame($master['id'], Job::withoutTenantScope()->find($house['id'])->parent_job_id);
        $this->as($core)->getJson($this->url("/jobs/{$master['id']}/consol"))->assertOk()->assertJsonCount(1, 'houses');
    }

    public function test_core_does_not_get_filing_import_or_the_cost_sheet(): void
    {
        $core = $this->user('core', 'operations', 'CSB');

        $this->as($core)->getJson($this->url('/manifest-filings'))->assertForbidden();
        $this->as($core)->getJson($this->url('/imports'))->assertForbidden();
        $master = $this->as($core)->postJson($this->url('/sea-shipments'), [])->assertCreated()->json('job');
        $this->as($core)->getJson($this->url("/jobs/{$master['id']}/cost-sheet"))->assertForbidden();
    }

    /** On Tactical the roles apply again: pricing reads the bill, only operations writes it. */
    public function test_tactical_keeps_its_roles(): void
    {
        $ops = $this->user('tactical', 'operations', 'CSC');
        $master = $this->as($ops)->postJson($this->url('/sea-shipments'), [])->assertCreated()->json('job');

        $pricing = User::create(['name' => 'p', 'email' => 'csc-pricing@test.local', 'password' => Hash::make('x'),
            'company_name' => $ops->company_name, 'branch_name' => $ops->branch_name, 'designation' => 'pricing', 'is_active' => 1]);
        $this->as($pricing)->getJson($this->url("/jobs/{$master['id']}/sea-shipment"))->assertOk();
        $this->as($pricing)->postJson($this->url("/jobs/{$master['id']}/sea-shipment"), ['vessel_name' => 'X'])->assertForbidden();
        $this->as($pricing)->postJson($this->url("/sea-shipments/{$master['id']}/houses"), [])->assertForbidden();
    }
}
