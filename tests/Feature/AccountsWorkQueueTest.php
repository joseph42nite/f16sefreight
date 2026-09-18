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

    /**
     * One accounts login covers the whole company, with a branch to narrow to (user, 2026-09-18: "1 main accounts login
     * and a way to differ based on branch"). The registers read what posting wrote.
     */
    public function test_accounts_covers_every_branch_and_can_narrow_to_one(): void
    {
        $chennai = Agent::create(['company_id' => $this->branch->company_id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);
        $elsewhere = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'command']);
        $otherBranch = Agent::create(['company_id' => $elsewhere->id, 'agent_name' => 'Delhi', 'branch_code' => 'DEL']);

        $invoice = function (Agent $at, string $no, float $total) {
            $enquiry = Enquiry::create(['agent_id' => $at->id, 'transport_mode' => 'air', 'status' => 'converted',
                'enquiry_no' => 'ENQA-' . $at->branch_code . '-26-' . random_int(1000, 9999)]);
            $job = Job::create(['agent_id' => $at->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
                'execution_job_no' => 'JOBA-' . $at->branch_code . '-26-' . random_int(1000, 9999)]);

            return DB::table('accounts_invoices')->insertGetId(['agent_id' => $at->id, 'job_id' => $job->id, 'transport_mode' => 'air', 'invoice_no' => $no,
                'type' => 'invoice', 'document_date' => now()->toDateString(), 'status' => 'finalized', 'currency' => 'INR',
                'grand_total' => $total, 'subtotal' => $total, 'tax_amount' => 0, 'created_at' => now(), 'updated_at' => now()]);
        };
        $mumbai = $invoice($this->branch, 'INV-BOM-1', 1000);
        $maa = $invoice($chennai, 'INV-MAA-1', 2000);
        $invoice($otherBranch, 'INV-DEL-1', 9999);

        // Both branches of the company, never another company's.
        $numbers = collect($this->as($this->accounts)->getJson('http://accounts.localhost/api/invoices')->assertOk()->json('data'))->pluck('invoice_no');
        $this->assertSame(['INV-BOM-1', 'INV-MAA-1'], $numbers->sort()->values()->all());

        // The GST register reads what posting wrote, and narrows to one branch.
        foreach ([[$mumbai, $this->branch, 90, 90, 0], [$maa, $chennai, 0, 0, 360]] as [$id, $at, $cgst, $sgst, $igst]) {
            DB::table('gst_ledger_entries')->insert(['agent_id' => $at->id, 'company_id' => $this->branch->company_id,
                'voucher_id' => $id, 'voucher_type' => 'invoice', 'cgst_amount' => $cgst, 'sgst_amount' => $sgst,
                'igst_amount' => $igst, 'created_at' => now(), 'updated_at' => now()]);
        }

        $all = $this->getJson('http://accounts.localhost/api/registers/gst')->assertOk()->json();
        $this->assertSame([90.0, 90.0, 360.0], array_map('floatval', [$all['totals']['cgst'], $all['totals']['sgst'], $all['totals']['igst']]));
        $this->assertSame(['BOM', 'Chennai'], collect($all['branches'])->pluck('name')->sort()->values()->all());

        $justChennai = $this->getJson("http://accounts.localhost/api/registers/gst?agent_id={$chennai->id}")->assertOk()->json();
        $this->assertSame([0.0, 0.0, 360.0], array_map('floatval', [$justChennai['totals']['cgst'], $justChennai['totals']['sgst'], $justChennai['totals']['igst']]));

        // What has not reached the ledger, and what each is waiting for.
        DB::table('unposted_transactions_queue')->insert(['agent_id' => $this->branch->id, 'company_id' => $this->branch->company_id,
            'created_by' => $this->pricing->id, 'source_id' => $mumbai, 'source_type' => 'invoice', 'net_amount' => 1000,
            'created_at' => now(), 'updated_at' => now()]);

        $queue = $this->getJson('http://accounts.localhost/api/registers/unposted')->assertOk()->json();
        $this->assertSame(['INV-BOM-1', 'Ready to post', 1000.0], [$queue['rows'][0]['number'], $queue['rows'][0]['waiting_for'], (float) $queue['total']]);
    }
}
