<?php

namespace Tests\Feature;

use App\Agent;
use App\BankAccount;
use App\Company;
use App\Customer;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The accounts desk's alerts (owner, 2026-10-03 — GAPS #448): connect your bank, a supplier bill due tomorrow, money
 * that arrived short, a client who slipped a grade. Today while true; the bell once per event.
 */
class AccountsAlertsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private User $boss;
    private User $sales;
    private Customer $client;
    private Partner $supplier;
    private int $seq = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Alert Co', 'code' => 'ALR', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = fn ($d) => User::create(['name' => ucfirst($d), 'email' => "{$d}-alr@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $d, 'is_active' => 1]);
        $this->accounts = $user('accounts');
        $this->boss = $user('boss');
        $this->sales = $user('sales');
        $this->client = Customer::create(['company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => 'Globex',
            'email_domain' => 'globex-alr.test', 'sales_id' => $this->sales->id]);
        $this->supplier = Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id,
            'name' => 'Emirates SkyCargo', 'partner_type' => 'airline']);
        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function today(): array
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->accounts), 'Accept' => 'application/json'])
            ->getJson('http://accounts.localhost/api/accounts/today')->assertOk()->json('exceptions');
    }

    private function kinds(): array
    {
        return array_column($this->today(), 'kind');
    }

    /** @return array<int, array> each user's AccountsAlert cards */
    private function bell(User $u): array
    {
        return DB::table('notifications')->where('type', 'AccountsAlert')->where('notifiable_id', $u->id)
            ->pluck('data')->map(fn ($d) => json_decode($d, true))->all();
    }

    private function account(): BankAccount
    {
        return BankAccount::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'name' => 'HDFC current',
            'account_code' => '1100-Bank-hdfc', 'currency' => 'INR', 'is_active' => true]);
    }

    private function voucher(float $gross, ?string $due, float $paid = 0): void
    {
        $this->seq++;
        $enquiry = \App\Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-ALRBOM-26-' . random_int(1000, 9999)]);
        $job = \App\Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-ALRBOM-26-' . random_int(1000, 9999)]);
        $id = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $job->id, 'vendor_id' => $this->supplier->id,
            'transport_mode' => 'air', 'voucher_no' => "PV-ALR-{$this->seq}", 'document_date' => now()->subDays(20)->toDateString(),
            'due_date' => $due, 'status' => $paid >= $gross ? 'paid' : 'unpaid', 'amount_paid' => $paid,
            'created_by' => $this->accounts->id, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $id, 'charge_type' => 'freight', 'description' => 'Freight',
            'quantity' => 1, 'rate' => $gross, 'amount' => $gross, 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => $gross,
            'created_at' => now(), 'updated_at' => now()]);
    }

    /** A bill paid from a bank line for less than it asked, the gap resolved as `$resolution` (NULL: left owed). */
    private function paidShort(?string $resolution): void
    {
        $this->seq++;
        $invoice = DB::table('accounts_invoices')->insertGetId(['agent_id' => $this->branch->id, 'customer_id' => $this->client->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id, 'invoice_no' => "INV-ALR-{$this->seq}",
            'type' => 'invoice', 'document_date' => now()->subDays(30)->toDateString(), 'due_date' => now()->toDateString(),
            'status' => $resolution ? 'paid' : 'partially_paid', 'currency' => 'INR', 'exchange_rate' => 1, 'subtotal' => 100000,
            'tax_amount' => 0, 'grand_total' => 100000, 'amount_paid' => $resolution ? 100000 : 90000, 'is_posted' => 1,
            'created_at' => now(), 'updated_at' => now()]);
        $line = DB::table('bank_transactions')->insertGetId(['agent_id' => $this->branch->id, 'plaid_transaction_id' => "ALR-{$this->seq}",
            'amount' => 90000, 'direction' => 'credit', 'value_date' => now()->toDateString(), 'reconciliation_status' => 'matched',
            'matched_invoice_id' => $invoice, 'created_at' => now(), 'updated_at' => now()]);
        $receipt = DB::table('accounts_receipts')->insertGetId(['agent_id' => $this->branch->id, 'payer_type' => 'customer',
            'payer_id' => $this->client->id, 'receipt_no' => "RC-ALR-{$this->seq}", 'receipt_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'amount' => 90000, 'currency' => 'INR', 'exchange_rate' => 1, 'bank_transaction_id' => $line,
            'is_posted' => 1, 'created_by' => $this->accounts->id, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_receipt_allocations')->insert(['receipt_id' => $receipt, 'invoice_id' => $invoice, 'amount' => 90000,
            'resolution' => $resolution, 'created_at' => now(), 'updated_at' => now()]);
    }

    private function card(string $month, string $grade): void
    {
        DB::table('client_payment_reports')->insert(['company_id' => $this->company->id, 'customer_id' => $this->client->id,
            'month' => $month, 'terms_days' => 30, 'bills_due' => 3, 'due_value' => 300000, 'on_time_value' => 0,
            'score' => 50, 'grade' => $grade, 'created_at' => now(), 'updated_at' => now()]);
    }

    public function test_today_asks_to_connect_a_bank_account_until_one_is_in_use(): void
    {
        $this->assertContains('no_bank_account', $this->kinds());

        $account = $this->account();
        $kinds = $this->kinds();
        $this->assertNotContains('no_bank_account', $kinds);
        $this->assertContains('bank_not_connected', $kinds);

        // A statement uploaded into it: in use — the prompt clears itself. Nothing rings for it, ever.
        DB::table('bank_transactions')->insert(['agent_id' => $this->branch->id, 'bank_account_id' => $account->id,
            'plaid_transaction_id' => 'ALR-CSV-1', 'amount' => 10, 'direction' => 'credit', 'value_date' => now()->toDateString(),
            'reconciliation_status' => 'unreconciled', 'created_at' => now(), 'updated_at' => now()]);
        $this->assertNotContains('bank_not_connected', $this->kinds());

        $this->artisan('accounts:alerts')->assertSuccessful();
        $this->assertSame([], $this->bell($this->accounts));
    }

    public function test_money_in_names_the_accounts_not_connected(): void
    {
        $stage = fn () => collect($this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->accounts), 'Accept' => 'application/json'])
            ->getJson('http://accounts.localhost/api/money-in/stages')->assertOk()->json('stages'))->firstWhere('key', 'money_in');

        $this->assertFalse($stage()['has_bank_account']);

        $this->account();

        $this->assertTrue($stage()['has_bank_account']);
        $this->assertSame(['HDFC current'], array_column($stage()['unconnected'], 'name'));
    }

    /** Only a recorded due date of tomorrow, only money still owed; the desk once, however often the sweep runs. */
    public function test_a_supplier_bill_due_tomorrow_rings_the_desk_once(): void
    {
        $this->voucher(50000, now()->addDay()->toDateString());
        $this->voucher(7000, now()->addDay()->toDateString(), 7000);   // paid
        $this->voucher(9000, null);                                     // no due date of its own
        $this->voucher(8000, now()->addDays(2)->toDateString());

        $line = collect($this->today())->firstWhere('kind', 'supplier_due_tomorrow');
        $this->assertStringStartsWith('1 supplier bill(s) fall due tomorrow, ₹50,000.00 unpaid', $line['text']);

        $this->artisan('accounts:alerts')->assertSuccessful();
        $this->artisan('accounts:alerts')->assertSuccessful();

        $this->assertCount(1, $this->bell($this->accounts));
        $this->assertCount(1, $this->bell($this->boss));
        $this->assertSame('/money-out', $this->bell($this->boss)[0]['to']['path']);
        $this->assertSame([], $this->bell($this->sales), 'a supplier bill is not a salesperson\'s');
    }

    public function test_money_matched_short_and_left_owed_rings_the_desk_and_the_clients_salesperson(): void
    {
        $this->paidShort('tds');      // a decision already made: no alert
        $this->assertNotContains('paid_short', $this->kinds());

        $this->paidShort(null);
        $this->assertContains('paid_short', $this->kinds());

        $this->artisan('accounts:alerts')->assertSuccessful();

        $card = $this->bell($this->accounts)[0];
        $this->assertSame('Globex paid INV-ALR-2 short — INR 10,000.00 is still owed.', $card['text']);
        $this->assertCount(1, $this->bell($this->boss));
        $this->assertSame('/clients-partners', $this->bell($this->sales)[0]['to']['path'], 'sales cannot open Money in');
    }

    public function test_a_client_who_drops_a_grade_letter_is_named(): void
    {
        $this->card('2026-08-01', 'B');
        $this->card('2026-09-01', 'C');

        $line = collect($this->today())->firstWhere('kind', 'grade_slipped');
        $this->assertSame('Globex slipped from B to C.', $line['text']);

        $this->artisan('accounts:alerts')->assertSuccessful();
        $this->assertCount(1, $this->bell($this->accounts));
        $this->assertCount(1, $this->bell($this->sales));
    }

    public function test_a_client_who_improves_is_not_an_alert(): void
    {
        $this->card('2026-08-01', 'C');
        $this->card('2026-09-01', 'B');

        $this->assertNotContains('grade_slipped', $this->kinds());
        $this->artisan('accounts:alerts')->assertSuccessful();
        $this->assertSame([], $this->bell($this->accounts));
    }
}
