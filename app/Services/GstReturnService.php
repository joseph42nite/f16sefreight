<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * GSTR-1 and GSTR-3B as files (user, 2026-09-22) — the return, not the register.
 *
 * `gst_ledger_entries` has always held every rupee of tax charged, with the CGST/SGST/IGST split. What did not
 * exist was the **return**: the invoice-wise file the portal takes, which has a monthly deadline and is the only
 * artefact the tax authority ever sees. A register you can read on screen is not a return you can file.
 *
 * ═══ 🔴 THE RETURN IS DERIVED FROM THE DOCUMENTS, NOT READ OUT OF THE REGISTER ══
 * The register row is written once, when a document is POSTED (PRD §1555 says finalized; kept on post by decision,
 * 2026-09-26, GAPS #396), and only when the split was determinable —
 * which, until `agents_info.gst_no` landed today, was never (GAPS #36). Reading the return out of it would mean
 * every month before today files as empty. So the return recomputes the split from the documents through the
 * same `GstSplitService` that wrote the register, which makes the rule single-sourced and the whole history
 * filable. Where a register row exists and DISAGREES with what the documents now imply, that document is
 * reported as a warning rather than silently overwritten — a customer's GSTIN corrected after we invoiced them
 * changes which heads the tax belongs under, and somebody has to decide which version is the truth.
 *
 * ═══ 🔴 THE SPLIT IS APPLIED PER RATE LINE, NEVER ONCE ON THE DOCUMENT TOTAL ════
 * GSTR-1 is rate-wise inside each invoice: one document with freight at 18% and a nil-rated line is two `itms`
 * entries, and the portal validates the tax against the rate on each. Splitting the header total once and then
 * apportioning it back across rates reintroduces exactly the rounding drift `GstSplitService` halves carefully
 * to avoid. Each line's own `tax_amount` is split, and the halves of each line sum back to that line.
 *
 * ═══ ⚠️ WHAT THIS DELIBERATELY DOES NOT FILE ════════════════════════════════
 * A section that cannot be filled correctly is not written at all; the documents that would have gone in it are
 * listed as **exceptions**, with what is missing named:
 *
 *   • **B2CL / B2CS** (supplies to unregistered persons) need a **place of supply** per document. Nothing in the
 *     schema stores one: `customers.address` is free text and the counterparty has no GSTIN to take a state code
 *     from — that being the definition of unregistered. Guessing the state would mis-file every one of them, and
 *     the state is what decides which government is paid. Reported as `place_of_supply_unknown`.
 *   • **EXP** (exports) needs a **shipping bill number and date**. A zero-tax supply to an unregistered party is
 *     an export, a nil-rated supply or an exempt one — three different tables — and nothing here distinguishes
 *     them. Reported as `zero_rated_needs_classification`.
 *
 * An exception is a document the desk can see and fix before the deadline. A guess is a return that passes
 * validation and is wrong, which is discovered by a notice months later. **The exceptions are the feature.**
 *
 * ⚠️ **Drafts and voids are not supplies.** A draft carries no number and the client has never seen it; a void
 * never stood. Both are excluded — but a void still appears in the **document series** section, because the
 * portal asks how many numbers were issued and how many cancelled, and a gap in a sequence with nothing
 * explaining it is exactly what an auditor asks about.
 */
class GstReturnService
{
    /** Tax invoices — B2B in GSTR-1. Brokerage and consol invoices are outward supplies like any other. */
    public const INVOICE_TYPES = ['invoice', 'brokerage', 'consol_invoice'];

    /** Notes — CDNR, where the portal's own letter for each is the section's `ntty`. */
    public const NOTE_TYPES = ['credit_note' => 'C', 'debit_note' => 'D'];

    /** What each refusal means, in the words the desk needs to act on it. */
    public const REASONS = [
        'supplier_gstin_missing' => 'This branch has no GSTIN. Set it in Settings → Finance; nothing can be filed without it.',
        'no_line_items' => 'The document has no charge lines, so there is no rate to file it under.',
        'items_disagree_with_header' => 'The charge lines do not add up to the document total.',
        'place_of_supply_unknown' => 'Billed to a client with no GSTIN, so this is a B2C supply — the portal needs a place of supply, which is not recorded anywhere.',
        'zero_rated_needs_classification' => 'No tax and no counterparty GSTIN: an export, a nil-rated supply or an exempt one. The portal files each differently and needs a shipping bill for an export.',
        'counterparty_gstin_missing' => 'The counterparty has no GSTIN on record.',
        'register_disagrees' => 'The GST register written when this was finalized shows a different split from what the documents imply now.',
        'hsn_missing' => 'A charge line has no HSN/SAC code, so it cannot appear in the HSN summary. The invoice itself still files.',
    ];

    public function __construct(private readonly GstSplitService $split) {}

    /**
     * GSTR-1 for one branch over one window: what we billed, section by section.
     *
     * 🔴 **THE WINDOW IS A MONTH, NOT AN ACCOUNTING PERIOD** — the one report in this system that is not
     * period-scoped, and deliberately so. Everything else here obeys §6.8's strict period lockout ("a report
     * runs over a PERIOD, never a free date range — half a period is a number nobody can reconcile"). A GST
     * return is the exception that proves that rule: it is filed **per calendar month** by law, it is the thing
     * everything else gets reconciled *against*, and every `accounting_periods` row in this system spans a
     * financial YEAR. Handing a year to the portal as one return is not a thing that can be filed.
     *
     * The window is still a parameter rather than a hardcoded month so the regression fixture can assert the
     * whole of its span in one pass — production callers pass a month.
     *
     * @return array{gstin: ?string, b2b: array, cdnr: array, hsn: array, docs: array,
     *               totals: array, exceptions: array, warnings: array, filable: bool}
     */
    public function gstr1(int $agentId, string $from, string $to): array
    {
        $ourGstin = $this->ourGstin($agentId);
        $documents = $this->documents($agentId, $from, $to);
        $items = $this->itemsByDocument($documents->pluck('id')->all());
        $registered = $this->register($documents->pluck('id')->all());

        $b2b = [];
        $cdnr = [];
        $exceptions = [];
        $warnings = [];

        foreach ($documents as $doc) {
            $placed = $this->rateLines($doc, $items->get($doc->id, collect()), $ourGstin);

            if ($placed['reason'] !== null) {
                $exceptions[] = $this->exception($doc, $placed['reason'], $placed['detail'] ?? null);

                continue;
            }

            $row = [
                'document_id' => (int) $doc->id,
                'document_no' => $doc->invoice_no,
                'type' => $doc->type,
                'date' => $doc->document_date,
                'counterparty' => $doc->counterparty,
                'counterparty_gstin' => $doc->counterparty_gstin,
                'place_of_supply' => $this->split->stateCode($doc->counterparty_gstin),
                'supply' => $placed['kind'],
                'document_total' => round((float) $doc->grand_total, 2),
                'rates' => $placed['rates'],
                'taxable_value' => $placed['taxable_value'],
                'cgst' => $placed['cgst'],
                'sgst' => $placed['sgst'],
                'igst' => $placed['igst'],
            ];

            if (isset(self::NOTE_TYPES[$doc->type])) {
                $row['note_type'] = self::NOTE_TYPES[$doc->type];
                $cdnr[] = $row;
            } else {
                $b2b[] = $row;
            }

            if (($mismatch = $this->registerDisagrees($doc, $placed, $registered)) !== null) {
                $warnings[] = $mismatch;
            }
        }

        $hsn = $this->hsnSummary($b2b, $cdnr);
        $warnings = [...$warnings, ...$hsn['unclassified']];

        return [
            'gstin' => $ourGstin,
            'from' => $from,
            'to' => $to,
            'filing_period' => $this->filingPeriod($to),
            // 🔴 Nothing can be filed under a GSTIN we do not have. Said once, at the top, rather than
            // repeated as an identical exception on every document in the month.
            'filable' => $ourGstin !== null,
            'b2b' => $b2b,
            'cdnr' => $cdnr,
            'hsn' => $hsn['rows'],
            'docs' => $this->documentSeries($agentId, $from, $to),
            'totals' => $this->totals($b2b, $cdnr),
            'exceptions' => $exceptions,
            'warnings' => $warnings,
        ];
    }

    /**
     * GSTR-3B: the summary return — what we owe, what we may claim, and the difference.
     *
     * ⚠️ **It does not decide the set-off.** Which credit is applied against which head (IGST credit may be used
     * against CGST and SGST; CGST credit may not be used against SGST) is a filing decision with real
     * consequences for the cash ledger, and one the accountant makes in the portal against balances this system
     * cannot see. So `difference` is arithmetic — output minus credit, per head — and is labelled as such, not
     * presented as the cash payable.
     */
    public function gstr3b(int $agentId, string $from, string $to): array
    {
        $outward = $this->gstr1($agentId, $from, $to);
        $inward = $this->inputCredit($agentId, $from, $to);

        $out = $outward['totals'];

        $difference = [
            'cgst' => round($out['cgst'] - $inward['totals']['cgst'], 2),
            'sgst' => round($out['sgst'] - $inward['totals']['sgst'], 2),
            'igst' => round($out['igst'] - $inward['totals']['igst'], 2),
        ];
        $difference['total'] = round($difference['cgst'] + $difference['sgst'] + $difference['igst'], 2);

        return [
            'gstin' => $outward['gstin'],
            'from' => $from,
            'to' => $to,
            'filing_period' => $outward['filing_period'],
            'filable' => $outward['filable'],
            // 3.1(a) — outward taxable supplies other than zero rated, nil rated and exempted.
            'outward' => $out,
            // 4(A)(5) — all other ITC.
            'input_credit' => $inward['totals'],
            'difference' => $difference,
            // What is NOT in 3.1(a) because GSTR-1 could not place it. Carried through rather than dropped:
            // a summary return that quietly omits three lakhs of supplies is the worst of both files.
            'excluded' => [
                'count' => count($outward['exceptions']),
                'value' => round(array_sum(array_column($outward['exceptions'], 'taxable_value')), 2),
                'rows' => $outward['exceptions'],
            ],
            'input_excluded' => $inward['excluded'],
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // The outward side
    // ─────────────────────────────────────────────────────────────────────────

    /** Every non-draft, non-void sales document of the branch dated inside the period, with its counterparty. */
    private function documents(int $agentId, string $from, string $to): Collection
    {
        return DB::table('accounts_invoices as i')
            ->leftJoin('customers as c', fn ($j) => $j->on('c.id', '=', 'i.billed_party_id')
                ->where('i.billed_party_type', '=', 'customer'))
            ->leftJoin('partners as p', fn ($j) => $j->on('p.id', '=', 'i.billed_party_id')
                ->where('i.billed_party_type', '=', 'partner'))
            ->where('i.agent_id', $agentId)
            ->whereNotIn('i.status', ['draft', 'void'])
            ->whereBetween('i.document_date', [$from, $to])
            ->orderBy('i.document_date')->orderBy('i.invoice_no')
            ->get([
                'i.id', 'i.invoice_no', 'i.type', 'i.document_date', 'i.subtotal', 'i.tax_amount', 'i.grand_total',
                DB::raw('COALESCE(c.name, p.name) AS counterparty'),
                DB::raw('COALESCE(c.gst_no, p.gst_no) AS counterparty_gstin'),
            ]);
    }

    /** @param list<int> $ids */
    private function itemsByDocument(array $ids): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return DB::table('accounts_invoice_items')->whereIn('invoice_id', $ids)
            ->get(['invoice_id', 'hsn_sac_code', 'description', 'amount', 'tax_percentage', 'tax_amount'])
            ->groupBy('invoice_id');
    }

    /**
     * One document's lines, grouped by rate and split into heads — or the reason it cannot be filed.
     *
     * @return array{rates: array, kind: ?string, taxable_value: float, cgst: float, sgst: float, igst: float,
     *               reason: ?string, detail: ?string}
     */
    private function rateLines(object $doc, Collection $items, ?string $ourGstin): array
    {
        $empty = ['rates' => [], 'kind' => null, 'taxable_value' => 0.0, 'cgst' => 0.0, 'sgst' => 0.0, 'igst' => 0.0];
        $fail = fn (string $reason, ?string $detail = null) => $empty + ['reason' => $reason, 'detail' => $detail];

        if ($ourGstin === null) {
            return $fail('supplier_gstin_missing');
        }

        if ($items->isEmpty()) {
            return $fail('no_line_items');
        }

        // 🔴 The ledger posts the HEADER tax; the return reports the LINES, because only the lines carry rates.
        // If the two disagree the return cannot reconcile against the ledger, and filing it is worse than
        // fixing the document — so this refuses rather than quietly preferring one of them.
        $lineNet = round((float) $items->sum('amount'), 2);
        $lineTax = round((float) $items->sum('tax_amount'), 2);
        $headerNet = round((float) $doc->subtotal, 2);
        $headerTax = round((float) $doc->tax_amount, 2);

        if ($lineNet !== $headerNet || $lineTax !== $headerTax) {
            return $fail('items_disagree_with_header', sprintf(
                'Lines total %s + %s tax; the document says %s + %s.',
                number_format($lineNet, 2), number_format($lineTax, 2),
                number_format($headerNet, 2), number_format($headerTax, 2)
            ));
        }

        // ⚠️ Checked at the DOCUMENT level, not per line: a zero-tax line never consults the counterparty
        // GSTIN at all, so `GstSplitService` would report it determinable and the missing state code would
        // slip through on exactly the documents where it matters most.
        if ($this->split->stateCode($doc->counterparty_gstin) === null) {
            return $fail($headerTax > 0 ? 'place_of_supply_unknown' : 'zero_rated_needs_classification');
        }

        $rates = [];
        $kind = null;

        foreach ($items as $item) {
            $split = $this->split->split(round((float) $item->tax_amount, 2), $doc->counterparty_gstin, $ourGstin);

            if (! $split['determinable']) {
                return $fail($split['reason']);
            }

            if ($split['kind'] !== 'none') {
                $kind = $split['kind'];
            }

            $rate = number_format((float) $item->tax_percentage, 2, '.', '');
            $hsn = $item->hsn_sac_code ?: null;
            $key = $rate . '|' . (string) $hsn;

            $rates[$key] ??= ['rate' => (float) $rate, 'hsn' => $hsn, 'taxable_value' => 0.0,
                              'cgst' => 0.0, 'sgst' => 0.0, 'igst' => 0.0];

            $rates[$key]['taxable_value'] = round($rates[$key]['taxable_value'] + (float) $item->amount, 2);
            $rates[$key]['cgst'] = round($rates[$key]['cgst'] + $split['cgst'], 2);
            $rates[$key]['sgst'] = round($rates[$key]['sgst'] + $split['sgst'], 2);
            $rates[$key]['igst'] = round($rates[$key]['igst'] + $split['igst'], 2);
        }

        $rates = array_values($rates);

        return [
            'rates' => $rates,
            // A document whose every line is nil-rated has no intrastate/interstate character to report.
            'kind' => $kind,
            'taxable_value' => round(array_sum(array_column($rates, 'taxable_value')), 2),
            'cgst' => round(array_sum(array_column($rates, 'cgst')), 2),
            'sgst' => round(array_sum(array_column($rates, 'sgst')), 2),
            'igst' => round(array_sum(array_column($rates, 'igst')), 2),
            'reason' => null, 'detail' => null,
        ];
    }

    /**
     * The HSN/SAC summary — every filed line, by service code and rate.
     *
     * ⚠️ It covers exactly the documents the return PLACED. An HSN summary that included the excepted ones
     * would not add up against the sections above it, and a file that disagrees with itself fails validation
     * without saying which half is wrong.
     *
     * 🔴 **A credit note subtracts here too**, the same rule as everywhere else money is totalled in this
     * system. A summary that added them back would overstate every service code by twice the credit given.
     */
    private function hsnSummary(array $b2b, array $cdnr): array
    {
        $rows = [];
        $unclassified = [];

        foreach ([...$b2b, ...$cdnr] as $doc) {
            $sign = $doc['type'] === 'credit_note' ? -1 : 1;

            foreach ($doc['rates'] as $rate) {
                // 🔴 **A LINE WITH NO HSN/SAC CANNOT GO IN THIS SECTION.** Found in the demo's own output: a
                // blank service code produced an `hsn_sc: null` row, which the portal rejects outright — one
                // unclassified charge line and the whole return bounces. The DOCUMENT still files, because the
                // B2B section carries rate and value and needs no code; only the summary cannot hold it. So
                // the line is left out and reported, rather than filed blank (the file is refused) or the whole
                // document dropped (six lakhs of real supplies vanish over a missing classification code).
                // PRD §1529 requires an `hsn_sac_code` on every line, so this is a data gap, not a shape we
                // have to support — but it is one the desk has to be told about before the deadline.
                if ($rate['hsn'] === null || $rate['hsn'] === '') {
                    $unclassified[$doc['document_no']] ??= [
                        'document_no' => $doc['document_no'], 'date' => $doc['date'],
                        'counterparty' => $doc['counterparty'], 'reason' => 'hsn_missing', 'taxable_value' => 0.0,
                    ];
                    $unclassified[$doc['document_no']]['taxable_value'] = round(
                        $unclassified[$doc['document_no']]['taxable_value'] + $sign * $rate['taxable_value'], 2
                    );

                    continue;
                }

                $key = $rate['hsn'] . '|' . $rate['rate'];

                $rows[$key] ??= ['hsn' => $rate['hsn'], 'rate' => $rate['rate'], 'taxable_value' => 0.0,
                                 'cgst' => 0.0, 'sgst' => 0.0, 'igst' => 0.0];

                foreach (['taxable_value', 'cgst', 'sgst', 'igst'] as $head) {
                    $rows[$key][$head] = round($rows[$key][$head] + $sign * $rate[$head], 2);
                }
            }
        }

        ksort($rows);

        return ['rows' => array_values($rows), 'unclassified' => array_values($unclassified)];
    }

    /**
     * The document series issued in the window — what the portal asks for as `doc_issue`.
     *
     * 🔴 **Voids are counted here and nowhere else.** They are not supplies, so they appear in no section
     * above; but the portal asks how many numbers were issued and how many cancelled, and a sequence with a
     * hole in it and nothing explaining the hole is the first thing an auditor asks about.
     *
     * 🔴 **ONE ROW PER UNBROKEN RUN OF NUMBERS, not one row per type.** Found by walking a month of the
     * fixture: reporting `MIN(invoice_no)` to `MAX(invoice_no)` gave *"INV-0001 to INV-0004, 2 issued"* — a
     * range spanning four numbers with a count of two, because 0002 and 0003 were dated into other months.
     * That is a row that contradicts itself, and the two numbers missing from it are the exact shape of a
     * suppressed invoice. Sequences are per fiscal year while this return is per month, so the numbers issued
     * inside one month are **not** guaranteed contiguous, and pretending they are is the lie. Each run is
     * declared separately, which is what `doc_issue` accepts anyway.
     */
    private function documentSeries(int $agentId, string $from, string $to): array
    {
        $rows = DB::table('accounts_invoices')
            ->where('agent_id', $agentId)
            ->where('status', '!=', 'draft')
            ->whereBetween('document_date', [$from, $to])
            ->get(['type', 'invoice_no', 'status']);

        $series = [];

        foreach ($rows->groupBy('type') as $type => $documents) {
            $ordered = $documents
                ->sortBy(fn ($d) => self::sequenceNumber($d->invoice_no) ?? PHP_INT_MAX)
                ->values();

            $run = null;

            foreach ($ordered as $document) {
                $number = self::sequenceNumber($document->invoice_no);
                $cancelled = $document->status === 'void' ? 1 : 0;

                // A number we cannot read, or one that does not follow the last, starts a new run. An
                // unreadable number is always its own run of one: guessing where it belongs in a sequence is
                // how two runs get merged across a gap that matters.
                $continues = $run !== null && $number !== null && $run['last'] !== null && $number === $run['last'] + 1;

                if ($continues) {
                    $run['to'] = $document->invoice_no;
                    $run['last'] = $number;
                    $run['issued']++;
                    $run['cancelled'] += $cancelled;

                    continue;
                }

                if ($run !== null) {
                    $series[] = $this->closeRun($run);
                }

                $run = ['type' => $type, 'from' => $document->invoice_no, 'to' => $document->invoice_no,
                        'last' => $number, 'issued' => 1, 'cancelled' => $cancelled];
            }

            if ($run !== null) {
                $series[] = $this->closeRun($run);
            }
        }

        usort($series, fn ($a, $b) => [$a['type'], $a['from']] <=> [$b['type'], $b['from']]);

        return $series;
    }

    private function closeRun(array $run): array
    {
        return [
            'type' => $run['type'],
            'from' => $run['from'],
            'to' => $run['to'],
            'issued' => $run['issued'],
            'cancelled' => $run['cancelled'],
            'net' => $run['issued'] - $run['cancelled'],
        ];
    }

    /**
     * The sequence number off the end of a document number.
     *
     * Every number in this system is `{PREFIX}-{agent_code}-{fiscal_year}-{sequence}` (PRD §6.3), so the
     * sequence is the last hyphen-delimited part. NULL if it is not — a number in some other shape is not
     * one this can order, and saying so is better than reading four digits out of the middle of it.
     */
    public static function sequenceNumber(?string $documentNo): ?int
    {
        $tail = strrchr((string) $documentNo, '-');

        return $tail !== false && ctype_digit(substr($tail, 1)) ? (int) substr($tail, 1) : null;
    }

    /** 🔴 A credit note subtracts from every total. The same rule as the ageing, the credit gate and the P&L. */
    private function totals(array $b2b, array $cdnr): array
    {
        $sum = ['taxable_value' => 0.0, 'cgst' => 0.0, 'sgst' => 0.0, 'igst' => 0.0];

        foreach ([...$b2b, ...$cdnr] as $doc) {
            $sign = $doc['type'] === 'credit_note' ? -1 : 1;

            foreach (array_keys($sum) as $head) {
                $sum[$head] = round($sum[$head] + $sign * $doc[$head], 2);
            }
        }

        $sum['documents'] = count($b2b) + count($cdnr);
        $sum['tax'] = round($sum['cgst'] + $sum['sgst'] + $sum['igst'], 2);

        return $sum;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // The inward side — 3B section 4
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Input tax credit from purchase vouchers dated in the period.
     *
     * The split is the same rule read the other way round: the VENDOR's state against ours. A vendor with no
     * GSTIN charged us no recoverable tax — an unregistered supplier cannot — so their vouchers are excluded
     * and counted, rather than claimed as credit we are not entitled to. Claiming ITC that does not exist is
     * the one error here that the authority notices by itself, because their copy comes from the vendor's own
     * GSTR-1.
     */
    private function inputCredit(int $agentId, string $from, string $to): array
    {
        $ourGstin = $this->ourGstin($agentId);

        $rows = DB::table('accounts_purchase_vouchers as v')
            ->join('accounts_purchase_items as it', 'it.purchase_voucher_id', '=', 'v.id')
            ->leftJoin('partners as p', 'p.id', '=', 'v.vendor_id')
            ->where('v.agent_id', $agentId)
            ->where('v.status', '!=', 'void')
            ->whereBetween('v.document_date', [$from, $to])
            ->get(['v.id', 'v.voucher_no', 'v.document_date', 'p.name as vendor', 'p.gst_no as vendor_gstin',
                   'it.amount', 'it.tax_amount']);

        $totals = ['taxable_value' => 0.0, 'cgst' => 0.0, 'sgst' => 0.0, 'igst' => 0.0, 'vouchers' => 0];
        $excluded = [];
        $seen = [];

        foreach ($rows as $row) {
            $split = $this->split->split(round((float) $row->tax_amount, 2), $row->vendor_gstin, $ourGstin);

            if (! $split['determinable']) {
                $excluded[$row->voucher_no] ??= [
                    'document_no' => $row->voucher_no, 'date' => $row->document_date,
                    'counterparty' => $row->vendor, 'reason' => $split['reason'],
                    'taxable_value' => 0.0, 'tax' => 0.0,
                ];
                $excluded[$row->voucher_no]['taxable_value'] = round($excluded[$row->voucher_no]['taxable_value'] + (float) $row->amount, 2);
                $excluded[$row->voucher_no]['tax'] = round($excluded[$row->voucher_no]['tax'] + (float) $row->tax_amount, 2);

                continue;
            }

            $seen[$row->id] = true;
            $totals['taxable_value'] = round($totals['taxable_value'] + (float) $row->amount, 2);
            $totals['cgst'] = round($totals['cgst'] + $split['cgst'], 2);
            $totals['sgst'] = round($totals['sgst'] + $split['sgst'], 2);
            $totals['igst'] = round($totals['igst'] + $split['igst'], 2);
        }

        $totals['vouchers'] = count($seen);
        $totals['tax'] = round($totals['cgst'] + $totals['sgst'] + $totals['igst'], 2);

        return ['totals' => $totals, 'excluded' => array_values($excluded)];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Plumbing
    // ─────────────────────────────────────────────────────────────────────────

    private function ourGstin(int $agentId): ?string
    {
        $gstin = DB::table('agents_info')->where('id', $agentId)->value('gst_no');

        return $this->split->stateCode($gstin) === null ? null : strtoupper(trim((string) $gstin));
    }

    /** @param list<int> $ids */
    private function register(array $ids): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return DB::table('gst_ledger_entries')->where('voucher_type', 'invoice')->whereIn('voucher_id', $ids)
            ->get(['voucher_id', 'cgst_amount', 'sgst_amount', 'igst_amount'])
            ->keyBy('voucher_id');
    }

    /**
     * Where the register row written at posting disagrees with what the documents imply now.
     *
     * ⚠️ Reported, never corrected. The usual cause is a counterparty GSTIN edited after we invoiced them, and
     * which version is the truth — the heads we charged on the paper the client holds, or the heads their
     * corrected registration says apply — is not a question code can answer.
     */
    private function registerDisagrees(object $doc, array $placed, Collection $registered): ?array
    {
        $row = $registered->get($doc->id);

        if ($row === null) {
            return null;
        }

        $same = round((float) $row->cgst_amount, 2) === $placed['cgst']
            && round((float) $row->sgst_amount, 2) === $placed['sgst']
            && round((float) $row->igst_amount, 2) === $placed['igst'];

        return $same ? null : [
            'document_id' => (int) $doc->id,
            'document_no' => $doc->invoice_no,
            'date' => $doc->document_date,
            'counterparty' => $doc->counterparty,
            'reason' => 'register_disagrees',
            'registered' => ['cgst' => round((float) $row->cgst_amount, 2), 'sgst' => round((float) $row->sgst_amount, 2),
                             'igst' => round((float) $row->igst_amount, 2)],
            'return' => ['cgst' => $placed['cgst'], 'sgst' => $placed['sgst'], 'igst' => $placed['igst']],
        ];
    }

    private function exception(object $doc, string $reason, ?string $detail): array
    {
        return [
            'document_id' => (int) $doc->id,
            'document_no' => $doc->invoice_no,
            'type' => $doc->type,
            'date' => $doc->document_date,
            'counterparty' => $doc->counterparty,
            'counterparty_gstin' => $doc->counterparty_gstin,
            'taxable_value' => round((float) $doc->subtotal, 2),
            'tax' => round((float) $doc->tax_amount, 2),
            'reason' => $reason,
            'detail' => $detail ?? self::REASONS[$reason] ?? null,
        ];
    }

    /** The portal's own period format: MMYYYY, taken from the month the window ENDS in. */
    private function filingPeriod(string $to): string
    {
        return date('mY', strtotime($to));
    }

    /** The calendar month a date falls in, as the window every real filing uses. */
    public static function month(string $yearMonth): array
    {
        $start = date('Y-m-01', strtotime($yearMonth . '-01'));

        return [$start, date('Y-m-t', strtotime($start))];
    }
}
