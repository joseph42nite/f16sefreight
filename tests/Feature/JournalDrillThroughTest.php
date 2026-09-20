<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The day book, and the way down from a report to the document behind it (user, 2026-09-20).
 */
class JournalDrillThroughTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private Partner $vendor;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Journal Co', 'code' => 'JRN', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-jrn@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $this->vendor = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Emirates SkyCargo', 'partner_type' => 'airline', 'email' => 'cass@emirates.test']);

        $this->periodId = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    private function job(): Job
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-JRNBOM-26-' . random_int(1000, 9999)]);

        return Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-JRNBOM-26-' . random_int(1000, 9999)]);
    }

    /** A posted sales invoice. */
    private function postedInvoice(float $amount, float $tax): AccountsInvoice
    {
        $job = $this->job();
        $invoice = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id,
            'billed_party_role' => 'client', 'created_by' => $this->accounts->id,
            'invoice_no' => AccountsInvoice::placeholderNumber($job->id), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'draft', 'currency' => 'INR', 'exchange_rate' => 1,
        ]);
        $invoice->items()->create(['charge_type' => 'freight', 'description' => 'Air freight', 'hsn_sac_code' => '996531',
            'quantity' => 1, 'rate' => $amount, 'amount' => $amount,
            'tax_percentage' => $amount > 0 ? round($tax / $amount * 100, 2) : 0,
            'tax_amount' => $tax, 'net_amount' => $amount + $tax]);

        $this->as($this->accounts)->postJson($this->url("/invoices/{$invoice->id}/finalize"))->assertOk();
        $this->postJson($this->url("/invoices/{$invoice->id}/post"))->assertOk();

        return $invoice->fresh();
    }

    /** A posted purchase voucher for the same shipment. */
    private function postedVoucher(int $jobId, float $amount, float $tax): int
    {
        $id = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $jobId,
            'vendor_id' => $this->vendor->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-JRN-' . random_int(1000, 9999),
            'document_date' => now()->toDateString(), 'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $id, 'charge_type' => 'freight',
            'description' => 'Air freight cost', 'quantity' => 1, 'rate' => $amount, 'amount' => $amount,
            'tax_percentage' => 18, 'tax_amount' => $tax, 'net_amount' => $amount + $tax,
            'created_at' => now(), 'updated_at' => now()]);

        $this->postJson($this->url("/vouchers/{$id}/post"))->assertOk();

        return $id;
    }

    public function test_the_day_book_carries_the_document_and_the_organization_on_every_line(): void
    {
        $invoice = $this->postedInvoice(100000, 18000);
        $voucher = $this->postedVoucher($invoice->job_id, 70000, 12600);

        $body = $this->as($this->accounts)->getJson($this->url('/journal'))->assertOk()->json();
        $entries = collect($body['entries']);

        // Three lines from the sale, three from the purchase.
        $this->assertSame(6, $body['totals']['count']);
        $this->assertSame($body['totals']['debits'], $body['totals']['credits'], 'the day book balances');

        $revenue = $entries->firstWhere('account_code', '4000-Freight-Revenue');
        $this->assertSame([100000.0, $invoice->invoice_no, 'Sales document', 'Globex'], [
            (float) $revenue['credit_amount'], $revenue['document_no'], $revenue['source_label'], $revenue['organization'],
        ]);

        $cost = $entries->firstWhere('account_code', '5000-Direct-Costs');
        $this->assertSame(['Purchase voucher', 'Emirates SkyCargo'], [$cost['source_label'], $cost['organization']]);
        $this->assertSame(DB::table('accounts_purchase_vouchers')->where('id', $voucher)->value('voucher_no'),
            $cost['document_no']);
    }

    public function test_an_account_ledger_opens_from_its_balance_and_runs_to_the_closing_figure(): void
    {
        // Two invoices inside the period, one dated before it — the earlier one is the OPENING balance.
        $early = $this->postedInvoice(50000, 0);
        DB::table('accounts_ledger_entries')->where('source_id', $early->id)->where('source_type', 'invoice')
            ->update(['posting_date' => now()->subDays(40)->toDateString()]);

        $this->postedInvoice(30000, 0);
        $this->postedInvoice(20000, 0);

        $from = now()->subDays(7)->toDateString();
        $body = $this->as($this->accounts)->getJson($this->url("/journal/accounts/1200-AR?from={$from}"))->assertOk()->json();

        // 🔴 Not zero: an account ledger that starts at zero will not agree with the trial balance.
        $this->assertSame(50000.0, (float) $body['opening']);
        $this->assertSame(50000.0, (float) $body['movements']['debits']);
        $this->assertSame(100000.0, (float) $body['closing']);
        $this->assertSame('Accounts Receivable', $body['account']['account_name']);

        // The running balance reads down the page.
        $this->assertSame([80000.0, 100000.0], array_map(fn ($e) => (float) $e['balance'], $body['entries']));
    }

    public function test_one_entry_drills_through_to_the_whole_journal_and_the_document_behind_it(): void
    {
        $invoice = $this->postedInvoice(100000, 18000);

        $revenueEntry = collect($this->as($this->accounts)->getJson($this->url('/journal'))->json('entries'))
            ->firstWhere('account_code', '4000-Freight-Revenue');

        $body = $this->getJson($this->url("/journal/entries/{$revenueEntry['id']}"))->assertOk()->json();

        // ⚠️ The WHOLE journal, not the one line — the question is always "against what?".
        $this->assertCount(3, $body['journal']['lines']);
        $this->assertTrue($body['journal']['balanced']);
        $this->assertSame(118000.0, (float) collect($body['journal']['lines'])
            ->firstWhere('account_code', '1200-AR')['debit_amount']);

        $this->assertSame([$invoice->invoice_no, 'Invoice', 'Globex', 118000.0], [
            $body['document']['number'], $body['document']['document_type'],
            $body['document']['organization'], (float) $body['document']['total'],
        ]);
        $this->assertSame('Air freight', $body['document']['lines'][0]['description']);
        $this->assertSame('FY26', $body['period']['period_name']);
    }

    public function test_a_receipt_drills_through_to_the_invoices_it_settled(): void
    {
        $invoice = $this->postedInvoice(60000, 0);

        $receipt = $this->as($this->accounts)->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id, 'receipt_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'reference' => 'UTR-JRN-1', 'amount' => 60000,
            'allocations' => [['invoice_id' => $invoice->id, 'amount' => 60000]],
        ])->assertCreated()->json();
        $this->postJson($this->url("/receipts/{$receipt['id']}/post"))->assertOk();

        $bank = collect($this->getJson($this->url('/journal?account=1100-Bank'))->json('entries'))->first();

        $this->assertSame([$receipt['receipt_no'], 'Receipt', 'Globex'],
            [$bank['document_no'], $bank['source_label'], $bank['organization']]);

        $drill = $this->getJson($this->url("/journal/entries/{$bank['id']}"))->assertOk()->json();
        $this->assertSame($invoice->invoice_no, $drill['document']['lines'][0]['description'], 'what the money settled');
    }

    /**
     * 🔴 A bank match raises a real receipt and posts against IT. The entry used to carry the invoice's id under
     * `source_type = 'receipt'`, so drilling through landed on the wrong document.
     */
    public function test_money_matched_from_the_bank_drills_through_to_its_own_receipt(): void
    {
        $invoice = $this->postedInvoice(40000, 0);

        $transactionId = DB::table('bank_transactions')->insertGetId([
            'agent_id' => $this->branch->id, 'provider' => 'manual', 'plaid_transaction_id' => 'UTR-MATCH-1',
            'reference' => 'UTR-MATCH-1', 'amount' => 40000, 'value_date' => now()->toDateString(),
            'direction' => 'credit', 'narration' => 'NEFT GLOBEX', 'reconciliation_status' => 'unreconciled',
            'currency' => 'INR', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->as($this->accounts)->postJson($this->url("/reconciliation/{$transactionId}/match"),
            ['invoice_id' => $invoice->id])->assertOk();

        $bank = collect($this->getJson($this->url('/journal?account=1100-Bank'))->json('entries'))->first();

        $this->assertStringStartsWith('RCPT-', $bank['document_no']);
        $this->assertSame('Receipt', $bank['source_label']);

        $drill = $this->getJson($this->url("/journal/entries/{$bank['id']}"))->assertOk()->json();
        $this->assertSame($invoice->invoice_no, $drill['document']['lines'][0]['description']);
        // It is in the receipts register too, where money that arrived belongs.
        $this->assertSame('UTR-MATCH-1', $this->getJson($this->url('/receipts'))->json('rows.0.reference'));
    }

    public function test_the_day_book_filters_by_account_period_and_side_and_exports(): void
    {
        $this->postedInvoice(100000, 18000);

        $onlyTax = $this->as($this->accounts)
            ->getJson($this->url("/journal?account=2200-GST-Output&period_id={$this->periodId}&side=credit"))
            ->assertOk()->json();

        $this->assertSame(1, $onlyTax['totals']['count']);
        $this->assertSame(18000.0, (float) $onlyTax['totals']['credits']);

        $csv = $this->get($this->url('/journal/export'))->assertOk()->getContent();
        $this->assertStringContainsString('Date,Account,"Account name",Debit,Credit,Document', $csv);
        $this->assertStringContainsString('4000-Freight-Revenue', $csv);
        $this->assertStringContainsString('Globex', $csv);
    }

    public function test_the_journal_is_read_only_and_pricing_cannot_read_it_at_all(): void
    {
        $this->postedInvoice(10000, 0);

        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-jrn@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->getJson('http://focusair.localhost/api/journal')->assertForbidden();

        // ⚠️ There is no write endpoint on the journal at all: a posting is corrected by another posting, never
        // edited. Every route under /journal is a GET.
        $methods = collect(\Illuminate\Support\Facades\Route::getRoutes()->getRoutes())
            ->filter(fn ($route) => str_contains($route->uri(), 'api/journal'))
            ->flatMap(fn ($route) => $route->methods())->unique()->sort()->values()->all();

        $this->assertSame(['GET', 'HEAD'], $methods);
    }
}
