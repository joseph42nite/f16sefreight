<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * An import is a job like an export (owner, 2026-10-06, GAPS #462): whoever makes the consol is recorded in their own
 * role's column, pricing takes an unowned import from the Enquiries board, and the assigned pricing person may name
 * its parties.
 */
class ImportAssignmentTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;
    private User $pricing;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Assign Co', 'code' => 'ASG', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);
        $this->ops = $this->user('operations');
        $this->pricing = $this->user('pricing');
        $this->client = Customer::create(['company_id' => $this->company->id, 'name' => 'Consignee Ltd', 'email_domain' => 'consignee-asg.test']);
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create(['name' => $designation . $suffix, 'email' => "{$designation}{$suffix}-asg@test.local",
            'password' => Hash::make('x'), 'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path, string $mode = 'air'): string
    {
        return 'http://' . ($mode === 'air' ? 'focusair' : 'focussea') . ".f16sefreight.com/api{$path}";
    }

    private function airConsol(): Job
    {
        $id = $this->as($this->ops)->postJson($this->url('/imports'))->assertCreated()->json('job.id');

        return Job::withoutTenantScope()->find($id);
    }

    public function test_the_operator_who_makes_an_air_import_consol_is_its_operator_not_its_pricing_owner(): void
    {
        $consol = $this->airConsol();

        $this->assertSame($this->ops->id, (int) $consol->ops_id);
        $this->assertNull($consol->pricing_id);
    }

    public function test_the_operator_who_makes_a_sea_import_master_is_its_operator(): void
    {
        $id = $this->as($this->ops)->postJson($this->url('/sea-shipments', 'sea'), ['direction' => 'import'])
            ->assertCreated()->json('job.id');

        $master = Job::withoutTenantScope()->find($id);
        $this->assertSame($this->ops->id, (int) $master->ops_id);
        $this->assertNull($master->pricing_id);
    }

    public function test_pricing_sees_an_unowned_import_on_the_enquiries_board_and_takes_it_with_its_houses(): void
    {
        $consol = $this->airConsol();
        $house = Job::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'direction' => 'import',
            'parent_job_id' => $consol->id, 'ops_id' => $this->ops->id, 'customer_id' => $this->client->id,
            'execution_job_no' => 'JOBA-ASGMAA-26-' . random_int(1000, 9999)]);

        $this->as($this->pricing)->getJson($this->url('/imports/to-take'))->assertOk()
            ->assertJsonPath('imports.0.id', $consol->id)
            ->assertJsonPath('imports.0.job_no', $consol->execution_job_no);

        $this->as($this->pricing)->postJson($this->url("/imports/{$consol->id}/take"))->assertOk();

        $this->assertSame($this->pricing->id, (int) $consol->fresh()->pricing_id);
        $this->assertSame($this->pricing->id, (int) $house->fresh()->pricing_id);
        $this->as($this->pricing)->getJson($this->url('/imports/to-take'))->assertOk()->assertJsonCount(0, 'imports');

        // A colleague a moment later does not take it from them.
        $this->as($this->user('pricing', '2'))->postJson($this->url("/imports/{$consol->id}/take"))
            ->assertStatus(409)->assertJsonPath('reason', 'already_taken');
        $this->assertSame($this->pricing->id, (int) $consol->fresh()->pricing_id);
    }

    public function test_operations_does_not_take_an_import_for_pricing(): void
    {
        $consol = $this->airConsol();

        $this->as($this->ops)->postJson($this->url("/imports/{$consol->id}/take"))->assertForbidden();
        $this->assertNull($consol->fresh()->pricing_id);
    }

    public function test_the_assigned_pricing_person_names_an_imports_parties_and_nobody_else_in_pricing_does(): void
    {
        $consol = $this->airConsol();
        $this->as($this->pricing)->postJson($this->url("/imports/{$consol->id}/take"))->assertOk();
        $party = ['role' => 'consignee', 'party_type' => 'customer', 'party_id' => $this->client->id];

        $this->as($this->pricing)->getJson($this->url("/jobs/{$consol->id}/entities"))->assertOk()->assertJsonPath('can_write', true);
        $this->as($this->pricing)->postJson($this->url("/jobs/{$consol->id}/entities"), $party)->assertCreated();

        $other = $this->user('pricing', '3');
        $this->as($other)->getJson($this->url("/jobs/{$consol->id}/entities"))->assertOk()->assertJsonPath('can_write', false);
        $this->as($other)->postJson($this->url("/jobs/{$consol->id}/entities"), ['role' => 'notify_party'] + $party)->assertForbidden();
    }
}
