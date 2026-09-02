<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\DocumentShareLink;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Public document links — a draft sent as a LINK instead of an attachment.
 *
 * 🔴 **The token is the entire boundary**, because the download route is unauthenticated
 * by design: a client is not a system user and never will be. So the assertions that
 * matter here are the refusals — expired, revoked, unknown — and the fact that they are
 * indistinguishable from one another.
 */
class DocumentShareLinkTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $user;
    private int $documentId;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake();

        $company = Company::create(['name' => 'Share Co', 'code' => 'SHR', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->user = User::create([
            'name' => 'Ops', 'email' => 'ops-shr@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        Storage::put('docs/awb.pdf', '%PDF-1.4 fake');

        // ⚠️ `job_documents.job_id` is NOT NULL — a document always belongs to a shipment.
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SHRBOM-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);

        $jobId = DB::table('jobs')->insertGetId([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId,
            'transport_mode' => 'air', 'status' => 'Intake',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->documentId = DB::table('job_documents')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $jobId,
            'document_type' => 'awb', 'file_name' => 'awb.pdf',
            'file_path' => 'docs/awb.pdf', 'mime_type' => 'application/pdf',
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

    private function mint(array $body = []): string
    {
        $url = $this->api()
            ->postJson("http://focusair.localhost/api/user/documents/{$this->documentId}/share", $body)
            ->assertStatus(201)
            ->json('url');

        return substr($url, strrpos($url, '/') + 1);
    }

    // ─── The happy path ──────────────────────────────────────────────────────

    public function test_a_link_downloads_the_document(): void
    {
        $token = $this->mint();

        $this->get("http://focusair.localhost/api/d/{$token}")->assertOk();
    }

    /**
     * 🔐 The raw token is never stored. A dump of this table yields no working links, so
     * the only copy is the URL that was handed out.
     */
    public function test_the_raw_token_is_never_stored(): void
    {
        $token = $this->mint();

        $this->assertSame(0, DB::table('document_share_links')
            ->where('token_hash', $token)->count(), 'The raw token is in the table.');

        $this->assertSame(1, DB::table('document_share_links')
            ->where('token_hash', hash('sha256', $token))->count());
    }

    /** ⚠️ Viewing is evidence — it answers "did they ever open it?" in a dispute. */
    public function test_a_download_is_counted(): void
    {
        $token = $this->mint();

        $this->get("http://focusair.localhost/api/d/{$token}")->assertOk();
        $this->get("http://focusair.localhost/api/d/{$token}")->assertOk();

        $row = DB::table('document_share_links')->where('token_hash', hash('sha256', $token))->first();

        $this->assertSame(2, (int) $row->view_count);
        $this->assertNotNull($row->first_viewed_at);
    }

    // ─── The refusals, which are the point ───────────────────────────────────

    public function test_an_unknown_token_is_refused(): void
    {
        $this->get('http://focusair.localhost/api/d/' . str_repeat('a', 48))->assertNotFound();
    }

    public function test_an_expired_link_is_refused(): void
    {
        $token = $this->mint();

        DB::table('document_share_links')->where('token_hash', hash('sha256', $token))
            ->update(['expires_at' => now()->subMinute()]);

        $this->get("http://focusair.localhost/api/d/{$token}")->assertNotFound();
    }

    /** ⚠️ Revocation is a DECISION and is checked separately from expiry. */
    public function test_a_revoked_link_is_refused_before_it_expires(): void
    {
        $token = $this->mint();
        $link = DocumentShareLink::where('token_hash', hash('sha256', $token))->first();

        $this->api()->postJson("http://focusair.localhost/api/user/share-links/{$link->id}/revoke")
            ->assertOk();

        $this->get("http://focusair.localhost/api/d/{$token}")->assertNotFound();
    }

    /**
     * 🔴 EVERY REFUSAL LOOKS THE SAME. Distinguishing expired from revoked from
     * never-existed tells a prober which tokens were once real.
     */
    public function test_every_refusal_is_the_same_response(): void
    {
        $expired = $this->mint();
        DB::table('document_share_links')->where('token_hash', hash('sha256', $expired))
            ->update(['expires_at' => now()->subMinute()]);

        $unknown = $this->get('http://focusair.localhost/api/d/' . str_repeat('b', 48));
        $stale = $this->get("http://focusair.localhost/api/d/{$expired}");

        $this->assertSame($unknown->getStatusCode(), $stale->getStatusCode());
    }

    // ─── Tenancy ─────────────────────────────────────────────────────────────

    /** 🔒 A document id must not be enough to publish another tenant's paperwork. */
    public function test_another_tenant_cannot_mint_a_link_for_this_document(): void
    {
        $other = Company::create(['name' => 'Rival Co', 'code' => 'RIV', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $other->id, 'agent_name' => 'DEL', 'branch_code' => 'DEL']);

        $intruder = User::create([
            'name' => 'Ops', 'email' => 'ops-riv@test.local', 'password' => Hash::make('x'),
            'company_name' => $other->id, 'branch_name' => $branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        $this->api($intruder)
            ->postJson("http://focusair.localhost/api/user/documents/{$this->documentId}/share")
            ->assertNotFound();
    }

    // ─── Client approval ─────────────────────────────────────────────────────

    public function test_a_client_can_approve_a_draft_they_were_sent(): void
    {
        $token = $this->mint(['requires_approval' => true]);

        $this->postJson("http://focusair.localhost/api/d/{$token}/respond", [
            'decision' => 'approved', 'name' => 'A Buyer',
            'email' => 'buyer@client.test', 'comment' => 'Looks right.',
        ])->assertOk();

        $row = DB::table('document_share_links')->where('token_hash', hash('sha256', $token))->first();

        $this->assertSame('approved', $row->approval_status);
        $this->assertSame('buyer@client.test', $row->approver_email);
        $this->assertNotNull($row->responded_at);
    }

    /** ⚠️ Answered once — a second response would overwrite what the operator acted on. */
    public function test_a_draft_cannot_be_answered_twice(): void
    {
        $token = $this->mint(['requires_approval' => true]);
        $body = ['decision' => 'approved', 'name' => 'A', 'email' => 'a@client.test'];

        $this->postJson("http://focusair.localhost/api/d/{$token}/respond", $body)->assertOk();

        $this->postJson("http://focusair.localhost/api/d/{$token}/respond",
            ['decision' => 'rejected', 'name' => 'B', 'email' => 'b@client.test'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'already_answered');

        $this->assertSame('approved', DB::table('document_share_links')
            ->where('token_hash', hash('sha256', $token))->value('approval_status'));
    }

    /**
     * 🔴 A PLAIN SHARE LINK IS FOR READING. Letting any link record an approval would mean
     * a forwarded link could answer for a client who was never asked.
     */
    public function test_a_link_without_approval_cannot_be_answered(): void
    {
        $token = $this->mint();

        $this->postJson("http://focusair.localhost/api/d/{$token}/respond",
            ['decision' => 'approved', 'name' => 'A', 'email' => 'a@client.test'])
            ->assertNotFound();
    }

    /** 🔐 The listing shows what is outstanding — never a token or its hash. */
    public function test_the_listing_never_exposes_a_token(): void
    {
        $token = $this->mint();

        $body = $this->api()
            ->getJson("http://focusair.localhost/api/user/documents/{$this->documentId}/links")
            ->assertOk()->getContent();

        $this->assertStringNotContainsString($token, $body);
        $this->assertStringNotContainsString('token_hash', $body);
    }
}
