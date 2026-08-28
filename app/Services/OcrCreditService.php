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
 *   upload
 *     └─ /extract-unstructured (allow_vision = false)     ← always free, always first
 *          ├─ text found ─────► Gemma parses it           ← free, no prompt
 *          └─ no text layer ─► extraction_path = 'none'
 *                              status = awaiting_vision_consent   ← NOTHING spent
 *                                 ├─ declines ─► cancelled        ← still nothing spent
 *                                 └─ accepts ──► reserve, then call with vision
 *
 * The consent step also removes a sequencing problem: Laravel cannot know a PDF is
 * scanned until the parser looks, but with a HUMAN DECISION between the two calls the
 * second round trip is doing real work rather than papering over an ordering bug.
 *
 * ── Refund exists only for the narrow failure case ─────────────────────────
 * A reservation is refunded when the vision call fails AFTER reserving (timeout, refusal,
 * open breaker). There is no speculative-charge case left to unwind.
 * **Double-refund is impossible by construction** — `reverses_transaction_id` is UNIQUE,
 * so a retried job's second refund violates the constraint rather than quietly crediting
 * twice. Do not add an application-level check instead: retries are exactly when those
 * get skipped.
 */
class OcrCreditService
{
    public const VISION_COST = 1;

    /**
     * Reserve one credit against a company, atomically.
     *
     * @return int|null the consumption transaction id, or NULL when the balance is
     *                  exhausted — in which case NO FastAPI call may be made.
     */
    public function reserve(Company $company, PdfProcessingJob $extraction, int $amount = self::VISION_COST): ?int
    {
        return DB::transaction(function () use ($company, $extraction, $amount) {
            // Row lock: two uploads racing must not both pass a balance check that only
            // one of them can afford.
            $locked = Company::withoutGlobalScopes()
                ->whereKey($company->id)
                ->lockForUpdate()
                ->first();

            if ($locked === null) {
                return null;
            }

            $balance = (int) $locked->ocr_credits_balance;
            $floor = $locked->creditFloor(); // NULL on the row means "follow the tier"

            // The floor is negative by design: it lets a busy month finish its shipments
            // rather than failing mid-document, while still bounding the exposure.
            if ($balance - $amount < $floor) {
                return null;
            }

            $transactionId = DB::table('ocr_credit_transactions')->insertGetId([
                'company_id'            => $locked->id,
                'enquiry_id'            => $extraction->enquiry_id,
                'job_id'                => $extraction->job_id,
                // WHICH extraction burned this credit. Without it "what did we spend this
                // on?" is unanswerable.
                'pdf_processing_job_id' => $extraction->id,
                'amount'                => -$amount,
                'transaction_type'      => 'consumption',
                'notes'                 => sprintf('Vision OCR, %s page(s)', $extraction->page_count ?? '?'),
                'created_at'            => now(),
            ]);

            Company::withoutGlobalScopes()->whereKey($locked->id)
                ->update(['ocr_credits_balance' => $balance - $amount, 'updated_at' => now()]);

            return $transactionId;
        });
    }

    /**
     * Return a reserved credit after the vision call failed.
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
                    'amount'                  => abs($consumption->amount),
                    'transaction_type'        => 'refund',
                    'reverses_transaction_id' => $consumption->id,
                    'notes'                   => 'Vision call failed after reservation',
                    'created_at'              => now(),
                ]);

                Company::withoutGlobalScopes()->whereKey($consumption->company_id)
                    ->increment('ocr_credits_balance', abs($consumption->amount));

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
    public function canAfford(Company $company, int $amount = self::VISION_COST): bool
    {
        return ((int) $company->ocr_credits_balance) - $amount >= $company->creditFloor();
    }
}
