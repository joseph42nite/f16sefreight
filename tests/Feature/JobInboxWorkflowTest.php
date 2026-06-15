<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\EmailThread;
use App\InboundEmail;
use App\Job;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class JobInboxWorkflowTest extends TestCase
{
    use DatabaseTransactions;

    protected Company $company;
    protected Agent $agent;
    protected User $pricingUser;
    protected User $opsUser;
    protected EmailThread $thread;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long',
        ]);

        $this->company = Company::create([
            'name' => 'Workflow Test Company',
            'tier' => 'viper_command',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Workflow Test Agent';
        $this->agent->agent_address = '1 Workflow Road';
        $this->agent->save();

        $this->pricingUser = new User();
        $this->pricingUser->name = 'Pricing Manager';
        $this->pricingUser->email = 'pricing_mgr@workflow.com';
        $this->pricingUser->password = bcrypt('password');
        $this->pricingUser->company_name = $this->company->name;
        $this->pricingUser->branch_name = $this->agent->id;
        $this->pricingUser->designation = 'pricing';
        $this->pricingUser->save();

        $this->opsUser = new User();
        $this->opsUser->name = 'Ops Operator';
        $this->opsUser->email = 'ops_operator@workflow.com';
        $this->opsUser->password = bcrypt('password');
        $this->opsUser->company_name = $this->company->name;
        $this->opsUser->branch_name = $this->agent->id;
        $this->opsUser->designation = 'operations';
        $this->opsUser->save();

        $this->thread = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => md5('workflow-thread-key-123'),
            'subject' => 'Quote Request: 500kg Singapore to Bangalore',
            'status' => 'unread',
            'latest_message_received_at' => now()->subMinutes(10),
            'participant_emails' => json_encode(['client@workflow.com']),
        ]);
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function testTriageThreadAsJobCreatesNewJob()
    {
        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/triage', [
                'classification' => 'job',
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        $this->thread->refresh();
        $this->assertNotNull($this->thread->job_id);

        $job = $this->thread->job;
        $this->assertEquals('air', $job->transport_mode);
        $this->assertEquals('Intake', $job->status->value ?? $job->status);
        $this->assertStringContainsString('ENQA-26-', $job->enquiry_no);
    }

    /** @test */
    public function testTriageThreadAsAirlineArchivesThread()
    {
        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/triage', [
                'classification' => 'airline',
            ]);

        $response->assertStatus(200);

        $this->thread->refresh();
        $this->assertEquals('archived', $this->thread->status);
        $this->assertNull($this->thread->job_id);
    }

    /** @test */
    public function testConfirmShipmentGatedForPricingStaff()
    {
        // Link a job first
        $job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-9999',
            'status' => 'Intake',
        ]);
        $this->thread->update(['job_id' => $job->id]);

        // Ops user should be blocked (403)
        $response = $this->withHeaders($this->getAuthHeader($this->opsUser))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/confirm', [
                'awb_number' => '123-45678901',
                'operator_id' => $this->opsUser->id,
                'planned_clearance_date' => now()->addDays(2)->toDateString(),
            ]);

        $response->assertStatus(403);
        $response->assertJsonFragment(['error' => 'Forbidden. Only pricing staff can confirm shipments.']);
    }

    /** @test */
    public function testConfirmShipmentSucceedsForPricingStaff()
    {
        $job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-9999',
            'status' => 'Intake',
        ]);
        $this->thread->update(['job_id' => $job->id]);

        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/confirm', [
                'awb_number' => '123-45678901',
                'operator_id' => $this->opsUser->id,
                'planned_clearance_date' => now()->addDays(2)->toDateString(),
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        $job->refresh();
        $this->assertEquals('AI Extraction', $job->status->value ?? $job->status);
        $this->assertEquals($this->opsUser->id, $job->operator_id);
        $this->assertStringContainsString('JOBA-26-', $job->execution_job_no);

        // Verify waybill created
        $this->assertDatabaseHas('air_way_bills', [
            'job_id' => $job->id,
            'awb_code' => '123',
            'awb_no' => '45678901',
        ]);
    }

    /** @test */
    public function testMarkLostHaltsSlaAndArchivesThread()
    {
        $job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-9999',
            'status' => 'Intake',
        ]);
        $this->thread->update(['job_id' => $job->id]);

        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->postJson('/api/user/inbox/threads/' . $this->thread->thread_key . '/lost', [
                'lost_reason' => 'rates_high',
                'lost_reason_custom' => 'Pricing was too high by 15%',
            ]);

        $response->assertStatus(200);

        $job->refresh();
        $this->assertEquals('Lost', $job->status->value ?? $job->status);
        $this->assertEquals('rates_high', $job->lost_reason);
        $this->assertEquals('Pricing was too high by 15%', $job->lost_reason_custom);
        $this->assertNotNull($job->lost_at);

        $this->thread->refresh();
        $this->assertEquals('archived', $this->thread->status);
    }

    /** @test */
    public function testGetStaffWorkloadsReturnsCounts()
    {
        // Create another job assigned to opsUser
        Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-8888',
            'status' => 'AI Extraction',
            'operator_id' => $this->opsUser->id,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->getJson('/api/user/inbox/staff-workloads');

        $response->assertStatus(200);
        $data = $response->json();

        // Verify workloads lists both users and counts active jobs
        $opsWorkload = collect($data)->firstWhere('id', $this->opsUser->id);
        $this->assertNotNull($opsWorkload);
        $this->assertEquals(1, $opsWorkload['active_jobs']);
    }

    /** @test */
    public function testGetActiveJobsReturnsActiveOnly()
    {
        // Active Job
        $jobActive = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-ACTIVE',
            'status' => 'Intake',
        ]);

        // Completed Job (should be excluded)
        $jobCompleted = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-COMPLETED',
            'status' => 'Completed',
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->getJson('/api/user/inbox/active-jobs');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue(collect($data)->contains('enquiry_no', 'ENQA-26-ACTIVE'));
        $this->assertFalse(collect($data)->contains('enquiry_no', 'ENQA-26-COMPLETED'));
    }

    /** @test */
    public function testGetJobCostSheetCreatesAndRetrievesDrafts()
    {
        $job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-9999',
            'status' => 'Intake',
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->getJson('/api/user/inbox/jobs/' . $job->id . '/cost-sheet');

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        $this->assertDatabaseHas('accounts_invoices', [
            'job_id' => $job->id,
            'status' => 'draft',
        ]);
        $this->assertDatabaseHas('accounts_purchase_vouchers', [
            'job_id' => $job->id,
            'status' => 'draft',
        ]);
    }

    /** @test */
    public function testSaveJobCostSheetUpdatesItemsAndTotals()
    {
        $job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-26-9999',
            'status' => 'Intake',
        ]);

        // Trigger GET to create draft models
        $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->getJson('/api/user/inbox/jobs/' . $job->id . '/cost-sheet');

        $invoiceItems = [
            [
                'charge_type' => 'Air Freight Charge',
                'description' => 'Freight operational charges',
                'qty' => 500.00,
                'unit_rate' => 2.50,
                'tax_rate' => 18.00,
            ],
            [
                'charge_type' => 'Cartage',
                'description' => 'Local pickup',
                'qty' => 1.00,
                'unit_rate' => 150.00,
                'tax_rate' => 18.00,
            ]
        ];

        $purchaseItems = [
            [
                'charge_type' => 'Air Freight Buy',
                'description' => 'Carrier costs',
                'qty' => 500.00,
                'unit_rate' => 1.80,
                'tax_rate' => 18.00,
            ]
        ];

        $response = $this->withHeaders($this->getAuthHeader($this->pricingUser))
            ->postJson('/api/user/inbox/jobs/' . $job->id . '/cost-sheet', [
                'invoice_items' => $invoiceItems,
                'purchase_items' => $purchaseItems,
            ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => true]);

        $this->assertDatabaseHas('accounts_invoices', [
            'job_id' => $job->id,
            'subtotal' => 1400.00,
            'tax_amount' => 252.00,
            'grand_total' => 1652.00,
        ]);

        $this->assertDatabaseHas('accounts_purchase_vouchers', [
            'job_id' => $job->id,
            'subtotal' => 900.00,
            'tax_amount' => 162.00,
            'grand_total' => 1062.00,
        ]);
    }
}
