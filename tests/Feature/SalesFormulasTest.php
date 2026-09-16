<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * The sales formulas, checked against figures worked out by hand (user, 2026-09-15).
 *
 * Every test snapshots a fixed date, 15 September 2026, so the arithmetic in each test's comment is exact.
 */
class SalesFormulasTest extends TestCase
{
    use DatabaseTransactions;

    private const DATE = '2026-09-15';

    private Agent $branch;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Formula Co', 'code' => 'FRM', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->client = Customer::create(['company_id' => $company->id, 'name' => 'Globex', 'email_domain' => 'globex.test', 'payment_terms_days' => 30]);
    }

    private function daysBefore(int $days): Carbon
    {
        return Carbon::parse(self::DATE)->subDays($days)->setTime(10, 0);
    }

    /** An enquiry (the mail's figures), and a job when it converted. */
    private function shipment(Carbon $on, float $mailKg, string $status = 'Verification', string $enquiry = 'converted', string $lane = 'BOM-FRA'): ?int
    {
        [$origin, $dest] = explode('-', $lane);

        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air', 'customer_id' => $this->client->id,
            'enquiry_no' => 'ENQA-FRM-26-' . random_int(10000, 99999), 'status' => $enquiry,
            'lost_reason' => $enquiry === 'lost' ? 'rates_high' : null,
            'origin_code' => $origin, 'dest_code' => $dest, 'extracted_weight' => $mailKg,
            'created_at' => $on, 'updated_at' => $on,
        ]);

        if ($enquiry !== 'converted') {
            return null;
        }

        return DB::table('jobs')->insertGetId([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'status' => $status, 'created_at' => $on, 'updated_at' => $on,
        ]);
    }

    private function awb(int $jobId, string $from, string $to, array $lines): void
    {
        $id = random_int(10000000000, 99999999999);
        DB::table('air_way_bills')->insert(['id' => $id, 'job_id' => $jobId, 'agent_id' => $this->branch->id,
            'departure_airport' => $from, 'destination_airport' => $to, 'created_at' => now(), 'updated_at' => now()]);

        foreach ($lines as [$weight, $code]) {
            DB::table('way_bill_consignment_data')->insert(['awb_id' => (string) $id, 'gross_weight' => (string) $weight, 'weight_code' => $code]);
        }
    }

    private function roll(): object
    {
        $this->artisan('sales:compute-snapshots', ['--date' => self::DATE])->assertSuccessful();

        return DB::table('customer_performance_snapshots')->where('customer_id', $this->client->id)->where('transport_mode', 'air')->first();
    }

    /**
     * 🔴 Trend = plain weekly averages, empty weeks counted.
     * 52 weekly shipments: the 13 most recent at 50 kg, the 39 before at 100 kg.
     * 12-month average = (13×50 + 39×100) ÷ 52 = 87.5 · last 13 weeks = 650 ÷ 13 = 50 · (50 − 87.5) ÷ 87.5 = −0.429
     */
    public function test_the_volume_trend_is_the_last_13_weeks_against_the_12_month_weekly_average(): void
    {
        for ($week = 0; $week < 52; $week++) {
            $this->shipment($this->daysBefore(7 * $week + 1), $week < 13 ? 50 : 100);
        }

        $this->assertEqualsWithDelta(-0.429, (float) $this->roll()->momentum, 0.0005);
    }

    /** A client who stopped shipping reads as a fall, not as flat — the old average missed this entirely. */
    public function test_a_client_who_stopped_shipping_shows_a_falling_trend(): void
    {
        for ($week = 14; $week < 52; $week++) {
            $this->shipment($this->daysBefore(7 * $week), 100);
        }

        $this->assertSame(-1.0, (float) $this->roll()->momentum);
    }

    /**
     * 🔴 Once the AWB has gone to the airline its figures count; before that, and for lost quotes, the mail's.
     * Sent job: mail said 300 kg BOM→FRA, the AWB said 500 kg + 220 lb (99.790 kg) DEL→LHR → 599.790 kg DEL→LHR.
     * Unsent job: 200 kg BOM→FRA from the mail. Total 799.790 kg.
     */
    public function test_the_awb_replaces_the_mail_once_the_shipment_has_gone_to_the_airline(): void
    {
        $sent = $this->shipment($this->daysBefore(3), 300, 'Sent to Airline');
        $this->awb($sent, 'DEL, Delhi', 'LHR', [[500, 'K'], [220, 'L']]);
        $unsent = $this->shipment($this->daysBefore(2), 200, 'Verification');
        $this->awb($unsent, 'MAA', 'SIN', [[999, 'K']]);

        $this->assertEqualsWithDelta(799.790, (float) $this->roll()->tonnage_mtd, 0.001);

        $lanes = DB::table('customer_lane_stats')->where('customer_id', $this->client->id)->get()->keyBy(fn ($l) => $l->origin_code . '-' . $l->dest_code);
        $this->assertEqualsWithDelta(599.790, (float) $lanes['DEL-LHR']->tonnage, 0.001);
        $this->assertEqualsWithDelta(200.0, (float) $lanes['BOM-FRA']->tonnage, 0.001);
        $this->assertArrayNotHasKey('MAA-SIN', $lanes->all(), 'an AWB not yet sent to the airline is not final');
    }

    /** Win rate and lost reasons look back 12 months, like everything else: 5 old losses no longer count. */
    public function test_nothing_older_than_12_months_is_counted(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->shipment($this->daysBefore(10 + $i), 100);
            $this->shipment($this->daysBefore(400 + $i), 100, 'Verification', 'lost');
        }

        $snapshot = $this->roll();

        $this->assertSame('100.00', $snapshot->win_rate);
        $this->assertNull($snapshot->price_loss_rate, 'no losses in the window');
    }

    /** Year to date starts on 1 April: a March shipment is last financial year. */
    public function test_year_to_date_starts_on_1_april(): void
    {
        $this->shipment(Carbon::parse('2026-03-20 10:00'), 100);
        $this->shipment(Carbon::parse('2026-04-02 10:00'), 200);

        $this->assertEqualsWithDelta(200.0, (float) $this->roll()->tonnage_ytd, 0.001);
    }

    /**
     * 🔴 Days to pay count unpaid invoices past their terms, weighted by value.
     * Paid ₹1,000, bank match 10 days after the invoice · paid ₹2,000, no match, updated 5 days after ·
     * unpaid ₹1,000 from 90 days ago (past 30-day terms). (10×1000 + 5×2000 + 90×1000) ÷ 4000 = 27.5 → 28; drift 28 − 30 = −2.
     */
    public function test_days_to_pay_include_unpaid_invoices_past_their_terms(): void
    {
        $job = $this->shipment($this->daysBefore(100), 100);
        $invoice = fn (string $status, string $date, float $total, ?string $updated = null) => DB::table('accounts_invoices')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $job, 'customer_id' => $this->client->id, 'transport_mode' => 'air',
            'invoice_no' => 'INV-' . random_int(10000, 99999), 'type' => 'invoice', 'document_date' => $date,
            'status' => $status, 'grand_total' => $total, 'amount_paid' => $status === 'paid' ? $total : 0,
            'created_at' => $date, 'updated_at' => $updated ?? $date,
        ]);

        $matched = $invoice('paid', '2026-08-01', 1000);
        DB::table('bank_transactions')->insert(['agent_id' => $this->branch->id, 'plaid_transaction_id' => 'p-' . random_int(1, 99999),
            'amount' => 1000, 'matched_invoice_id' => $matched, 'created_at' => '2026-08-11 09:00:00', 'updated_at' => '2026-08-11 09:00:00']);
        $invoice('paid', '2026-09-01', 2000, '2026-09-06 09:00:00');
        $invoice('sent', '2026-06-17', 1000);

        $snapshot = $this->roll();

        $this->assertSame(28, (int) $snapshot->dso_days);
        $this->assertSame(-2, (int) $snapshot->payment_drift_days);
    }

    /** 🔴 The nightly run re-derives the worklist but never deletes a client email the rep has already drafted. */
    public function test_a_drafted_client_email_survives_the_nightly_run(): void
    {
        $row = fn (string $audience, ?Carbon $drafted) => DB::table('sales_action_queue')->insertGetId([
            'agent_id' => $this->branch->id, 'customer_id' => $this->client->id, 'transport_mode' => 'air',
            'audience' => $audience, 'action_type' => $audience === 'client' ? 'client_new_lanes' : 'churn_outreach',
            'priority_score' => 10, 'status' => 'open', 'fact_packet' => '{}',
            'draft_subject' => $drafted ? 'Hello' : null, 'draft_generated_at' => $drafted,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->shipment($this->daysBefore(3), 100);
        $drafted = $row('client', now());
        $stale = $row('internal', null);

        $this->roll();

        $this->assertTrue(DB::table('sales_action_queue')->where('id', $drafted)->exists());
        $this->assertFalse(DB::table('sales_action_queue')->where('id', $stale)->exists());
    }

    /** A suggestion that was dismissed or sent rests for 30 days, then comes back if the figures still say so. */
    public function test_a_dismissed_suggestion_rests_for_30_days(): void
    {
        // Shipped every 7 days until 70 days ago → DORMANT → a check-in email is suggested.
        for ($week = 10; $week < 30; $week++) {
            $this->shipment($this->daysBefore(7 * $week), 100);
        }
        $dismissedDaysAgo = function (int $days, string $status = 'dismissed') {
            DB::table('sales_action_queue')->where('customer_id', $this->client->id)->delete();
            DB::table('sales_action_queue')->insert([
                'agent_id' => $this->branch->id, 'customer_id' => $this->client->id, 'transport_mode' => 'air',
                'audience' => 'client', 'action_type' => 'client_reactivation', 'priority_score' => 50,
                'status' => $status, 'fact_packet' => '{}', 'dismissed_reason' => $status === 'dismissed' ? 'already_in_touch' : null,
                'dismissed_at' => $status === 'dismissed' ? Carbon::parse(self::DATE)->subDays($days) : null,
                'sent_at' => $status === 'acted' ? Carbon::parse(self::DATE)->subDays($days) : null,
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $this->roll();

            return DB::table('sales_action_queue')->where('customer_id', $this->client->id)
                ->where('action_type', 'client_reactivation')->where('status', 'open')->exists();
        };

        $this->assertFalse($dismissedDaysAgo(5), 'dismissed 5 days ago: not suggested again yet');
        $this->assertTrue($dismissedDaysAgo(40), 'dismissed 40 days ago: suggested again');
        $this->assertFalse($dismissedDaysAgo(9, 'acted'), 'sent 9 days ago: not suggested again yet');
    }

    /**
     * 🔴 ONE PERIOD FOR EVERY CHART (user, 2026-09-16). Tonnage, lanes and win/loss are all drawn over the window
     * the dropdown names — before this, only win/loss followed it while tonnage showed 36 months regardless.
     */
    public function test_the_period_drives_every_chart(): void
    {
        Carbon::setTestNow(Carbon::parse(self::DATE)->setTime(12, 0));
        $this->shipment($this->daysBefore(10), 500, lane: 'BOM-FRA');   // inside every window
        $this->shipment($this->daysBefore(200), 900, lane: 'MAA-DXB');  // only the longer ones
        $this->roll();

        $sales = \App\User::create(['name' => 'Rep', 'email' => 'rep-frm@test.local', 'password' => 'x',
            'company_name' => $this->branch->company_id, 'branch_name' => $this->branch->id, 'designation' => 'sales', 'is_active' => 1]);
        DB::table('customers')->where('id', $this->client->id)->update(['sales_id' => $sales->id]);

        $charts = fn (string $grain) => $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($sales), 'Accept' => 'application/json',
        ])->getJson("http://focusair.localhost/api/sales/charts?grain={$grain}&basis=fiscal")->assertOk()->json();

        $month = $charts('month');
        $day = $charts('day');

        $this->assertSame('the last 12 months', $month['window']['label']);
        $this->assertSame('the last 30 days', $day['window']['label']);

        // This month so far: the 1st to today, drawn day by day (user, 2026-09-16).
        $thisMonth = $charts('this_month');
        $this->assertSame('this month so far', $thisMonth['window']['label']);
        $this->assertSame(Carbon::parse(self::DATE)->startOfMonth()->toDateString(), $thisMonth['window']['from']);
        $this->assertSame(1, count($thisMonth['tonnage']), 'one month of lane statistics');
        // A lane from 200 days ago is in the 12-month charts and out of the 30-day ones.
        $this->assertContains('MAA → DXB', collect($month['lanes'])->pluck('lane')->all());
        $this->assertNotContains('MAA → DXB', collect($day['lanes'])->pluck('lane')->all());
        $this->assertGreaterThan(count($day['tonnage']), count($month['tonnage']));

        Carbon::setTestNow();
    }
}
