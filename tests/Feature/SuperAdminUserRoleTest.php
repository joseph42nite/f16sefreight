<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** Super admin picks a person's role when adding or editing them (user, 2026-09-17). */
class SuperAdminUserRoleTest extends TestCase
{
    use DatabaseTransactions;

    public function test_a_new_user_gets_the_role_picked_and_it_can_be_changed(): void
    {
        $company = Company::create(['name' => 'Role Co', 'code' => 'RLE', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $staff = SuperAdmin::create(['name' => 'F16s', 'email' => 'staff-rle@f16s.test', 'password' => Hash::make('x')]);
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($staff), 'Accept' => 'application/json']);

        $form = ['name' => 'Rahul Iyer', 'email' => 'rahul-rle@test.local', 'password' => 'secret1', 'origin_airport_code' => 'BOM',
            'company_name' => $company->id, 'branch_name' => $branch->id, 'can_send' => 1];

        $this->postJson('http://superadmin.f16sefreight.com/api/superadmin/create-user', $form)->assertStatus(422)->assertJsonValidationErrors('designation');
        $this->postJson('http://superadmin.f16sefreight.com/api/superadmin/create-user', $form + ['designation' => 'superadmin'])->assertJsonValidationErrors('designation');

        $this->postJson('http://superadmin.f16sefreight.com/api/superadmin/create-user', $form + ['designation' => 'sales'])->assertOk();
        $user = User::where('email', 'rahul-rle@test.local')->first();
        $this->assertSame('sales', $user->designation);

        $this->putJson("http://superadmin.f16sefreight.com/api/superadmin/edit-user/{$user->id}", ['name' => 'Rahul Iyer', 'company_name' => (string) $company->id,
            'branch_name' => $branch->id, 'plan_expiry_date' => '2027-01-01', 'can_send' => 1, 'is_active' => 1, 'designation' => 'boss'])->assertOk();
        $this->assertSame('boss', $user->fresh()->designation);
    }
}
