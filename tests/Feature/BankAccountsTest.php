<?php

namespace Tests\Feature;

use App\Agent;
use App\AccountsPurchaseVoucher;
use App\BankAccount;
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
 * The bank accounts master (user, 2026-09-21): two accounts that can finally be told apart.
 */
class BankAccountsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private Partner $carrier;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Bank Master Co', 'code' => 'BNM', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-bnm@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $this->carrier = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Emirates SkyCargo', 'partner_type' => 'airline']);

        $this->periodId = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->subYear()->toDateString(), 'end_date' => now()->addMonths(3)->toDateString(),
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

    private function account(string $name, string $bank, string $number): array
    {
        return $this->as($this->accounts)->postJson($this->url('/bank-accounts'), [
            'agent_id' => $this->branch->id, 'name' => $name, 'bank_name' => $bank,
            'account_no' => $number, 'ifsc_code' => 'HDFC0000123', 'currency' => 'INR',
        ])->assertCreated()->json();
    }

    private function voucher(float $net): AccountsPurchaseVoucher
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-BNMBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-BNMBOM-26-' . random_int(1000, 9999)]);

        $voucher = AccountsPurchaseVoucher::create(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'vendor_id' => $this->carrier->id, 'transport_mode' => 'air',
            'voucher_no' => 'PV-BNM-' . random_int(1000, 9999), 'document_date' => now()->toDateString(),
            'status' => 'unpaid', 'created_by' => $this->accounts->id]);
        $voucher->items()->create(['charge_type' => 'freight', 'description' => 'Freight', 'quantity' => 1,
            'rate' => $net, 'amount' => $net, 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => $net]);

        // Posted: a voucher is paid only once it is (GAPS #407).
        $ledger = app(\App\Services\LedgerPostingService::class);
        $ledger->write($ledger->linesForVoucher($voucher), $this->branch->id, $this->periodId, $voucher->id, 'purchase_voucher');

        return $voucher->fresh();
    }

    /** What the ledger holds per account code. */
    private function ledger(): array
    {
        return DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.agent_id', $this->branch->id)
            ->groupBy('c.account_code')
            ->selectRaw('c.account_code, SUM(l.debit_amount - l.credit_amount) AS balance')
            ->pluck('balance', 'account_code')->map(fn ($b) => round((float) $b, 2))->all();
    }

    public function test_each_account_gets_its_own_ledger_code_derived_once(): void
    {
        $hdfc = $this->account('Current account', 'HDFC Bank', '50200012344321');

        // 🔴 The code is what makes two accounts tellable apart in the trial balance.
        $this->assertSame('1100-Bank-HDFCBANK-4321', $hdfc['account_code']);
        $this->assertSame('4321', $hdfc['last_four']);

        // 🔐 Written, encrypted, never returned.
        $this->assertArrayNotHasKey('account_no', $hdfc);
        $this->assertSame('50200012344321', BankAccount::withoutTenantScope()->find($hdfc['id'])->account_no);
        $this->assertNotSame('50200012344321', DB::table('bank_accounts')->where('id', $hdfc['id'])->value('account_no'));

        // ⚠️ Renaming must not move where its history is posted.
        $this->putJson($this->url("/bank-accounts/{$hdfc['id']}"), ['name' => 'Renamed account'])->assertOk();
        $this->assertSame('1100-Bank-HDFCBANK-4321',
            BankAccount::withoutTenantScope()->find($hdfc['id'])->account_code);
    }

    public function test_two_accounts_that_would_share_a_code_are_refused(): void
    {
        $this->account('Current account', 'HDFC Bank', '50200012344321');

        $this->as($this->accounts)->postJson($this->url('/bank-accounts'), [
            'agent_id' => $this->branch->id, 'name' => 'Another one',
            'bank_name' => 'HDFC Bank', 'account_no' => '99999999994321',
        ])->assertStatus(422)->assertJsonPath('reason', 'code_taken');
    }

    public function test_money_in_and_out_land_in_the_account_they_actually_moved_through(): void
    {
        $hdfc = $this->account('Collections', 'HDFC Bank', '50200012344321');
        $icici = $this->account('Payments', 'ICICI Bank', '00112233449876');

        // A receipt into HDFC.
        $receipt = $this->as($this->accounts)->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id,
            'receipt_date' => now()->toDateString(), 'mode' => 'bank_transfer', 'amount' => 60000,
            'bank_account_id' => $hdfc['id'],
        ])->assertCreated()->json();
        $this->postJson($this->url("/receipts/{$receipt['id']}/post"))->assertOk();

        // A payment out of ICICI.
        $voucher = $this->voucher(25000);
        $payment = $this->postJson($this->url('/payments/run'), [
            'agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'bank_account_id' => $icici['id'],
            'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 25000]],
        ])->assertCreated()->json('payments.0');
        $this->postJson($this->url("/payments/{$payment['id']}/post"))->assertOk();

        $ledger = $this->ledger();

        // 🔴 The whole point: two accounts, two balances, told apart.
        $this->assertSame(60000.0, $ledger['1100-Bank-HDFCBANK-4321']);
        $this->assertSame(-25000.0, $ledger['1100-Bank-ICICIBANK-9876']);
        $this->assertArrayNotHasKey('1100-Bank', $ledger, 'nothing fell back to the undifferentiated account');

        // And the master reports each balance.
        $listed = collect($this->getJson($this->url('/bank-accounts'))->assertOk()->json('accounts'))->keyBy('name');
        $this->assertSame(60000.0, (float) $listed['Collections']['balance']);
        $this->assertSame(-25000.0, (float) $listed['Payments']['balance']);
    }

    public function test_money_recorded_without_an_account_still_posts_and_is_reported_apart(): void
    {
        $this->account('Collections', 'HDFC Bank', '50200012344321');

        // ⚠️ No account named: honest as "the bank", not a guess at which one.
        $receipt = $this->as($this->accounts)->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id,
            'receipt_date' => now()->toDateString(), 'mode' => 'cash', 'amount' => 5000,
        ])->assertCreated()->json();
        $this->postJson($this->url("/receipts/{$receipt['id']}/post"))->assertOk();

        $this->assertSame(5000.0, $this->ledger()['1100-Bank']);
        $this->assertSame(5000.0, (float) $this->getJson($this->url('/bank-accounts'))->json('legacy_balance'));
    }

    public function test_a_statement_can_only_be_imported_against_an_account_of_that_branch(): void
    {
        $hdfc = $this->account('Collections', 'HDFC Bank', '50200012344321');

        $other = Company::create(['name' => 'Rival Bank Co', 'code' => 'RBC', 'tier' => 'command']);
        $theirBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);
        $theirs = BankAccount::withoutGlobalScopes()->create(['agent_id' => $theirBranch->id, 'name' => 'Theirs',
            'bank_name' => 'Axis', 'account_code' => '1100-Bank-AXIS-0000', 'currency' => 'INR']);

        $csv = "Date,Reference,Narration,Credit\n2026-09-15,UTR-BNM-1,NEFT GLOBEX,18000.00\n";

        // 🔴 Importing one bank's statement against another's account reconciles money that arrived elsewhere.
        $this->as($this->accounts)->postJson($this->url('/reconciliation/import'), [
            'agent_id' => $this->branch->id, 'bank_account_id' => $theirs->id, 'csv' => $csv,
        ])->assertStatus(404)->assertJsonPath('reason', 'bank_account_not_found');

        $this->postJson($this->url('/reconciliation/import'), [
            'agent_id' => $this->branch->id, 'bank_account_id' => $hdfc['id'], 'csv' => $csv,
        ])->assertOk();

        $this->assertSame($hdfc['id'],
            DB::table('bank_transactions')->where('plaid_transaction_id', 'UTR-BNM-1')->value('bank_account_id'));
        $this->assertSame(1, collect($this->getJson($this->url('/bank-accounts'))->json('accounts'))
            ->firstWhere('name', 'Collections')['unreconciled']);
    }

    public function test_one_default_per_branch_and_closing_never_deletes(): void
    {
        $first = $this->account('Collections', 'HDFC Bank', '50200012344321');
        $second = $this->account('Payments', 'ICICI Bank', '00112233449876');

        $this->as($this->accounts)->putJson($this->url("/bank-accounts/{$first['id']}"),
            ['name' => 'Collections', 'is_default' => true])->assertOk();
        $this->putJson($this->url("/bank-accounts/{$second['id']}"),
            ['name' => 'Payments', 'is_default' => true])->assertOk();

        $this->assertFalse((bool) BankAccount::withoutTenantScope()->find($first['id'])->is_default);
        $this->assertTrue((bool) BankAccount::withoutTenantScope()->find($second['id'])->is_default);

        // 🔴 Deactivate, never delete: entries and statement lines point at it for ever.
        $this->postJson($this->url("/bank-accounts/{$second['id']}/close"))->assertOk();
        $this->assertNotNull(BankAccount::withoutTenantScope()->find($second['id']));
        $this->assertSame(['Collections'],
            collect($this->getJson($this->url('/bank-accounts'))->json('accounts'))->pluck('name')->all());
        $this->assertSame(2, count($this->getJson($this->url('/bank-accounts?include_closed=1'))->json('accounts')));
    }

    public function test_only_finance_settings_may_add_an_account_and_never_another_company_s(): void
    {
        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-bnm@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->postJson('http://focusair.localhost/api/bank-accounts',
            ['agent_id' => $this->branch->id, 'name' => 'Sneaky'])->assertForbidden();

        $other = Company::create(['name' => 'Rival Two', 'code' => 'RB2', 'tier' => 'command']);
        $theirBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);

        $this->as($this->accounts)->postJson($this->url('/bank-accounts'),
            ['agent_id' => $theirBranch->id, 'name' => 'Theirs'])->assertStatus(404);
    }
}
