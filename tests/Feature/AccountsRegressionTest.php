<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The money fixture, checked figure by figure, on every run (user, 2026-09-20).
 *
 * 🔴 This test does not restate the numbers — `accounts:verify` holds them, hand-computed from
 * `AccountsRegressionSeeder`, and there must be exactly ONE copy of an expected figure. What this adds is that
 * the check runs in CI rather than only when somebody remembers to type it.
 */
class AccountsRegressionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_every_figure_in_the_fixture_is_what_it_should_be(): void
    {
        // ⚠️ The leading backslash is load-bearing: `db:seed` prefixes an unnamespaced class with
        // `Database\Seeders\`, and this project's seeders live in the root namespace under `database/seeds`.
        $this->artisan('db:seed', ['--class' => '\AccountsRegressionSeeder', '--force' => true])->assertExitCode(0);

        // 81 figures across profitability, ageing, credit, Today, the ledger, the reports, the cross-checks and
        // cross-tenant isolation. A non-zero exit lists exactly which one moved.
        $this->artisan('accounts:verify')->assertExitCode(0);
    }

    /**
     * 🔒 The whole accounts section is Command-tier. A Tactical tenant's accounts login is refused at the gate,
     * not shown an empty screen — an empty register reads as "we have no invoices", which is a different and
     * much worse answer than "your plan does not include this".
     */
    public function test_a_tactical_tenant_cannot_reach_the_accounts_section_at_all(): void
    {
        $company = Company::create(['name' => 'Tactical Books', 'code' => 'TBK', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Kochi', 'branch_code' => 'COK']);
        $user = User::create(['name' => 'Accounts', 'email' => 'accounts-tbk@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'accounts', 'is_active' => 1]);

        $headers = ['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json'];

        foreach (['/accounts/today', '/billing', '/ageing', '/collections', '/journal',
                  '/profitability/jobs', '/receipts', '/invoices'] as $path) {
            $this->withHeaders($headers)
                ->getJson('http://accounts.localhost/api' . $path)
                ->assertForbidden();
        }
    }
}
