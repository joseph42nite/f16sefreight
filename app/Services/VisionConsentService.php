<?php

namespace App\Services;

use App\Company;
use App\PdfProcessingJob;
use App\Support\UserContext;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * The answer to a vision-consent prompt — guide §4.1.1.
 *
 * 🔒 **VISION OCR IS OPT-IN. THE SYSTEM NEVER SPENDS A CREDIT ON ITS OWN.** This service
 * is the ONLY place a parked extraction leaves `awaiting_vision_consent`, so the rule
 * that a credit is spent exactly once, by a named human, lives in one file rather than
 * being re-implemented per caller.
 *
 *   awaiting_vision_consent
 *     ├─ decline() ─► cancelled              ← nothing was ever reserved
 *     ├─ accept()  ─► reserve 1 credit ─► processing ─► vision extraction
 *     │                └─ balance at the floor ─► failed / credits_exhausted
 *     │                                          ← refused BEFORE any paid call
 *     └─ unanswered 24h ─► cancelled          ← ExpireVisionConsent, nothing spent
 *
 * ── What this deliberately does NOT do ─────────────────────────────────────
 * ⚠️ It knows nothing about Gemma, Gemini, or any model. It decides whether money may be
 * spent and hands off; which engine runs, and how its output is shaped, belongs to
 * `ProcessPdfOcrJob` and the FastAPI service. Wiring a model name in here would put the
 * spend decision and the vendor choice in the same place, and they change for entirely
 * different reasons.
 *
 * ── Where the reservation lives ────────────────────────────────────────────
 * 🔴 There is no `credit_transaction_id` column on `pdf_processing_jobs`, and none is
 * needed: `ocr_credit_transactions.pdf_processing_job_id` already records WHICH extraction
 * burned a credit, so the reservation is findable from the extraction. Adding a mirror
 * column would create a second place for the same fact to be wrong. Consent attribution —
 * who said yes, and when — goes to `audit_logs`, which is append-only and is already where
 * the product records who did what.
 */
class VisionConsentService
{
    public const ACCEPT = 'accept';
    public const DECLINE = 'decline';

    /** Refusal reasons. Codes, not sentences — the UI and the tests branch on these. */
    public const NOT_AWAITING = 'not_awaiting_consent';
    public const CREDITS_EXHAUSTED = 'credits_exhausted';
    public const NO_TENANT = 'no_tenant';

    public function __construct(
        private OcrCreditService $credits,
        private AuditLogger $audit,
    ) {
    }

    /**
     * Spend one credit and release the extraction for a vision run.
     *
     * @return array{ok: bool, reason: ?string, status: string, transaction_id: ?int}
     */
    public function accept(PdfProcessingJob $extraction, User $actor): array
    {
        if (! $this->isAwaiting($extraction)) {
            return $this->refusal($extraction, self::NOT_AWAITING);
        }

        $context = UserContext::for($actor);
        $company = $context->companyId === null
            ? null
            : Company::withoutGlobalScopes()->find($context->companyId);

        if ($company === null) {
            return $this->refusal($extraction, self::NO_TENANT);
        }

        // 🔴 RESERVE FIRST, CALL SECOND. Reserving after the call would mean a tenant at
        // the floor had already been billed by the vendor before we discovered they could
        // not afford it — the one ordering that cannot be undone.
        $transactionId = $this->credits->reserve($company, $extraction);

        if ($transactionId === null) {
            // Refused before any paid call. The temp PDF goes too: nothing further will
            // read it, and it is a client's document sitting on disk.
            $this->discardTempFile($extraction);

            $extraction->forceFill([
                'status'        => 'failed',
                'failure_code'  => self::CREDITS_EXHAUSTED,
                'error_message' => 'Vision OCR was authorised but the credit balance is exhausted. '
                    . 'No call was made and nothing was spent.',
                'temp_file_path' => null,
                'completed_at'  => now(),
            ])->save();

            $this->record($context, 'ocr.vision_consent_exhausted', $extraction, $actor);

            return ['ok' => false, 'reason' => self::CREDITS_EXHAUSTED,
                    'status' => 'failed', 'transaction_id' => null];
        }

        $extraction->forceFill([
            'status'        => 'processing',
            'failure_code'  => null,
            'error_message' => null,
        ])->save();

        $this->record($context, 'ocr.vision_consent_accepted', $extraction, $actor);

        return ['ok' => true, 'reason' => null, 'status' => 'processing',
                'transaction_id' => $transactionId];
    }

    /**
     * Refuse the spend. Nothing was ever reserved, so there is nothing to refund.
     *
     * @return array{ok: bool, reason: ?string, status: string, transaction_id: ?int}
     */
    public function decline(PdfProcessingJob $extraction, User $actor): array
    {
        if (! $this->isAwaiting($extraction)) {
            return $this->refusal($extraction, self::NOT_AWAITING);
        }

        $this->discardTempFile($extraction);

        $extraction->forceFill([
            'status' => 'cancelled',
            // ⚠️ NOT a failure. Declining is a correct, intended outcome, and recording it
            // as a failure would put it in every error dashboard and make operators
            // reluctant to decline — which defeats the point of asking.
            'failure_code'   => null,
            'error_message'  => 'Vision OCR was declined by the operator. No credit was spent.',
            'temp_file_path' => null,
            'completed_at'   => now(),
        ])->save();

        $this->record(UserContext::for($actor), 'ocr.vision_consent_declined', $extraction, $actor);

        return ['ok' => true, 'reason' => null, 'status' => 'cancelled', 'transaction_id' => null];
    }

    /**
     * The reservation made for this extraction, if any — what a failed vision run refunds.
     *
     * ⚠️ Reads the LATEST consumption rather than assuming one: an extraction retried after
     * a refund has several rows, and refunding the first would credit a reservation that
     * was already returned.
     */
    public function reservationFor(PdfProcessingJob $extraction): ?int
    {
        $id = DB::table('ocr_credit_transactions')
            ->where('pdf_processing_job_id', $extraction->id)
            ->where('transaction_type', 'consumption')
            ->orderByDesc('id')
            ->value('id');

        if ($id === null) {
            return null;
        }

        // Already reversed — there is nothing left to give back.
        $reversed = DB::table('ocr_credit_transactions')
            ->where('reverses_transaction_id', $id)->exists();

        return $reversed ? null : (int) $id;
    }

    private function isAwaiting(PdfProcessingJob $extraction): bool
    {
        return $extraction->status === 'awaiting_vision_consent';
    }

    /** @return array{ok: bool, reason: ?string, status: string, transaction_id: ?int} */
    private function refusal(PdfProcessingJob $extraction, string $reason): array
    {
        return ['ok' => false, 'reason' => $reason, 'status' => $extraction->status,
                'transaction_id' => null];
    }

    /**
     * Best effort — a missing temp file is not a reason to leave the extraction parked
     * forever, which is the state this whole service exists to get out of.
     */
    private function discardTempFile(PdfProcessingJob $extraction): void
    {
        if (blank($extraction->temp_file_path)) {
            return;
        }

        rescue(fn () => Storage::disk('pdf_temp')->delete($extraction->temp_file_path), report: false);
    }

    private function record(UserContext $context, string $action, PdfProcessingJob $extraction, User $actor): void
    {
        if ($context->agentId === null) {
            return; // nothing to attribute it to; the extraction row still tells the story
        }

        $this->audit->record($context->agentId, $action, 'pdf_processing_job', $extraction->id, $actor->id);
    }
}
