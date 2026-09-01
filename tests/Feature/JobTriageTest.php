<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enums\JobStatus;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Numbering and the milestone observer — guide §8.1: *"`ENQA-`/`ENQS-` sequence
 * assignment; observer seeds the initial `Intake` milestone"*.
 *
 * 🔴 **The mode letter is not cosmetic.** `chk_enq_mode_prefix` and
 * `chk_jobs_mode_prefix` reject a row whose number disagrees with its
 * `transport_mode`, so a wrong letter is not a wrong label — the write fails. And the
 * milestone seed is what makes every stage-duration figure in the product possible: a job
 * that never logged `Intake` has no start, so its first transition measures from nothing.
 */
class JobTriageTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Triage Co', 'code' => 'TRG', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->pricing = User::create([
            'name' => 'Pricing', 'email' => 'pricing-trg@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);
    }

    private function api(): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->pricing),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function host(string $mode): string
    {
        return $mode === 'air' ? 'focusair.localhost' : ($mode === 'sea' ? 'focussea.localhost' : 'focusroad.localhost');
    }

    /** Create an enquiry over HTTP on the portal matching the mode. */
    private function createEnquiry(string $mode): array
    {
        return $this->api()->postJson("http://{$this->host($mode)}/api/enquiries", [
            'transport_mode' => $mode,
        ])->assertStatus(201)->json();
    }

    // ─── 1. Sequence assignment, per mode ────────────────────────────────────

    /**
     * 🔴 The prefix is derived from the MODE, never from the portal. They agree today,
     * but a cross-mode caller (an import, a console command, the accounts portal) has no
     * portal at all — deriving from the host would mint an unprefixed number there.
     */
    public function test_each_mode_mints_its_own_enquiry_prefix(): void
    {
        foreach (['air' => 'ENQA', 'sea' => 'ENQS', 'road' => 'ENQR'] as $mode => $prefix) {
            $enquiry = $this->createEnquiry($mode);

            $this->assertStringStartsWith("{$prefix}-", $enquiry['enquiry_no'],
                "A {$mode} enquiry must be numbered {$prefix}-");
        }
    }

    /** The full four-part shape, including the branch code and the fiscal year. */
    public function test_the_number_carries_the_branch_code_and_fiscal_year(): void
    {
        $enquiry = $this->createEnquiry('air');

        $this->assertMatchesRegularExpression(
            '/^ENQA-TRGBOM-\d{2}-\d{4}$/', $enquiry['enquiry_no'],
            'Expected {PREFIX}-{company}{branch}-{fiscal year}-{sequence} with no inner separator.'
        );
    }

    /**
     * ⚠️ Converting mints a JOB number with the matching letter. A job carrying `JOBA-`
     * on a sea shipment is refused by `chk_jobs_mode_prefix`, so this is the difference
     * between a conversion and a 500.
     */
    public function test_conversion_mints_a_job_number_in_the_same_mode(): void
    {
        foreach (['air' => 'JOBA', 'sea' => 'JOBS'] as $mode => $prefix) {
            $enquiry = $this->createEnquiry($mode);

            $job = $this->api()->postJson(
                "http://{$this->host($mode)}/api/enquiries/{$enquiry['id']}/convert", []
            )->assertStatus(201)->json('job');

            $this->assertStringStartsWith("{$prefix}-", $job['execution_job_no']);
        }
    }

    /** Two enquiries on one branch never share a number. */
    public function test_consecutive_enquiries_receive_distinct_numbers(): void
    {
        $first = $this->createEnquiry('air')['enquiry_no'];
        $second = $this->createEnquiry('air')['enquiry_no'];

        $this->assertNotSame($first, $second);
        $this->assertSame(1, (int) substr($second, -4) - (int) substr($first, -4));
    }

    // ─── 2. The observer seeds Intake ────────────────────────────────────────

    /**
     * 🔴 THE SEED. Without an `Intake` row the job has no measured start, and every
     * stage-duration figure downstream silently measures from the FIRST TRANSITION
     * instead — understating the first stage by exactly the time it took.
     */
    public function test_creating_a_job_seeds_the_intake_milestone(): void
    {
        $enquiry = $this->createEnquiry('air');

        $job = $this->api()->postJson(
            "http://focusair.localhost/api/enquiries/{$enquiry['id']}/convert", []
        )->assertStatus(201)->json('job');

        $milestones = DB::table('milestone_performance_logs')
            ->where('job_id', $job['id'])->pluck('milestone_name')->all();

        $this->assertSame([JobStatus::Intake->value], $milestones);
    }

    /**
     * ⚠️ A job created OUTSIDE the API — an import, a console command — is seeded too.
     * The observer is on the model rather than in a controller precisely so this holds
     * however the row arrives.
     */
    public function test_a_job_created_outside_the_api_is_also_seeded(): void
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-TRGBOM-26-9001', 'status' => 'new',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
        ]);

        $this->assertSame(1, DB::table('milestone_performance_logs')
            ->where('job_id', $job->id)->where('milestone_name', JobStatus::Intake->value)->count());
    }

    /**
     * 🔴 EVERY TRANSITION IS LOGGED, AND RE-ENTRY IS TWO ROWS. A job bounced back to
     * Verification visits that stage twice; a timestamp column per milestone would
     * overwrite the first visit and hide the rework entirely — which is the number
     * anybody investigating a slow branch actually wants.
     */
    public function test_re_entering_a_milestone_logs_a_second_row(): void
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-TRGBOM-26-9002', 'status' => 'new',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
        ]);

        $job->update(['status' => JobStatus::Verification->value]);
        $job->update(['status' => JobStatus::Intake->value]);
        $job->update(['status' => JobStatus::Verification->value]);

        $names = DB::table('milestone_performance_logs')
            ->where('job_id', $job->id)->orderBy('id')->pluck('milestone_name')->all();

        $this->assertSame([
            JobStatus::Intake->value,
            JobStatus::Verification->value,
            JobStatus::Intake->value,
            JobStatus::Verification->value,
        ], $names, 'Re-entry must add a row, never overwrite the earlier visit.');
    }

    /** ⚠️ A save that does not change the status writes NO milestone row. */
    public function test_a_non_status_update_logs_nothing(): void
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-TRGBOM-26-9003', 'status' => 'new',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air',
        ]);

        // A real column on `jobs` that is not `status`. (`cargo_description` lives on
        // `enquiries`, not here — the declared cargo belongs to the request, not to the
        // shipment executing it.)
        $job->update(['awb_number' => '020-12345675']);

        $this->assertSame(1, DB::table('milestone_performance_logs')->where('job_id', $job->id)->count(),
            'Only the Intake seed should exist.');
    }
}
