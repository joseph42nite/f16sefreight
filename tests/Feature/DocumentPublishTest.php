<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Publishing a waybill — render it, STORE it, and file it against the job.
 *
 * 🔴 **`downloadPdf()` streams and persists nothing**, which is why `job_documents` was
 * empty and every share link had nothing to point at. A client link must resolve to a file
 * that still exists next week, not to a render that happened once.
 */
class DocumentPublishTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $user;
    private int $awbKey;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake();

        $company = Company::create(['name' => 'Publish Co', 'code' => 'PUB', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->user = User::create([
            'name' => 'Ops', 'email' => 'ops-pub@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-PUBBOM-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $jobId = DB::table('jobs')->insertGetId([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId,
            'transport_mode' => 'air', 'status' => 'Intake',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->awbKey = 17680000001;

        DB::table('air_way_bills')->insert([
            'id' => $this->awbKey, 'awb_code' => '176', 'awb_no' => '80000001',
            'agent_id' => $this->branch->id, 'job_id' => $jobId, 'status' => 'generate_pdf',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // ⚠️ The address row is REQUIRED for the template to render at all: the blade reads
        // `$airWayBill->wayBillAddress->ship_phone` unguarded, so a waybill without one
        // throws "Attempt to read property on null". That is reachable in production —
        // `firstBox()` creates the waybill before any address is saved — see GAPS #55.
        DB::table('way_bill_addresses')->insert([
            'awb_id' => (string) $this->awbKey,
            'ship_name' => 'Globex Exports', 'ship_address' => 'Plot 42/A, MIDC',
            'ship_city' => 'Mumbai', 'ship_state' => 'Maharashtra',
            'ship_country' => 'IN', 'ship_post_code' => '400093',
            'cons_name' => 'Emirates Trading LLC', 'cons_address' => 'Warehouse 7',
            'cons_city' => 'Dubai', 'cons_state' => 'Dubai',
            'cons_country' => 'AE', 'cons_post_code' => '17000',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function api(?User $as = null): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as ?? $this->user),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function publish(?User $as = null)
    {
        return $this->api($as)
            ->postJson("http://focusair.localhost/api/user/documents/awb/{$this->awbKey}/publish");
    }

    public function test_publishing_stores_the_pdf_and_files_it_against_the_job(): void
    {
        $id = $this->publish()->assertStatus(201)->json('document_id');

        $document = DB::table('job_documents')->find($id);

        $this->assertNotNull($document);
        $this->assertSame('awb', $document->document_type);
        $this->assertSame('application/pdf', $document->mime_type);

        // 🔴 The file must EXIST. A row pointing at nothing is worse than no row: the
        // share link mints happily and 404s in the client's hands.
        Storage::assertExists($document->file_path);
        $this->assertGreaterThan(0, (int) $document->file_size);
    }

    /**
     * ⚠️ Re-publishing REPLACES the file and reuses the row, so a link already sent keeps
     * working and serves the corrected document. A second row would leave the client
     * holding a link to the version that was wrong.
     */
    public function test_republishing_reuses_the_row_so_an_existing_link_still_works(): void
    {
        $first = $this->publish()->assertStatus(201)->json('document_id');
        $second = $this->publish()->assertStatus(201)->json('document_id');

        $this->assertSame($first, $second);
        $this->assertSame(1, DB::table('job_documents')
            ->where('job_id', DB::table('air_way_bills')->where('id', $this->awbKey)->value('job_id'))
            ->count());
    }

    /**
     * 🔴 A waybill with no job cannot be filed. The link between them exists only because
     * AwbJobLinker makes it (GAPS #39) — writing an orphan document row would put a
     * shareable file against no shipment.
     */
    public function test_an_unlinked_waybill_cannot_be_published(): void
    {
        DB::table('air_way_bills')->where('id', $this->awbKey)->update(['job_id' => null]);

        $this->publish()->assertStatus(422)->assertJsonPath('reason', 'no_job');

        $this->assertSame(0, DB::table('job_documents')->where('agent_id', $this->branch->id)->count());
    }

    /** 🔒 A waybill id must not be enough to publish another tenant's document. */
    public function test_another_tenant_cannot_publish_this_waybill(): void
    {
        $other = Company::create(['name' => 'Rival Co', 'code' => 'PBR', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);

        $intruder = User::create([
            'name' => 'Ops', 'email' => 'ops-pbr@test.local', 'password' => Hash::make('x'),
            'company_name' => $other->id, 'branch_name' => $branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->publish($intruder)->assertNotFound();
    }

    /** The published document is what a share link then points at — end to end. */
    public function test_a_published_document_can_be_shared_and_downloaded(): void
    {
        $documentId = $this->publish()->assertStatus(201)->json('document_id');

        $url = $this->api()
            ->postJson("http://focusair.localhost/api/user/documents/{$documentId}/share")
            ->assertStatus(201)
            ->json('url');

        $token = substr($url, strrpos($url, '/') + 1);

        $this->get("http://focusair.localhost/api/d/{$token}")->assertOk();
    }
}
