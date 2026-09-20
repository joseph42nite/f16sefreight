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
 * What each shipment, client and lane actually made (user, 2026-09-20).
 */
class ProfitabilityTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Customer $alpha;
    private Customer $beta;
    private Partner $carrier;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Margin Co', 'code' => 'MRG', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-mrg@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);
        $this->alpha = Customer::create(['company_id' => $company->id, 'name' => 'Alpha Exports', 'email_domain' => 'alpha.test']);
        $this->beta = Customer::create(['company_id' => $company->id, 'name' => 'Beta Traders', 'email_domain' => 'beta.test']);
        $this->carrier = Partner::create(['company_id' => $company->id, 'agent_id' => $this->branch->id,
            'name' => 'Emirates SkyCargo', 'partner_type' => 'airline', 'email' => 'cass@emirates.test']);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** A shipment on a lane, for a client. */
    private function shipment(Customer $customer, string $origin, string $dest, string $mode = 'air'): Job
    {
        // The mode marker is load-bearing: `chk_enq_mode_prefix` refuses ENQA on a sea enquiry (PRD §6.3).
        $marker = ['air' => 'A', 'sea' => 'S', 'road' => 'R'][$mode] ?? 'A';

        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => $mode, 'status' => 'converted',
            'enquiry_no' => "ENQ{$marker}-MRGBOM-26-" . random_int(1000, 9999), 'customer_id' => $customer->id,
            'origin_code' => $origin, 'dest_code' => $dest]);

        return Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => $mode,
            'execution_job_no' => "JOB{$marker}-MRGBOM-26-" . random_int(1000, 9999), 'customer_id' => $customer->id,
            'completed_at' => now()->subDays(5)]);
    }

    /** Bill a shipment. `$tax` is charged but is NOT revenue. */
    private function bill(Job $job, float $net, float $tax = 0, string $type = 'invoice',
        string $currency = 'INR', float $rate = 1): AccountsInvoice
    {
        $invoice = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'transport_mode' => 'air',
            'customer_id' => $job->customer_id, 'billed_party_type' => 'customer', 'billed_party_id' => $job->customer_id,
            'billed_party_role' => 'client', 'invoice_no' => strtoupper(substr($type, 0, 3)) . '-MRG-' . random_int(1000, 9999),
            'type' => $type, 'document_date' => now()->toDateString(), 'status' => 'sent',
            'currency' => $currency, 'exchange_rate' => $rate,
            'subtotal' => $net, 'tax_amount' => $tax, 'grand_total' => $net + $tax,
        ]);
        $invoice->items()->create(['charge_type' => 'freight', 'description' => 'Air freight', 'quantity' => 1,
            'rate' => $net, 'amount' => $net, 'tax_percentage' => 0, 'tax_amount' => $tax, 'net_amount' => $net + $tax]);

        return $invoice;
    }

    /** Book a cost against a shipment. `$tax` is input credit, NOT cost. */
    private function cost(Job $job, float $net, float $tax = 0): int
    {
        $id = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'vendor_id' => $this->carrier->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-MRG-' . random_int(1000, 9999),
            'document_date' => now()->toDateString(), 'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $id, 'charge_type' => 'freight',
            'description' => 'Air freight cost', 'quantity' => 1, 'rate' => $net, 'amount' => $net,
            'tax_percentage' => 0, 'tax_amount' => $tax, 'net_amount' => $net + $tax,
            'created_at' => now(), 'updated_at' => now()]);

        return $id;
    }

    public function test_a_margin_is_net_of_tax_on_both_sides(): void
    {
        $job = $this->shipment($this->alpha, 'BOM', 'FRA');
        $this->bill($job, 100000, 18000);   // ₹1,18,000 collected; ₹1,00,000 earned
        $this->cost($job, 70000, 12600);    // ₹82,600 paid; ₹70,000 spent

        $row = collect($this->as($this->accounts)->getJson($this->url('/profitability/jobs'))->assertOk()->json('jobs'))
            ->firstWhere('job_no', $job->execution_job_no);

        // 🔴 GST is a liability we collect and an asset we reclaim — neither is margin.
        $this->assertSame([100000.0, 70000.0, 30000.0, 30.0],
            array_map('floatval', [$row['revenue'], $row['cost'], $row['margin'], $row['margin_pct']]));
        $this->assertSame('BOM → FRA', $row['lane']);
        $this->assertSame('Alpha Exports', $row['customer']);
    }

    public function test_notes_move_the_margin_the_way_they_move_the_money(): void
    {
        $job = $this->shipment($this->alpha, 'DEL', 'LHR');
        $this->bill($job, 100000);
        $this->bill($job, 20000, 0, 'debit_note');    // charged more
        $this->bill($job, 30000, 0, 'credit_note');   // gave some back
        $this->cost($job, 60000);

        $row = collect($this->as($this->accounts)->getJson($this->url('/profitability/jobs'))->json('jobs'))
            ->firstWhere('job_no', $job->execution_job_no);

        // 100 + 20 − 30 = 90.
        $this->assertSame([90000.0, 30000.0], [(float) $row['revenue'], (float) $row['margin']]);
    }

    public function test_foreign_currency_revenue_counts_at_its_own_rate(): void
    {
        $job = $this->shipment($this->beta, 'MAA', 'DXB');
        $this->bill($job, 1000, 0, 'invoice', 'USD', 83.5);
        $this->cost($job, 50000);

        $row = collect($this->as($this->accounts)->getJson($this->url('/profitability/jobs'))->json('jobs'))
            ->firstWhere('job_no', $job->execution_job_no);

        $this->assertSame([83500.0, 33500.0], [(float) $row['revenue'], (float) $row['margin']]);
    }

    public function test_a_shipment_billed_with_no_cost_booked_says_so_rather_than_showing_a_hundred_percent(): void
    {
        $billedOnly = $this->shipment($this->alpha, 'BOM', 'SIN');
        $this->bill($billedOnly, 40000);

        $costedOnly = $this->shipment($this->beta, 'BOM', 'SIN');
        $this->cost($costedOnly, 25000);

        $body = $this->as($this->accounts)->getJson($this->url('/profitability/jobs'))->assertOk()->json();
        $rows = collect($body['jobs'])->keyBy('job_no');

        // 🔴 The most common way a profitability report lies: 100% on a shipment nobody has costed.
        $this->assertTrue($rows[$billedOnly->execution_job_no]['no_cost_booked']);
        $this->assertSame(100.0, (float) $rows[$billedOnly->execution_job_no]['margin_pct']);

        $this->assertTrue($rows[$costedOnly->execution_job_no]['not_billed']);
        $this->assertSame(-25000.0, (float) $rows[$costedOnly->execution_job_no]['margin']);
        // NULL, never 0%: a shipment that billed nothing has no margin.
        $this->assertNull($rows[$costedOnly->execution_job_no]['margin_pct']);

        $this->assertSame([1, 1], [$body['totals']['no_cost_booked'], $body['totals']['not_billed']]);
    }

    public function test_the_loss_making_shipment_is_at_the_top(): void
    {
        $good = $this->shipment($this->alpha, 'BOM', 'FRA');
        $this->bill($good, 100000);
        $this->cost($good, 60000);

        $bad = $this->shipment($this->alpha, 'BOM', 'FRA');
        $this->bill($bad, 80000);
        $this->cost($bad, 95000);

        $jobs = $this->as($this->accounts)->getJson($this->url('/profitability/jobs'))->json('jobs');

        // ⚠️ The list you already know is the one sorted by revenue; the one worth opening starts with the loss.
        $this->assertSame($bad->execution_job_no, $jobs[0]['job_no']);
        $this->assertSame(-15000.0, (float) $jobs[0]['margin']);
    }

    public function test_the_client_and_lane_roll_ups_are_the_same_shipments_grouped(): void
    {
        $one = $this->shipment($this->alpha, 'BOM', 'FRA');
        $this->bill($one, 100000);
        $this->cost($one, 70000);

        $two = $this->shipment($this->alpha, 'BOM', 'FRA');
        $this->bill($two, 200000);
        $this->cost($two, 150000);

        $three = $this->shipment($this->beta, 'MAA', 'DXB');
        $this->bill($three, 60000);
        $this->cost($three, 30000);

        $clients = collect($this->as($this->accounts)->getJson($this->url('/profitability/clients'))->assertOk()->json('groups'))
            ->keyBy('name');

        $this->assertSame([2, 300000.0, 220000.0, 80000.0, 26.67, 40000.0], [
            $clients['Alpha Exports']['shipments'], (float) $clients['Alpha Exports']['revenue'],
            (float) $clients['Alpha Exports']['cost'], (float) $clients['Alpha Exports']['margin'],
            (float) $clients['Alpha Exports']['margin_pct'], (float) $clients['Alpha Exports']['margin_each'],
        ]);

        // Three characters is IATA and reads from `locations`; five is a UN/LOCODE and reads from `ports`.
        DB::table('locations')->insert(['destination' => 'bombay', 'iata_code' => 'BOM', 'is_active' => 1,
            'created_at' => now(), 'updated_at' => now()]);

        $lanes = collect($this->getJson($this->url('/profitability/lanes'))->assertOk()->json('groups'))->keyBy('name');

        $this->assertSame([2, 80000.0], [$lanes['BOM → FRA']['shipments'], (float) $lanes['BOM → FRA']['margin']]);
        $this->assertSame(30000.0, (float) $lanes['MAA → DXB']['margin']);
        // A code we have a name for reads as a route; one we do not stays the code.
        $this->assertSame(['bombay', null], [$lanes['BOM → FRA']['origin_name'], $lanes['BOM → FRA']['dest_name']]);

        // The three views are one calculation: the totals cannot disagree.
        $jobsTotal = $this->getJson($this->url('/profitability/jobs'))->json('totals');
        $lanesTotal = $this->getJson($this->url('/profitability/lanes'))->json('totals');
        $this->assertSame($jobsTotal['margin'], $lanesTotal['margin']);
        $this->assertSame(360000.0, (float) $jobsTotal['revenue']);
    }

    public function test_a_sea_lane_reads_as_ports_not_as_five_letter_codes(): void
    {
        // 🔴 `locations` names airports by IATA and has never heard of DEHAM; a three-letter code cannot address
        // it. Sea lanes resolve from `ports`, the UN/LOCODE directory (GAPS #376).
        DB::table('ports')->insert([
            ['locode' => 'INNSA', 'port_name' => 'Jawaharlal Nehru (Nhava Sheva)', 'country_code' => 'IN',
             'port_type' => 'sea', 'is_active' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['locode' => 'DEHAM', 'port_name' => 'Hamburg', 'country_code' => 'DE',
             'port_type' => 'sea', 'is_active' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $job = $this->shipment($this->beta, 'INNSA', 'DEHAM', 'sea');
        $this->bill($job, 250000);
        $this->cost($job, 190000);

        $lane = collect($this->as($this->accounts)->getJson($this->url('/profitability/lanes'))->assertOk()->json('groups'))
            ->firstWhere('name', 'INNSA → DEHAM');

        $this->assertSame(['Jawaharlal Nehru (Nhava Sheva)', 'Hamburg'], [$lane['origin_name'], $lane['dest_name']]);
        $this->assertSame(['sea', 60000.0], [$lane['mode'], (float) $lane['margin']]);
    }

    public function test_the_report_filters_by_client_lane_and_date_and_exports(): void
    {
        $recent = $this->shipment($this->alpha, 'BOM', 'FRA');
        $this->bill($recent, 100000);
        $this->cost($recent, 70000);

        $old = $this->shipment($this->alpha, 'BOM', 'FRA');
        $old->update(['completed_at' => now()->subDays(200)]);
        $this->bill($old, 500000);
        $this->cost($old, 400000);

        $this->shipment($this->beta, 'MAA', 'DXB');

        $from = now()->subDays(30)->toDateString();
        $body = $this->as($this->accounts)
            ->getJson($this->url("/profitability/jobs?customer_id={$this->alpha->id}&origin=BOM&from={$from}"))
            ->assertOk()->json();

        $this->assertSame(1, $body['totals']['count'], 'the older shipment is outside the window');
        $this->assertSame($recent->execution_job_no, $body['jobs'][0]['job_no']);

        $csv = $this->get($this->url('/profitability/export?by=lane'))->assertOk()->getContent();
        $this->assertStringContainsString('Lane,Mode,Shipments,Revenue,Cost,Margin', $csv);
        $this->assertStringContainsString('BOM → FRA', $csv);
    }

    public function test_a_draft_or_void_document_is_not_revenue(): void
    {
        $job = $this->shipment($this->alpha, 'BOM', 'FRA');
        $this->bill($job, 100000);
        $this->bill($job, 50000)->update(['status' => 'draft']);
        $this->bill($job, 25000)->update(['status' => 'void']);
        $this->cost($job, 60000);

        $row = collect($this->as($this->accounts)->getJson($this->url('/profitability/jobs'))->json('jobs'))
            ->firstWhere('job_no', $job->execution_job_no);

        $this->assertSame(100000.0, (float) $row['revenue'], 'a draft was never sent and a void never stood');
    }

    public function test_pricing_cannot_read_the_margin_report(): void
    {
        $pricing = User::create(['name' => 'Pricing', 'email' => 'pricing-mrg@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1]);

        $this->as($pricing)->getJson('http://focusair.localhost/api/profitability/clients')->assertForbidden();
    }
}
