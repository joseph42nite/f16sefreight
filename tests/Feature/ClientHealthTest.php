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
use Tests\TestCase;

/**
 * The Composite Client Health Score, PRD §7.3.4 H (GAPS #450): five parts in [0, 1], a part without enough data
 * dropped and the rest re-weighted, no score under three parts; payment from the client's report card.
 */
class ClientHealthTest extends TestCase
{
    use DatabaseTransactions;

    private const DATE = '2026-09-15';

    private Company $company;
    private Agent $branch;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Health Co', 'code' => 'HLT', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->client = Customer::create(['company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => 'Globex',
            'email_domain' => 'globex-hlt.test', 'payment_terms_days' => 30]);
    }

    private function shipment(int $daysBefore): void
    {
        $on = Carbon::parse(self::DATE)->subDays($daysBefore)->setTime(10, 0);
        $enquiry = DB::table('enquiries')->insertGetId(['agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'enquiry_no' => 'ENQA-HLT-26-' . random_int(10000, 99999), 'status' => 'converted',
            'origin_code' => 'BOM', 'dest_code' => 'FRA', 'extracted_weight' => 100, 'created_at' => $on, 'updated_at' => $on]);
        DB::table('jobs')->insert(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'status' => 'Verification', 'created_at' => $on, 'updated_at' => $on]);
    }

    private function card(int $score): void
    {
        DB::table('client_payment_reports')->insert(['company_id' => $this->company->id, 'customer_id' => $this->client->id,
            'month' => '2026-09-01', 'terms_days' => 30, 'bills_due' => 3, 'due_value' => 3000, 'on_time_value' => 2400,
            'score' => $score, 'grade' => 'B', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function roll(): object
    {
        $this->artisan('sales:compute-snapshots', ['--date' => self::DATE])->assertSuccessful();

        return DB::table('customer_performance_snapshots')->where('customer_id', $this->client->id)->where('transport_mode', 'air')->first();
    }

    /**
     * Weekly shipments that stopped 14 weeks ago: trend −1 → 0.00, DORMANT → 0.00, won every quote → 1.00, card 80 →
     * 0.80, ops not measured (dropped). Weights .30 .25 .20 .15 re-normalised over .90:
     * (0 + 0 + .20×1 + .15×.80) ÷ .90 = .32 ÷ .90 = 35.56.
     */
    public function test_the_score_reweights_over_the_parts_that_have_data(): void
    {
        for ($week = 14; $week < 52; $week++) {
            $this->shipment(7 * $week);
        }
        $this->card(80);

        // Beside them, a client who shipped once and has a card: one part is not a health score, and absent evidence
        // is not read as bad news — no score, never 0.
        $quiet = Customer::create(['company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => 'Initech',
            'email_domain' => 'initech-hlt.test']);
        $enquiry = DB::table('enquiries')->insertGetId(['agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'customer_id' => $quiet->id, 'enquiry_no' => 'ENQA-HLT-26-Q1', 'status' => 'converted', 'extracted_weight' => 50,
            'created_at' => '2026-09-05', 'updated_at' => '2026-09-05']);
        DB::table('jobs')->insert(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry, 'transport_mode' => 'air',
            'customer_id' => $quiet->id, 'status' => 'Verification', 'created_at' => '2026-09-05', 'updated_at' => '2026-09-05']);
        DB::table('client_payment_reports')->insert(['company_id' => $this->company->id, 'customer_id' => $quiet->id,
            'month' => '2026-09-01', 'terms_days' => 30, 'bills_due' => 3, 'due_value' => 3000, 'on_time_value' => 3000,
            'score' => 100, 'grade' => 'A', 'created_at' => now(), 'updated_at' => now()]);

        $this->assertSame('35.56', $this->roll()->client_health_score);
        $this->assertNull(DB::table('customer_performance_snapshots')->where('customer_id', $quiet->id)->value('client_health_score'));
    }

    /** The Sales page gets the parts as well as the number — the PRD's "component bars, never the bare number". */
    public function test_the_client_book_carries_each_part(): void
    {
        for ($week = 14; $week < 52; $week++) {
            $this->shipment(7 * $week);
        }
        $this->card(80);
        $this->roll();

        $boss = User::create(['name' => 'Boss', 'email' => 'boss-hlt@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => 'boss', 'is_active' => 1]);
        $row = collect($this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($boss), 'Accept' => 'application/json'])
            ->getJson('http://admin.f16sefreight.com/api/sales/dashboard')->assertOk()->json('book'))->firstWhere('customer_id', $this->client->id);

        $this->assertSame(['momentum' => 0, 'churn' => 0, 'win_rate' => 1, 'payment' => 0.8, 'ops' => null], $row['health']);
        $this->assertEquals(35.56, $row['client_health_score']);
    }
}
