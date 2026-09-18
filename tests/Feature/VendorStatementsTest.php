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
 * A supplier's statement against our own vouchers (user, 2026-09-19) — an airline's CASS, a trucker's month, any of
 * them. The question is always the same: does what they billed agree with what we booked for THAT supplier?
 */
class VendorStatementsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $accounts;
    private Partner $airline;
    private Partner $trucker;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.openrouter.key' => null]); // the plain template: no model in tests
        $company = Company::create(['name' => 'Statement Co', 'code' => 'STM', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = User::create(['name' => 'Accounts', 'email' => 'accounts-stm@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id, 'designation' => 'accounts', 'is_active' => 1]);

        $partner = fn (string $name, string $type, string $email) => Partner::create(['company_id' => $company->id,
            'agent_id' => $this->branch->id, 'name' => $name, 'partner_type' => $type, 'email' => $email]);
        $this->airline = $partner('Emirates SkyCargo', 'airline', 'cass@emirates.test');
        $this->trucker = $partner('Speedway Roadlines', 'transporter', 'billing@speedway.test');
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost/api' . $path;
    }

    /** A shipment with an AWB, and optionally a cost booked against one supplier. */
    private function shipment(string $awb, ?Partner $vendor = null, float $cost = 0): Job
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-STMBOM-26-' . random_int(1000, 9999)]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-STMBOM-26-' . random_int(1000, 9999), 'awb_number' => $awb]);

        if ($vendor !== null) {
            $voucherId = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id,
                'job_id' => $job->id, 'vendor_id' => $vendor->id, 'transport_mode' => 'air',
                'voucher_no' => 'PV-STM-' . random_int(1000, 9999), 'document_date' => '2026-09-10', 'status' => 'unpaid',
                'created_at' => now(), 'updated_at' => now()]);
            DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $voucherId, 'charge_type' => 'freight',
                'description' => 'Air freight', 'quantity' => 1, 'rate' => $cost, 'amount' => $cost, 'net_amount' => $cost,
                'created_at' => now(), 'updated_at' => now()]);
        }

        return $job;
    }

    private function import(Partner $vendor, string $csv, string $period = '2026-09'): array
    {
        return $this->as($this->accounts)->postJson($this->url('/vendor-statements'), [
            'agent_id' => $this->branch->id, 'vendor_id' => $vendor->id, 'period' => $period,
            'statement_no' => 'CASS-0912', 'csv' => $csv,
        ])->assertOk()->json();
    }

    public function test_every_line_lands_in_one_of_the_four_states(): void
    {
        $agreed = $this->shipment('176-10000001', $this->airline, 44000);
        $differs = $this->shipment('176-10000002', $this->airline, 30000);
        $this->shipment('176-10000003');                                   // nothing booked for anybody
        $this->shipment('176-10000004', $this->trucker, 9000);             // booked, but to the TRUCKER

        // Their spellings, their column names, and one AWB we have never seen.
        $csv = "AWB No,Description,Flight Date,Chargeable Weight,Rate,Amount\n"
             . "17610000001,Air freight,2026-09-02,200,220,44000.00\n"
             . "176-10000002,Air freight,2026-09-04,150,220,33000.00\n"
             . "176 10000003,Air freight,2026-09-06,100,220,22000.00\n"
             . "176-10000004,Air freight,2026-09-08,50,180,9000.00\n"
             . "176-99999999,Air freight,2026-09-09,10,200,2000.00\n";

        // Keyed by what THEY wrote: the reference is kept as it came, however they spell an AWB.
        $lines = collect($this->import($this->airline, $csv)['lines'])->keyBy('reference');

        $this->assertSame('agreed', $lines['17610000001']['state']);
        $this->assertSame([33000.0, 30000.0, 3000.0], array_map('floatval', [
            $lines['176-10000002']['their_amount'], $lines['176-10000002']['our_amount'], $lines['176-10000002']['difference'],
        ]));
        $this->assertSame('different', $lines['176-10000002']['state']);
        $this->assertSame('not_booked', $lines['176 10000003']['state'], 'the shipment is ours, the cost is not booked');
        // 🔴 The trucker's voucher must never answer for the airline's line.
        $this->assertSame('not_booked', $lines['176-10000004']['state']);
        $this->assertNull($lines['176-10000004']['our_amount']);
        $this->assertSame('unmatched', $lines['176-99999999']['state'], 'we have no such shipment');

        $this->assertSame($agreed->id, $lines['17610000001']['matched_job_id']);
        $this->assertSame($differs->id, $lines['176-10000002']['matched_job_id']);
    }

    public function test_a_period_sent_again_replaces_it_and_comparing_again_picks_up_a_voucher_booked_since(): void
    {
        $job = $this->shipment('176-20000001');
        $csv = "AWB,Description,Amount\n176-20000001,Air freight,25000.00\n";

        $first = $this->import($this->airline, $csv);
        $this->assertSame('not_booked', $first['lines'][0]['state']);
        $statementId = $first['statement']['id'];

        // The same month again — a statement is their whole word for it, so it replaces rather than doubles.
        $again = $this->import($this->airline, $csv . "176-20000002,Air freight,5000.00\n");
        $this->assertSame(1, DB::table('vendor_statements')->where('vendor_id', $this->airline->id)->where('period', '2026-09')->count());
        $this->assertSame(2, count($again['lines']));
        $this->assertSame(30000.0, (float) $again['statement']['their_total']);
        $this->assertNotSame($statementId, $again['statement']['id']);

        // The voucher is booked afterwards; comparing again finds it.
        $voucherId = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $job->id,
            'vendor_id' => $this->airline->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-LATE-1',
            'document_date' => '2026-09-10', 'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $voucherId, 'charge_type' => 'freight',
            'description' => 'Air freight', 'quantity' => 1, 'rate' => 25000, 'amount' => 25000, 'net_amount' => 25000,
            'created_at' => now(), 'updated_at' => now()]);

        $recompared = collect($this->postJson($this->url("/vendor-statements/{$again['statement']['id']}/compare"), [])
            ->assertOk()->json('lines'))->keyBy('reference');

        $this->assertSame('agreed', $recompared['176-20000001']['state']);
        $this->assertSame($voucherId, $recompared['176-20000001']['matched_voucher_id']);
    }

    public function test_the_query_mail_states_every_line_that_does_not_agree_and_goes_to_the_supplier(): void
    {
        $this->shipment('176-30000001', $this->trucker, 8000);
        $this->shipment('176-30000002');

        $csv = "Docket,Particulars,Charges\n"
             . "176-30000001,Trucking BOM-DEL,9500.00\n"
             . "176-30000002,Trucking DEL-BOM,4000.00\n";
        $statement = $this->import($this->trucker, $csv)['statement'];

        $draft = $this->postJson($this->url("/vendor-statements/{$statement['id']}/draft-query"), [])->assertOk()->json();

        $this->assertSame('template', $draft['written_by']);
        $this->assertStringContainsString('Speedway Roadlines — 2026-09', $draft['subject']);
        $this->assertStringContainsString('2 line(s)', $draft['subject']);
        $this->assertStringContainsString('you have billed ₹9,500.00, we have ₹8,000.00 booked', $draft['body']);
        $this->assertStringContainsString('a difference of ₹1,500.00', $draft['body']);
        $this->assertStringContainsString('176-30000002: you have billed ₹4,000.00, we have nothing booked', $draft['body']);
        $this->assertSame(['billing@speedway.test'], $draft['to']);

        // A line queried with them is written down where the next person can read it.
        $lineId = collect($this->getJson($this->url("/vendor-statements/{$statement['id']}"))->json('lines'))
            ->firstWhere('reference', '176-30000001')['id'];
        $disputed = $this->postJson($this->url("/vendor-statements/{$statement['id']}/lines/{$lineId}/dispute"),
            ['dispute_note' => 'Rate agreed at 8,000 — their own quote of 2026-08-30.'])->assertOk()->json();

        $this->assertSame('disputed', $disputed['statement']['status']);
        $this->assertStringContainsString('Rate agreed at 8,000',
            collect($disputed['lines'])->firstWhere('id', $lineId)['dispute_note']);
    }

    public function test_a_statement_with_nothing_to_query_says_so_rather_than_writing_an_empty_mail(): void
    {
        $this->shipment('176-40000001', $this->airline, 15000);
        $statement = $this->import($this->airline, "AWB,Description,Amount\n176-40000001,Air freight,15000.00\n")['statement'];

        $this->postJson($this->url("/vendor-statements/{$statement['id']}/draft-query"), [])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'nothing_to_query');
    }

    public function test_the_list_counts_what_still_has_to_be_checked(): void
    {
        $this->shipment('176-50000001', $this->airline, 15000);
        $this->import($this->airline, "AWB,Description,Amount\n176-50000001,Air freight,19000.00\n176-59999999,Air freight,1000.00\n");

        $body = $this->as($this->accounts)->getJson($this->url('/vendor-statements?vendor_type=airline'))->assertOk()->json();

        $this->assertSame('Emirates SkyCargo', $body['statements'][0]['vendor']);
        $this->assertSame(2, $body['statements'][0]['lines']);
        $this->assertSame(4000.0, (float) $body['statements'][0]['difference']);
        $this->assertSame(1, $body['statements'][0]['by_state']['different']);
        // Every kind of supplier can be reconciled this way, not airlines alone (user, 2026-09-19).
        $this->assertSame(\App\Partner::TYPES, $body['vendor_types']);
    }
}
