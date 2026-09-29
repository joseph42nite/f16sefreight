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
 * We bill who sent the enquiry (owner, 2026-09-29) — the shipment's client, matched from the sender's mail domain —
 * never the shipper or consignee. Accounts may correct it on a draft, and the shipment's client moves with it.
 */
class BillToSenderTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private Customer $sender;
    private Customer $other;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Sender Co', 'code' => 'SND', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = $this->user('accounts');
        $this->sender = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $this->other = Customer::create(['company_id' => $this->company->id, 'name' => 'Initech', 'email_domain' => 'initech.test']);

        DB::table('accounting_periods')->insert([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function user(string $designation): User
    {
        return User::create(['name' => $designation, 'email' => "{$designation}-snd@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $designation, 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    private function job(?Customer $client): Job
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-SNDBOM-26-' . random_int(1000, 9999), 'customer_id' => $client?->id]);

        return Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'customer_id' => $client?->id, 'execution_job_no' => 'JOBA-SNDBOM-26-' . random_int(1000, 9999)]);
    }

    private function raise(Job $job, array $extra = [])
    {
        return $this->as($this->accounts)->postJson($this->url('/billing/documents'), array_merge([
            'type' => 'invoice', 'job_id' => $job->id,
            'lines' => [['description' => 'Air freight', 'rate' => 10000, 'tax_percentage' => 18]],
        ], $extra));
    }

    public function test_a_shipment_invoice_bills_the_client_who_sent_the_enquiry(): void
    {
        $job = $this->job($this->sender);

        $this->raise($job)->assertCreated();

        $this->assertDatabaseHas('accounts_invoices', ['job_id' => $job->id, 'customer_id' => $this->sender->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $this->sender->id]);
    }

    public function test_another_client_is_refused_and_pointed_at_change_client(): void
    {
        $job = $this->job($this->sender);

        $this->raise($job, ['customer_id' => $this->other->id])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'not_the_shipments_client');

        $this->assertDatabaseMissing('accounts_invoices', ['job_id' => $job->id]);
    }

    public function test_a_shipment_with_no_client_takes_the_one_it_is_billed_to(): void
    {
        $job = $this->job(null);

        $this->raise($job)->assertStatus(422)->assertJsonPath('reason', 'client_required');
        $this->raise($job, ['customer_id' => $this->sender->id])->assertCreated();

        $this->assertSame($this->sender->id, (int) $job->fresh()->customer_id);
    }

    public function test_another_tenants_client_is_never_billed(): void
    {
        $rival = Company::create(['name' => 'Rival', 'code' => 'RVX', 'tier' => 'command']);
        $theirs = Customer::create(['company_id' => $rival->id, 'name' => 'Theirs', 'email_domain' => 'theirs.test']);

        $this->raise($this->job(null), ['customer_id' => $theirs->id])->assertNotFound();
    }

    public function test_accounts_change_the_client_on_a_draft_and_the_shipment_follows(): void
    {
        $job = $this->job($this->sender);
        $first = $this->raise($job)->assertCreated()->json('id') ?? AccountsInvoice::where('job_id', $job->id)->value('id');
        $this->raise($job)->assertCreated();

        $this->as($this->accounts)->putJson($this->url("/billing/{$first}/client"), ['customer_id' => $this->other->id])
            ->assertOk();

        $this->assertSame($this->other->id, (int) $job->fresh()->customer_id, 'The shipment\'s client moves with the bill.');
        $this->assertSame(2, AccountsInvoice::where('job_id', $job->id)->where('customer_id', $this->other->id)
            ->where('billed_party_id', $this->other->id)->count(), 'Every draft on the shipment follows.');
        $this->assertDatabaseHas('audit_logs', ['action' => 'invoice.client_changed', 'model_id' => $first]);
    }

    public function test_the_client_cannot_change_once_a_bill_to_them_is_issued_until_it_is_credited(): void
    {
        $job = $this->job($this->sender);
        $issued = AccountsInvoice::where('id', $this->raise($job)->assertCreated()->json('id'))->first()
            ?? AccountsInvoice::where('job_id', $job->id)->first();
        $this->as($this->accounts)->postJson($this->url("/invoices/{$issued->id}/finalize"))->assertOk();

        $draft = $this->raise($job)->assertCreated()->json('id');

        $this->as($this->accounts)->putJson($this->url("/billing/{$draft}/client"), ['customer_id' => $this->other->id])
            ->assertStatus(422)->assertJsonPath('reason', 'already_billed');

        // A credit note for the whole of it clears the way.
        $this->as($this->accounts)->postJson($this->url('/billing/documents'), [
            'type' => 'credit_note', 'parent_invoice_id' => $issued->id, 'reason' => 'Billed to the wrong client',
            'lines' => [['description' => 'Reversal', 'rate' => 10000, 'tax_percentage' => 18]],
        ])->assertCreated();
        $credit = AccountsInvoice::where('parent_invoice_id', $issued->id)->value('id');
        $this->as($this->accounts)->postJson($this->url("/invoices/{$credit}/finalize"))->assertOk();

        $this->as($this->accounts)->putJson($this->url("/billing/{$draft}/client"), ['customer_id' => $this->other->id])
            ->assertOk();
    }

    public function test_an_issued_bill_is_not_readdressed(): void
    {
        $job = $this->job($this->sender);
        $id = $this->raise($job)->assertCreated()->json('id') ?? AccountsInvoice::where('job_id', $job->id)->value('id');
        $this->as($this->accounts)->postJson($this->url("/invoices/{$id}/finalize"))->assertOk();

        $this->as($this->accounts)->putJson($this->url("/billing/{$id}/client"), ['customer_id' => $this->other->id])
            ->assertStatus(422)->assertJsonPath('reason', 'not_draft');
    }

    public function test_pricing_may_not_change_who_is_billed(): void
    {
        $job = $this->job($this->sender);
        $id = $this->raise($job)->assertCreated()->json('id') ?? AccountsInvoice::where('job_id', $job->id)->value('id');

        $this->as($this->user('pricing'))->putJson($this->url("/billing/{$id}/client"), ['customer_id' => $this->other->id])
            ->assertForbidden();
    }
}
