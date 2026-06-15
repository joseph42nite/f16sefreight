<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\EmailThread;
use App\InboundEmail;
use App\MailboxConnection;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Phase 2.5 — Quick Reply Feature Tests
 *
 * Verifies that POST /api/user/inbox/threads/{thread_key}/reply:
 *  - enforces authentication and tier middleware
 *  - validates the request body
 *  - sends via Gmail API and persists an outbound record
 *  - sends via Microsoft Graph API and persists an outbound record
 *  - surfaces provider API failures cleanly
 */
class QuickReplyTest extends TestCase
{
    use DatabaseTransactions;

    protected Company          $company;
    protected Agent            $agent;
    protected User             $user;
    protected MailboxConnection $connection;
    protected EmailThread      $thread;
    protected InboundEmail     $inboundEmail;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret'                    => 'some_random_secret_string_of_at_least_32_characters_long',
            'services.google.client_id'     => 'google-client-id',
            'services.google.client_secret' => 'google-client-secret',
            'services.microsoft.client_id'  => 'microsoft-client-id',
            'services.microsoft.client_secret' => 'microsoft-client-secret',
        ]);

        $this->company = Company::create([
            'name' => 'Reply Test Company',
            'tier' => 'viper_tactical',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id    = $this->company->id;
        $this->agent->agent_name    = 'Reply Test Agent';
        $this->agent->agent_address = '1 Reply Road';
        $this->agent->save();

        $this->user = new User();
        $this->user->name        = 'Reply Operator';
        $this->user->email       = 'reply_ops@replytest.com';
        $this->user->password    = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name  = $this->agent->id;
        $this->user->save();

        // Gmail mailbox connection (token valid for 1 hour)
        $this->connection = MailboxConnection::create([
            'user_id'       => $this->user->id,
            'provider'      => 'gmail',
            'email_address' => 'ops@replytest.com',
            'access_token'  => 'valid-gmail-token',
            'refresh_token' => 'gmail-refresh-token',
            'expires_at'    => now()->addHour(),
            'is_active'     => true,
        ]);

        // Email thread linked to the mailbox connection
        $this->thread = EmailThread::create([
            'agent_id'              => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'provider'              => 'gmail',
            'provider_thread_id'    => 'gmail-thread-123',
            'thread_key'            => md5('gmail_gmail-thread-123'),
            'subject'               => 'Quote Request — Singapore to London',
            'status'                => 'unread',
            'latest_message_received_at' => now()->subMinutes(5),
            'participant_emails'    => json_encode(['client@customer.com']),
        ]);

        // One inbound message in the thread
        $this->inboundEmail = InboundEmail::create([
            'agent_id'              => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id'            => 'msg-001@gmail.com',
            'thread_key'            => $this->thread->thread_key,
            'from'                  => 'client@customer.com',
            'to'                    => 'ops@replytest.com',
            'subject'               => 'Quote Request — Singapore to London',
            'body_text'             => 'Please send us a quote.',
            'received_at'           => now()->subMinutes(5),
        ]);
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    // -------------------------------------------------------------------------
    // Auth & Middleware
    // -------------------------------------------------------------------------

    /** @test */
    public function testUnauthenticatedCannotSendReply()
    {
        $response = $this->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/reply', [
            'body' => 'Hello from the test.',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function testReplyToNonExistentThreadReturns404()
    {
        Http::fake(); // No real calls expected

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/nonexistent_thread_key_xyz/reply', [
                'body' => 'Hello!',
            ]);

        $response->assertStatus(404);
    }

    /** @test */
    public function testEmptyBodyReturns422ValidationError()
    {
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/reply', [
                'body' => '',
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['body']);
    }

    /** @test */
    public function testMissingBodyReturns422ValidationError()
    {
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/reply', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['body']);
    }

    // -------------------------------------------------------------------------
    // Gmail Reply
    // -------------------------------------------------------------------------

    /** @test */
    public function testGmailReplySuccessfullyPersistsOutboundEmailAndUpdatesThread()
    {
        Http::fake([
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/send' => Http::response([
                'id'       => 'sent-msg-gmail-001',
                'threadId' => 'gmail-thread-123',
            ], 200),
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/reply', [
                'body' => 'Thank you for your enquiry. We will send the quote shortly.',
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);
        $response->assertJsonFragment(['message' => 'Reply sent successfully.']);

        // Outbound email should be in the response
        $emailData = $response->json('email');
        $this->assertEquals('ops@replytest.com', $emailData['from']);
        $this->assertEquals('client@customer.com', $emailData['to']);
        $this->assertStringContainsString('Re:', $emailData['subject']);

        // Outbound email should be persisted in the DB
        $this->assertDatabaseHas('inbound_emails', [
            'thread_key' => $this->thread->thread_key,
            'from'       => 'ops@replytest.com',
            'to'         => 'client@customer.com',
            'message_id' => 'sent-msg-gmail-001',
        ]);

        // Thread status should be updated to 'replied'
        $this->assertDatabaseHas('email_threads', [
            'id'     => $this->thread->id,
            'status' => 'replied',
        ]);

        // first_reply_at should be stamped
        $this->thread->refresh();
        $this->assertNotNull($this->thread->first_reply_at);
    }

    /** @test */
    public function testGmailReplyCallsApiWithCorrectThreadId()
    {
        Http::fake([
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/send' => Http::response([
                'id'       => 'sent-msg-gmail-002',
                'threadId' => 'gmail-thread-123',
            ], 200),
        ]);

        $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/reply', [
                'body' => 'Noted, we will follow up.',
            ]);

        Http::assertSent(function ($request) {
            $payload = $request->data();
            return str_contains($request->url(), 'gmail.googleapis.com')
                && isset($payload['raw'])
                && $payload['threadId'] === 'gmail-thread-123';
        });
    }

    // -------------------------------------------------------------------------
    // Outlook Reply
    // -------------------------------------------------------------------------

    /** @test */
    public function testOutlookReplySuccessfullyPersistsOutboundEmailAndUpdatesThread()
    {
        // Create an Outlook thread + connection
        $outlookConnection = MailboxConnection::create([
            'user_id'       => $this->user->id,
            'provider'      => 'outlook',
            'email_address' => 'ops-outlook@replytest.com',
            'access_token'  => 'valid-outlook-token',
            'refresh_token' => 'outlook-refresh-token',
            'expires_at'    => now()->addHour(),
            'is_active'     => true,
        ]);

        $outlookThread = EmailThread::create([
            'agent_id'              => $this->agent->id,
            'mailbox_connection_id' => $outlookConnection->id,
            'provider'              => 'outlook',
            'provider_thread_id'    => 'outlook-conv-456',
            'thread_key'            => md5('outlook_outlook-conv-456'),
            'subject'               => 'Freight Quote — Tokyo to LA',
            'status'                => 'unread',
            'latest_message_received_at' => now()->subMinutes(3),
            'participant_emails'    => json_encode(['buyer@client.com']),
        ]);

        $outlookEmail = InboundEmail::create([
            'agent_id'              => $this->agent->id,
            'mailbox_connection_id' => $outlookConnection->id,
            'message_id'            => 'graph-msg-id-AAA',
            'thread_key'            => $outlookThread->thread_key,
            'from'                  => 'buyer@client.com',
            'to'                    => 'ops-outlook@replytest.com',
            'subject'               => 'Freight Quote — Tokyo to LA',
            'body_text'             => 'Please quote Tokyo to LA.',
            'received_at'           => now()->subMinutes(3),
        ]);

        Http::fake([
            'https://graph.microsoft.com/v1.0/me/messages/graph-msg-id-AAA/reply' => Http::response(null, 202),
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $outlookThread->thread_key . '/reply', [
                'body' => 'We will have a quote ready within 2 hours.',
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        // Outbound email persisted
        $this->assertDatabaseHas('inbound_emails', [
            'thread_key' => $outlookThread->thread_key,
            'from'       => 'ops-outlook@replytest.com',
            'to'         => 'buyer@client.com',
        ]);

        // Thread status updated
        $this->assertDatabaseHas('email_threads', [
            'id'     => $outlookThread->id,
            'status' => 'replied',
        ]);
    }

    // -------------------------------------------------------------------------
    // API Failure
    // -------------------------------------------------------------------------

    /** @test */
    public function testGmailApiFailureReturns500WithErrorMessage()
    {
        Http::fake([
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/send' => Http::response([
                'error' => [
                    'code'    => 403,
                    'message' => 'Request had insufficient authentication scopes.',
                ],
            ], 403),
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/reply', [
                'body' => 'This should fail.',
            ]);

        $response->assertStatus(500);
        $response->assertJsonFragment(['error' => 'Failed to send reply: Gmail API failed (403): Request had insufficient authentication scopes.']);

        // No outbound email should be saved
        $this->assertDatabaseMissing('inbound_emails', [
            'thread_key' => $this->thread->thread_key,
            'from'       => 'ops@replytest.com',
        ]);
    }

    // -------------------------------------------------------------------------
    // Thread without mailbox connection
    // -------------------------------------------------------------------------

    /** @test */
    public function testReplyOnThreadWithoutMailboxConnectionReturns422()
    {
        // Thread with no mailbox connection
        $orphanThread = EmailThread::create([
            'agent_id'              => $this->agent->id,
            'mailbox_connection_id' => null,
            'thread_key'            => md5('orphan_thread_test'),
            'subject'               => 'Orphaned Thread',
            'status'                => 'unread',
            'latest_message_received_at' => now()->subMinutes(10),
            'participant_emails'    => json_encode([]),
        ]);

        // No InboundEmail needed — the controller checks mailboxConnection before lastEmail

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $orphanThread->thread_key . '/reply', [
                'body' => 'Hello!',
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment(['error' => 'No mailbox connection linked to this thread. Cannot send reply.']);
    }

    /** @test */
    public function testMismatchedCompanyOnMailboxConnectionIsBlockedByPolicy()
    {
        // Change the mailbox connection owner's company name to simulate cross-tenant leakage attempt
        $hackerCompany = Company::create([
            'name' => 'Hacker Company Ltd.',
            'tier' => 'viper_tactical',
        ]);
        
        $hackerUser = new User();
        $hackerUser->name = 'Hacker User';
        $hackerUser->email = 'hacker@hacker.com';
        $hackerUser->password = bcrypt('password');
        $hackerUser->company_name = $hackerCompany->name;
        $hackerUser->branch_name = $this->agent->id; // set same branch to bypass 404
        $hackerUser->save();

        $this->connection->user_id = $hackerUser->id;
        $this->connection->save();

        // Try to reply as $this->user (who is on 'Reply Test Company', while the connection is now owned by 'Hacker Company Ltd.')
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/reply', [
                'body' => 'Should fail due to policy block.',
            ]);

        $response->assertStatus(403);
    }
}
