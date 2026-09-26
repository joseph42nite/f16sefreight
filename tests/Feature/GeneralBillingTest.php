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
 * General billing — an invoice with no shipment behind it (user, 2026-09-26: "go ahead with your recommendation but
 * you'll give the option to raise credit note and keep all the calculations in mind").
 *
 * Every figure here is worked by hand in the comment beside it. The document set, all to one client registered in 27
 * like the branch, so every split is CGST + SGST:
 *
 *   G   general invoice     50,000 + 9,000 GST  = 59,000
 *   C   credit note on G    10,000 + 1,800      = 11,800   subtracts everywhere
 *   D   debit note on G      5,000 +   900      =  5,900   adds
 *   S   shipment invoice   100,000 + 18,000     = 118,000  with 70,000 of cost booked
 */
class GeneralBillingTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private Job $job;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'General Co', 'code' => 'GEN', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM',
            'gst_no' => '27AAACF1000A1Z5']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-gen@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Local Traders', 'email_domain' => 'local.test',
            'gst_no' => '27AAACL1001A1Z5']);

        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);

        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-GENBOM-26-0001', 'customer_id' => $this->client->id]);
        $this->job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-GENBOM-26-0001', 'customer_id' => $this->client->id]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** Raise, then finalize — and post when asked. */
    private function raise(array $body, bool $post = true): array
    {
        $doc = $this->as($this->accounts)->postJson($this->url('/billing/documents'), $body)->assertCreated()->json();
        $this->postJson($this->url("/invoices/{$doc['id']}/finalize"))->assertOk();

        if ($post) {
            $this->postJson($this->url("/invoices/{$doc['id']}/post"))->assertOk();
        }

        return AccountsInvoice::withoutTenantScope()->find($doc['id'])->toArray();
    }

    private function general(float $amount = 50000, bool $post = true): array
    {
        return $this->raise(['type' => 'invoice', 'general' => true, 'agent_id' => $this->branch->id,
            'customer_id' => $this->client->id,
            'lines' => [['description' => 'Warehousing — September', 'hsn_sac_code' => '996729', 'rate' => $amount, 'tax_percentage' => 18]],
        ], $post);
    }

    private function note(string $type, int $parent, float $amount, bool $post = true): array
    {
        return $this->raise(['type' => $type, 'parent_invoice_id' => $parent, 'reason' => 'Agreed with the client',
            'lines' => [['description' => 'Adjustment', 'hsn_sac_code' => '996729', 'rate' => $amount, 'tax_percentage' => 18]],
        ], $post);
    }

    /** What the ledger holds for one document, by account code: debit − credit. */
    private function journal(int $invoiceId): array
    {
        return DB::table('accounts_ledger_entries as l')->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.source_type', 'invoice')->where('l.source_id', $invoiceId)
            ->selectRaw('c.account_code, ROUND(SUM(l.debit_amount) - SUM(l.credit_amount), 2) AS net')
            ->groupBy('c.account_code')->pluck('net', 'account_code')->map(fn ($v) => (float) $v)->all();
    }

    /** The shipment invoice S, finalized, with 70,000 of cost booked against the job. */
    private function shipmentInvoice(bool $post = false): array
    {
        $s = $this->raise(['type' => 'invoice', 'job_id' => $this->job->id, 'customer_id' => $this->client->id,
            'lines' => [['description' => 'Air freight', 'hsn_sac_code' => '996531', 'rate' => 100000, 'tax_percentage' => 18]],
        ], $post);

        $vendor = Partner::create(['company_id' => $this->branch->company_id, 'agent_id' => $this->branch->id,
            'name' => 'Carrier', 'partner_type' => 'airline']);
        $voucher = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $this->job->id,
            'vendor_id' => $vendor->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-GENBOM-26-0001',
            'document_date' => now()->toDateString(), 'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $voucher, 'charge_type' => 'air_freight',
            'description' => 'Carrier', 'quantity' => 1, 'rate' => 70000, 'amount' => 70000, 'tax_percentage' => 18,
            'tax_amount' => 12600, 'net_amount' => 82600, 'created_at' => now(), 'updated_at' => now()]);

        return $s;
    }

    // ─── Raising one ─────────────────────────────────────────────────────────

    public function test_a_general_invoice_needs_no_shipment_and_takes_a_real_number_on_finalize(): void
    {
        $draft = $this->as($this->accounts)->postJson($this->url('/billing/documents'), ['type' => 'invoice', 'general' => true,
            'agent_id' => $this->branch->id, 'customer_id' => $this->client->id,
            'lines' => [['description' => 'Warehousing', 'rate' => 50000, 'tax_percentage' => 18]]])->assertCreated()->json();

        $this->assertNull($draft['job_id']);
        $this->assertNull($draft['transport_mode']);
        $this->assertStringStartsWith('DRAFT-G', $draft['invoice_no']);
        $this->assertEquals([50000, 9000, 59000], [(float) $draft['subtotal'], (float) $draft['tax_amount'], (float) $draft['grand_total']]);

        $this->postJson($this->url("/invoices/{$draft['id']}/finalize"))->assertOk();
        $this->assertMatchesRegularExpression('/^INV-GENBOM-\d{2}-\d{4}$/',
            AccountsInvoice::withoutTenantScope()->find($draft['id'])->invoice_no, 'the same invoice series as any other');

        $opened = $this->getJson($this->url("/billing/{$draft['id']}"))->assertOk()->json('document');
        $this->assertTrue($opened['general']);
        $this->assertNull($opened['job']);
    }

    public function test_only_an_invoice_may_be_general_and_it_must_name_a_branch(): void
    {
        $line = [['description' => 'x', 'rate' => 100]];

        $this->as($this->accounts)->postJson($this->url('/billing/documents'), ['type' => 'invoice', 'customer_id' => $this->client->id,
            'lines' => $line])->assertStatus(422)->assertJsonPath('reason', 'job_required');
        $this->postJson($this->url('/billing/documents'), ['type' => 'invoice', 'general' => true, 'customer_id' => $this->client->id,
            'lines' => $line])->assertStatus(422)->assertJsonPath('reason', 'branch_not_found');
        $this->postJson($this->url('/billing/documents'), ['type' => 'brokerage', 'general' => true, 'agent_id' => $this->branch->id,
            'job_id' => $this->job->id, 'partner_id' => Partner::create(['company_id' => $this->branch->company_id,
                'agent_id' => $this->branch->id, 'name' => 'Agent', 'partner_type' => 'agent'])->id,
            'lines' => $line])->assertStatus(422)->assertJsonPath('reason', 'general_type');

        $other = Agent::create(['company_id' => Company::create(['name' => 'Other', 'code' => 'OTG', 'tier' => 'command'])->id,
            'agent_name' => 'Delhi', 'branch_code' => 'DEL']);
        $this->postJson($this->url('/billing/documents'), ['type' => 'invoice', 'general' => true, 'agent_id' => $other->id,
            'customer_id' => $this->client->id, 'lines' => $line])->assertStatus(422)->assertJsonPath('reason', 'branch_not_found');
    }

    /** 🔴 And the database itself refuses a brokerage or consol bill with no shipment — not only the validator. */
    public function test_the_database_refuses_a_brokerage_bill_without_a_shipment(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        DB::table('accounts_invoices')->insert(['agent_id' => $this->branch->id, 'job_id' => null, 'invoice_no' => 'BRK-X',
            'type' => 'brokerage', 'document_date' => now()->toDateString(), 'status' => 'draft', 'currency' => 'INR',
            'created_at' => now(), 'updated_at' => now()]);
    }

    // ─── The ledger and the registers ────────────────────────────────────────

    public function test_it_posts_to_other_operating_revenue_and_its_notes_post_as_notes(): void
    {
        $g = $this->general();
        $c = $this->note('credit_note', $g['id'], 10000);
        $d = $this->note('debit_note', $g['id'], 5000);

        // A note follows its parent: no shipment either.
        $this->assertNull($c['job_id']);
        $this->assertNull($d['job_id']);

        // G: Dr AR 59,000 / Cr 4100 50,000 / Cr GST 9,000.
        $this->assertEquals(['1200-AR' => 59000, '2200-GST-Output' => -9000, '4100-Other-Operating-Revenue' => -50000], $this->journal($g['id']));
        // C: the mirror, not negative revenue — Dr 4900 10,000 / Dr GST 1,800 / Cr AR 11,800.
        $this->assertEquals(['1200-AR' => -11800, '2200-GST-Output' => 1800, '4900-Sales-Adjustments' => 10000], $this->journal($c['id']));
        // D: adds, to the same revenue line as its parent.
        $this->assertEquals(['1200-AR' => 5900, '2200-GST-Output' => -900, '4100-Other-Operating-Revenue' => -5000], $this->journal($d['id']));
    }

    public function test_the_gst_register_and_both_returns_count_it_and_the_credit_note_subtracts(): void
    {
        $g = $this->general();
        $this->note('credit_note', $g['id'], 10000);
        $this->note('debit_note', $g['id'], 5000);

        // Register: 9,000 − 1,800 + 900 = 8,100 of tax, halved: 4,050 a head.
        $register = $this->getJson($this->url('/registers/gst'))->assertOk()->json('totals.output');
        $this->assertEquals(['cgst' => 4050, 'sgst' => 4050, 'igst' => 0], $register);

        // The shipment invoice too, finalized — the return reads documents, posted or not.
        $this->shipmentInvoice();
        [$from, $to] = \App\Services\GstReturnService::month(now()->format('Y-m'));
        $gstr1 = app(\App\Services\GstReturnService::class)->gstr1($this->branch->id, $from, $to);

        $this->assertCount(2, $gstr1['b2b'], 'the general invoice files in B2B beside the shipment one');
        $this->assertNotNull(collect($gstr1['b2b'])->firstWhere('document_no', $g['invoice_no']));
        $this->assertCount(2, $gstr1['cdnr'], 'and its two notes in CDNR');
        // 50,000 + 100,000 − 10,000 + 5,000 = 145,000; 9,000 + 18,000 − 1,800 + 900 = 26,100, halved.
        $this->assertSame(145000.0, $gstr1['totals']['taxable_value']);
        $this->assertSame(13050.0, $gstr1['totals']['cgst']);
        $this->assertSame(26100.0, $gstr1['totals']['tax']);

        $gstr3b = app(\App\Services\GstReturnService::class)->gstr3b($this->branch->id, $from, $to);
        $this->assertSame(13050.0, $gstr3b['outward']['cgst']);
    }

    // ─── What the client owes ────────────────────────────────────────────────

    public function test_the_ageing_and_the_credit_gate_count_it_and_the_credit_note_subtracts(): void
    {
        $g = $this->general();
        $this->note('credit_note', $g['id'], 10000);
        $this->note('debit_note', $g['id'], 5000);
        $this->shipmentInvoice();

        // 59,000 − 11,800 + 5,900 + 118,000 = 171,100.
        $party = app(\App\Services\AgeingService::class)->byParty([$this->branch->id])
            ->firstWhere('party_id', $this->client->id);
        $this->assertSame(171100.0, $party['total']);
        $this->assertSame(171100.0, app(\App\Services\CreditGateService::class)->exposure($this->client));
    }

    /** 🔴 A client who deducted TDS on a general invoice paid in full: an asset, the same as on a shipment's. */
    public function test_a_client_who_deducted_tds_on_it_has_paid_in_full(): void
    {
        $g = $this->general();

        // 2% on the 50,000 service value — never on the GST — is 1,000, so 58,000 arrives against 59,000.
        $receipt = $this->postJson($this->url('/receipts'), ['agent_id' => $this->branch->id, 'payer_id' => $this->client->id,
            'receipt_date' => now()->toDateString(), 'mode' => 'bank_transfer', 'reference' => 'UTR-GEN-1', 'amount' => 58000,
            'allocations' => [['invoice_id' => $g['id'], 'amount' => 58000, 'resolution' => 'tds']]])->assertCreated()->json();
        $this->postJson($this->url("/receipts/{$receipt['id']}/post"))->assertOk();

        $this->assertSame('paid', AccountsInvoice::withoutTenantScope()->find($g['id'])->status);
        $entry = DB::table('tds_entries')->where('source_type', 'receipt')->where('source_id', $receipt['id'])->first();
        $this->assertEquals([50000, 1000, 2.0], [(float) $entry->base_amount, (float) $entry->tds_amount, (float) $entry->rate]);
        $this->assertEquals(1000, (float) DB::table('accounts_ledger_entries as l')->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('c.account_code', '1400-TDS-Receivable')->where('l.agent_id', $this->branch->id)->sum('l.debit_amount'));
    }

    // ─── What it is NOT: a shipment ──────────────────────────────────────────

    /**
     * 🔴 Profitability explains revenue by SHIPMENT, and general billing has no shipment and no cost side. It is
     * reported BESIDE the shipments — never among them, where it would lift every margin by revenue nothing was spent
     * to earn — and on the same rules: net of tax, the credit note subtracts, the debit note adds.
     */
    public function test_profitability_reports_it_beside_the_shipments_never_among_them(): void
    {
        $g = $this->general();
        $this->note('credit_note', $g['id'], 10000);
        $this->note('debit_note', $g['id'], 5000);
        $this->shipmentInvoice();

        $report = $this->getJson($this->url('/profitability/jobs'))->assertOk()->json();

        $this->assertCount(1, $report['jobs'], 'one shipment, not two');
        // The shipment alone: 100,000 billed, 70,000 cost, 30,000 margin.
        $this->assertEquals([100000, 70000, 30000], [$report['totals']['revenue'], $report['totals']['cost'], $report['totals']['margin']]);
        // Beside it: 50,000 − 10,000 + 5,000 = 45,000, across three documents.
        $this->assertEquals(45000, $report['general']['revenue']);
        $this->assertSame(3, $report['general']['documents']);

        // A lane has no general billing in it.
        $this->assertEquals(0, $this->getJson($this->url('/profitability/lanes?mode=air'))->json('general.revenue'));
    }

    public function test_it_is_not_a_shipment_to_the_cost_queue_and_the_register_can_list_it_alone(): void
    {
        $g = $this->general();
        $this->shipmentInvoice();   // costed, so nothing is waiting

        $stage = collect($this->getJson($this->url('/money-out/stages'))->assertOk()->json('stages'))->firstWhere('key', 'to_cost');
        $this->assertSame([0, 0.0], [$stage['count'], (float) $stage['amount']], 'no cost to book on billing with no shipment');
        $this->assertSame([], $this->getJson($this->url('/money-out/to-cost'))->json('rows'));

        $general = $this->getJson($this->url('/billing?general=1'))->assertOk()->json('rows');
        $this->assertSame([$g['invoice_no']], array_column($general, 'invoice_no'));
        $this->assertEquals(1, $general[0]['general']);
    }
}
