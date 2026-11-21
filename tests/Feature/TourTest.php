<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The tour of the portal (owner, 2026-11-21): shown once, on a person's first sign-in, and remembered on the account
 * so it does not come back on another computer. The AI help it replaces is gone.
 */
class TourTest extends TestCase
{
    use DatabaseTransactions;

    private function person(string $email): User
    {
        $company = Company::firstOrCreate(['code' => 'TUR'], ['name' => 'Tour Co', 'tier' => 'command']);
        $branch = Agent::firstOrCreate(['company_id' => $company->id, 'branch_code' => 'BOM'], ['agent_name' => 'BOM']);

        return User::create([
            'name' => 'ops', 'email' => $email, 'password' => Hash::make('x'), 'company_name' => $company->id,
            'branch_name' => $branch->id, 'designation' => 'operations', 'is_active' => 1,
        ]);
    }

    private function as(User $user): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);
    }

    public function test_the_tour_is_owed_once_and_remembered_on_the_account(): void
    {
        $first = $this->person('tour-one@test.local');
        $second = $this->person('tour-two@test.local');

        $this->as($first)->getJson('http://focusair.localhost/api/tour')->assertOk()->assertExactJson(['seen' => false]);
        $this->as($first)->postJson('http://focusair.localhost/api/tour/seen')->assertOk()->assertExactJson(['seen' => true]);
        $this->as($first)->getJson('http://focusair.localhost/api/tour')->assertOk()->assertExactJson(['seen' => true]);

        // The first time is the one kept, and one person's tour is not another's.
        $at = $first->fresh()->tour_seen_at;
        $this->travel(2)->days();
        $this->as($first)->postJson('http://focusair.localhost/api/tour/seen')->assertOk();
        $this->assertEquals($at, $first->fresh()->tour_seen_at);
        $this->as($second)->getJson('http://focusair.localhost/api/tour')->assertOk()->assertExactJson(['seen' => false]);
    }

    public function test_nobody_signed_out_is_told_anything(): void
    {
        $this->getJson('http://focusair.localhost/api/tour')->assertStatus(401);
        $this->postJson('http://focusair.localhost/api/tour/seen')->assertStatus(401);
    }

    public function test_the_ai_help_is_gone(): void
    {
        $user = $this->person('tour-three@test.local');

        $this->as($user)->postJson('http://focusair.localhost/api/help/ask', ['question' => 'Where is it?'])->assertStatus(404);
        $staff = \App\SuperAdmin::firstOrCreate(['email' => 'tour-staff@f16s.test'], ['name' => 'Staff', 'password' => Hash::make('x')]);
        $this->actingAs($staff, 'superAdmin-api')->getJson('/api/superadmin/help-documents')->assertStatus(404);
    }
}
