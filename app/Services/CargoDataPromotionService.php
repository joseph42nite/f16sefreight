<?php

namespace App\Services;

use App\Enquiry;
use App\PdfProcessingJob;
use Illuminate\Support\Facades\DB;

/**
 * Promotes OCR-extracted cargo onto the enquiry. Fires when a pdf_processing_jobs row
 * reaches `status = 'completed'` (guide §4.5).
 *
 * 🔴 **PROMOTION IS MONOTONIC.** Writes only where `cargo_data_source IN ('regex', NULL)`
 * — never over a value an operator has verified. OCR is better than regex and worse than
 * a human, and a re-run of extraction must not silently undo a correction someone made
 * by hand.
 *
 * 🔴 **DECLARED CARGO STAYS ON THE ENQUIRY, PERMANENTLY.** These are the figures the
 * client SAID. Actual shipped figures land on air_/sea_shipment_details at operator
 * verification and NEVER write back here. The gap between the two is the
 * under-declaration signal — the single most valuable thing the pair produces — so both
 * sides must survive independently. Variance is computed as a join when needed and
 * flagged above 20%.
 */
class CargoDataPromotionService
{
    private const VARIANCE_FLAG_THRESHOLD = 0.20;

    /** Columns this service may write, mapped from the extraction payload's key vocabulary. */
    private const FIELD_MAP = [
        'pieces'            => 'extracted_pieces',
        'gross_weight'      => 'extracted_weight',
        'chargeable_weight' => 'extracted_weight',
        'volume_cbm'        => 'extracted_volume',
        'cargo_description' => 'cargo_description',
        'origin'            => 'origin_code',
        'destination'       => 'dest_code',
    ];

    public function promote(PdfProcessingJob $extraction): bool
    {
        // Resolve the target: enquiry_id is the COMMON case, because extraction normally
        // runs pre-conversion at enquiry status step 2.
        $enquiry = $this->resolveEnquiry($extraction);

        if ($enquiry === null) {
            return false; // orphaned payload — nothing to promote onto
        }

        // The monotonic gate. An operator-verified row is left alone entirely.
        if (! in_array($enquiry->cargo_data_source, ['regex', null], true)) {
            return false;
        }

        $payload = $this->normalise($extraction->extracted_data ?? []);
        $updates = [];

        foreach (self::FIELD_MAP as $key => $column) {
            if (! array_key_exists($key, $payload)) {
                continue;
            }

            $value = $payload[$key];

            // A missing figure must stay missing. Writing NULL over an existing regex
            // value would lose information rather than add it.
            if ($value === null || $value === '') {
                continue;
            }

            $updates[$column] = $value;
        }

        if ($updates === []) {
            return false;
        }

        $before = $enquiry->only(array_keys($updates));

        $updates['cargo_data_source'] = 'ocr';
        $updates['cargo_data_promoted_at'] = now();

        DB::transaction(function () use ($enquiry, $updates) {
            $enquiry->forceFill($updates)->saveQuietly();

            // Audit the promotion. ALWAYS written — attribution falls back to the
            // tenant's reserved system actor, because an unattended promotion is the
            // change most worth recording: no human saw it happen (GAPS.md #22, closed
            // 2026-08-28).
            app(AuditLogger::class)->record(
                agentId: $enquiry->agent_id,
                action: 'enquiry.cargo_promoted',
                modelType: 'enquiry',
                modelId: $enquiry->id,
                userId: $enquiry->pricing_id ?? $enquiry->ops_id ?? $enquiry->sales_id,
            );
        });

        return true;
    }

    private function resolveEnquiry(PdfProcessingJob $extraction): ?Enquiry
    {
        if ($extraction->enquiry_id !== null) {
            return Enquiry::withoutGlobalScopes()->find($extraction->enquiry_id);
        }

        if ($extraction->job_id !== null) {
            $enquiryId = DB::table('jobs')->where('id', $extraction->job_id)->value('enquiry_id');

            return $enquiryId ? Enquiry::withoutGlobalScopes()->find($enquiryId) : null;
        }

        return null;
    }

    /**
     * Accepts both extraction shapes.
     *
     * The coordinate path returns bare values; the unstructured path returns
     * `{value, confidence}`. Unified here rather than at two call sites, so the upload
     * modal never needs two mappers that drift apart.
     */
    private function normalise(array $payload): array
    {
        $out = [];

        foreach ($payload as $key => $value) {
            $out[$key] = is_array($value) && array_key_exists('value', $value) ? $value['value'] : $value;
        }

        return $out;
    }

    /**
     * Declared vs actual, as a fraction. NULL when either side is missing — an absent
     * comparison is not a zero variance.
     */
    public function variance(Enquiry $enquiry, ?float $actualWeight): ?float
    {
        $declared = (float) $enquiry->extracted_weight;

        if ($declared <= 0.0 || $actualWeight === null) {
            return null;
        }

        return ($actualWeight - $declared) / $declared;
    }

    public function shouldFlagVariance(Enquiry $enquiry, ?float $actualWeight): bool
    {
        $variance = $this->variance($enquiry, $actualWeight);

        return $variance !== null && abs($variance) > self::VARIANCE_FLAG_THRESHOLD;
    }
}
