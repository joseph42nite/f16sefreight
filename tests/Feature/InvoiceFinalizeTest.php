<?php

namespace Tests\Feature;

use App\User;
use App\Agent;
use App\Company;
use App\Job;
use App\AccountsInvoice;
use App\AccountingPeriod;
use App\AccountsLedgerEntry;
use App\GstLedgerEntry;
use App\ChartOfAccount;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class InvoiceFinalizeTest extends TestCase
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

        $this->company = Company::create([
            'name' => 'Invoice Test Company',
            'billing_state' => 'Tamil Nadu',
            'tier' => 'viper_command',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Invoice Test Agent';
        $this->agent->agent_address = '1 Chennai Street';
        $this->agent->agent_state = 'Tamil Nadu'; // Matching state for Intrastate
        $this->agent->save();

        $this->user = new User();
        $this->user->name = 'Invoice Operator';
        $this->user->email = 'invoice_ops@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->save();

        session(['active_portal_scope' => 'air', 'company_id' => $this->company->id]);

        $this->job = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQ-INVOICE-TEST',
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
    public function testStoreDraftInvoice()
    {
        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/invoices', [
                'job_id' => $this->job->id,
                'client_id' => $this->company->id,
                'type' => 'invoice',
                'document_date' => '2026-06-15',
                'due_date' => '2026-07-15',
                'currency' => 'INR',
                'exchange_rate' => 1.00,
                'subtotal' => 1000.00,
                'tax_amount' => 180.00,
                'grand_total' => 1180.00,
                'items' => [
                    [
                        'charge_type' => 'Freight',
                        'description' => 'Air Freight Charges',
                        'qty' => 100,
                        'unit_rate' => 10,
                        'tax_rate' => 18,
                        'subtotal' => 1000,
                        'tax_amount' => 180,
                        'total_amount' => 1180,
                    ]
                ]
            ]);

        $response->assertStatus(201);
        $response->assertJsonFragment(['status' => 'draft']);
        
        $this->assertDatabaseHas('accounts_invoices', [
            'job_id' => $this->job->id,
            'client_id' => $this->company->id,
            'status' => 'draft',
        ]);
    }

    /** @test */
    public function testFinalizeInvoiceIntrastateGstAndLedgerEntries()
    {
        // 1. Ensure we have an open accounting period
        AccountingPeriod::create([
            'agent_id' => $this->agent->id,
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-30',
            'status' => 'open',
        ]);

        $invoice = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'DRAFT-TEMP-001',
            'document_date' => '2026-06-15',
            'job_id' => $this->job->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'grand_total' => 1180.00,
            'status' => 'draft',
            'is_posted' => false,
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/invoices/{$invoice->id}/finalize");

        $response->assertStatus(200);
        
        $invoice->refresh();
        $this->assertEquals('finalized', $invoice->status);
        $this->assertTrue($invoice->is_posted);
        $this->assertStringStartsWith('INV-2026-', $invoice->invoice_no);

        // Verify ledger entries are posted:
        // Accounts Receivable Debited 1180.00
        // Sales Revenue Credited 1000.00
        // GST Tax Payable Credited 180.00
        $this->assertDatabaseHas('accounts_ledger_entries', [
            'agent_id' => $this->agent->id,
            'reference_type' => 'Invoice',
            'reference_id' => $invoice->id,
            'debit' => 1180.00,
            'credit' => 0.00,
        ]);

        $this->assertDatabaseHas('accounts_ledger_entries', [
            'agent_id' => $this->agent->id,
            'reference_type' => 'Invoice',
            'reference_id' => $invoice->id,
            'debit' => 0.00,
            'credit' => 1000.00,
        ]);

        $this->assertDatabaseHas('accounts_ledger_entries', [
            'agent_id' => $this->agent->id,
            'reference_type' => 'Invoice',
            'reference_id' => $invoice->id,
            'debit' => 0.00,
            'credit' => 180.00,
        ]);

        // Verify GST split (Intrastate since client Tamil Nadu === agent Tamil Nadu)
        // cgst_rate = 9%, cgst_amount = 90.00
        // sgst_rate = 9%, sgst_amount = 90.00
        // igst_rate = 0%, igst_amount = 0.00
        $this->assertDatabaseHas('gst_ledger_entries', [
            'agent_id' => $this->agent->id,
            'voucher_id' => $invoice->id,
            'voucher_type' => 'Invoice',
            'cgst_rate' => 9.00,
            'cgst_amount' => 90.00,
            'sgst_rate' => 9.00,
            'sgst_amount' => 90.00,
            'igst_rate' => 0.00,
            'igst_amount' => 0.00,
            'total_tax' => 180.00,
        ]);
    }

    /** @test */
    public function testFinalizeInvoiceInterstateGst()
    {
        // 1. Ensure we have an open accounting period
        AccountingPeriod::create([
            'agent_id' => $this->agent->id,
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-30',
            'status' => 'open',
        ]);

        // Change client state to different state (Interstate)
        $this->company->billing_state = 'Karnataka';
        $this->company->save();

        $invoice = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'DRAFT-TEMP-002',
            'document_date' => '2026-06-15',
            'job_id' => $this->job->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'grand_total' => 1180.00,
            'status' => 'draft',
            'is_posted' => false,
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/invoices/{$invoice->id}/finalize");

        $response->assertStatus(200);

        // Verify GST split (Interstate since Karnataka !== Tamil Nadu)
        // cgst_rate = 0%, cgst_amount = 0
        // sgst_rate = 0%, sgst_amount = 0
        // igst_rate = 18%, igst_amount = 180
        $this->assertDatabaseHas('gst_ledger_entries', [
            'agent_id' => $this->agent->id,
            'voucher_id' => $invoice->id,
            'voucher_type' => 'Invoice',
            'cgst_rate' => 0.00,
            'cgst_amount' => 0.00,
            'sgst_rate' => 0.00,
            'sgst_amount' => 0.00,
            'igst_rate' => 18.00,
            'igst_amount' => 180.00,
            'total_tax' => 180.00,
        ]);
    }

    /** @test */
    public function testFinalizeBlockedByClosedOrLockedPeriod()
    {
        // 1. Create a closed/locked period for June 2026
        AccountingPeriod::create([
            'agent_id' => $this->agent->id,
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-30',
            'status' => 'closed',
        ]);

        $invoice = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'DRAFT-TEMP-003',
            'document_date' => '2026-06-15',
            'job_id' => $this->job->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 1000.00,
            'tax_amount' => 180.00,
            'grand_total' => 1180.00,
            'status' => 'draft',
            'is_posted' => false,
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/invoices/{$invoice->id}/finalize");

        // Gated posting must return 403 response
        $response->assertStatus(403);
        
        $invoice->refresh();
        $this->assertEquals('draft', $invoice->status);
        $this->assertFalse($invoice->is_posted);
    }
}
