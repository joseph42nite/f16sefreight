<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Services\AiUsageService;
use App\Services\CompanyAiBudget;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * A company's AI budget, and the enquiries list for sales (user, 2026-09-15).
 *
 * Fixed at 15 September 2026, noon, with ₹100 to the US$, so the arithmetic in each comment is exact.
 */
class CompanyAiBudgetTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-09-15 12:00:00');
        $settings = app(AiUsageService::class)->settings();
        DB::table('ai_budget_settings')->where('id', $settings->id)->update(['usd_to_inr' => 100]);

        $this->company = Company::create(['name' => 'Budget Co', 'code' => 'BGT', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-bgt@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $designation, 'is_active' => 1,
        ]);
    }

    /** One logged AI call costing ₹$inr, at $when. */
    private function spend(float $inr, string $when, string $purpose = 'text'): void
    {
        DB::table('llm_usage_logs')->insert([
            'company_id' => $this->company->id, 'agent_id' => $this->branch->id, 'model' => 'gemma', 'purpose' => $purpose,
            'cost_usd' => $inr / 100, 'created_at' => $when, 'updated_at' => $when,
        ]);
    }

    private function budget(): CompanyAiBudget
    {
        return app(CompanyAiBudget::class);
    }

    public function test_the_limit_follows_the_plan_unless_superadmin_sets_one(): void
    {
        $this->assertSame(2000.0, $this->budget()->limitInr($this->company));

        $this->company->update(['ai_monthly_limit_inr' => 3000]);
        $this->assertSame(3000.0, $this->budget()->limitInr($this->company->fresh()));
    }

    /**
     * 🔴 Today's budget rolls: (limit − spent before today) ÷ days left, today included.
     * Limit ₹3,000 · ₹1,600 spent before the 15th · 16 days left → (3,000 − 1,600) ÷ 16 = ₹87.50.
     */
    public function test_todays_budget_is_what_is_left_of_the_month_shared_over_the_days_left(): void
    {
        $this->company->update(['ai_monthly_limit_inr' => 3000]);
        $this->spend(1600, '2026-09-10 10:00:00');
        $this->spend(20, '2026-09-15 09:00:00');

        $status = $this->budget()->status($this->company->fresh());

        $this->assertSame([3000.0, 1620.0, 20.0, 16, 87.5], [$status['limit'], $status['spent_month'], $status['spent_today'], $status['days_left'], $status['today_budget']]);
    }

    /**
     * 🔴 Extraction first. Today's budget ₹87.50: at ₹61.25 (70%) help and drafts stop but extraction goes on;
     * at ₹87.50 everything stops.
     */
    public function test_help_and_drafts_stop_at_70_percent_of_today_and_extraction_at_100(): void
    {
        $this->company->update(['ai_monthly_limit_inr' => 3000]);
        $this->spend(1600, '2026-09-10 10:00:00');
        $this->spend(61.25, '2026-09-15 09:00:00');
        $company = $this->company->fresh();

        $this->assertNull($this->budget()->refusal($company, 'text'));
        $this->assertNotNull($this->budget()->refusal($company, 'help'));
        $this->assertNotNull($this->budget()->refusal($company, 'sales_draft'));

        $this->spend(26.25, '2026-09-15 10:00:00');
        $this->assertStringContainsString('today', (string) $this->budget()->refusal($company, 'text'));
    }

    public function test_the_monthly_limit_and_a_plan_without_ai_stop_everything(): void
    {
        $this->spend(2000, '2026-09-02 10:00:00');
        $this->assertStringContainsString('this month', (string) $this->budget()->refusal($this->company, 'text'));

        $core = Company::create(['name' => 'Core Co', 'code' => 'COR', 'tier' => 'core']);
        $this->assertStringContainsString('not included', (string) $this->budget()->refusal($core, 'text'));

        // Superadmin's own help indexing has no company and is not limited here.
        $this->assertNull($this->budget()->refusal(null, 'help_index'));
    }

    public function test_help_is_paused_when_the_company_budget_says_so(): void
    {
        config(['services.openrouter.key' => 'test-key']);
        $this->spend(2000, '2026-09-02 10:00:00');
        $pricing = $this->user('pricing');

        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($pricing), 'Accept' => 'application/json'])
            ->postJson('http://focusair.localhost/api/help/ask', ['question' => 'Where do I enter an arrival notice?'])
            ->assertStatus(429)->assertJsonPath('reason', 'ai_budget');
    }

    public function test_superadmin_sets_and_clears_a_company_limit(): void
    {
        $staff = \App\SuperAdmin::create(['name' => 'Staff', 'email' => 'staff-bgt@test.local', 'password' => Hash::make('x')]);
        $put = fn ($value) => $this->actingAs($staff, 'superAdmin-api')
            ->putJson("/api/superadmin/ai-usage/companies/{$this->company->id}/limit", ['ai_monthly_limit_inr' => $value]);

        $row = collect($put(5000)->assertOk()->json('by_company'))->firstWhere('id', $this->company->id);
        $this->assertSame([5000, true], [$row['budget']['limit'], $row['budget']['overridden']]);

        $row = collect($put(null)->assertOk()->json('by_company'))->firstWhere('id', $this->company->id);
        $this->assertSame([2000, false], [$row['budget']['limit'], $row['budget']['overridden']]);
    }

    /** The Boss sees shares and counts of their own company's AI use; nobody else gets this view. */
    public function test_the_boss_sees_their_companys_ai_use(): void
    {
        $this->spend(500, '2026-09-05 10:00:00');
        $this->spend(10, '2026-09-15 09:00:00', 'help');
        $api = fn (User $u) => $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json'])
            ->getJson('http://admin.localhost/api/ai-usage/company');

        $body = $api($this->user('boss'))->assertOk()->json();

        // (500 + 10) ÷ 2,000 = 25.5% · today's budget (2,000 − 500) ÷ 16 = 93.75, 10 of it = 10.7%
        $this->assertSame([25.5, 10.7, 1, 1], [$body['used_month_percent'], $body['used_today_percent'], $body['month']['documents'], $body['month']['help']]);
        $this->assertArrayNotHasKey('spent_month', $body);
    }

    // ─── Enquiries ──────────────────────────────────────────────────────────

    /** 🔴 Sales read the branch's enquiries, 50 a page; a Tactical rep sees domains, not names; nobody sales converts. */
    public function test_sales_see_the_branch_enquiries_fifty_a_page(): void
    {
        $this->company->update(['tier' => 'tactical']);
        $customer = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);

        for ($i = 0; $i < 55; $i++) {
            Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'new',
                'customer_id' => $customer->id, 'enquiry_no' => 'ENQA-BGT-26-' . str_pad((string) $i, 4, '0', STR_PAD_LEFT)]);
        }

        $sales = $this->user('sales');
        $api = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($sales), 'Accept' => 'application/json']);

        $first = $api->getJson('http://focusair.localhost/api/enquiries')->assertOk()->json();
        $this->assertSame([50, 55, 2], [count($first['data']), $first['total'], $first['last_page']]);
        $this->assertSame('globex.test', $first['data'][0]['client_label']);

        $this->assertCount(5, $api->getJson('http://focusair.localhost/api/enquiries?page=2')->json('data'));
        $api->postJson('http://focusair.localhost/api/enquiries/' . $first['data'][0]['id'] . '/convert')->assertForbidden();
    }
}
