<?php

namespace Tests\Feature;

use App\User;
use App\Agent;
use App\Company;
use App\Job;
use App\CargoArrivalNotice;
use App\JobDocument;
use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\ManifestFiling;
use App\AirwayBills;
use App\HousewayBills;
use App\Enums\JobStatus;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AirImportApiTest extends TestCase
{
    use DatabaseTransactions;

    protected User $user;
    protected Agent $agent;
    protected Company $company;
    protected Job $job;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long',
        ]);

        // Create a Company
        $this->company = Company::create([
            'name' => 'Import Test Company',
            'billing_state' => 'Tamil Nadu',
            'tier' => 'viper_command',
            'credit_limit' => 50000.00,
            'credit_balance' => 0.00,
        ]);

        // Create an Agent
        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Import Test Agent';
        $this->agent->agent_address = '2 Chennai Street';
        $this->agent->agent_state = 'Tamil Nadu';
        $this->agent->save();

        // Create an Operator User
        $this->user = new User();
        $this->user->name = 'Import Operator';
        $this->user->email = 'import_ops@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->save();

        // Put active company ID in session
        session(['active_portal_scope' => 'air', 'company_id' => $this->company->id]);

        // Create a Job in the Import direction
        $this->job = Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'direction' => 'import',
            'enquiry_no' => 'ENQA-IMP-TEST-999',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake',
        ]);
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function testUnauthenticatedRequestIsBlocked()
    {
        $response = $this->postJson("/api/user/import-shipments/{$this->job->id}/send-arrival-notice");
        $response->assertStatus(401);
    }

    /** @test */
    public function testSendArrivalNoticeSuccess()
    {
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/send-arrival-notice", [
                'free_storage_days' => 5,
                'storage_charges_start_date' => '2026-06-20',
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('status', true);

        $notice = CargoArrivalNotice::where('job_id', $this->job->id)->first();
        $this->assertNotNull($notice);
        $this->assertEquals(5, $notice->free_storage_days);
        $this->assertEquals('2026-06-20', $notice->storage_charges_start_date->toDateString());
        $this->assertNotNull($notice->sent_to_consignee_at);

        $this->assertDatabaseHas('job_documents', [
            'job_id' => $this->job->id,
            'document_type' => 'arrival_notice',
            'filename' => $notice->can_no . '.pdf',
        ]);
    }

    /** @test */
    public function testIssueDeliveryOrderCreditLimitExceededGating()
    {
        // Exceed credit limit
        $this->company->credit_limit = 10000.00;
        $this->company->credit_balance = 15000.00;
        $this->company->save();

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/issue-delivery-order");

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'message' => 'Consignee credit limit exceeded or credit status is suspended.'
        ]);
    }

    /** @test */
    public function testIssueDeliveryOrderCreditStatusSuspendedGating()
    {
        // Suspend the consignee via templates_config
        $this->company->templates_config = ['credit_status' => 'suspended'];
        $this->company->save();

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/issue-delivery-order");

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'message' => 'Consignee credit limit exceeded or credit status is suspended.'
        ]);
    }

    /** @test */
    public function testIssueDeliveryOrderPendingPaymentGating()
    {
        // 1. Create a draft invoice
        $invoice = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'type' => 'invoice',
            'invoice_no' => 'DRAFT-TEMP-009',
            'document_date' => '2026-06-15',
            'job_id' => $this->job->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 100.00,
            'tax_amount' => 18.00,
            'grand_total' => 118.00,
            'status' => 'draft',
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        // Explicitly set payment_status custom attribute to 'Pending' in request
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/issue-delivery-order", [
                'payment_status' => 'Pending'
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'message' => 'Linked invoice payment status is Pending.'
        ]);
    }

    /** @test */
    public function testIssueDeliveryOrderSuccessAndInvoiceItemInjection()
    {
        // 1. Create a draft invoice with some initial items
        $invoice = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'type' => 'invoice',
            'invoice_no' => 'DRAFT-TEMP-010',
            'document_date' => '2026-06-15',
            'job_id' => $this->job->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'grand_total' => 1180.00,
            'status' => 'draft',
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        $invoice->items()->create([
            'charge_type' => 'Freight',
            'description' => 'Initial Freight Charge',
            'qty' => 1.00,
            'unit_rate' => 1000.00,
            'tax_rate' => 18.00,
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'total_amount' => 1180.00,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/issue-delivery-order", [
                'do_release_fee' => 1500.00,
                'warehouse_fee' => 2500.00,
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('status', true);

        // Subtotal = 1000 (initial) + 1500 (DO Release) + 2500 (Warehouse) = 5000
        // Tax Amount = 18% of 5000 = 900
        // Grand Total = 5900
        $invoice->refresh();
        $this->assertEquals(5000.00, (float) $invoice->subtotal);
        $this->assertEquals(900.00, (float) $invoice->tax_amount);
        $this->assertEquals(5900.00, (float) $invoice->grand_total);

        // Verify items exist
        $this->assertDatabaseHas('accounts_invoice_items', [
            'invoice_id' => $invoice->id,
            'charge_type' => 'Delivery Order Release Charges',
            'unit_rate' => 1500.00,
        ]);
        $this->assertDatabaseHas('accounts_invoice_items', [
            'invoice_id' => $invoice->id,
            'charge_type' => 'Warehouse Handling Charges',
            'unit_rate' => 2500.00,
        ]);

        // Job status updated to Completed
        $this->job->refresh();
        $this->assertEquals(JobStatus::Completed, $this->job->status);

        // Job Document registered
        $this->assertDatabaseHas('job_documents', [
            'job_id' => $this->job->id,
            'document_type' => 'delivery_order',
        ]);
    }

    /** @test */
    public function testSubmitCgmValidationFailures()
    {
        // 1. Missing HAWB
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/submit-cgm", [
                'customs_house_code' => 'INMAA4',
                'mawb_number' => '123-12345678'
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'message' => 'Consolidation must contain at least one linked HAWB.'
        ]);

        // 2. Link HAWB but invalid MAWB format
        // Link a child job as HAWB
        Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'direction' => 'import',
            'enquiry_no' => 'HAWB-001',
            'parent_job_id' => $this->job->id,
            'is_sub_shipment' => true,
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
        ]);

        $response2 = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/submit-cgm", [
                'customs_house_code' => 'INMAA4',
                'mawb_number' => '123-INVALID'
            ]);

        $response2->assertStatus(422);
        $response2->assertJsonFragment([
            'message' => 'Invalid MAWB number format.'
        ]);
    }

    /** @test */
    public function testSubmitCgmSuccess()
    {
        // Link a child job as HAWB
        Job::create([
            'agent_id' => $this->agent->id,
            'transport_mode' => 'air',
            'direction' => 'import',
            'enquiry_no' => 'HAWB-002',
            'parent_job_id' => $this->job->id,
            'is_sub_shipment' => true,
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
        ]);

        // Associate Master AWB using direct property setting to bypass mass assignment
        $awb = new AirwayBills();
        $awb->id = 12345;
        $awb->agent_id = $this->agent->id;
        $awb->job_id = $this->job->id;
        $awb->awb_no = '123-87654321';
        $awb->awb_code = '123';
        $awb->save();

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/import-shipments/{$this->job->id}/submit-cgm", [
                'customs_house_code' => 'INMAA4'
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('status', true);

        $this->assertDatabaseHas('manifest_filings', [
            'job_id' => $this->job->id,
            'customs_house_code' => 'INMAA4',
            'transaction_status' => 'Accepted',
            'transport_mode' => 'air',
        ]);
    }
}
