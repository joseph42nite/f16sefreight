<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Partner;
use App\Services\TdsService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Tax deducted at source, both directions (user, 2026-09-22: "start").
 *
 * 🔴 **TDS is not a discount, a write-off, or a debt.** A client who settles ₹1,18,000 with ₹1,15,640 has paid
 * in full; the missing ₹2,360 went to the government in our name and comes back to us. Before this, all three
 * ways of closing that receipt were wrong, and the commonest of them — `write_off` — lost the money twice.
 */
class TdsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private Partner $trucker;
    private int $job;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'TDS Co', 'code' => 'TDS', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-tds@test.local',
            'password' => Hash::make('x'), 'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'accounts', 'is_active' => 1]);

        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Deducting Client',
            'email_domain' => 'deduct.test', 'pan_no' => 'AAACD1234C']);
        $this->trucker = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Highway Transport', 'partner_type' => 'transporter',
            'pan_no' => 'AAACH5678T', 'tds_section' => '194C']);

        app(TdsService::class)->seedRatesFor($this->branch->id);

        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'FY27',
            'start_date' => '2026-04-01', 'end_date' => '2027-03-31', 'status' => 'open',
            'created_at' => now(), 'updated_at' => now()]);

        $enquiry = DB::table('enquiries')->insertGetId(['agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'status' => 'converted', 'enquiry_no' => 'ENQA-TDSBOM-26-0001', 'customer_id' => $this->client->id,
            'created_at' => now(), 'updated_at' => now()]);
        $this->job = DB::table('jobs')->insertGetId(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry,
            'transport_mode' => 'air', 'execution_job_no' => 'JOBA-TDSBOM-26-0001',
            'customer_id' => $this->client->id, 'created_at' => now(), 'updated_at' => now()]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function vendor(array $overrides = []): object
    {
        return (object) ($overrides + ['id' => $this->trucker->id, 'pan_no' => 'AAACH5678T',
                                       'tds_section' => '194C', 'tds_rate_override' => null]);
    }

    private function decide(float $base, float $paidYtd = 0.0, float $deductedYtd = 0.0, array $vendor = []): array
    {
        return app(TdsService::class)->forVendor($this->vendor($vendor), $this->branch->id, $base, $paidYtd, $deductedYtd);
    }

    // ─── The financial year, which starts in April ───────────────────────────

    /** 🔴 January 2027 is Q4 of FY 2026-27, not Q1 of 2027. A calendar year puts three months in the wrong return. */
    public function test_the_indian_financial_year_starts_in_april(): void
    {
        $this->assertSame(['2025-26', 'Q4'], TdsService::period('2026-03-31'));
        $this->assertSame(['2026-27', 'Q1'], TdsService::period('2026-04-01'));
        $this->assertSame(['2026-27', 'Q2'], TdsService::period('2026-09-22'));
        $this->assertSame(['2026-27', 'Q3'], TdsService::period('2026-10-01'));
        $this->assertSame(['2026-27', 'Q4'], TdsService::period('2027-01-01'));
        $this->assertSame(['2027-28', 'Q1'], TdsService::period('2027-04-01'));

        $this->assertSame(['2026-04-01', '2027-03-31'], TdsService::financialYearRange('2027-01-15'));
    }

    // ─── What to withhold ────────────────────────────────────────────────────

    public function test_a_payment_over_the_single_threshold_is_deducted_at_the_section_rate(): void
    {
        $decision = $this->decide(50000);

        $this->assertTrue($decision['deduct']);
        $this->assertSame('194C', $decision['section']);
        $this->assertSame(2.0, $decision['rate']);
        $this->assertSame(1000.0, $decision['amount']);
    }

    public function test_nothing_is_deducted_below_both_thresholds(): void
    {
        // 🔴 Deducting under the threshold short-pays a supplier for no lawful reason. It is as wrong as
        // missing one, and it is the error nobody complains about until the supplier does.
        $decision = $this->decide(25000);

        $this->assertFalse($decision['deduct']);
        $this->assertSame(0.0, $decision['amount']);
        $this->assertSame('below_threshold', $decision['reason']);
    }

    /**
     * 🔴 **Crossing the ANNUAL threshold makes the whole year deductible, not just this payment.** Four
     * ₹25,000 payments lawfully escape deduction on the way up; the fifth crosses ₹1,00,000 and the catch-up
     * on all of them comes out of it. Deducting 2% of ₹25,000 here instead of 2% of ₹1,05,000 is a short
     * deduction on ₹80,000 — the exact shape of a notice arriving a year later with interest on it.
     */
    public function test_crossing_the_annual_threshold_catches_up_on_the_whole_year(): void
    {
        $decision = $this->decide(25000, paidYtd: 80000);

        $this->assertTrue($decision['deduct']);
        // 2% of 1,05,000, not 2% of 25,000.
        $this->assertSame(2100.0, $decision['amount']);
        $this->assertSame(1600.0, $decision['catching_up'], 'the part that belongs to earlier payments');
    }

    public function test_the_catch_up_is_net_of_what_was_already_withheld(): void
    {
        $decision = $this->decide(25000, paidYtd: 80000, deductedYtd: 1600);

        $this->assertSame(500.0, $decision['amount'], '2% of 1,05,000 less the 1,600 already taken');
    }

    /**
     * ⚠️ We cannot withhold more than we are paying. The payment goes entirely to the government and the
     * REMAINDER IS STILL OWED — said out loud, because silently capping it leaves a short deduction nobody
     * knows about.
     */
    public function test_a_catch_up_larger_than_the_payment_says_what_is_still_owed(): void
    {
        $decision = $this->decide(2000, paidYtd: 99000);

        $this->assertSame(2000.0, $decision['amount'], 'the whole payment');
        $this->assertSame(20.0, $decision['still_owed'], '2% of 1,01,000 is 2,020');
        $this->assertSame('catch_up_exceeds_payment', $decision['reason']);
    }

    /** 🔴 Section 206AA: no PAN means 20%, whatever the section says. The commonest wrong deduction there is. */
    public function test_a_vendor_with_no_pan_is_deducted_at_twenty_percent(): void
    {
        $decision = $this->decide(50000, vendor: ['pan_no' => null]);

        $this->assertSame(20.0, $decision['rate']);
        $this->assertSame(10000.0, $decision['amount']);
    }

    /** ⚠️ A s.197 certificate is an instruction from the department, so it wins — including over the no-PAN rate. */
    public function test_a_section_197_certificate_sets_the_rate(): void
    {
        $this->assertSame(250.0, $this->decide(50000, vendor: ['tds_rate_override' => 0.5])['amount']);

        $nil = $this->decide(50000, vendor: ['tds_rate_override' => 0]);
        $this->assertFalse($nil['deduct']);
        $this->assertSame('nil_rate_certificate', $nil['reason']);

        // The certificate could not have been issued without a PAN, so it beats the 20% penalty rate.
        $this->assertSame(1.0, $this->decide(50000, vendor: ['pan_no' => null, 'tds_rate_override' => 1])['rate']);
    }

    public function test_an_unclassified_vendor_is_never_deducted_from_and_is_named(): void
    {
        $decision = $this->decide(50000, vendor: ['tds_section' => null]);

        $this->assertFalse($decision['deduct']);
        // ⚠️ "Deduct nothing" is the only safe assumption about a vendor nobody has classified — but it is
        // reported, because a trucker with no section is a deduction never being made.
        $this->assertSame('no_section', $decision['reason']);
    }

    public function test_a_section_this_branch_has_no_rate_for_is_refused_not_guessed(): void
    {
        $this->assertSame('section_not_configured', $this->decide(50000, vendor: ['tds_section' => '194Q'])['reason']);
    }

    // ─── The receivable side: clients deducting from us ──────────────────────

    /**
     * 🔴 **The defect this started from.** A client settles ₹1,18,000 with ₹1,15,640. Before today the desk
     * could call that `short_paid` (the ageing chases a client who paid correctly), `write_off` (a bank
     * charge) or `discount` (revenue given up). It is none of them: it is ₹2,360 of tax paid in our name,
     * claimable against our own liability. Written off, the money is lost twice.
     */
    public function test_tds_a_client_deducted_posts_to_an_asset_and_settles_the_invoice(): void
    {
        $invoice = $this->bill('INV-TDSBOM-26-0001', 100000, 18000);

        $receipt = $this->receiveAndPost(115640, $invoice, 'tds');

        $lines = $this->ledgerOf('receipt', $receipt);

        // 🔴 An ASSET, not an expense and not a reduction of revenue.
        $this->assertSame(2360.0, $lines['1400-TDS-Receivable']['debit'] ?? null);
        $this->assertArrayNotHasKey('4900-Sales-Adjustments', $lines);
        $this->assertArrayNotHasKey('5100-Bank-Charges', $lines);
        // The receivable clears in FULL: the client owes nothing more.
        $this->assertSame(118000.0, $lines['1200-AR']['credit'] ?? null);
        $this->assertSame('paid', DB::table('accounts_invoices')->where('id', $invoice)->value('status'));
    }

    /** ⚠️ And the register row, so it can be reconciled against the client's Form 26AS. */
    public function test_the_deduction_reaches_the_register_with_the_invoice_subtotal_as_its_base(): void
    {
        $invoice = $this->bill('INV-TDSBOM-26-0001', 100000, 18000);
        $receipt = $this->receiveAndPost(115640, $invoice, 'tds');

        $entry = DB::table('tds_entries')->where('source_type', 'receipt')->where('source_id', $receipt)->first();

        $this->assertNotNull($entry);
        $this->assertSame(TdsService::INWARD, $entry->direction);
        // 🔴 The base is the SUBTOTAL: they deducted on the service, not on the GST they also paid us.
        $this->assertEquals(100000, $entry->base_amount);
        $this->assertEquals(2360, $entry->tds_amount);
        $this->assertEquals(2.36, $entry->rate, 'derived from what they actually withheld, not assumed');
        $this->assertSame('AAACD1234C', $entry->counterparty_pan);
        $this->assertSame('Q2', $entry->quarter);
        $this->assertSame('2026-27', $entry->financial_year);
    }

    /**
     * 🔴 **A write-off and a discount are not the same account, and this path sent both to Sales
     * Adjustments.** A write-off is an expense we absorbed; a discount is revenue we gave up. They sit in
     * different halves of the P&L, and `adjustmentAccountFor()` had said so since the beginning — the receipt
     * path just never asked it, so the same write-off posted differently depending on which screen closed it.
     */
    public function test_a_write_off_is_a_bank_charge_and_a_discount_is_a_sales_adjustment(): void
    {
        $writtenOff = $this->bill('INV-TDSBOM-26-0001', 10000, 0);
        $receipt = $this->receiveAndPost(9000, $writtenOff, 'write_off');
        $this->assertSame(1000.0, $this->ledgerOf('receipt', $receipt)['5100-Bank-Charges']['debit'] ?? null);

        $discounted = $this->bill('INV-TDSBOM-26-0002', 10000, 0);
        $second = $this->receiveAndPost(9000, $discounted, 'discount');
        $this->assertSame(1000.0, $this->ledgerOf('receipt', $second)['4900-Sales-Adjustments']['debit'] ?? null);
    }

    /** ⚠️ One receipt closing three invoices three ways posts three legs, not one lump in one account. */
    public function test_one_receipt_can_carry_three_different_resolutions_at_once(): void
    {
        $a = $this->bill('INV-TDSBOM-26-0001', 10000, 0);
        $b = $this->bill('INV-TDSBOM-26-0002', 10000, 0);
        $c = $this->bill('INV-TDSBOM-26-0003', 10000, 0);

        $receipt = $this->receipt(27000, [
            ['invoice_id' => $a, 'amount' => 9000, 'resolution' => 'tds'],
            ['invoice_id' => $b, 'amount' => 9000, 'resolution' => 'write_off'],
            ['invoice_id' => $c, 'amount' => 9000, 'resolution' => 'discount'],
        ]);
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/receipts/{$receipt}/post")->assertOk();

        $lines = $this->ledgerOf('receipt', $receipt);

        $this->assertSame(1000.0, $lines['1400-TDS-Receivable']['debit'] ?? null);
        $this->assertSame(1000.0, $lines['5100-Bank-Charges']['debit'] ?? null);
        $this->assertSame(1000.0, $lines['4900-Sales-Adjustments']['debit'] ?? null);
        $this->assertSame(30000.0, $lines['1200-AR']['credit'] ?? null, 'all three receivables clear in full');
    }

    // ─── The payable side: us deducting from vendors ─────────────────────────

    /**
     * 🔴 The payment run paid every voucher GROSS, so nothing was ever withheld — not a reporting gap but a
     * default on a statutory obligation, carrying interest, penalty, and disallowance of 30% of the expense.
     */
    public function test_a_payment_run_withholds_and_the_bank_leg_is_the_net(): void
    {
        $voucher = $this->cost('PV-TDSBOM-26-0001', 100000, 18000);
        $payment = $this->pay($voucher, 118000);

        $this->assertEquals(2000, DB::table('accounts_payments')->where('id', $payment)->value('tds_amount'));
        $this->assertSame('194C', DB::table('accounts_payments')->where('id', $payment)->value('tds_section'));

        $this->as($this->accounts)->postJson("http://accounts.localhost/api/payments/{$payment}/post")->assertOk();

        $lines = $this->ledgerOf('payment', $payment);

        // 🔴 The payable comes down by the GROSS — the supplier's invoice really is settled in full.
        $this->assertSame(118000.0, $lines['2100-AP']['debit'] ?? null);
        // Only the cash leg is smaller, and the difference is a LIABILITY we hold for the government.
        $this->assertSame(116000.0, $lines['1100-Bank']['credit'] ?? null);
        $this->assertSame(2000.0, $lines['2300-TDS-Payable']['credit'] ?? null);

        $entry = DB::table('tds_entries')->where('source_type', 'payment')->where('source_id', $payment)->first();
        $this->assertSame(TdsService::OUTWARD, $entry->direction);
        $this->assertEquals(100000, $entry->base_amount, 'net of GST');
        $this->assertEquals(2000, $entry->tds_amount);
    }

    public function test_an_unclassified_vendor_is_paid_in_full(): void
    {
        $this->trucker->update(['tds_section' => null]);

        $voucher = $this->cost('PV-TDSBOM-26-0001', 100000, 18000);
        $payment = $this->pay($voucher, 118000);

        $this->assertEquals(0, DB::table('accounts_payments')->where('id', $payment)->value('tds_amount'));

        $this->as($this->accounts)->postJson("http://accounts.localhost/api/payments/{$payment}/post")->assertOk();

        $lines = $this->ledgerOf('payment', $payment);
        $this->assertSame(118000.0, $lines['1100-Bank']['credit'] ?? null);
        $this->assertArrayNotHasKey('2300-TDS-Payable', $lines);
    }

    /**
     * 🔴 One decision per SUPPLIER, not per voucher. Four vouchers of ₹10,000 paid together are a ₹40,000
     * payment that crosses the ₹30,000 single-payment threshold; four separate decisions would each see
     * ₹10,000 and deduct nothing.
     */
    public function test_the_threshold_is_measured_on_the_whole_payment_not_each_voucher(): void
    {
        $vouchers = collect(range(1, 4))->map(fn ($i) => $this->cost('PV-TDSBOM-26-000' . $i, 10000, 0));
        $payment = $this->payMany($vouchers->map(fn ($v) => ['purchase_voucher_id' => $v, 'amount' => 10000])->all());

        // 2% of 40,000 — a threshold measured per voucher would have deducted nothing at all.
        $this->assertEquals(800, DB::table('accounts_payments')->where('id', $payment)->value('tds_amount'));
    }

    // ─── The register ────────────────────────────────────────────────────────

    /** 🔴 The two directions are a liability and an asset. Netting them reports a company that owes nothing. */
    public function test_the_register_never_nets_the_two_directions(): void
    {
        $invoice = $this->bill('INV-TDSBOM-26-0001', 100000, 18000);
        $this->receiveAndPost(115640, $invoice, 'tds');

        $voucher = $this->cost('PV-TDSBOM-26-0001', 100000, 18000);
        $payment = $this->pay($voucher, 118000);
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/payments/{$payment}/post")->assertOk();

        $body = $this->as($this->accounts)
            ->getJson('http://accounts.localhost/api/reports/tds?financial_year=2026-27&quarter=Q2')
            ->assertOk()->json();

        // assertEquals, not assertSame: these come back through JSON, which has one number type.
        $this->assertEquals(2000, $body['payable']['total'], 'owed to the government');
        $this->assertEquals(2360, $body['receivable']['total'], 'ours to claim');
        // And the ledger agrees with the register, because both are written in the same transaction.
        $this->assertEquals(2000, $body['ledger']['payable']);
        $this->assertEquals(2360, $body['ledger']['receivable']);
    }

    public function test_form_26q_names_every_deductee_and_why_a_pan_is_missing(): void
    {
        $this->trucker->update(['pan_no' => null]);
        $voucher = $this->cost('PV-TDSBOM-26-0001', 100000, 18000);
        $payment = $this->pay($voucher, 118000);
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/payments/{$payment}/post")->assertOk();

        $csv = $this->as($this->accounts)
            ->get('http://accounts.localhost/api/reports/tds/form-26q?financial_year=2026-27&quarter=Q2')
            ->assertOk()->getContent();

        $this->assertStringContainsString('Highway Transport', $csv);
        $this->assertStringContainsString('194C', $csv);
        // 🔴 A missing PAN is why the rate is 20%, and the return is rejected without it flagged.
        $this->assertStringContainsString('s.206AA', $csv);
        $this->assertStringContainsString('20000', $csv, '20% of 1,00,000');
    }

    public function test_a_quarter_outside_the_shape_is_refused(): void
    {
        $this->as($this->accounts)
            ->getJson('http://accounts.localhost/api/reports/tds?quarter=Q5')
            ->assertStatus(422)->assertJsonPath('reason', 'quarter_invalid');
    }

    public function test_sales_cannot_read_the_tds_register(): void
    {
        $sales = User::create(['name' => 'Sales', 'email' => 'sales-tds@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'sales', 'is_active' => 1]);

        $this->as($sales)->getJson('http://accounts.localhost/api/reports/tds')->assertForbidden();
    }

    // ─── Fixtures ────────────────────────────────────────────────────────────

    private function bill(string $no, float $net, float $tax): int
    {
        $id = DB::table('accounts_invoices')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $this->job, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'billed_party_type' => 'customer',
            'billed_party_id' => $this->client->id, 'billed_party_role' => 'client', 'invoice_no' => $no,
            'type' => 'invoice', 'document_date' => '2026-09-10', 'due_date' => '2026-10-10', 'status' => 'sent',
            'currency' => 'INR', 'exchange_rate' => 1, 'subtotal' => $net, 'tax_amount' => $tax,
            'grand_total' => $net + $tax, 'created_at' => now(), 'updated_at' => now(),
        ]);

        DB::table('accounts_invoice_items')->insert(['invoice_id' => $id, 'charge_type' => 'freight',
            'description' => 'Freight', 'hsn_sac_code' => '996531', 'quantity' => 1, 'rate' => $net,
            'amount' => $net, 'tax_percentage' => $net > 0 ? round($tax / $net * 100, 2) : 0,
            'tax_amount' => $tax, 'net_amount' => $net + $tax, 'created_at' => now(), 'updated_at' => now()]);

        return $id;
    }

    private function cost(string $no, float $net, float $tax): int
    {
        $id = DB::table('accounts_purchase_vouchers')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $this->job, 'vendor_id' => $this->trucker->id,
            'transport_mode' => 'air', 'voucher_no' => $no, 'document_date' => '2026-09-12',
            'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now(),
        ]);

        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $id, 'charge_type' => 'freight',
            'description' => 'Trucking', 'quantity' => 1, 'rate' => $net, 'amount' => $net,
            'tax_percentage' => $net > 0 ? round($tax / $net * 100, 2) : 0, 'tax_amount' => $tax,
            'net_amount' => $net + $tax, 'created_at' => now(), 'updated_at' => now()]);

        // Posted: a voucher is paid only once it is (GAPS #407).
        $ledger = app(\App\Services\LedgerPostingService::class);
        $ledger->write($ledger->linesForVoucher(\App\AccountsPurchaseVoucher::withoutGlobalScopes()->findOrFail($id)),
            $this->branch->id, $ledger->openPeriodFor($this->branch->id, '2026-09-12')->id, $id, 'purchase_voucher');

        return $id;
    }

    private function receipt(float $amount, array $allocations): int
    {
        return $this->as($this->accounts)->postJson('http://accounts.localhost/api/receipts', [
            'agent_id' => $this->branch->id, 'customer_id' => $this->client->id, 'amount' => $amount,
            'receipt_date' => '2026-09-20', 'mode' => 'bank_transfer', 'allocations' => $allocations,
        ])->assertCreated()->json('id');
    }

    private function receiveAndPost(float $amount, int $invoice, string $resolution): int
    {
        $id = $this->receipt($amount, [['invoice_id' => $invoice, 'amount' => $amount, 'resolution' => $resolution]]);
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/receipts/{$id}/post")->assertOk();

        return $id;
    }

    private function pay(int $voucher, float $amount): int
    {
        return $this->payMany([['purchase_voucher_id' => $voucher, 'amount' => $amount]]);
    }

    private function payMany(array $allocations): int
    {
        return $this->as($this->accounts)->postJson('http://accounts.localhost/api/payments/run', [
            'agent_id' => $this->branch->id, 'payment_date' => '2026-09-25', 'mode' => 'bank_transfer',
            'allocations' => $allocations,
        ])->assertCreated()->json('payments.0.id');
    }

    /** @return array<string, array{debit: float, credit: float}> */
    private function ledgerOf(string $type, int $id): array
    {
        return DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.source_type', $type)->where('l.source_id', $id)
            ->get(['c.account_code', 'l.debit_amount', 'l.credit_amount'])
            ->mapWithKeys(fn ($r) => [$r->account_code => [
                'debit' => round((float) $r->debit_amount, 2),
                'credit' => round((float) $r->credit_amount, 2),
            ]])->all();
    }

    /** 🔴 Tax is deducted on the value of the service, never on the GST charged on it. */
    public function test_the_base_excludes_gst_and_is_proportional_to_what_is_paid(): void
    {
        $tds = app(TdsService::class);

        $this->assertSame(100000.0, $tds->baseOf(118000, 100000, 118000), 'a voucher paid in full');
        $this->assertSame(50000.0, $tds->baseOf(59000, 100000, 118000), 'half of it');
        $this->assertSame(10000.0, $tds->baseOf(11800, 100000, 118000), 'a tenth');
        $this->assertSame(0.0, $tds->baseOf(1000, 0, 0), 'a voucher with no lines cannot be a base');
    }
}
