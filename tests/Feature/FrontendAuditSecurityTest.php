<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Mail\ResetPasswordMailable;
use App\Role;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/** 🔒 The four server-side findings of the 2026-11-15 frontend audit (FS1–FS4). */
class FrontendAuditSecurityTest extends TestCase
{
    use DatabaseTransactions;

    private function person(array $extra = []): User
    {
        $company = Company::create(['name' => 'Audit Co ' . uniqid(), 'code' => 'AUD', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'Aud', 'email' => 'aud-' . uniqid() . '@test.local', 'password' => Hash::make('secret1234'),
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $user->forceFill($extra)->save();
        Role::forceCreate(['email' => $user->email, 'role' => 'user']);

        return $user;
    }

    public function test_the_sign_in_token_is_never_sent_back_with_a_user(): void
    {
        $user = $this->person();
        $token = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'secret1234'])->assertOk()->json('token');

        $this->assertNotNull($user->fresh()->latest_token);
        $this->assertArrayNotHasKey('latest_token', $user->fresh()->toArray());

        $this->app['auth']->forgetGuards();
        $verified = $this->withHeaders(['Authorization' => "Bearer {$token}"])->postJson('/api/user/verify', ['token' => $token])->assertOk();
        $this->assertStringNotContainsString('latest_token', $verified->getContent());
    }

    public function test_the_reset_mail_links_to_this_app(): void
    {
        config(['app.url' => 'https://app.example.test/']);

        $html = (new ResetPasswordMailable('tok123', 'a+b@test.local', 'users'))->render();

        $this->assertStringContainsString('https://app.example.test/PasswordForgotForm/tok123/a%2Bb%40test.local/users', $html);
        $this->assertStringNotContainsStringIgnoringCase('facheck', $html);
    }

    public function test_a_person_barred_from_sending_cannot_transmit_to_the_airline(): void
    {
        Http::fake();
        $this->actingAs($this->person(['can_send' => 0]), 'user-api');
        $refused = 'You are not allowed to send to the airline';

        foreach ([
            ['postJson', '/api/user/create-focusair'],
            ['putJson', '/api/user/update-airway-bill/99911112222'],
            ['postJson', '/api/user/create-houseway-bill'],
            ['putJson', '/api/user/update-houseway-bill/99911112222'],
        ] as [$verb, $url]) {
            $reply = $this->{$verb}($url, ['status' => 'send'])->assertStatus(403);
            $this->assertStringContainsString($refused, $reply->getContent(), $url);

            // A draft is not a send: whatever else it is refused for, it is not this.
            $this->assertStringNotContainsString($refused, $this->{$verb}($url, ['status' => 'draft'])->getContent(), $url);
        }

        $this->getJson('/api/user/manifest-send/99911112222')->assertStatus(403);
        Http::assertNothingSent();
    }

    public function test_a_person_allowed_to_send_is_not_stopped_by_the_check(): void
    {
        Http::fake();
        $this->actingAs($this->person(['can_send' => 1]), 'user-api');

        $reply = $this->putJson('/api/user/update-airway-bill/99911112222', ['status' => 'send']);

        $this->assertStringNotContainsString('You are not allowed to send', $reply->getContent());
    }

    /** A right password at a portal the account may not use is refused, and the session already open stays open. */
    public function test_a_refused_portal_sign_in_does_not_end_the_session_already_open(): void
    {
        $user = $this->person();
        $token = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'secret1234'])->assertOk()->json('token');

        $this->travel(2)->seconds();
        $this->app['auth']->forgetGuards();
        // The host as a full URL: a Host header does not reach `getHost()` in the test client (see TierModeGatingTest).
        $this->postJson('http://superadmin.f16s.test/api/login', ['email' => $user->email, 'password' => 'secret1234'])->assertStatus(403);

        $this->assertSame($token, $user->fresh()->latest_token);
    }
}
