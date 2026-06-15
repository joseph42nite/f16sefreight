<?php

namespace Tests\Feature;

use App\User;
use App\Agent;
use App\Company;
use App\Job;
use App\AccountsInvoice;
use App\AccountsPurchaseVoucher;
use App\AccountingPeriod;
use App\ChartOfAccount;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FinancialStatementsTest extends TestCase
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
            'name' => 'Finance Test Company',
            'billing_state' => 'Tamil Nadu',
            'tier' => 'viper_command',
        ]);

        $this->agent = new Agent();
        $this->agent->company_id = $this->company->id;
        $this->agent->agent_name = 'Finance Test Agent';
        $this->agent->agent_address = '1 Chennai Street';
        $this->agent->agent_state = 'Tamil Nadu';
        $this->agent->save();

        $this->user = new User();
        $this->user->name = 'Finance Operator';
        $this->user->email = 'finance_ops@test.com';
        $this->user->password = bcrypt('password');
        $this->user->company_name = $this->company->name;
        $this->user->branch_name = $this->agent->id;
        $this->user->save();

        session(['active_portal_scope' => 'air', 'company_id' => $this->company->id]);

        $this->job = Job::create([
            'agent_id' => $this->agent->id,
            'enquiry_no' => 'ENQ-FINANCE-TEST',
            'client_id' => $this->company->id,
            'job_owner_id' => $this->user->id,
            'doc_user_id' => $this->user->id,
            'status' => 'Intake',
        ]);

        AccountingPeriod::create([
            'agent_id' => $this->agent->id,
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-30',
            'status' => 'open',
        ]);
    }

    protected function getAuthHeader(User $user): array
    {
        $token = auth('user-api')->login($user);
        return ['Authorization' => 'Bearer ' . $token];
    }

    /** @test */
    public function testTrialBalanceProfitLossBalanceSheetFlow()
    {
        // 1. Create and finalize an Invoice (receivables/revenue)
        // Subtotal = 1000.00, Tax = 180.00, Grand Total = 1180.00 (Intrastate)
        $invoice = AccountsInvoice::create([
            'agent_id' => $this->agent->id,
            'type' => 'invoice',
            'invoice_no' => 'DRAFT-FIN-INV',
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

        $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/invoices/{$invoice->id}/finalize")
            ->assertStatus(200);

        // 2. Create and finalize a operational Purchase Voucher
        // Subtotal = 600.00, Tax = 108.00, Grand Total = 708.00 (Intrastate)
        $voucher = AccountsPurchaseVoucher::create([
            'agent_id' => $this->agent->id,
            'voucher_no' => 'DRAFT-FIN-PV',
            'document_date' => '2026-06-16',
            'job_id' => $this->job->id,
            'vendor_id' => $this->company->id,
            'currency' => 'INR',
            'subtotal' => 600.00,
            'tax_amount' => 108.00,
            'grand_total' => 708.00,
            'status' => 'draft',
            'is_posted' => false,
            'created_by' => $this->user->id,
        ]);
        $voucher->items()->create([
            'charge_type' => 'Freight',
            'description' => 'Freight charge buy-side',
            'qty' => 100.00,
            'unit_rate' => 6.00,
            'subtotal' => 600.00,
            'tax_amount' => 108.00,
            'total_amount' => 708.00,
        ]);

        $this->withHeaders($this->getAuthHeader($this->user))
            ->postJson("/api/user/purchase-vouchers/{$voucher->id}/finalize")
            ->assertStatus(200);

        // 3. Test Trial Balance
        // Debit: AR (1180.00), Expense (600.00), GST ITC (108.00) = 1888.00
        // Credit: Revenue (1000.00), GST Tax Payable (180.00), AP (708.00) = 1888.00
        $responseTB = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/financial-statements/trial-balance');

        $responseTB->assertStatus(200);
        $responseTB->assertJsonFragment([
            'is_balanced' => true,
            'total_debit' => 1888.00,
            'total_credit' => 1888.00,
        ]);

        // 4. Test Profit and Loss
        // Revenues: Sales Revenue (1000.00)
        // Expenses: Purchase Expense (600.00)
        // Net Profit = 400.00
        $responsePL = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/financial-statements/profit-and-loss');

        $responsePL->assertStatus(200);
        $responsePL->assertJsonFragment([
            'total_revenue' => 1000.00,
            'total_expense' => 600.00,
            'net_profit' => 400.00,
        ]);

        // 5. Test Balance Sheet
        // Assets: AR (1180.00) + GST ITC (108.00) = 1288.00
        // Liabilities: AP (708.00) + GST Tax Payable (180.00) = 888.00
        // Equity: Retained Earnings (400.00)
        // Total Liabilities + Equity = 888.00 + 400.00 = 1288.00 (Balanced!)
        $responseBS = $this->withHeaders($this->getAuthHeader($this->user))
            ->getJson('/api/user/financial-statements/balance-sheet');

        $responseBS->assertStatus(200);
        $responseBS->assertJsonFragment([
            'total_assets' => 1288.00,
            'total_liabilities' => 888.00,
            'total_equity' => 400.00,
        ]);
    }
}
