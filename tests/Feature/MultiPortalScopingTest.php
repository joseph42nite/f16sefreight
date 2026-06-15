<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\Port;
use App\Job;
use App\PdfProcessingJob;
use App\AccountsInvoice;
use App\AccountsPurchaseVoucher;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MultiPortalScopingTest extends TestCase
{
    use DatabaseTransactions;

    protected Company $company;
    protected Agent $agent;
    protected User $user;
    protected Port $port;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long',
        ]);

        $this->company = Company::create([
            'name' => 'Scoping Test Company',
            'tier' => 'viper_command',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Scoping Test Agent';
        $this->agent->agent_address = '1 Scoping Road';
        $this->agent->save();

        $this->port = Port::firstOrCreate(
            ['locode' => 'INMAA'],
            [
                'port_name' => 'Chennai Seaport',
                'country_code' => 'IN',
                'port_type' => 'sea',
                'is_active' => true
            ]
        );

        $this->user = new User();
        $this->user->name = 'Scoping Operator';
        $this->user->email = 'scope_ops@scopingtest.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->default_port_id = $this->port->id;
        $this->user->save();
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function testGetCompaniesPublicReturnsCompanies()
    {
        $response = $this->getJson('/api/companies');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $this->company->id,
            'name' => $this->company->name,
        ]);
    }

    /** @test */
    public function testSetSessionContextBindsContextToSession()
    {
        $response = $this->postJson('/api/set-session-context', [
            'company_id' => $this->company->id,
            'active_portal_scope' => 'sea'
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'status' => true,
            'company_id' => $this->company->id,
            'active_portal_scope' => 'sea'
        ]);

        $this->assertEquals('sea', session('active_portal_scope'));
        $this->assertEquals($this->company->id, session('company_id'));
    }

    /** @test */
    public function testGlobalQueryScopeAndAutoPopulation()
    {
        // 1. Set session context to 'sea'
        session(['active_portal_scope' => 'sea', 'company_id' => $this->company->id]);

        // 2. Create sea and air records directly (bypassing scope for raw creation if needed,
        // but since creating observer uses session, they should align automatically).
        $seaJob = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQS-26-9099',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake'
        ]);

        $this->assertEquals('sea', $seaJob->transport_mode);

        // 3. Switch session context to 'air'
        session(['active_portal_scope' => 'air']);

        $airJob = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQA-26-9099',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake'
        ]);

        $this->assertEquals('air', $airJob->transport_mode);

        // 4. Test global scope filtering
        // Active scope is 'air', so we should only find the air job
        $jobs = Job::where('agent_id', $this->agent->id)->get();
        $this->assertTrue($jobs->contains('id', $airJob->id));
        $this->assertFalse($jobs->contains('id', $seaJob->id));

        // Switch back to 'sea'
        session(['active_portal_scope' => 'sea']);
        $jobs = Job::where('agent_id', $this->agent->id)->get();
        $this->assertTrue($jobs->contains('id', $seaJob->id));
        $this->assertFalse($jobs->contains('id', $airJob->id));
    }

    /** @test */
    public function testUserUpdateValidesAndSavesPortAndPimaAddress()
    {
        // We log in as superadmin
        $role = new \App\Role();
        $role->email = 'admin@f16s.com';
        $role->role = 'superAdmin';
        $role->save();

        $adminUser = new User();
        $adminUser->name = 'Super Admin';
        $adminUser->email = 'admin@f16s.com';
        $adminUser->password = bcrypt('password');
        $adminUser->company_name = 'F16S Core';
        $adminUser->branch_name = $this->agent->id;
        $adminUser->save();

        $token = auth('superAdmin-api')->login($adminUser);
        $headers = ['Authorization' => 'Bearer ' . $token];

        // Let's create a new port to assign
        $newPort = Port::firstOrCreate(
            ['locode' => 'AEDXB'],
            [
                'port_name' => 'Dubai Airport',
                'country_code' => 'AE',
                'port_type' => 'air',
                'is_active' => true
            ]
        );

        $response = $this->withHeaders($headers)
            ->putJson('/api/superadmin/edit-user/' . $this->user->id, [
                'name' => 'Updated Operator',
                'company_name' => $this->company->name,
                'plan_expiry_date' => now()->addYear()->toDateString(),
                'can_send' => 1,
                'is_active' => 1,
                'default_port_id' => $newPort->id,
                'pima_address' => 'DXBF16S'
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        $this->user->refresh();
        $this->assertEquals('Updated Operator', $this->user->name);
        $this->assertEquals($newPort->id, $this->user->default_port_id);
        $this->assertEquals('DXBF16S', $this->user->pima_address);
    }

    /** @test */
    public function testLinkHblToMblSuccessfullyAssociatesChildJob()
    {
        session(['active_portal_scope' => 'sea', 'company_id' => $this->company->id]);

        $masterJob = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQS-26-8001',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'is_consolidation' => true,
            'status' => 'Intake'
        ]);

        $childJob = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQS-26-8002',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'is_sub_shipment' => true,
            'status' => 'Intake'
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $masterJob->id . '/link-hbl', [
                'child_job_id' => $childJob->id
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        $childJob->refresh();
        $this->assertEquals($masterJob->id, $childJob->parent_job_id);
        $this->assertTrue($childJob->is_sub_shipment);
    }
}
