<?php

namespace App\Services;

use App\AccountsInvoice;
use App\Customer;

/**
 * The client credit gate — PRD.md §6, guide §5.3.
 *
 * Checked SERVER-SIDE before invoice finalization and before a delivery-order release.
 * Never client-side only: a credit hold that lives in a Vue component is bypassed by
 * every other caller, and the consequence is releasing cargo to a client who cannot pay.
 *
 * 🔴 **NULL IS NOT ZERO, and here the distinction decides whether cargo moves.**
 *     NULL   no limit has been configured for this client -> the gate does NOT block
 *     0.00   this client is allowed zero credit -> EVERY shipment blocks
 * Reading NULL as 0 would silently credit-block every newly onboarded customer, which
 * reads to the desk as a broken gate rather than as missing configuration. The column
 * was made nullable in 2026_08_28_000000 precisely so this can be expressed.
 *
 * ⚠️ **Exposure is PER BRANCH, never per client group.** Separate GSTINs are separate
 * billing entities, and one branch's overdue invoice must not freeze another branch's
 * cargo (PRD.md §1.2). The group total is DISPLAYED as a roll-up and never enforced on.
 */
class CreditGateService
{
    /** Statuses that represent money genuinely owed. Drafts and voids are not exposure. */
    private const OUTSTANDING_STATUSES = ['finalized', 'sent', 'partially_paid'];

    /**
     * Current receivable exposure for ONE customer row — not the group.
     */
    public function exposure(Customer $customer): float
    {
        $rows = AccountsInvoice::withoutTenantScope()
            ->where('customer_id', $customer->id)
            ->whereIn('status', self::OUTSTANDING_STATUSES)
            ->get(['grand_total', 'amount_paid']);

        return round($rows->sum(fn ($i) => (float) $i->grand_total - (float) $i->amount_paid), 2);
    }

    /**
     * Would adding $amount breach this client's limit?
     *
     * @return array{blocked: bool, reason: ?string, limit: ?float, exposure: float, projected: float}
     */
    public function check(Customer $customer, float $amount = 0.0): array
    {
        $exposure = $this->exposure($customer);
        $projected = round($exposure + $amount, 2);

        // NULL means "not configured" — see the class docblock. Explicitly not a breach.
        if ($customer->credit_limit === null) {
            return [
                'blocked'   => false,
                'reason'    => 'no_limit_configured',
                'limit'     => null,
                'exposure'  => $exposure,
                'projected' => $projected,
            ];
        }

        $limit = (float) $customer->credit_limit;

        return [
            'blocked'   => $projected > $limit,
            'reason'    => $projected > $limit ? 'credit_limit_exceeded' : null,
            'limit'     => $limit,
            'exposure'  => $exposure,
            'projected' => $projected,
        ];
    }

    /**
     * The group roll-up — DISPLAY ONLY.
     *
     * Never pass this to check(). It exists so the desk can see the whole relationship
     * while the gate still blocks per billing entity.
     */
    public function groupExposure(Customer $customer): array
    {
        if (blank($customer->email_domain)) {
            return ['members' => 1, 'exposure' => $this->exposure($customer)];
        }

        $members = Customer::withoutTenantScope()
            ->where('company_id', $customer->company_id)
            ->where('email_domain', $customer->email_domain)
            ->get();

        return [
            'members'  => $members->count(),
            'exposure' => round($members->sum(fn ($c) => $this->exposure($c)), 2),
        ];
    }
}
