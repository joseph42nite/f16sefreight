<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * Import, both modes (GAPS #434) — PRD §5.8 sea import, §5.9/§8.1 air import. The delivery order's print is the
 * release gate: saved, and paid or within credit, decided on the server.
 */
class ImportTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $ops;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Import Co', 'code' => 'IMP', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);
        $this->ops = $this->user('operations');
        $this->client = Customer::create(['company_id' => $this->company->id, 'name' => 'Consignee Ltd', 'email_domain' => 'consignee.test']);
    }

    private function user(string $designation): User
    {
        return User::create(['name' => $designation, 'email' => "{$designation}-imp@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $designation, 'is_active' => 1]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function url(string $path, string $mode = 'air'): string
    {
        return 'http://' . ($mode === 'air' ? 'focusair' : 'focussea') . ".f16sefreight.com/api{$path}";
    }

    /** An import house the ordinary way — from a confirmed enquiry, billed to its client. */
    private function house(string $mode = 'air', string $direction = 'import'): Job
    {
        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => $mode, 'direction' => $direction,
            'enquiry_no' => ($mode === 'air' ? 'ENQA' : 'ENQS') . '-IMPMAA-26-' . random_int(1000, 9999), 'customer_id' => $this->client->id]);

        return Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => $mode,
            'direction' => $direction, 'customer_id' => $this->client->id,
            'execution_job_no' => ($mode === 'air' ? 'JOBA' : 'JOBS') . '-IMPMAA-26-' . random_int(1000, 9999)]);
    }

    private function bill(Job $job, float $total, float $paid): void
    {
        AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'transport_mode' => $job->transport_mode,
            'customer_id' => $this->client->id, 'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id,
            'billed_party_role' => 'client', 'invoice_no' => 'INV-IMPMAA-26-' . random_int(1000, 9999), 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'status' => $paid >= $total ? 'paid' : 'sent',
            'grand_total' => $total, 'amount_paid' => $paid, 'currency' => 'INR', 'exchange_rate' => 1,
        ]);
    }

    // ─── Air import ──────────────────────────────────────────────────────────

    public function test_an_air_import_consol_is_created_with_no_enquiry(): void
    {
        $id = $this->as($this->ops)->postJson($this->url('/imports'))->assertCreated()
            ->assertJsonPath('document', 'master')->json('job.id');

        $this->assertDatabaseHas('jobs', ['id' => $id, 'transport_mode' => 'air', 'direction' => 'import',
            'is_consolidation' => 1, 'enquiry_id' => null]);
        $this->assertStringStartsWith('JOBA-', Job::withoutTenantScope()->find($id)->execution_job_no);
    }

    public function test_the_air_import_fields_save_where_the_prd_puts_them(): void
    {
        $job = $this->house();

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/import"), [
            'awb_number' => '176-12345675', 'flight_number' => 'EK542', 'pol_code' => 'DXB', 'pod_code' => 'MAA',
            'piece_count' => 12, 'gross_weight' => 480.5, 'arrived_at' => '2026-09-29 06:40', 'free_storage_days' => 3,
            'storage_from' => '2026-10-02', 'igm_no' => '2345678', 'igm_date' => '2026-09-29', 'filing_status' => 'submitted',
        ])->assertOk()->assertJsonPath('import.igm_no', '2345678');

        $this->assertDatabaseHas('jobs', ['id' => $job->id, 'awb_number' => '176-12345675']);
        $this->assertDatabaseHas('air_shipment_details', ['job_id' => $job->id, 'flight_number' => 'EK542', 'piece_count' => 12]);
        $this->assertDatabaseHas('air_import_details', ['job_id' => $job->id, 'free_storage_days' => 3, 'filing_status' => 'submitted']);
    }

    public function test_a_malformed_mawb_or_filing_status_is_refused(): void
    {
        $job = $this->house();

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/import"), ['awb_number' => '17612345675', 'filing_status' => 'done'])
            ->assertStatus(422)->assertJsonValidationErrors(['awb_number', 'filing_status']);
    }

    // ─── Sea import ──────────────────────────────────────────────────────────

    public function test_a_sea_import_keeps_its_igm_on_the_bill(): void
    {
        $job = $this->house('sea');

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/import", 'sea'), ['igm_no' => '9988776', 'igm_date' => '2026-09-28'])
            ->assertOk()->assertJsonPath('details.igm_no', '9988776');

        $this->assertDatabaseHas('sea_shipment_details', ['job_id' => $job->id, 'igm_no' => '9988776']);
        $this->assertDatabaseMissing('air_import_details', ['job_id' => $job->id]);
    }

    public function test_each_portal_lists_only_its_own_imports(): void
    {
        $air = $this->house('air');
        $sea = $this->house('sea');
        $export = $this->house('air', 'export');

        $airIds = array_column($this->as($this->ops)->getJson($this->url('/imports'))->assertOk()->json('jobs'), 'id');
        $seaIds = array_column($this->as($this->ops)->getJson($this->url('/imports', 'sea'))->assertOk()->json('jobs'), 'id');

        $this->assertContains($air->id, $airIds);
        $this->assertNotContains($sea->id, $airIds);
        $this->assertNotContains($export->id, $airIds, 'An export shipment is not an import.');
        $this->assertContains($sea->id, $seaIds);
    }

    public function test_an_export_shipment_has_no_import_documents(): void
    {
        $export = $this->house('air', 'export');

        $this->as($this->ops)->postJson($this->url("/jobs/{$export->id}/delivery-order"), [])->assertStatus(422);
        $this->as($this->ops)->postJson($this->url("/jobs/{$export->id}/arrival-notice"))->assertStatus(422);
    }

    public function test_an_export_house_cannot_join_an_import_consol(): void
    {
        $master = Job::withoutTenantScope()->find($this->as($this->ops)->postJson($this->url('/imports'))->json('job.id'));
        $export = $this->house('air', 'export');

        $this->as($this->ops)->postJson($this->url("/jobs/{$master->id}/link-hbl"), ['house_id' => $export->id])
            ->assertStatus(422)->assertJsonPath('reason', 'direction_mismatch');
        $this->as($this->ops)->postJson($this->url("/jobs/{$master->id}/link-hbl"), ['house_id' => $this->house()->id])->assertOk();
    }

    // ─── Arrival notice ──────────────────────────────────────────────────────

    public function test_the_arrival_notice_is_numbered_once_and_prints(): void
    {
        $job = $this->house();

        $this->as($this->ops)->get($this->url("/jobs/{$job->id}/arrival-notice.pdf"))->assertStatus(422);

        $first = $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice"))->assertOk()->json('arrival_notice.notice_number');
        $again = $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice"))->assertOk()->json('arrival_notice.notice_number');

        $this->assertStringStartsWith('CAN-', $first);
        $this->assertSame($first, $again, 'Issued once; a second press does not burn a number.');
        $this->as($this->ops)->get($this->url("/jobs/{$job->id}/arrival-notice.pdf"))->assertOk()->assertHeader('Content-Type', 'application/pdf');
    }

    // ─── Delivery order — the release gate ───────────────────────────────────

    public function test_a_do_cannot_print_before_it_is_saved(): void
    {
        $job = $this->house();

        $this->as($this->ops)->getJson($this->url("/jobs/{$job->id}/delivery-order.pdf"))
            ->assertStatus(422)->assertJsonPath('reason', 'not_saved');
    }

    public function test_a_paid_shipment_releases_and_the_do_is_then_final(): void
    {
        $job = $this->house();
        $this->client->update(['credit_limit' => 0]);   // 0.00 blocks — so only payment can release it
        $this->bill($job, 11800, 11800);

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/delivery-order"), ['do_given_to' => 'Sharma CHA & Co', 'fee' => 1500])
            ->assertOk()->assertJsonPath('release.allowed', true)->assertJsonPath('release.reason', 'paid');

        $this->as($this->ops)->get($this->url("/jobs/{$job->id}/delivery-order.pdf"))->assertOk()->assertHeader('Content-Type', 'application/pdf');
        $this->assertDatabaseHas('delivery_orders', ['job_id' => $job->id, 'status' => 'released', 'released_by' => $this->ops->id]);

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/delivery-order"), ['do_given_to' => 'Someone else'])
            ->assertStatus(422)->assertJsonPath('reason', 'released');
    }

    public function test_unpaid_over_the_limit_is_refused_and_says_how_much(): void
    {
        $job = $this->house();
        $this->client->update(['credit_limit' => 0]);
        $this->bill($job, 11800, 5000);
        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/delivery-order"), [])->assertOk();

        $this->as($this->ops)->getJson($this->url("/jobs/{$job->id}/delivery-order.pdf"))
            ->assertStatus(422)->assertJsonPath('reason', 'payment_required');
        $this->assertDatabaseHas('delivery_orders', ['job_id' => $job->id, 'status' => 'draft']);
    }

    /** A NULL credit limit is "not configured" and never blocks (the money rules). */
    public function test_a_client_with_no_limit_set_is_within_credit(): void
    {
        $job = $this->house();
        $this->bill($job, 11800, 0);
        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/delivery-order"), [])
            ->assertOk()->assertJsonPath('release.reason', 'within_credit');

        $this->as($this->ops)->get($this->url("/jobs/{$job->id}/delivery-order.pdf"))->assertOk();
    }

    public function test_a_do_names_only_this_shipments_notice(): void
    {
        $job = $this->house();
        $other = $this->house();
        $this->as($this->ops)->postJson($this->url("/jobs/{$other->id}/arrival-notice"))->assertOk();
        $theirs = DB::table('cargo_arrival_notices')->where('job_id', $other->id)->value('id');

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/delivery-order"), ['can_id' => $theirs])
            ->assertStatus(422)->assertJsonValidationErrors('can_id');
    }

    public function test_pricing_may_read_an_import_but_not_release_it(): void
    {
        $job = $this->house();
        $pricing = $this->user('pricing');

        $this->as($pricing)->getJson($this->url("/jobs/{$job->id}/import"))->assertOk();
        $this->as($pricing)->postJson($this->url("/jobs/{$job->id}/delivery-order"), [])->assertForbidden();
        $this->as($pricing)->getJson($this->url("/jobs/{$job->id}/delivery-order.pdf"))->assertForbidden();
    }

    // ─── Parties: the export mapping is not forced onto an import ─────────────

    /** An import master's shipper is the origin agent — which the export mapping would refuse. */
    public function test_an_import_master_names_the_origin_agent_as_shipper_and_the_branch_as_consignee(): void
    {
        $master = $this->as($this->ops)->postJson($this->url('/imports'))->json('job.id');
        $agent = \App\Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id,
            'name' => 'Origin Agent DXB', 'partner_type' => 'agent']);

        $this->as($this->ops)->postJson($this->url("/jobs/{$master}/entities"),
            ['role' => 'shipper', 'party_type' => 'partner', 'party_id' => $agent->id])->assertSuccessful();
        $this->as($this->ops)->postJson($this->url("/jobs/{$master}/entities"),
            ['role' => 'consignee', 'party_type' => 'branch', 'party_id' => $this->branch->id])->assertSuccessful();
    }

    /** A sea import consol is not prefilled with the branch as shipper, as an export master is. */
    public function test_a_sea_import_consol_is_not_prefilled_as_an_export(): void
    {
        $id = $this->as($this->ops)->postJson($this->url('/sea-shipments', 'sea'), ['direction' => 'import', 'cargo_type' => 'fcl'])
            ->assertCreated()->json('job.id');

        $this->assertDatabaseMissing('job_entities', ['job_id' => $id, 'role' => 'shipper', 'party_type' => 'branch']);
    }

    // ─── Houses inside the consol (GAPS #436) ─────────────────────────────────

    /** "Houses come under a master AWB, so it'll be the same enquiry." */
    public function test_a_house_added_inside_a_consol_takes_its_enquiry_and_is_linked(): void
    {
        $house = $this->house();   // an import enquiry's own job — made the consol here
        $house->update(['is_consolidation' => true]);

        $response = $this->as($this->ops)->postJson($this->url("/jobs/{$house->id}/houses"), ['customer_id' => $this->client->id])
            ->assertCreated()->assertJsonCount(1, 'houses');
        $child = Job::withoutTenantScope()->find($response->json('houses.0.id'));

        $this->assertSame((int) $house->enquiry_id, (int) $child->enquiry_id, 'Same enquiry as its master.');
        $this->assertSame('import', $child->direction);
        $this->assertSame($house->id, (int) $child->parent_job_id);
        $this->assertDatabaseHas('job_entities', ['job_id' => $child->id, 'role' => 'consignee', 'party_id' => $this->client->id]);
    }

    /** A consol made directly has no enquiry; its houses trace through it, and cannot be unlinked into nothing. */
    public function test_a_house_of_a_consol_with_no_enquiry_traces_through_it_and_stays_with_it(): void
    {
        $master = $this->as($this->ops)->postJson($this->url('/imports'))->json('job.id');
        $child = $this->as($this->ops)->postJson($this->url("/jobs/{$master}/houses"), [])->assertCreated()->json('houses.0.id');

        $this->assertDatabaseHas('jobs', ['id' => $child, 'enquiry_id' => null, 'parent_job_id' => $master]);
        $this->as($this->ops)->deleteJson($this->url("/jobs/{$master}/link-hbl/{$child}"))
            ->assertStatus(422)->assertJsonPath('reason', 'house_of_this_consol');
    }

    public function test_houses_are_added_to_a_consol_only(): void
    {
        $this->as($this->ops)->postJson($this->url("/jobs/{$this->house()->id}/houses"), [])
            ->assertStatus(422)->assertJsonPath('reason', 'not_a_consol');
    }

    // ─── The arrival notice to the consignee — staged, never sent by itself ──

    private function stagedHouse(): Job
    {
        $job = $this->house();
        DB::table('customer_contacts')->insert(['company_id' => $this->company->id, 'customer_id' => $this->client->id,
            'email' => 'imports@consignee.test', 'source' => 'manual', 'is_primary' => 1, 'message_count' => 3,
            'created_at' => now(), 'updated_at' => now()]);
        DB::table('job_entities')->insert(['agent_id' => $this->branch->id, 'job_id' => $job->id, 'party_type' => 'customer',
            'party_id' => $this->client->id, 'role' => 'consignee', 'created_at' => now(), 'updated_at' => now()]);
        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice"))->assertOk();

        return $job;
    }

    public function test_staging_addresses_the_consignee_and_sends_nothing(): void
    {
        Http::fake();
        $job = $this->stagedHouse();

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice/stage"))->assertOk()
            ->assertJsonPath('arrival_notice.staged_mail.to', ['imports@consignee.test'])
            ->assertJsonPath('arrival_notice.decision', null);

        Http::assertNothingSent();
    }

    public function test_the_notice_goes_only_when_a_person_sends_it_with_the_pdf_attached(): void
    {
        // With a file, Graph creates a draft, attaches to it, then sends it — the fake answers each step.
        Http::fake([
            '*/me/messages' => Http::response(['id' => 'draft-1'], 201),
            '*' => Http::response('', 202),
        ]);
        \App\MailboxConnection::create(['agent_id' => $this->branch->id, 'user_id' => $this->ops->id, 'email_address' => 'ops-imp@test.local',
            'provider' => 'outlook', 'access_token' => 'token', 'is_active' => true, 'auth_state' => 'connected']);
        $job = $this->stagedHouse();
        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice/stage"))->assertOk();

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice/decide"), ['decision' => 'send', 'subject' => 'Your cargo has arrived'])
            ->assertOk()->assertJsonPath('arrival_notice.decision', 'sent');

        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/me/messages') && $request->method() === 'POST'
            && $request['subject'] === 'Your cargo has arrived'
            && $request['toRecipients'][0]['emailAddress']['address'] === 'imports@consignee.test');
        Http::assertSent(fn ($request) => str_contains($request->url(), '/attachments') && str_ends_with((string) $request['name'], '.pdf'));
        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/send'));

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice/decide"), ['decision' => 'send'])->assertStatus(409);
    }

    public function test_a_skipped_notice_is_kept_and_never_sent(): void
    {
        Http::fake();
        $job = $this->stagedHouse();
        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice/stage"))->assertOk();

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice/decide"), ['decision' => 'skip'])
            ->assertOk()->assertJsonPath('arrival_notice.decision', 'skipped')
            ->assertJsonPath('arrival_notice.staged_mail.to', ['imports@consignee.test']);

        Http::assertNothingSent();
    }

    public function test_a_consignee_with_no_address_cannot_be_staged(): void
    {
        $job = $this->house();
        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice"))->assertOk();

        $this->as($this->ops)->postJson($this->url("/jobs/{$job->id}/arrival-notice/stage"))
            ->assertStatus(422)->assertJsonPath('reason', 'no_address');
    }

    /** A house has no MAWB of its own; its notice names the consol's, and never an empty "MAWB". */
    public function test_a_houses_notice_names_its_consols_mawb(): void
    {
        Http::fake();
        $master = Job::withoutTenantScope()->find($this->as($this->ops)->postJson($this->url('/imports'))->json('job.id'));
        $master->update(['awb_number' => '176-61000002']);
        $house = $this->stagedHouse();
        $house->update(['parent_job_id' => $master->id, 'is_sub_shipment' => true]);

        $this->as($this->ops)->postJson($this->url("/jobs/{$house->id}/arrival-notice/stage"))->assertOk()
            ->assertJsonPath('arrival_notice.staged_mail.subject', fn ($s) => str_ends_with($s, '— MAWB 176-61000002'));
    }
}
