<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Services\Sales\OpsScorecard;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * PRD §7.3.4 G measured, not scored (owner, 2026-10-05; GAPS #456): days slower than the branch on our own steps,
 * cancellation rate, FNA rate, declared-vs-actual weight gap — per client, mode and financial-year quarter, NULL below
 * the PRD's minimums, and Command's alone.
 */
class OpsScorecardTest extends TestCase
{
    use DatabaseTransactions;

    private const DATE = '2026-09-15';

    private Company $company;
    private Agent $branch;
    private Customer $slow;
    private Customer $quick;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Ops Co', 'code' => 'OPSQ', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->slow = Customer::create(['company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => 'Slowco',
            'email_domain' => 'slowco-ops.test']);
        $this->quick = Customer::create(['company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => 'Quickco',
            'email_domain' => 'quickco-ops.test']);
    }

    /**
     * A job opened on `$on`, walked through `$steps` (status => days spent in it; the last status is where it stays).
     */
    private function job(Customer $client, string $on, array $steps, array $extra = [], ?Agent $branch = null): int
    {
        $branch ??= $this->branch;
        $at = Carbon::parse($on)->setTime(9, 0);
        $enquiry = DB::table('enquiries')->insertGetId(['agent_id' => $branch->id, 'transport_mode' => 'air',
            'customer_id' => $client->id, 'enquiry_no' => 'ENQA-OPS-26-' . random_int(100000, 999999), 'status' => 'converted',
            'extracted_weight' => $extra['declared'] ?? null, 'created_at' => $at, 'updated_at' => $at]);
        $job = DB::table('jobs')->insertGetId(['agent_id' => $branch->id, 'enquiry_id' => $enquiry, 'transport_mode' => 'air',
            'customer_id' => $client->id, 'status' => $extra['status'] ?? array_key_last($steps), 'awb_number' => $extra['awb'] ?? null,
            'created_at' => $at, 'updated_at' => $at]);

        foreach ($steps as $status => $days) {
            DB::table('milestone_performance_logs')->insert(['agent_id' => $branch->id, 'job_id' => $job, 'milestone_name' => $status,
                'entered_at' => $at->copy(), 'created_at' => $at->copy(), 'updated_at' => $at->copy()]);
            $at->addHours((int) round($days * 24));
        }

        if (isset($extra['actual'])) {
            DB::table('air_shipment_details')->insert(['job_id' => $job, 'gross_weight' => $extra['actual']]);
        }

        return $job;
    }

    private function airline(string $awb, string $status, string $name = 'Air Waybill'): void
    {
        DB::table('status_response')->insert(['business_id' => $awb, 'business_name' => $name, 'business_status_code' => $status,
            'created_at' => now(), 'updated_at' => now()]);
    }

    private function measure(Customer $client): array
    {
        $date = Carbon::parse(self::DATE);

        return app(OpsScorecard::class)->measure([$this->branch->id], $client->id, 'air', OpsScorecard::quarterStart($date), $date->endOfDay());
    }

    public function test_the_quarters_are_the_financial_years(): void
    {
        $this->assertSame('2026-07-01', OpsScorecard::quarterStart(Carbon::parse('2026-09-15'))->toDateString());
        $this->assertSame('Q2 FY 2026-27', OpsScorecard::quarterLabel(Carbon::parse('2026-07-01')));
        $this->assertSame('Q1 FY 2026-27', OpsScorecard::quarterLabel(OpsScorecard::quarterStart(Carbon::parse('2026-04-01'))));
        $this->assertSame('Q4 FY 2026-27', OpsScorecard::quarterLabel(OpsScorecard::quarterStart(Carbon::parse('2027-02-10'))));
    }

    /**
     * Slowco: Intake 2 d, Verification 3 d, PDF Generated 1 d. Quickco: 1, 1, 1. Branch medians over all six jobs:
     * 1.5, 2, 1 — Slowco is +0.5, +1.0, 0 → 1.5 days slower; Quickco is faster on every step → 0, not negative.
     * Slowco's 5 days waiting on the airline after "Sent to Airline" are the airline's, and count for nothing.
     */
    public function test_days_slower_counts_only_our_own_steps_and_only_lateness(): void
    {
        foreach (['2026-07-10', '2026-08-10', '2026-09-01'] as $on) {
            $this->job($this->slow, $on, ['Intake' => 2, 'Verification' => 3, 'PDF Generated' => 1, 'Sent to Airline' => 5, 'Airline Confirmed' => 0]);
            $this->job($this->quick, $on, ['Intake' => 1, 'Verification' => 1, 'PDF Generated' => 1, 'Sent to Airline' => 0.5, 'Airline Confirmed' => 0]);
        }

        $slow = $this->measure($this->slow);
        $this->assertSame(1.5, $slow['days_slower']);
        $this->assertSame(['Intake' => 0.5, 'Verification' => 1.0, 'PDF Generated' => 0.0], $slow['step_deltas']);
        $this->assertSame(0.0, $this->measure($this->quick)['days_slower']);
    }

    /** Two jobs through each step is under the PRD's three: not "0 days slower" — not said at all. */
    public function test_too_few_jobs_through_a_step_says_nothing(): void
    {
        foreach (['2026-07-10', '2026-08-10'] as $on) {
            $this->job($this->slow, $on, ['Intake' => 9, 'Verification' => 9, 'Completed' => 0]);
        }

        $facts = $this->measure($this->slow);
        $this->assertNull($facts['days_slower']);
        $this->assertNull($facts['cancellation_rate']);
        $this->assertNull($facts['fna_rate']);
        $this->assertNull($facts['weight_gap_pct']);
    }

    /**
     * Six jobs, one cancelled (16.67%). The airline answered four waybills and rejected one — then took it after the fix,
     * which is still a rejection (owner); a "Cargo Status" (tracking) row is not an answer to our data. Weight gaps
     * 10, 10, 0, 20, 0 % → median 10.
     */
    public function test_cancellations_fna_and_weight_gap(): void
    {
        $this->job($this->slow, '2026-07-05', ['Intake' => 1, 'Cancelled' => 0], ['status' => 'Cancelled']);
        $cases = [['176-10000001', 110], ['176-10000002', 90], ['176-10000003', 100], ['176-10000004', 120], ['176-10000005', 100]];
        foreach ($cases as $i => [$awb, $actual]) {
            if ($i < 4) {
                $this->job($this->slow, '2026-08-0' . ($i + 1), ['Intake' => 1, 'Completed' => 0], ['awb' => $awb, 'declared' => 100, 'actual' => $actual]);
            } else {
                // The fifth has no waybill answer yet — it is not in the FNA denominator.
                $this->job($this->slow, '2026-08-09', ['Intake' => 1, 'Completed' => 0], ['awb' => $awb, 'declared' => 100, 'actual' => $actual]);
            }
        }
        $this->airline('176-10000001', 'Rejected');
        $this->airline('176-10000001', 'Processed');
        $this->airline('176-10000002', 'Processed');
        $this->airline('176-10000003', 'Processed');
        $this->airline('176-10000004', 'Processed');
        $this->airline('176-10000005', 'Cargo Status');

        $facts = $this->measure($this->slow);

        $this->assertSame(6, $facts['job_count']);
        $this->assertSame(16.67, $facts['cancellation_rate']);
        // Four answered is under five: not enough to call a rate.
        $this->assertNull($facts['fna_rate']);
        $this->assertSame(10.0, $facts['weight_gap_pct']);

        $this->airline('176-10000005', 'Processed');
        $this->assertSame(20.0, $this->measure($this->slow)['fna_rate']);
    }

    /** The nightly rollup writes the running quarter's row — for Command; Tactical has no per-client scorecard. */
    public function test_the_rollup_writes_the_quarter_for_command_only(): void
    {
        foreach (['2026-07-10', '2026-08-10', '2026-09-01'] as $on) {
            $this->job($this->slow, $on, ['Intake' => 2, 'Verification' => 3, 'Completed' => 0]);
            $this->job($this->quick, $on, ['Intake' => 1, 'Verification' => 1, 'Completed' => 0]);
        }

        $tactical = Company::create(['name' => 'Tac Co', 'code' => 'OPSTC', 'tier' => 'tactical']);
        $tacBranch = Agent::create(['company_id' => $tactical->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);
        $tacClient = Customer::create(['company_id' => $tactical->id, 'branch_id' => $tacBranch->id, 'name' => 'Tacclient',
            'email_domain' => 'tacclient-ops.test']);
        $this->job($tacClient, '2026-08-10', ['Intake' => 2, 'Completed' => 0], [], $tacBranch);

        $this->artisan('sales:compute-snapshots', ['--date' => self::DATE])->assertSuccessful();

        $row = DB::table('customer_ops_quarters')->where('customer_id', $this->slow->id)->first();
        $this->assertSame('2026-07-01', $row->quarter_start);
        $this->assertSame('1.50', $row->days_slower);
        $this->assertFalse(DB::table('customer_ops_quarters')->where('customer_id', $tacClient->id)->exists());
        // Measured, not scored: ops_health stays NULL until the owner sets weights.
        $this->assertNull(DB::table('customer_performance_snapshots')->where('customer_id', $this->slow->id)->value('ops_health'));
    }

    /** The Sales page's Accounts row carries the running quarter's facts beside the bars; the ops bar stays empty. */
    public function test_the_client_book_shows_the_quarters_facts(): void
    {
        foreach (['2026-07-10', '2026-08-10', '2026-09-01'] as $on) {
            $this->job($this->slow, $on, ['Intake' => 2, 'Verification' => 3, 'Completed' => 0]);
            $this->job($this->quick, $on, ['Intake' => 1, 'Verification' => 1, 'Completed' => 0]);
        }
        $this->artisan('sales:compute-snapshots', ['--date' => self::DATE])->assertSuccessful();

        $boss = \App\User::create(['name' => 'Boss', 'email' => 'boss-opsq@test.local', 'password' => 'x',
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => 'boss', 'is_active' => 1]);
        $row = collect($this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($boss), 'Accept' => 'application/json'])
            ->getJson('http://admin.f16sefreight.com/api/sales/dashboard')->assertOk()->json('book'))->firstWhere('customer_id', $this->slow->id);

        // On 15 September the running quarter is Q2; Q1 had no jobs, so only Q2 "so far" shows.
        $this->assertSame([['quarter' => 'Q2 FY 2026-27', 'so_far' => true, 'days_slower' => 1.5, 'cancellation_rate' => null,
            'fna_rate' => null, 'weight_gap_pct' => null]], $row['ops']);
        $this->assertNull($row['health']['ops']);
    }
}
