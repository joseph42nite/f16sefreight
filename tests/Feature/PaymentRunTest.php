<?php

namespace Tests\Feature;

use App\AccountsPurchaseVoucher;
use App\Agent;
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
 * Paying suppliers (user, 2026-09-21): the run, and the half of the ledger that did not exist.
 */
class PaymentRunTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Partner $carrier;
    private Partner $trucker;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Payout Co', 'code' => 'PAY', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-pay@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->carrier = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Emirates SkyCargo', 'partner_type' => 'airline']);
        $this->trucker = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'BlueDart Trucking', 'partner_type' => 'transporter']);

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

    /** A posted voucher: `$net` of cost plus `$tax` of input credit, so it owes the gross. */
    private function voucher(Partner $vendor, float $net, float $tax = 0, int $daysAgo = 20): AccountsPurchaseVoucher
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-PAYBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-PAYBOM-26-' . random_int(1000, 9999)]);

        $voucher = AccountsPurchaseVoucher::create(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'vendor_id' => $vendor->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-PAY-' . random_int(1000, 9999),
            'document_date' => now()->subDays($daysAgo)->toDateString(), 'status' => 'unpaid',
            'created_by' => $this->accounts->id]);

        $voucher->items()->create(['charge_type' => 'freight', 'description' => 'Freight', 'quantity' => 1,
            'rate' => $net, 'amount' => $net, 'tax_percentage' => $net > 0 ? round($tax / $net * 100, 2) : 0,
            'tax_amount' => $tax, 'net_amount' => $net + $tax]);

        return $voucher->fresh();
    }

    public function test_what_is_due_is_the_gross_and_is_aged_from_the_document_date(): void
    {
        $this->voucher($this->carrier, 70000, 12600, 30);

        $body = $this->as($this->accounts)->getJson($this->url('/payments/due'))->assertOk()->json();

        // 🔴 The gross, not the net: input tax is money that actually leaves for the supplier.
        $this->assertSame(82600.0, (float) $body['total']);
        $this->assertSame(30, $body['vouchers'][0]['days_old']);
        // ⚠️ Said, not hidden: a voucher has no due date of its own, so the document date stands in.
        $this->assertTrue($body['vouchers'][0]['due_assumed']);
    }

    public function test_a_run_raises_one_payment_per_supplier_and_brings_the_payable_down(): void
    {
        $air1 = $this->voucher($this->carrier, 70000, 12600);
        $air2 = $this->voucher($this->carrier, 30000, 5400);
        $road = $this->voucher($this->trucker, 10000, 1800);

        $run = $this->as($this->accounts)->postJson($this->url('/payments/run'), [
            'agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'reference' => 'BATCH-1',
            'allocations' => [
                ['purchase_voucher_id' => $air1->id, 'amount' => 82600],
                ['purchase_voucher_id' => $air2->id, 'amount' => 35400],
                ['purchase_voucher_id' => $road->id, 'amount' => 11800],
            ],
        ])->assertCreated()->json();

        // 🔴 TWO payments, not one and not three: each is a separate transfer to a separate bank account.
        $this->assertCount(2, $run['payments']);
        $this->assertSame(129800.0, (float) $run['total']);
        $this->assertStringStartsWith('RUN-', $run['run_ref']);

        $byAmount = collect($run['payments'])->pluck('amount')->map(fn ($a) => (float) $a)->sort()->values()->all();
        $this->assertSame([11800.0, 118000.0], $byAmount, 'the carrier is paid once for both its vouchers');
        $this->assertStringStartsWith('PAY-PAYBOM-26-', $run['payments'][0]['payment_no']);

        // The voucher is settled and says so.
        $this->assertSame(['paid', 82600.0],
            [$air1->fresh()->status, (float) $air1->fresh()->amount_paid]);
        $this->assertSame(0.0, (float) $this->getJson($this->url('/payments/due'))->json('total'));
    }

    public function test_a_part_payment_leaves_the_voucher_open(): void
    {
        $voucher = $this->voucher($this->carrier, 100000, 18000);

        $this->as($this->accounts)->postJson($this->url('/payments/run'), [
            'agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(), 'mode' => 'cheque',
            'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 50000]],
        ])->assertCreated();

        $this->assertSame('part_paid', $voucher->fresh()->status);
        $this->assertSame(68000.0, (float) $this->getJson($this->url('/payments/due'))->json('total'));
    }

    public function test_paying_more_than_a_voucher_owes_is_refused_not_clamped(): void
    {
        $voucher = $this->voucher($this->carrier, 10000, 1800);

        $this->as($this->accounts)->postJson($this->url('/payments/run'), [
            'agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(), 'mode' => 'bank_transfer',
            'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 20000]],
        ])->assertStatus(422)->assertJsonPath('reason', 'over_allocated_voucher');

        $this->assertSame('unpaid', $voucher->fresh()->status);
    }

    public function test_posting_a_payment_is_the_mirror_of_a_receipt(): void
    {
        $voucher = $this->voucher($this->carrier, 70000, 12600);

        $payment = $this->as($this->accounts)->postJson($this->url('/payments/run'), [
            'agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(), 'mode' => 'bank_transfer',
            'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 82600]],
        ])->assertCreated()->json('payments.0');

        $preview = $this->getJson($this->url("/payments/{$payment['id']}/posting-preview"))->assertOk()->json();
        $this->assertTrue($preview['balanced']);

        $this->postJson($this->url("/payments/{$payment['id']}/post"))->assertOk();

        $journal = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.source_type', 'payment')->where('l.source_id', $payment['id'])
            ->pluck('l.debit_amount', 'c.account_code');

        // 🔴 Payable down, cash out — and no adjustment leg: a short settlement is a dispute, not a write-off.
        $this->assertSame(82600.0, (float) $journal['2100-AP']);
        $this->assertSame(0.0, (float) $journal['1100-Bank']);

        $this->postJson($this->url("/payments/{$payment['id']}/post"))
            ->assertStatus(422)->assertJsonPath('reason', 'already_posted');
    }

    public function test_another_company_cannot_pay_our_vouchers(): void
    {
        $voucher = $this->voucher($this->carrier, 10000);

        $other = Company::create(['name' => 'Rival Pay', 'code' => 'RPY', 'tier' => 'command']);
        $theirBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);
        $theirAccounts = User::create(['name' => 'Theirs', 'email' => 'accounts-rpy@test.local', 'password' => Hash::make('x'),
            'company_name' => $other->id, 'branch_name' => $theirBranch->id, 'designation' => 'accounts', 'is_active' => 1]);

        $this->as($theirAccounts)->postJson($this->url('/payments/run'), [
            'agent_id' => $theirBranch->id, 'payment_date' => now()->toDateString(), 'mode' => 'bank_transfer',
            'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 10000]],
        ])->assertStatus(404)->assertJsonPath('reason', 'voucher_not_found');

        $this->assertSame(0.0, (float) $voucher->fresh()->amount_paid);
        $this->assertSame(0.0, (float) $this->as($theirAccounts)->getJson($this->url('/payments/due'))->json('total'));
    }

    public function test_the_boss_may_read_what_is_owed_and_not_pay_it(): void
    {
        $voucher = $this->voucher($this->carrier, 10000);

        $boss = User::create(['name' => 'Boss', 'email' => 'boss-pay@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'boss', 'is_active' => 1]);

        $headers = ['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($boss), 'Accept' => 'application/json'];

        $this->withHeaders($headers)->getJson('http://admin.localhost/api/payments/due')->assertOk();
        $this->withHeaders($headers)->postJson('http://admin.localhost/api/payments/run', [
            'agent_id' => $this->branch->id, 'payment_date' => now()->toDateString(), 'mode' => 'bank_transfer',
            'allocations' => [['purchase_voucher_id' => $voucher->id, 'amount' => 10000]],
        ])->assertForbidden();
    }
}
