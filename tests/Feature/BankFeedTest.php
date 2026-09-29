<?php

namespace Tests\Feature;

use App\Agent;
use App\BankAccount;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * The Setu bank feed (owner, 2026-09-29: "let's build the Setu connection"; GAPS #442). READ-ONLY: a consent the
 * account holder approves, then the statement read into `bank_transactions` through the importer a CSV uses.
 */
class BankFeedTest extends TestCase
{
    use DatabaseTransactions;

    private User $accounts;
    private BankAccount $account;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Feed Co', 'code' => 'FED', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'acc', 'email' => 'acc-fed@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->account = BankAccount::withoutGlobalScopes()->create(['agent_id' => $branch->id, 'name' => 'HDFC current',
            'bank_name' => 'HDFC', 'account_no' => '50200012344321', 'last_four' => '4321', 'account_code' => '1100-Bank-HDFC-4321',
            'currency' => 'INR', 'is_active' => true]);

        config(['setu.base_url' => 'https://fiu-sandbox.setu.test', 'setu.client_id' => 'cid', 'setu.client_secret' => 'secret',
            'setu.product_instance_id' => 'pid']);
    }

    private function as(User $user): self
    {
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);

        return $this;
    }

    private function url(string $path): string
    {
        return "http://accounts.f16sefreight.com/api{$path}";
    }

    /** What the faked Setu answers now — changed between reads by calling setu() again. */
    private array $answers = [];
    private bool $faked = false;

    /** Setu, faked: a consent in `$consent` state and a session holding `$accounts`. */
    private function setu(string $consent = 'ACTIVE', array $accounts = [], string $session = 'COMPLETED'): void
    {
        $this->answers = compact('consent', 'accounts', 'session');

        if ($this->faked) {
            return;   // the closure below reads the new answers
        }

        $this->faked = true;
        Http::fake(fn ($request) => match (true) {
            str_ends_with($request->url(), '/consents') => Http::response(['id' => 'cons-1', 'url' => 'https://setu.test/approve/cons-1', 'status' => 'PENDING'], 201),
            str_ends_with($request->url(), '/consents/cons-1') => Http::response(['id' => 'cons-1', 'status' => $this->answers['consent']]),
            str_ends_with($request->url(), '/sessions') => Http::response(['id' => 'sess-1', 'status' => 'PENDING'], 201),
            str_ends_with($request->url(), '/sessions/sess-1') => Http::response(['id' => 'sess-1', 'status' => $this->answers['session'],
                'fips' => [['fipID' => 'HDFC-FIP', 'accounts' => $this->answers['accounts']]]]),
            default => Http::response([], 404),
        });
    }

    private function shared(string $masked, array $transactions): array
    {
        return ['maskedAccNumber' => $masked, 'data' => ['account' => ['transactions' => ['transaction' => $transactions]]]];
    }

    public function test_accounts_ask_the_holder_to_share_the_account(): void
    {
        $this->setu();

        $this->as($this->accounts)->postJson($this->url("/bank-accounts/{$this->account->id}/feed"), ['mobile' => '9876543210'])
            ->assertOk()->assertJsonPath('approve_url', 'https://setu.test/approve/cons-1');

        $account = $this->account->fresh();
        $this->assertSame(['setu', 'cons-1', 'pending'], [$account->provider, $account->provider_ref, $account->feed_status]);
        Http::assertSent(fn ($r) => str_ends_with($r->url(), '/consents') && $r['vua'] === '9876543210'
            && $r->hasHeader('x-client-id', 'cid') && $r->hasHeader('x-product-instance-id', 'pid'));
    }

    public function test_nothing_is_asked_before_the_keys_are_set_and_only_accounts_connect(): void
    {
        Http::fake();
        config(['setu.client_secret' => null]);

        $this->as($this->accounts)->postJson($this->url("/bank-accounts/{$this->account->id}/feed"), ['mobile' => '9876543210'])
            ->assertStatus(422)->assertJsonPath('reason', 'setu_not_configured');

        $boss = User::create(['name' => 'b', 'email' => 'boss-fed@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->accounts->company_name, 'branch_name' => $this->accounts->branch_name, 'designation' => 'boss', 'is_active' => 1]);
        $this->as($boss)->postJson($this->url("/bank-accounts/{$this->account->id}/feed"), ['mobile' => '9876543210'])->assertForbidden();
        Http::assertNothingSent();
    }

    public function test_an_approved_consent_reads_this_accounts_statement_once(): void
    {
        $this->account->forceFill(['provider' => 'setu', 'provider_ref' => 'cons-1', 'feed_status' => 'pending'])->save();
        $this->setu('ACTIVE', [$this->shared('XXXXXXXXXX4321', [
            ['txnId' => 'T1', 'type' => 'CREDIT', 'amount' => '118000.00', 'valueDate' => '2026-09-28', 'narration' => 'NEFT-NORTHWIND', 'reference' => 'UTR123'],
            ['txnId' => 'T2', 'type' => 'DEBIT', 'amount' => '5000.00', 'valueDate' => '2026-09-28', 'narration' => 'CHQ 0042'],
        ])]);

        $this->as($this->accounts)->postJson($this->url("/bank-accounts/{$this->account->id}/feed/sync"))
            ->assertOk()->assertJsonPath('result.imported', 2);

        $lines = DB::table('bank_transactions')->where('bank_account_id', $this->account->id)->orderBy('reference')->get();
        $this->assertSame(['setu:T1', 'setu:T2'], $lines->pluck('reference')->all());
        $this->assertSame(['credit', 'debit'], $lines->pluck('direction')->all());
        $this->assertSame('setu', $lines[0]->provider);
        $this->assertSame('active', $this->account->fresh()->feed_status);
        $this->assertNotNull($this->account->fresh()->feed_fetched_through);

        // Read again: the same lines are refreshed, not counted twice.
        $this->as($this->accounts)->postJson($this->url("/bank-accounts/{$this->account->id}/feed/sync"))
            ->assertOk()->assertJsonPath('result.repeated', 2);
        $this->assertSame(2, DB::table('bank_transactions')->where('bank_account_id', $this->account->id)->count());
    }

    /** 🔴 A statement is read only into the account it belongs to. */
    public function test_another_account_shared_is_refused_with_the_reason(): void
    {
        $this->account->forceFill(['provider' => 'setu', 'provider_ref' => 'cons-1', 'feed_status' => 'active'])->save();
        $this->setu('ACTIVE', [$this->shared('XXXXXXXX9999', [['txnId' => 'T9', 'type' => 'CREDIT', 'amount' => '10', 'valueDate' => '2026-09-28']])]);

        $this->as($this->accounts)->postJson($this->url("/bank-accounts/{$this->account->id}/feed/sync"))->assertOk()
            ->assertJsonPath('result.status', 'error');

        $this->assertSame(0, DB::table('bank_transactions')->where('bank_account_id', $this->account->id)->count());
        $this->assertStringContainsString('…9999, not this account (…4321)', $this->account->fresh()->feed_error);
    }

    public function test_a_statement_not_ready_is_collected_on_the_next_read(): void
    {
        $this->account->forceFill(['provider' => 'setu', 'provider_ref' => 'cons-1', 'feed_status' => 'active'])->save();
        $this->setu('ACTIVE', [], 'PENDING');

        app(\App\Services\Bank\BankFeedService::class)->sync($this->account);
        $this->assertSame('sess-1', $this->account->fresh()->feed_session_id);

        $this->setu('ACTIVE', [$this->shared('XX4321', [['txnId' => 'T1', 'type' => 'CREDIT', 'amount' => '50', 'valueDate' => '2026-09-29']])]);
        $this->artisan('bank:sync-feeds')->assertSuccessful();

        $this->assertNull($this->account->fresh()->feed_session_id);
        $this->assertSame(1, DB::table('bank_transactions')->where('bank_account_id', $this->account->id)->count());
    }

    /** 🔐 The notice is unauthenticated, so its body is never believed: the account is read from Setu itself. */
    public function test_setus_notice_only_prompts_a_read(): void
    {
        $this->account->forceFill(['provider' => 'setu', 'provider_ref' => 'cons-1', 'feed_status' => 'pending'])->save();
        $this->setu('PENDING');

        $this->postJson('http://accounts.f16sefreight.com/api/bank-feed/setu', ['consentId' => 'cons-1', 'data' => ['status' => 'ACTIVE']])
            ->assertOk()->assertExactJson([]);
        $this->assertSame('pending', $this->account->fresh()->feed_status, 'Setu says pending, whatever the notice claimed');

        $this->postJson('http://accounts.f16sefreight.com/api/bank-feed/setu', ['consentId' => 'someone-elses'])->assertOk()->assertExactJson([]);
    }

    public function test_a_fed_account_takes_no_csv(): void
    {
        $this->account->forceFill(['provider' => 'setu', 'provider_ref' => 'cons-1', 'feed_status' => 'active'])->save();

        $this->as($this->accounts)->postJson($this->url('/reconciliation/import'), ['agent_id' => $this->account->agent_id,
            'bank_account_id' => $this->account->id, 'lines' => [['reference' => 'UTR123', 'amount' => 118000, 'value_date' => '2026-09-28']]])
            ->assertStatus(422)->assertJsonPath('reason', 'account_has_feed');
    }
}
