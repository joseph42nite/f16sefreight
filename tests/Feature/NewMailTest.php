<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\MailboxConnection;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/** + New mail in the inbox (user, 2026-09-17): sent from the person's own Outlook, as a new conversation. */
class NewMailTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.graph.client_id', 'test-client');
        $company = Company::create(['name' => 'New Mail Co', 'code' => 'NWM', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->user = User::create(['name' => 'Priya Nair', 'email' => 'priya-nwm@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->user), 'Accept' => 'application/json']);
    }

    private function mail(): array
    {
        return ['to' => ['buyer@client.test'], 'cc' => ['ops@client.test'], 'subject' => 'Rates for October', 'body' => '<p>Please find our rates.</p>'];
    }

    public function test_without_their_own_outlook_it_says_to_connect_it(): void
    {
        $this->postJson('http://focusair.localhost/api/inbox/compose', $this->mail())
            ->assertStatus(422)->assertJsonPath('reason', 'no_mailbox');
    }

    public function test_it_goes_from_their_own_outlook_as_a_new_mail(): void
    {
        MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'user_id' => $this->user->id,
            'email_address' => 'priya-nwm@test.local', 'provider' => 'outlook', 'access_token' => 't', 'refresh_token' => 'r',
            'expires_at' => now()->addHour(), 'auth_state' => 'connected', 'is_active' => true, 'backfill_status' => 'completed']);
        Http::fake(['graph.microsoft.com/*' => Http::response('', 202)]);

        $this->postJson('http://focusair.localhost/api/inbox/compose', $this->mail())
            ->assertOk()->assertJsonPath('from', 'priya-nwm@test.local');

        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/me/sendMail')
            && $request['message']['subject'] === 'Rates for October'
            && $request['message']['toRecipients'][0]['emailAddress']['address'] === 'buyer@client.test'
            && $request['message']['ccRecipients'][0]['emailAddress']['address'] === 'ops@client.test');
    }
}
