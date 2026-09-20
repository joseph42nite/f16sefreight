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
 * The accounts desk's home (guide §11.2): what to do today, and what needs a decision.
 */
class AccountsTodayTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Today Co', 'code' => 'TDY', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-tdy@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);

        DB::table('accounting_periods')->insert([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(): string
    {
        return 'http://accounts.localhost/api/accounts/today';
    }

    private function job(): Job
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-TDYBOM-26-' . random_int(1000, 9999)]);

        return Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-TDYBOM-26-' . random_int(1000, 9999)]);
    }

    private function invoice(array $attributes = []): AccountsInvoice
    {
        $job = $this->job();

        return AccountsInvoice::create(array_merge([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $this->client->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id, 'billed_party_role' => 'client',
            'invoice_no' => 'INV-TDY-' . random_int(1000, 9999), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'sent', 'currency' => 'INR', 'exchange_rate' => 1,
            'subtotal' => 10000, 'tax_amount' => 0, 'grand_total' => 10000,
        ], $attributes));
    }

    private function cards(): array
    {
        return collect($this->as($this->accounts)->getJson($this->url())->assertOk()->json('cards'))
            ->keyBy('key')->all();
    }

    private function exceptions(): array
    {
        return collect($this->as($this->accounts)->getJson($this->url())->json('exceptions'))->keyBy('kind')->all();
    }

    public function test_every_card_carries_a_count_a_figure_and_somewhere_to_go(): void
    {
        $this->invoice(['status' => 'draft', 'grand_total' => 48000, 'sent_to_accounts_at' => now()]);
        $this->invoice(['status' => 'draft', 'grand_total' => 12000, 'sent_to_accounts_at' => now()]);
        // A draft pricing has NOT handed over is not the accounts desk's work yet.
        $this->invoice(['status' => 'draft', 'grand_total' => 99000]);

        DB::table('bank_transactions')->insert([
            'agent_id' => $this->branch->id, 'provider' => 'manual', 'plaid_transaction_id' => 'UTR-TDY-1',
            'reference' => 'UTR-TDY-1', 'amount' => 25000, 'value_date' => now()->toDateString(),
            'direction' => 'credit', 'reconciliation_status' => 'unreconciled', 'currency' => 'INR',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $cards = $this->cards();

        $this->assertSame([2, 60000.0], [$cards['to_bill']['count'], (float) $cards['to_bill']['amount']]);
        $this->assertSame('/billing', $cards['to_bill']['to']['path']);
        $this->assertSame([1, 25000.0], [$cards['to_place']['count'], (float) $cards['to_place']['amount']]);

        // 🔴 Every card is a link: a card you cannot click is a fact nobody can act on.
        foreach ($cards as $card) {
            $this->assertArrayHasKey('path', $card['to']);
            $this->assertArrayHasKey('count', $card);
            $this->assertArrayHasKey('amount', $card);
        }
    }

    public function test_the_overdue_card_is_the_same_figure_the_collections_queue_shows(): void
    {
        $this->invoice(['grand_total' => 40000, 'due_date' => now()->subDays(20)->toDateString()]);
        $this->invoice(['grand_total' => 15000, 'due_date' => now()->addDays(10)->toDateString()]);

        $cards = $this->cards();
        $queue = $this->getJson('http://accounts.localhost/api/collections')->assertOk()->json('summary');

        // ⚠️ The home must never compute its own version of "overdue" — it reads the one the queue reads.
        $this->assertSame(40000.0, (float) $cards['overdue']['amount']);
        $this->assertSame((float) $queue['overdue'], (float) $cards['overdue']['amount']);
        $this->assertSame('warning', $cards['overdue']['tone']);
    }

    public function test_a_clear_desk_says_so_rather_than_showing_empty_cards(): void
    {
        $body = $this->as($this->accounts)->getJson($this->url())->assertOk()->json();

        $this->assertSame([], $body['exceptions']);
        $this->assertSame(0, collect($body['cards'])->sum('count'));
    }

    public function test_a_month_with_no_open_period_is_the_loudest_thing_on_the_page(): void
    {
        DB::table('accounting_periods')->where('agent_id', $this->branch->id)->update(['status' => 'closed']);

        $exceptions = $this->exceptions();

        // 🔴 Nothing can post into a closed month, and that is invisible until a post is refused.
        $this->assertSame('critical', $exceptions['no_period']['tone']);
        $this->assertStringContainsString('nothing can be posted', $exceptions['no_period']['text']);
    }

    public function test_a_period_about_to_close_is_flagged_before_it_does(): void
    {
        DB::table('accounting_periods')->where('agent_id', $this->branch->id)
            ->update(['end_date' => now()->addDays(4)->toDateString()]);

        $this->assertStringContainsString('ends in 4 day(s)', $this->exceptions()['period_closing']['text']);
    }

    public function test_a_client_over_their_limit_is_named_before_the_gate_stops_the_cargo(): void
    {
        $this->client->update(['credit_limit' => 25000]);
        $this->invoice(['grand_total' => 40000]);

        $exceptions = $this->exceptions();

        $this->assertSame('critical', $exceptions['credit_hold']['tone']);
        $this->assertStringContainsString('Globex', $exceptions['credit_hold']['text']);

        // A credit note takes them back under, and the exception clears itself.
        $this->invoice(['type' => 'credit_note', 'grand_total' => 20000]);
        $this->assertArrayNotHasKey('credit_hold', $this->exceptions());
    }

    public function test_billed_shipments_with_no_cost_booked_are_counted_and_clear_when_costed(): void
    {
        $billed = $this->invoice(['grand_total' => 50000]);

        $this->assertStringContainsString('1 billed shipment(s) have no cost booked',
            $this->exceptions()['no_cost_booked']['text']);

        $vendor = \App\Partner::create(['company_id' => $this->branch->company_id, 'agent_id' => $this->branch->id,
            'name' => 'Emirates SkyCargo', 'partner_type' => 'airline']);

        $voucherId = DB::table('accounts_purchase_vouchers')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $billed->job_id, 'vendor_id' => $vendor->id,
            'transport_mode' => 'air', 'voucher_no' => 'PV-TDY-1', 'document_date' => now()->toDateString(),
            'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->assertArrayNotHasKey('no_cost_booked', $this->exceptions());
        $this->assertNotNull($voucherId);
    }

    public function test_a_cost_sheet_waiting_over_a_week_is_raised(): void
    {
        $this->invoice(['status' => 'draft', 'sent_to_accounts_at' => now()->subDays(9)]);
        $this->invoice(['status' => 'draft', 'sent_to_accounts_at' => now()->subDay()]);

        $this->assertStringContainsString('1 cost sheet(s) have been waiting',
            $this->exceptions()['stale_draft']['text']);
    }

    public function test_pricing_cannot_read_the_accounts_home(): void
    {
        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-tdy@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->getJson('http://focusair.localhost/api/accounts/today')->assertForbidden();
    }
}
