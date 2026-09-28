<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The Boss's money figures — `snapshots:compute` and the Money section (PRD §6.8; user, 2026-09-28; GAPS #419).
 * Every figure worked by hand, each one a way the command used to be wrong:
 *
 *   owed to us   118,000 + USD 1,180 @ 83 (97,940) − credit note 11,800 + part-paid 50,000 − 20,000   = 2,34,140
 *                (a draft, a void and a paid bill are not owed; the credit note used to ADD, the dollar bill at face)
 *   we owe       unpaid 50,000 + part-paid 40,000 − 15,000                                             =   75,000
 *                (a part-paid voucher is `part_paid` — the command looked for `partially_paid` and never found one)
 *   in the bank  1100-Bank 200,000 + 10,000 last month, HDFC 50,000 − 30,000                            = 2,30,000
 *   this month   200,000 + 50,000 − 30,000                                                             = 2,20,000
 *                (the named HDFC account used to be missed)
 *   not billed   quoted 60,000 (no bill) + 40,000 (a draft only — no client has seen it)                =  1,00,000
 *                (not the one billed, not the USD quote at face value, not the shipment still moving)
 *   accrued      not measured — NULL, never the payables figure again
 */
class FinancialSnapshotsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $boss;
    private Customer $client;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow('2026-09-28 10:00:00');

        $this->company = Company::create(['name' => 'Snap Co', 'code' => 'SNP', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->boss = $this->user('boss');
        $this->client = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $this->periodId = DB::table('accounting_periods')->insertGetId(['agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => '2026-01-01', 'end_date' => '2026-12-31', 'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function user(string $designation): User
    {
        return User::create(['name' => ucfirst($designation), 'email' => "{$designation}-snp@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $designation, 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function bill(string $type, float $gross, string $status = 'sent', float $paid = 0, string $currency = 'INR', float $rate = 1): void
    {
        DB::table('accounts_invoices')->insert(['agent_id' => $this->branch->id, 'customer_id' => $this->client->id,
            'invoice_no' => 'SNP-' . uniqid(), 'type' => $type, 'document_date' => '2026-09-10', 'status' => $status,
            'currency' => $currency, 'exchange_rate' => $rate, 'subtotal' => round($gross / 1.18, 2),
            'tax_amount' => round($gross - $gross / 1.18, 2), 'grand_total' => $gross, 'amount_paid' => $paid,
            'created_at' => now(), 'updated_at' => now()]);
    }

    private function voucher(float $gross, string $status, float $paid = 0): void
    {
        $vendor = Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id, 'name' => 'Carrier ' . uniqid(), 'partner_type' => 'airline']);
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-SNPV-26-' . random_int(1000, 9999)]);
        // Still moving, so the shipment a cost hangs off adds nothing to "done, not billed".
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-SNPV-26-' . random_int(1000, 9999), 'status' => 'Sent to Airline']);
        $id = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $job->id, 'vendor_id' => $vendor->id,
            'voucher_no' => 'PV-SNP-' . uniqid(), 'document_date' => '2026-09-12', 'status' => $status, 'amount_paid' => $paid,
            'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $id, 'charge_type' => 'freight', 'description' => 'Freight',
            'quantity' => 1, 'rate' => $gross, 'amount' => $gross, 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => $gross,
            'created_at' => now(), 'updated_at' => now()]);
    }

    private function bank(string $code, float $debit, float $credit, string $date = '2026-09-15'): void
    {
        DB::table('accounts_ledger_entries')->insert(['agent_id' => $this->branch->id,
            'chart_of_account_id' => app(\App\Services\LedgerPostingService::class)->accountId($this->branch->id, $code, 'Bank'),
            'accounting_period_id' => $this->periodId, 'posting_date' => $date, 'debit_amount' => $debit, 'credit_amount' => $credit,
            'source_id' => 1, 'source_type' => 'receipt', 'created_at' => now(), 'updated_at' => now()]);
    }

    /** A shipment quoted at $quoted, in $status, with a bill in $billed (or none). */
    private function shipment(float $quoted, string $status = 'Completed', ?string $billed = null, string $currency = 'INR'): void
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-SNP-26-' . random_int(1000, 9999), 'quoted_amount' => $quoted, 'quoted_currency' => $currency]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-SNP-26-' . random_int(1000, 9999), 'status' => $status]);

        if ($billed !== null) {
            DB::table('accounts_invoices')->insert(['agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $this->client->id,
                'invoice_no' => 'SNP-J-' . uniqid(), 'type' => 'invoice', 'document_date' => '2026-09-20', 'status' => $billed,
                'currency' => 'INR', 'exchange_rate' => 1, 'subtotal' => 0, 'tax_amount' => 0, 'grand_total' => 0,
                'created_at' => now(), 'updated_at' => now()]);
        }
    }

    private function theBooks(): void
    {
        $this->bill('invoice', 118000);
        $this->bill('invoice', 1180, 'sent', 0, 'USD', 83);
        $this->bill('credit_note', 11800);
        $this->bill('invoice', 50000, 'partially_paid', 20000);
        $this->bill('invoice', 99999, 'draft');
        $this->bill('invoice', 88888, 'void');
        $this->bill('invoice', 77777, 'paid', 77777);

        $this->voucher(50000, 'unpaid');
        $this->voucher(40000, 'part_paid', 15000);
        $this->voucher(10000, 'paid', 10000);

        $this->bank('1100-Bank', 200000, 0);
        $this->bank('1100-Bank', 10000, 0, '2026-08-20');
        $this->bank('1100-Bank-HDFC-4321', 50000, 30000);

        $this->shipment(60000);
        $this->shipment(40000, 'Completed', 'draft');
        $this->shipment(70000, 'Completed', 'sent');
        $this->shipment(500, 'Completed', null, 'USD');
        $this->shipment(80000, 'Sent to Airline');
    }

    public function test_each_figure_is_what_the_books_say(): void
    {
        $this->theBooks();

        $this->artisan('snapshots:compute', ['--agent' => $this->branch->id])->assertSuccessful();
        $row = DB::table('financial_snapshots')->where('agent_id', $this->branch->id)->first();

        $this->assertEquals([234140, 75000, 230000, 220000, 100000],
            [(float) $row->total_receivables, (float) $row->total_payables, (float) $row->cash_on_hand,
             (float) $row->net_cash_flow, (float) $row->unbilled_revenue]);
        $this->assertNull($row->accrued_expenses);
    }

    public function test_the_boss_reads_them_with_their_age_and_nothing_unmeasured_reads_as_zero(): void
    {
        $this->theBooks();
        $this->artisan('snapshots:compute', ['--agent' => $this->branch->id])->assertSuccessful();

        $money = $this->as($this->boss)->getJson('http://admin.localhost/api/boss/financials')->assertOk()->json();
        $this->assertEquals([234140, 230000, null, false],
            [$money['branches'][0]['total_receivables'], $money['totals']['cash_on_hand'], $money['totals']['accrued_expenses'], $money['stale']]);

        // Past an hour, the screen says the figures are old.
        Carbon::setTestNow(now()->addMinutes(61));
        $this->assertTrue($this->getJson('http://admin.localhost/api/boss/financials')->json('stale'));
    }

    public function test_never_computed_is_said_rather_than_shown_as_nothing(): void
    {
        $this->as($this->boss)->getJson('http://admin.localhost/api/boss/financials')
            ->assertOk()->assertJsonPath('reason', 'never_computed');
    }

    /** 🔒 The executive view is the Boss's, and a Command figure. */
    public function test_only_the_boss_on_command_sees_it(): void
    {
        $this->as($this->user('accounts'))->getJson('http://accounts.localhost/api/boss/financials')->assertForbidden();

        $this->company->update(['tier' => 'tactical']);
        $this->as($this->boss)->getJson('http://admin.localhost/api/boss/financials')->assertForbidden();
    }

    public function test_it_runs_every_half_hour(): void
    {
        $event = collect(app(\Illuminate\Console\Scheduling\Schedule::class)->events())
            ->first(fn ($e) => str_contains((string) $e->command, 'snapshots:compute'));

        $this->assertSame('0,30 * * * *', $event?->expression);
    }
}
