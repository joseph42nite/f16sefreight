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
 * Closing the month (guide §11.2): six steps, and only one of them may refuse.
 */
class CloseMonthTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $client;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Close Co', 'code' => 'CLS', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-cls@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex',
            'email_domain' => 'globex.test', 'gst_no' => '27AAACG1001A1Z5']);

        $this->periodId = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->subMonths(6)->toDateString(), 'end_date' => now()->addMonth()->toDateString(),
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
            'enquiry_no' => 'ENQA-CLSBOM-26-' . random_int(1000, 9999)]);

        return Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-CLSBOM-26-' . random_int(1000, 9999),
            'customer_id' => $this->client->id, 'completed_at' => now()->subDays(10)]);
    }

    private function invoice(Job $job, array $attributes = []): AccountsInvoice
    {
        return AccountsInvoice::create(array_merge([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $this->client->id,
            'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id, 'billed_party_role' => 'client',
            'invoice_no' => 'INV-CLS-' . random_int(1000, 9999), 'type' => 'invoice',
            'document_date' => now()->subDays(5)->toDateString(), 'status' => 'sent', 'is_posted' => true,
            'currency' => 'INR', 'exchange_rate' => 1, 'subtotal' => 10000, 'tax_amount' => 1800, 'grand_total' => 11800,
        ], $attributes));
    }

    private function steps(): array
    {
        return collect($this->as($this->accounts)->getJson($this->url('/close-month'))->assertOk()->json('steps'))
            ->keyBy('key')->all();
    }

    public function test_a_draft_is_not_billed_and_the_first_step_says_so(): void
    {
        $billed = $this->job();
        $this->invoice($billed);

        $draftOnly = $this->job();
        $this->invoice($draftOnly, ['status' => 'draft', 'is_posted' => false]);

        $steps = $this->steps();

        // 🔴 A draft carries no number and has reached neither the client nor the ledger.
        $this->assertSame(1, $steps['billed']['count']);
        $this->assertSame($draftOnly->execution_job_no, $steps['billed']['rows'][0]['job_no']);
        $this->assertFalse($steps['billed']['clear']);
        // ⚠️ Advisory: a shipment can legitimately still be unbilled the day a month closes.
        $this->assertFalse($steps['billed']['blocking']);
    }

    public function test_only_the_unposted_step_blocks_the_close(): void
    {
        $job = $this->job();
        // Billed, and deliberately never costed — step ② complains and the close still goes ahead.
        $this->invoice($job);

        $body = $this->as($this->accounts)->getJson($this->url('/close-month'))->assertOk()->json();
        $steps = collect($body['steps'])->keyBy('key');

        $this->assertSame(1, $steps['costed']['count'], 'nothing is costed');
        $this->assertFalse($steps['costed']['blocking']);
        $this->assertSame(0, $steps['posted']['count']);
        $this->assertTrue($body['can_close'], 'warnings do not stop a close');

        $this->postJson($this->url("/reports/periods/{$this->periodId}/close"))->assertOk();
        $this->assertSame('closed', DB::table('accounting_periods')->where('id', $this->periodId)->value('status'));
    }

    public function test_an_unposted_document_blocks_the_close_and_the_screen_names_it(): void
    {
        $job = $this->job();
        // The observer puts it on the queue the moment it is raised, and it is not posted.
        $this->invoice($job, ['status' => 'draft', 'is_posted' => false]);

        $body = $this->as($this->accounts)->getJson($this->url('/close-month'))->assertOk()->json();
        $steps = collect($body['steps'])->keyBy('key');

        $this->assertSame(1, $steps['posted']['count']);
        $this->assertTrue($steps['posted']['blocking']);
        $this->assertSame('Finalize it first', $steps['posted']['rows'][0]['waiting_for']);

        $this->assertFalse($body['can_close']);
        $this->assertSame('Everything posted?', $body['blocked_by']);
        $this->assertStringContainsString('Clear step 3', $steps['close']['note']);

        // 🔴 And the server refuses independently — the screen shows the rule early, it does not replace it.
        $this->postJson($this->url("/reports/periods/{$this->periodId}/close"))
            ->assertStatus(422)->assertJsonPath('reason', 'unposted_documents');
    }

    public function test_the_gst_step_counts_only_what_the_portal_needs(): void
    {
        $b2b = $this->job();
        $this->invoice($b2b);

        $walkIn = Customer::create(['company_id' => $this->branch->company_id, 'name' => 'Walk-in',
            'email_domain' => 'walkin.test']);
        $b2c = $this->job();
        $this->invoice($b2c, ['customer_id' => $walkIn->id, 'billed_party_id' => $walkIn->id]);

        $registered = $this->job();
        $this->invoice($registered, ['irn' => 'a5c1e9', 'irn_status' => 'generated']);

        $gst = $this->steps()['gst'];

        // Only the unregistered B2B one: a client with no GSTIN never goes to the portal at all.
        $this->assertSame(1, $gst['count']);
        // 1,800 × 3 documents.
        $this->assertSame(5400.0, (float) $gst['tax_charged']);
        $this->assertStringContainsString('₹5,400.00 of tax was charged', $gst['note']);
    }

    public function test_the_statements_step_reports_whether_the_ledger_balances(): void
    {
        $job = $this->job();
        DB::table('accounts_ledger_entries')->insert([
            ['agent_id' => $this->branch->id, 'chart_of_account_id' => $this->account('1200-AR'),
             'accounting_period_id' => $this->periodId, 'posting_date' => now()->toDateString(),
             'debit_amount' => 11800, 'credit_amount' => 0, 'source_id' => $job->id, 'source_type' => 'invoice',
             'created_at' => now(), 'updated_at' => now()],
            ['agent_id' => $this->branch->id, 'chart_of_account_id' => $this->account('4000-Freight-Revenue'),
             'accounting_period_id' => $this->periodId, 'posting_date' => now()->toDateString(),
             'debit_amount' => 0, 'credit_amount' => 11800, 'source_id' => $job->id, 'source_type' => 'invoice',
             'created_at' => now(), 'updated_at' => now()],
        ]);

        $statements = $this->steps()['statements'];

        $this->assertTrue($statements['balanced']);
        $this->assertSame(11800.0, (float) $statements['figures']['revenue']);

        // 🔴 A one-sided entry makes every report from the period untrustworthy, so it is said in those words.
        DB::table('accounts_ledger_entries')->insert([
            'agent_id' => $this->branch->id, 'chart_of_account_id' => $this->account('1100-Bank'),
            'accounting_period_id' => $this->periodId, 'posting_date' => now()->toDateString(),
            'debit_amount' => 500, 'credit_amount' => 0, 'source_id' => $job->id, 'source_type' => 'receipt',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $broken = $this->steps()['statements'];
        $this->assertFalse($broken['balanced']);
        $this->assertStringContainsString('DOES NOT BALANCE', $broken['note']);
    }

    public function test_another_company_cannot_see_or_close_this_period(): void
    {
        $other = Company::create(['name' => 'Rival Close', 'code' => 'RVC', 'tier' => 'command']);
        $theirBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);
        $theirAccounts = User::create(['name' => 'Theirs', 'email' => 'accounts-rvc@test.local', 'password' => Hash::make('x'),
            'company_name' => $other->id, 'branch_name' => $theirBranch->id, 'designation' => 'accounts', 'is_active' => 1]);

        $body = $this->as($theirAccounts)->getJson($this->url('/close-month'))->assertOk()->json();

        $this->assertSame([], collect($body['periods'])->pluck('id')->intersect([$this->periodId])->all());
        $this->postJson($this->url("/reports/periods/{$this->periodId}/close"))->assertStatus(404);
    }

    private function account(string $code): int
    {
        return DB::table('chart_of_accounts')->insertGetId(['agent_id' => $this->branch->id,
            'account_code' => $code, 'account_name' => $code, 'created_at' => now(), 'updated_at' => now()]);
    }
}
