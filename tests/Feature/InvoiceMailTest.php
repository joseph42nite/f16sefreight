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
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * The invoice mail (owner, 2026-10-10): once the shipment is executed and pricing's cost sheet is billed, accounts
 * sends the invoice to the client's accounts team, the AWB and the invoice number in the subject. Finalizing drafts it;
 * accounts sends it from their own Outlook (with the bill as a PDF), changes it, or skips it — it never goes by itself.
 */
class InvoiceMailTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private array $sent = [];

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Mail Co', 'code' => 'IML', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Asha', 'email' => 'accounts-iml@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test',
            'payment_terms_days' => 30, 'credit_limit' => null]);

        // The client's people: shipping writes most, but the bill goes to whoever handles accounts.
        foreach ([['shipping@globex.test', 12, null], ['finance@globex.test', 2, 'Accounts payable']] as [$email, $count, $role]) {
            DB::table('customer_contacts')->insert(['company_id' => $company->id, 'customer_id' => $this->client->id,
                'email' => $email, 'designation' => $role, 'source' => 'inbound_harvest', 'message_count' => $count,
                'created_at' => now(), 'updated_at' => now()]);
        }

        DB::table('mailbox_connections')->insert(['agent_id' => $this->branch->id, 'user_id' => $this->accounts->id,
            'email_address' => 'accounts-iml-' . uniqid() . '@test.local', 'provider' => 'outlook', 'is_active' => 1,
            'auth_state' => 'connected', 'created_at' => now(), 'updated_at' => now()]);

        Http::fake(function ($request) {
            $this->sent[] = $request;

            return Http::response(['id' => 'x'], 202);
        });
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** A draft invoice for an executed air shipment, finalized by accounts. */
    private function finalized(string $type = 'invoice'): AccountsInvoice
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-IMLBOM-26-' . random_int(1000, 9999), 'origin_code' => 'BOM', 'dest_code' => 'FRA']);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'execution_job_no' => 'JOBA-IMLBOM-26-' . random_int(1000, 9999),
            'awb_number' => '176-12345675']);
        $invoice = AccountsInvoice::create(['agent_id' => $this->branch->id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id,
            'billed_party_role' => 'client', 'created_by' => $this->accounts->id,
            'invoice_no' => AccountsInvoice::placeholderNumber($job->id), 'type' => $type,
            'document_date' => '2026-10-09', 'status' => 'draft', 'currency' => 'INR', 'exchange_rate' => 1]);
        $invoice->items()->create(['charge_type' => 'air_freight', 'description' => 'Air freight', 'quantity' => 240, 'rate' => 180,
            'amount' => 43200, 'tax_percentage' => 18, 'tax_amount' => 7776, 'net_amount' => 50976]);

        $this->as($this->accounts)->postJson($this->url("/invoices/{$invoice->id}/finalize"))->assertOk();

        return $invoice->fresh();
    }

    public function test_finalizing_drafts_the_mail_to_the_clients_accounts_and_sends_nothing(): void
    {
        $invoice = $this->finalized();

        $mail = $this->as($this->accounts)->getJson($this->url("/billing/{$invoice->id}"))->assertOk()->json('client_mail');

        $this->assertSame('waiting', $mail['state']);
        $this->assertSame(['finance@globex.test'], $mail['to'], 'Accounts payable, not the busiest address.');
        $this->assertSame("Invoice {$invoice->invoice_no} · AWB 176-12345675", $mail['subject']);
        $this->assertStringContainsString('INR 50,976.00', $mail['body']);
        $this->assertStringContainsString('08 Nov 2026', $mail['body'], 'Due on the client\'s 30-day terms.');
        $this->assertStringNotContainsString($invoice->job->execution_job_no, $mail['subject'] . $mail['body'], 'The job number is ours.');
        $this->assertSame([], $this->sent);
    }

    public function test_accounts_sends_it_as_edited_with_the_bill_attached_once(): void
    {
        $invoice = $this->finalized();

        $this->as($this->accounts)->postJson($this->url("/billing/{$invoice->id}/client-mail"), [
            'decision' => 'send', 'to' => ['finance@globex.test'], 'cc' => ['shipping@globex.test'],
            'subject' => "Invoice {$invoice->invoice_no} · AWB 176-12345675", 'body' => 'Hello, the bill is attached. Asha',
        ])->assertOk()->assertJsonPath('client_mail.state', 'sent');

        $payload = collect($this->sent)->map(fn ($r) => json_encode($r->data()))->implode(' ');
        $this->assertStringContainsString('the bill is attached', $payload);
        $this->assertStringContainsString($invoice->invoice_no . '.pdf', $payload);
        $this->assertStringContainsString('shipping@globex.test', $payload);

        // Sent once: a second send finds nothing waiting.
        $this->as($this->accounts)->postJson($this->url("/billing/{$invoice->id}/client-mail"), ['decision' => 'send'])
            ->assertStatus(409);
    }

    public function test_a_skipped_mail_is_kept_and_never_sent(): void
    {
        $invoice = $this->finalized();

        $this->as($this->accounts)->postJson($this->url("/billing/{$invoice->id}/client-mail"), ['decision' => 'skip'])
            ->assertOk()->assertJsonPath('client_mail.state', 'skipped')
            ->assertJsonPath('client_mail.subject', "Invoice {$invoice->invoice_no} · AWB 176-12345675");

        $this->assertSame([], $this->sent);
    }

    public function test_it_goes_from_the_senders_own_outlook_or_not_at_all(): void
    {
        $invoice = $this->finalized();
        DB::table('mailbox_connections')->where('user_id', $this->accounts->id)->update(['is_active' => 0]);

        $this->as($this->accounts)->postJson($this->url("/billing/{$invoice->id}/client-mail"), ['decision' => 'send'])
            ->assertStatus(422)->assertJsonPath('reason', 'no_mailbox');
        $this->assertSame('waiting', $invoice->fresh()->client_mail['state']);
    }

    /** A credit note gives money back: nobody is asked to pay it, so there is no bill to send. */
    public function test_a_credit_note_drafts_no_mail(): void
    {
        $this->assertNull($this->finalized('credit_note')->client_mail);
    }
}
