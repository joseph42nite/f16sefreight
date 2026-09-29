<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * The client payment report card (owner, 2026-09-29: "are their payments on time, the quality score of each client …
 * every month"; GAPS #443). Graded in PHP by due date and receipt date; Jev reads a slipping client's mail; a person
 * confirms it.
 */
class ClientPaymentReportTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private int $seq = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Grade Co', 'code' => 'GRD', 'tier' => 'command', 'ocr_credits_balance' => 50]);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-grd@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
    }

    private function client(string $name, int $terms = 30): Customer
    {
        return Customer::create(['company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => $name,
            'email_domain' => strtolower($name) . '-grd.test', 'payment_terms_days' => $terms]);
    }

    /** A bill due on `$due`, paid by a posted receipt on `$paidOn` (NULL: still unpaid). */
    private function bill(Customer $client, string $due, ?string $paidOn, float $amount = 100000): int
    {
        $this->seq++;
        $id = DB::table('accounts_invoices')->insertGetId(['agent_id' => $this->branch->id, 'customer_id' => $client->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $client->id, 'invoice_no' => "INV-GRD-{$this->seq}", 'type' => 'invoice',
            'document_date' => Carbon::parse($due)->subDays(30)->toDateString(), 'due_date' => $due,
            'status' => $paidOn ? 'paid' : 'sent', 'currency' => 'INR', 'exchange_rate' => 1, 'subtotal' => $amount, 'tax_amount' => 0,
            'grand_total' => $amount, 'amount_paid' => $paidOn ? $amount : 0, 'is_posted' => 1, 'created_at' => now(), 'updated_at' => now()]);

        if ($paidOn) {
            $receipt = DB::table('accounts_receipts')->insertGetId(['agent_id' => $this->branch->id, 'payer_type' => 'customer',
                'payer_id' => $client->id, 'receipt_no' => "RC-GRD-{$this->seq}", 'receipt_date' => $paidOn, 'mode' => 'neft',
                'amount' => $amount, 'currency' => 'INR', 'exchange_rate' => 1, 'is_posted' => 1, 'created_by' => $this->accounts->id,
                'created_at' => now(), 'updated_at' => now()]);
            DB::table('accounts_receipt_allocations')->insert(['receipt_id' => $receipt, 'invoice_id' => $id, 'amount' => $amount,
                'created_at' => now(), 'updated_at' => now()]);
        }

        return $id;
    }

    private function card(Customer $client, string $month = '2026-09'): object
    {
        return DB::table('client_payment_reports')->where('customer_id', $client->id)->where('month', $month . '-01')->first();
    }

    public function test_a_client_who_pays_by_the_due_date_is_an_a(): void
    {
        $good = $this->client('Punctual');
        foreach (['2026-07-10', '2026-08-10', '2026-09-10'] as $due) {
            $this->bill($good, $due, Carbon::parse($due)->subDays(2)->toDateString());
        }

        $this->artisan('clients:payment-report', ['--month' => '2026-09'])->assertSuccessful();

        $card = $this->card($good);
        $this->assertSame([3, 1.0, 0.0, 100, 'A'], [$card->bills_due, (float) $card->on_time_share, (float) $card->avg_days_late, $card->score, $card->grade]);
    }

    /** Late pays count to the receipt's date; unpaid bills count to month end — never left out. */
    public function test_late_and_unpaid_bills_both_count(): void
    {
        $slow = $this->client('Slow');
        $this->bill($slow, '2026-07-10', '2026-07-08');       // on time
        $this->bill($slow, '2026-08-10', '2026-08-30');       // 20 days late
        $this->bill($slow, '2026-09-10', null);               // unpaid: 20 days late at 30 Sep

        $this->artisan('clients:payment-report', ['--month' => '2026-09']);

        $card = $this->card($slow);
        $this->assertEqualsWithDelta(0.3333, (float) $card->on_time_share, 0.0001);
        $this->assertSame(13.3, (float) $card->avg_days_late);
        $this->assertSame(100000.0, (float) $card->overdue_value);
        $this->assertSame(20, $card->oldest_overdue_days);
        $this->assertSame(20, $card->score);   // 100 × 0.333 − 13.3
        $this->assertSame('D', $card->grade);
    }

    /** A bill marked paid with no dated evidence is not judged — its last edit is not when the client paid. */
    public function test_a_paid_bill_with_no_date_of_payment_is_left_out(): void
    {
        $old = $this->client('Legacy');
        foreach (['2026-07-10', '2026-08-10', '2026-09-10'] as $due) {
            $this->bill($old, $due, $due);
        }
        DB::table('accounts_invoices')->where('customer_id', $old->id)->where('due_date', '2026-07-10')
            ->update(['invoice_no' => 'INV-GRD-LEGACY']);
        $legacy = DB::table('accounts_invoices')->where('invoice_no', 'INV-GRD-LEGACY')->value('id');
        DB::table('accounts_receipt_allocations')->where('invoice_id', $legacy)->delete();

        $this->artisan('clients:payment-report', ['--month' => '2026-09']);

        $this->assertSame(2, $this->card($old)->bills_due);
        $this->assertNull($this->card($old)->grade, 'two dated bills are too few to grade');
    }

    public function test_the_trend_reads_against_last_month(): void
    {
        $c = $this->client('Turning');
        $this->bill($c, '2026-06-10', '2026-06-01');
        $this->bill($c, '2026-07-10', '2026-07-01');
        $this->bill($c, '2026-08-10', '2026-08-01');
        $this->bill($c, '2026-09-10', null);

        $this->artisan('clients:payment-report', ['--month' => '2026-08']);
        $this->artisan('clients:payment-report', ['--month' => '2026-09']);

        $this->assertSame('A', $this->card($c, '2026-08')->grade);
        $this->assertSame('worse', $this->card($c)->trend);
    }

    /** Jev reads a slipping client's own mail — only theirs, only when they wrote — and a person confirms it. */
    public function test_jev_reads_a_slipping_clients_mail_and_a_person_confirms_it(): void
    {
        config(['accounts_decisions.enabled' => true, 'services.openrouter.key' => 'test-key']);
        Http::fake(['*/decisions' => Http::response(['model' => 'typesafe/jev-1.13', 'provider' => 'TypeSafe',
            'answers' => ['payment_mail' => ['type' => 'choice', 'choice' => 'disputes_a_bill', 'confidence' => 0.88]],
            'usage' => ['input_tokens' => 700, 'output_tokens' => 10, 'cost' => 0.00003]])]);

        $slow = $this->client('Disputing');
        $this->bill($slow, '2026-08-10', null);
        $this->bill($slow, '2026-09-01', null);
        $this->bill($slow, '2026-09-10', null);
        $good = $this->client('Fine');
        foreach (['2026-07-10', '2026-08-10', '2026-09-10'] as $due) {
            $this->bill($good, $due, $due);
        }
        foreach (['Disputing', 'Fine'] as $who) {
            $connection = DB::table('mailbox_connections')->insertGetId(['agent_id' => $this->branch->id, 'user_id' => $this->accounts->id,
                'email_address' => "desk-{$who}@grd.test", 'provider' => 'outlook', 'is_active' => 1, 'created_at' => now(), 'updated_at' => now()]);
            DB::table('email_threads')->insert(['agent_id' => $this->branch->id, 'thread_key' => "thr-{$who}", 'status' => 'triaged',
                'classification' => 'other', 'latest_message_received_at' => '2026-09-20 10:00:00', 'created_at' => now(), 'updated_at' => now()]);
            DB::table('email_messages')->insert(['agent_id' => $this->branch->id, 'mailbox_connection_id' => $connection, 'thread_key' => "thr-{$who}",
                'direction' => 'inbound', 'message_id' => "<{$who}@grd.test>", 'from' => 'ap@' . strtolower($who) . '-grd.test',
                'subject' => 'Invoice query', 'body_snippet' => 'We will not release payment until the THC on INV-GRD-1 is corrected.',
                'received_at' => '2026-09-20 10:00:00', 'created_at' => now(), 'updated_at' => now()]);
        }

        $this->artisan('clients:payment-report', ['--month' => '2026-09']);

        Http::assertSentCount(1);   // the good payer is not asked about
        $cards = $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->accounts), 'Accept' => 'application/json'])
            ->getJson("http://accounts.f16sefreight.com/api/customers/{$slow->id}/payment-reports")->assertOk()->json('cards');
        $this->assertSame('disputes_a_bill', $cards[0]['jev']['answer']);
        $this->assertTrue($cards[0]['jev']['suggested']);

        $this->postJson("http://accounts.f16sefreight.com/api/customers/{$slow->id}/payment-reports/{$cards[0]['id']}/jev", ['chosen' => 'disputes_a_bill'])
            ->assertOk()->assertJsonPath('cards.0.jev.outcome', 'accepted');
    }

    public function test_the_client_book_shows_the_latest_grade(): void
    {
        $good = $this->client('Listed');
        foreach (['2026-07-10', '2026-08-10', '2026-09-10'] as $due) {
            $this->bill($good, $due, $due);
        }
        $this->artisan('clients:payment-report', ['--month' => '2026-09']);

        $row = collect($this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->accounts), 'Accept' => 'application/json'])
            ->getJson('http://accounts.f16sefreight.com/api/customers?per_page=200')->assertOk()->json('data'))->firstWhere('id', $good->id);

        $this->assertSame('A', $row['payment']['grade']);
    }
}
