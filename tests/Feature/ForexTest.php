<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Services\ExchangeRateService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Foreign currency in an INR ledger (user, 2026-09-26: "USD arrives converted to INR; look up the rate"; GAPS #411).
 *
 * One USD bill, worked by hand. Rates on file: USD 83.00 on 10 September, USD 84.00 on 24 September.
 *
 *   INV  USD 1,000 + 18% = USD 1,180, dated 10 Sep     booked at 83   AR ₹97,940 · revenue ₹83,000 · GST ₹14,940
 *
 *   paid ₹99,120 on 25 Sep   ÷ 84 = USD 1,180 → paid in full       exchange 99,120 − 97,940 = ₹1,180 gain
 *   paid ₹98,500 on 25 Sep   ÷ 84 = USD 1,172.62, within 2%        in full; exchange 98,500 − 97,940 = ₹560 gain
 *   paid ₹42,000 on 25 Sep   ÷ 84 = USD 500                        part; exchange 42,000 − 41,500 = ₹500 gain
 */
class ForexTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow('2026-09-26 11:00:00');
        config(['services.currency_rate.token' => null]);   // no provider unless a test fakes one

        $company = Company::create(['name' => 'Forex Co', 'code' => 'FXC', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM',
            'gst_no' => '27AAAAA0000A1Z5']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-fx@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        // Registered in Karnataka: interstate from Maharashtra, so the tax is all IGST.
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test',
            'gst_no' => '29BBBBB1111B1Z5']);
        $this->periodId = DB::table('accounting_periods')->insertGetId(['agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => '2026-01-01', 'end_date' => '2026-12-31', 'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);

        foreach (['2026-09-10' => 83.00, '2026-09-24' => 84.00] as $day => $rate) {
            DB::table('exchange_rates')->updateOrInsert(['from_currency' => 'USD', 'to_currency' => 'INR', 'rate_date' => $day],
                ['rate' => $rate, 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** A USD draft on the default rate of 1, finalized (so its rate is looked up) and posted. */
    private function usdInvoice(string $date = '2026-09-10', bool $post = true): int
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-FXC-26-' . random_int(1000, 9999), 'customer_id' => $this->client->id]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-FXC-26-' . random_int(1000, 9999), 'customer_id' => $this->client->id]);

        $id = DB::table('accounts_invoices')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'transport_mode' => 'air', 'customer_id' => $this->client->id, 'billed_party_type' => 'customer',
            'billed_party_id' => $this->client->id, 'invoice_no' => 'DRAFT-FX-' . random_int(1000, 9999), 'type' => 'invoice',
            'document_date' => $date, 'status' => 'draft', 'currency' => 'USD', 'exchange_rate' => 1,
            'subtotal' => 1000, 'tax_amount' => 180, 'grand_total' => 1180, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_invoice_items')->insert(['invoice_id' => $id, 'charge_type' => 'freight', 'description' => 'Air freight',
            'hsn_sac_code' => '996531', 'quantity' => 1, 'rate' => 1000, 'amount' => 1000, 'tax_percentage' => 18,
            'tax_amount' => 180, 'net_amount' => 1180, 'created_at' => now(), 'updated_at' => now()]);

        if ($post) {
            $this->as($this->accounts)->postJson($this->url("/invoices/{$id}/finalize"))->assertOk();
            $this->postJson($this->url("/invoices/{$id}/post"))->assertOk();
        }

        return $id;
    }

    /** Signed balance per account code: debit − credit. */
    private function ledger(): array
    {
        return DB::table('accounts_ledger_entries as l')->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.agent_id', $this->branch->id)->groupBy('c.account_code')
            ->selectRaw('c.account_code, SUM(l.debit_amount - l.credit_amount) AS balance')
            ->pluck('balance', 'account_code')->map(fn ($b) => round((float) $b, 2))->all();
    }

    private function receive(int $invoice, float $inr, ?string $resolution = null, string $date = '2026-09-25')
    {
        return $this->as($this->accounts)->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_type' => 'customer', 'payer_id' => $this->client->id,
            'receipt_date' => $date, 'mode' => 'bank_transfer', 'amount' => $inr,
            'allocations' => [array_filter(['invoice_id' => $invoice, 'amount' => $inr, 'resolution' => $resolution])],
        ]);
    }

    // ─── Booking ─────────────────────────────────────────────────────────────

    public function test_a_usd_bill_is_booked_in_rupees_at_its_document_dates_rate(): void
    {
        $id = $this->usdInvoice();

        // Looked up at finalize: it was still on the default of 1.
        $this->assertEquals(83.0, (float) DB::table('accounts_invoices')->where('id', $id)->value('exchange_rate'));
        // Not USD 1,180 as ₹1,180.
        $ledger = $this->ledger();
        $this->assertSame([97940.0, -14940.0, -83000.0], [$ledger['1200-AR'], $ledger['2200-GST-Output'], $ledger['4000-Freight-Revenue']]);

        // The GST register and the return file rupees, and agree.
        $register = DB::table('gst_ledger_entries')->where('voucher_type', 'invoice')->where('voucher_id', $id)->first();
        $this->assertEquals(14940, (float) $register->igst_amount);
        $row = collect($this->getJson($this->url('/reports/gstr1?agent_id=' . $this->branch->id . '&month=2026-09'))
            ->assertOk()->json('b2b'))->firstWhere('document_id', $id);
        $this->assertEquals([83000, 14940, 97940], [$row['taxable_value'], $row['igst'], $row['document_total']]);
    }

    public function test_a_rate_the_desk_typed_stands(): void
    {
        $id = $this->usdInvoice('2026-09-10', false);
        DB::table('accounts_invoices')->where('id', $id)->update(['exchange_rate' => 82.5]);   // an agreed rate

        $this->as($this->accounts)->postJson($this->url("/invoices/{$id}/finalize"))->assertOk();

        $this->assertEquals(82.5, (float) DB::table('accounts_invoices')->where('id', $id)->value('exchange_rate'));
    }

    public function test_no_rate_for_the_week_refuses_rather_than_guesses(): void
    {
        // 1 August: the nearest rate on file is 10 September, far outside a week.
        $id = $this->usdInvoice('2026-08-01', false);

        $this->as($this->accounts)->postJson($this->url("/invoices/{$id}/finalize"))
            ->assertStatus(422)->assertJsonPath('reason', 'no_exchange_rate');
        $this->assertSame('draft', DB::table('accounts_invoices')->where('id', $id)->value('status'));
    }

    // ─── Settling ────────────────────────────────────────────────────────────

    public function test_rupees_that_pay_a_usd_bill_in_full_post_the_exchange_gain(): void
    {
        $id = $this->usdInvoice();
        $receipt = $this->receive($id, 99120)->assertCreated()->json('id');
        $this->postJson($this->url("/receipts/{$receipt}/post"))->assertOk();

        $invoice = DB::table('accounts_invoices')->find($id);
        $this->assertSame(['paid', 1180.0], [$invoice->status, (float) $invoice->amount_paid]);
        $allocation = DB::table('accounts_receipt_allocations')->where('receipt_id', $receipt)->first();
        $this->assertEquals([99120, 1180, 84], [(float) $allocation->amount, (float) $allocation->invoice_amount, (float) $allocation->exchange_rate]);

        // The receivable is gone — cleared at what it was booked at — and the rest is exchange.
        $ledger = $this->ledger();
        $this->assertSame([0.0, 99120.0, -1180.0], [$ledger['1200-AR'], $ledger['1100-Bank'], $ledger['5500-Forex-Gain-Loss']]);
    }

    public function test_a_bank_spread_within_two_percent_still_pays_in_full(): void
    {
        $id = $this->usdInvoice();
        $receipt = $this->receive($id, 98500)->assertCreated()->json('id');
        $this->postJson($this->url("/receipts/{$receipt}/post"))->assertOk();

        $this->assertSame('paid', DB::table('accounts_invoices')->where('id', $id)->value('status'));
        $ledger = $this->ledger();
        $this->assertSame([0.0, -560.0], [$ledger['1200-AR'], $ledger['5500-Forex-Gain-Loss']]);
    }

    public function test_a_part_payment_settles_dollars_at_the_days_rate(): void
    {
        $id = $this->usdInvoice();
        $receipt = $this->receive($id, 42000)->assertCreated()->json('id');
        $this->postJson($this->url("/receipts/{$receipt}/post"))->assertOk();

        $invoice = DB::table('accounts_invoices')->find($id);
        $this->assertSame(['partially_paid', 500.0], [$invoice->status, (float) $invoice->amount_paid]);
        // USD 680 still owed, carried at 83.
        $ledger = $this->ledger();
        $this->assertSame([56440.0, -500.0], [$ledger['1200-AR'], $ledger['5500-Forex-Gain-Loss']]);
    }

    /** The unpaid part written off is valued at the invoice's rate: it was never received, so it carries no exchange. */
    public function test_writing_off_the_rest_of_a_usd_bill_clears_the_receivable(): void
    {
        $id = $this->usdInvoice();
        $receipt = $this->receive($id, 42000, 'write_off')->assertCreated()->json('id');
        $this->postJson($this->url("/receipts/{$receipt}/post"))->assertOk();

        $ledger = $this->ledger();
        // USD 680 × 83 = ₹56,440 to bank charges; ₹500 exchange; the receivable nets to nothing.
        $this->assertSame([0.0, 56440.0, -500.0], [$ledger['1200-AR'], $ledger['5100-Bank-Charges'], $ledger['5500-Forex-Gain-Loss']]);
    }

    public function test_a_receipt_on_a_day_with_no_rate_is_refused(): void
    {
        $id = $this->usdInvoice();

        // 5 September: nothing on file within the week before it.
        $this->receive($id, 42000, null, '2026-09-05')->assertStatus(422)->assertJsonPath('reason', 'no_exchange_rate');
        $this->assertSame(0, DB::table('accounts_receipts')->where('agent_id', $this->branch->id)->count());
    }

    public function test_more_rupees_than_the_bill_is_worth_are_refused(): void
    {
        $id = $this->usdInvoice();

        // ₹1,20,000 ÷ 84 = USD 1,428.57 against USD 1,180 — beyond the 2% band.
        $this->receive($id, 120000)->assertStatus(422)->assertJsonPath('reason', 'over_allocated_invoice');
    }

    /** Matched from the bank, the same rule — the screen that closes a bill cannot change what it settles. */
    public function test_a_bank_match_settles_the_same_way(): void
    {
        $id = $this->usdInvoice();
        $line = DB::table('bank_transactions')->insertGetId(['agent_id' => $this->branch->id, 'provider' => 'manual',
            'plaid_transaction_id' => 'UTR-FX-1', 'reference' => 'UTR-FX-1', 'amount' => 99120, 'value_date' => '2026-09-25',
            'direction' => 'credit', 'narration' => 'SWIFT GLOBEX', 'reconciliation_status' => 'unreconciled',
            'currency' => 'INR', 'created_at' => now(), 'updated_at' => now()]);

        // Suggested at the day's rate, never as an exact match.
        $suggested = collect($this->as($this->accounts)->getJson($this->url("/reconciliation/{$line}/candidates"))->json('candidates'))
            ->firstWhere('invoice.id', $id);
        $this->assertSame('medium', $suggested['confidence'] ?? null);

        $this->postJson($this->url("/reconciliation/{$line}/match"), ['invoice_id' => $id])->assertOk();

        $this->assertSame(['paid', 1180.0], [DB::table('accounts_invoices')->where('id', $id)->value('status'),
            (float) DB::table('accounts_invoices')->where('id', $id)->value('amount_paid')]);
        $ledger = $this->ledger();
        $this->assertSame([0.0, -1180.0], [$ledger['1200-AR'], $ledger['5500-Forex-Gain-Loss']]);
    }

    // ─── Fetching rates ──────────────────────────────────────────────────────

    /** CurrencyFreaks' free plan quotes per US dollar: rupees per X = rupees per dollar ÷ X per dollar. */
    public function test_todays_rates_are_stored_in_rupees_per_unit(): void
    {
        config(['services.currency_rate.token' => 'test-key', 'services.currency_rate.symbols' => ['USD', 'EUR']]);
        Http::fake(['api.currencyfreaks.com/*' => Http::response(['date' => '2026-09-26 09:00:00+00', 'base' => 'USD',
            'rates' => ['INR' => '83.5', 'EUR' => '0.9', 'USD' => '1.0']])]);

        $this->assertSame(2, app(ExchangeRateService::class)->fetchLatest());

        $stored = DB::table('exchange_rates')->where('rate_date', '2026-09-26')->pluck('rate', 'from_currency');
        $this->assertEquals([83.5, 92.777778], [(float) $stored['USD'], (float) $stored['EUR']]);
        Http::assertSent(fn ($r) => str_contains($r->url(), 'symbols=USD%2CEUR%2CINR'));
    }

    public function test_no_key_means_no_call_and_nothing_stored(): void
    {
        Http::fake();

        $this->assertSame(0, app(ExchangeRateService::class)->fetchLatest());
        Http::assertNothingSent();
        $this->as($this->accounts)->postJson($this->url('/finance-settings/exchange-rates/fetch'))
            ->assertStatus(422)->assertJsonPath('reason', 'no_rate_key');
    }

    public function test_a_rate_stands_for_a_week_and_rupees_are_always_one(): void
    {
        $fx = app(ExchangeRateService::class);

        $this->assertSame([83.0, 83.0, null, 84.0, 1.0], [
            $fx->rate('USD', '2026-09-10'), $fx->rate('USD', '2026-09-17'), $fx->rate('USD', '2026-09-18'),
            $fx->rate('usd', '2026-09-26'), $fx->rate('INR', '1999-01-01'),
        ]);
    }
}
