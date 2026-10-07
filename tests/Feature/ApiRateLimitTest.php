<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Normal clicking must never meet the rate limit (GAPS #466). Found as pricing: opening one conversation and its
 * workspace makes 18 API requests, the signed-in limit was 60 a minute, and "Use these figures" was refused with 429.
 */
class ApiRateLimitTest extends TestCase
{
    use DatabaseTransactions;

    public function test_a_signed_in_user_is_not_refused_at_sixty_one_requests_a_minute(): void
    {
        $company = Company::create(['name' => 'Rate Co', 'code' => 'RTE', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Rate Branch', 'branch_code' => 'RTE']);
        $user = User::create(['name' => 'Pricing', 'email' => 'pricing-rate@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $headers = ['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json'];

        for ($i = 1; $i <= 61; $i++) {
            $status = $this->withHeaders($headers)->getJson('http://focusair.f16sefreight.com/api/me')->status();
            $this->assertNotSame(429, $status, "request {$i} was refused as too many");
        }
    }
}
