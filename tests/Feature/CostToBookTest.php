<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Money out ① "Cost to book" as a queue (user, 2026-09-26).
 *
 * A shipment billed with no cost booked reads as pure profit, and until now nothing could fix one: billing locks the
 * cost sheet, and a billed shipment with no cost is billed by definition. The decisions: after billing, ACCOUNTS may
 * ADD a cost — never change or remove one, never add to a posted voucher — booked inline on Money out, through the
 * cost sheet's own endpoint. The sell side stays locked, and so does pricing.
 */
class CostToBookTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private User $pricing;
    private User $boss;
    private Job $job;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Book Co', 'code' => 'BKC', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $user = fn (string $role) => User::create(['name' => ucfirst($role), 'email' => "{$role}-bkc@test.local",
            'password' => Hash::make('x'), 'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => $role, 'is_active' => 1]);
        $this->accounts = $user('accounts');
        $this->pricing = $user('pricing');
        $this->boss = $user('boss');

        DB::table('airlines')->updateOrInsert(['prefix' => '176'], ['name' => 'Emirates SkyCargo', 'code' => 'EK', 'is_active' => 1]);
        $this->job = $this->shipment('0001', '176-12345675');
    }

    private function shipment(string $n, ?string $awb = null, ?Agent $at = null): Job
    {
        $at ??= $this->branch;
        $enquiry = Enquiry::create(['agent_id' => $at->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => "ENQA-BKC{$at->branch_code}-26-{$n}"]);

        return Job::create(['agent_id' => $at->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => "JOBA-BKC{$at->branch_code}-26-{$n}", 'awb_number' => $awb, 'status' => 'Intake']);
    }

    private function bill(Job $job, string $status = 'finalized', float $net = 100000): void
    {
        DB::table('accounts_invoices')->insert(['agent_id' => $job->agent_id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'invoice_no' => 'INV-' . $job->id, 'type' => 'invoice', 'document_date' => '2026-09-10', 'status' => $status,
            'currency' => 'INR', 'exchange_rate' => 1, 'subtotal' => $net, 'tax_amount' => round($net * 0.18, 2),
            'grand_total' => round($net * 1.18, 2), 'created_at' => now(), 'updated_at' => now()]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function queue(User $u, string $host = 'accounts.localhost'): array
    {
        return $this->as($u)->getJson("http://{$host}/api/money-out/to-cost")->assertOk()->json();
    }

    private function book(User $u, Job $job, array $line = [], string $host = 'accounts.localhost')
    {
        return $this->as($u)->postJson("http://{$host}/api/jobs/{$job->id}/cost-sheet/lines", $line + [
            'side' => 'buy', 'charge_type' => 'air_freight', 'description' => 'Carrier invoice',
            'quantity' => 1, 'rate' => 60000, 'tax_percentage' => 18,
        ]);
    }

    public function test_a_billed_shipment_with_no_cost_is_queued_and_the_count_agrees(): void
    {
        $this->bill($this->job);

        $draft = $this->shipment('0002');
        $this->bill($draft, 'draft');                                  // not billed yet — not in the queue

        $costed = $this->shipment('0003');
        $this->bill($costed);
        $vendor = Partner::create(['company_id' => $this->branch->company_id, 'agent_id' => $this->branch->id,
            'name' => 'Trucker', 'partner_type' => 'transporter']);
        DB::table('accounts_purchase_vouchers')->insert(['agent_id' => $this->branch->id, 'job_id' => $costed->id,
            'vendor_id' => $vendor->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-X', 'document_date' => '2026-09-11',
            'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now()]);

        $queue = $this->queue($this->accounts);

        $this->assertSame([$this->job->id], array_column($queue['rows'], 'job_id'));
        $this->assertEquals(100000, $queue['rows'][0]['billed'], 'net of tax — the margin is on the subtotal');
        $this->assertSame('Emirates SkyCargo', $queue['rows'][0]['default_supplier'], 'the airline the AWB prefix names');
        $this->assertTrue($queue['can_book']);

        $stages = $this->as($this->accounts)->getJson('http://accounts.localhost/api/money-out/stages')->assertOk()->json('stages');
        $this->assertSame(1, collect($stages)->firstWhere('key', 'to_cost')['count'], 'the list and the pipeline count agree');

        // Listing it created nothing: the airline is looked up, not made a partner.
        $this->assertDatabaseMissing('partners', ['company_id' => $this->branch->company_id, 'name' => 'Emirates SkyCargo']);
    }

    public function test_accounts_books_a_late_cost_and_the_shipment_leaves_the_queue(): void
    {
        $this->bill($this->job);

        $this->book($this->accounts, $this->job)->assertCreated();

        $voucher = DB::table('accounts_purchase_vouchers')->where('job_id', $this->job->id)->first();
        $this->assertSame('Emirates SkyCargo', DB::table('partners')->where('id', $voucher->vendor_id)->value('name'));
        $item = DB::table('accounts_purchase_items')->where('purchase_voucher_id', $voucher->id)->first();
        $this->assertEquals([60000, 10800, 70800], [(float) $item->amount, (float) $item->tax_amount, (float) $item->net_amount]);

        $this->assertSame([], $this->queue($this->accounts)['rows']);
        $this->assertDatabaseHas('audit_logs', ['action' => 'costsheet.late_cost_booked', 'model_id' => $this->job->id]);
    }

    public function test_after_billing_the_sell_side_stays_locked_even_for_accounts(): void
    {
        $this->bill($this->job);

        $this->book($this->accounts, $this->job, ['side' => 'sell'])->assertStatus(422)->assertJsonPath('reason', 'locked');
    }

    public function test_pricing_cannot_add_a_cost_after_billing(): void
    {
        $this->bill($this->job);

        $this->book($this->pricing, $this->job, [], 'focusair.localhost')->assertStatus(422)->assertJsonPath('reason', 'locked');
        $this->assertDatabaseMissing('accounts_purchase_vouchers', ['job_id' => $this->job->id]);
    }

    /** 🔴 Before billing as much as after: appending to a posted voucher changes a document the ledger already holds. */
    public function test_nothing_is_added_to_a_posted_voucher(): void
    {
        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'September',
            'start_date' => '2026-09-01', 'end_date' => '2026-09-30', 'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);

        $this->book($this->pricing, $this->job, [], 'focusair.localhost')->assertCreated();
        $voucher = DB::table('accounts_purchase_vouchers')->where('job_id', $this->job->id)->first();
        DB::table('accounts_purchase_vouchers')->where('id', $voucher->id)->update(['document_date' => '2026-09-12']);
        $this->as($this->accounts)->postJson("http://accounts.localhost/api/vouchers/{$voucher->id}/post")->assertOk();

        $this->book($this->pricing, $this->job, ['description' => 'Fuel surcharge'], 'focusair.localhost')
            ->assertStatus(422)->assertJsonPath('reason', 'voucher_posted');
        $this->assertSame(1, DB::table('accounts_purchase_items')->where('purchase_voucher_id', $voucher->id)->count());
    }

    public function test_the_boss_reads_the_queue_but_cannot_book(): void
    {
        $this->bill($this->job);

        // The Boss works from the admin portal; the accounts portal admits accounts only.
        $this->assertFalse($this->queue($this->boss, 'admin.localhost')['can_book']);
        $this->book($this->boss, $this->job, [], 'admin.localhost')->assertForbidden();
    }

    public function test_another_companys_billed_shipment_is_never_listed(): void
    {
        $other = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'command']);
        $theirs = $this->shipment('0009', null, Agent::create(['company_id' => $other->id, 'agent_name' => 'Delhi', 'branch_code' => 'DEL']));
        $this->bill($theirs);
        $this->bill($this->job);

        $this->assertSame([$this->job->id], array_column($this->queue($this->accounts)['rows'], 'job_id'));
    }
}
