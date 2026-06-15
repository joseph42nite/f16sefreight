<?php

namespace Tests\Feature;

use App\User;
use App\Agent;
use App\Company;
use App\Job;
use App\Airline;
use App\AirwayBills;
use App\AccountsPurchaseVoucher;
use App\AccountsCassStatement;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ReconciliationTest extends TestCase
{
    use DatabaseTransactions;

    protected User $user;
    protected Agent $agent;
    protected Company $company;
    protected Job $job;
    protected Airline $airline;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long',
        ]);

        $this->company = Company::create([
            'name' => 'Reconciliation Test Company',
            'tier' => 'viper_command',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Recon Test Agent';
        $this->agent->agent_address = '1 Chennai Street';
        $this->agent->save();

        $this->user = new User();
        $this->user->name = 'Recon Operator';
        $this->user->email = 'recon_ops@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->save();

        session(['active_portal_scope' => 'air', 'company_id' => $this->company->id]);

        $this->job = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQ-RECON-TEST',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake',
        ]);

        $this->airline = Airline::create([
            'airline_name' => 'Test Airline',
            'iatacode' => 'TA',
        ]);
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function testCassReconciliationMatchingLogic()
    {
        // 1. Create a matched case AWB and Purchase Voucher
        $awbMatched = new AirwayBills();
        $awbMatched->id = 10001;
        $awbMatched->awb_code = '020';
        $awbMatched->awb_no = '11111111';
        $awbMatched->job_id = $this->job->id;
        $awbMatched->agent_id = $this->agent->id;
        $awbMatched->save();

        $pvMatched = AccountsPurchaseVoucher::create([
            'agent_id' => $this->agent->id,
            'voucher_no' => 'PV-MAT-001',
            'document_date' => '2026-06-15',
            'job_id' => $this->job->id,
            'vendor_id' => $this->company->id,
            'currency' => 'INR',
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'grand_total' => 1180.00,
            'status' => 'draft',
        ]);
        $pvMatched->items()->create([
            'charge_type' => 'Air Freight',
            'description' => 'Freight charge',
            'qty' => 100.00, // weight
            'unit_rate' => 10.00, // rate
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'total_amount' => 1180.00,
        ]);

        // 2. Create a rate mismatch case
        $job2 = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQ-RECON-TEST2',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake',
        ]);
        $awbRateMismatch = new AirwayBills();
        $awbRateMismatch->id = 10002;
        $awbRateMismatch->awb_code = '020';
        $awbRateMismatch->awb_no = '22222222';
        $awbRateMismatch->job_id = $job2->id;
        $awbRateMismatch->agent_id = $this->agent->id;
        $awbRateMismatch->save();

        $pvRateMismatch = AccountsPurchaseVoucher::create([
            'agent_id' => $this->agent->id,
            'voucher_no' => 'PV-MAT-002',
            'document_date' => '2026-06-15',
            'job_id' => $job2->id,
            'vendor_id' => $this->company->id,
            'currency' => 'INR',
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'grand_total' => 1180.00,
            'status' => 'draft',
        ]);
        $pvRateMismatch->items()->create([
            'charge_type' => 'Air Freight',
            'description' => 'Freight charge',
            'qty' => 100.00, // weight
            'unit_rate' => 10.00, // rate
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'total_amount' => 1180.00,
        ]);

        // 3. Create a weight mismatch case
        $job3 = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQ-RECON-TEST3',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake',
        ]);
        $awbWeightMismatch = new AirwayBills();
        $awbWeightMismatch->id = 10003;
        $awbWeightMismatch->awb_code = '020';
        $awbWeightMismatch->awb_no = '33333333';
        $awbWeightMismatch->job_id = $job3->id;
        $awbWeightMismatch->agent_id = $this->agent->id;
        $awbWeightMismatch->save();

        $pvWeightMismatch = AccountsPurchaseVoucher::create([
            'agent_id' => $this->agent->id,
            'voucher_no' => 'PV-MAT-003',
            'document_date' => '2026-06-15',
            'job_id' => $job3->id,
            'vendor_id' => $this->company->id,
            'currency' => 'INR',
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'grand_total' => 1180.00,
            'status' => 'draft',
        ]);
        $pvWeightMismatch->items()->create([
            'charge_type' => 'Air Freight',
            'description' => 'Freight charge',
            'qty' => 100.00, // weight
            'unit_rate' => 10.00, // rate
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'total_amount' => 1180.00,
        ]);

        // Create the CASS statements to upload and reconcile
        $responseUpload = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/reconciliation/cass/upload', [
                'airline_id' => $this->airline->id,
                'statements' => [
                    // Case 1: Match (AWB, weight=100.00, rate=10.00)
                    [
                        'awb_number' => '020-11111111',
                        'cass_gross_weight' => 100.00,
                        'cass_rate' => 10.00,
                        'grand_total' => 1180.00,
                    ],
                    // Case 2: Rate Mismatch (AWB matches, but rate = 12.00 != 10.00)
                    [
                        'awb_number' => '020-22222222',
                        'cass_gross_weight' => 100.00,
                        'cass_rate' => 12.00,
                        'grand_total' => 1380.00,
                    ],
                    // Case 3: Weight Mismatch (AWB matches, but weight = 150.00 != 100.00)
                    [
                        'awb_number' => '020-33333333',
                        'cass_gross_weight' => 150.00,
                        'cass_rate' => 10.00,
                        'grand_total' => 1680.00,
                    ],
                    // Case 4: Unmatched (AWB not in database)
                    [
                        'awb_number' => '020-99999999',
                        'cass_gross_weight' => 100.00,
                        'cass_rate' => 10.00,
                        'grand_total' => 1180.00,
                    ],
                ]
            ]);

        $responseUpload->assertStatus(200);

        // Run reconciliation
        $responseMatch = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/reconciliation/cass/match');

        $responseMatch->assertStatus(200);
        $responseMatch->assertJsonFragment(['matched' => 1, 'processed' => 4]);

        // Assert database values
        $this->assertDatabaseHas('accounts_cass_statements', [
            'awb_number' => '020-11111111',
            'reconciliation_status' => 'matched',
            'matched_voucher_id' => $pvMatched->id,
        ]);

        $this->assertDatabaseHas('accounts_cass_statements', [
            'awb_number' => '020-22222222',
            'reconciliation_status' => 'rate_mismatch',
            'matched_voucher_id' => null,
        ]);

        $this->assertDatabaseHas('accounts_cass_statements', [
            'awb_number' => '020-33333333',
            'reconciliation_status' => 'weight_mismatch',
            'matched_voucher_id' => null,
        ]);

        $this->assertDatabaseHas('accounts_cass_statements', [
            'awb_number' => '020-99999999',
            'reconciliation_status' => 'unmatched',
            'matched_voucher_id' => null,
        ]);
    }
}
