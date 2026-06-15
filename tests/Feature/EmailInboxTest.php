<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\EmailThread;
use App\InboundEmail;
use App\InboundAttachment;
use App\Job;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class EmailInboxTest extends TestCase
{
    use DatabaseTransactions;

    protected $agent;
    protected $company;
    protected $user;
    protected $operator;
    protected $connection;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long']);

        $this->company = Company::create([
            'name' => 'Inbox Test Company',
            'tier' => 'viper_tactical',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Inbox Test Agent';
        $this->agent->agent_address = '123 Test St';
        $this->agent->save();

        $this->user = new User();
        $this->user->name = 'Inbox Operator';
        $this->user->email = 'inbox_ops@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->save();

        $this->operator = new User();
        $this->operator->name = 'Secondary Operator';
        $this->operator->email = 'operator2@test.com';
        $this->operator->password = bcrypt('password');
        $this->operator->company_name = $this->company->name;
        $this->operator->branch_name = $this->agent->id;
        $this->operator->save();

        $this->connection = \App\MailboxConnection::create([
            'user_id' => $this->user->id,
            'provider' => 'gmail',
            'email_address' => 'ops@inboxtest.com',
            'access_token' => 'access',
            'refresh_token' => 'refresh',
            'expires_at' => now()->addHour(),
            'is_active' => true,
        ]);
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    public function testUnauthenticatedUsersBlocked()
    {
        $response = $this->getJson('/api/user/inbox/folders');
        $response->assertStatus(401);
    }

    public function testCoreTierBlockedFromInboxAPIs()
    {
        $coreCompany = Company::create([
            'name' => 'Core Company',
            'tier' => 'viper_core',
        ]);

        $coreUser = new User();
        $coreUser->name = 'Core Operator';
        $coreUser->email = 'core_ops@test.com';
        $coreUser->password = bcrypt('password');
        $coreUser->company_name = $coreCompany->name;
        $coreUser->branch_name = $this->agent->id;
        $coreUser->save();

        $response = $this->withHeaders($this->getAuthHeader($coreUser))
            ->getJson('/api/user/inbox/folders');

        $response->assertStatus(403);
        $response->assertJsonFragment(['error' => 'Upgrade Required.']);
    }

    public function testGetFoldersCountsCorrectly()
    {
        // 1. Thread: unread (inbox/unassigned)
        EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'thread_unread',
            'subject' => 'Unread thread',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'unread',
        ]);

        // 2. Thread: read, assigned to user
        EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'thread_assigned',
            'subject' => 'Assigned thread',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'read',
            'assigned_operator_id' => $this->user->id,
        ]);

        // 3. Thread: active job (processing)
        $job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-0001',
            'status' => 'AI Extraction',
        ]);
        EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'thread_processing',
            'subject' => 'Processing thread',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'read',
            'job_id' => $job->id,
        ]);

        // 4. Thread: replied (awaiting client)
        EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'thread_replied',
            'subject' => 'Replied thread',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'replied',
        ]);

        // 5. Thread: completed job
        $completedJob = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-0002',
            'status' => 'Completed',
        ]);
        EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'thread_completed',
            'subject' => 'Completed thread',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'read',
            'job_id' => $completedJob->id,
        ]);

        // 6. Thread: archived (excluded)
        EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'thread_archived',
            'subject' => 'Archived thread',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'archived',
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/inbox/folders');

        $response->assertStatus(200);
        $response->assertJson([
            'inbox' => 5, // All except archived (unread, assigned, processing, replied, completed)
            'assigned' => 1, // thread_assigned
            'unassigned' => 4, // unread, processing, replied, completed
            'processing' => 1, // thread_processing
            'awaiting_client' => 1, // thread_replied
            'completed' => 1, // thread_completed
        ]);
    }

    public function testGetThreadsWithFiltersAndSla()
    {
        // Thread 1: Unread, received 5 mins ago (normal SLA)
        $t1 = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 't1',
            'subject' => 'Subject 1',
            'latest_message_received_at' => now()->subMinutes(5),
            'participant_emails' => ['client1@test.com'],
            'status' => 'unread',
        ]);
        InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'm1',
            'thread_key' => 't1',
            'from' => 'client1@test.com',
            'to' => 'ops@inboxtest.com',
            'subject' => 'Subject 1',
            'body_text' => 'Hello Chennai',
            'received_at' => now()->subMinutes(5),
        ]);

        // Thread 2: Unread, received 12 mins ago (warning SLA)
        $t2 = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 't2',
            'subject' => 'Subject 2',
            'latest_message_received_at' => now()->subMinutes(12),
            'participant_emails' => ['client2@test.com'],
            'status' => 'unread',
        ]);
        InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'm2',
            'thread_key' => 't2',
            'from' => 'client2@test.com',
            'to' => 'ops@inboxtest.com',
            'subject' => 'Subject 2',
            'body_text' => 'Need rate quote',
            'received_at' => now()->subMinutes(12),
        ]);

        // Thread 3: Unread, received 20 mins ago (breached SLA)
        $t3 = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 't3',
            'subject' => 'Subject 3',
            'latest_message_received_at' => now()->subMinutes(20),
            'participant_emails' => ['client3@test.com'],
            'status' => 'unread',
        ]);
        InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'm3',
            'thread_key' => 't3',
            'from' => 'client3@test.com',
            'to' => 'ops@inboxtest.com',
            'subject' => 'Subject 3',
            'body_text' => 'Overdue email',
            'received_at' => now()->subMinutes(20),
        ]);

        // Request inbox threads list
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/inbox/threads?folder=inbox');

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(3, $data);

        // Check descending sorting by latest_message_received_at
        $this->assertEquals('t1', $data[0]['thread_key']);
        $this->assertEquals('t2', $data[1]['thread_key']);
        $this->assertEquals('t3', $data[2]['thread_key']);

        // Check SLA categories
        $this->assertEquals('normal', $data[0]['sla_status']);
        $this->assertEquals('warning', $data[1]['sla_status']);
        $this->assertEquals('breached', $data[2]['sla_status']);

        // Snippet checks
        $this->assertEquals('Hello Chennai', $data[0]['snippet']);
        $this->assertEquals('client1@test.com', $data[0]['sender']);
    }

    public function testGetThreadDetailsUpdatesUnreadToRead()
    {
        $thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'detail_thread_key',
            'subject' => 'Details check',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'unread',
        ]);

        $email = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'msg_details',
            'thread_key' => 'detail_thread_key',
            'from' => 'client@test.com',
            'to' => 'ops@inboxtest.com',
            'subject' => 'Details check',
            'body_text' => 'Body details',
            'received_at' => now(),
        ]);

        $attachment = InboundAttachment::create([
            'inbound_email_id' => $email->id,
            'filename' => 'packing_list.pdf',
            'file_path' => 'attachments/packing_list.pdf',
            'mime_type' => 'application/pdf',
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/inbox/threads/' . $thread->thread_key);

        $response->assertStatus(200);
        
        $thread->refresh();
        $this->assertEquals('read', $thread->status);

        $data = $response->json();
        $this->assertEquals('detail_thread_key', $data['thread']['thread_key']);
        $this->assertCount(1, $data['emails']);
        $this->assertEquals('Body details', $data['emails'][0]['body_text']);
        $this->assertCount(1, $data['emails'][0]['attachments']);
        $this->assertEquals('packing_list.pdf', $data['emails'][0]['attachments'][0]['filename']);
    }

    public function testAssignOperatorUpdatesThreadAndJob()
    {
        $job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-1234',
            'status' => 'Intake',
        ]);

        $thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'assign_thread_key',
            'subject' => 'Assign me',
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@test.com'],
            'status' => 'unread',
            'job_id' => $job->id,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/inbox/threads/' . $thread->thread_key . '/assign', [
                'assigned_operator_id' => $this->operator->id,
            ]);

        $response->assertStatus(200);

        $thread->refresh();
        $this->assertEquals($this->operator->id, $thread->assigned_operator_id);

        $job->refresh();
        $this->assertEquals($this->operator->id, $job->operator_id);
    }

    public function testGetOperatorsReturnsBranchOperators()
    {
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/inbox/operators');

        $response->assertStatus(200);
        $data = $response->json();
        
        // Assert we get the list of branch users (user and operator are in the same branch)
        $this->assertCount(2, $data);
        $emails = array_column($data, 'email');
        $this->assertContains('inbox_ops@test.com', $emails);
        $this->assertContains('operator2@test.com', $emails);
    }
}
