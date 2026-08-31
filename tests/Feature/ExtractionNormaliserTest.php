<?php

namespace Tests\Feature;

use App\Services\ExtractionNormaliser;
use Tests\TestCase;

/**
 * "Unify upward" — guide §4.1.2 rule 3.
 *
 * One mapper serves both extraction paths. The guide's warning is that two mappers
 * drift the first time either side changes, so these assertions pin the SHAPE as much
 * as the values.
 */
class ExtractionNormaliserTest extends TestCase
{
    private function n(): ExtractionNormaliser
    {
        return new ExtractionNormaliser();
    }

    /**
     * 🔴 UNIFY UPWARD, NOT DOWN. A coordinate hit is genuinely high confidence
     * (PRD.md §5.1), so the bare value is wrapped rather than the wrapped value being
     * flattened — flattening would discard the only signal the orange highlight has.
     */
    public function test_bare_coordinate_values_are_wrapped_as_high_confidence(): void
    {
        $out = $this->n()->normalise([
            'awb_number' => '176-10000004',
            'departure'  => 'INBOM',
        ]);

        $this->assertSame(['value' => '176-10000004', 'confidence' => 'high'], $out['awb_number']);
        $this->assertSame(['value' => 'INBOM', 'confidence' => 'high'], $out['departure']);
    }

    /** The model path is already wrapped and must pass through unchanged. */
    public function test_model_values_keep_their_confidence(): void
    {
        $out = $this->n()->normalise([
            'consignee'    => ['value' => 'Globex GmbH', 'confidence' => 'medium'],
            'gross_weight' => ['value' => '450.500', 'confidence' => 'low'],
        ], 'model');

        $this->assertSame('medium', $out['consignee']['confidence']);
        $this->assertSame('low', $out['gross_weight']['confidence']);
    }

    /**
     * 🔴 `null` IS A CORRECT ANSWER AND MUST SURVIVE. "Not on the page" is true and
     * useful; substituting a default would convert a visible failure into a silent one
     * on a document that becomes a customs declaration.
     */
    public function test_a_null_value_survives_and_is_never_defaulted(): void
    {
        $out = $this->n()->normalise([
            'transit'      => null,
            'gross_weight' => ['value' => null, 'confidence' => 'low'],
        ]);

        $this->assertNull($out['transit']['value']);
        $this->assertNull($out['gross_weight']['value']);
    }

    /**
     * An empty coordinate box is not high-confidence emptiness — it is an empty box,
     * and the operator should be pointed at it rather than reassured by it.
     */
    public function test_an_empty_coordinate_box_is_low_confidence(): void
    {
        $out = $this->n()->normalise(['transit' => '', 'destination' => '   ']);

        $this->assertNull($out['transit']['value']);
        $this->assertSame('low', $out['transit']['confidence']);
        $this->assertSame('low', $out['destination']['confidence']);
    }

    /**
     * ⚠️ A MISSING OR UNKNOWN CONFIDENCE DEGRADES TO LOW, NEVER TO HIGH. Confidence is
     * the one field the model may not omit; treating an absent one as high would hide
     * precisely the fields that need review.
     */
    public function test_a_missing_or_unknown_confidence_degrades_to_low(): void
    {
        $out = $this->n()->normalise([
            'shipper'   => ['value' => 'Acme Ltd'],                       // omitted
            'consignee' => ['value' => 'Globex', 'confidence' => 'sure'], // not in the enum
            'cargo'     => ['value' => 'Parts', 'confidence' => 'HIGH'],  // case-insensitive
        ], 'model');

        $this->assertSame('low', $out['shipper']['confidence']);
        $this->assertSame('low', $out['consignee']['confidence']);
        $this->assertSame('high', $out['cargo']['confidence']);
    }

    /**
     * A model claiming HIGH confidence over an empty field is exactly the case the
     * highlight exists to surface — there is nothing to be confident about.
     */
    public function test_high_confidence_over_a_null_value_is_downgraded(): void
    {
        $out = $this->n()->normalise([
            'weight_charge' => ['value' => null, 'confidence' => 'high'],
        ], 'model');

        $this->assertSame('low', $out['weight_charge']['confidence']);
    }

    /** Nested regions keep their structure; every leaf still carries a confidence. */
    public function test_nested_regions_are_normalised_leaf_by_leaf(): void
    {
        $out = $this->n()->normalise([
            'shipper' => [
                'name'    => 'Acme Exports Pvt Ltd',
                'address' => ['value' => 'Plot 14, MIDC', 'confidence' => 'medium'],
            ],
        ]);

        $this->assertSame('high', $out['shipper']['name']['confidence']);
        $this->assertSame('medium', $out['shipper']['address']['confidence']);
    }

    /**
     * ⚠️ MEDIUM IS FLAGGED TOO. PRD.md §5.1 highlights medium AND low — a field the
     * extractor was only fairly sure of is exactly the one that yields a
     * plausible-looking wrong consignee.
     */
    public function test_review_flags_both_medium_and_low_but_not_high(): void
    {
        $out = $this->n()->normalise([
            'awb_number' => '176-10000004',
            'consignee'  => ['value' => 'Globex GmbH', 'confidence' => 'medium'],
            'transit'    => ['value' => null, 'confidence' => 'low'],
            'shipper'    => ['name' => ['value' => 'Acme', 'confidence' => 'low']],
        ], 'model');

        $flagged = $this->n()->needsReview($out);

        $this->assertContains('consignee', $flagged);
        $this->assertContains('transit', $flagged);
        $this->assertContains('shipper.name', $flagged, 'Nested fields report their own path.');
        $this->assertNotContains('awb_number', $flagged);
    }

    /** Idempotent: running an already-normalised payload back through changes nothing. */
    public function test_normalising_twice_is_stable(): void
    {
        $once = $this->n()->normalise([
            'awb_number' => '176-10000004',
            'consignee'  => ['value' => 'Globex', 'confidence' => 'medium'],
        ]);

        $this->assertSame($once, $this->n()->normalise($once));
    }
}
