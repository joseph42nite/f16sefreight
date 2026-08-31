<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Services\OperatorLoadService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The Operator Load Index — PRD.md §5.5.
 *
 * 🔴 THERE IS EXACTLY ONE FORMULA, and these tests exist because an earlier PRD draft
 * had two that produced different numbers for the same operator. The arithmetic is
 * asserted against the PRD's own worked example rather than against itself.
 */
class OperatorLoadTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Load Co', 'code' => 'LOD', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->ops = $this->user('operations');
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create([
            'name' => ucfirst($designation) . $suffix, 'email' => "{$designation}{$suffix}-lod@test.local",
            'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function job(array $attrs = []): Job
    {
        $mode = $attrs['transport_mode'] ?? 'air';
        $prefix = $mode === 'sea' ? 'ENQS' : 'ENQA';

        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode,
            'enquiry_no' => "{$prefix}-LODBOM-26-" . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        return Job::create(array_merge([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => $mode, 'direction' => 'export',
            'ops_id' => $this->ops->id, 'status' => 'Verification',
        ], $attrs));
    }

    private function svc(): OperatorLoadService
    {
        return app(OperatorLoadService::class);
    }

    private function oli(): float
    {
        return $this->svc()->forBranch($this->branch->id)[$this->ops->id]['oli'] ?? 0.0;
    }

    // ─── The formula ─────────────────────────────────────────────────────────

    /** A plain air export clearing later: complexity 1.0 × urgency 1.0. */
    public function test_a_simple_air_export_weighs_its_base_complexity(): void
    {
        $this->job(['planned_clearance_date' => now()->addDays(10)->toDateString()]);

        $this->assertSame(1.0, $this->oli());
    }

    /**
     * 🔴 URGENCY MULTIPLIES, IT DOES NOT ADD. A sea import (2.5) clearing today (×3)
     * is 7.5, not 5.5. This is the distinction the single-formula rule exists for.
     */
    public function test_urgency_multiplies_complexity(): void
    {
        $this->job([
            'transport_mode' => 'sea', 'direction' => 'import',
            'planned_clearance_date' => now()->toDateString(),
        ]);

        $this->assertSame(7.5, $this->oli());
    }

    /** Overdue is treated as today — a job past its date is not less urgent. */
    public function test_an_overdue_job_carries_the_today_multiplier(): void
    {
        $this->job(['planned_clearance_date' => now()->subDays(3)->toDateString()]);

        $this->assertSame(3.0, $this->oli());
    }

    public function test_tomorrow_carries_the_middle_multiplier(): void
    {
        $this->job(['planned_clearance_date' => now()->addDay()->toDateString()]);

        $this->assertSame(2.0, $this->oli());
    }

    /**
     * ⚠️ AN UNSCHEDULED JOB IS `later`, NOT `today`. Treating an unknown date as urgent
     * would inflate every operator holding one, and send the next assignment to
     * whoever happens to have fewer unscheduled jobs rather than less work.
     */
    public function test_a_job_with_no_clearance_date_is_not_urgent(): void
    {
        $this->job(['planned_clearance_date' => null]);

        $this->assertSame(1.0, $this->oli());
    }

    /** β = 0.5 per house, and houses are counted before the urgency multiplier. */
    public function test_house_waybills_add_before_the_multiplier(): void
    {
        $master = $this->job([
            'planned_clearance_date' => now()->toDateString(),
            'is_consolidation' => 1,
        ]);

        foreach (range(1, 4) as $_) {
            $this->job(['parent_job_id' => $master->id, 'ops_id' => null]);
        }

        // (1.0 + 0.5×4) × 3 = 9.0 — NOT 1.0×3 + 2.0.
        $this->assertSame(9.0, $this->oli());
    }

    /**
     * The PRD's own worked example: one air-export clearing today with no houses,
     * plus one sea-import consol clearing next week with 4 houses.
     *
     *   (1.0) × 3  +  (2.5 + 0.5×4) × 1  =  3.0 + 4.5 = 7.5
     */
    public function test_the_prds_worked_example(): void
    {
        $this->job(['planned_clearance_date' => now()->toDateString()]);

        $consol = $this->job([
            'transport_mode' => 'sea', 'direction' => 'import',
            'planned_clearance_date' => now()->addDays(7)->toDateString(),
            'is_consolidation' => 1,
        ]);
        foreach (range(1, 4) as $_) {
            $this->job(['parent_job_id' => $consol->id, 'ops_id' => null, 'transport_mode' => 'sea']);
        }

        $this->assertSame(7.5, $this->oli());
    }

    /**
     * `Lost` is deliberately absent from the exclusion list because it is not a job
     * status at all — it lives on enquiries. Completed and Cancelled ARE excluded:
     * finished work is not load.
     */
    public function test_completed_and_cancelled_jobs_carry_no_load(): void
    {
        $this->job(['status' => 'Completed', 'planned_clearance_date' => now()->toDateString()]);
        $this->job(['status' => 'Cancelled', 'planned_clearance_date' => now()->toDateString()]);

        $this->assertSame(0.0, $this->oli());
    }

    // ─── Policy resolution ───────────────────────────────────────────────────

    /**
     * 🔴 RESOLVED COLUMN BY COLUMN. A branch row overriding only the cap must still
     * inherit the company's complexity weights — taking the whole branch row would
     * silently reset every other parameter to NULL.
     */
    public function test_a_branch_override_of_one_value_inherits_the_rest(): void
    {
        DB::table('tenant_policies')->insert([
            'company_id' => $this->company->id, 'agent_id' => null,
            'oli_complexity_air_export' => 4.0, 'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('tenant_policies')->insert([
            'company_id' => $this->company->id, 'agent_id' => $this->branch->id,
            'oli_capacity_cap' => 99.0, 'created_at' => now(), 'updated_at' => now(),
        ]);

        $policy = $this->svc()->policy($this->branch->id);

        $this->assertSame(99.0, $policy['capacity_cap'], 'Branch wins where it sets a value.');
        $this->assertSame(4.0, $policy['complexity']['air_export'], 'Company still supplies what the branch left NULL.');
        $this->assertSame(0.5, $policy['house_factor'], 'Config supplies what neither sets.');
    }

    // ─── The matrix over HTTP ────────────────────────────────────────────────

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path, string $host = 'focusair.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    /**
     * ⚠️ IDLE OPERATORS APPEAR AT 0.0. They are the whole point of the matrix — an
     * operator with no jobs missing from it is capacity nobody can see.
     */
    public function test_the_matrix_includes_operators_with_no_jobs(): void
    {
        $idle = $this->user('operations', '-idle');
        $this->job(['planned_clearance_date' => now()->toDateString()]);

        $rows = $this->api($this->user('pricing'))
            ->getJson($this->url('/api/jobs/staff-load'))
            ->assertOk()
            ->json('operators');

        $byId = collect($rows)->keyBy('id');
        $this->assertSame(0.0, (float) $byId[$idle->id]['oli']);
        $this->assertSame(3.0, (float) $byId[$this->ops->id]['oli']);
        // Sorted ascending: the operator with the most capacity comes first.
        $this->assertSame($idle->id, $rows[0]['id']);
    }

    /** 🔒 The matrix is ABSENT for operations (PRD §9.4), not merely disabled. */
    public function test_operations_cannot_read_the_staff_matrix(): void
    {
        $this->api($this->ops)
            ->getJson($this->url('/api/jobs/staff-load'))
            ->assertForbidden();
    }

    /** The cap warns; it never blocks. The flag is reported, assignment still works. */
    public function test_the_cap_flags_but_does_not_prevent_assignment(): void
    {
        // Six sea-import jobs clearing today = 6 × 7.5 = 45, well past the 15.0 cap.
        foreach (range(1, 6) as $_) {
            $this->job([
                'transport_mode' => 'sea', 'direction' => 'import',
                'planned_clearance_date' => now()->toDateString(),
            ]);
        }

        $pricing = $this->user('pricing');

        $rows = $this->api($pricing)
            ->getJson($this->url('/api/jobs/staff-load'))
            ->assertOk()
            ->json('operators');

        $mine = collect($rows)->firstWhere('id', $this->ops->id);
        $this->assertTrue($mine['overloaded']);
        $this->assertSame(45.0, (float) $mine['oli']);

        // ...and a reassignment TO that operator is still accepted.
        $job = $this->job(['ops_id' => null]);
        $this->api($pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/reassign"), ['ops_id' => $this->ops->id])
            ->assertOk();
    }
}
