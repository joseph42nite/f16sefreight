<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\PdfProcessingJob;
use App\Services\CircuitBreaker;
use App\Services\ClientNotificationService;
use App\Services\OcrCreditService;
use App\Services\OcrRoutingService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * The credit gate, OCR routing, the circuit breaker and the client-notification consent
 * gate — the four places in Step 4 where getting it wrong costs real money or sends a
 * client something irreversible.
 */
class OcrCreditGateTest extends TestCase
{
    use DatabaseTransactions;

    private function tenant(string $tier, int $balance = 0, ?int $allowance = null): array
    {
        $company = Company::create([
            'name' => "Tenant {$tier}", 'code' => strtoupper(substr($tier, 0, 3)),
            'tier' => $tier, 'ocr_credits_balance' => $balance,
            'ocr_credits_monthly_allowance' => $allowance,
        ]);

        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'B', 'branch_code' => 'BOM']);

        $user = User::create([
            'name' => 'U', 'email' => "{$tier}-ocr@test.local", 'password' => 'x',
            'company_name' => $company->id, 'branch_name' => $branch->id, 'designation' => 'operations',
        ]);

        return compact('company', 'branch', 'user');
    }

    private function extraction(int $userId, array $overrides = []): PdfProcessingJob
    {
        return PdfProcessingJob::create(array_merge([
            'user_id' => $userId, 'original_filename' => 'invoice.pdf',
            'status' => 'pending', 'page_count' => 3,
        ], $overrides));
    }

    // ─── Routing: tier x document class ──────────────────────────────────────

    /**
     * A Core tenant uploading an invoice must be TOLD, not silently handed a blank form.
     * pdfplumber has no template for an arbitrary client invoice, so extraction would
     * return an empty form that looks broken. Core is the upsell tier; this is the moment.
     */
    public function test_a_core_tenant_uploading_an_invoice_fails_with_upgrade_required(): void
    {
        $route = app(OcrRoutingService::class)->route('core', 'Invoice');

        $this->assertSame('fail', $route['action']);
        $this->assertSame(OcrRoutingService::FAILURE_UPGRADE_REQUIRED, $route['failure_code']);
        $this->assertNull($route['endpoint'], 'Nothing may be sent to FastAPI at all.');
    }

    /** Coordinate extraction is free at EVERY tier — it needs no AI. */
    public function test_a_structured_awb_is_free_at_every_tier(): void
    {
        $service = app(OcrRoutingService::class);

        foreach (['core', 'tactical', 'command'] as $tier) {
            $route = $service->route($tier, 'MAWB');

            $this->assertSame('extract', $route['action'], "MAWB must extract on {$tier}.");
            $this->assertSame('/extract', $route['endpoint']);
            $this->assertFalse($route['allow_vision']);
        }
    }

    /** 🔒 The first call is ALWAYS free — vision is never requested up front. */
    public function test_the_first_unstructured_call_never_requests_vision(): void
    {
        foreach (['tactical', 'command'] as $tier) {
            $route = app(OcrRoutingService::class)->route($tier, 'Invoice');

            $this->assertSame('/extract-unstructured', $route['endpoint']);
            $this->assertFalse($route['allow_vision'], 'The system must never reach for a paid path unprompted.');
        }
    }

    /** Core never reaches the consent prompt — offering credits it cannot buy is worse. */
    public function test_core_never_reaches_the_vision_consent_prompt(): void
    {
        $service = app(OcrRoutingService::class);

        $this->assertFalse($service->needsVisionConsent('core', OcrRoutingService::PATH_NONE));
        $this->assertTrue($service->needsVisionConsent('tactical', OcrRoutingService::PATH_NONE));
        $this->assertTrue($service->needsVisionConsent('command', OcrRoutingService::PATH_NONE));
    }

    /**
     * 🔴 The tier must resolve in a queue worker, which has no session. Reading it through
     * the tenant scope would return nothing and route every upload as Core.
     */
    public function test_the_tier_resolves_without_an_authenticated_user(): void
    {
        ['user' => $user] = $this->tenant('command');

        $this->assertFalse(auth()->guard('user-api')->check());
        $this->assertSame('command', app(OcrRoutingService::class)->resolveTier($user->id));
    }

    // ─── The credit gate ─────────────────────────────────────────────────────

    public function test_reserving_a_credit_decrements_the_balance_and_records_what_it_paid_for(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('command', 500);
        $extraction = $this->extraction($user->id);

        $transactionId = app(OcrCreditService::class)->reserve($company, $extraction);

        $this->assertNotNull($transactionId);
        $this->assertSame(499, (int) $company->fresh()->ocr_credits_balance);

        $row = DB::table('ocr_credit_transactions')->find($transactionId);
        $this->assertSame(-1, (int) $row->amount);
        $this->assertSame('consumption', $row->transaction_type);
        $this->assertSame($extraction->id, (int) $row->pdf_processing_job_id,
            'Which extraction burned the credit must be answerable.');
    }

    /**
     * The overdraft floor is negative by design: it lets a busy month finish its shipments
     * rather than failing mid-document, while still bounding the exposure.
     */
    public function test_a_tenant_may_overdraw_to_the_tier_floor_but_no_further(): void
    {
        // command floor is -50 per config/f16s.php
        ['company' => $company, 'user' => $user] = $this->tenant('command', -49);

        $service = app(OcrCreditService::class);

        $this->assertNotNull($service->reserve($company->fresh(), $this->extraction($user->id)),
            'At -49 one more credit reaches the -50 floor and is allowed.');
        $this->assertSame(-50, (int) $company->fresh()->ocr_credits_balance);

        $this->assertNull($service->reserve($company->fresh(), $this->extraction($user->id)),
            'Below the floor the reservation must be refused.');
        $this->assertSame(-50, (int) $company->fresh()->ocr_credits_balance,
            'A refused reservation must not move the balance.');
    }

    /** 🔒 An exhausted balance means NO FastAPI call is made at all. */
    public function test_an_exhausted_balance_returns_null_so_no_paid_call_can_follow(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('tactical', -20); // floor is -20

        $this->assertNull(app(OcrCreditService::class)->reserve($company, $this->extraction($user->id)));
    }

    /** A negotiated per-tenant floor overrides the tier default. */
    public function test_a_pinned_override_wins_over_the_tier_default(): void
    {
        $company = Company::create([
            'name' => 'Negotiated', 'code' => 'NEG', 'tier' => 'tactical',
            'ocr_credits_balance' => 0, 'ocr_credits_limit' => -500,
        ]);

        $this->assertSame(-500, $company->creditFloor());
        $this->assertTrue(app(OcrCreditService::class)->canAfford($company));
    }

    // ─── Refund ──────────────────────────────────────────────────────────────

    public function test_a_failed_vision_call_refunds_the_reservation(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('command', 500);
        $service = app(OcrCreditService::class);

        $transactionId = $service->reserve($company, $this->extraction($user->id));
        $this->assertSame(499, (int) $company->fresh()->ocr_credits_balance);

        $this->assertTrue($service->refund($transactionId));
        $this->assertSame(500, (int) $company->fresh()->ocr_credits_balance);
    }

    /**
     * 🔴 Double-refund is impossible BY CONSTRUCTION — the UNIQUE index rejects the second
     * one. Retries are exactly when an application-level check gets skipped, which is why
     * the guarantee lives in the database.
     */
    public function test_a_retried_refund_cannot_credit_twice(): void
    {
        ['company' => $company, 'user' => $user] = $this->tenant('command', 500);
        $service = app(OcrCreditService::class);

        $transactionId = $service->reserve($company, $this->extraction($user->id));

        $this->assertTrue($service->refund($transactionId));
        $this->assertFalse($service->refund($transactionId), 'The second refund must be a no-op.');

        $this->assertSame(500, (int) $company->fresh()->ocr_credits_balance,
            'The balance must be restored exactly once.');
    }

    // ─── Circuit breaker ─────────────────────────────────────────────────────

    /**
     * 🔴 Keyed PER CONNECTION. One tenant hitting a 429 must not stop mail sync for every
     * other tenant on the platform.
     */
    public function test_one_mailbox_tripping_does_not_break_another(): void
    {
        Cache::flush();

        $mine = CircuitBreaker::forMailbox(1);
        $theirs = CircuitBreaker::forMailbox(2);

        for ($i = 0; $i < CircuitBreaker::FAILURE_THRESHOLD; $i++) {
            $mine->recordFailure();
        }

        $this->assertTrue($mine->isOpen());
        $this->assertFalse($theirs->isOpen(), 'Another tenant must be entirely unaffected.');
    }

    public function test_a_single_success_closes_the_breaker(): void
    {
        Cache::flush();
        $breaker = CircuitBreaker::forMailbox(3);

        for ($i = 0; $i < CircuitBreaker::FAILURE_THRESHOLD; $i++) {
            $breaker->recordFailure();
        }
        $this->assertTrue($breaker->isOpen());

        $breaker->recordSuccess();
        $this->assertFalse($breaker->isOpen());
    }

    /** An open breaker must throw, not return empty — an outage is not "no results". */
    public function test_an_open_breaker_fails_fast_and_distinguishably(): void
    {
        Cache::flush();
        $breaker = CircuitBreaker::forAiServer();

        for ($i = 0; $i < CircuitBreaker::FAILURE_THRESHOLD; $i++) {
            $breaker->recordFailure();
        }

        $this->expectException(\App\Services\CircuitOpenException::class);
        $breaker->call(fn () => 'never runs');
    }

    // ─── Client notification consent ─────────────────────────────────────────

    /**
     * 🔴 Consent is enforced in the SERVICE, not the UI. A gate living in a Vue component
     * is bypassed by every other caller.
     */
    public function test_a_notification_cannot_be_released_without_an_operator(): void
    {
        $job = $this->makeJob();

        app(ClientNotificationService::class)->stage($job, ClientNotificationService::STAGE_INTAKE, [
            'subject' => 'Your shipment', 'body' => 'Booked.', 'to' => ['ops@globex.test'],
        ]);

        $this->expectException(\RuntimeException::class);
        app(ClientNotificationService::class)->release($job, 0); // no real operator
    }

    public function test_releasing_clears_the_draft_so_it_cannot_be_sent_twice(): void
    {
        $job = $this->makeJob();
        $service = app(ClientNotificationService::class);

        $service->stage($job, ClientNotificationService::STAGE_INTAKE, ['subject' => 'Your shipment']);

        $draft = $service->release($job, 42);
        $this->assertSame('Your shipment', $draft['subject']);
        $this->assertSame(42, $draft['approved_by']);

        $this->expectException(\RuntimeException::class);
        $service->release($job, 42); // second confirm must find nothing staged
    }

    private function makeJob(): \App\Job
    {
        ['branch' => $branch] = $this->tenant('command');

        $enquiry = \App\Enquiry::create([
            'agent_id' => $branch->id, 'transport_mode' => 'air', 'enquiry_no' => 'ENQA-COMBOM-26-0001',
        ]);

        $job = \App\Job::create([
            'agent_id' => $branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
        ]);

        \App\EmailThread::create([
            'agent_id' => $branch->id, 'job_id' => $job->id,
            'thread_key' => 'thr-notify-' . random_int(1, 999999),
            'latest_message_received_at' => now(),
        ]);

        return $job;
    }
}
