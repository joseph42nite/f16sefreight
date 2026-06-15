<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\MailboxConnection;
use App\InboundEmail;
use App\InboundAttachment;
use App\EmailThread;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MailboxPollingTest extends TestCase
{
    use DatabaseTransactions;

    protected $agent;
    protected $company;
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
        config(['jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long']);

        // Set service credentials config
        config([
            'services.google.client_id' => 'google-client-id',
            'services.google.client_secret' => 'google-client-secret',
            'services.microsoft.client_id' => 'microsoft-client-id',
            'services.microsoft.client_secret' => 'microsoft-client-secret',
        ]);

        $this->company = Company::create([
            'name' => 'Polling Test Company',
            'tier' => 'viper_tactical',
            'email_domain' => 'pollingtest.com',
        ]);

        $this->user = new User();
        $this->user->name = 'Polling Operator';
        $this->user->email = 'polling@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->save();

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Polling Test Agent';
        $this->agent->agent_address = '456 Polling Road';
        $this->agent->save();
    }

    public function testInactiveConnectionIsBypassed()
    {
        Http::fake();

        $conn = MailboxConnection::create([
            'user_id' => $this->user->id,
            'provider' => 'gmail',
            'email_address' => 'inactive@pollingtest.com',
            'access_token' => 'token',
            'refresh_token' => 'refresh',
            'expires_at' => now()->addHour(),
            'is_active' => false,
        ]);

        $this->artisan('mailboxes:poll')->assertExitCode(0);

        // Assert no HTTP requests were sent
        Http::assertNothingSent();
    }

    public function testExpiredTokenIsRefreshed()
    {
        $conn = MailboxConnection::create([
            'user_id' => $this->user->id,
            'provider' => 'gmail',
            'email_address' => 'expired@pollingtest.com',
            'access_token' => 'old_access_token',
            'refresh_token' => 'valid_refresh_token',
            'expires_at' => now()->subMinutes(10), // Expired
            'is_active' => true,
        ]);

        Http::fake([
            'https://oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'new_access_token',
                'expires_in' => 3600,
            ], 200),
            'https://gmail.googleapis.com/*' => Http::response([
                'messages' => []
            ], 200),
        ]);

        $this->artisan('mailboxes:poll')->assertExitCode(0);

        $conn->refresh();
        $this->assertEquals('new_access_token', $conn->access_token);
        $this->assertTrue($conn->expires_at->isFuture());

        Http::assertSent(function ($request) {
            return $request->url() === 'https://oauth2.googleapis.com/token' &&
                $request['refresh_token'] === 'valid_refresh_token';
        });
    }

    public function testGmailPollingImportsEmailsAndAttachments()
    {
        $conn = MailboxConnection::create([
            'user_id' => $this->user->id,
            'provider' => 'gmail',
            'email_address' => 'active@pollingtest.com',
            'access_token' => 'valid_token',
            'refresh_token' => 'refresh',
            'expires_at' => now()->addHour(),
            'is_active' => true,
        ]);

        Http::fake([
            'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is%3Aunread*' => Http::response([
                'messages' => [['id' => 'gmail_msg_101', 'threadId' => 'gmail_thread_202']]
            ], 200),
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/gmail_msg_101' => Http::response([
                'id' => 'gmail_msg_101',
                'threadId' => 'gmail_thread_202',
                'payload' => [
                    'headers' => [
                        ['name' => 'Subject', 'value' => 'New Air Freight Inquiry'],
                        ['name' => 'From', 'value' => 'Customer <shipper@gmail.com>'],
                        ['name' => 'To', 'value' => 'active@pollingtest.com'],
                        ['name' => 'Date', 'value' => 'Sun, 14 Jun 2026 12:00:00 +0000'],
                        ['name' => 'Message-ID', 'value' => 'gmail_msg_101@mail.com'],
                    ],
                    'mimeType' => 'multipart/mixed',
                    'parts' => [
                        [
                            'mimeType' => 'text/html',
                            'body' => ['data' => base64_encode('<h1>Here is the freight detail</h1>')]
                        ],
                        [
                            'filename' => 'invoice.pdf',
                            'mimeType' => 'application/pdf',
                            'body' => ['attachmentId' => 'att_file_999']
                        ]
                    ]
                ]
            ], 200),
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/gmail_msg_101/attachments/att_file_999' => Http::response([
                'data' => base64_encode('fake pdf binary data')
            ], 200)
        ]);

        $this->artisan('mailboxes:poll')->assertExitCode(0);

        // Assert email imported
        $this->assertDatabaseHas('inbound_emails', [
            'message_id' => 'gmail_msg_101',
            'subject' => 'New Air Freight Inquiry',
            'from' => 'shipper@gmail.com',
            'to' => 'active@pollingtest.com',
        ]);

        $email = InboundEmail::where('message_id', 'gmail_msg_101')->first();
        $this->assertStringContainsString('Here is the freight detail', $email->body_html);

        // Assert thread created
        $this->assertDatabaseHas('email_threads', [
            'thread_key' => $email->thread_key,
            'subject' => 'New Air Freight Inquiry',
        ]);

        // Assert attachment saved and indexed
        $this->assertDatabaseHas('inbound_attachments', [
            'inbound_email_id' => $email->id,
            'filename' => 'invoice.pdf',
            'mime_type' => 'application/pdf',
        ]);

        $attachment = InboundAttachment::where('inbound_email_id', $email->id)->first();
        Storage::disk('local')->assertExists($attachment->file_path);
        $this->assertEquals('fake pdf binary data', Storage::disk('local')->get($attachment->file_path));
    }

    public function testOutlookPollingImportsEmailsAndAttachments()
    {
        $conn = MailboxConnection::create([
            'user_id' => $this->user->id,
            'provider' => 'outlook',
            'email_address' => 'active@pollingtest.com',
            'access_token' => 'valid_token',
            'refresh_token' => 'refresh',
            'expires_at' => now()->addHour(),
            'is_active' => true,
        ]);

        Http::fake([
            'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages*' => Http::response([
                'value' => [
                    [
                        'id' => 'outlook_msg_202',
                        'conversationId' => 'outlook_thread_505',
                        'subject' => 'Outlook Cargo Rates',
                        'from' => [
                            'emailAddress' => ['address' => 'shipper2@outlook.com']
                        ],
                        'toRecipients' => [
                            ['emailAddress' => ['address' => 'active@pollingtest.com']]
                        ],
                        'receivedDateTime' => '2026-06-14T12:00:00Z',
                        'body' => [
                            'contentType' => 'html',
                            'content' => '<p>Outlook body rates</p>'
                        ],
                        'hasAttachments' => true
                    ]
                ]
            ], 200),
            'https://graph.microsoft.com/v1.0/me/messages/outlook_msg_202/attachments' => Http::response([
                'value' => [
                    [
                        'name' => 'packing_list.pdf',
                        'contentType' => 'application/pdf',
                        'contentBytes' => base64_encode('fake outlook attachment bytes')
                    ]
                ]
            ], 200)
        ]);

        $this->artisan('mailboxes:poll')->assertExitCode(0);

        // Assert email imported
        $this->assertDatabaseHas('inbound_emails', [
            'message_id' => 'outlook_msg_202',
            'subject' => 'Outlook Cargo Rates',
            'from' => 'shipper2@outlook.com',
        ]);

        $email = InboundEmail::where('message_id', 'outlook_msg_202')->first();
        $this->assertStringContainsString('Outlook body rates', $email->body_html);

        // Assert thread created
        $this->assertDatabaseHas('email_threads', [
            'thread_key' => $email->thread_key,
            'subject' => 'Outlook Cargo Rates',
        ]);

        // Assert attachment saved and indexed
        $this->assertDatabaseHas('inbound_attachments', [
            'inbound_email_id' => $email->id,
            'filename' => 'packing_list.pdf',
            'mime_type' => 'application/pdf',
        ]);

        $attachment = InboundAttachment::where('inbound_email_id', $email->id)->first();
        Storage::disk('local')->assertExists($attachment->file_path);
        $this->assertEquals('fake outlook attachment bytes', Storage::disk('local')->get($attachment->file_path));
    }
}
