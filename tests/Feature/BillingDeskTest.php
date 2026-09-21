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
 * The billing desk (user, 2026-09-19): the five sales documents in one register, receipts, bill printing, data
 * export and the e-invoice register.
 */
class BillingDeskTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private Partner $agentPartner;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Billing Co', 'code' => 'BIL', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-bil@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test',
            'gst_no' => '27AAAAA0000A1Z5']);
        $this->agentPartner = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Skyline Agents DXB', 'partner_type' => 'agent', 'email' => 'ap@skyline.test']);

        DB::table('customer_contacts')->insert(['company_id' => $company->id, 'customer_id' => $this->client->id,
            'email' => 'ap@globex.test', 'source' => 'inbound_harvest', 'message_count' => 9,
            'created_at' => now(), 'updated_at' => now()]);

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
            'enquiry_no' => 'ENQA-BILBOM-26-' . random_int(1000, 9999)]);

        return Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-BILBOM-26-' . random_int(1000, 9999), 'awb_number' => '176-' . random_int(10000000, 99999999)]);
    }

    /** A finalized customer invoice with one line. */
    private function invoice(float $amount, float $tax = 0, string $currency = 'INR', float $rate = 1): AccountsInvoice
    {
        $job = $this->job();
        $invoice = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id,
            'billed_party_role' => 'client', 'created_by' => $this->accounts->id,
            'invoice_no' => AccountsInvoice::placeholderNumber($job->id), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'draft', 'currency' => $currency, 'exchange_rate' => $rate,
            'narration' => 'Air freight ' . $job->awb_number,
        ]);
        $invoice->items()->create(['charge_type' => 'freight', 'description' => 'Air freight', 'hsn_sac_code' => '996531',
            'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'tax_percentage' => $amount > 0 ? round($tax / $amount * 100, 2) : 0,
            'tax_amount' => $tax, 'net_amount' => $amount + $tax]);

        $this->as($this->accounts)->postJson($this->url("/invoices/{$invoice->id}/finalize"))->assertOk();

        return $invoice->fresh();
    }

    public function test_the_register_shows_every_document_type_with_its_own_number_and_both_amount_columns(): void
    {
        $invoice = $this->invoice(20000, 3600);
        $dollars = $this->invoice(1000, 0, 'USD', 83.50);

        $note = $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'debit_note', 'parent_invoice_id' => $invoice->id, 'reason' => 'Weight corrected at acceptance',
            'lines' => [['description' => 'Weight difference 40kg', 'rate' => 4000, 'tax_percentage' => 18]],
        ])->assertCreated()->json();

        $this->postJson($this->url("/invoices/{$note['id']}/finalize"))->assertOk();

        $body = $this->getJson($this->url('/billing'))->assertOk()->json();
        $rows = collect($body['rows'])->keyBy('type');

        // Each type numbers off its OWN counter and prefix (PRD §6.3).
        $this->assertStringStartsWith('INV-BILBOM-26-', $rows['invoice']['invoice_no']);
        $this->assertStringStartsWith('DN-BILBOM-26-', $rows['debit_note']['invoice_no']);
        $this->assertSame('Globex', $rows['invoice']['organization']);

        // Amount is what they were billed; Amount (INR) is what it is worth to us. Both, never one.
        $usd = collect($body['rows'])->firstWhere('currency', 'USD');
        $this->assertSame([1000.0, 83500.0], [(float) $usd['amount'], (float) $usd['amount_inr']]);
        $this->assertSame(4720.0, (float) $rows['debit_note']['amount'], 'the note carries its own tax');
        $this->assertSame($dollars->id, $usd['id']);

        // 🔴 A credit note counts the OTHER WAY in the total: its face is positive, but it gives money back.
        $credit = $this->postJson($this->url('/billing/documents'), [
            'type' => 'credit_note', 'parent_invoice_id' => $invoice->id, 'reason' => 'Goodwill',
            'lines' => [['description' => 'Goodwill credit', 'rate' => 1000]],
        ])->assertCreated()->json();
        $this->postJson($this->url("/invoices/{$credit['id']}/finalize"))->assertOk();

        $after = $this->getJson($this->url('/billing'))->assertOk()->json('totals');
        $this->assertSame(round($body['totals']['amount_inr'] - 1000, 2), round($after['amount_inr'], 2));
        $this->assertSame(1000.0, (float) $after['credited_inr']);
    }

    public function test_a_credit_note_may_not_give_back_more_than_the_invoice_was_worth(): void
    {
        $invoice = $this->invoice(10000);

        $room = $this->as($this->accounts)->getJson($this->url("/billing/{$invoice->id}/credit-room"))->assertOk()->json();
        $this->assertSame([10000.0, 0.0, 10000.0], array_map('floatval', [$room['grand_total'], $room['already_credited'], $room['room']]));

        $first = $this->postJson($this->url('/billing/documents'), [
            'type' => 'credit_note', 'parent_invoice_id' => $invoice->id, 'reason' => 'Rate dispute settled',
            'lines' => [['description' => 'Rate adjustment', 'rate' => 6000]],
        ])->assertCreated()->json();
        $this->postJson($this->url("/invoices/{$first['id']}/finalize"))->assertOk();

        // 6,000 of 10,000 is credited, so only 4,000 is left — a second note for 5,000 is refused.
        $second = $this->postJson($this->url('/billing/documents'), [
            'type' => 'credit_note', 'parent_invoice_id' => $invoice->id, 'reason' => 'Goodwill',
            'lines' => [['description' => 'Goodwill credit', 'rate' => 5000]],
        ])->assertCreated()->json();

        $this->postJson($this->url("/invoices/{$second['id']}/finalize"))
            ->assertStatus(422)->assertJsonPath('reason', 'exceeds_parent_invoice');

        $this->assertSame(4000.0, (float) $this->getJson($this->url("/billing/{$invoice->id}/credit-room"))->json('room'));
    }

    public function test_a_credit_note_posts_as_the_mirror_of_the_sale_not_as_negative_revenue(): void
    {
        $invoice = $this->invoice(10000, 1800);
        $note = $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'credit_note', 'parent_invoice_id' => $invoice->id, 'reason' => 'Invoiced in error',
            'lines' => [['description' => 'Reversal', 'rate' => 2000, 'tax_percentage' => 18]],
        ])->assertCreated()->json();
        $this->postJson($this->url("/invoices/{$note['id']}/finalize"))->assertOk();

        $preview = $this->getJson($this->url("/invoices/{$note['id']}/posting-preview"))->assertOk()->json();
        $lines = collect($preview['lines'])->keyBy('code');

        $this->assertTrue($preview['balanced']);
        $this->assertSame(2000.0, (float) $lines['4900-Sales-Adjustments']['debit']);
        $this->assertSame(360.0, (float) $lines['2200-GST-Output']['debit'], 'output tax comes back off the liability');
        $this->assertSame(2360.0, (float) $lines['1200-AR']['credit']);
    }

    public function test_brokerage_and_consol_bills_are_addressed_to_a_partner_and_post_to_their_own_accounts(): void
    {
        $job = $this->job();

        $brokerage = $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'brokerage', 'job_id' => $job->id, 'partner_id' => $this->agentPartner->id, 'basis' => 'percentage_of_freight',
            'narration' => 'Sales commission on ' . $job->awb_number,
            'lines' => [['description' => 'Booking commission 5%', 'rate' => 5000]],
        ])->assertCreated()->json();

        // 🔴 A partner-billed document has NO customer debtor: it must not enter the customer ageing (PRD §6.2).
        $this->assertNull($brokerage['customer_id']);
        $this->assertSame(['partner', 'broker'], [$brokerage['billed_party_type'], $brokerage['billed_party_role']]);
        $this->assertSame($this->agentPartner->id, DB::table('accounts_invoice_brokerage_details')
            ->where('invoice_id', $brokerage['id'])->value('partner_agent_id'));

        $this->postJson($this->url("/invoices/{$brokerage['id']}/finalize"))->assertOk();
        $this->assertStringStartsWith('BRK-BILBOM-26-', AccountsInvoice::withoutTenantScope()->find($brokerage['id'])->invoice_no);

        $lines = collect($this->getJson($this->url("/invoices/{$brokerage['id']}/posting-preview"))->json('lines'))->keyBy('code');
        $this->assertSame(5000.0, (float) $lines['1210-Commission-Receivable']['debit']);
        $this->assertSame(5000.0, (float) $lines['4800-Commission-Revenue']['credit']);

        $consol = $this->postJson($this->url('/billing/documents'), [
            'type' => 'consol_invoice', 'job_id' => $job->id, 'partner_id' => $this->agentPartner->id, 'basis' => 'flat_rate',
            'lines' => [['description' => 'Profit share on consol', 'rate' => 12000]],
        ])->assertCreated()->json();
        $this->postJson($this->url("/invoices/{$consol['id']}/finalize"))->assertOk();

        $this->assertStringStartsWith('CSINV-BILBOM-26-', AccountsInvoice::withoutTenantScope()->find($consol['id'])->invoice_no);
        $consolLines = collect($this->getJson($this->url("/invoices/{$consol['id']}/posting-preview"))->json('lines'))->keyBy('code');
        $this->assertSame(12000.0, (float) $consolLines['1220-AR-Agents']['debit']);
        $this->assertSame(12000.0, (float) $consolLines['4050-Consol-Revenue']['credit']);
    }

    public function test_a_note_can_only_be_raised_against_a_finalized_invoice(): void
    {
        $job = $this->job();
        $draft = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $this->client->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id, 'billed_party_role' => 'client',
            'invoice_no' => AccountsInvoice::placeholderNumber($job->id), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'draft',
        ]);

        $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'credit_note', 'parent_invoice_id' => $draft->id, 'reason' => 'Too soon',
            'lines' => [['description' => 'Nope', 'rate' => 100]],
        ])->assertStatus(422)->assertJsonPath('reason', 'parent_not_finalized');
    }

    public function test_one_receipt_settles_several_documents_and_cannot_be_over_allocated(): void
    {
        $first = $this->invoice(10000);
        $second = $this->invoice(6000);

        $open = $this->as($this->accounts)->getJson($this->url("/receipts/open-documents?customer_id={$this->client->id}"))
            ->assertOk()->json();
        $this->assertSame(16000.0, (float) $open['total']);

        // More than arrived cannot be placed.
        $this->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id, 'receipt_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'amount' => 12000,
            'allocations' => [['invoice_id' => $first->id, 'amount' => 10000], ['invoice_id' => $second->id, 'amount' => 6000]],
        ])->assertStatus(422)->assertJsonPath('reason', 'over_allocated');

        $receipt = $this->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id, 'receipt_date' => now()->toDateString(),
            'mode' => 'bank_transfer', 'reference' => 'UTR-BILL-1', 'amount' => 13000, 'narration' => 'Part settlement',
            'allocations' => [['invoice_id' => $first->id, 'amount' => 10000], ['invoice_id' => $second->id, 'amount' => 3000]],
        ])->assertCreated()->json();

        $this->assertStringStartsWith('RCPT-BILBOM-26-', $receipt['receipt_no']);
        $this->assertSame('paid', AccountsInvoice::withoutTenantScope()->find($first->id)->status);
        $this->assertSame('partially_paid', AccountsInvoice::withoutTenantScope()->find($second->id)->status);
        $this->assertSame(3000.0, (float) AccountsInvoice::withoutTenantScope()->find($second->id)->amount_paid);

        // Cash up, receivable down — and posting it says so.
        $preview = $this->getJson($this->url("/receipts/{$receipt['id']}/posting-preview"))->assertOk()->json();
        $this->assertTrue($preview['balanced']);
        $this->assertSame(13000.0, (float) collect($preview['lines'])->firstWhere('code', '1100-Bank')['debit']);

        $this->postJson($this->url("/receipts/{$receipt['id']}/post"))->assertOk();
        $this->assertTrue((bool) DB::table('accounts_receipts')->where('id', $receipt['id'])->value('is_posted'));
        $this->postJson($this->url("/receipts/{$receipt['id']}/post"))->assertStatus(422)->assertJsonPath('reason', 'already_posted');

        $listed = $this->getJson($this->url('/receipts'))->assertOk()->json('rows.0');
        $this->assertSame([13000.0, 13000.0, 0.0], array_map('floatval', [$listed['amount'], $listed['allocated'], $listed['unallocated']]));
    }

    public function test_a_receipt_cannot_place_more_against_a_document_than_it_still_owes(): void
    {
        $invoice = $this->invoice(5000);

        $this->as($this->accounts)->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id, 'receipt_date' => now()->toDateString(),
            'mode' => 'cheque', 'amount' => 9000,
            'allocations' => [['invoice_id' => $invoice->id, 'amount' => 9000]],
        ])->assertStatus(422)->assertJsonPath('reason', 'over_allocated_invoice');
    }

    public function test_the_chosen_bills_print_as_one_pdf_and_export_as_one_csv(): void
    {
        $first = $this->invoice(20000, 3600);
        $second = $this->invoice(8000);

        $pdf = $this->as($this->accounts)->call('POST', $this->url('/billing/print'), ['ids' => [$first->id, $second->id]]);

        $pdf->assertOk();
        $this->assertSame('application/pdf', $pdf->headers->get('content-type'));
        $this->assertStringStartsWith('%PDF-', $pdf->getContent());

        $csv = $this->get($this->url('/billing/export'))->assertOk();
        $body = $csv->getContent();

        $this->assertStringContainsString('"Trans No.",Date,Type,Organization', $body);
        $this->assertStringContainsString($first->fresh()->invoice_no, $body);
        $this->assertStringContainsString('Globex', $body);

        $this->postJson($this->url('/billing/print'), ['ids' => []])->assertStatus(422)->assertJsonPath('reason', 'nothing_chosen');
    }

    public function test_the_e_invoice_register_separates_what_needs_an_irn_from_what_does_not(): void
    {
        $b2b = $this->invoice(20000, 3600);

        $walkIn = Customer::create(['company_id' => $this->branch->company_id, 'name' => 'Walk-in Exports', 'email_domain' => 'walkin.test']);
        $b2c = $this->invoice(4000);
        AccountsInvoice::withoutTenantScope()->where('id', $b2c->id)->update(['customer_id' => $walkIn->id]);

        $body = $this->as($this->accounts)->getJson($this->url('/billing/e-invoice'))->assertOk()->json();
        $rows = collect($body['rows'])->keyBy('id');

        $this->assertSame('pending', $rows[$b2b->id]['state']);
        $this->assertSame('not_required', $rows[$b2c->id]['state'], 'a client with no GSTIN never goes to the portal');
        $this->assertSame(1, $body['waiting']);

        $this->postJson($this->url("/billing/{$b2b->id}/irn"), ['irn' => 'a5c1...e9', 'ack_no' => '112210000123'])->assertOk();
        $this->assertSame('generated', collect($this->getJson($this->url('/billing/e-invoice'))->json('rows'))
            ->firstWhere('id', $b2b->id)['state']);
    }

    public function test_a_document_opens_with_its_lines_its_notes_its_receipts_and_the_journal_it_would_write(): void
    {
        $invoice = $this->invoice(20000, 3600);
        $note = $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'credit_note', 'parent_invoice_id' => $invoice->id, 'reason' => 'Rate dispute',
            'lines' => [['description' => 'Rate adjustment', 'rate' => 1000]],
        ])->assertCreated()->json();
        $this->postJson($this->url("/invoices/{$note['id']}/finalize"))->assertOk();

        $this->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id, 'receipt_date' => now()->toDateString(),
            'mode' => 'upi', 'reference' => 'UPI-1', 'amount' => 5000,
            'allocations' => [['invoice_id' => $invoice->id, 'amount' => 5000]],
        ])->assertCreated();

        $open = $this->getJson($this->url("/billing/{$invoice->id}"))->assertOk()->json();

        $this->assertSame('Invoice', $open['document']['label']);
        $this->assertSame('Globex', $open['document']['organization']['name']);
        $this->assertSame(18600.0, (float) $open['document']['outstanding']);
        $this->assertSame(1, count($open['items']));
        $this->assertSame($note['id'], $open['notes'][0]['id'], 'the note raised against it is on the document');
        $this->assertSame('UPI-1', $open['receipts'][0]->reference ?? $open['receipts'][0]['reference']);
        $this->assertTrue($open['journal']['balanced']);
        // A finalized, unposted, part-paid invoice: not editable, postable, and a note may be raised on it.
        $this->assertSame([false, true, true], [$open['can']['edit'], $open['can']['post'], $open['can']['note']]);
    }

    public function test_a_draft_is_edited_line_by_line_and_the_header_always_follows_the_lines(): void
    {
        $job = $this->job();
        $draft = $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'invoice', 'job_id' => $job->id, 'customer_id' => $this->client->id,
            'narration' => 'Air freight and local charges',
            'lines' => [['description' => 'Air freight', 'hsn_sac_code' => '996531', 'rate' => 10000, 'tax_percentage' => 18]],
        ])->assertCreated()->json();

        $this->assertSame('draft', $draft['status']);
        $this->assertStringStartsWith('DRAFT-', $draft['invoice_no'], 'a draft carries a placeholder until it is finalized');

        $added = $this->postJson($this->url("/billing/{$draft['id']}/lines"), [
            'description' => 'Handling and documentation', 'hsn_sac_code' => '996719', 'rate' => 2000, 'tax_percentage' => 18,
        ])->assertOk()->json();

        $this->assertSame(14160.0, (float) $added['document']['grand_total'], 'the header is re-added from the lines');

        $lineId = collect($added['items'])->firstWhere('description', 'Handling and documentation')['id'];
        $changed = $this->putJson($this->url("/billing/{$draft['id']}/lines/{$lineId}"), [
            'description' => 'Handling, documentation and delivery order', 'rate' => 3000, 'quantity' => 2, 'tax_percentage' => 18,
        ])->assertOk()->json();

        $this->assertSame(18880.0, (float) $changed['document']['grand_total']);

        $this->putJson($this->url("/billing/{$draft['id']}"), [
            'document_date' => '2026-09-14', 'due_date' => '2026-10-14', 'currency' => 'USD', 'exchange_rate' => 83.5,
        ])->assertOk()->assertJsonPath('document.currency', 'USD');

        $this->deleteJson($this->url("/billing/{$draft['id']}/lines/{$lineId}"))
            ->assertOk()->assertJsonPath('document.grand_total', '11800.00');

        // Once it is finalized it is not edited any more — that is what a note is for.
        $this->postJson($this->url("/invoices/{$draft['id']}/finalize"))->assertOk();
        $this->postJson($this->url("/billing/{$draft['id']}/lines"), ['description' => 'Too late', 'rate' => 1])
            ->assertStatus(422)->assertJsonPath('reason', 'not_draft');
    }

    public function test_a_document_is_voided_with_a_reason_and_never_once_it_is_in_the_ledger(): void
    {
        $invoice = $this->invoice(9000);

        $voided = $this->as($this->accounts)->postJson($this->url("/billing/{$invoice->id}/void"),
            ['reason' => 'Raised on the wrong shipment'])->assertOk()->json();

        $this->assertSame('void', $voided['document']['status']);
        $this->assertSame('Raised on the wrong shipment', $voided['document']['reason']);
        // 🔴 It is still in the register: a void document that vanished would leave a hole in the sequence.
        $this->assertNotNull(collect($this->getJson($this->url('/billing?status=void'))->json('rows'))
            ->firstWhere('id', $invoice->id));

        $posted = $this->invoice(4000);
        $this->postJson($this->url("/invoices/{$posted->id}/post"))->assertOk();
        $this->postJson($this->url("/billing/{$posted->id}/void"), ['reason' => 'Changed my mind'])
            ->assertStatus(422)->assertJsonPath('reason', 'already_posted');

        $paid = $this->invoice(7000);
        $this->postJson($this->url('/receipts'), [
            'agent_id' => $this->branch->id, 'payer_id' => $this->client->id, 'receipt_date' => now()->toDateString(),
            'mode' => 'cash', 'amount' => 7000, 'allocations' => [['invoice_id' => $paid->id, 'amount' => 7000]],
        ])->assertCreated();
        $this->postJson($this->url("/billing/{$paid->id}/void"), ['reason' => 'Nope'])
            ->assertStatus(422)->assertJsonPath('reason', 'has_receipts');
        // And the button is not offered in the first place — a rule the screen knows is a rule nobody hits.
        $this->assertFalse($this->getJson($this->url("/billing/{$paid->id}"))->json('can.void'));
    }

    /**
     * 🔴 Opening a draft and pressing Save header must not move its date.
     *
     * The date columns were cast as `date`, which serialises as a UTC timestamp — a document dated the 20th in
     * Asia/Kolkata reached the browser as `2026-09-19T18:30:00Z`, the drawer took the first ten characters for
     * its date box, and saving sent the day BEFORE straight back. That silently changes which accounting period,
     * which ageing bucket and which month's GST a document belongs to.
     */
    public function test_a_document_date_survives_a_round_trip_through_the_drawer(): void
    {
        config(['app.timezone' => 'Asia/Kolkata']);

        $job = $this->job();
        $draft = $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'invoice', 'job_id' => $job->id, 'customer_id' => $this->client->id,
            'document_date' => '2026-09-20', 'due_date' => '2026-10-20',
            'lines' => [['description' => 'Air freight', 'rate' => 10000]],
        ])->assertCreated()->json();

        // What the drawer reads into its date boxes: a plain date, not a timestamp a day early.
        $shown = $this->getJson($this->url("/billing/{$draft['id']}"))->assertOk()->json('document');
        $this->assertSame('2026-09-20', $shown['document_date']);
        $this->assertSame('2026-10-20', $shown['due_date']);

        // Save the header back exactly as the drawer would, having touched nothing.
        $saved = $this->putJson($this->url("/billing/{$draft['id']}"), [
            'document_date' => substr($shown['document_date'], 0, 10),
            'due_date' => substr($shown['due_date'], 0, 10),
            'currency' => 'INR', 'exchange_rate' => 1,
        ])->assertOk()->json('document');

        $this->assertSame('2026-09-20', $saved['document_date'], 'the date must not move');
        $this->assertSame('2026-10-20', $saved['due_date']);
    }

    public function test_pricing_may_not_raise_or_print_a_bill(): void
    {
        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-bil@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->postJson('http://focusair.localhost/api/billing/documents', [
            'type' => 'brokerage', 'job_id' => $this->job()->id, 'partner_id' => $this->agentPartner->id,
            'lines' => [['description' => 'Commission', 'rate' => 100]],
        ])->assertForbidden();
    }
}
