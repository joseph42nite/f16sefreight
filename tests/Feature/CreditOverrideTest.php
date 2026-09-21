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
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Issuing an invoice over a client's credit limit (PRD §251, user 2026-09-21).
 *
 * 🔴 The `overrideCreditHold` ability was defined and wired to NOTHING, so the only way past the gate was to
 * quietly raise the client's limit — which leaves no record and weakens the gate for every future shipment.
 */
class CreditOverrideTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Override Co', 'code' => 'OVR', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-ovr@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        // Owes nothing yet, and may owe at most 10,000.
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Overdrawn Ltd',
            'email_domain' => 'overdrawn.test', 'credit_limit' => 10000]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function draft(float $total): AccountsInvoice
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-OVRBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-OVRBOM-26-' . random_int(1000, 9999)]);

        $invoice = AccountsInvoice::create(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'customer_id' => $this->client->id, 'billed_party_type' => 'customer',
            'billed_party_id' => $this->client->id, 'billed_party_role' => 'client',
            'invoice_no' => AccountsInvoice::placeholderNumber($job->id), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'draft', 'currency' => 'INR', 'exchange_rate' => 1]);

        $invoice->items()->create(['charge_type' => 'freight', 'description' => 'Air freight', 'quantity' => 1,
            'rate' => $total, 'amount' => $total, 'tax_percentage' => 0, 'tax_amount' => 0, 'net_amount' => $total]);

        return $invoice;
    }

    public function test_the_refusal_says_whether_there_is_a_way_through(): void
    {
        $invoice = $this->draft(50000);

        $body = $this->as($this->accounts)
            ->postJson("http://accounts.localhost/api/invoices/{$invoice->id}/finalize")
            ->assertStatus(422)->json();

        $this->assertSame('credit_limit_exceeded', $body['reason']);
        // ⚠️ Said plainly, so the desk is not left guessing.
        $this->assertTrue($body['can_override']);
        $this->assertStringContainsString('Finalize again with a reason', $body['override_hint']);

        // 🔴 And the number was NOT burned: a refused invoice keeps its placeholder.
        $this->assertTrue($invoice->fresh()->needsNumber());
    }

    public function test_an_override_needs_a_reason_and_is_recorded_on_the_invoice(): void
    {
        $invoice = $this->draft(50000);

        // 🔴 An override with no answer to "why" is indistinguishable from clicking through a warning.
        $this->as($this->accounts)
            ->postJson("http://accounts.localhost/api/invoices/{$invoice->id}/finalize",
                ['override_credit_hold' => true])
            ->assertStatus(422);

        $this->postJson("http://accounts.localhost/api/invoices/{$invoice->id}/finalize", [
            'override_credit_hold' => true,
            'override_reason' => 'Anita agreed it on the phone; their cheque clears Friday.',
        ])->assertOk();

        $finalized = $invoice->fresh();

        $this->assertSame('finalized', $finalized->status);
        $this->assertStringStartsWith('INV-OVRBOM-26-', $finalized->invoice_no);
        // Recorded on the DOCUMENT, so whoever opens it in a year can see what happened.
        $this->assertStringContainsString('Anita agreed it', $finalized->credit_override_reason);
        $this->assertSame($this->accounts->id, (int) $finalized->credit_override_by);
        $this->assertNotNull($finalized->credit_override_at);
    }

    public function test_an_invoice_inside_the_limit_is_untouched_by_any_of_this(): void
    {
        $invoice = $this->draft(5000);

        $this->as($this->accounts)
            ->postJson("http://accounts.localhost/api/invoices/{$invoice->id}/finalize")->assertOk();

        $this->assertNull($invoice->fresh()->credit_override_reason, 'nothing was overridden');
    }

    public function test_pricing_cannot_override_even_where_it_could_finalize(): void
    {
        $invoice = $this->draft(50000);

        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-ovr@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        // 🔒 Pricing cannot finalize at all, so it certainly cannot override.
        $this->as($pricing)->postJson("http://focusair.localhost/api/invoices/{$invoice->id}/finalize", [
            'override_credit_hold' => true, 'override_reason' => 'I would like to',
        ])->assertForbidden();

        $this->assertSame('draft', $invoice->fresh()->status);
    }
}
