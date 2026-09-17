<?php

namespace Tests\Feature;

use App\Company;
use App\SuperAdmin;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** Super admin sets a company's plan and short code when adding or editing it (user, 2026-09-17). */
class SuperAdminCompanyPlanTest extends TestCase
{
    use DatabaseTransactions;

    public function test_the_plan_and_code_are_required_saved_and_editable(): void
    {
        $staff = SuperAdmin::create(['name' => 'F16s', 'email' => 'staff-cpl@f16s.test', 'password' => Hash::make('x')]);
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($staff), 'Accept' => 'application/json']);
        $url = 'http://superadmin.f16sefreight.com/api/superadmin';

        $this->postJson("{$url}/create-company", ['name' => 'Plan Co'])->assertStatus(422)->assertJsonStructure(['errors' => ['tier', 'code']]);
        $this->postJson("{$url}/create-company", ['name' => 'Plan Co', 'tier' => 'gold', 'code' => 'PL1'])->assertStatus(422)->assertJsonStructure(['errors' => ['tier', 'code']]);

        $id = $this->postJson("{$url}/create-company", ['name' => 'Plan Co', 'tier' => 'tactical', 'code' => 'plnc'])->assertOk()->json('company.id');
        $this->assertSame(['tactical', 'PLNC'], [Company::find($id)->tier, Company::find($id)->code]);

        // Another company cannot take the same code; the company itself can keep it on edit.
        $this->postJson("{$url}/create-company", ['name' => 'Copy Co', 'tier' => 'core', 'code' => 'PLNC'])->assertStatus(422)->assertJsonStructure(['errors' => ['code']]);
        $this->putJson("{$url}/edit-company/{$id}", ['name' => 'Plan Co', 'tier' => 'command', 'code' => 'PLNC'])->assertOk();
        $this->assertSame('command', Company::find($id)->tier);
    }
}
