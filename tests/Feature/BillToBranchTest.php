<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Bill to another office of the client (owner, 2026-10-10): "when a client sends an AWB from BLR but they mention to
 * bill it to DEL, then that way" — the invoice goes to their Delhi office and its GSTIN. A client's offices are the
 * client rows sharing its email domain, each its own GSTIN. Only the bill moves: the shipment's client stays the office
 * that sent it, and the GST heads, address and dues follow the office billed.
 */
class BillToBranchTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $blr;
    private Customer $del;
    private Customer $other;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Bill Co', 'code' => 'BTB', 'tier' => 'command']);
        // Our branch is in Karnataka (29): a Bengaluru client is intra-state, a Delhi one inter-state.
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BLR', 'branch_code' => 'BLR']);
        DB::table('agents_info')->where('id', $this->branch->id)->update(['gst_no' => '29AABCB1234E1Z5']);
        $this->accounts = User::create(['name' => 'Asha', 'email' => 'accounts-btb@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);

        $client = fn (string $name, string $domain, string $gst) => Customer::create(['company_id' => $company->id, 'name' => $name,
            'email_domain' => $domain, 'gst_no' => $gst, 'credit_limit' => null]);
        $this->blr = $client('Globex Bengaluru', 'globex.test', '29AAACG0000A1Z1');
        $this->del = $client('Globex Delhi', 'globex.test', '07AAACG0000A1Z3');
        $this->other = $client('Initech', 'initech.test', '07AAACI0000A1Z9');

        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'FY 2026-27',
            'start_date' => '2026-04-01', 'end_date' => '2027-03-31', 'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** The draft the cost sheet made for a shipment the Bengaluru office sent. */
    private function draft(): AccountsInvoice
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-BTBBLR-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'customer_id' => $this->blr->id, 'execution_job_no' => 'JOBA-BTBBLR-26-' . random_int(1000, 9999)]);
        $invoice = AccountsInvoice::create(['agent_id' => $this->branch->id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'customer_id' => $this->blr->id, 'billed_party_type' => 'customer', 'billed_party_id' => $this->blr->id,
            'billed_party_role' => 'client', 'invoice_no' => AccountsInvoice::placeholderNumber($job->id), 'type' => 'invoice',
            'document_date' => '2026-10-09', 'status' => 'draft', 'currency' => 'INR', 'exchange_rate' => 1]);
        $invoice->items()->create(['charge_type' => 'air_freight', 'description' => 'Air freight', 'quantity' => 1, 'rate' => 10000,
            'amount' => 10000, 'tax_percentage' => 18, 'tax_amount' => 1800, 'net_amount' => 11800]);

        return $invoice;
    }

    public function test_the_draft_offers_the_clients_other_offices_with_their_gstins(): void
    {
        $options = $this->as($this->accounts)->getJson($this->url('/billing/' . $this->draft()->id))->assertOk()->json('bill_to');

        $this->assertSame([
            ['id' => $this->blr->id, 'name' => 'Globex Bengaluru', 'gst_no' => '29AAACG0000A1Z1'],
            ['id' => $this->del->id, 'name' => 'Globex Delhi', 'gst_no' => '07AAACG0000A1Z3'],
        ], $options);
    }

    public function test_billing_delhi_moves_the_bill_not_the_shipment_and_the_gst_follows(): void
    {
        $invoice = $this->draft();

        $this->as($this->accounts)->postJson($this->url("/billing/{$invoice->id}/bill-to"), ['customer_id' => $this->del->id])
            ->assertOk()->assertJsonPath('document.organization.gst_no', '07AAACG0000A1Z3');

        $this->assertSame([$this->del->id, $this->del->id], [(int) $invoice->fresh()->customer_id, (int) $invoice->fresh()->billed_party_id]);
        $this->assertSame($this->blr->id, (int) $invoice->job->fresh()->customer_id, 'The shipment is still the Bengaluru office\'s.');

        // Delhi from a Karnataka branch is inter-state: IGST, not CGST + SGST.
        $this->postJson($this->url("/invoices/{$invoice->id}/finalize"))->assertOk();
        $this->postJson($this->url("/invoices/{$invoice->id}/post"))->assertOk();
        $row = DB::table('gst_ledger_entries')->where('voucher_type', 'invoice')->where('voucher_id', $invoice->id)->first();
        $this->assertSame([0.0, 0.0, 1800.0], [(float) $row->cgst_amount, (float) $row->sgst_amount, (float) $row->igst_amount]);
    }

    public function test_only_the_same_clients_offices_and_only_on_a_draft(): void
    {
        $invoice = $this->draft();

        $this->as($this->accounts)->postJson($this->url("/billing/{$invoice->id}/bill-to"), ['customer_id' => $this->other->id])
            ->assertStatus(422)->assertJsonPath('reason', 'not_this_client');

        $this->postJson($this->url("/invoices/{$invoice->id}/finalize"))->assertOk();
        $this->postJson($this->url("/billing/{$invoice->id}/bill-to"), ['customer_id' => $this->del->id])->assertStatus(422);
        $this->assertSame($this->blr->id, (int) $invoice->fresh()->customer_id);
    }
}
