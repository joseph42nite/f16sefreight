<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\Airline;
use App\MailboxConnection;
use App\InboundEmail;
use App\EmailThread;
use App\Job;
use App\Services\AirlineExclusionService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AirlineExclusionTest extends TestCase
{
    use DatabaseTransactions;

    protected $exclusionService;
    protected $agent;
    protected $company;
    protected $user;
    protected $connection;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long']);
        
        $this->exclusionService = resolve(AirlineExclusionService::class);

        $this->company = Company::create([
            'name' => 'Exclusion Company',
            'tier' => 'viper_tactical',
        ]);

        $this->user = new User();
        $this->user->name = 'Exclusion Operator';
        $this->user->email = 'exclusion@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->save();

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Exclusion Agent';
        $this->agent->agent_address = '789 Exclusion Road';
        $this->agent->save();

        $this->connection = MailboxConnection::create([
            'user_id' => $this->user->id,
            'provider' => 'gmail',
            'email_address' => 'ops@exclusioncompany.com',
            'access_token' => 'access',
            'refresh_token' => 'refresh',
            'expires_at' => now()->addHour(),
            'is_active' => true,
        ]);
    }

    public function testSenderDomainOnAirlineBlocklistGetsArchived()
    {
        // Add airline to blocklist
        Airline::create([
            'name' => 'Emirates',
            'code' => 'EK',
            'prefix' => '176',
            'country' => 'UAE',
            'email_domain' => 'emirates.com',
        ]);

        $thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'emirates_thread_key',
            'subject' => 'Rates inquiry',
            'latest_message_received_at' => now(),
            'participant_emails' => ['cargo@emirates.com', 'ops@exclusioncompany.com'],
            'status' => 'unread',
        ]);

        $email = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'emirates_msg_id',
            'thread_key' => $thread->thread_key,
            'from' => 'cargo@emirates.com',
            'to' => 'ops@exclusioncompany.com',
            'subject' => 'Rates inquiry',
            'received_at' => now(),
        ]);

        $this->exclusionService->process($email);

        $thread->refresh();
        $this->assertEquals('archived', $thread->status);
        $this->assertNull($thread->job_id);
        $this->assertEquals(0, Job::count());
    }

    public function testSubjectKeywordKeywordsMatchGetsArchived()
    {
        $thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'lh_alert_thread_key',
            'subject' => 'Flight Alert: LH505 Delayed',
            'latest_message_received_at' => now(),
            'participant_emails' => ['cargo@lufthansa.com', 'ops@exclusioncompany.com'],
            'status' => 'unread',
        ]);

        $email = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'lh_msg_id',
            'thread_key' => $thread->thread_key,
            'from' => 'cargo@lufthansa.com',
            'to' => 'ops@exclusioncompany.com',
            'subject' => 'Flight Alert: LH505 Delayed',
            'received_at' => now(),
        ]);

        $this->exclusionService->process($email);

        $thread->refresh();
        $this->assertEquals('archived', $thread->status);
        $this->assertNull($thread->job_id);
        $this->assertEquals(0, Job::count());
    }

    public function testGeminiClassifiesCustomerInquiryAndCreatesJob()
    {
        Http::fake([
            '*/classify-email' => Http::response([
                'status' => 'success',
                'classification' => 'customer',
            ], 200)
        ]);

        $thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'customer_inquiry_key',
            'subject' => 'Request for quotation Chennai to London',
            'latest_message_received_at' => now(),
            'participant_emails' => ['shipper@client.com', 'ops@exclusioncompany.com'],
            'status' => 'unread',
        ]);

        $email = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'customer_msg_id',
            'thread_key' => $thread->thread_key,
            'from' => 'shipper@client.com',
            'to' => 'ops@exclusioncompany.com',
            'subject' => 'Request for quotation Chennai to London',
            'received_at' => now(),
        ]);

        $this->exclusionService->process($email);

        $thread->refresh();
        $this->assertNotNull($thread->job_id);
        $this->assertEquals('unread', $thread->status);

        $this->assertDatabaseHas('jobs', [
            'id' => $thread->job_id,
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'status' => 'Intake',
        ]);
    }

    public function testGeminiClassifiesSystemAlertAndArchivesThread()
    {
        Http::fake([
            '*/classify-email' => Http::response([
                'status' => 'success',
                'classification' => 'system',
            ], 200)
        ]);

        $thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'newsletter_key',
            'subject' => 'Get 50% discount on shipping insurance',
            'latest_message_received_at' => now(),
            'participant_emails' => ['promo@news.com', 'ops@exclusioncompany.com'],
            'status' => 'unread',
        ]);

        $email = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'newsletter_msg_id',
            'thread_key' => $thread->thread_key,
            'from' => 'promo@news.com',
            'to' => 'ops@exclusioncompany.com',
            'subject' => 'Get 50% discount on shipping insurance',
            'received_at' => now(),
        ]);

        $this->exclusionService->process($email);

        $thread->refresh();
        $this->assertEquals('archived', $thread->status);
        $this->assertNull($thread->job_id);
        $this->assertEquals(0, Job::count());
    }

    public function testGeminiFailureLeavesThreadAsUnclassifiedForManualTriage()
    {
        Http::fake([
            '*/classify-email' => Http::response(['error' => 'Internal Server Error'], 500)
        ]);

        $thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'failure_key',
            'subject' => 'Ambiguous email subject',
            'latest_message_received_at' => now(),
            'participant_emails' => ['someone@test.com', 'ops@exclusioncompany.com'],
            'status' => 'unread',
        ]);

        $email = InboundEmail::create([
            'agent_id' => $this->agent->id,
            'mailbox_connection_id' => $this->connection->id,
            'message_id' => 'failure_msg_id',
            'thread_key' => $thread->thread_key,
            'from' => 'someone@test.com',
            'to' => 'ops@exclusioncompany.com',
            'subject' => 'Ambiguous email subject',
            'received_at' => now(),
        ]);

        $this->exclusionService->process($email);

        // Thread remains unread and unassigned (job_id is null)
        $thread->refresh();
        $this->assertEquals('unread', $thread->status);
        $this->assertNull($thread->job_id);
        $this->assertEquals(0, Job::count());
    }
}
