<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Jobs\ProcessPdfOcrJob;
use App\PdfProcessingJob;
use App\Services\OcrRoutingService;
use App\Services\VisionConsentService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * The vision-consent decision — guide §4.1.1.
 *
 * 🔒 **This is the only path in the product that spends a tenant's money.** Everything
 * before it is free by construction: the upload, the text attempt, and parking at
 * `awaiting_vision_consent` all cost nothing. So the assertions here are mostly about what
 * must NOT happen — no credit moving without a human, no paid call after a refusal, and no
 * second charge on a retry.
 *
 * ⚠️ The engines (Gemma for text, Gemini for vision) are deliberately absent from these
 * tests, as they are from `VisionConsentService`. What is asserted is the SPEND decision
 * and the state machine around it; which model runs is the worker's business and arrives
 * with the FastAPI service (GAPS.md #29).
 */
class VisionConsentTest extends TestCase
{
    use DatabaseTransactions;

    private function tenant(string $tier, int $balance): array
    {
        $company = Company::create([
            'name' => "Consent {$tier}", 'code' => 'VC' . strtoupper(substr($tier, 0, 1)),
            'tier' => $tier, 'ocr_credits_balance' => $balance,
        ]);

        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'B', 'branch_code' => 'BOM']);

        $user = User::create([
            'name' => 'U', 'email' => "{$tier}-vc@test.local", 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => 'operations', 'is_active' => 1,
        ]);

        return compact('company', 'branch', 'user');
    }

    /** A parked extraction, exactly as the worker leaves one. */
    private function parked(User $user, array $overrides = []): PdfProcessingJob
    {
        return PdfProcessingJob::create(array_merge([
            'user_id'         => $user->id,
            'original_filename' => 'scan.pdf',
            'temp_file_path'  => 'vc-' . uniqid() . '.pdf',
            'document_type'   => 'Invoice',
            'status'          => 'awaiting_vision_consent',
            'extraction_path' => OcrRoutingService::PATH_NONE,
            'page_count'      => 3,
        ], $overrides));
    }

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(int $jobId): string
    {
        return "http://focusair.localhost/api/user/ocr-consent/{$jobId}";
    }

    private function balance(Company $company): int
    {
        return (int) Company::withoutGlobalScopes()->whereKey($company->id)->value('ocr_credits_balance');
    }

    // ─── Declining ───────────────────────────────────────────────────────────

    /**
     * 🔴 DECLINING COSTS NOTHING, AND MUST BE RECORDED AS A DECISION. `cancelled` with no
     * `failure_code` — booking a decline as a failure would put every cautious operator in
     * an error dashboard, and people who feel they are breaking something stop declining.
     */
    public function test_declining_cancels_and_spends_nothing(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'decline'])
            ->assertStatus(202)
            ->assertJsonPath('job_status', 'cancelled');

        $fresh = $extraction->fresh();

        $this->assertSame('cancelled', $fresh->status);
        $this->assertNull($fresh->failure_code, 'Declining is an outcome, not a failure.');
        $this->assertSame(10, $this->balance($company), 'A decline moved credits.');
        $this->assertSame(0, DB::table('ocr_credit_transactions')
            ->where('pdf_processing_job_id', $extraction->id)->count());
    }

    /** ⚠️ The client's document does not linger on disk after a decline. */
    public function test_declining_discards_the_temp_pdf(): void
    {
        ['user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'decline'])
            ->assertStatus(202);

        $this->assertNull($extraction->fresh()->temp_file_path);
    }

    // ─── Accepting ───────────────────────────────────────────────────────────

    /**
     * 🔴 EXACTLY ONE CREDIT, and the transaction says WHICH extraction burned it. Without
     * `pdf_processing_job_id` the question "what did we spend this on?" has no answer, and
     * a refund cannot find its reservation.
     */
    public function test_accepting_reserves_exactly_one_credit_against_this_extraction(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        Bus::fake();

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])
            ->assertStatus(202)
            ->assertJsonPath('job_status', 'processing');

        $this->assertSame(9, $this->balance($company));

        $rows = DB::table('ocr_credit_transactions')
            ->where('pdf_processing_job_id', $extraction->id)->get();

        $this->assertCount(1, $rows);
        $this->assertSame('consumption', $rows[0]->transaction_type);
        $this->assertSame(-1, (int) $rows[0]->amount);
    }

    /**
     * 🔒 The worker is only ever handed vision AFTER a human said yes. If this dispatched
     * with `allowVision = false` the paid call would never happen; if anything else in the
     * product dispatched it with `true`, money would move without a decision.
     */
    public function test_accepting_dispatches_the_worker_with_vision_enabled(): void
    {
        ['user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        Bus::fake();

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])
            ->assertStatus(202);

        Bus::assertDispatched(ProcessPdfOcrJob::class, fn ($job) =>
            $job->processingJobId === $extraction->id && $job->allowVision === true);
    }

    /**
     * ⚠️ A ZERO BALANCE IS NOT EXHAUSTED, and this is the assertion that says so out loud.
     * The tier floor is NEGATIVE on purpose (tactical: -20) so a busy month finishes its
     * shipments instead of failing mid-document. Read casually this looks like a gate that
     * does not work; it is a bounded overdraft.
     */
    public function test_a_zero_balance_still_extracts_because_the_floor_is_an_overdraft(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 0);
        $extraction = $this->parked($user);

        Bus::fake();

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])
            ->assertStatus(202);

        $this->assertSame(-1, $this->balance($company), 'The overdraft is what lets the month finish.');
    }

    /**
     * 🔴 EXHAUSTED MEANS NO CALL AT ALL — and exhausted is the FLOOR, not zero. The refusal
     * happens before anything is dispatched, so the vendor is never asked to do work the
     * tenant cannot pay for: the one ordering that cannot be undone afterwards.
     */
    public function test_accepting_at_the_floor_refuses_before_any_call(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', -20);
        $extraction = $this->parked($user);

        Bus::fake();

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])
            ->assertStatus(422)
            ->assertJsonPath('reason', VisionConsentService::CREDITS_EXHAUSTED);

        Bus::assertNothingDispatched();

        $this->assertSame('failed', $extraction->fresh()->status);
        $this->assertSame(VisionConsentService::CREDITS_EXHAUSTED, $extraction->fresh()->failure_code);
        $this->assertSame(-20, $this->balance($company), 'Nothing was spent on a refusal.');
    }

    // ─── The prompt can only be answered once, and only by its owner ─────────

    /** ⚠️ A second answer is refused rather than reserving a second credit. */
    public function test_answering_twice_does_not_charge_twice(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        Bus::fake();

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])->assertStatus(202);

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])
            ->assertStatus(422)
            ->assertJsonPath('reason', VisionConsentService::NOT_AWAITING);

        $this->assertSame(9, $this->balance($company), 'The second answer charged again.');
    }

    /** ⚠️ Declining after accepting cannot un-spend a credit — the prompt is answered. */
    public function test_declining_after_accepting_is_refused(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        Bus::fake();

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])->assertStatus(202);
        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'decline'])->assertStatus(422);

        $this->assertSame(9, $this->balance($company));
        $this->assertSame('processing', $extraction->fresh()->status);
    }

    /**
     * 🔒 Answering someone else's prompt spends someone else's credits. Ownership is
     * enforced the same way the status endpoint does it.
     */
    public function test_another_user_cannot_answer_this_prompt(): void
    {
        ['user' => $mine] = $this->tenant('tactical', 10);
        ['user' => $theirs] = $this->tenant('command', 10);

        $extraction = $this->parked($mine);

        $this->api($theirs)->postJson($this->url($extraction->id), ['decision' => 'accept'])
            ->assertStatus(404);

        $this->assertSame('awaiting_vision_consent', $extraction->fresh()->status);
    }

    /** A job that was never parked cannot be consented into a spend. */
    public function test_a_job_that_is_not_awaiting_consent_cannot_be_accepted(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user, ['status' => 'completed']);

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])
            ->assertStatus(422)
            ->assertJsonPath('reason', VisionConsentService::NOT_AWAITING);

        $this->assertSame(10, $this->balance($company));
    }

    /** The decision is a closed vocabulary — anything else is a validation error. */
    public function test_an_unknown_decision_is_rejected(): void
    {
        ['user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'maybe'])
            ->assertStatus(422);

        $this->assertSame('awaiting_vision_consent', $extraction->fresh()->status);
    }

    // ─── Expiry: nobody answered ─────────────────────────────────────────────

    /**
     * 🔴 24 HOURS, NOT 30 MINUTES. An operator may legitimately answer an hour later, so
     * the routine stale sweep must not touch this state — but the client's PDF cannot wait
     * on disk forever either.
     */
    public function test_an_unanswered_prompt_expires_and_deletes_the_temp_pdf(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        DB::table('pdf_processing_jobs')->where('id', $extraction->id)
            ->update(['updated_at' => now()->subHours(25)]);

        $this->artisan('pdf:expire-vision-consent')->assertExitCode(0);

        $fresh = $extraction->fresh();

        $this->assertSame('cancelled', $fresh->status);
        $this->assertNull($fresh->temp_file_path);
        $this->assertNull($fresh->failure_code, 'Nobody answering is not a failure.');
        $this->assertSame(10, $this->balance($company), 'Expiry spent a credit.');
    }

    /** ⚠️ A prompt from an hour ago is still LIVE — the operator is still deciding. */
    public function test_a_recent_prompt_is_not_swept(): void
    {
        ['user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        DB::table('pdf_processing_jobs')->where('id', $extraction->id)
            ->update(['updated_at' => now()->subHours(2)]);

        $this->artisan('pdf:expire-vision-consent')->assertExitCode(0);

        $this->assertSame('awaiting_vision_consent', $extraction->fresh()->status);
    }

    // ─── Refund: the paid call failed ────────────────────────────────────────

    /**
     * 🔴 The tenant authorised one EXTRACTION, not one attempt. `reservationFor()` is what
     * lets a failed vision run find the credit it reserved — there is no mirror column on
     * `pdf_processing_jobs`, deliberately, so this lookup is the only route back.
     */
    public function test_a_failed_vision_run_can_find_and_refund_its_reservation(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        Bus::fake();
        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])->assertStatus(202);
        $this->assertSame(9, $this->balance($company));

        $consent = app(VisionConsentService::class);
        $reservation = $consent->reservationFor($extraction->fresh());

        $this->assertNotNull($reservation);
        $this->assertTrue(app(\App\Services\OcrCreditService::class)->refund($reservation));
        $this->assertSame(10, $this->balance($company), 'The refund did not restore the balance.');
    }

    /**
     * 🔴 AND IT CANNOT REFUND TWICE. Once reversed, `reservationFor()` reports nothing left
     * to give back — the second line of defence behind the UNIQUE index, so a retrying
     * worker does not even attempt a double credit.
     */
    public function test_a_reservation_already_refunded_is_not_offered_again(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', 10);
        $extraction = $this->parked($user);

        Bus::fake();
        $this->api($user)->postJson($this->url($extraction->id), ['decision' => 'accept'])->assertStatus(202);

        $consent = app(VisionConsentService::class);
        $reservation = $consent->reservationFor($extraction->fresh());
        app(\App\Services\OcrCreditService::class)->refund($reservation);

        $this->assertNull($consent->reservationFor($extraction->fresh()),
            'A refunded reservation was offered for refund a second time.');
        $this->assertSame(10, $this->balance($company));
    }
}
