<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enums\EnquiryStatus;
use App\Enums\JobStatus;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Checkpoint 5 — the full lifecycle over real HTTP.
 *
 * 🔴 **Never `actingAs()`.** It bypasses both JWT and the Host-derived portal scope, so
 * these tests would pass while air users saw sea data in production — the precise failure
 * they exist to catch (guide Step 8). Every request below carries a real bearer token and
 * a real `Host` header through the real middleware stack.
 */
class LifecycleApiTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;
    private User $operations;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Lifecycle Co', 'code' => 'LFC', 'tier' => 'command']);
        $this->branch = Agent::create([
            'company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM',
        ]);

        $this->pricing = $this->makeUser('pricing');
        $this->operations = $this->makeUser('operations');
        $this->token = auth()->guard('user-api')->login($this->pricing);
    }

    private function makeUser(string $designation, ?string $email = null): User
    {
        return User::create([
            'name' => ucfirst($designation), 'email' => $email ?? "{$designation}-lc@test.local",
            'password' => Hash::make('secret123'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    /**
     * A real token and a real Host, through the real middleware.
     *
     * ⚠️ The host must go in an ABSOLUTE URL, not a `Host` header. Laravel's test client
     * builds `http://localhost/...` from a relative path, and Symfony's Request::create
     * then overrides HTTP_HOST from the URI — silently discarding the header, so every
     * request resolves to the null portal and returns 404 "Unknown portal".
     */
    private function api(?User $as = null): self
    {
        $token = $as ? auth()->guard('user-api')->login($as) : $this->token;

        $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept'        => 'application/json',
        ]);

        return $this;
    }

    /** Absolute URL on the portal under test — see api(). */
    private function url(string $path, string $host = 'focusair.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    // ─── The checkpoint lifecycle: triage → convert → cancel → reinitiate ────

    public function test_the_full_lifecycle_runs_end_to_end(): void
    {
        // 1. TRIAGE — the operator mints the enquiry.
        $enquiry = $this->api()->postJson($this->url('/api/enquiries'), [
            'transport_mode' => 'air', 'extracted_pieces' => 12, 'extracted_weight' => 450.5,
            'origin_code' => 'INBOM', 'dest_code' => 'DEHAM',
        ])->assertCreated()->json();

        $this->assertSame('ENQA-LFCBOM-26-0001', $enquiry['enquiry_no']);
        $this->assertSame('new', $enquiry['status']);

        // 2. CONVERT — the only path that creates a job.
        $converted = $this->api()->postJson($this->url("/api/enquiries/{$enquiry['id']}/convert"), [
            'ops_id' => $this->operations->id, 'planned_clearance_date' => '2026-09-04',
        ])->assertCreated()->json();

        $this->assertSame('JOBA-LFCBOM-26-0001', $converted['job']['execution_job_no']);
        $this->assertSame('Intake', $converted['job']['status']);
        $this->assertSame('converted', $converted['enquiry']['status'], 'JobObserver flips the enquiry.');

        $jobId = $converted['job']['id'];

        // 3. A milestone transition.
        $this->api()->putJson($this->url("/api/jobs/{$jobId}/status"), ['status' => 'Verification'])
            ->assertOk()->assertJsonPath('status', 'Verification');

        // 4. CANCEL — requires a reason.
        $this->api()->postJson($this->url("/api/jobs/{$jobId}/cancel"), ['cancellation_reason' => 'client_cancelled'])
            ->assertOk()->assertJsonPath('status', 'Cancelled');

        // 5. REINITIATE — a FRESH enquiry with a NEW number, lineage preserved.
        $requote = $this->api()->postJson($this->url("/api/jobs/{$jobId}/reinitiate"))->assertCreated()->json();

        $this->assertSame('ENQA-LFCBOM-26-0002', $requote['enquiry']['enquiry_no'],
            'A re-quote mints a new number — freight rates are time-sensitive.');
        $this->assertSame($jobId, $requote['enquiry']['reinitiated_from_job_id']);
        $this->assertSame(12, $requote['enquiry']['extracted_pieces'], 'Declared cargo carries forward.');
        $this->assertNull($requote['enquiry']['quoted_amount'] ?? null,
            'The RATE deliberately does not carry forward — it is why we are re-quoting.');
    }

    // ─── The three failures the checkpoint names ─────────────────────────────

    /** `409` on a double claim — the race is decided in the database, not by a read. */
    public function test_a_second_claim_returns_409(): void
    {
        $jobId = $this->makeJob();

        $this->api($this->operations)->postJson($this->url("/api/jobs/{$jobId}/claim"))->assertOk();

        // A SECOND operations user — not a second designation. 'operations2' is not a
        // real designation and the portal would refuse it, masking the 409 under a 403.
        $second = $this->makeUser('operations', 'operations-2-lc@test.local');
        $this->api($second)->postJson($this->url("/api/jobs/{$jobId}/claim"))
            ->assertStatus(409)
            ->assertJsonPath('reason', 'already_claimed');
    }

    /** `422` on demoting a converted enquiry — it would be a win and a loss at once. */
    public function test_marking_a_converted_enquiry_lost_returns_422(): void
    {
        $enquiry = $this->api()->postJson($this->url('/api/enquiries'), ['transport_mode' => 'air'])->json();
        $this->api()->postJson($this->url("/api/enquiries/{$enquiry['id']}/convert"))->assertCreated();

        $this->api()->postJson($this->url("/api/enquiries/{$enquiry['id']}/lost"), ['lost_reason' => 'rates_high'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'already_converted');
    }

    /** `422` on cancelling a job whose revenue is already booked and filed. */
    public function test_cancelling_a_job_with_posted_invoices_returns_422(): void
    {
        $jobId = $this->makeJob();

        DB::table('accounts_invoices')->insert([
            'agent_id' => $this->branch->id, 'job_id' => $jobId,
            'invoice_no' => 'INV-LFCBOM-26-0001', 'type' => 'invoice',
            'document_date' => now()->toDateString(), 'grand_total' => 195880,
            'is_posted' => true, 'status' => 'finalized',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->api()->postJson($this->url("/api/jobs/{$jobId}/cancel"), ['cancellation_reason' => 'client_cancelled'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'has_posted_financials');
    }

    // ─── The gates actually gate, over HTTP ──────────────────────────────────

    /** Operations may not triage; pricing owns it. */
    public function test_operations_cannot_mint_an_enquiry(): void
    {
        $this->api($this->operations)->postJson($this->url('/api/enquiries'), ['transport_mode' => 'air'])
            ->assertForbidden();
    }

    /** Operations must REQUEST a reassignment; only pricing or boss may set it. */
    public function test_operations_cannot_reassign_directly(): void
    {
        $jobId = $this->makeJob();

        $this->api($this->operations)->postJson($this->url("/api/jobs/{$jobId}/reassign"), ['ops_id' => $this->pricing->id])
            ->assertForbidden();

        $this->api($this->operations)->postJson($this->url("/api/jobs/{$jobId}/reassign/request"), ['ops_id' => $this->pricing->id])
            ->assertStatus(202);
    }

    /** An accounts user does not belong on an operational portal. */
    public function test_an_accounts_user_is_refused_on_focusair(): void
    {
        $accounts = $this->makeUser('accounts');

        $this->api($accounts)->getJson($this->url('/api/jobs'))
            ->assertForbidden()
            ->assertJsonPath('reason', 'designation');
    }

    /** 🔴 Unauthenticated access must not reach a tenant-scoped model. */
    public function test_the_lifecycle_is_unreachable_without_a_token(): void
    {
        // setUp() called login(), which resolves the guard for this process. Without
        // forgetting it the request inherits that user and the assertion is meaningless.
        auth()->guard('user-api')->logout();

        $this->withHeaders(['Accept' => 'application/json'])
            ->getJson($this->url('/api/jobs'))
            ->assertUnauthorized();
    }

    /** Cancellation demands a reason — the Boss must be able to review why. */
    public function test_cancelling_without_a_reason_is_rejected(): void
    {
        $jobId = $this->makeJob();

        $this->api()->postJson($this->url("/api/jobs/{$jobId}/cancel"), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('cancellation_reason');
    }

    /** Cancellation must not be reachable through the plain status endpoint. */
    public function test_the_status_endpoint_refuses_to_cancel(): void
    {
        $jobId = $this->makeJob();

        $this->api()->putJson($this->url("/api/jobs/{$jobId}/status"), ['status' => 'Cancelled'])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'use_cancel_endpoint');
    }

    private function makeJob(): int
    {
        $enquiry = $this->api()->postJson($this->url('/api/enquiries'), ['transport_mode' => 'air'])->json();

        return $this->api()->postJson($this->url("/api/enquiries/{$enquiry['id']}/convert"))->json('job.id');
    }
}
