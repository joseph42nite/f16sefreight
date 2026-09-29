<?php

namespace Tests\Feature;

use App\Agent;
use App\AccountsPurchaseVoucher;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * An airline's commission and its discounts or incentives (owner, 2026-09-29: "airlines do give commission and
 * discount for tonnage met — we have to account for that"; GAPS #444). Recorded as the bill shows them — the incentive
 * formula is each company's own contract — and with NO bank feed or CASS connection: typed or from a CSV.
 */
class SupplierDeductionsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Partner $airline;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Deduct Co', 'code' => 'DED', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-ded@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->airline = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Emirates SkyCargo', 'partner_type' => 'airline']);
        $this->periodId = DB::table('accounting_periods')->insertGetId(['agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->subYear()->toDateString(), 'end_date' => now()->addMonths(3)->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function as(): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->accounts), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** A posted airline voucher for one AWB, booked at the gross the AWB charges. */
    private function voucher(float $gross, string $awb): AccountsPurchaseVoucher
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-DEDBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-DEDBOM-26-' . random_int(1000, 9999), 'awb_number' => $awb]);
        $voucher = AccountsPurchaseVoucher::create(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'vendor_id' => $this->airline->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-DED-' . random_int(1000, 9999),
            'document_date' => now()->toDateString(), 'status' => 'unpaid', 'created_by' => $this->accounts->id]);
        $voucher->items()->create(['charge_type' => 'freight', 'description' => 'Air freight + due carrier', 'quantity' => 1,
            'rate' => $gross, 'amount' => $gross, 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => $gross]);
        $ledger = app(\App\Services\LedgerPostingService::class);
        $ledger->write($ledger->linesForVoucher($voucher), $this->branch->id, $this->periodId, $voucher->id, 'purchase_voucher');

        return $voucher->fresh();
    }

    private function balances(): array
    {
        return DB::table('accounts_ledger_entries as l')->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.agent_id', $this->branch->id)->groupBy('c.account_code')
            ->selectRaw('c.account_code, SUM(l.debit_amount - l.credit_amount) AS balance')
            ->pluck('balance', 'account_code')->map(fn ($b) => round((float) $b, 2))->all();
    }

    /** The bill settled in full; the bank pays the net; commission and discount are income. No bank feed needed. */
    public function test_commission_and_discount_come_off_the_transfer_and_are_income(): void
    {
        $voucher = $this->voucher(100000, '176-10000008');

        $run = $this->as()->postJson($this->url('/payments/run'), ['agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 100000]],
            'deductions' => [['vendor_id' => $this->airline->id, 'commission' => 5000, 'discount' => 2000]]])
            ->assertCreated()->json();

        $this->assertSame(93000.0, (float) $run['to_transfer']);
        $this->assertSame([5000.0, 2000.0], [(float) $run['commission_taken'], (float) $run['discount_taken']]);
        $this->assertSame('paid', $voucher->fresh()->status, 'the airline\'s bill is settled in full');

        $this->as()->postJson($this->url("/payments/{$run['payments'][0]['id']}/post"))->assertOk();

        $b = $this->balances();
        $this->assertSame(0.0, $b['2100-AP'], 'nothing left owing to the airline');
        $this->assertSame(-93000.0, $b['1100-Bank'], 'only the net left the bank');
        $this->assertSame(-5000.0, $b['4810-Airline-Commission']);
        $this->assertSame(-2000.0, $b['4820-Supplier-Discounts']);
        $this->assertSame(0.0, round(array_sum($b), 2), 'the ledger balances');
    }

    public function test_deductions_larger_than_the_payment_are_refused(): void
    {
        $voucher = $this->voucher(10000, '176-10000019');

        $this->as()->postJson($this->url('/payments/run'), ['agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 10000]],
            'deductions' => [['vendor_id' => $this->airline->id, 'commission' => 8000, 'discount' => 2000]]])
            ->assertStatus(422)->assertJsonPath('reason', 'deductions_too_large');

        $this->assertSame(0, DB::table('accounts_payments')->where('payee_id', $this->airline->id)->count());
    }

    /**
     * The airline's statement, as a CSV with its own columns: our voucher booked at the gross AGREES — commission and
     * discount are not a difference to argue — and the totals say what to take off the payment.
     */
    public function test_an_airline_statement_reads_the_breakdown_and_agrees_on_the_gross(): void
    {
        $this->voucher(100000, '176-10000008');
        $this->voucher(50000, '176-10000019');

        $csv = "AWB No,Weight Charge,Due Carrier,Commission,Incentive,Net Due\n"
            . "176-10000008,90000,10000,4500,1500,94000\n"
            . "176-10000019,45000,5000,2250,,";   // no net given: worked out from the parts

        $body = $this->as()->postJson($this->url('/vendor-statements'), ['agent_id' => $this->branch->id, 'vendor_id' => $this->airline->id,
            'period' => '2026-09 (1)', 'csv' => $csv])->assertOk()->json();

        $lines = collect($body['lines'])->keyBy('reference');
        $this->assertSame('agreed', $lines['176-10000008']['state']);
        $this->assertSame('agreed', $lines['176-10000019']['state']);
        $this->assertSame(47750.0, (float) $lines['176-10000019']['their_amount']);
        $this->assertSame(6750.0, (float) $body['totals']['commission']);
        $this->assertSame(1500.0, (float) $body['totals']['discount']);
    }

    /** A company that books the airline's cost at the NET agrees on the net. */
    public function test_a_cost_booked_at_the_net_agrees_too(): void
    {
        $this->voucher(94000, '176-10000008');

        $body = $this->as()->postJson($this->url('/vendor-statements'), ['agent_id' => $this->branch->id, 'vendor_id' => $this->airline->id,
            'period' => '2026-09 (2)', 'csv' => "AWB No,Weight Charge,Due Carrier,Commission,Incentive,Net Due\n176-10000008,90000,10000,4500,1500,94000"])
            ->assertOk()->json();

        $this->assertSame('agreed', $body['lines'][0]['state']);
    }

    /**
     * The run as a file for the bank's bulk upload (GAPS #445): the transfer (net of commission and discount), the
     * supplier's decrypted bank details, NEFT or RTGS by amount — accounts only, and never another company's run.
     */
    public function test_a_run_downloads_as_a_bank_upload_file(): void
    {
        $this->airline->forceFill(['bank_account_no' => '00112233445566', 'bank_ifsc_code' => 'HDFC0000123'])->save();
        $trucker = Partner::create(['company_id' => $this->airline->company_id, 'agent_id' => $this->branch->id,
            'name' => 'Road Movers', 'partner_type' => 'transporter']);
        $big = $this->voucher(300000, '176-10000008');
        $small = $this->voucher(20000, '176-10000019');
        $small->forceFill(['vendor_id' => $trucker->id])->save();

        $run = $this->as()->postJson($this->url('/payments/run'), ['agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'allocations' => [['purchase_voucher_id' => $big->id, 'amount' => 300000],
                ['purchase_voucher_id' => $small->id, 'amount' => 20000]],
            'deductions' => [['vendor_id' => $this->airline->id, 'commission' => 15000, 'discount' => 5000]]])
            ->assertCreated()->json();

        $csv = $this->as()->get($this->url("/payments/runs/{$run['run_ref']}/bank-file"))->assertOk()->getContent();
        $rows = array_map('str_getcsv', array_values(array_filter(preg_split('/\R/', trim($csv)))));

        $this->assertSame(['Beneficiary name', 'Account number', 'IFSC', 'Amount', 'Mode', 'Payment reference', 'Narration', 'Check'], $rows[0]);
        $byName = collect(array_slice($rows, 1))->keyBy(0);
        $this->assertSame(['00112233445566', 'HDFC0000123', '280000.00', 'RTGS'], array_slice($byName['Emirates SkyCargo'], 1, 4));
        $this->assertSame(['20000.00', 'NEFT'], array_slice($byName['Road Movers'], 3, 2));
        $this->assertStringContainsString('Bank details missing', $byName['Road Movers'][7]);

        $boss = User::create(['name' => 'Boss', 'email' => 'boss-ded@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->accounts->company_name, 'branch_name' => $this->branch->id, 'designation' => 'boss', 'is_active' => 1]);
        $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($boss), 'Accept' => 'application/json'])
            ->get($this->url("/payments/runs/{$run['run_ref']}/bank-file"))->assertForbidden();
    }
}
