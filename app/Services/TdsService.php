<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * Tax deducted at source — what to withhold, and the register of what was (user, 2026-09-22).
 *
 * ═══ 🔴 TDS IS NOT A DISCOUNT, A WRITE-OFF, OR A DEBT ══════════════════════
 * When a client settles ₹1,18,000 with ₹1,15,640, the missing ₹2,360 was not lost, forgiven, or withheld in
 * dispute. It was **paid to the government in our name** and appears in our Form 26AS, where we claim it
 * against our own income tax. It is an ASSET (`1400-TDS-Receivable`). Booking it as a write-off loses the
 * money twice — once out of this year's profit, and again as a credit nobody ever claims.
 *
 * ═══ 🔴 THE BASE EXCLUDES GST ══════════════════════════════════════════════
 * Tax is deducted on the value of the service, never on the tax charged on it. An ₹1,00,000 invoice at 18% is
 * billed ₹1,18,000 and deducted on ₹1,00,000. Deducting on the gross over-deducts by the rate times the GST
 * every single time, which is money taken out of a supplier's hands with no authority.
 *
 * ═══ 🔴 THE RATE USED IS STAMPED ON THE ENTRY ══════════════════════════════
 * Never re-derived from the rate table when the register is read. Rates move with every Finance Act; a
 * register that recomputed history would restate returns already filed and challans already paid.
 *
 * ═══ ⚠️ THREE REASONS THE ORDINARY RATE IS NOT THE RATE ════════════════════
 *   1. **No PAN → 20%** (s.206AA). The commonest way a deduction comes out wrong.
 *   2. **A s.197 certificate → a lower rate, or nil.** Held per vendor; deducting the full rate against one is
 *      over-deduction the vendor must reclaim from the department itself.
 *   3. **Under the threshold → nothing at all.** Deducting below it short-pays a supplier for no lawful reason,
 *      and both the single-payment and the year-to-date thresholds have to be checked, not just one.
 */
class TdsService
{
    /** Tax clients deducted from us — an ASSET, recoverable against our own liability (Form 26AS). */
    public const RECEIVABLE = ['code' => '1400-TDS-Receivable', 'name' => 'TDS Receivable'];

    /** Tax we deducted and owe the government — a LIABILITY until the challan is paid (Form 26Q). */
    public const PAYABLE = ['code' => '2300-TDS-Payable', 'name' => 'TDS Payable'];

    public const OUTWARD = 'deducted_by_us';
    public const INWARD = 'deducted_from_us';

    /**
     * The sections a freight forwarder actually uses, as DEFAULTS.
     *
     * ⚠️ **These are a starting point to be checked against the current Finance Act, not law.** They are
     * editable per branch, and the screen says so. 194H alone has moved twice in recent years. A rate that
     * looks authoritative and is a year stale is worse than an empty field somebody has to fill in.
     */
    public const DEFAULT_RATES = [
        ['section' => '194C', 'description' => 'Contractors — transport, freight, handling (company or firm)',
         'rate' => 2.00, 'threshold_single' => 30000, 'threshold_annual' => 100000],
        ['section' => '194C-IND', 'description' => 'Contractors — individual or HUF',
         'rate' => 1.00, 'threshold_single' => 30000, 'threshold_annual' => 100000],
        ['section' => '194J', 'description' => 'Professional or technical services',
         'rate' => 10.00, 'threshold_single' => null, 'threshold_annual' => 30000],
        ['section' => '194H', 'description' => 'Commission or brokerage',
         'rate' => 2.00, 'threshold_single' => null, 'threshold_annual' => 20000],
        ['section' => '194I', 'description' => 'Rent — plant, machinery or equipment',
         'rate' => 2.00, 'threshold_single' => null, 'threshold_annual' => 240000],
        ['section' => '194I-B', 'description' => 'Rent — land, building or furniture',
         'rate' => 10.00, 'threshold_single' => null, 'threshold_annual' => 240000],
    ];

    /**
     * What to withhold from a vendor on a payment, and why — or why nothing.
     *
     * @param  float  $base  The amount being paid, NET OF GST.
     * @param  float  $paidThisYearBase  What has already been paid to this vendor this financial year, net of GST.
     * @return array{deduct: bool, section: ?string, rate: float, amount: float, reason: ?string}
     */
    public function forVendor(object $vendor, int $agentId, float $base, float $paidThisYearBase = 0.0,
        float $alreadyDeducted = 0.0): array
    {
        $none = fn (?string $reason) => ['deduct' => false, 'section' => $vendor->tds_section ?? null,
                                         'rate' => 0.0, 'amount' => 0.0, 'catching_up' => 0.0,
                                         'still_owed' => 0.0, 'reason' => $reason];

        if (empty($vendor->tds_section)) {
            // ⚠️ NOT an error. "Deduct nothing" is the only safe assumption about a vendor nobody has
            // classified — but it is reported, because a trucker with no section is a missed deduction.
            return $none('no_section');
        }

        $rate = DB::table('tds_rates')->where('agent_id', $agentId)
            ->where('section', $vendor->tds_section)->where('is_active', true)->first();

        if ($rate === null) {
            return $none('section_not_configured');
        }

        // 🔴 Both thresholds, not one. 194C is ₹30,000 on a single payment OR ₹1,00,000 across the year:
        // six payments of ₹25,000 cross the annual threshold while no single one crosses the other, and a
        // system that checked only the per-payment figure would deduct nothing all year.
        $single = $rate->threshold_single === null ? null : (float) $rate->threshold_single;
        $annual = $rate->threshold_annual === null ? null : (float) $rate->threshold_annual;
        $yearToDate = round($paidThisYearBase + $base, 2);

        $annualCrossed = $annual !== null && $yearToDate >= $annual;
        $singleCrossed = $single !== null && $base >= $single;

        if (! $annualCrossed && ! $singleCrossed && ! ($single === null && $annual === null)) {
            return $none('below_threshold');
        }

        $applicable = $this->rateFor($vendor, $rate);

        if ($applicable <= 0.0) {
            // A s.197 certificate for NIL is a real and common thing, and it is not the same as "unclassified".
            return $none('nil_rate_certificate');
        }

        // 🔴 **CROSSING THE ANNUAL THRESHOLD MAKES THE WHOLE YEAR DEDUCTIBLE, NOT JUST THIS PAYMENT.**
        // 194C's wording is that where the AGGREGATE paid in the year exceeds ₹1,00,000, tax is deducted —
        // so the four ₹25,000 payments that lawfully escaped deduction on the way up become deductible the
        // moment the fifth crosses the line, and the catch-up comes out of that fifth payment. Deducting 2%
        // of ₹25,000 instead of 2% of ₹1,05,000 less what was already taken is a short deduction on ₹80,000,
        // which is the exact shape of the notice that arrives a year later with interest on it.
        $chargeable = $annualCrossed ? $yearToDate : $base;
        $due = round($chargeable * $applicable / 100 - $alreadyDeducted, 2);

        if ($due <= 0.0) {
            // Everything chargeable has already been deducted on earlier payments in this year.
            return $none('already_deducted');
        }

        // ⚠️ We cannot withhold more than we are paying. When the catch-up exceeds the payment itself — six
        // months of undeducted invoices settled by one small one — the payment goes entirely to the
        // government and the REMAINDER IS STILL OWED. Saying so is the whole point: silently capping it
        // leaves a short deduction nobody knows about.
        $capped = min($due, $base);

        return [
            'deduct' => true,
            'section' => $rate->section,
            'rate' => $applicable,
            'amount' => round($capped, 2),
            'catching_up' => round(max(0.0, $due - round($base * $applicable / 100, 2)), 2),
            'still_owed' => round(max(0.0, $due - $capped), 2),
            'reason' => $due > $capped ? 'catch_up_exceeds_payment' : null,
        ];
    }

    /**
     * The rate that actually applies to this vendor.
     *
     * 🔴 Order matters. A s.197 certificate is an instruction from the department naming a rate, so it wins
     * over everything — including the 20% no-PAN penalty, because the certificate could not have been issued
     * without a PAN. Otherwise, no PAN means 20% (s.206AA) regardless of what the section says.
     */
    public function rateFor(object $vendor, object $rate): float
    {
        if (($vendor->tds_rate_override ?? null) !== null) {
            return round((float) $vendor->tds_rate_override, 2);
        }

        return empty($vendor->pan_no)
            ? round((float) $rate->rate_no_pan, 2)
            : round((float) $rate->rate, 2);
    }

    /**
     * Record tax a CLIENT deducted from us, against the invoice they deducted it on.
     *
     * 🔴 **The base is the invoice SUBTOTAL** — not the shortfall, not the grand total. They deducted on the
     * value of the service, excluding the GST they also paid us, so that subtotal is what reconciles against
     * their Form 26AS entry. The rate is then DERIVED from what they actually withheld rather than assumed:
     * what we may claim is what they deposited, whatever rate they used to arrive at it.
     *
     * ⚠️ Shared by both paths that can close a short receipt — the receipt screen and bank matching — because
     * which screen the desk happened to use must not decide whether a deduction is recorded at all.
     */
    public function recordInward(object $invoice, float $deducted, string $sourceType, int $sourceId, string $date): ?int
    {
        if ($deducted <= 0.0) {
            return null;
        }

        $base = round((float) $invoice->subtotal, 2);

        return $this->record([
            'agent_id' => $invoice->agent_id,
            'company_id' => DB::table('agents_info')->where('id', $invoice->agent_id)->value('company_id'),
            'direction' => self::INWARD,
            'counterparty_type' => 'customer',
            'counterparty_id' => $invoice->customer_id ?? $invoice->billed_party_id,
            'counterparty_pan' => $invoice->customer_id !== null
                ? DB::table('customers')->where('id', $invoice->customer_id)->value('pan_no')
                : null,
            // ⚠️ The section a CLIENT deducted under is THEIR declaration and arrives on their certificate,
            // not on our invoice. 194C is what freight is deducted under; correctable on the register when
            // the certificate says otherwise.
            'section' => '194C',
            'rate' => $base > 0 ? round($deducted / $base * 100, 2) : 0.0,
            'base_amount' => $base,
            'tds_amount' => round($deducted, 2),
            'source_id' => $sourceId,
            'source_type' => $sourceType,
            'deducted_on' => $date,
        ]);
    }

    /**
     * The part of a payment that TDS is computed on: the allocation, less the GST inside it.
     *
     * 🔴 **Proportional, because a part payment carries a proportional share of the tax.** Paying ₹59,000 of
     * a ₹1,18,000 voucher (₹1,00,000 + 18%) is paying ₹50,000 of service and ₹9,000 of GST, and deducting on
     * the ₹59,000 over-deducts on tax we have no business deducting on.
     */
    public function baseOf(float $allocated, float $voucherNet, float $voucherGross): float
    {
        if ($voucherGross <= 0.0) {
            return 0.0;
        }

        return round($allocated * ($voucherNet / $voucherGross), 2);
    }

    /**
     * What this vendor has already been paid this financial year, net of GST — the figure the ANNUAL
     * threshold is measured against.
     *
     * 🔴 **Every payment counts, including the ones that deducted nothing.** Six payments of ₹25,000 cross
     * 194C's ₹1,00,000 annual threshold while no single one crosses the ₹30,000 per-payment one; a system
     * that measured the year against its own register — which holds only the deductions it already made —
     * would find nothing there and never start deducting at all.
     */
    public function paidThisYear(int $agentId, int $vendorId, string $onDate, ?int $excludePaymentId = null): float
    {
        [$from, $to] = self::financialYearRange($onDate);

        $rows = DB::table('accounts_payment_allocations as a')
            ->join('accounts_payments as p', 'p.id', '=', 'a.payment_id')
            ->join('accounts_purchase_vouchers as v', 'v.id', '=', 'a.purchase_voucher_id')
            ->where('p.agent_id', $agentId)
            ->where('p.payee_type', 'partner')->where('p.payee_id', $vendorId)
            ->whereBetween('p.payment_date', [$from, $to])
            ->when($excludePaymentId !== null, fn ($q) => $q->where('p.id', '!=', $excludePaymentId))
            ->get(['a.amount', 'a.purchase_voucher_id']);

        $totals = DB::table('accounts_purchase_items')
            ->whereIn('purchase_voucher_id', $rows->pluck('purchase_voucher_id')->unique())
            ->selectRaw('purchase_voucher_id, COALESCE(SUM(amount),0) AS net, COALESCE(SUM(net_amount),0) AS gross')
            ->groupBy('purchase_voucher_id')->get()->keyBy('purchase_voucher_id');

        return round($rows->sum(function ($row) use ($totals) {
            $voucher = $totals->get($row->purchase_voucher_id);

            return $voucher === null ? 0.0
                : $this->baseOf((float) $row->amount, (float) $voucher->net, (float) $voucher->gross);
        }), 2);
    }

    /** What has already been withheld from this vendor this financial year — the catch-up's starting point. */
    public function deductedThisYear(int $agentId, int $vendorId, string $onDate, ?string $section = null): float
    {
        [$from, $to] = self::financialYearRange($onDate);

        return round((float) DB::table('tds_entries')
            ->where('agent_id', $agentId)
            ->where('direction', self::OUTWARD)
            ->where('counterparty_type', 'partner')->where('counterparty_id', $vendorId)
            ->whereBetween('deducted_on', [$from, $to])
            ->when($section !== null, fn ($q) => $q->where('section', $section))
            ->sum('tds_amount'), 2);
    }

    /** Write one deduction into the register. Returns its id. */
    public function record(array $entry): int
    {
        [$financialYear, $quarter] = self::period($entry['deducted_on']);

        return DB::table('tds_entries')->insertGetId($entry + [
            'financial_year' => $financialYear,
            'quarter' => $quarter,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /**
     * The Indian financial year and quarter a date falls in.
     *
     * 🔴 **The year starts in APRIL.** January 2027 is Q4 of FY 2026-27, not Q1 of 2027 — and a calendar-year
     * assumption puts three months of deductions in the wrong return, which is discovered when the quarterly
     * statement does not agree with the challans paid against it.
     *
     * @return array{0: string, 1: string}
     */
    public static function period(string $date): array
    {
        $month = (int) date('n', strtotime($date));
        $year = (int) date('Y', strtotime($date));

        $startYear = $month >= 4 ? $year : $year - 1;
        $quarter = 'Q' . (intdiv(($month - 4 + 12) % 12, 3) + 1);

        return [$startYear . '-' . substr((string) ($startYear + 1), 2), $quarter];
    }

    /** The first and last day of an Indian financial year, for year-to-date thresholds. */
    public static function financialYearRange(string $date): array
    {
        [$financialYear] = self::period($date);
        $startYear = (int) substr($financialYear, 0, 4);

        return [$startYear . '-04-01', ($startYear + 1) . '-03-31'];
    }

    /**
     * Give a branch the default rate rows, once.
     *
     * ⚠️ `insertOrIgnore` on the (branch, section) unique key: a branch that has already edited its rates
     * keeps every edit, and running this again adds only sections it does not yet have. Re-seeding must never
     * silently restore a rate somebody deliberately changed.
     */
    public function seedRatesFor(int $agentId): int
    {
        $rows = array_map(fn (array $r) => $r + [
            'agent_id' => $agentId, 'rate_no_pan' => 20.00, 'is_active' => true,
            'created_at' => now(), 'updated_at' => now(),
        ], self::DEFAULT_RATES);

        return DB::table('tds_rates')->insertOrIgnore($rows);
    }

    /** What each refusal to deduct means, in the words the desk needs. */
    public const REASONS = [
        'no_section' => 'No TDS section is set on this vendor, so nothing is deducted. Set one on the vendor if they should be.',
        'section_not_configured' => 'The vendor names a section that this branch has no rate for.',
        'below_threshold' => 'Below the threshold for the section, on this payment and for the year so far.',
        'nil_rate_certificate' => 'The vendor holds a certificate for a nil rate under s.197.',
        'already_deducted' => 'Everything chargeable for this vendor this year has already been deducted.',
        'catch_up_exceeds_payment' => 'Crossing the annual threshold makes the whole year deductible, and the catch-up is larger than this payment. The payment is withheld in full and the rest is still owed.',
    ];
}
