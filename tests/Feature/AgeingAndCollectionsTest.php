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
 * Ageing and collections (user, 2026-09-20): who owes what, for how long, and what has been done about it.
 */
class AgeingAndCollectionsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $slow;
    private Customer $prompt;
    private Partner $agentPartner;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.openrouter.key' => null]); // the plain template: no model in tests
        $company = Company::create(['name' => 'Ageing Co', 'code' => 'AGE', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-age@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);

        $this->slow = Customer::create(['company_id' => $company->id, 'name' => 'Slow Pay Exports', 'email_domain' => 'slowpay.test',
            'credit_limit' => 500000]);
        $this->prompt = Customer::create(['company_id' => $company->id, 'name' => 'Prompt Traders', 'email_domain' => 'prompt.test']);
        $this->agentPartner = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Skyline DXB', 'partner_type' => 'agent', 'email' => 'ap@skyline.test']);

        DB::table('customer_contacts')->insert(['company_id' => $company->id, 'customer_id' => $this->slow->id,
            'email' => 'ap@slowpay.test', 'source' => 'inbound_harvest', 'message_count' => 7,
            'created_at' => now(), 'updated_at' => now()]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** A finalized document, dated and due when we say, for whoever we say. */
    private function bill(float $total, int $dueDaysAgo, ?Customer $customer = null, ?Partner $partner = null,
        string $type = 'invoice', float $paid = 0, ?string $dueDate = null): AccountsInvoice
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-AGEBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-AGEBOM-26-' . random_int(1000, 9999)]);

        return AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'customer_id' => $customer?->id,
            'billed_party_type' => $partner !== null ? 'partner' : 'customer',
            'billed_party_id' => $partner?->id ?? $customer?->id,
            'billed_party_role' => $partner !== null ? 'agent' : 'client',
            'invoice_no' => strtoupper(substr($type, 0, 3)) . '-AGE-' . random_int(1000, 9999),
            'type' => $type, 'document_date' => now()->subDays($dueDaysAgo + 30)->toDateString(),
            'due_date' => $dueDate ?? now()->subDays($dueDaysAgo)->toDateString(),
            'status' => $paid > 0 ? 'partially_paid' : 'sent', 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => $total, 'tax_amount' => 0, 'grand_total' => $total, 'amount_paid' => $paid,
        ]);
    }

    public function test_every_open_document_falls_into_a_bucket_measured_from_its_due_date(): void
    {
        $this->bill(10000, -10, $this->slow);            // due in 10 days — not due yet
        $this->bill(20000, 5, $this->slow);              // 5 days past due
        $this->bill(30000, 45, $this->slow);             // 45
        $this->bill(40000, 75, $this->slow);             // 75
        $this->bill(50000, 200, $this->slow);            // 200
        $this->bill(7000, 15, $this->prompt, null, 'invoice', 5000);   // 2,000 left, 15 days over
        $this->bill(18500, 20, null, $this->agentPartner);             // an AGENT owes us too

        $body = $this->as($this->accounts)->getJson($this->url('/ageing'))->assertOk()->json();
        $parties = collect($body['parties'])->keyBy('name');

        $this->assertSame([10000.0, 20000.0, 30000.0, 40000.0, 50000.0], array_map('floatval', [
            $parties['Slow Pay Exports']['not_due'], $parties['Slow Pay Exports']['d1_30'],
            $parties['Slow Pay Exports']['d31_60'], $parties['Slow Pay Exports']['d61_90'],
            $parties['Slow Pay Exports']['d90_plus'],
        ]));
        $this->assertSame([150000.0, 140000.0], array_map('floatval',
            [$parties['Slow Pay Exports']['total'], $parties['Slow Pay Exports']['overdue']]));
        $this->assertSame(200, $parties['Slow Pay Exports']['oldest_days']);

        // Only what is still owed on a part-paid bill is aged.
        $this->assertSame(2000.0, (float) $parties['Prompt Traders']['d1_30']);
        // An agent is aged beside the clients — a brokerage bill is a receivable like any other.
        $this->assertSame(['partner', 18500.0], [$parties['Skyline DXB']['party_type'], (float) $parties['Skyline DXB']['total']]);

        $this->assertSame(170500.0, (float) $body['totals']['total']);
        $this->assertSame(160500.0, (float) $body['totals']['overdue']);
    }

    public function test_an_older_invoice_that_names_only_the_customer_ages_under_the_same_organization(): void
    {
        $this->bill(30000, 20, $this->slow);
        // 🔴 Invoices raised before `billed_party_id` was filled in carry only `customer_id`. Grouped on the raw
        // column they split one client into two rows — a NULL row and a real one — each owing half.
        $older = $this->bill(45000, 50, $this->slow);
        AccountsInvoice::withoutTenantScope()->where('id', $older->id)
            ->update(['billed_party_id' => null, 'billed_party_type' => null]);

        $parties = collect($this->as($this->accounts)->getJson($this->url('/ageing'))->json('parties'));

        $this->assertCount(1, $parties, 'one client, one row');
        $this->assertSame([2, 75000.0], [$parties[0]['documents'], (float) $parties[0]['total']]);

        // And opening them finds both documents, not only the one that names them twice.
        $this->assertCount(2, $this->getJson($this->url("/ageing/customer/{$this->slow->id}"))->json('documents'));
    }

    public function test_a_credit_note_reduces_what_they_owe_in_the_ageing_and_in_the_credit_gate(): void
    {
        $this->bill(100000, 10, $this->slow);
        $this->bill(15000, 10, $this->slow, null, 'credit_note');

        $parties = collect($this->as($this->accounts)->getJson($this->url('/ageing'))->json('parties'))->keyBy('name');

        // 🔴 Its face is positive; it takes money OFF what they owe.
        $this->assertSame(85000.0, (float) $parties['Slow Pay Exports']['total']);

        // The credit gate reads the same figure — one definition of what they owe, not two.
        $credit = $this->getJson($this->url("/customers/{$this->slow->id}/credit"))->assertOk()->json();
        $this->assertSame(85000.0, (float) $credit['branch']['exposure']);
    }

    public function test_a_bill_with_no_due_date_ages_from_its_document_date_and_says_so(): void
    {
        $bill = $this->bill(9000, 0, $this->slow);
        AccountsInvoice::withoutTenantScope()->where('id', $bill->id)->update(['due_date' => null]);

        $document = collect($this->as($this->accounts)
            ->getJson($this->url("/ageing/customer/{$this->slow->id}"))->assertOk()->json('documents'))->first();

        $this->assertTrue($document['due_assumed'], 'the screen must say the due date was assumed');
        $this->assertSame(30, $document['days_overdue'], 'dated 30 days ago, so 30 days old');
        $this->assertSame('d1_30', $document['bucket']);
    }

    public function test_the_queue_puts_a_broken_promise_first_and_then_whoever_nobody_has_called(): void
    {
        $this->bill(60000, 40, $this->slow);
        $this->bill(90000, 20, $this->prompt);

        // Slow Pay promised to pay last week and did not.
        $this->as($this->accounts)->postJson($this->url('/collections/follow-ups'), [
            'agent_id' => $this->branch->id, 'party_type' => 'customer', 'party_id' => $this->slow->id,
            'channel' => 'call', 'note' => 'Spoke to Ravi in AP; said the run goes out Friday.',
            'promised_date' => now()->subDays(6)->toDateString(), 'promised_amount' => 60000,
            'next_action_date' => now()->toDateString(),
        ])->assertCreated();

        $body = $this->getJson($this->url('/collections'))->assertOk()->json();

        $this->assertSame('Slow Pay Exports', $body['queue'][0]['name']);
        $this->assertTrue($body['queue'][0]['promise_broken']);
        $this->assertSame(60000.0, (float) $body['queue'][0]['promised']);
        $this->assertStringContainsString('Ravi in AP', $body['queue'][0]['last_note']);

        $this->assertSame('Prompt Traders', $body['queue'][1]['name']);
        $this->assertTrue($body['queue'][1]['never_chased'], 'nobody has called them at all');

        $this->assertSame([2, 1, 1, 150000.0], [$body['summary']['parties'], $body['summary']['broken_promises'],
            $body['summary']['never_chased'], (float) $body['summary']['overdue']]);
    }

    public function test_a_promise_is_closed_as_kept_or_broken_and_never_deleted(): void
    {
        $this->bill(20000, 30, $this->slow);

        $logged = $this->as($this->accounts)->postJson($this->url('/collections/follow-ups'), [
            'agent_id' => $this->branch->id, 'party_type' => 'customer', 'party_id' => $this->slow->id,
            'note' => 'Emailed a statement.', 'promised_date' => now()->addDays(3)->toDateString(),
            'promised_amount' => 20000, 'next_action_date' => now()->addDays(4)->toDateString(),
        ])->assertCreated()->json();

        $closed = $this->postJson($this->url("/collections/follow-ups/{$logged['id']}/close"),
            ['state' => 'broken', 'outcome_note' => 'Nothing arrived; escalated to the Boss.'])->assertOk()->json();

        $followUp = collect($closed['follow_ups'])->firstWhere('id', $logged['id']);
        $this->assertSame('broken', $followUp['state']);
        $this->assertStringContainsString('escalated', $followUp['outcome_note']);
        $this->assertSame(1, DB::table('collection_follow_ups')->where('id', $logged['id'])->count(), 'it stays on the record');

        // A closed promise no longer holds a place in the queue; they read as never chased again.
        $this->assertTrue($this->getJson($this->url('/collections'))->json('queue.0.never_chased'));
    }

    public function test_the_chase_mail_lists_what_is_overdue_and_goes_to_their_own_contact(): void
    {
        $old = $this->bill(45000, 62, $this->slow);
        $this->bill(12000, -5, $this->slow);     // not due — must not be chased

        $draft = $this->as($this->accounts)->postJson($this->url("/ageing/customer/{$this->slow->id}/draft-chase"))
            ->assertOk()->json();

        $this->assertSame('template', $draft['written_by']);
        $this->assertStringContainsString('₹45,000.00 overdue', $draft['subject']);
        $this->assertStringContainsString('the oldest by 62 days', $draft['body']);
        $this->assertStringContainsString($old->invoice_no, $draft['body']);
        $this->assertStringNotContainsString('12,000', $draft['body'], 'a bill that is not due is not chased');
        $this->assertSame(['ap@slowpay.test'], $draft['to']);

        // Nothing overdue, nothing to send.
        $this->postJson($this->url("/ageing/customer/{$this->prompt->id}/draft-chase"))
            ->assertStatus(422)->assertJsonPath('reason', 'nothing_overdue');
    }

    public function test_one_party_opens_with_every_document_its_chases_and_where_a_chase_would_go(): void
    {
        $this->bill(30000, 12, $this->slow);
        $this->bill(5000, 90, $this->slow);

        $body = $this->as($this->accounts)->getJson($this->url("/ageing/customer/{$this->slow->id}"))->assertOk()->json();

        $this->assertSame('Slow Pay Exports', $body['party']['name']);
        $this->assertSame(500000.0, (float) $body['party']['credit_limit']);
        $this->assertSame([35000.0, 35000.0], [(float) $body['total'], (float) $body['overdue']]);
        $this->assertSame(90, $body['documents'][0]['days_overdue'], 'the oldest first');
        $this->assertSame(['ap@slowpay.test'], $body['contacts']);
    }

    public function test_the_ageing_exports_as_a_csv(): void
    {
        $this->bill(25000, 40, $this->slow);

        $csv = $this->as($this->accounts)->get($this->url('/ageing/export'))->assertOk()->getContent();

        $this->assertStringContainsString('Organization,Documents,"Not due yet","1 – 30 days"', $csv);
        $this->assertStringContainsString('"Slow Pay Exports",1,0,0,25000', $csv);
    }

    public function test_pricing_cannot_read_the_ageing_or_log_a_chase(): void
    {
        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-age@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->getJson('http://focusair.localhost/api/ageing')->assertForbidden();
        $this->postJson('http://focusair.localhost/api/collections/follow-ups', [
            'agent_id' => $this->branch->id, 'party_type' => 'customer', 'party_id' => $this->slow->id, 'note' => 'Hello',
        ])->assertForbidden();
    }
}
