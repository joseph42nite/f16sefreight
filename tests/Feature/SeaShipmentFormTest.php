<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * FocusSea — PRD.md §5.8.
 *
 * 🔴 The cargo-type matrix is described as a Vue WATCHER in the PRD. These tests exist
 * because a watcher is a convenience: if it were the only enforcement, any caller that
 * is not the form could save an LCL shipment carrying containers — a manifest that
 * contradicts itself, which customs rejects at the gate rather than at filing.
 */
class SeaShipmentFormTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;
    private Job $job;

    /** A real container number: the ISO 6346 check digit is computed, not pattern-matched. */
    private const GOOD_BOX = 'CSQU3054383';
    private const BAD_BOX  = 'CSQU3054384';   // one digit out

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Sea Co', 'code' => 'SEA', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->ops = $this->user('operations');

        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'sea',
            'enquiry_no' => 'ENQS-SEABOM-26-0001',
        ]);
        $this->job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => 'sea', 'execution_job_no' => 'JOBS-SEABOM-26-0001',
        ]);
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-sea@test.local", 'password' => Hash::make('x'),
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

    private function save(array $payload)
    {
        return $this->api($this->ops)
            ->postJson($this->url("/api/jobs/{$this->job->id}/sea-shipment"), $payload);
    }

    // ─── The cargo-type matrix ───────────────────────────────────────────────

    /** FCL carries containers and locks delivery_mode to 'fcl'. */
    public function test_fcl_accepts_containers_and_locks_the_delivery_mode(): void
    {
        $this->save([
            'cargo_type' => 'fcl',
            'containers' => [['container_number' => self::GOOD_BOX, 'seal_number' => 'SEAL001']],
        ])->assertOk()->assertJsonPath('locking.delivery_mode', 'fcl');

        $this->assertDatabaseHas('jobs', ['id' => $this->job->id, 'delivery_mode' => 'fcl']);
        $this->assertDatabaseHas('sea_containers', ['job_id' => $this->job->id, 'container_number' => self::GOOD_BOX]);
    }

    /**
     * 🔴 LCL BOXES ARE MANAGED AT MASTER LEVEL. Containers on an LCL house is a
     * manifest that contradicts itself. Refused server-side, not merely disabled.
     */
    public function test_lcl_refuses_containers(): void
    {
        $this->save([
            'cargo_type' => 'lcl',
            'containers' => [['container_number' => self::GOOD_BOX]],
        ])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'containers_not_allowed');

        $this->assertDatabaseMissing('sea_containers', ['job_id' => $this->job->id]);
    }

    public function test_lcl_locks_the_delivery_mode_and_mandates_dimensions(): void
    {
        $body = $this->save(['cargo_type' => 'lcl', 'volume_cbm' => 12.5])->assertOk()->json('locking');

        $this->assertSame('lcl', $body['delivery_mode']);
        $this->assertFalse($body['containers_enabled']);
        $this->assertTrue($body['dimensions_required'], 'An LCL box cannot be allocated without CBM.');
    }

    /**
     * ⚠️ For the bulk types delivery_mode is CLEARED, and NULL is what "cleared"
     * means. Writing 'bulk' into it would invent a value the enum does not have.
     */
    public function test_bulk_cargo_clears_the_delivery_mode_and_takes_no_containers(): void
    {
        foreach (['break_bulk', 'liquid_bulk', 'bulk', 'ro_ro'] as $type) {
            $locking = $this->save(['cargo_type' => $type])->assertOk()->json('locking');

            $this->assertNull($locking['delivery_mode'], "{$type} clears the delivery mode");
            $this->assertFalse($locking['containers_enabled']);
        }

        $this->save(['cargo_type' => 'bulk', 'containers' => [['container_number' => self::GOOD_BOX]]])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'containers_not_allowed');
    }

    /** delivery_mode is DERIVED — a client cannot send one that contradicts the matrix. */
    public function test_the_delivery_mode_cannot_be_set_by_the_caller(): void
    {
        $this->save(['cargo_type' => 'lcl', 'delivery_mode' => 'fcl'])->assertOk();

        $this->assertDatabaseHas('jobs', ['id' => $this->job->id, 'delivery_mode' => 'lcl']);
    }

    // ─── Shared validation ───────────────────────────────────────────────────

    /**
     * 🔴 The SAME ISO 6346 check the manifest filer runs. Re-implementing it for the
     * form would let the form accept what the filing later refuses — the operator
     * learns at the gateway instead of at the keyboard.
     */
    public function test_a_mistyped_container_number_is_refused_at_the_form(): void
    {
        $this->save([
            'cargo_type' => 'fcl',
            'containers' => [['container_number' => self::BAD_BOX]],
        ])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'iso_6346');
    }

    /** ⚠️ The two fields sit on different tabs, which is why this is server-side. */
    public function test_an_imdg_class_without_a_un_number_is_refused(): void
    {
        $this->save(['cargo_type' => 'fcl', 'imdg_class' => '3'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'imdg_requires_un');

        $this->save(['cargo_type' => 'fcl', 'imdg_class' => '3', 'un_number' => 'UN1203'])
            ->assertOk();
    }

    public function test_a_malformed_imo_number_is_refused(): void
    {
        $this->save(['cargo_type' => 'fcl', 'imo_number' => '12345'])->assertStatus(422);
        $this->save(['cargo_type' => 'fcl', 'imo_number' => '9311581'])->assertOk();
    }

    public function test_an_unknown_container_type_is_refused(): void
    {
        $this->save(['cargo_type' => 'fcl', 'container_type' => '53FT'])->assertStatus(422);
    }

    // ─── The decoupling, from the other direction ────────────────────────────

    /**
     * 🔴 Tabs 9 and 10 are NOT writable here. §6.7's rule runs both ways: a rate edit
     * must not touch a manifest, and a manifest save must not touch the rates.
     */
    public function test_the_manifest_endpoint_cannot_write_charge_lines(): void
    {
        DB::table('accounts_invoices')->insert([
            'agent_id' => $this->branch->id, 'job_id' => $this->job->id,
            'invoice_no' => 'INV-SEABOM-26-0001', 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => 'draft',
            'subtotal' => 0, 'tax_amount' => 0, 'grand_total' => 0, 'amount_paid' => 0,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->save([
            'cargo_type' => 'fcl',
            // Both silently ignored — they are not in the validated set.
            'sell_rate' => 99999,
            'buy_rate'  => 11111,
        ])->assertOk();

        $this->assertSame(0, DB::table('accounts_invoice_items')->count());
    }

    // ─── Gates ───────────────────────────────────────────────────────────────

    /** 🔒 Pricing may READ the manifest — that is how an over-long name gets fixed. */
    public function test_pricing_can_read_but_not_write_the_manifest(): void
    {
        $pricing = $this->user('pricing');

        $this->api($pricing)->getJson($this->url("/api/jobs/{$this->job->id}/sea-shipment"))->assertOk();
        $this->api($pricing)
            ->postJson($this->url("/api/jobs/{$this->job->id}/sea-shipment"), ['cargo_type' => 'fcl'])
            ->assertForbidden();
    }

    /** The form surfaces everything the filing would refuse, before saving. */
    public function test_the_form_reports_filing_violations_up_front(): void
    {
        DB::table('sea_shipment_details')->insert([
            'job_id' => $this->job->id, 'mbl_number' => str_repeat('X', 21),
            'piece_count' => 5, 'created_at' => now(), 'updated_at' => now(),
        ]);

        $rules = collect($this->api($this->ops)
            ->getJson($this->url("/api/jobs/{$this->job->id}/sea-shipment"))
            ->assertOk()
            ->json('violations'))->pluck('rule');

        $this->assertTrue($rules->contains('max:20'));
    }
}
