<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** Settings → Finance (PRD §2.4), user 2026-09-18: the chart of accounts and the rate cards, per branch. */
class FinanceSettingsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $bom;
    private Agent $maa;
    private Company $company;
    private User $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Fin Co', 'code' => 'FIN', 'tier' => 'command']);
        $this->bom = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->maa = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-fin@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->bom->id, 'designation' => 'accounts', 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    public function test_accounts_are_named_and_renamed_per_branch_and_rate_cards_are_kept(): void
    {
        $api = $this->as($this->accounts);

        $api->postJson($this->url('/finance-settings/accounts'), ['agent_id' => $this->bom->id,
            'account_code' => '4000-Freight-Revenue', 'account_name' => 'Freight revenue'])->assertOk();
        $api->postJson($this->url('/finance-settings/accounts'), ['agent_id' => $this->maa->id,
            'account_code' => '4000-Freight-Revenue', 'account_name' => 'Freight revenue — Chennai'])->assertOk();

        // Both branches of the company; the same code on each is its own account.
        $all = $api->getJson($this->url('/finance-settings'))->assertOk()->json();
        $this->assertCount(2, $all['accounts']);
        $this->assertSame(['Chennai', 'Mumbai'], collect($all['branches'])->pluck('name')->all());

        // Renaming changes the words, never the code.
        $api->postJson($this->url('/finance-settings/accounts'), ['agent_id' => $this->bom->id,
            'account_code' => '4000-Freight-Revenue', 'account_name' => 'Air freight revenue'])->assertOk();
        $this->assertSame(2, DB::table('chart_of_accounts')->whereIn('agent_id', [$this->bom->id, $this->maa->id])->count());
        $this->assertSame('Air freight revenue', DB::table('chart_of_accounts')->where('agent_id', $this->bom->id)->value('account_name'));

        // One branch at a time.
        $justChennai = $api->getJson($this->url("/finance-settings?agent_id={$this->maa->id}"))->assertOk()->json();
        $this->assertSame(['Freight revenue — Chennai'], collect($justChennai['accounts'])->pluck('account_name')->all());

        // A rate card for one client, and it can be removed.
        $client = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $withRate = $api->postJson($this->url('/finance-settings/rate-cards'), ['agent_id' => $this->bom->id,
            'charge_type' => 'air_freight', 'party_type' => 'customer', 'party_id' => $client->id,
            'weight_break_from' => 0, 'weight_break_to' => 1000, 'rate' => 185, 'currency' => 'INR',
            'valid_from' => '2026-09-01', 'valid_to' => '2026-12-31'])->assertOk()->json();

        $this->assertSame(['Globex', '185.00'], [$withRate['rate_cards'][0]['party'], $withRate['rate_cards'][0]['rate']]);

        $after = $api->deleteJson($this->url("/finance-settings/rate-cards/{$withRate['rate_cards'][0]['id']}"))->assertOk()->json();
        $this->assertSame([], $after['rate_cards']);
    }

    /** 🔒 Pricing and operations have no finance settings at all, and another company's branch is not theirs. */
    public function test_only_accounts_and_the_boss_may_change_them(): void
    {
        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-fin@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->bom->id, 'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->postJson('http://focusair.localhost/api/finance-settings/accounts', ['agent_id' => $this->bom->id,
            'account_code' => '9999-Test', 'account_name' => 'Nope'])->assertForbidden();

        $elsewhere = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'command']);
        $theirs = Agent::create(['company_id' => $elsewhere->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);

        $this->as($this->accounts)->postJson($this->url('/finance-settings/accounts'), ['agent_id' => $theirs->id,
            'account_code' => '4000-Freight-Revenue', 'account_name' => 'Not mine'])->assertNotFound();
    }
}
