<?php

namespace App\Services;

use App\Company;
use App\PdfProcessingJob;
use Illuminate\Support\Facades\DB;

/**
 * The OCR credit gate — guide §4.1.1.
 *
 * 🔒 **VISION OCR IS OPT-IN. THE SYSTEM NEVER SPENDS A CREDIT ON ITS OWN.**
 * Spending someone's money is exactly the kind of irreversible act the product refuses
 * to perform without explicit acceptance — a credit is no different from an email.
 *
 * 🔴 RATES, user 2026-09-14 and 2026-09-20: an airway bill (read by fixed boxes, no AI) 0 ·
 * an invoice or packing list read by the AI 1 · a scan read by the AI from page images 3 ·
 * **one inbound mail filed by the decision model 0.2**. The text credit is charged only once
 * the AI has ANSWERED (a document read by labels costs nothing); the scan credit is reserved
 * at consent and refunded if the call fails; the mail credit is reserved before the call and
 * refunded the same way.
 *
 *   upload
 *     └─ /extract-unstructured (allow_vision = false)     ← no prompt
 *          ├─ text found ─────► Gemma parses it           ← 1 credit once it answers; labels if none left
 *          └─ no text layer ─► extraction_path = 'none'
 *                              status = awaiting_vision_consent   ← NOTHING spent
 *                                 ├─ declines ─► cancelled        ← still nothing spent
 *                                 └─ accepts ──► reserve, then call with vision
 *
 * The consent step also removes a sequencing problem: Laravel cannot know a PDF is
 * scanned until the parser looks, but with a HUMAN DECISION between the two calls the
 * second round trip is doing real work rather than papering over an ordering bug.
 *
 * ── Mail is charged without a prompt, and that is not an exception ─────────
 * ⚠️ Vision asks first because it is the operator's own document, uploaded a moment ago,
 * and a person is standing there to answer. Inbound mail arrives while nobody is looking:
 * there is no one to ask, and a mailbox that stopped syncing to wait for consent would be
 * useless. What keeps it honest is the price — a fifth of a credit, roughly ₹0.005 — and
 * that running out costs the tenant nothing but a duller inbox: unfiled mail lands in
 * `other` and a person re-files it, exactly as it did before the model existed.
 *
 * ── Refund exists only for the narrow failure case ─────────────────────────
 * A reservation is refunded when the call fails AFTER reserving (timeout, refusal,
 * open breaker). There is no speculative-charge case left to unwind.
 * **Double-refund is impossible by construction** — `reverses_transaction_id` is UNIQUE,
 * so a retried job's second refund violates the constraint rather than quietly crediting
 * twice. Do not add an application-level check instead: retries are exactly when those
 * get skipped.
 *
 * ── The costs are floats, and the ledger is DECIMAL ────────────────────────
 * 🔴 `ocr_credit_transactions.amount` and `companies.ocr_credits_balance` are DECIMAL(12,2).
 * Every balance written from here is rounded to two places before it is stored, so PHP's
 * float arithmetic can never drift into the column: 0.2 charged fifteen times is 3.00, not
 * 3.0000000000000004. Read the balance back from the row, never accumulate it in PHP.
 */
class OcrCreditService
{
    public const TEXT_COST = 1.0;
    public const VISION_COST = 3.0;

    /**
     * One inbound mail filed by the decision model.
     *
     * 🔴 Derived, not chosen, and re-derived when the rubric changed. Jev bills $0.042 per
     * million input tokens with output FREE, so the whole cost is what we send: a subject, a
     * snippet and two rubrics is ~1,300 tokens, US$0.000055, near ₹0.005 — against the ₹0.025 a
     * document costs Gemma. A fifth of a document, priced as one.
     *
     * ⚠️ It was 0.1 while the rubric asked ONE question at ~850 tokens. Splitting it into sender
     * and intent (config/mail_intent.php) grew the prompt by half and the rate moved with it.
     * Measure again when the rubric changes; this is arithmetic, not a tariff.
     */
    public const MAIL_COST = 0.2;

    /**
     * Reserve credits for reading one document, atomically.
     *
     * @return int|null the consumption transaction id, or NULL when the balance is
     *                  exhausted — in which case NO FastAPI call may be made.
     */
    public function reserve(Company $company, PdfProcessingJob $extraction, float $amount = self::VISION_COST, ?string $note = null): ?int
    {
        return $this->consume($company, $amount, [
            'enquiry_id' => $extraction->enquiry_id,
            'job_id' => $extraction->job_id,
            // WHICH extraction burned this credit. Without it "what did we spend this
            // on?" is unanswerable.
            'pdf_processing_job_id' => $extraction->id,
        ], $note ?? sprintf('Scan read by AI, %s page(s)', $extraction->page_count ?? '?'));
    }

    /**
     * Reserve the mail rate against one inbound message, before the model is called.
     *
     * ⚠️ Charged BEFORE the call, like vision and for the same reason: two mails arriving
     * together must not both pass a balance check only one of them can afford. A call that
     * then fails is refunded — see `refund()`.
     *
     * @return int|null the transaction id, or NULL when the tenant cannot afford it, in
     *                  which case the model must not be called and the mail stays unfiled.
     */
    public function chargeMail(Company $company, int $emailMessageId): ?int
    {
        return $this->consume($company, self::MAIL_COST, ['email_message_id' => $emailMessageId], 'Inbound mail filed by AI');
    }

    /**
     * The one place a credit leaves a tenant. Row-locked: two callers racing must not both
     * pass a balance check that only one of them can afford.
     *
     * @param  array  $refs  enquiry_id / job_id / pdf_processing_job_id / email_message_id
     */
    private function consume(Company $company, float $amount, array $refs, string $notes): ?int
    {
        return DB::transaction(function () use ($company, $amount, $refs, $notes) {
            $locked = Company::withoutGlobalScopes()
                ->whereKey($company->id)
                ->lockForUpdate()
                ->first();

            if ($locked === null) {
                return null;
            }

            $balance = (float) $locked->ocr_credits_balance;
            $floor = $locked->creditFloor(); // NULL on the row means "follow the tier"

            // The floor is negative by design: it lets a busy month finish its shipments
            // rather than failing mid-document, while still bounding the exposure.
            //
            // ⚠️ Rounded before the comparison, not after. A balance of exactly the floor
            // plus 0.2 must be spendable, and unrounded float subtraction is where that
            // stops being true.
            if (round($balance - $amount, 2) < $floor) {
                return null;
            }

            $transactionId = DB::table('ocr_credit_transactions')->insertGetId($refs + [
                'company_id'       => $locked->id,
                'amount'           => -$amount,
                'transaction_type' => 'consumption',
                'notes'            => $notes,
                'created_at'       => now(),
            ]);

            Company::withoutGlobalScopes()->whereKey($locked->id)
                ->update(['ocr_credits_balance' => round($balance - $amount, 2), 'updated_at' => now()]);

            return $transactionId;
        });
    }

    /**
     * Return a reserved credit after the call it paid for failed.
     *
     * Safe to call twice: the second attempt violates the UNIQUE index on
     * reverses_transaction_id and is swallowed, which is the whole point of putting that
     * guarantee in the database rather than in a conditional here.
     */
    public function refund(int $consumptionTransactionId): bool
    {
        $consumption = DB::table('ocr_credit_transactions')->find($consumptionTransactionId);

        if ($consumption === null || $consumption->transaction_type !== 'consumption') {
            return false;
        }

        try {
            return DB::transaction(function () use ($consumption) {
                DB::table('ocr_credit_transactions')->insert([
                    'company_id'              => $consumption->company_id,
                    'enquiry_id'              => $consumption->enquiry_id,
                    'job_id'                  => $consumption->job_id,
                    'pdf_processing_job_id'   => $consumption->pdf_processing_job_id,
                    'email_message_id'        => $consumption->email_message_id,
                    'amount'                  => abs((float) $consumption->amount),
                    'transaction_type'        => 'refund',
                    'reverses_transaction_id' => $consumption->id,
                    'notes'                   => $consumption->email_message_id
                        ? 'Mail filing call failed after reservation'
                        : 'Vision call failed after reservation',
                    'created_at'              => now(),
                ]);

                Company::withoutGlobalScopes()->whereKey($consumption->company_id)
                    ->increment('ocr_credits_balance', abs((float) $consumption->amount));

                return true;
            });
        } catch (\Illuminate\Database\QueryException $e) {
            // Duplicate on reverses_transaction_id — already refunded. Not an error.
            if ((int) ($e->errorInfo[1] ?? 0) === 1062) {
                return false;
            }

            throw $e;
        }
    }

    /** Current balance against the resolved floor. */
    public function canAfford(Company $company, float $amount = self::VISION_COST): bool
    {
        return round(((float) $company->ocr_credits_balance) - $amount, 2) >= $company->creditFloor();
    }
}
