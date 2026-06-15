<?php

namespace Tests\Feature;

use App\User;
use App\Agent;
use App\Company;
use App\Job;
use App\AirwayBills;
use App\AccountsInvoice;
use App\BankStatement;
use App\AccountsLedgerEntry;
use App\ChartOfAccount;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class BankReconciliationTest extends TestCase
{
    use DatabaseTransactions;

    protected User $user;
    protected Agent $agent;
    protected Company $company;
    protected Job $jobDirectJob;
    protected Job $jobDirectAwb;
    protected Job $jobFuzzy;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'jwt.secret' => 'some_random_secret_string_of_at_least_32_characters_long',
        ]);

        $this->company = Company::create([
            'name' => 'Fuzzy Matching Corp',
            'tier' => 'viper_command',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Bank Recon Agent';
        $this->agent->agent_address = '2 Chennai Street';
        $this->agent->save();

        $this->user = new User();
        $this->user->name = 'Bank Recon Operator';
        $this->user->email = 'bank_ops@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->save();

        session(['active_portal_scope' => 'air', 'company_id' => $this->company->id]);

        // 1. Direct Job ID matching setup
        $this->jobDirectJob = Job::create([
            'agent_id' => $this->agent->id,
            'execution_job_no' => 'JOBA-26-9001',
            'enquiry_no' => 'ENQ-9001',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake',
        ]);

        // 2. Direct AWB matching setup
        $this->jobDirectAwb = Job::create([
            'agent_id' => $this->agent->id,
            'execution_job_no' => 'JOBA-26-9002',
            'enquiry_no' => 'ENQ-9002',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake',
        ]);

        $awb = new AirwayBills();
        $awb->awb_code = '020';
        $awb->awb_no = '99887766';
        $awb->job_id = $this->jobDirectAwb->id;
        $awb->agent_id = $this->agent->id;
        $awb->save();

        // 3. Fuzzy matching setup
        $this->jobFuzzy = Job::create([
            'agent_id' => $this->agent->id,
            'execution_job_no' => 'JOBA-26-9003',
            'enquiry_no' => 'ENQ-9003',
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
    public function testBankPollingCommand()
    {
        // Assert table is empty or has a known state for this agent
        BankStatement::where('agent_id', $this->agent->id)->delete();

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/reconciliation/bank/poll');

        $response->assertStatus(200);
        $response->assertJson(['status' => true]);

        // The mock statements are seeded for all agents, verify ours is created
        $this->assertDatabaseHas('bank_statements', [
            'agent_id' => $this->agent->id,
            'amount' => 1652.00,
            'sender_reference' => 'WIRE IN: Job #JOBA-26-0001 Clearances',
            'status' => 'unreconciled',
        ]);
    }

    /** @test */
    public function testAutomatedPaymentReconciliationEngine()
    {
        // Clean out bank statements for this agent
        BankStatement::where('agent_id', $this->agent->id)->delete();

        // Create finalized invoices
        $invoiceJob = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'INV-JOB-001',
            'document_date' => '2026-06-15',
            'job_id' => $this->jobDirectJob->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 1400.00,
            'tax_amount' => 252.00,
            'grand_total' => 1652.00,
            'status' => 'finalized',
            'is_posted' => true,
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        $invoiceAwb = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'INV-AWB-002',
            'document_date' => '2026-06-15',
            'job_id' => $this->jobDirectAwb->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 10000.00,
            'tax_amount' => 2500.00,
            'grand_total' => 12500.00,
            'status' => 'finalized',
            'is_posted' => true,
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        $invoiceFuzzy = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'INV-FUZZY-003',
            'document_date' => '2026-06-15',
            'job_id' => $this->jobFuzzy->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 3000.00,
            'tax_amount' => 200.00,
            'grand_total' => 3200.00,
            'status' => 'finalized',
            'is_posted' => true,
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        // Insert bank statement feeds corresponding to the invoices
        $stmtJob = BankStatement::create([
            'agent_id' => $this->agent->id,
            'plaid_transaction_id' => 'tx_test_job_1',
            'booking_date' => '2026-06-16',
            'value_date' => '2026-06-16',
            'amount' => 1652.00,
            'sender_reference' => 'WIRE IN: Job #JOBA-26-9001 Clearances',
            'status' => 'unreconciled',
        ]);

        $stmtAwb = BankStatement::create([
            'agent_id' => $this->agent->id,
            'plaid_transaction_id' => 'tx_test_awb_2',
            'booking_date' => '2026-06-17',
            'value_date' => '2026-06-17',
            'amount' => 12500.00,
            'sender_reference' => 'FT RECEIPT: HAWB Ref 020-99887766 payment',
            'status' => 'unreconciled',
        ]);

        $stmtFuzzy = BankStatement::create([
            'agent_id' => $this->agent->id,
            'plaid_transaction_id' => 'tx_test_fuzzy_3',
            'booking_date' => '2026-06-18',
            'value_date' => '2026-06-18',
            'amount' => 3200.00,
            'sender_reference' => 'PAYMENT FROM: Fuzzy Matching Corp INC',
            'status' => 'unreconciled',
        ]);

        // Run matching API
        $responseMatch = $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson('/api/user/reconciliation/bank/match');

        $responseMatch->assertStatus(200);
        $responseMatch->assertJson(['status' => true, 'matched' => 3]);

        // Verify status changes in DB
        $this->assertEquals('paid', $invoiceJob->refresh()->status);
        $this->assertEquals('paid', $invoiceAwb->refresh()->status);
        $this->assertEquals('paid', $invoiceFuzzy->refresh()->status);

        $this->assertEquals('reconciled', $stmtJob->refresh()->status);
        $this->assertEquals('reconciled', $stmtAwb->refresh()->status);
        $this->assertEquals('reconciled', $stmtFuzzy->refresh()->status);

        $this->assertEquals($invoiceJob->id, $stmtJob->matched_invoice_id);
        $this->assertEquals($invoiceAwb->id, $stmtAwb->matched_invoice_id);
        $this->assertEquals($invoiceFuzzy->id, $stmtFuzzy->matched_invoice_id);

        // Verify ledger entries are committed (debit 1010, credit 1200)
        $this->assertDatabaseHas('accounts_ledger_entries', [
            'agent_id' => $this->agent->id,
            'reference_type' => 'BankStatement',
            'reference_id' => $stmtJob->id,
            'debit' => 1652.00,
            'credit' => 0.00,
        ]);

        $this->assertDatabaseHas('accounts_ledger_entries', [
            'agent_id' => $this->agent->id,
            'reference_type' => 'BankStatement',
            'reference_id' => $stmtJob->id,
            'debit' => 0.00,
            'credit' => 1652.00,
        ]);
    }

    /** @test */
    public function testAiRiskAnalysisEndpoint()
    {
        // Create an invoice to generate client stats
        $invoice = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'INV-FUZZY-004',
            'document_date' => '2026-06-15',
            'job_id' => $this->jobFuzzy->id,
            'client_id' => $this->company->id,
            'currency' => 'INR',
            'exchange_rate' => 1.00,
            'subtotal' => 3000.00,
            'tax_amount' => 200.00,
            'grand_total' => 3200.00,
            'status' => 'finalized',
            'is_posted' => true,
            'due_date' => '2026-07-15',
            'created_by' => $this->user->id,
        ]);

        $response = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/reconciliation/bank/ai-risk');

        $response->assertStatus(200);
        $response->assertJsonStructure(['status', 'analysis']);
        
        // Assert unmasking logic mapped back to the client's actual name
        $this->assertStringContainsString($this->company->name, $response->json('analysis'));
    }
}
