<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** The client page (user, 2026-09-16): accounts figures only on Command; the name and details editable. */
class ClientDirectoryTest extends TestCase
{
    use DatabaseTransactions;

    private function tenant(string $tier): array
    {
        $company = Company::create(['name' => "Dir {$tier}", 'code' => strtoupper(substr($tier, 0, 3)) . 'D', 'tier' => $tier]);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $customer = Customer::create(['company_id' => $company->id, 'name' => 'globex.test', 'email_domain' => 'globex.test',
            'gst_no' => '27AAACG1234F1Z5', 'credit_limit' => 500000, 'payment_terms_days' => 30]);

        return [$company, $branch, $customer];
    }

    private function as(Company $company, Agent $branch, string $designation): self
    {
        $user = User::create(['name' => $designation, 'email' => "{$designation}-{$company->code}-dir@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => $designation, 'is_active' => 1]);
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);

        return $this;
    }

    public function test_tactical_shows_the_domain_and_name_but_no_accounts_figures(): void
    {
        [$company, $branch, $customer] = $this->tenant('tactical');

        $row = $this->as($company, $branch, 'pricing')->getJson('http://focusair.localhost/api/customers')
            ->assertOk()->assertJsonPath('with_accounts', false)->json('data.0');

        $this->assertSame('globex.test', $row['email_domain']);
        foreach (['gst_no', 'pan_no', 'credit_limit', 'payment_terms_days'] as $field) {
            $this->assertArrayNotHasKey($field, $row);
        }

        // The name is written in; an accounts figure sent anyway is not stored.
        $this->putJson("http://focusair.localhost/api/customers/{$customer->id}", ['name' => 'Globex Industries', 'email_domain' => 'globex.test', 'credit_limit' => 1])
            ->assertOk()->assertJsonPath('name', 'Globex Industries')->assertJsonMissingPath('credit_limit');
        $this->assertEquals(500000, $customer->fresh()->credit_limit);
    }

    public function test_command_shows_and_edits_the_accounts_figures(): void
    {
        [$company, $branch, $customer] = $this->tenant('command');

        $this->as($company, $branch, 'accounts')->getJson('http://accounts.localhost/api/customers')
            ->assertOk()->assertJsonPath('with_accounts', true)->assertJsonPath('data.0.gst_no', '27AAACG1234F1Z5');

        $this->putJson("http://accounts.localhost/api/customers/{$customer->id}", ['name' => 'Globex', 'credit_limit' => 750000])->assertOk();
        $this->assertEquals(750000, $customer->fresh()->credit_limit);
    }

    public function test_operations_cannot_add_or_edit_clients(): void
    {
        [$company, $branch, $customer] = $this->tenant('tactical');

        $this->as($company, $branch, 'operations')->putJson("http://focusair.localhost/api/customers/{$customer->id}", ['name' => 'x'])->assertForbidden();
    }
}
