<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Services\IcegateValidator;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * ICEGATE structural validation — guide §4.1.2/§5.4, PRD.md §5.8/§5.9.
 *
 * These are the checks that decide whether a manifest is accepted or a truck is
 * turned away at the gate, so they are asserted behaviourally rather than by
 * inspecting the rule table.
 */
class IcegateValidationTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Customs Co', 'code' => 'CST', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->ops = $this->user('operations');
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-cst@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path, string $host = 'focussea.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    private function job(string $mode = 'sea', ?int $parent = null): Job
    {
        $prefix = $mode === 'sea' ? 'ENQS' : 'ENQA';
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode,
            'enquiry_no' => "{$prefix}-CSTBOM-26-" . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        return Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => $mode, 'parent_job_id' => $parent,
        ]);
    }

    private function seaDetails(Job $job, array $overrides = []): void
    {
        DB::table('sea_shipment_details')->insert(array_merge([
            'job_id' => $job->id, 'mbl_number' => 'MBL0001', 'hbl_number' => 'HBL0001',
            'piece_count' => 12, 'gross_weight' => 4500.500,
            'created_at' => now(), 'updated_at' => now(),
        ], $overrides));
    }

    private function validator(): IcegateValidator
    {
        return app(IcegateValidator::class);
    }

    // ─── ISO 6346 ────────────────────────────────────────────────────────────

    /**
     * The check digit is the difference between a correction and a truck turned away
     * at the terminal gate — the number is rejected THERE, not at filing.
     */
    public function test_the_iso_6346_check_digit_is_actually_computed(): void
    {
        $v = $this->validator();

        // Real, well-formed container numbers.
        $this->assertTrue($v->isValidContainerNumber('CSQU3054383'));
        $this->assertTrue($v->isValidContainerNumber('MSKU6874230'));

        // Same numbers, one digit mistyped — the shape is right, the checksum is not.
        $this->assertFalse($v->isValidContainerNumber('CSQU3054384'));
        $this->assertFalse($v->isValidContainerNumber('MSKU6874231'));

        // Structurally wrong.
        $this->assertFalse($v->isValidContainerNumber('CSQ30543835'));
        $this->assertFalse($v->isValidContainerNumber(''));
        $this->assertFalse($v->isValidContainerNumber(null));
    }

    public function test_a_bad_container_number_blocks_the_filing(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job);

        DB::table('sea_containers')->insert([
            'agent_id' => $this->branch->id, 'job_id' => $job->id,
            'container_number' => 'CSQU3054384', 'seal_number' => 'SEAL1',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $rules = array_column($this->validator()->validate($job), 'rule');
        $this->assertContains('iso_6346', $rules);
    }

    // ─── The two cross-row rules ─────────────────────────────────────────────

    /**
     * 🔴 HOUSE PIECE COUNTS MUST TOTAL THE MASTER EXACTLY. 47 against 48 means one
     * house is carrying cargo nobody manifested.
     */
    public function test_house_piece_counts_must_total_the_master_exactly(): void
    {
        $master = $this->job('sea');
        $this->seaDetails($master, ['piece_count' => 48]);

        foreach ([20, 27] as $pieces) {   // 47 — one short.
            $house = $this->job('sea', $master->id);
            $this->seaDetails($house, ['piece_count' => $pieces]);
        }

        $violations = $this->validator()->validate($master);
        $rule = array_values(array_filter($violations, fn ($v) => $v['rule'] === 'houses_must_total_master'));

        $this->assertCount(1, $rule);
        $this->assertSame(['master' => 48, 'houses' => 47], $rule[0]['value']);
    }

    public function test_matching_piece_counts_raise_nothing(): void
    {
        $master = $this->job('sea');
        $this->seaDetails($master, ['piece_count' => 48]);

        foreach ([20, 28] as $pieces) {
            $this->seaDetails($this->job('sea', $master->id), ['piece_count' => $pieces]);
        }

        $this->assertNotContains(
            'houses_must_total_master',
            array_column($this->validator()->validate($master), 'rule')
        );
    }

    /**
     * A direct shipment is NOT a consol with zero children. Reporting "0 of 12 pieces
     * manifested" on a straight job would block every non-consol filing in the system.
     */
    public function test_a_job_with_no_houses_is_not_reconciled_at_all(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job, ['piece_count' => 12]);

        $this->assertNotContains(
            'houses_must_total_master',
            array_column($this->validator()->validate($job), 'rule')
        );
    }

    /**
     * ⚠️ An IMDG class REQUIRES a UN number. The two fields sit on different tabs,
     * which is why this rule is the one most easily lost.
     */
    public function test_an_imdg_class_without_a_un_number_blocks(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job, ['imdg_class' => '3', 'un_number' => null]);

        $this->assertContains('imdg_requires_un', array_column($this->validator()->validate($job), 'rule'));
    }

    public function test_an_imdg_class_with_a_un_number_passes(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job, ['imdg_class' => '3', 'un_number' => 'UN1203']);

        $this->assertNotContains('imdg_requires_un', array_column($this->validator()->validate($job), 'rule'));
    }

    // ─── Lengths ─────────────────────────────────────────────────────────────

    public function test_an_over_length_bill_of_lading_number_blocks(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job, ['mbl_number' => str_repeat('X', 21)]);

        $rules = array_column($this->validator()->validate($job), 'rule');
        $this->assertContains('max:20', $rules);
    }

    /**
     * 🔴 Cargo-IMP's 35-character limit is PER LINE, not per field. An address well
     * under the 500-character cumulative cap still fails on one long line — checking
     * only the total is what makes this rule feel arbitrary when it fires.
     */
    public function test_the_cargo_imp_limit_is_per_line_not_cumulative(): void
    {
        $job = $this->job('air');

        DB::table('air_shipment_details')->insert([
            'job_id' => $job->id,
            // 120 characters overall — comfortably inside 500 — but line 2 is 44.
            'delivery_address' => "Unit 4\n" . str_repeat('A', 44) . "\nMumbai 400001",
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $violations = $this->validator()->validate($job);
        $lineRules = array_values(array_filter($violations, fn ($v) => $v['rule'] === 'cargo_imp_line'));

        $this->assertCount(1, $lineRules, 'Only the one long line is reported.');
        $this->assertStringContainsString('Line 2', $lineRules[0]['message']);
        $this->assertNotContains('address_cumulative', array_column($violations, 'rule'));
    }

    public function test_a_malformed_master_air_waybill_blocks(): void
    {
        $job = $this->job('air');
        $job->update(['awb_number' => '12345678901']); // 11 chars, but no hyphen.

        DB::table('air_shipment_details')->insert([
            'job_id' => $job->id, 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->assertContains('mawb_format', array_column($this->validator()->validate($job), 'rule'));
    }

    // ─── Over HTTP ───────────────────────────────────────────────────────────

    /** Every violation in ONE pass — one at a time is five round trips to a gateway. */
    public function test_the_dry_run_returns_every_violation_at_once(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job, [
            'mbl_number' => str_repeat('X', 21),
            'hbl_number' => str_repeat('Y', 25),
            'imdg_class' => '3', 'un_number' => null,
            'imo_number' => '123',
        ]);

        $body = $this->api($this->ops)
            ->getJson($this->url("/api/jobs/{$job->id}/manifest-check"))
            ->assertOk()
            ->assertJsonPath('filable', false)
            ->json();

        $this->assertGreaterThanOrEqual(4, count($body['violations']));
    }

    public function test_filing_is_refused_while_a_violation_stands(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job, ['mbl_number' => str_repeat('X', 21)]);

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/manifest-filings"), ['icegate_id' => 'AAACB1234D'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'icegate_validation_failed');

        $this->assertDatabaseMissing('manifest_filings', ['job_id' => $job->id]);
    }

    public function test_a_clean_job_files(): void
    {
        $job = $this->job('sea');
        $this->seaDetails($job);

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$job->id}/manifest-filings"), ['icegate_id' => 'AAACB1234D'])
            ->assertStatus(201)
            ->assertJsonPath('icegate_id', 'AAACB1234D');

        $this->assertDatabaseHas('manifest_filings', ['job_id' => $job->id, 'icegate_id' => 'AAACB1234D']);
    }

    /** 🔒 Pricing may READ a filing — that is how a long name gets fixed — but not send one. */
    public function test_pricing_may_check_but_not_file(): void
    {
        $pricing = $this->user('pricing');
        $job = $this->job('sea');
        $this->seaDetails($job);

        $this->api($pricing)->getJson($this->url("/api/jobs/{$job->id}/manifest-check"))->assertOk();
        $this->api($pricing)
            ->postJson($this->url("/api/jobs/{$job->id}/manifest-filings"), ['icegate_id' => 'AAACB1234D'])
            ->assertForbidden();
    }
}
