<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/** Opening and closing the months the ledger is open for — 🔒 accounts alone (PRD §2.4 "sole"), user 2026-09-18. */
class AccountingPeriodsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $bom;
    private Agent $maa;
    private User $accounts;
    private User $boss;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Period Co', 'code' => 'PRD', 'tier' => 'command']);
        $this->bom = Agent::create(['company_id' => $company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->maa = Agent::create(['company_id' => $company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);
        $user = fn (string $role) => User::create(['name' => ucfirst($role), 'email' => "{$role}-prd@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->bom->id, 'designation' => $role, 'is_active' => 1]);
        $this->accounts = $user('accounts');
        $this->boss = $user('boss');
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    public function test_accounts_opens_and_closes_periods_for_any_branch_of_the_company(): void
    {
        $september = ['agent_id' => $this->bom->id, 'period_name' => 'September 2026', 'start_date' => '2026-09-01', 'end_date' => '2026-09-30'];

        $this->as($this->accounts)->postJson($this->url('/reports/periods'), $september)->assertCreated();
        // Another branch of the same company: also theirs to open.
        $this->postJson($this->url('/reports/periods'), array_merge($september, ['agent_id' => $this->maa->id]))->assertCreated();
        // Overlapping dates on the same branch are refused — a document would sit in two periods.
        $this->postJson($this->url('/reports/periods'), array_merge($september, ['period_name' => 'Sept again', 'start_date' => '2026-09-15']))
            ->assertStatus(422)->assertJsonPath('reason', 'overlaps');

        $listed = $this->getJson($this->url('/reports/periods'))->assertOk()->json();
        // Listed by name, so the picker reads alphabetically.
        $this->assertSame(['Chennai', 'Mumbai'], collect($listed['branches'])->pluck('name')->all());
        $this->assertCount(2, $listed['periods']);

        $period = collect($listed['periods'])->firstWhere('agent_id', $this->bom->id);
        $this->postJson($this->url("/reports/periods/{$period['id']}/close"))->assertOk()->assertJsonPath('status', 'closed');
        $this->postJson($this->url("/reports/periods/{$period['id']}/close"))->assertStatus(422)->assertJsonPath('reason', 'not_open');
    }

    /** 🔒 Not even the Boss opens or closes a period; the Boss reads the reports. */
    public function test_the_boss_may_read_reports_but_not_open_or_close_a_period(): void
    {
        $this->as($this->accounts)->postJson($this->url('/reports/periods'), ['agent_id' => $this->bom->id,
            'period_name' => 'September 2026', 'start_date' => '2026-09-01', 'end_date' => '2026-09-30'])->assertCreated();
        $period = $this->getJson($this->url('/reports/periods'))->json('periods.0');

        // The Boss reads from their own portal — the accounts host admits accounts alone.
        $boss = fn (string $path) => 'http://admin.localhost/api' . $path;
        $this->as($this->boss)->getJson($boss("/reports/profit-and-loss?period_id={$period['id']}"))->assertOk();
        $this->postJson($boss('/reports/periods'), ['agent_id' => $this->bom->id, 'period_name' => 'October 2026',
            'start_date' => '2026-10-01', 'end_date' => '2026-10-31'])->assertForbidden();
        $this->postJson($boss("/reports/periods/{$period['id']}/close"))->assertForbidden();
    }

    /** A period with documents still out of the ledger is not closed: they would have nowhere to go. */
    public function test_a_period_with_unposted_documents_is_not_closed(): void
    {
        $this->as($this->accounts)->postJson($this->url('/reports/periods'), ['agent_id' => $this->bom->id,
            'period_name' => 'September 2026', 'start_date' => '2026-09-01', 'end_date' => '2026-09-30'])->assertCreated();
        $period = $this->getJson($this->url('/reports/periods'))->json('periods.0');

        $enquiry = Enquiry::create(['agent_id' => $this->bom->id, 'transport_mode' => 'air', 'status' => 'converted', 'enquiry_no' => 'ENQA-PRDBOM-26-0001']);
        $job = Job::create(['agent_id' => $this->bom->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air', 'execution_job_no' => 'JOBA-PRDBOM-26-0001']);
        $invoiceId = DB::table('accounts_invoices')->insertGetId(['agent_id' => $this->bom->id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'invoice_no' => 'INV-PRD-1', 'type' => 'invoice', 'document_date' => '2026-09-15', 'status' => 'finalized', 'currency' => 'INR',
            'grand_total' => 1000, 'subtotal' => 1000, 'tax_amount' => 0, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('unposted_transactions_queue')->insert(['agent_id' => $this->bom->id, 'company_id' => $this->bom->company_id,
            'created_by' => $this->accounts->id, 'source_id' => $invoiceId, 'source_type' => 'invoice', 'net_amount' => 1000,
            'created_at' => now(), 'updated_at' => now()]);

        $this->postJson($this->url("/reports/periods/{$period['id']}/close"))
            ->assertStatus(422)->assertJsonPath('reason', 'unposted_documents')->assertJsonPath('unposted', 1);

        // Posted (the queue row goes), and it closes.
        DB::table('unposted_transactions_queue')->where('source_id', $invoiceId)->delete();
        $this->postJson($this->url("/reports/periods/{$period['id']}/close"))->assertOk();
    }
}
