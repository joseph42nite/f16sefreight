<?php

namespace Tests\Feature;

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

/** What the accounts login works from (user, 2026-09-18): the hand-over queue, the receivables and the payables. */
class AccountsWorkQueueTest extends TestCase
{
    use DatabaseTransactions;

    private Job $job;
    private Agent $branch;
    private User $pricing;
    private User $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Ledger Co', 'code' => 'LDG', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $user = fn (string $role) => User::create(['name' => ucfirst($role), 'email' => "{$role}-ldg@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => $role, 'is_active' => 1]);
        $this->pricing = $user('pricing');
        $this->accounts = $user('accounts');

        $customer = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test']);
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-LDGBOM-26-0001', 'customer_id' => $customer->id]);
        $this->job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-LDGBOM-26-0001', 'customer_id' => $customer->id, 'awb_number' => '176-77665544', 'status' => 'PDF Generated']);
        DB::table('airlines')->updateOrInsert(['prefix' => '176'], ['name' => 'Emirates SkyCargo', 'code' => 'EK', 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    public function test_a_sent_cost_sheet_waits_for_accounts_with_its_figures_and_its_supplier_voucher(): void
    {
        $sheet = "http://focusair.localhost/api/jobs/{$this->job->id}/cost-sheet";

        // Pricing prices it: what the client is billed, and what the airline is owed.
        $this->as($this->pricing)->postJson("{$sheet}/lines", ['side' => 'sell', 'charge_type' => 'air_freight',
            'description' => 'Air freight', 'quantity' => 100, 'rate' => 200, 'tax_percentage' => 0])->assertCreated();
        $this->postJson("{$sheet}/lines", ['side' => 'buy', 'charge_type' => 'air_freight',
            'description' => 'Air freight', 'quantity' => 100, 'rate' => 150])->assertCreated();

        // Until it is sent, accounts' queue is empty.
        $this->assertSame([], $this->as($this->accounts)->getJson('http://accounts.localhost/api/invoices?awaiting=1')->assertOk()->json('data'));

        $this->as($this->pricing)->postJson("{$sheet}/send")->assertOk();

        $waiting = $this->as($this->accounts)->getJson('http://accounts.localhost/api/invoices?awaiting=1')->assertOk()->json('data.0');
        $this->assertSame(['JOBA-LDGBOM-26-0001', 20000.0, 15000.0, 5000.0, 'Pricing'],
            [$waiting['job_no'], (float) $waiting['sell_total'], (float) $waiting['buy_total'], (float) $waiting['margin'], $waiting['sent_to_accounts_by']]);

        // The payables register shows the airline's own voucher for this shipment.
        $voucher = $this->getJson('http://accounts.localhost/api/vouchers')->assertOk()->json('data.0');
        $this->assertSame(['Emirates SkyCargo', 15000.0], [$voucher['vendor']['name'], (float) $voucher['net_amount']]);
    }

    /** 🔒 Pricing may read the registers but never finalize or post; that stays accounts'. */
    public function test_only_accounts_finalizes_and_posts(): void
    {
        $sheet = "http://focusair.localhost/api/jobs/{$this->job->id}/cost-sheet";
        $this->as($this->pricing)->postJson("{$sheet}/lines", ['side' => 'sell', 'charge_type' => 'air_freight',
            'description' => 'Air freight', 'quantity' => 100, 'rate' => 200, 'tax_percentage' => 0])->assertCreated();
        $this->postJson("{$sheet}/send")->assertOk();

        $invoiceId = DB::table('accounts_invoices')->where('job_id', $this->job->id)->value('id');

        $this->as($this->pricing)->postJson("http://focusair.localhost/api/invoices/{$invoiceId}/finalize")->assertForbidden();
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$invoiceId}/finalize")->assertOk();

        $this->assertSame('finalized', DB::table('accounts_invoices')->where('id', $invoiceId)->value('status'));
    }
}
