<?php

namespace App\Services;

/**
 * One shape for every extraction path — guide §4.1.2 rule 3, "unify upward".
 *
 * ═══ THE PROBLEM THIS SOLVES ════════════════════════════════════════════════
 * Two extractors feed the same form:
 *
 *   /extract               coordinate-based, template-driven. Returns BARE values.
 *   /extract-unstructured  model-driven. Returns {value, confidence}.
 *
 * The guide's instruction is to unify UPWARD rather than downward — wrap the bare
 * values too, stamping `confidence: "high"`, because a coordinate hit genuinely IS
 * high confidence (PRD.md §5.1 defines it that way). Flattening the other direction
 * would throw away the only signal the orange highlighting has.
 *
 * 🔴 **ONE MAPPER, OR THEY DRIFT.** The guide is explicit: a second endpoint emitting
 * a different shape means `OcrUploadModal.vue` needs two mappers, and they will drift
 * the first time either side changes. Everything the UI reads goes through here.
 *
 * ⚠️ **`null` IS A CORRECT ANSWER, and must survive.** "Not on the page" is useful and
 * true; a hallucinated gross weight is neither. Nothing here substitutes a default for
 * a null, because on a document that becomes a customs declaration that would convert
 * a visible failure into a silent one.
 */
class ExtractionNormaliser
{
    /** PRD.md §5.1 — only these three, and `confidence` is never absent. */
    public const LEVELS = ['high', 'medium', 'low'];

    /**
     * A coordinate hit that produced no text is not high-confidence emptiness — it is
     * an empty box. It normalises to a null value at LOW confidence so the operator is
     * pointed at it rather than reassured by it.
     */
    private const EMPTY_IS_LOW = true;

    /**
     * Normalise a whole extraction payload.
     *
     * Accepts either shape and returns `[field => ['value' => ?string, 'confidence' => string]]`.
     *
     * @param  array<string, mixed>  $extracted
     * @param  string  $source  'coordinates' | 'model'
     * @return array<string, array{value: ?string, confidence: string}>
     */
    public function normalise(array $extracted, string $source = 'coordinates'): array
    {
        $out = [];

        foreach ($extracted as $field => $raw) {
            $out[$field] = $this->field($raw, $source);
        }

        return $out;
    }

    /**
     * @param  mixed  $raw
     * @return array{value: ?string, confidence: string}
     */
    private function field($raw, string $source): array
    {
        // Already wrapped — the model path, or a payload that has been through here.
        if (is_array($raw) && array_key_exists('value', $raw)) {
            $value = $this->clean($raw['value']);

            return [
                'value' => $value,
                // 🔴 An unrecognised or missing level degrades to LOW, never to high.
                // Confidence is the one field the model may not omit, and treating a
                // missing one as high would hide exactly the fields needing review.
                'confidence' => $this->level($raw['confidence'] ?? null, $value),
            ];
        }

        // Nested region (shipper -> {name, address, ...}) — recurse, keeping the shape.
        if (is_array($raw)) {
            $nested = [];
            foreach ($raw as $key => $inner) {
                $nested[$key] = $this->field($inner, $source);
            }

            return $nested;
        }

        // A bare value from the coordinate path. Unify UPWARD.
        $value = $this->clean($raw);

        return [
            'value' => $value,
            'confidence' => $value === null && self::EMPTY_IS_LOW ? 'low' : 'high',
        ];
    }

    /** @param mixed $value */
    private function clean($value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        $text = trim((string) $value);

        // An empty string is an ABSENT value, not a present blank one — §4.1's rule
        // that NULL is not zero applies to text as much as to numbers.
        return $text === '' ? null : $text;
    }

    /** @param mixed $level */
    private function level($level, ?string $value): string
    {
        $level = is_string($level) ? strtolower(trim($level)) : null;

        if (! in_array($level, self::LEVELS, true)) {
            return 'low';
        }

        // A null value cannot be high-confidence: there is nothing to be confident
        // about. The model saying "high" over an empty field is the case the orange
        // highlight exists to surface.
        if ($value === null && $level === 'high') {
            return 'low';
        }

        return $level;
    }

    /**
     * Fields an operator must look at before generating a document.
     *
     * ⚠️ Medium is included deliberately. PRD.md §5.1 highlights medium AND low — a
     * field the extractor was only fairly sure of is exactly the one that produces a
     * plausible-looking wrong consignee.
     *
     * @param  array<string, mixed>  $normalised
     * @return list<string>  dot-paths, so a nested region reports the field, not the box
     */
    public function needsReview(array $normalised, string $prefix = ''): array
    {
        $flagged = [];

        foreach ($normalised as $field => $shape) {
            $path = $prefix === '' ? (string) $field : "{$prefix}.{$field}";

            if (is_array($shape) && array_key_exists('confidence', $shape)) {
                if ($shape['confidence'] !== 'high') {
                    $flagged[] = $path;
                }

                continue;
            }

            if (is_array($shape)) {
                $flagged = array_merge($flagged, $this->needsReview($shape, $path));
            }
        }

        return $flagged;
    }
}
