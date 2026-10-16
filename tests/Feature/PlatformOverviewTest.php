<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\SuperAdmin;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The platform Overview (owner, 2026-10-11: "graphs to keep a track … I don't have so many pages to open"): one read
 * for four graphs over the last 90 days — shipments per day by company, mail in and triaged, AI spend against the
 * month's budget, tickets opened and resolved per week — and the "needs you" list. F16s staff only.
 */
class PlatformOverviewTest extends TestCase
{
    use DatabaseTransactions;

    private function overview(): array
    {
        $admin = SuperAdmin::firstOrCreate(['email' => 'overview@f16s.test'], ['name' => 'Staff', 'password' => Hash::make('x')]);

        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('superAdmin-api')->login($admin), 'Accept' => 'application/json'])
            ->getJson('http://superadmin.localhost/api/superadmin/overview')->assertOk()->json();
    }

    public function test_shipments_are_counted_per_day_and_company(): void
    {
        $company = Company::create(['name' => 'Overview Freight', 'code' => 'OVF', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $day = now()->subDays(3)->toDateString();
        foreach (range(1, 2) as $i) {
            DB::table('jobs')->insert(['agent_id' => $branch->id, 'transport_mode' => 'air', 'status' => 'Intake', 'is_consolidation' => 1,
                'created_at' => $day . ' 10:00:00', 'updated_at' => now()]);
        }

        $series = collect($this->overview()['shipments']['series'])->firstWhere('name', 'Overview Freight');

        $this->assertNotNull($series);
        $this->assertSame(2, collect($series['data'])->firstWhere('x', $day)['y']);
        $this->assertCount(90, $this->overview()['shipments']['days']);
    }

    public function test_ai_spend_is_in_rupees_against_the_budget(): void
    {
        DB::table('llm_usage_logs')->insert(['model' => 'test', 'purpose' => 'text', 'cost_usd' => 1.5, 'tokens_in' => 1, 'tokens_out' => 1,
            'created_at' => now()->startOfDay()->addHour(), 'updated_at' => now()]);

        $ai = $this->overview()['ai'];
        $rate = (float) DB::table('ai_budget_settings')->value('usd_to_inr') ?: 88.0;

        $this->assertGreaterThanOrEqual(round(1.5 * $rate, 2), collect($ai['days'])->firstWhere('x', now()->toDateString())['y']);
        $this->assertArrayHasKey('budget_inr', $ai);
        $this->assertArrayHasKey('month_inr', $ai);
    }

    public function test_tickets_open_and_old_ones_are_on_the_needs_you_list(): void
    {
        $company = Company::create(['name' => 'Ticket Co', 'code' => 'TKC', 'tier' => 'core']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'T', 'email' => 'tk-overview@test.local', 'password' => Hash::make('x'), 'company_name' => $company->id,
            'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        DB::table('support_tickets')->insert(['agent_id' => $branch->id, 'user_id' => $user->id, 'route' => '/inbox',
            'description' => 'Cannot open the cost sheet', 'status' => 'open', 'created_at' => now()->subDays(5), 'updated_at' => now()->subDays(5)]);

        $data = $this->overview();
        $tickets = collect($data['needs_you'])->firstWhere('key', 'tickets');

        $this->assertNotNull($tickets);
        $this->assertGreaterThanOrEqual(1, $tickets['count']);
        $this->assertSame('/superadmin/support-desk', $tickets['to']);
        $this->assertArrayHasKey('weeks', $data['tickets']);
    }

    public function test_a_branch_that_cannot_number_its_work_is_flagged(): void
    {
        $company = Company::create(['name' => 'No Code Co', 'code' => 'NCC', 'tier' => 'core']);
        Agent::create(['company_id' => $company->id, 'agent_name' => 'Somewhere']);

        $flag = collect($this->overview()['needs_you'])->firstWhere('key', 'branches_without_code');

        $this->assertNotNull($flag);
        $this->assertGreaterThanOrEqual(1, $flag['count']);
    }
}
