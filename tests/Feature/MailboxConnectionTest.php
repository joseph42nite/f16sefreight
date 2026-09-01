<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\MailboxConnection;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Connecting a mailbox, and who the sweep will touch — guide §4.2.
 *
 * 🔴 **The two deactivation axes are the thing to get right here, and they look alike.**
 *   `is_active = false`  a SUPERADMIN tier downgrade — tokens KEPT, so an upgrade restores
 *                        sync with no re-authorisation.
 *   `disconnected_at`    THE USER removed their own mailbox — tokens CLEARED.
 * Collapse them into one column and a later billing change silently reconnects a mailbox
 * its owner deliberately removed: an action performed by nobody (PRD §3.3).
 */
class MailboxConnectionTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.graph.client_id', 'test-client');
        config()->set('services.graph.client_secret', 'test-secret');
        config()->set('services.graph.redirect', 'http://accounts.localhost/api/user/mailboxes/callback');

        $this->company = Company::create(['name' => 'Conn Co', 'code' => 'CNX', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->user = User::create([
            'name' => 'Ops', 'email' => 'ops-cnx@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);
    }

    private function api(?User $as = null): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as ?? $this->user),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api/user' . $path;
    }

    private function connection(array $overrides = [], ?Agent $branch = null): MailboxConnection
    {
        return MailboxConnection::withoutGlobalScopes()->create(array_merge([
            'agent_id' => ($branch ?? $this->branch)->id, 'user_id' => $this->user->id,
            'email_address' => 'box-' . uniqid('', true) . '@f16s.test', 'provider' => 'outlook',
            'access_token' => 'token', 'refresh_token' => 'refresh',
            'expires_at' => now()->addHour(), 'auth_state' => 'connected', 'is_active' => true,
        ], $overrides));
    }

    /**
     * Run the sweep with Graph faked to return nothing, and report which mailboxes it
     * touched.
     *
     * 🔴 **`Artisan::call()`, not `$this->artisan()->run()`.** The latter buffers output
     * inside its own expectation harness and `Artisan::output()` comes back EMPTY — which
     * made every `assertStringNotContainsString` below pass against an empty string. All
     * four skip conditions were being asserted vacuously, and only the positive control
     * (`test_a_connected_mailbox_is_swept`) revealed it. A test that reads nothing proves
     * nothing, and looks exactly like one that passed.
     */
    private function sweep(): string
    {
        Http::fake(fn () => Http::response(['value' => [], '@odata.deltaLink' => 'd'], 200));

        \Illuminate\Support\Facades\Artisan::call('mailboxes:poll');

        return \Illuminate\Support\Facades\Artisan::output();
    }

    // ─── The four skip conditions ────────────────────────────────────────────

    public function test_a_connected_mailbox_is_swept(): void
    {
        $c = $this->connection();

        $this->assertStringContainsString($c->email_address, $this->sweep());
    }

    /** A superadmin tier downgrade. Skipped — but the tokens stay. */
    public function test_an_inactive_mailbox_is_skipped_but_keeps_its_tokens(): void
    {
        $c = $this->connection(['is_active' => false]);

        $this->assertStringNotContainsString($c->email_address, $this->sweep());
        $this->assertNotNull($c->fresh()->refresh_token,
            'A tier downgrade must keep tokens so an upgrade restores sync silently.');
    }

    /** The user removed it themselves. */
    public function test_a_user_disconnected_mailbox_is_skipped(): void
    {
        $c = $this->connection(['disconnected_at' => now()]);

        $this->assertStringNotContainsString($c->email_address, $this->sweep());
    }

    /** A half-finished or expired consent has nothing to sync. */
    public function test_a_mailbox_awaiting_reauth_is_skipped(): void
    {
        $c = $this->connection(['auth_state' => 'reauth_required']);

        $this->assertStringNotContainsString($c->email_address, $this->sweep());
    }

    /** ⚠️ The inbox is not part of the Core plan, so its mailboxes are never polled. */
    public function test_a_core_tenant_mailbox_is_skipped(): void
    {
        $core = Company::create(['name' => 'Core Co', 'code' => 'CRX', 'tier' => 'core']);
        $branch = Agent::create(['company_id' => $core->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA']);

        $c = $this->connection([], $branch);

        $this->assertStringNotContainsString($c->email_address, $this->sweep());
    }

    // ─── Connect ─────────────────────────────────────────────────────────────

    public function test_connect_returns_a_microsoft_authorization_url(): void
    {
        $url = $this->api()->postJson($this->url('/mailboxes/connect'), ['provider' => 'outlook'])
            ->assertOk()->json('authorization_url');

        $this->assertStringContainsString('login.microsoftonline.com', $url);
        $this->assertStringContainsString('offline_access', urldecode($url));
        $this->assertStringContainsString('Mail.ReadWrite', urldecode($url));
    }

    /**
     * 🔒 `offline_access` is not optional. Without it Microsoft returns no refresh token
     * and every mailbox silently stops syncing about an hour after it is connected.
     */
    public function test_the_authorization_request_asks_for_offline_access(): void
    {
        $url = $this->api()->postJson($this->url('/mailboxes/connect'), ['provider' => 'outlook'])
            ->assertOk()->json('authorization_url');

        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        $this->assertStringContainsString('offline_access', $query['scope']);
    }

    /** Gmail is deferred with GAPS #15 and must be refused, not attempted. */
    public function test_gmail_cannot_be_connected_yet(): void
    {
        $this->api()->postJson($this->url('/mailboxes/connect'), ['provider' => 'gmail'])
            ->assertStatus(422);
    }

    // ─── Callback ────────────────────────────────────────────────────────────

    /**
     * 🔴 THE CALLBACK IS UNAUTHENTICATED, so `state` is the only thing establishing who
     * this is. An unknown state must be refused — otherwise anyone hitting the endpoint
     * could attach a mailbox they control to somebody else's tenant.
     */
    public function test_a_callback_with_an_unknown_state_is_refused(): void
    {
        $this->get('http://accounts.localhost/api/user/mailboxes/callback?code=abc&state=made-up')
            ->assertStatus(400);

        $this->assertSame(0, MailboxConnection::withoutGlobalScopes()
            ->where('agent_id', $this->branch->id)->count());
    }

    /** ⚠️ And the state is consumed on use, so a replayed callback cannot run twice. */
    public function test_a_state_cannot_be_replayed(): void
    {
        $state = $this->beginConnect();

        $this->fakeSuccessfulExchange('first@f16s.test');
        $this->get($this->callbackUrl($state))->assertOk();

        $this->get($this->callbackUrl($state))->assertStatus(400);

        $this->assertSame(1, MailboxConnection::withoutGlobalScopes()
            ->where('agent_id', $this->branch->id)->count());
    }

    public function test_a_successful_callback_stores_the_connection(): void
    {
        $state = $this->beginConnect();
        $this->fakeSuccessfulExchange('ops@f16s.test');

        $this->get($this->callbackUrl($state))->assertOk();

        $connection = MailboxConnection::withoutGlobalScopes()
            ->where('email_address', 'ops@f16s.test')->first();

        $this->assertNotNull($connection);
        $this->assertSame('connected', $connection->auth_state);
        $this->assertSame('outlook', $connection->provider);
        $this->assertNotNull($connection->refresh_token);
    }

    /**
     * 🔴 `email_address` is GLOBALLY unique. A mailbox already attached to another branch
     * must be refused with an explanation — two tenants syncing one mailbox would cross-file
     * a client's mail between companies.
     */
    public function test_a_mailbox_already_attached_elsewhere_is_refused(): void
    {
        $other = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'command']);
        $otherBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);

        $this->connection(['email_address' => 'shared@f16s.test'], $otherBranch);

        $state = $this->beginConnect();
        $this->fakeSuccessfulExchange('shared@f16s.test');

        $this->get($this->callbackUrl($state))->assertStatus(400);

        $this->assertSame((int) $otherBranch->id, (int) MailboxConnection::withoutGlobalScopes()
            ->where('email_address', 'shared@f16s.test')->value('agent_id'));
    }

    // ─── Disconnect ──────────────────────────────────────────────────────────

    /** 🔒 The user's own removal ERASES the credentials — unlike a tier downgrade. */
    public function test_disconnecting_erases_the_stored_credentials(): void
    {
        $c = $this->connection();

        $this->api()->postJson($this->url("/mailboxes/{$c->id}/disconnect"))->assertOk();

        $fresh = $c->fresh();

        $this->assertNull($fresh->access_token);
        $this->assertNull($fresh->refresh_token);
        $this->assertNull($fresh->sync_cursor);
        $this->assertNotNull($fresh->disconnected_at);
        $this->assertSame($this->user->id, (int) $fresh->disconnected_by);
    }

    /** Another tenant's mailbox is not disconnectable, and is reported as absent. */
    public function test_another_tenants_mailbox_cannot_be_disconnected(): void
    {
        $other = Company::create(['name' => 'Rival Co', 'code' => 'RVX', 'tier' => 'command']);
        $otherBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'CCU', 'branch_code' => 'CCU']);

        $c = $this->connection([], $otherBranch);

        $this->api()->postJson($this->url("/mailboxes/{$c->id}/disconnect"))->assertStatus(404);

        $this->assertNotNull($c->fresh()->refresh_token);
    }

    /** ⚠️ Tokens never leave the API, even to their owner. */
    public function test_the_listing_never_returns_tokens(): void
    {
        $this->connection();

        $body = $this->api()->getJson($this->url('/mailboxes'))->assertOk()->getContent();

        foreach (['access_token', 'refresh_token', 'sync_cursor'] as $secret) {
            $this->assertStringNotContainsString($secret, $body);
        }
    }

    // ─── helpers ─────────────────────────────────────────────────────────────

    private function beginConnect(): string
    {
        $url = $this->api()->postJson($this->url('/mailboxes/connect'), ['provider' => 'outlook'])
            ->assertOk()->json('authorization_url');

        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        return $query['state'];
    }

    private function callbackUrl(string $state): string
    {
        return 'http://accounts.localhost/api/user/mailboxes/callback?code=auth-code&state=' . $state;
    }

    private function fakeSuccessfulExchange(string $address): void
    {
        Http::fake(function ($request) use ($address) {
            if (str_contains($request->url(), 'login.microsoftonline.com')) {
                return Http::response([
                    'access_token' => 'a-token', 'refresh_token' => 'r-token', 'expires_in' => 3600,
                ], 200);
            }

            return Http::response(['mail' => $address, 'userPrincipalName' => $address], 200);
        });
    }
}
