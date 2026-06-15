<?php

namespace Tests\Feature;

use App\Company;
use App\User;
use App\Agent;
use App\Job;
use App\EmailThread;
use App\InboundEmail;
use App\SalesTarget;
use App\FinancialSnapshot;
use App\Role;
use App\SuperAdmin;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AnalyticsDashboardTest extends TestCase
{
    use DatabaseTransactions;

    protected Company     $company;
    protected Agent       $agent;
    protected User        $user;
    protected SuperAdmin  $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long',
            'services.ocr.url' => 'http://127.0.0.1:8001',
        ]);

        $this->company = Company::create([
            'name' => 'Analytics Test Company',
            'tier' => 'viper_tactical',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id    = $this->company->id;
        $this->agent->agent_name    = 'Analytics Test Agent';
        $this->agent->agent_address = '1 Analytics Road';
        $this->agent->save();

        $this->user = new User();
        $this->user->name        = 'Analytics Operator';
        $this->user->email       = 'analytics_ops@test.com';
        $this->user->password    = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name  = $this->agent->id;
        $this->user->designation  = 'sales';
        $this->user->save();

        $r = Role::where('email', $this->user->email)->first();
        if (!$r) {
            $r = new Role();
            $r->email = $this->user->email;
        }
        $r->role = 'user';
        $r->save();

        // Create Super Admin
        $this->superAdmin = SuperAdmin::create([
            'name' => 'Boss Director',
            'email' => 'director@boss.com',
            'password' => bcrypt('password'),
        ]);
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    protected function getSuperAdminAuthHeader(SuperAdmin $admin): array
    {
        $token = auth('superAdmin-api')->login($admin);
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function testGetFunnelMetricsSuccessfully()
    {
        // Create 2 jobs: 1 triaged (raised), 1 converted
        $job1 = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQA-26-0001',
            'status' => 'Intake',
            'transport_mode' => 'air',
            'direction' => 'export',
        ]);

        $job2 = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQA-26-0002',
            'execution_job_no' => 'JOBA-26-0002',
            'status' => 'Completed',
            'transport_mode' => 'air',
            'direction' => 'export',
        ]);

        // Create email thread linked to job1 and marked as replied
        $thread1 = EmailThread::create([
            'agent_id' => $this->agent->id,
            'thread_key' => 'thread_123',
            'subject' => 'Quote singapore',
            'status' => 'replied',
            'first_reply_at' => now(),
            'job_id' => $job1->id,
            'latest_message_received_at' => now(),
            'participant_emails' => ['client@customer.com'],
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/analytics/funnel?period=daily');

        $response->assertStatus(200);
        $response->assertJsonFragment(['raised' => 2]);
        $response->assertJsonFragment(['converted' => 1]);
        $response->assertJsonFragment(['replied' => 1]);
    }

    /** @test */
    public function testGetLostReasons()
    {
        Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQA-26-0003',
            'status' => 'Lost',
            'lost_reason' => 'rates_high',
        ]);

        Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQA-26-0004',
            'status' => 'Lost',
            'lost_reason' => 'capacity_issue',
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/analytics/lost-reasons');

        $response->assertStatus(200);
        $response->assertJsonFragment(['lost_reason' => 'rates_high', 'total' => 1]);
        $response->assertJsonFragment(['lost_reason' => 'capacity_issue', 'total' => 1]);
    }

    /** @test */
    public function testGetStaffLoadCalculatesOliCorrectly()
    {
        // Active job 1: Air Export multiplier = 1.0. Weight = 500Kg -> 0.5 tons -> OLI = 0.5
        $job1 = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQA-26-0005',
            'operator_id' => $this->user->id,
            'status' => 'Verification',
            'transport_mode' => 'air',
            'direction' => 'export',
        ]);
        $job1->airShipmentDetail()->create([
            'gross_weight' => 500,
        ]);

        // Active job 2: Sea Import multiplier = 2.5. Weight = 1200Kg -> 1.2 tons -> OLI = 3.0
        $job2 = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQS-26-0006',
            'operator_id' => $this->user->id,
            'status' => 'Verification',
            'transport_mode' => 'sea',
            'direction' => 'import',
        ]);
        $job2->seaShipmentDetail()->create([
            'gross_weight' => 1200,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/analytics/staff-load');

        $response->assertStatus(200);
        // Total OLI = 0.5 + 3.0 = 3.5
        $response->assertJsonFragment([
            'operator_id' => $this->user->id,
            'name' => $this->user->name,
            'active_jobs_count' => 2,
            'oli_score' => 3.5
        ]);
    }

    /** @test */
    public function testSaveSalesTargetAndTallyForSuperAdmin()
    {
        $payload = [
            'target_type' => 'branch',
            'target_id' => $this->agent->id,
            'quarter' => '2026-Q3',
            'revenue_target' => 75000.50,
            'tonnage_target' => 45.00,
        ];

        $response = $this->withHeaders($this->getSuperAdminAuthHeader($this->superAdmin))
            ->postJson('/api/superadmin/analytics/sales-targets', $payload);

        $response->assertStatus(200);
        $response->assertJsonFragment(['revenue_target' => '75000.50']);

        // Check DB
        $this->assertDatabaseHas('sales_targets', [
            'target_type' => 'branch',
            'target_id' => $this->agent->id,
            'quarter' => '2026-Q3',
        ]);

        // Test listing endpoint
        $listResponse = $this->withHeaders($this->getSuperAdminAuthHeader($this->superAdmin))
            ->getJson('/api/superadmin/analytics/sales-targets');

        $listResponse->assertStatus(200);
        $listResponse->assertJsonFragment(['name' => $this->agent->agent_name]);
    }

    /** @test */
    public function testGetClientSummaryGeminiMock()
    {
        $client = Company::create(['name' => 'Target Customer Client']);

        Http::fake([
            'http://127.0.0.1:8001/summarize-client' => Http::response([
                'status' => 'success',
                'summary' => 'This customer is shipping highly regularly.'
            ], 200),
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/analytics/client-summary?client_id=' . $client->id);

        $response->assertStatus(200);
        $response->assertJsonFragment(['summary' => 'This customer is shipping highly regularly.']);
    }

    /** @test */
    public function testGetWeeklyBriefGeminiMock()
    {
        Http::fake([
            'http://127.0.0.1:8001/executive-brief' => Http::response([
                'status' => 'success',
                'brief' => 'Weekly operational summary report is ready.'
            ], 200),
        ]);

        $response = $this->withHeaders($this->getSuperAdminAuthHeader($this->superAdmin))
            ->getJson('/api/superadmin/analytics/weekly-brief');

        $response->assertStatus(200);
        $response->assertJsonFragment(['brief' => 'Weekly operational summary report is ready.']);
    }

    /** @test */
    public function testOpsAndPricingAreBlockedFromAnalytics()
    {
        // 1. Create Operations user
        $opsUser = new User();
        $opsUser->name        = 'Ops Operator';
        $opsUser->email       = 'ops_test@test.com';
        $opsUser->password    = bcrypt('password');
        $opsUser->company_name = $this->company->name;
        $opsUser->branch_name  = $this->agent->id;
        $opsUser->designation  = 'operations';
        $opsUser->save();

        $r1 = new Role();
        $r1->email = $opsUser->email;
        $r1->role = 'user';
        $r1->save();

        // 2. Create Pricing user
        $pricingUser = new User();
        $pricingUser->name        = 'Pricing Operator';
        $pricingUser->email       = 'pricing_test@test.com';
        $pricingUser->password    = bcrypt('password');
        $pricingUser->company_name = $this->company->name;
        $pricingUser->branch_name  = $this->agent->id;
        $pricingUser->designation  = 'pricing';
        $pricingUser->save();

        $r2 = new Role();
        $r2->email = $pricingUser->email;
        $r2->role = 'user';
        $r2->save();

        // 3. Request funnel metrics as ops user - should fail with 403
        $responseOps = $this->withHeaders($this->getAuthHeader($opsUser))
            ->getJson('/api/user/analytics/funnel?period=daily');
        $responseOps->assertStatus(403);

        // 4. Request funnel metrics as pricing user - should fail with 403
        $responsePricing = $this->withHeaders($this->getAuthHeader($pricingUser))
            ->getJson('/api/user/analytics/funnel?period=daily');
        $responsePricing->assertStatus(403);
    }
}
