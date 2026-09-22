<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Partner;
use App\Services\GstReturnService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * GSTR-1 and GSTR-3B (user, 2026-09-22) — the return, not the register.
 *
 * 🔴 **The split is the thing that cannot be wrong.** 18% is 18% either way, so the client is billed correctly
 * whichever heads we file it under and nothing looks broken; what breaks is the customer's input credit, and
 * they find out months later. Half of what is asserted here is therefore about refusing to guess.
 */
class GstReturnTest extends TestCase
{
    use DatabaseTransactions;

    /** Maharashtra — so a 27 client is intrastate and a 33 client is interstate. */
    private const OURS = '27AAACF1000A1Z5';

    private Agent $branch;
    private User $accounts;
    private Customer $local;      // 27 — CGST + SGST
    private Customer $faraway;    // 33 — IGST
    private Customer $unregistered;
    private Partner $vendor;      // 27 — input credit splits CGST + SGST
    private int $job;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Return Co', 'code' => 'RTN', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Mumbai',
            'branch_code' => 'BOM', 'gst_no' => self::OURS]);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-rtn@test.local',
            'password' => Hash::make('x'), 'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'accounts', 'is_active' => 1]);

        $this->local = Customer::create(['company_id' => $company->id, 'name' => 'Local Traders',
            'email_domain' => 'local.test', 'gst_no' => '27AAACL1001A1Z5']);
        $this->faraway = Customer::create(['company_id' => $company->id, 'name' => 'Chennai Traders',
            'email_domain' => 'faraway.test', 'gst_no' => '33AAACF1002A1Z5']);
        $this->unregistered = Customer::create(['company_id' => $company->id, 'name' => 'Cash Client',
            'email_domain' => 'cash.test', 'gst_no' => null]);
        $this->vendor = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Local Air', 'partner_type' => 'airline', 'gst_no' => '27AAACV1003A1Z5']);

        $enquiry = DB::table('enquiries')->insertGetId(['agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'status' => 'converted', 'enquiry_no' => 'ENQA-RTNBOM-26-0001', 'customer_id' => $this->local->id,
            'created_at' => now(), 'updated_at' => now()]);
        $this->job = DB::table('jobs')->insertGetId(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry,
            'transport_mode' => 'air', 'execution_job_no' => 'JOBA-RTNBOM-26-0001',
            'customer_id' => $this->local->id, 'created_at' => now(), 'updated_at' => now()]);
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @param list<array{0: float, 1: float, 2: ?string}> $lines  [amount, tax, hsn] per charge line
     */
    private function bill(string $no, string $type, ?Customer $to, array $lines, string $date = '2026-09-10',
        string $status = 'sent', ?float $headerNet = null, ?float $headerTax = null): int
    {
        $net = $headerNet ?? array_sum(array_column($lines, 0));
        $tax = $headerTax ?? array_sum(array_column($lines, 1));

        $id = DB::table('accounts_invoices')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $this->job, 'transport_mode' => 'air',
            'customer_id' => $to?->id, 'billed_party_type' => 'customer', 'billed_party_id' => $to?->id,
            'billed_party_role' => 'client', 'invoice_no' => $no, 'type' => $type, 'document_date' => $date,
            'due_date' => $date, 'status' => $status, 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => $net, 'tax_amount' => $tax, 'grand_total' => $net + $tax,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        foreach ($lines as [$amount, $lineTax, $hsn]) {
            DB::table('accounts_invoice_items')->insert([
                'invoice_id' => $id, 'charge_type' => 'freight', 'description' => 'Freight',
                'hsn_sac_code' => $hsn, 'quantity' => 1, 'rate' => $amount, 'amount' => $amount,
                'tax_percentage' => $amount > 0 ? round($lineTax / $amount * 100, 2) : 0,
                'tax_amount' => $lineTax, 'net_amount' => $amount + $lineTax,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        return $id;
    }

    private function cost(string $no, float $net, float $tax, ?Partner $from = null, string $date = '2026-09-12'): int
    {
        $id = DB::table('accounts_purchase_vouchers')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $this->job, 'vendor_id' => ($from ?? $this->vendor)->id,
            'transport_mode' => 'air', 'voucher_no' => $no, 'document_date' => $date, 'status' => 'unpaid',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $id, 'charge_type' => 'freight',
            'description' => 'Freight cost', 'quantity' => 1, 'rate' => $net, 'amount' => $net,
            'tax_percentage' => $net > 0 ? round($tax / $net * 100, 2) : 0, 'tax_amount' => $tax,
            'net_amount' => $net + $tax, 'created_at' => now(), 'updated_at' => now()]);

        return $id;
    }

    private function gstr1(string $month = '2026-09'): array
    {
        [$from, $to] = GstReturnService::month($month);

        return app(GstReturnService::class)->gstr1($this->branch->id, $from, $to);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    // ─── The split ───────────────────────────────────────────────────────────

    public function test_a_client_in_our_own_state_is_cgst_plus_sgst_and_one_outside_it_is_igst(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);
        $this->bill('INV-RTNBOM-26-0002', 'invoice', $this->faraway, [[50000, 9000, '996531']]);

        $return = $this->gstr1();

        $this->assertCount(2, $return['b2b']);

        $home = collect($return['b2b'])->firstWhere('document_no', 'INV-RTNBOM-26-0001');
        $this->assertSame('intrastate', $home['supply']);
        $this->assertSame(9000.0, $home['cgst']);
        $this->assertSame(9000.0, $home['sgst']);
        $this->assertSame(0.0, $home['igst']);
        $this->assertSame('27', $home['place_of_supply']);

        $away = collect($return['b2b'])->firstWhere('document_no', 'INV-RTNBOM-26-0002');
        $this->assertSame('interstate', $away['supply']);
        $this->assertSame(9000.0, $away['igst']);
        $this->assertSame(0.0, $away['cgst']);
        $this->assertSame('33', $away['place_of_supply']);

        // 🔴 The TOTAL tax is the same either way — 27,000 — which is exactly why a wrong split hides.
        $this->assertSame(27000.0, $return['totals']['tax']);
        $this->assertSame(150000.0, $return['totals']['taxable_value']);
    }

    /** 🔴 The same signing rule as the ageing, the credit gate and the P&L: a credit note subtracts. */
    public function test_a_credit_note_subtracts_and_a_debit_note_adds(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);
        $this->bill('CN-RTNBOM-26-0001', 'credit_note', $this->local, [[10000, 1800, '996531']]);
        $this->bill('DN-RTNBOM-26-0001', 'debit_note', $this->local, [[20000, 3600, '996531']]);

        $return = $this->gstr1();

        $this->assertCount(1, $return['b2b'], 'notes belong in CDNR, not B2B');
        $this->assertCount(2, $return['cdnr']);
        $this->assertSame('C', collect($return['cdnr'])->firstWhere('document_no', 'CN-RTNBOM-26-0001')['note_type']);
        $this->assertSame('D', collect($return['cdnr'])->firstWhere('document_no', 'DN-RTNBOM-26-0001')['note_type']);

        // 100,000 − 10,000 + 20,000 = 110,000; 18,000 − 1,800 + 3,600 = 19,800, halved into two heads.
        $this->assertSame(110000.0, $return['totals']['taxable_value']);
        $this->assertSame(9900.0, $return['totals']['cgst']);
        $this->assertSame(9900.0, $return['totals']['sgst']);
        $this->assertSame(19800.0, $return['totals']['tax']);

        // And the HSN summary nets them off the same way, or it would not add up against the sections above it.
        $this->assertSame(110000.0, $return['hsn'][0]['taxable_value']);
        $this->assertSame(9900.0, $return['hsn'][0]['cgst']);
    }

    /** One document, two rates: GSTR-1 is rate-wise INSIDE each invoice, not one figure per document. */
    public function test_a_mixed_rate_invoice_files_one_line_per_rate(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [
            [100000, 18000, '996531'],   // freight at 18%
            [50000, 2500, '996799'],     // a 5% charge
        ]);

        $rates = collect($this->gstr1()['b2b'][0]['rates']);

        $this->assertCount(2, $rates);
        $this->assertSame(9000.0, $rates->firstWhere('rate', 18.0)['cgst']);
        $this->assertSame(1250.0, $rates->firstWhere('rate', 5.0)['cgst']);
        $this->assertSame(1250.0, $rates->firstWhere('rate', 5.0)['sgst']);
    }

    /**
     * ⚠️ An odd paisa cannot go missing. `GstSplitService` halves the TOTAL and lets SGST absorb the
     * remainder, so the two heads always sum back to the tax actually charged.
     */
    public function test_an_odd_paisa_still_sums_back_to_the_tax_charged(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[555.05, 99.91, '996531']]);

        $doc = $this->gstr1()['b2b'][0];

        $this->assertSame(99.91, round($doc['cgst'] + $doc['sgst'], 2));
        // Half of 99.91 rounds up to 49.96, and SGST is computed as the REMAINDER rather than halved again —
        // which is what makes the pair sum back exactly. Halving the rate instead of the total loses the paisa.
        $this->assertSame(49.96, $doc['cgst']);
        $this->assertSame(49.95, $doc['sgst']);
    }

    /**
     * 🔴 Found in the demo's own output: a charge line with no HSN/SAC produced an `hsn_sc: null` row, and
     * the portal rejects that outright — one unclassified line and the whole return bounces. The DOCUMENT
     * still files (B2B carries rate and value and needs no code); only the summary cannot hold the line. So
     * it is left out and reported, rather than filed blank or the document dropped over a missing code.
     */
    public function test_a_line_with_no_hsn_is_filed_but_left_out_of_the_summary(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [
            [100000, 18000, '996531'],
            [50000, 9000, null],        // no classification code
        ]);

        $return = $this->gstr1();

        // Filed in full: the invoice is a real supply and its tax is real.
        $this->assertCount(1, $return['b2b']);
        $this->assertSame(150000.0, $return['totals']['taxable_value']);
        $this->assertSame(27000.0, $return['totals']['tax']);

        // But the summary carries only the classified line, and never a blank code.
        $this->assertCount(1, $return['hsn']);
        $this->assertSame('996531', $return['hsn'][0]['hsn']);
        $this->assertSame(100000.0, $return['hsn'][0]['taxable_value']);
        $this->assertNotContains(null, array_column($return['hsn'], 'hsn'));

        // And the gap between the two is named, with the value that could not be summarised.
        $warning = collect($return['warnings'])->firstWhere('reason', 'hsn_missing');
        $this->assertNotNull($warning);
        $this->assertSame('INV-RTNBOM-26-0001', $warning['document_no']);
        $this->assertSame(50000.0, $warning['taxable_value']);
    }

    // ─── Refusing to guess ───────────────────────────────────────────────────

    /** 🔴 With no GSTIN of our own there is no return at all — said once, not as 40 identical exceptions. */
    public function test_a_branch_with_no_gstin_can_file_nothing(): void
    {
        $this->branch->update(['gst_no' => null]);
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);

        $return = $this->gstr1();

        $this->assertFalse($return['filable']);
        $this->assertNull($return['gstin']);
        $this->assertSame([], $return['b2b']);
        $this->assertSame('supplier_gstin_missing', $return['exceptions'][0]['reason']);
        $this->assertStringContainsString('Settings', $return['exceptions'][0]['detail']);
    }

    /**
     * 🔴 A taxable supply to an unregistered client is B2CL or B2CS, and both need a PLACE OF SUPPLY that
     * nothing in the schema holds. Guessing the state decides which government gets paid.
     */
    public function test_a_taxable_supply_to_an_unregistered_client_is_not_guessed(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->unregistered, [[100000, 18000, '996531']]);

        $return = $this->gstr1();

        $this->assertSame([], $return['b2b']);
        $this->assertSame('place_of_supply_unknown', $return['exceptions'][0]['reason']);
        $this->assertSame(100000.0, $return['exceptions'][0]['taxable_value']);
        $this->assertSame(18000.0, $return['exceptions'][0]['tax']);
        // Nothing of it reaches the totals — a return that counted it would not reconcile against the file.
        $this->assertSame(0.0, $return['totals']['tax']);
    }

    /** No tax and no counterparty GSTIN is an export, a nil-rated supply or an exempt one — three tables. */
    public function test_a_zero_tax_supply_to_an_unregistered_client_is_not_classified(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->unregistered, [[300000, 0, '996531']]);

        $exception = $this->gstr1()['exceptions'][0];

        $this->assertSame('zero_rated_needs_classification', $exception['reason']);
        $this->assertStringContainsString('shipping bill', $exception['detail']);
    }

    /**
     * 🔴 The ledger posts the HEADER tax and the return reports the LINES, because only the lines carry
     * rates. If the two disagree the return cannot reconcile against the ledger, and filing it is worse than
     * fixing the document.
     */
    public function test_a_document_whose_lines_do_not_add_up_is_not_filed(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']],
            headerNet: 100000, headerTax: 19000);

        $return = $this->gstr1();

        $this->assertSame([], $return['b2b']);
        $this->assertSame('items_disagree_with_header', $return['exceptions'][0]['reason']);
        $this->assertStringContainsString('19,000.00', $return['exceptions'][0]['detail']);
    }

    public function test_a_document_with_no_charge_lines_has_no_rate_to_file_under(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [], headerNet: 100000, headerTax: 18000);

        $this->assertSame('no_line_items', $this->gstr1()['exceptions'][0]['reason']);
    }

    // ─── What is and is not a supply ─────────────────────────────────────────

    /**
     * 🔴 A draft is not a supply — no number, never sent. A void never stood. Neither is filed, but a void
     * is still COUNTED in the document series: a gap in a sequence with nothing explaining it is the first
     * thing an auditor asks about.
     */
    public function test_drafts_are_invisible_and_voids_are_counted_as_cancelled(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);
        $this->bill('INV-RTNBOM-26-0002', 'invoice', $this->local, [[70000, 12600, '996531']], status: 'void');
        $this->bill('INV-RTNBOM-26-0003', 'invoice', $this->local, [[80000, 14400, '996531']], status: 'draft');

        $return = $this->gstr1();

        $this->assertCount(1, $return['b2b']);
        $this->assertSame(18000.0, $return['totals']['tax'], 'neither the void nor the draft is a supply');

        $series = collect($return['docs'])->firstWhere('type', 'invoice');
        $this->assertSame('INV-RTNBOM-26-0001', $series['from']);
        $this->assertSame('INV-RTNBOM-26-0002', $series['to'], 'the void is inside the range declared');
        $this->assertSame(2, $series['issued']);
        $this->assertSame(1, $series['cancelled']);
        $this->assertSame(1, $series['net']);
    }

    /**
     * 🔴 Found by walking a month of the fixture: MIN..MAX gave "0001 to 0004, 2 issued" — a range spanning
     * four numbers with a count of two, because the others were dated into other months. Sequences are per
     * fiscal YEAR and this return is per MONTH, so a month's numbers are not guaranteed contiguous.
     */
    public function test_numbers_issued_in_a_month_are_declared_as_the_runs_they_actually_are(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[10000, 1800, '996531']], date: '2026-09-02');
        $this->bill('INV-RTNBOM-26-0002', 'invoice', $this->local, [[10000, 1800, '996531']], date: '2026-08-20');
        $this->bill('INV-RTNBOM-26-0003', 'invoice', $this->local, [[10000, 1800, '996531']], date: '2026-08-21');
        $this->bill('INV-RTNBOM-26-0004', 'invoice', $this->local, [[10000, 1800, '996531']], date: '2026-09-04');

        $runs = collect($this->gstr1()['docs'])->where('type', 'invoice')->values();

        $this->assertCount(2, $runs, '0001 and 0004 are two runs of one, not one run of four');
        $this->assertSame(['INV-RTNBOM-26-0001', 'INV-RTNBOM-26-0001', 1], [$runs[0]['from'], $runs[0]['to'], $runs[0]['issued']]);
        $this->assertSame(['INV-RTNBOM-26-0004', 'INV-RTNBOM-26-0004', 1], [$runs[1]['from'], $runs[1]['to'], $runs[1]['issued']]);

        // And August's two ARE contiguous, so they are one run.
        $august = collect($this->gstr1('2026-08')['docs'])->where('type', 'invoice')->values();
        $this->assertCount(1, $august);
        $this->assertSame(2, $august[0]['issued']);
    }

    public function test_only_the_month_asked_for_is_returned(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']], date: '2026-09-30');
        $this->bill('INV-RTNBOM-26-0002', 'invoice', $this->local, [[70000, 12600, '996531']], date: '2026-10-01');

        $this->assertSame(18000.0, $this->gstr1('2026-09')['totals']['tax']);
        $this->assertSame(12600.0, $this->gstr1('2026-10')['totals']['tax']);
        $this->assertSame('092026', $this->gstr1('2026-09')['filing_period']);
    }

    // ─── The register as a tripwire ──────────────────────────────────────────

    /**
     * ⚠️ Where the register row written at finalization disagrees with what the documents imply now — the
     * usual cause being a counterparty GSTIN corrected afterwards — the document is still filed, and the
     * disagreement is REPORTED. Which version is the truth is not a question code can answer.
     */
    public function test_a_register_row_that_disagrees_is_reported_and_not_overwritten(): void
    {
        $id = $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);

        // As if it had been finalized while the client still looked like an out-of-state one.
        DB::table('gst_ledger_entries')->insert(['agent_id' => $this->branch->id,
            'company_id' => $this->branch->company_id, 'voucher_id' => $id, 'voucher_type' => 'invoice',
            'cgst_amount' => 0, 'sgst_amount' => 0, 'igst_amount' => 18000,
            'created_at' => now(), 'updated_at' => now()]);

        $return = $this->gstr1();

        $this->assertCount(1, $return['b2b'], 'still filed');
        $this->assertCount(1, $return['warnings']);
        $this->assertSame('register_disagrees', $return['warnings'][0]['reason']);
        $this->assertSame(18000.0, $return['warnings'][0]['registered']['igst']);
        $this->assertSame(9000.0, $return['warnings'][0]['return']['cgst']);
    }

    public function test_a_register_row_that_agrees_says_nothing(): void
    {
        $id = $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);

        DB::table('gst_ledger_entries')->insert(['agent_id' => $this->branch->id,
            'company_id' => $this->branch->company_id, 'voucher_id' => $id, 'voucher_type' => 'invoice',
            'cgst_amount' => 9000, 'sgst_amount' => 9000, 'igst_amount' => 0,
            'created_at' => now(), 'updated_at' => now()]);

        $this->assertSame([], $this->gstr1()['warnings']);
    }

    // ─── 3B and the input side ───────────────────────────────────────────────

    public function test_3b_reports_output_tax_input_credit_and_the_arithmetic_between_them(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);
        $this->cost('PV-RTNBOM-26-0001', 70000, 12600);

        [$from, $to] = GstReturnService::month('2026-09');
        $return = app(GstReturnService::class)->gstr3b($this->branch->id, $from, $to);

        $this->assertSame(9000.0, $return['outward']['cgst']);
        $this->assertSame(6300.0, $return['input_credit']['cgst']);
        $this->assertSame(6300.0, $return['input_credit']['sgst']);
        // 18,000 charged less 12,600 paid = 5,400, split across the two heads it was charged under.
        $this->assertSame(2700.0, $return['difference']['cgst']);
        $this->assertSame(2700.0, $return['difference']['sgst']);
        $this->assertSame(5400.0, $return['difference']['total']);
    }

    /**
     * 🔴 An unregistered vendor cannot have charged us recoverable tax, so no credit is claimed against
     * their voucher. This is the one error the authority notices by itself: their copy comes from the
     * vendor's own GSTR-1, and a claim with nothing behind it is what a notice is written about.
     */
    public function test_no_credit_is_claimed_against_an_unregistered_vendor(): void
    {
        $unregistered = Partner::create(['company_id' => $this->branch->company_id, 'agent_id' => $this->branch->id,
            'name' => 'Cash Trucker', 'partner_type' => 'trucker', 'gst_no' => null]);

        $this->cost('PV-RTNBOM-26-0001', 70000, 12600);
        $this->cost('PV-RTNBOM-26-0002', 40000, 7200, from: $unregistered);

        [$from, $to] = GstReturnService::month('2026-09');
        $return = app(GstReturnService::class)->gstr3b($this->branch->id, $from, $to);

        $this->assertSame(6300.0, $return['input_credit']['cgst'], 'only the registered vendor is claimed');
        $this->assertSame(1, $return['input_credit']['vouchers']);
        $this->assertCount(1, $return['input_excluded']);
        $this->assertSame('PV-RTNBOM-26-0002', $return['input_excluded'][0]['document_no']);
        $this->assertSame(7200.0, $return['input_excluded'][0]['tax']);
    }

    /** ⚠️ 3B carries what GSTR-1 could not place, rather than quietly reporting a smaller month. */
    public function test_3b_names_what_gstr1_left_out(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->unregistered, [[300000, 0, '996531']]);

        [$from, $to] = GstReturnService::month('2026-09');
        $return = app(GstReturnService::class)->gstr3b($this->branch->id, $from, $to);

        $this->assertSame(1, $return['excluded']['count']);
        $this->assertSame(300000.0, $return['excluded']['value']);
    }

    // ─── The endpoint ────────────────────────────────────────────────────────

    /**
     * 🔴 A return is filed per GSTIN, and a GSTIN belongs to one registered place of business. Merging two
     * branches would file one state's supplies under the other's registration.
     */
    public function test_a_branch_of_another_company_is_refused(): void
    {
        $other = Company::create(['name' => 'Someone Else', 'code' => 'ELS', 'tier' => 'command']);
        $theirs = Agent::create(['company_id' => $other->id, 'agent_name' => 'Theirs',
            'branch_code' => 'DEL', 'gst_no' => '07AAACX1000A1Z5']);

        $this->as($this->accounts)
            ->getJson('http://accounts.localhost/api/reports/gstr1?agent_id=' . $theirs->id)
            ->assertStatus(404)
            ->assertJsonPath('reason', 'branch_not_found');
    }

    public function test_the_window_must_be_one_calendar_month(): void
    {
        $this->as($this->accounts)
            ->getJson('http://accounts.localhost/api/reports/gstr1?month=2026-13')
            ->assertStatus(422)
            ->assertJsonPath('reason', 'month_invalid');
    }

    public function test_the_month_defaults_to_the_users_own_branch_and_offers_the_months_that_exist(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']], date: '2026-09-10');
        $this->bill('INV-RTNBOM-26-0002', 'invoice', $this->local, [[70000, 12600, '996531']], date: '2026-07-10');

        $body = $this->as($this->accounts)
            ->getJson('http://accounts.localhost/api/reports/gstr1?month=2026-09')
            ->assertOk()->json();

        $this->assertSame($this->branch->id, $body['branch']['id']);
        $this->assertSame(self::OURS, $body['gstin']);
        $this->assertSame(['2026-09', '2026-07'], array_column($body['months'], 'month'));
    }

    public function test_the_csv_carries_the_documents_it_could_not_file_at_the_bottom(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);
        $this->bill('INV-RTNBOM-26-0002', 'invoice', $this->unregistered, [[300000, 0, '996531']]);

        $csv = $this->as($this->accounts)
            ->get('http://accounts.localhost/api/reports/gstr1?month=2026-09&format=csv')
            ->assertOk()->getContent();

        $this->assertStringContainsString('B2B,"Local Traders",27AAACL1001A1Z5,INV-RTNBOM-26-0001', $csv);
        // 🔴 The whole point of naming an exception is that somebody sees it before the deadline.
        $this->assertStringContainsString('"NOT FILED"', $csv);
        $this->assertStringContainsString('INV-RTNBOM-26-0002', $csv);
        $this->assertStringContainsString('shipping bill', $csv);
    }

    public function test_the_gstn_json_carries_our_gstin_the_filing_period_and_the_invoice_rate_wise(): void
    {
        $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']]);

        $json = json_decode($this->as($this->accounts)
            ->get('http://accounts.localhost/api/reports/gstr1?month=2026-09&format=gstn')
            ->assertOk()->getContent(), true);

        $this->assertSame(self::OURS, $json['gstin']);
        $this->assertSame('092026', $json['fp']);
        $this->assertSame('27AAACL1001A1Z5', $json['b2b'][0]['ctin']);

        $invoice = $json['b2b'][0]['inv'][0];
        $this->assertSame('INV-RTNBOM-26-0001', $invoice['inum']);
        $this->assertSame('10-09-2026', $invoice['idt'], 'the portal takes dd-mm-yyyy');
        // ⚠️ assertEquals, not assertSame: JSON has one number type, so a whole rupee amount comes back as
        // an int. The portal parses numerically and does not care; a test that insisted on the PHP type would
        // fail on every round figure and pass on none.
        $this->assertEquals(118000, $invoice['val'], 'the invoice value is gross');
        $this->assertSame('27', $invoice['pos']);
        $this->assertEquals(18, $invoice['itms'][0]['itm_det']['rt']);
        $this->assertEquals(100000, $invoice['itms'][0]['itm_det']['txval'], 'the item value is net');
        $this->assertEquals(9000, $invoice['itms'][0]['itm_det']['camt']);

        // ⚠️ The aggregate turnover of the previous year is a figure this system does not hold, and a
        // plausible wrong number in a field the portal validates slabs against is worse than an absent one.
        $this->assertArrayNotHasKey('gt', $json);
    }

    // ─── The register, which could not be written at all before today ───────

    /**
     * 🔴 **GAPS #36 in one assertion.** `writeGstRegister()` has been in `InvoiceController` since August and
     * had never once inserted a row, because our own GSTIN had no column: the split was always
     * `supplier_gstin_missing`, so it returned early every time and the register the return is filed from was
     * structurally empty with nothing saying so.
     *
     * ❓ **It is written on POST, not on finalize** — PRD §1555 says *"written whenever a parent document
     * reaches finalized status"*. Flagged rather than changed: when a tax register row is cut is a decision,
     * not a tidy-up. It does not affect what is FILED, because `GstReturnService` reads the documents and a
     * finalized invoice is a supply whether or not the ledger has caught up with it.
     */
    public function test_posting_now_writes_the_gst_register_row_it_never_could(): void
    {
        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'September',
            'start_date' => '2026-09-01', 'end_date' => '2026-09-30', 'status' => 'open',
            'created_at' => now(), 'updated_at' => now()]);

        $id = $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']], status: 'draft');

        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$id}/finalize")->assertOk();
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$id}/post")->assertOk();

        $row = DB::table('gst_ledger_entries')->where('voucher_type', 'invoice')->where('voucher_id', $id)->first();

        $this->assertNotNull($row, 'the register row that GAPS #36 made impossible');
        $this->assertEquals(9000, $row->cgst_amount);
        $this->assertEquals(9000, $row->sgst_amount);
        $this->assertEquals(0, $row->igst_amount);
        // Both columns, because GSTR-1 is filed per GSTIN while the ledger is kept per branch.
        $this->assertSame($this->branch->id, (int) $row->agent_id);
        $this->assertSame($this->branch->company_id, (int) $row->company_id);
    }

    /** ⚠️ And with no GSTIN of our own it still refuses, rather than defaulting to IGST. */
    public function test_posting_without_our_gstin_writes_no_register_row(): void
    {
        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'September',
            'start_date' => '2026-09-01', 'end_date' => '2026-09-30', 'status' => 'open',
            'created_at' => now(), 'updated_at' => now()]);

        $this->branch->update(['gst_no' => null]);
        $id = $this->bill('INV-RTNBOM-26-0001', 'invoice', $this->local, [[100000, 18000, '996531']], status: 'draft');

        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$id}/finalize")->assertOk();
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$id}/post")->assertOk();

        $this->assertDatabaseMissing('gst_ledger_entries', ['voucher_type' => 'invoice', 'voucher_id' => $id]);
    }

    /**
     * 🔴 A brokerage invoice is billed to a PARTNER and carries no `customer_id` at all (PRD §6.2). The
     * register resolved its counterparty from `customer_id` alone, so every brokerage and consol invoice had
     * no counterparty, was undeterminable, and stayed out of the register even with a registered partner —
     * and the return, which resolves the billed party properly, would then have disagreed with it by
     * construction on exactly those documents.
     */
    public function test_a_brokerage_invoice_billed_to_a_partner_reaches_the_register(): void
    {
        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'September',
            'start_date' => '2026-09-01', 'end_date' => '2026-09-30', 'status' => 'open',
            'created_at' => now(), 'updated_at' => now()]);

        $id = $this->bill('BRK-RTNBOM-26-0001', 'brokerage', null, [[40000, 7200, '996531']], status: 'draft');
        DB::table('accounts_invoices')->where('id', $id)->update([
            'billed_party_type' => 'partner', 'billed_party_id' => $this->vendor->id, 'billed_party_role' => 'broker',
        ]);

        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$id}/finalize")->assertOk();
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$id}/post")->assertOk();

        $row = DB::table('gst_ledger_entries')->where('voucher_id', $id)->first();
        $this->assertNotNull($row, 'the partner is registered in 27, so the split is determinable');
        $this->assertEquals(3600, $row->cgst_amount);

        // And the return places it in B2B under the PARTNER's GSTIN, agreeing with the register.
        $filed = collect($this->gstr1()['b2b'])->firstWhere('document_no', 'BRK-RTNBOM-26-0001');
        $this->assertSame('27AAACV1003A1Z5', $filed['counterparty_gstin']);
        $this->assertSame([], $this->gstr1()['warnings'], 'the register and the return agree');
    }

    public function test_sales_cannot_read_a_gst_return(): void
    {
        $sales = User::create(['name' => 'Sales', 'email' => 'sales-rtn@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'sales', 'is_active' => 1]);

        $this->as($sales)->getJson('http://accounts.localhost/api/reports/gstr1')->assertForbidden();
    }
}
