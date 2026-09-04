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

    /**
     * 🔒 THE OWNERSHIP BOUNDARY. Everyone sees their OWN shipments and nobody else's, and
     * the right column depends on who is asking: `pricing_id` quoted it, `ops_id` is
     * executing it.
     *
     * ⚠️ This is a boundary, not a filter, so it is asserted on what the endpoint RETURNS
     * with no parameters at all — and against a caller who explicitly asks for someone
     * else's rows, which is the case a UI-only scope would have missed entirely.
     */
    public function test_each_person_sees_only_their_own_jobs(): void
    {
        $ops = User::create([
            'name' => 'Ops', 'email' => 'ops-trg@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        // Priced by one person, executed by another — the ordinary case, and the one the
        // old filter got wrong. Converted over HTTP so the job hangs off a real enquiry.
        $enquiry = $this->createEnquiry('air');
        $jobId = $this->api()
            ->postJson("http://{$this->host('air')}/api/enquiries/{$enquiry['id']}/convert", [])
            ->assertStatus(201)
            ->json('job.id');

        \App\Job::withoutGlobalScopes()->where('id', $jobId)->update([
            'pricing_id' => $this->pricing->id,
            'ops_id'     => $ops->id,
        ]);

        // A second pricing user with nothing of their own — the isolation this test exists
        // for. Without them the assertions pass on a branch where one person owns
        // everything, which proves nothing.
        $other = User::create([
            'name' => 'Other Pricing', 'email' => 'pricing2-trg@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);

        $url = "http://{$this->host('air')}/api/jobs";

        // No parameters: the scope is the default, not something the client opts into.
        $this->api()->getJson($url)->assertOk()->assertJsonPath('total', 1);

        $this->as($ops)->getJson($url)->assertOk()->assertJsonPath('total', 1);

        $this->as($other)->getJson($url)->assertOk()->assertJsonPath('total', 0);

        // 🔒 And asking for a colleague's rows by id does not produce them. `?ops_id=`
        // used to be honoured, which handed any authenticated user another person's
        // entire book — the reason this had to move out of the board's filter.
        $this->as($other)->getJson($url . '?ops_id=' . $ops->id)
            ->assertOk()->assertJsonPath('total', 0);
    }

    /**
     * 🔒 The ownership scope has NO exception. `?unassigned=1` used to return every
     * unowned job to any caller; the Kanban's pool holds ENQUIRIES now, so that filter
     * had no legitimate caller and was an escape hatch from a boundary.
     *
     * ⚠️ Asserted with the parameter STILL PRESENT, because "we deleted the feature" and
     * "the parameter is now ignored" are different guarantees — and only the second one
     * protects against a caller who kept the old URL.
     */
    public function test_an_unassigned_filter_cannot_reveal_another_persons_jobs(): void
    {
        $enquiry = $this->createEnquiry('air');
        $this->api()->postJson(
            "http://{$this->host('air')}/api/enquiries/{$enquiry['id']}/convert", []
        )->assertStatus(201);

        $stranger = User::create([
            'name' => 'Stranger', 'email' => 'ops2-trg@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $url = "http://{$this->host('air')}/api/jobs";

        // Owns none of it, and asking the old way does not change that.
        $this->as($stranger)->getJson($url)->assertOk()->assertJsonPath('total', 0);
        $this->as($stranger)->getJson($url . '?unassigned=1')->assertOk()->assertJsonPath('total', 0);

        // The pricing owner still sees their own unowned job — it is not lost, it is
        // simply theirs to assign.
        $this->api()->getJson($url)->assertOk()->assertJsonPath('total', 1);
    }

    /** Authenticate as someone other than the default pricing user. */
    private function as(User $user): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($user),
            'Accept' => 'application/json',
        ]);

        return $this;
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
