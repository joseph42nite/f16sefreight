<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Services\VirusScanner;
use App\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * FocusSea, connected — guide Step 12.1 (GAPS #424).
 *
 * A master is created in FocusSea with no enquiry behind it; a house joins it through the consol engine; the
 * parties start filled by the PRD's HBL/MBL mapping; the PRD's header and fields save; documents are scanned.
 */
class FocusSeaConnectedTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Sea Co', 'code' => 'SEC', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Sea Co Mumbai', 'branch_code' => 'BOM']);
        $this->ops = User::create([
            'name' => 'ops', 'email' => 'ops-seaconn@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);
        $this->client = Customer::create([
            'company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => 'Exporter Ltd',
        ]);
    }

    private function api(): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->ops),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path): string
    {
        return "http://focussea.f16sefreight.com{$path}";
    }

    private function house(string $direction = 'export', int $n = 1): Job
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'sea', 'direction' => $direction,
            'enquiry_no' => "ENQS-SECBOM-26-000{$n}", 'customer_id' => $this->client->id,
        ]);

        return Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'sea',
            'direction' => $direction, 'customer_id' => $this->client->id,
            'execution_job_no' => "JOBS-SECBOM-26-09{$n}0",
        ]);
    }

    private function master(): Job
    {
        $id = $this->api()->postJson($this->url('/api/sea-shipments'), ['cargo_type' => 'fcl'])
            ->assertCreated()->json('job.id');

        return Job::withoutTenantScope()->find($id);
    }

    // ─── A master, from FocusSea ─────────────────────────────────────────────

    public function test_a_master_is_created_with_no_enquiry_and_the_branch_as_its_shipper(): void
    {
        $response = $this->api()->postJson($this->url('/api/sea-shipments'), ['cargo_type' => 'fcl'])->assertCreated();

        $response->assertJsonPath('document', 'master')
            ->assertJsonPath('job.enquiry_id', null)
            ->assertJsonPath('job.is_consolidation', true)
            ->assertJsonPath('locking.delivery_mode', 'fcl');
        $this->assertStringStartsWith('JOBS-', $response->json('job.execution_job_no'));

        $this->assertDatabaseHas('job_entities', [
            'job_id' => $response->json('job.id'), 'role' => 'shipper',
            'party_type' => 'branch', 'party_id' => $this->branch->id,
        ]);
    }

    /** 🔴 The exception is for masters only: a client shipment still traces to its enquiry. */
    /**
     * The operator who makes an export master is its operator, not its pricing owner; a house made inside it carries
     * the master's owners (owner, 2026-10-06: "fix the export master the same way" — GAPS #463, as #462 for imports).
     */
    public function test_the_operator_who_makes_an_export_master_and_its_houses_is_their_operator(): void
    {
        $master = $this->master();

        $this->assertSame($this->ops->id, (int) $master->ops_id);
        $this->assertNull($master->pricing_id);

        $houseId = $this->api()->postJson($this->url("/api/sea-shipments/{$master->id}/houses"))->assertCreated()->json('job.id');
        $house = Job::withoutTenantScope()->find($houseId);
        $this->assertSame($this->ops->id, (int) $house->ops_id);
        $this->assertNull($house->pricing_id);
    }

    public function test_only_a_consolidation_master_may_lack_an_enquiry(): void
    {
        $this->expectException(QueryException::class);

        DB::table('jobs')->insert([
            'agent_id' => $this->branch->id, 'enquiry_id' => null, 'transport_mode' => 'sea',
            'direction' => 'export', 'is_consolidation' => 0, 'execution_job_no' => 'JOBS-SECBOM-26-0099',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    // ─── Parties, pre-filled ─────────────────────────────────────────────────

    public function test_converting_a_sea_enquiry_puts_the_client_in_as_shipper(): void
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'sea', 'direction' => 'export',
            'enquiry_no' => 'ENQS-SECBOM-26-0050', 'customer_id' => $this->client->id,
        ]);
        $pricing = User::create([
            'name' => 'pricing', 'email' => 'pricing-seaconn@test.local', 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);

        $jobId = $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($pricing), 'Accept' => 'application/json',
        ])->postJson($this->url("/api/enquiries/{$enquiry->id}/convert"), [])->assertCreated()->json('job.id');

        $this->assertDatabaseHas('job_entities', [
            'job_id' => $jobId, 'role' => 'shipper', 'party_type' => 'customer', 'party_id' => $this->client->id,
        ]);
    }

    public function test_the_branch_is_a_party_only_as_a_masters_shipper(): void
    {
        $house = $this->house();

        $this->api()->postJson($this->url("/api/jobs/{$house->id}/entities"), [
            'role' => 'shipper', 'party_type' => 'branch', 'party_id' => $this->branch->id,
        ])->assertStatus(422)->assertJsonPath('reason', 'party_type_mismatch');

        $master = $this->master();
        $this->api()->getJson($this->url("/api/jobs/{$master->id}/entities"))
            ->assertOk()->assertJsonPath('entities.0.name', 'Sea Co Mumbai');
    }

    // ─── The header, and the house joining its master ────────────────────────

    public function test_the_header_and_the_prd_fields_save(): void
    {
        $house = $this->house();

        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), [
            'consol_type' => 'agent_consol', 'booking_thru' => 'agent', 'job_order_no' => 'PO-7781',
            'quotation_no' => 'Q-114', 'planned_clearance_date' => '2026-10-02',
            'ts1_code' => 'SGSIN', 'etd' => '2026-10-03', 'eta' => '2026-10-20',
            'commodity_description' => 'Cotton yarn', 'hs_code' => '520512', 'marks_numbers' => 'EXL/1-40',
            'package_code' => 'BAG', 'weight_unit' => 'KGS', 'volume_unit' => 'CBM',
            'bl_type' => 'Negotiable', 'release_type' => 'telex', 'empty_depot' => 'CFS Nhava Sheva',
        ])->assertOk()
            ->assertJsonPath('job.consol_type', 'agent_consol')
            ->assertJsonPath('details.hs_code', '520512')
            ->assertJsonPath('details.release_type', 'telex')
            ->assertJsonPath('document', 'house');

        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), ['hs_code' => '52'])
            ->assertStatus(422);
        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), ['etd' => '2026-10-05', 'eta' => '2026-10-01'])
            ->assertStatus(422);
    }

    /** A value typed in error can be taken out again — an empty field clears it. */
    public function test_an_emptied_field_is_cleared(): void
    {
        $house = $this->house();
        $save = fn (array $p) => $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), $p)->assertOk();

        $save(['vessel_name' => 'MSC WRONG', 'piece_count' => 40]);
        $save(['vessel_name' => '', 'piece_count' => null])
            ->assertJsonPath('details.vessel_name', null)
            ->assertJsonPath('details.piece_count', 40);
    }

    public function test_a_house_joins_its_master_through_the_consol_engine(): void
    {
        $master = $this->master();
        $this->api()->postJson($this->url("/api/jobs/{$master->id}/sea-shipment"), ['vessel_name' => 'MAERSK KOLKATA'])->assertOk();
        $house = $this->house();
        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), ['piece_count' => 12])->assertOk();

        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), ['parent_job_id' => $master->id])
            ->assertOk()
            ->assertJsonPath('parent.execution_job_no', $master->execution_job_no)
            ->assertJsonPath('job.is_sub_shipment', true);

        // The cascade ran (vessel down to the house) and so did the roll-up (pieces up to the master).
        $this->assertDatabaseHas('sea_shipment_details', ['job_id' => $house->id, 'vessel_name' => 'MAERSK KOLKATA']);
        $this->assertDatabaseHas('sea_shipment_details', ['job_id' => $master->id, 'piece_count' => 12]);

        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), ['parent_job_id' => null])
            ->assertOk()->assertJsonPath('parent', null);
        $this->assertDatabaseHas('sea_shipment_details', ['job_id' => $master->id, 'piece_count' => 0]);
    }

    /**
     * 🔴 The form sends the house's whole record, its old vessel included. Joining a master must still leave the
     * house on the MASTER's vessel — found in the browser: the house's own copy was written back over the cascade.
     */
    public function test_the_masters_routing_wins_over_the_houses_own_copy(): void
    {
        $master = $this->master();
        $this->api()->postJson($this->url("/api/jobs/{$master->id}/sea-shipment"), ['vessel_name' => 'MAERSK KOLKATA', 'pol_code' => 'INNSA'])->assertOk();
        $house = $this->house();
        $save = fn (array $p) => $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), $p)->assertOk();
        $save(['vessel_name' => 'MV EVER GIVEN', 'pol_code' => 'INMUN', 'piece_count' => 5]);

        $save(['parent_job_id' => $master->id, 'vessel_name' => 'MV EVER GIVEN', 'pol_code' => 'INMUN', 'piece_count' => 8])
            ->assertJsonPath('details.vessel_name', 'MAERSK KOLKATA')
            ->assertJsonPath('details.pol_code', 'INNSA')
            ->assertJsonPath('details.piece_count', 8)
            ->assertJsonPath('from_master.0', 'por_code');

        // …and the master counts the house's pieces as saved, not as they were before the save.
        $this->assertDatabaseHas('sea_shipment_details', ['job_id' => $master->id, 'piece_count' => 8]);
    }

    public function test_a_house_cannot_go_on_a_job_that_is_not_a_master(): void
    {
        $house = $this->house();
        $other = $this->house('export', 2);

        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), ['parent_job_id' => $other->id])
            ->assertStatus(422)->assertJsonPath('reason', 'not_found');
    }

    /** FocusSea opens on the branch's sea shipments, each naming its own document. */
    public function test_the_list_names_each_document_and_finds_by_bl_number(): void
    {
        $master = $this->master();
        $house = $this->house();
        $this->api()->postJson($this->url("/api/jobs/{$house->id}/sea-shipment"), ['hbl_number' => 'SECHBL0007'])->assertOk();

        $rows = collect($this->api()->getJson($this->url('/api/sea-shipments'))->assertOk()->json('data'))->keyBy('id');
        $this->assertSame('master', $rows[$master->id]['document']);
        $this->assertSame('house', $rows[$house->id]['document']);
        $this->assertSame('Exporter Ltd', $rows[$house->id]['client']);

        $this->api()->getJson($this->url('/api/sea-shipments?q=HBL0007'))->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $house->id);
    }

    // ─── E-Docket ────────────────────────────────────────────────────────────

    public function test_a_document_is_scanned_before_it_is_kept(): void
    {
        Storage::fake();
        $house = $this->house();
        $upload = fn () => $this->api()->post($this->url("/api/jobs/{$house->id}/documents"), [
            'document_type' => 'packing_list',
            'file' => UploadedFile::fake()->createWithContent('packing.pdf', '%PDF-1.4 test'),
        ]);

        $this->mock(VirusScanner::class)->shouldReceive('scan')->twice()->andReturn(
            ['clean' => false, 'signature' => 'Eicar-Test'],
            ['clean' => true, 'signature' => null],
        );
        $upload()->assertStatus(422)->assertJsonPath('reason', 'blocked');
        $this->assertDatabaseMissing('job_documents', ['job_id' => $house->id]);

        $id = $upload()->assertCreated()->json('id');

        $this->api()->getJson($this->url("/api/jobs/{$house->id}/documents"))
            ->assertOk()->assertJsonPath('documents.0.file_name', 'packing.pdf');
        $this->api()->get($this->url("/api/jobs/{$house->id}/documents/{$id}"))->assertOk();
    }
}
