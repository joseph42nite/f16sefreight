<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\EmailMessage;
use App\EmailThread;
use App\MailboxConnection;
use App\Services\Mail\MailBody;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** Mail keeps its spacing, bold and colours — as received and as sent (user, 2026-09-17). */
class MailFormattingTest extends TestCase
{
    use DatabaseTransactions;

    public function test_a_received_mail_keeps_its_formatting_and_loses_anything_unsafe(): void
    {
        $html = app(MailBody::class)->forDisplay('<div style="color:rgb(192,0,0);font-size:12pt"><b>Urgent</b></div><div><br></div>'
            . '<table border="1"><tr><td style="padding:4px">BLR</td></tr></table><script>alert(1)</script><a href="javascript:x()" onclick="y()">x</a>');

        $this->assertStringContainsString('color:rgb(192,0,0)', $html);
        $this->assertStringContainsString('<b>Urgent</b>', $html);
        $this->assertStringContainsString('<div><br /></div>', $html);
        $this->assertStringContainsString('<td style="padding:4px;">BLR</td>', $html);
        $this->assertStringNotContainsString('script', $html);
        $this->assertStringNotContainsString('javascript', $html);
        $this->assertStringNotContainsString('onclick', $html);
    }

    public function test_a_blank_line_typed_when_sending_is_kept(): void
    {
        $this->assertStringContainsString('<p>Dear Sir,</p><p><br /></p><p>Please quote.</p>',
            app(MailBody::class)->clean('<p>Dear Sir,</p><p></p><p>Please quote.</p>'));
    }

    /** Fetched from Outlook the first time, kept with the message after; another branch cannot read it. */
    public function test_the_full_body_is_fetched_once_and_kept(): void
    {
        Storage::fake('local');
        $company = Company::create(['name' => 'Body Co', 'code' => 'BDY', 'tier' => 'tactical']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = User::create(['name' => 'P', 'email' => 'p-bdy@test.local', 'password' => Hash::make('x'), 'company_name' => $company->id,
            'branch_name' => $branch->id, 'designation' => 'pricing', 'is_active' => 1]);
        $mailbox = MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $branch->id, 'user_id' => $user->id, 'email_address' => 'p-bdy@test.local',
            'provider' => 'outlook', 'access_token' => 't', 'refresh_token' => 'r', 'expires_at' => now()->addHour(), 'auth_state' => 'connected', 'is_active' => 1]);
        EmailThread::withoutGlobalScopes()->insert(['agent_id' => $branch->id, 'thread_key' => 'bdy-1', 'classification' => 'customer_enquiry', 'status' => 'new',
            'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        $message = EmailMessage::withoutGlobalScopes()->create(['agent_id' => $branch->id, 'mailbox_connection_id' => $mailbox->id, 'thread_key' => 'bdy-1',
            'direction' => 'inbound', 'message_id' => '<bdy-1@t>', 'from' => 'a@client.test', 'to' => 'p-bdy@test.local',
            'subject' => 'Rates', 'body_snippet' => 'Rates please', 'received_at' => now()]);
        $message->forceFill(['provider_message_id' => 'AAMk1'])->save();

        Http::fake(['graph.microsoft.com/*' => Http::response(['body' => ['contentType' => 'html', 'content' => '<p><b style="color:red">Rates please</b></p>']])]);
        $api = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user), 'Accept' => 'application/json']);

        $api->getJson("http://focusair.localhost/api/inbox/messages/{$message->id}/body")->assertOk()
            ->assertJsonPath('full', true)->assertJsonPath('html', '<p><b style="color:#FF0000;">Rates please</b></p>');
        $api->getJson("http://focusair.localhost/api/inbox/messages/{$message->id}/body")->assertOk();
        Http::assertSentCount(1);
    }
}
