<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\MailboxConnection;
use App\InboundEmail;
use App\EmailThread;
use App\Services\EmailThreadingService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MailboxOAuthAndThreadingTest extends TestCase
{
    use DatabaseTransactions;

    protected $threadingService;
    protected $agent;
    protected $company;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Dynamically configure JWT secret for testing environment
        config(['jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long']);
        
        $this->threadingService = new EmailThreadingService();

        // Create a default company and agent to resolve foreign key constraints
        $this->company = Company::create([
            'name' => 'Default Testing Company',
            'tier' => 'viper_tactical',
            'email_domain' => 'testcompany.com',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Default Testing Agent';
        $this->agent->agent_address = '123 Testing St';
        $this->agent->save();
    }

    /**
     * Helper to authenticate user and get JWT token header.
     */
    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    public function testCoreTierMailboxConnectionBlocked()
    {
        $company = Company::create([
            'name' => 'Core Tier Shipping',
            'tier' => 'viper_core',
        ]);

        $user = new User();
        $user->name = 'Core Operator';
        $user->email = 'core@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->save();

        $response = $this->withHeaders($this->getAuthHeader($user))
            ->postJson('/api/user/mailbox-connections/connect', [
                'email_address' => 'operator@company.com',
                'provider' => 'gmail',
                'access_token' => 'fake_access_token',
                'refresh_token' => 'fake_refresh_token',
            ]);

        $response->assertStatus(403);
        $response->assertJsonFragment(['error' => 'Upgrade Required.']);
    }

    public function testTacticalTierMailboxConnectionBlocksPersonalDomains()
    {
        $company = Company::create([
            'name' => 'Tactical Cargo',
            'tier' => 'viper_tactical',
            'email_domain' => 'tacticalcargo.com',
        ]);

        $user = new User();
        $user->name = 'Tactical User';
        $user->email = 'tactical@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->save();

        $response = $this->withHeaders($this->getAuthHeader($user))
            ->postJson('/api/user/mailbox-connections/connect', [
                'email_address' => 'operator@gmail.com',
                'provider' => 'gmail',
                'access_token' => 'fake_access_token',
                'refresh_token' => 'fake_refresh_token',
            ]);

        $response->assertStatus(403);
        $response->assertJsonFragment(['error' => 'Personal/unauthorized email domains are not allowed.']);
    }

    public function testTacticalTierMailboxConnectionBlocksMismatchedDomain()
    {
        $company = Company::create([
            'name' => 'Tactical Cargo 2',
            'tier' => 'viper_tactical',
            'email_domain' => 'tacticalcargo.com',
        ]);

        $user = new User();
        $user->name = 'Tactical User 2';
        $user->email = 'tactical2@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->save();

        $response = $this->withHeaders($this->getAuthHeader($user))
            ->postJson('/api/user/mailbox-connections/connect', [
                'email_address' => 'operator@anothercompany.com',
                'provider' => 'gmail',
                'access_token' => 'fake_access_token',
                'refresh_token' => 'fake_refresh_token',
            ]);

        $response->assertStatus(403);
        $response->assertJsonFragment(['error' => 'Mailbox email domain does not match the company registered domain.']);
    }

    public function testTacticalTierMailboxConnectionSucceeds()
    {
        $company = Company::create([
            'name' => 'Tactical Cargo 3',
            'tier' => 'viper_tactical',
            'email_domain' => 'tacticalcargo.com',
        ]);

        $user = new User();
        $user->name = 'Tactical User 3';
        $user->email = 'tactical3@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->save();

        $response = $this->withHeaders($this->getAuthHeader($user))
            ->postJson('/api/user/mailbox-connections/connect', [
                'email_address' => 'operator@tacticalcargo.com',
                'provider' => 'gmail',
                'access_token' => 'fake_access_token',
                'refresh_token' => 'fake_refresh_token',
                'expires_in' => 3600,
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        $this->assertDatabaseHas('mailbox_connections', [
            'email_address' => 'operator@tacticalcargo.com',
            'provider' => 'gmail',
            'user_id' => $user->id,
        ]);
    }

    public function testThreadingByProviderThreadId()
    {
        $emailData1 = [
            'agent_id' => $this->agent->id,
            'provider' => 'gmail',
            'provider_thread_id' => 'thread12345',
            'subject' => 'Inquiry for shipping',
            'from' => 'client@sender.com',
            'to' => 'ops@company.com',
            'received_at' => now(),
        ];

        $key1 = $this->threadingService->determineThreadKey($emailData1);
        $this->assertNotEmpty($key1);

        $thread1 = $this->threadingService->getOrCreateThread($key1, $emailData1);
        $this->assertEquals($key1, $thread1->thread_key);

        $emailData2 = [
            'agent_id' => $this->agent->id,
            'provider' => 'gmail',
            'provider_thread_id' => 'thread12345',
            'subject' => 'Re: Inquiry for shipping',
            'from' => 'ops@company.com',
            'to' => 'client@sender.com',
            'received_at' => now()->addMinutes(5),
        ];

        $key2 = $this->threadingService->determineThreadKey($emailData2);
        $this->assertEquals($key1, $key2);

        $thread2 = $this->threadingService->getOrCreateThread($key2, $emailData2);
        $this->assertEquals($thread1->id, $thread2->id);
    }

    public function testThreadingByInReplyTo()
    {
        $company = Company::create([
            'name' => 'Threading Company',
            'tier' => 'viper_tactical',
        ]);

        $user = new User();
        $user->name = 'Threading Operator';
        $user->email = 'threading@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->save();

        $conn = MailboxConnection::create([
            'user_id' => $user->id,
            'provider' => 'gmail',
            'email_address' => 'ops@threadingcompany.com',
            'access_token' => 'token',
            'refresh_token' => 'refresh',
            'is_active' => true,
        ]);

        // Create parent email
        $parent = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $conn->id,
            'message_id' => 'parent-msg-id@mail.com',
            'thread_key' => 'parentthreadkey123',
            'from' => 'sender@client.com',
            'to' => 'ops@threadingcompany.com',
            'received_at' => now(),
        ]);

        $childEmailData = [
            'agent_id' => $this->agent->id,
            'in_reply_to' => 'parent-msg-id@mail.com',
            'subject' => 'Re: Cargo shipment',
            'from' => 'ops@threadingcompany.com',
            'to' => 'sender@client.com',
            'received_at' => now()->addMinutes(10),
        ];

        $key = $this->threadingService->determineThreadKey($childEmailData);
        $this->assertEquals('parentthreadkey123', $key);
    }

    public function testThreadingByReferences()
    {
        $company = Company::create([
            'name' => 'Threading Company 2',
            'tier' => 'viper_tactical',
        ]);

        $user = new User();
        $user->name = 'Threading Operator 2';
        $user->email = 'threading2@test.com';
        $user->password = bcrypt('password');
        $user->company_name = $company->name;
        $user->save();

        $conn = MailboxConnection::create([
            'user_id' => $user->id,
            'provider' => 'gmail',
            'email_address' => 'ops2@threadingcompany.com',
            'access_token' => 'token',
            'refresh_token' => 'refresh',
            'is_active' => true,
        ]);

        $parent = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $conn->id,
            'message_id' => 'msg-ref-1@mail.com',
            'thread_key' => 'refthreadkey999',
            'from' => 'sender@client.com',
            'to' => 'ops2@threadingcompany.com',
            'received_at' => now(),
        ]);

        $childEmailData = [
            'agent_id' => $this->agent->id,
            'references' => 'random-id@mail.com msg-ref-1@mail.com another-id@mail.com',
            'subject' => 'Fwd: Cargo shipment',
            'from' => 'ops2@threadingcompany.com',
            'to' => 'sender@client.com',
            'received_at' => now()->addMinutes(10),
        ];

        $key = $this->threadingService->determineThreadKey($childEmailData);
        $this->assertEquals('refthreadkey999', $key);
    }

    public function testThreadingBySubject()
    {
        $emailData1 = [
            'agent_id' => $this->agent->id,
            'subject' => 'Urgent Rates Request Chennai to JFK',
            'from' => 'shipper@client.com',
            'to' => 'ops@company.com',
            'received_at' => now(),
        ];

        $key1 = $this->threadingService->determineThreadKey($emailData1);
        $thread1 = $this->threadingService->getOrCreateThread($key1, $emailData1);

        $emailData2 = [
            'agent_id' => $this->agent->id,
            'subject' => 'Re: Urgent Rates Request Chennai to JFK',
            'from' => 'ops@company.com',
            'to' => 'shipper@client.com',
            'received_at' => now()->addMinutes(15),
        ];

        $key2 = $this->threadingService->determineThreadKey($emailData2);
        $this->assertEquals($key1, $key2);
    }
}
