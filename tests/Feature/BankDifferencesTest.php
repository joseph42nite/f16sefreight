<?php

namespace Tests\Feature;

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
 * What actually got credited against what was billed, and the mail that asks about it (user, 2026-09-19).
 */
class BankDifferencesTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.openrouter.key' => null]); // the plain template: no model in tests
        $company = Company::create(['name' => 'Bank Co', 'code' => 'BNK', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-bnk@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        DB::table('customer_contacts')->insert(['company_id' => $company->id, 'customer_id' => $this->client->id,
            'email' => 'accounts@globex.test', 'source' => 'inbound_harvest', 'message_count' => 5, 'created_at' => now(), 'updated_at' => now()]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    private function invoice(float $total, float $paid): int
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-BNKBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-BNKBOM-26-' . random_int(1000, 9999)]);

        return DB::table('accounts_invoices')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'customer_id' => $this->client->id, 'transport_mode' => 'air', 'invoice_no' => 'INV-BNK-' . random_int(100, 999),
            'type' => 'invoice', 'document_date' => '2026-09-10', 'status' => 'partially_paid', 'currency' => 'INR',
            'subtotal' => $total, 'tax_amount' => 0, 'grand_total' => $total, 'amount_paid' => $paid,
            'created_at' => now(), 'updated_at' => now()]);
    }

    public function test_a_bank_statement_is_imported_once_however_often_it_is_sent(): void
    {
        $csv = "Date,Reference,Narration,Credit,Debit\n"
             . "2026-09-15,UTR12345,NEFT GLOBEX EXPORTS,18000.00,\n"
             . "2026-09-16,UTR12346,RTGS ACME,,5000.00\n"
             . "2026-09-16,,NO REFERENCE,900.00,\n";

        $first = $this->as($this->accounts)->postJson($this->url('/reconciliation/import'), ['agent_id' => $this->branch->id, 'csv' => $csv])
            ->assertOk()->json();
        $this->assertSame([2, 0, 1], [$first['imported'], $first['repeated'], $first['skipped']], 'the line with no reference is skipped');

        // Sent again — the webhook, the 3-day sweep, or a person unsure the first one worked.
        $again = $this->postJson($this->url('/reconciliation/import'), ['agent_id' => $this->branch->id, 'csv' => $csv])->assertOk()->json();
        $this->assertSame([0, 2], [$again['imported'], $again['repeated']]);
        $this->assertSame(2, DB::table('bank_transactions')->where('agent_id', $this->branch->id)->count());

        $row = DB::table('bank_transactions')->where('plaid_transaction_id', 'UTR12345')->first();
        $this->assertSame(['credit', 'NEFT GLOBEX EXPORTS', '18000.00', '2026-09-15'],
            [$row->direction, $row->narration, $row->amount, $row->value_date]);
        $this->assertSame('debit', DB::table('bank_transactions')->where('plaid_transaction_id', 'UTR12346')->value('direction'));
    }

    public function test_short_over_and_unplaceable_payments_are_listed_with_their_figures(): void
    {
        $short = $this->invoice(20400, 18000);   // 2,400 still owed
        $over = $this->invoice(10000, 11000);    // 1,000 more than billed

        $bank = fn (string $ref, float $amount, ?int $invoiceId, string $status) => DB::table('bank_transactions')->insertGetId([
            'agent_id' => $this->branch->id, 'provider' => 'manual', 'plaid_transaction_id' => $ref, 'reference' => $ref,
            'amount' => $amount, 'value_date' => '2026-09-15', 'direction' => 'credit', 'narration' => 'NEFT GLOBEX',
            'matched_invoice_id' => $invoiceId, 'reconciliation_status' => $status, 'currency' => 'INR',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $shortRow = $bank('UTR-SHORT', 18000, $short, 'matched');
        $bank('UTR-OVER', 11000, $over, 'matched');
        $bank('UTR-MYSTERY', 7500, null, 'unreconciled');

        $differences = collect($this->as($this->accounts)->getJson($this->url('/reconciliation/differences'))->assertOk()->json('differences'))
            ->keyBy('kind');

        $this->assertSame([20400.0, 18000.0, 2400.0], array_map('floatval',
            [$differences['short']['billed'], $differences['short']['received'], $differences['short']['difference']]));
        $this->assertSame(1000.0, (float) $differences['over']['difference']);
        $this->assertSame([7500.0, null], [(float) $differences['unidentified']['received'], $differences['unidentified']['invoice_no']]);

        // The mail that asks about the short payment: every figure from the facts, addressed to the client's own contact.
        $draft = $this->postJson($this->url("/reconciliation/{$shortRow}/draft-query"), ['kind' => 'short'])->assertOk()->json();

        $this->assertSame('template', $draft['written_by']);
        $this->assertStringContainsString('₹2,400.00 short', $draft['subject']);
        $this->assertStringContainsString('₹18,000.00 reached us on 2026-09-15', $draft['body']);
        $this->assertStringContainsString('under reference UTR-SHORT', $draft['body']);
        $this->assertSame(['accounts@globex.test'], $draft['to']);
    }

    /** Accounts have an inbox of their own — the mail they are on — and never claim a shipment. */
    public function test_accounts_read_their_own_mail_but_cannot_claim(): void
    {
        $mailbox = \App\MailboxConnection::withoutGlobalScopes()->create(['agent_id' => $this->branch->id, 'user_id' => $this->accounts->id,
            'email_address' => 'accounts-bnk@test.local', 'provider' => 'outlook', 'is_active' => 1, 'auth_state' => 'connected']);

        $mine = 'mine-' . uniqid('', true);
        $theirs = 'theirs-' . uniqid('', true);

        foreach ([[$mine, 'accounts-bnk@test.local'], [$theirs, 'pricing-bnk@test.local']] as [$key, $to]) {
            DB::table('email_threads')->insert(['agent_id' => $this->branch->id, 'thread_key' => $key, 'status' => 'new',
                'classification' => 'other', 'latest_message_received_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
            DB::table('email_messages')->insert(['agent_id' => $this->branch->id, 'mailbox_connection_id' => $mailbox->id,
                'thread_key' => $key, 'direction' => 'inbound', 'message_id' => "<{$key}@t>", 'from' => 'accounts@globex.test',
                'to' => $to, 'subject' => 'Remittance advice', 'body_snippet' => 'Payment sent', 'received_at' => now(),
                'created_at' => now(), 'updated_at' => now()]);
        }

        $keys = collect($this->as($this->accounts)->getJson('http://accounts.localhost/api/inbox/threads')->assertOk()->json('data'))
            ->pluck('thread_key');

        $this->assertTrue($keys->contains($mine), 'mail addressed to accounts');
        $this->assertFalse($keys->contains($theirs), 'somebody else\'s mail');

        $threadId = DB::table('email_threads')->where('thread_key', $mine)->value('id');
        $this->postJson("http://accounts.localhost/api/inbox/threads/{$threadId}/claim")->assertForbidden();
    }
}
