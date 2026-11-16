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

    /** FS8: a token alone must not be enough to take the platform account over. */
    public function test_the_platform_password_changes_only_with_the_current_one(): void
    {
        $staff = \App\SuperAdmin::create(['name' => 'Staff', 'email' => 'staff-' . uniqid() . '@test.local', 'password' => Hash::make('old-pass-1')]);
        $this->actingAs($staff, 'superAdmin-api');
        $change = fn (array $form) => $this->putJson('/api/superadmin/update-password', $form);

        $change(['password' => 'new-pass-1', 'password_confirmation' => 'new-pass-1'])->assertStatus(422);
        $change(['current_password' => 'a-guess', 'password' => 'new-pass-1', 'password_confirmation' => 'new-pass-1'])
            ->assertStatus(422)->assertJsonValidationErrors('current_password');
        $change(['current_password' => 'old-pass-1', 'password' => 'four', 'password_confirmation' => 'four'])->assertStatus(422);
        $this->assertTrue(Hash::check('old-pass-1', $staff->fresh()->password));

        $change(['current_password' => 'old-pass-1', 'password' => 'new-pass-1', 'password_confirmation' => 'new-pass-1'])->assertOk();
        $this->assertTrue(Hash::check('new-pass-1', $staff->fresh()->password));
    }

    /** FS9: the page shell for a blog post carries the post's title and excerpt, so a draft has none. */
    public function test_a_draft_blog_post_is_not_printed_into_the_page_head(): void
    {
        $post = fn (string $slug, $publishedAt) => \App\Blog::forceCreate(['title' => 'Secret launch ' . $slug, 'slug' => $slug,
            'category' => 'News', 'read_time' => '1 min', 'image_path' => '/x.png', 'excerpt' => 'x', 'content' => 'x', 'published_at' => $publishedAt]);
        $post('fa-draft-post', null);
        $post('fa-live-post', now());

        $this->get('/blog/fa-live-post')->assertOk()->assertSee('Secret launch fa-live-post');
        $this->get('/blog/fa-draft-post')->assertOk()->assertDontSee('Secret launch fa-draft-post');
    }

    /** FA5: the editor sends an empty `takeaways` when none are left, and a draft stays a draft unless published. */
    public function test_a_blog_edit_can_clear_its_takeaways_and_keep_a_draft_a_draft(): void
    {
        $this->actingAs(\App\SuperAdmin::create(['name' => 'Editor', 'email' => 'editor-' . uniqid() . '@test.local',
            'password' => Hash::make('x')]), 'superAdmin-api');
        $blog = \App\Blog::forceCreate(['title' => 'Draft with points', 'slug' => 'fa-draft-points', 'category' => 'News',
            'read_time' => '1 min', 'image_path' => '/x.png', 'excerpt' => 'x', 'content' => 'x', 'takeaways' => ['one', 'two'],
            'published_at' => null]);
        $form = ['_method' => 'PUT', 'title' => 'Draft with points', 'category' => 'News', 'read_time' => '1 min',
            'excerpt' => 'x', 'content' => 'x'];

        $this->postJson("/api/superadmin/edit-blog/{$blog->id}", $form + ['is_draft' => '1', 'takeaways' => ''])->assertOk();

        $this->assertNull($blog->fresh()->published_at);
        $this->assertEmpty($blog->fresh()->takeaways);
    }

    /** FA4, FA9: the notice form and the directory, which has no pager, ask for every airline. */
    public function test_the_airline_list_can_be_asked_for_whole(): void
    {
        $this->actingAs(\App\SuperAdmin::create(['name' => 'Staff', 'email' => 'air-' . uniqid() . '@test.local',
            'password' => Hash::make('x')]), 'superAdmin-api');
        $before = \App\Airline::count();
        foreach (range(1, 105) as $n) {
            \App\Airline::forceCreate(['name' => "Audit Air {$n}", 'prefix' => (string) (800 + $n), 'code' => 'Z' . chr(64 + ($n % 26) + 1)]);
        }

        $this->assertCount(100, $this->getJson('/api/superadmin/airlines')->assertOk()->json('data'));
        $this->assertCount(min($before + 105, 500), $this->getJson('/api/superadmin/airlines?per_page=500')->assertOk()->json('data'));
    }

    /** FS6: the public page prints a blog body as HTML, so nothing that can run is ever stored. */
    public function test_a_blog_body_is_stored_without_anything_that_can_run(): void
    {
        $this->actingAs(\App\SuperAdmin::create(['name' => 'Editor', 'email' => 'fs6-' . uniqid() . '@test.local',
            'password' => Hash::make('x')]), 'superAdmin-api');
        $body = '<h3>Rates</h3><p class="ql-align-center">Up <strong>4%</strong> <span style="color: rgb(230, 0, 0); position: fixed;">now</span>'
            . '<script>alert(1)</script><img src="x" onerror="alert(2)"> <a href="javascript:alert(3)">bad</a>'
            . ' <a href="https://example.com" target="_blank" onclick="alert(4)">good</a></p><iframe src="https://evil.test"></iframe>';

        // Saved through the model, as the controller's create does (which also wants an image file).
        $id = \App\Blog::create(['title' => 'FS6 body', 'slug' => 'fs6-body-' . uniqid(), 'category' => 'News',
            'read_time' => '1 min', 'image_path' => '/x.png', 'excerpt' => 'x', 'content' => $body])->id;
        $stored = \App\Blog::find($id)->content;

        foreach (['<script', 'onerror', 'onclick', 'javascript:', '<iframe', 'position'] as $gone) {
            $this->assertStringNotContainsStringIgnoringCase($gone, $stored);
        }
        foreach (['<h3>Rates</h3>', 'class="ql-align-center"', '<strong>4%</strong>', 'href="https://example.com"', 'color:'] as $kept) {
            $this->assertStringContainsString($kept, $stored);
        }

        // And on an edit.
        $this->postJson("/api/superadmin/edit-blog/{$id}", ['_method' => 'PUT', 'title' => 'FS6 body edited', 'category' => 'News',
            'read_time' => '1 min', 'excerpt' => 'x', 'content' => '<p>ok</p><script>alert(5)</script>'])->assertOk();
        $this->assertSame('<p>ok</p>', \App\Blog::find($id)->content);
    }
}
