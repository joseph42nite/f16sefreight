<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\MailboxConnection;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** A picture under the signature, sent inside the mail (user, 2026-09-17). */
class SignatureImageTest extends TestCase
{
    use DatabaseTransactions;

    public function test_an_image_is_added_in_settings_and_sent_inline_under_the_signature(): void
    {
        Storage::fake('local');
        $this->app->instance(\App\Services\VirusScanner::class, new class extends \App\Services\VirusScanner {
            public function __construct() {}
            public function scan(string $bytes): array { return ['clean' => true, 'signature' => null]; }
        });

        $company = Company::create(['name' => 'Sign Co', 'code' => 'SGN', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'Joseph', 'email' => 'joseph-sgn@test.local', 'password' => Hash::make('x'), 'company_name' => $company->id,
            'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $mailbox = MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $branch->id, 'user_id' => $user->id, 'email_address' => 'joseph-sgn@test.local',
            'provider' => 'outlook', 'access_token' => 't', 'refresh_token' => 'r', 'expires_at' => now()->addHour(), 'auth_state' => 'connected',
            'is_active' => 1, 'signature_html' => '<p>Joseph George</p>']);
        $api = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);

        // Only a picture, and not too big.
        $api->postJson("http://focusair.localhost/api/user/mailboxes/{$mailbox->id}/signature-image", ['image' => UploadedFile::fake()->create('notes.pdf', 10)])
            ->assertStatus(422);
        $api->postJson("http://focusair.localhost/api/user/mailboxes/{$mailbox->id}/signature-image", ['image' => UploadedFile::fake()->image('logo.png', 600, 200)->size(900)])
            ->assertStatus(422);

        $preview = $api->postJson("http://focusair.localhost/api/user/mailboxes/{$mailbox->id}/signature-image", ['image' => UploadedFile::fake()->image('logo.png', 600, 200)])
            ->assertOk()->json('signature_image');
        $this->assertStringStartsWith('data:image/png;base64,', $preview);
        $this->assertSame($preview, collect($api->getJson('http://focusair.localhost/api/user/mailboxes')->json('connections'))->firstWhere('id', $mailbox->id)['signature_image']);

        // A new mail carries it: attached inline with its content id, shown under the signature at most 240 px wide.
        config()->set('services.graph.client_id', 'test-client');
        Http::fake(['graph.microsoft.com/*' => Http::response(['id' => 'DRAFT1', 'uploadUrl' => 'x'], 201)]);
        $api->postJson('http://focusair.localhost/api/inbox/compose', ['to' => ['buyer@client.test'], 'subject' => 'Rates', 'body' => '<p>Our rates</p>'])->assertOk();

        Http::assertSent(fn ($r) => str_ends_with($r->url(), '/me/messages') && $r->method() === 'POST'
            && str_contains($r['body']['content'], '<p style="margin:0 0 10px;">Joseph George</p>')
            && str_contains($r['body']['content'], '<img src="cid:f16s-signature-image" alt="" width="240"'));
        Http::assertSent(fn ($r) => str_ends_with($r->url(), '/attachments') && ($r['isInline'] ?? false) === true
            && $r['contentId'] === 'f16s-signature-image' && $r['contentType'] === 'image/png');

        // Removed: gone from Settings and from the next mail.
        $api->deleteJson("http://focusair.localhost/api/user/mailboxes/{$mailbox->id}/signature-image")->assertOk();
        $this->assertNull($mailbox->fresh()->signature_image_path);
    }
}
