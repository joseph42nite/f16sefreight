<?php

namespace App\Services;

/**
 * The GST place-of-supply split — PRD.md §1550.
 *
 *   *"If the first two digits of the counterparty GSTIN match our branch state code,
 *    apply CGST + SGST (each 50% of the rate). Otherwise apply IGST (100%)."*
 *
 * ═══ ⚠️ THE TOTAL IS THE SAME EITHER WAY. THE SPLIT IS NOT. ═════════════════
 * 18% intrastate is CGST 9 + SGST 9; 18% interstate is IGST 18. The invoice total is
 * identical, which is exactly why getting this wrong is easy to miss — the client is
 * billed correctly and nothing looks broken. What breaks is **GSTR-1 and the customer's
 * input credit**: they claim against the heads we filed, and a mis-split means they
 * cannot claim what they paid.
 *
 * ═══ 🔴 OUR OWN GSTIN HAS NO COLUMN ════════════════════════════════════════
 * `gst_no` exists on `customers` and `partners` — the COUNTERPARTIES. Nothing in the
 * schema stores the branch's or company's own GSTIN, and the rule above cannot be
 * evaluated without it.
 *
 * So this service REFUSES to guess. With no supplier GSTIN it returns
 * `determinable: false` and no split at all, rather than defaulting to IGST — which
 * would be silently wrong for every domestic intrastate shipment, and wrong in the
 * direction that costs the customer their input credit. Raised as GAPS.md #36.
 */
class GstSplitService
{
    /**
     * @return array{determinable: bool, kind: ?string, cgst: float, sgst: float, igst: float, reason: ?string}
     */
    public function split(float $taxAmount, ?string $counterpartyGstin, ?string $supplierGstin): array
    {
        $none = ['cgst' => 0.0, 'sgst' => 0.0, 'igst' => 0.0];

        if ($taxAmount <= 0.0) {
            // ⚠️ A zero-tax document is EXEMPT or zero-rated, not "undeterminable" —
            // an export invoice legitimately carries no GST, and flagging it as a gap
            // would bury the real ones.
            return $none + ['determinable' => true, 'kind' => 'none', 'reason' => null];
        }

        $ourState = $this->stateCode($supplierGstin);
        $theirState = $this->stateCode($counterpartyGstin);

        if ($ourState === null) {
            return $none + ['determinable' => false, 'kind' => null, 'reason' => 'supplier_gstin_missing'];
        }

        if ($theirState === null) {
            // An unregistered counterparty is still a real case — B2C, or an overseas
            // consignee. It is not the same failure as our own GSTIN being absent, so
            // it gets its own reason rather than being lumped together.
            return $none + ['determinable' => false, 'kind' => null, 'reason' => 'counterparty_gstin_missing'];
        }

        if ($ourState === $theirState) {
            // Halved on the TOTAL and rounded once each, so the two heads always sum
            // back to the tax charged. Rounding each half independently from a
            // half-rate can leave a paisa unaccounted for on the register.
            $half = round($taxAmount / 2, 2);

            return [
                'determinable' => true, 'kind' => 'intrastate',
                'cgst' => $half,
                'sgst' => round($taxAmount - $half, 2),   // absorbs the odd paisa
                'igst' => 0.0, 'reason' => null,
            ];
        }

        return [
            'determinable' => true, 'kind' => 'interstate',
            'cgst' => 0.0, 'sgst' => 0.0, 'igst' => round($taxAmount, 2), 'reason' => null,
        ];
    }

    /**
     * The first two digits of a GSTIN are the state code.
     *
     * A GSTIN is 15 characters: 2 state + 10 PAN + 1 entity + 1 'Z' + 1 check. Anything
     * that does not start with two digits is not a GSTIN, and reading two characters off
     * it anyway would produce a confident comparison between two pieces of nonsense.
     */
    public function stateCode(?string $gstin): ?string
    {
        $gstin = strtoupper(trim((string) $gstin));

        if (! preg_match('/^\d{2}/', $gstin)) {
            return null;
        }

        return substr($gstin, 0, 2);
    }
}
