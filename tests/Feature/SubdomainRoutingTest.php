<?php

namespace Tests\Feature;

use App\User;
use App\Agent;
use App\Company;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SubdomainRoutingTest extends TestCase
{
    use DatabaseTransactions;

    protected Company $company;
    protected Agent $agent;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long',
        ]);

        $this->company = Company::create([
            'name' => 'Subdomain Test Company',
            'tier' => 'viper_command',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Subdomain Test Agent';
        $this->agent->agent_address = '1 Subdomain Road';
        $this->agent->save();

        $this->user = new User();
        $this->user->name = 'Subdomain Operator';
        $this->user->email = 'subdomain_ops@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->save();
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function testFocusAirSubdomainSetsAirScope()
    {
        // Set context to 'sea' initially to check if it changes
        session(['active_portal_scope' => 'sea']);

        $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('http://focusair.f16sefreight.com/api/user/get-notice');

        $this->assertEquals('air', session('active_portal_scope'));
    }

    /** @test */
    public function testFocusSeaSubdomainSetsSeaScope()
    {
        // Set context to 'air' initially
        session(['active_portal_scope' => 'air']);

        $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('http://focussea.f16sefreight.com/api/user/get-notice');

        $this->assertEquals('sea', session('active_portal_scope'));
    }
}
