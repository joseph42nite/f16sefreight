<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Services\ConsolidationService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Consolidation — PRD.md §5.8.
 *
 * 🔴 The rule these exist for: *"manifest mismatches between master and house are a
 * customs rejection."* A house still naming last week's vessel is not a stale display
 * — it is a false statement on a customs document, filed under a different bill of
 * lading number from the master that corrects it.
 */
class ConsolidationTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;
    private Job $master;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Consol Co', 'code' => 'CNS', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->ops = $this->user('operations');
        $this->master = $this->job('MASTER');
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-cns@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function job(string $tag, string $mode = 'sea'): Job
    {
        $prefix = $mode === 'sea' ? 'ENQS' : 'ENQA';
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode,
            'enquiry_no' => "{$prefix}-CNSBOM-26-" . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        return Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => $mode,
            'execution_job_no' => ($mode === 'sea' ? 'JOBS' : 'JOBA') . "-CNSBOM-26-"
                . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);
    }

    private function details(Job $job, array $attrs): void
    {
        DB::table('sea_shipment_details')->updateOrInsert(
            ['job_id' => $job->id],
            $attrs + ['updated_at' => now(), 'created_at' => now()]
        );
    }

    private function svc(): ConsolidationService
    {
        return app(ConsolidationService::class);
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

    // ─── The roll-up ─────────────────────────────────────────────────────────

    /** Totals are SUMMED from the houses, so a master can never drift from them. */
    public function test_the_master_totals_are_summed_from_its_houses(): void
    {
        foreach ([[12, 400.5, 2.5], [8, 250.25, 1.75]] as [$pcs, $kg, $cbm]) {
            $house = $this->job('H');
            $this->details($house, ['piece_count' => $pcs, 'gross_weight' => $kg, 'volume_cbm' => $cbm]);
            $this->svc()->link($this->master, $house);
        }

        $master = DB::table('sea_shipment_details')->where('job_id', $this->master->id)->first();

        $this->assertSame(20, (int) $master->piece_count);
        $this->assertSame(650.75, (float) $master->gross_weight);
        $this->assertSame(4.25, (float) $master->volume_cbm);
    }

    /**
     * ⚠️ A master with NO houses is left alone, not zeroed. A direct shipment is not a
     * consol with zero children, and resetting its declared figures would erase a
     * manifest.
     */
    public function test_a_master_with_no_houses_is_not_zeroed(): void
    {
        $this->details($this->master, ['piece_count' => 40, 'gross_weight' => 900.0]);

        $this->svc()->rollUp($this->master->id);

        $row = DB::table('sea_shipment_details')->where('job_id', $this->master->id)->first();
        $this->assertSame(40, (int) $row->piece_count, 'Its own manifest survives.');
    }

    /** Unlinking recomputes — the master must not keep cargo it no longer carries. */
    public function test_unlinking_a_house_reduces_the_master(): void
    {
        $a = $this->job('A');
        $b = $this->job('B');
        $this->details($a, ['piece_count' => 10]);
        $this->details($b, ['piece_count' => 15]);
        $this->svc()->link($this->master, $a);
        $this->svc()->link($this->master, $b);

        $this->assertSame(25, (int) DB::table('sea_shipment_details')->where('job_id', $this->master->id)->value('piece_count'));

        $this->svc()->unlink($b->fresh());

        $this->assertSame(10, (int) DB::table('sea_shipment_details')->where('job_id', $this->master->id)->value('piece_count'));
    }

    /** The debounce collapses a burst — the second call inside the window is skipped. */
    public function test_the_roll_up_is_debounced(): void
    {
        $house = $this->job('H');
        $this->details($house, ['piece_count' => 5]);
        $this->svc()->link($this->master, $house);

        $this->assertTrue($this->svc()->rollUpDebounced($this->master->id), 'First call runs.');
        $this->assertFalse($this->svc()->rollUpDebounced($this->master->id), 'Second inside the window is collapsed.');
    }

    // ─── The routing cascade ─────────────────────────────────────────────────

    /**
     * 🔴 THE RULE THIS FILE EXISTS FOR. A house naming a different vessel from its
     * master is a customs rejection.
     */
    public function test_master_routing_cascades_to_every_house(): void
    {
        $a = $this->job('A');
        $b = $this->job('B');
        $this->details($a, ['piece_count' => 5, 'vessel_name' => 'MV Old', 'pol_code' => 'INXXX']);
        $this->details($b, ['piece_count' => 5, 'vessel_name' => 'MV Old', 'pol_code' => 'INXXX']);
        $this->svc()->link($this->master, $a);
        $this->svc()->link($this->master, $b);

        $this->details($this->master, [
            'vessel_name' => 'MV Ever Given', 'voyage_no' => 'V250E',
            'pol_code' => 'INNSA', 'pod_code' => 'DEHAM', 'imo_number' => '9811000',
        ]);

        $this->assertSame(2, $this->svc()->cascadeRouting($this->master->id));

        foreach ([$a, $b] as $house) {
            $row = DB::table('sea_shipment_details')->where('job_id', $house->id)->first();
            $this->assertSame('MV Ever Given', $row->vessel_name);
            $this->assertSame('INNSA', $row->pol_code);
            $this->assertSame('9811000', $row->imo_number);
        }
    }

    /**
     * ⚠️ ONLY ROUTING CASCADES. Pushing everything would overwrite each house's own
     * cargo figures with the master's — the opposite of what a consolidation is.
     */
    public function test_the_cascade_leaves_house_cargo_figures_alone(): void
    {
        $house = $this->job('H');
        $this->details($house, ['piece_count' => 7, 'gross_weight' => 123.5]);
        $this->svc()->link($this->master, $house);

        $this->details($this->master, ['vessel_name' => 'MV Ever Given', 'piece_count' => 999]);
        $this->svc()->cascadeRouting($this->master->id);

        $row = DB::table('sea_shipment_details')->where('job_id', $house->id)->first();
        $this->assertSame(7, (int) $row->piece_count, 'The house keeps its own cargo.');
        $this->assertSame('MV Ever Given', $row->vessel_name, 'But takes the master routing.');
    }

    // ─── Linking ─────────────────────────────────────────────────────────────

    /**
     * 🔴 A house already on another consol is REFUSED. Silent re-parenting would take
     * cargo off one manifest and add it to another, leaving both disagreeing with what
     * was filed.
     */
    public function test_a_house_cannot_be_stolen_from_another_consol(): void
    {
        $other = $this->job('OTHER');
        $house = $this->job('H');
        $this->details($house, ['piece_count' => 5]);
        $this->svc()->link($other, $house);

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$this->master->id}/link-hbl"), ['house_id' => $house->id])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'already_linked');
    }

    /**
     * A sea consol cannot carry an air house — and TWO layers refuse it.
     *
     * ⚠️ Over HTTP the PORTAL SCOPE gets there first: `forActivePortal()` on
     * focussea. cannot see an air job at all, so the endpoint 404s before the mode
     * check runs. That is the stronger guard and the one that fires in practice.
     *
     * The service-level check still matters, because the cross-mode portals
     * (accounts., admin.) have NO portal scope — there, this is the only thing
     * standing between a consol and a house it cannot carry.
     */
    public function test_a_sea_consol_refuses_an_air_house(): void
    {
        $air = $this->job('AIR', 'air');

        // Layer 1 — the portal never surfaces it.
        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$this->master->id}/link-hbl"), ['house_id' => $air->id])
            ->assertStatus(404)
            ->assertJsonPath('reason', 'not_found');

        // Layer 2 — and the service refuses it even when handed the job directly.
        $this->assertSame(
            ['ok' => false, 'reason' => 'mode_mismatch'],
            $this->svc()->link($this->master, $air)
        );
        $this->assertNull($air->fresh()->parent_job_id);
    }

    // ─── Stuffing ────────────────────────────────────────────────────────────

    /**
     * 🔴 AN ALLOCATION MAY NOT EXCEED WHAT THE HOUSE DECLARES. Stuffing 60 pieces of a
     * 50-piece house means the manifest claims cargo that does not exist, and the
     * discrepancy surfaces at the terminal rather than at filing.
     */
    public function test_stuffing_cannot_exceed_the_house_piece_count(): void
    {
        $house = $this->job('H');
        $this->details($house, ['piece_count' => 50]);
        $this->svc()->link($this->master, $house);

        $c1 = DB::table('sea_containers')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $this->master->id,
            'container_number' => 'CSQU3054383', 'created_at' => now(), 'updated_at' => now(),
        ]);
        $c2 = DB::table('sea_containers')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $this->master->id,
            'container_number' => 'MSKU6874230', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$this->master->id}/stuff"),
                ['container_id' => $c1, 'house_id' => $house->id, 'piece_count' => 30])
            ->assertOk();

        // 30 + 25 = 55 against a 50-piece house.
        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$this->master->id}/stuff"),
                ['container_id' => $c2, 'house_id' => $house->id, 'piece_count' => 25])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'over_allocated');

        // 30 + 20 = 50 exactly is fine.
        $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$this->master->id}/stuff"),
                ['container_id' => $c2, 'house_id' => $house->id, 'piece_count' => 20])
            ->assertOk()
            ->assertJsonPath('reconciliation.unstuffed', 0);
    }

    /** Zero removes the row — the matrix holds only real allocations, never 0-piece ones. */
    public function test_allocating_zero_removes_the_row(): void
    {
        $house = $this->job('H');
        $this->details($house, ['piece_count' => 10]);
        $this->svc()->link($this->master, $house);

        $c = DB::table('sea_containers')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $this->master->id,
            'container_number' => 'CSQU3054383', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->api($this->ops)->postJson($this->url("/api/jobs/{$this->master->id}/stuff"),
            ['container_id' => $c, 'house_id' => $house->id, 'piece_count' => 10])->assertOk();
        $this->assertSame(1, DB::table('sea_container_items')->where('container_id', $c)->count());

        $this->api($this->ops)->postJson($this->url("/api/jobs/{$this->master->id}/stuff"),
            ['container_id' => $c, 'house_id' => $house->id, 'piece_count' => 0])->assertOk();
        $this->assertSame(0, DB::table('sea_container_items')->where('container_id', $c)->count());
    }

    /** The consol screen surfaces the reconciliation the filing will enforce. */
    public function test_the_consol_reports_whether_pieces_balance(): void
    {
        $house = $this->job('H');
        $this->details($house, ['piece_count' => 12]);
        $this->svc()->link($this->master, $house);

        $this->api($this->ops)
            ->getJson($this->url("/api/jobs/{$this->master->id}/consol"))
            ->assertOk()
            ->assertJsonPath('reconciliation.master_pieces', 12)
            ->assertJsonPath('reconciliation.house_pieces', 12)
            ->assertJsonPath('reconciliation.balanced', true);
    }

    /** 🔒 Pricing reads the consol; only operations changes it. */
    public function test_pricing_can_read_but_not_link(): void
    {
        $pricing = $this->user('pricing');
        $house = $this->job('H');

        $this->api($pricing)->getJson($this->url("/api/jobs/{$this->master->id}/consol"))->assertOk();
        $this->api($pricing)
            ->postJson($this->url("/api/jobs/{$this->master->id}/link-hbl"), ['house_id' => $house->id])
            ->assertForbidden();
    }
}
