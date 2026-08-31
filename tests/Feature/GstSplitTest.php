<?php

namespace Tests\Feature;

use App\Services\GstSplitService;
use Tests\TestCase;

/**
 * The GST place-of-supply split — PRD.md §1550, guide §8.1 (`InvoiceFinalizeTest`:
 * *"GST split 9+9 intrastate vs 18 IGST"*).
 *
 * ⚠️ **The TOTAL is identical either way.** 18% intrastate is CGST 9 + SGST 9; 18%
 * interstate is IGST 18. The client is billed the same, nothing looks broken, and the
 * failure is invisible until the customer cannot claim the input credit they paid —
 * because they claim against the heads we filed.
 */
class GstSplitTest extends TestCase
{
    private function svc(): GstSplitService
    {
        return new GstSplitService();
    }

    /** 27 = Maharashtra on both sides -> 9 + 9. */
    public function test_same_state_splits_into_cgst_and_sgst(): void
    {
        $r = $this->svc()->split(18000.00, '27AAACG1234A1Z5', '27AABCF5678B1Z3');

        $this->assertSame('intrastate', $r['kind']);
        $this->assertSame(9000.00, $r['cgst']);
        $this->assertSame(9000.00, $r['sgst']);
        $this->assertSame(0.0, $r['igst']);
    }

    /** 27 Maharashtra supplying 33 Tamil Nadu -> IGST at the full rate. */
    public function test_different_states_apply_igst_at_the_full_rate(): void
    {
        $r = $this->svc()->split(18000.00, '33AAACG1234A1Z5', '27AABCF5678B1Z3');

        $this->assertSame('interstate', $r['kind']);
        $this->assertSame(18000.00, $r['igst']);
        $this->assertSame(0.0, $r['cgst']);
        $this->assertSame(0.0, $r['sgst']);
    }

    /**
     * 🔴 THE TWO HEADS MUST SUM BACK TO THE TAX CHARGED. Halving an odd amount and
     * rounding each side independently loses a paisa, and a GST register that does not
     * reconcile to the invoice is a filing problem, not a rounding nicety.
     */
    public function test_an_odd_amount_still_reconciles_to_the_total(): void
    {
        $r = $this->svc()->split(18000.01, '27AAACG1234A1Z5', '27AABCF5678B1Z3');

        $this->assertSame(18000.01, round($r['cgst'] + $r['sgst'], 2));
    }

    /**
     * 🔴 NO SUPPLIER GSTIN -> NO GUESS. Defaulting to IGST would be silently wrong for
     * every domestic intrastate shipment, and wrong in the direction that costs the
     * customer their input credit.
     */
    public function test_a_missing_supplier_gstin_is_undeterminable_not_igst(): void
    {
        $r = $this->svc()->split(18000.00, '27AAACG1234A1Z5', null);

        $this->assertFalse($r['determinable']);
        $this->assertSame('supplier_gstin_missing', $r['reason']);
        $this->assertSame(0.0, $r['igst'], 'and it does NOT fall back to IGST');
    }

    /** An unregistered or overseas counterparty is its own case, not the same failure. */
    public function test_a_missing_counterparty_gstin_has_its_own_reason(): void
    {
        $r = $this->svc()->split(18000.00, null, '27AABCF5678B1Z3');

        $this->assertFalse($r['determinable']);
        $this->assertSame('counterparty_gstin_missing', $r['reason']);
    }

    /**
     * ⚠️ A zero-tax document is EXEMPT or zero-rated — an export invoice legitimately
     * carries no GST. Flagging it as undeterminable would bury the real gaps.
     */
    public function test_a_zero_tax_document_is_determinable_and_empty(): void
    {
        $r = $this->svc()->split(0.0, null, null);

        $this->assertTrue($r['determinable']);
        $this->assertSame('none', $r['kind']);
    }

    /** Anything not starting with two digits is not a GSTIN. */
    public function test_a_malformed_gstin_yields_no_state_code(): void
    {
        foreach (['NOTAGSTIN', '', 'A7AAACG1234A1Z5', '7'] as $bad) {
            $this->assertNull($this->svc()->stateCode($bad), "'{$bad}' is not a GSTIN");
        }

        $this->assertSame('27', $this->svc()->stateCode('27AAACG1234A1Z5'));
    }
}
