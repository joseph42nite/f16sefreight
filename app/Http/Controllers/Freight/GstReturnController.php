<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\GstReturnService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * GSTR-1 and GSTR-3B, on screen and as files (user, 2026-09-22).
 *
 * 🔴 **A RETURN IS PER GSTIN, SO "ALL BRANCHES" IS REFUSED.** Every other report on this desk offers an
 * all-branches roll-up, because a company's owner wants one number. A GST return is the opposite: each
 * registered place of business files its own, under its own GSTIN, to its own state. Merging Mumbai's and
 * Chennai's supplies into one file would file Tamil Nadu's sales under a Maharashtra registration — which is
 * not a reporting inaccuracy but a false declaration, and it would understate one state's revenue while
 * overstating the other's. So a branch must be named, and it must have a GSTIN.
 *
 * 🔴 **THE WINDOW IS A CALENDAR MONTH.** Not an accounting period — see `GstReturnService::gstr1()`. Every
 * period in this system spans a financial year; a return is filed monthly.
 *
 * ⚠️ **`format=gstn` follows the offline utility's JSON shape as documented, and has not been round-tripped
 * through the utility itself** — that needs the real tool and a real GSTIN, neither of which belongs in this
 * repository. Validate one month through it before the first filing; the CSV is the format to reconcile by eye
 * and is derived from the same computation, so a disagreement between them would be a bug here, not there.
 *
 * 🔒 `viewFinancials`: accounts, and the Boss read-only.
 */
class GstReturnController extends Controller
{
    /** The portal's own nature-of-document codes for the `doc_issue` section. */
    private const DOC_CODES = ['invoice' => 1, 'brokerage' => 1, 'consol_invoice' => 1, 'debit_note' => 4, 'credit_note' => 5];

    public function __construct(private readonly GstReturnService $returns) {}

    /** GSTR-1 — the outward supplies return, invoice by invoice. */
    public function gstr1(Request $request)
    {
        $this->authorize('viewFinancials');

        [$branch, $from, $to, $error] = $this->window($request);

        if ($error !== null) {
            return $error;
        }

        $return = $this->returns->gstr1($branch->id, $from, $to);

        return match ($request->string('format')->toString()) {
            'gstn' => $this->file($this->gstn($return, $branch), 'GSTR1-' . $branch->branch_code . '-' . $return['filing_period'] . '.json', 'application/json'),
            'csv' => $this->file($this->csv($return, $branch), 'GSTR1-' . $branch->branch_code . '-' . $return['filing_period'] . '.csv', 'text/csv'),
            default => response()->json(array_merge($return, $this->context($request, $branch, $from, $to))),
        };
    }

    /** GSTR-3B — the summary return: what we owe, what we may claim, and the arithmetic between them. */
    public function gstr3b(Request $request)
    {
        $this->authorize('viewFinancials');

        [$branch, $from, $to, $error] = $this->window($request);

        if ($error !== null) {
            return $error;
        }

        $return = $this->returns->gstr3b($branch->id, $from, $to);

        if ($request->string('format')->toString() === 'csv') {
            return $this->file(
                $this->csv3b($return, $branch),
                'GSTR3B-' . $branch->branch_code . '-' . $return['filing_period'] . '.csv',
                'text/csv'
            );
        }

        return response()->json(array_merge($return, $this->context($request, $branch, $from, $to)));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // The files
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * The offline utility's JSON.
     *
     * ⚠️ **`gt` and `cur_gt` are deliberately absent.** The utility asks for the aggregate turnover of the
     * PREVIOUS financial year — a figure this system does not hold, and one that cannot be substituted with
     * the month's own taxable value without filing a wrong number in a field the portal validates slabs
     * against. An absent field the accountant fills in is honest; a plausible wrong one is not.
     */
    private function gstn(array $return, object $branch): string
    {
        $itms = fn (array $rates) => array_values(array_map(fn (int $i, array $rate) => [
            'num' => $i + 1,
            'itm_det' => [
                'rt' => $rate['rate'],
                'txval' => $rate['taxable_value'],
                'camt' => $rate['cgst'],
                'samt' => $rate['sgst'],
                'iamt' => $rate['igst'],
                'csamt' => 0,
            ],
        ], array_keys($rates), $rates));

        $b2b = [];
        foreach ($return['b2b'] as $doc) {
            $ctin = $doc['counterparty_gstin'];
            $b2b[$ctin]['ctin'] = $ctin;
            $b2b[$ctin]['inv'][] = [
                'inum' => $doc['document_no'],
                'idt' => date('d-m-Y', strtotime($doc['date'])),
                'val' => $doc['document_total'],
                'pos' => $doc['place_of_supply'],
                // Reverse charge is a contract term nothing in this system records, and it is 'N' for
                // ordinary freight forwarding. Named rather than omitted so it is visible as an assumption.
                'rchrg' => 'N',
                'inv_typ' => 'R',
                'itms' => $itms($doc['rates']),
            ];
        }

        $cdnr = [];
        foreach ($return['cdnr'] as $doc) {
            $ctin = $doc['counterparty_gstin'];
            $cdnr[$ctin]['ctin'] = $ctin;
            $cdnr[$ctin]['nt'][] = [
                'ntty' => $doc['note_type'],
                'nt_num' => $doc['document_no'],
                'nt_dt' => date('d-m-Y', strtotime($doc['date'])),
                'val' => $doc['document_total'],
                'pos' => $doc['place_of_supply'],
                'rchrg' => 'N',
                'itms' => $itms($doc['rates']),
            ];
        }

        // ⚠️ ONE `doc_det` entry per nature-of-document code, holding every run of that nature — not one
        // entry per run. Invoices, brokerage and consol invoices all declare as code 1, so emitting an entry
        // each gives the portal three separate `doc_num: 1` blocks, which is not what the section means.
        $byNature = [];
        foreach ($return['docs'] as $series) {
            $byNature[self::DOC_CODES[$series['type']] ?? 1][] = $series;
        }
        ksort($byNature);

        $docs = [];
        foreach ($byNature as $code => $runs) {
            $docs[] = [
                'doc_num' => $code,
                'docs' => array_values(array_map(fn (int $i, array $series) => [
                    'num' => $i + 1,
                    'from' => $series['from'],
                    'to' => $series['to'],
                    'totnum' => $series['issued'],
                    'cancel' => $series['cancelled'],
                    'net_issue' => $series['net'],
                ], array_keys($runs), $runs)),
            ];
        }

        return json_encode(array_filter([
            'gstin' => $return['gstin'],
            'fp' => $return['filing_period'],
            'b2b' => array_values($b2b),
            'cdnr' => array_values($cdnr),
            'hsn' => ['data' => array_values(array_map(fn (int $i, array $h) => [
                'num' => $i + 1,
                'hsn_sc' => $h['hsn'],
                // ⚠️ Freight is a SERVICE: its SAC carries no unit of measure and no quantity the portal
                // can check, so 'OTH' with a zero quantity is what a service line legitimately declares.
                'uqc' => 'OTH',
                'qty' => 0,
                'rt' => $h['rate'],
                'txval' => $h['taxable_value'],
                'camt' => $h['cgst'],
                'samt' => $h['sgst'],
                'iamt' => $h['igst'],
                'csamt' => 0,
            ], array_keys($return['hsn']), $return['hsn']))],
            'doc_issue' => ['doc_det' => $docs],
        ], fn ($v) => $v !== [] && $v !== null), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * The CSV the desk reconciles by eye.
     *
     * 🔴 **The exceptions are in the same file, at the bottom.** A return file that silently omitted the three
     * documents it could not place would reconcile against nothing and explain nothing; the whole point of
     * naming them is that somebody sees them before the deadline.
     */
    private function csv(array $return, object $branch): string
    {
        $csv = fopen('php://temp', 'r+');

        fputcsv($csv, ['GSTR-1', $branch->agent_name, 'GSTIN ' . ($return['gstin'] ?? 'NOT SET'),
                       'Filing period ' . $return['filing_period'], $return['from'] . ' to ' . $return['to']]);
        fputcsv($csv, []);
        fputcsv($csv, ['Section', 'Counterparty', 'Counterparty GSTIN', 'Document', 'Type', 'Date',
                       'Place of supply', 'Supply', 'Rate %', 'HSN/SAC', 'Taxable value', 'CGST', 'SGST', 'IGST',
                       'Document total', 'Note type', 'Reason']);

        foreach ([['B2B', $return['b2b']], ['CDNR', $return['cdnr']]] as [$section, $rows]) {
            foreach ($rows as $doc) {
                foreach ($doc['rates'] as $rate) {
                    fputcsv($csv, [$section, $doc['counterparty'], $doc['counterparty_gstin'], $doc['document_no'],
                        $doc['type'], $doc['date'], $doc['place_of_supply'], $doc['supply'], $rate['rate'],
                        $rate['hsn'], $rate['taxable_value'], $rate['cgst'], $rate['sgst'], $rate['igst'],
                        $doc['document_total'], $doc['note_type'] ?? '', '']);
                }
            }
        }

        foreach ($return['hsn'] as $h) {
            fputcsv($csv, ['HSN', '', '', '', '', '', '', '', $h['rate'], $h['hsn'],
                $h['taxable_value'], $h['cgst'], $h['sgst'], $h['igst'], '', '', '']);
        }

        foreach ($return['docs'] as $d) {
            fputcsv($csv, ['DOCUMENT SERIES', '', '', $d['from'] . ' to ' . $d['to'], $d['type'], '', '', '', '', '',
                '', '', '', '', '', '', $d['issued'] . ' issued, ' . $d['cancelled'] . ' cancelled']);
        }

        fputcsv($csv, ['TOTAL', '', '', $return['totals']['documents'] . ' documents', '', '', '', '', '', '',
            $return['totals']['taxable_value'], $return['totals']['cgst'], $return['totals']['sgst'],
            $return['totals']['igst'], '', '', 'Tax ' . $return['totals']['tax']]);

        foreach ($return['exceptions'] as $e) {
            fputcsv($csv, ['NOT FILED', $e['counterparty'], $e['counterparty_gstin'], $e['document_no'], $e['type'],
                $e['date'], '', '', '', '', $e['taxable_value'], '', '', '', '', '', $e['detail']]);
        }

        // Two kinds of warning, and they say different things: a split the register disagrees with, and a
        // line with no HSN/SAC that is therefore missing from the summary above. Both documents ARE filed.
        foreach ($return['warnings'] as $w) {
            $detail = $w['reason'] === 'register_disagrees'
                ? 'Register says ' . implode(' / ', $w['registered']) . ' — the return files '
                    . implode(' / ', $w['return'])
                : GstReturnService::REASONS[$w['reason']] ?? $w['reason'];

            fputcsv($csv, ['WARNING', $w['counterparty'], '', $w['document_no'], '', $w['date'], '', '', '', '',
                $w['taxable_value'] ?? '', '', '', '', '', '', $detail]);
        }

        rewind($csv);

        return (string) stream_get_contents($csv);
    }

    /** 3B is nine figures, so its file is the nine figures and what each one is. */
    private function csv3b(array $return, object $branch): string
    {
        $csv = fopen('php://temp', 'r+');

        fputcsv($csv, ['GSTR-3B', $branch->agent_name, 'GSTIN ' . ($return['gstin'] ?? 'NOT SET'),
                       'Filing period ' . $return['filing_period'], $return['from'] . ' to ' . $return['to']]);
        fputcsv($csv, []);
        fputcsv($csv, ['Box', 'Description', 'Taxable value', 'IGST', 'CGST', 'SGST']);

        fputcsv($csv, ['3.1(a)', 'Outward taxable supplies (other than zero rated, nil rated and exempted)',
            $return['outward']['taxable_value'], $return['outward']['igst'],
            $return['outward']['cgst'], $return['outward']['sgst']]);

        fputcsv($csv, ['4(A)(5)', 'All other ITC', $return['input_credit']['taxable_value'],
            $return['input_credit']['igst'], $return['input_credit']['cgst'], $return['input_credit']['sgst']]);

        fputcsv($csv, ['', 'Output tax less input credit (arithmetic — NOT the set-off)', '',
            $return['difference']['igst'], $return['difference']['cgst'], $return['difference']['sgst']]);

        fputcsv($csv, []);
        fputcsv($csv, ['Not included in 3.1(a)', $return['excluded']['count'] . ' document(s) GSTR-1 could not place',
            $return['excluded']['value'], '', '', '']);

        foreach ($return['excluded']['rows'] as $e) {
            fputcsv($csv, ['', $e['document_no'] . ' — ' . $e['detail'], $e['taxable_value'], '', '', '']);
        }

        foreach ($return['input_excluded'] as $e) {
            fputcsv($csv, ['Credit not claimed', $e['document_no'] . ' — ' . ($e['counterparty'] ?? 'unnamed vendor')
                . ': ' . GstReturnService::REASONS[$e['reason']], $e['taxable_value'], '', '', $e['tax']]);
        }

        rewind($csv);

        return (string) stream_get_contents($csv);
    }

    private function file(string $body, string $name, string $type): Response
    {
        return response($body, 200, [
            'Content-Type' => $type,
            'Content-Disposition' => 'attachment; filename="' . $name . '"',
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Which branch, which month
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @return array{0: ?object, 1: ?string, 2: ?string, 3: ?JsonResponse}
     */
    private function window(Request $request): array
    {
        $branches = $this->branches();

        $branch = $request->filled('agent_id')
            ? $branches->firstWhere('id', $request->integer('agent_id'))
            // The acting user's own branch, because that is the return they file.
            : ($branches->firstWhere('id', UserContext::for(auth()->user())->agentId) ?? $branches->first());

        if ($branch === null) {
            return [null, null, null, response()->json([
                'error' => 'That branch is not one of this company\'s.', 'reason' => 'branch_not_found',
            ], 404)];
        }

        $month = $request->string('month')->toString() ?: now()->format('Y-m');

        if (! preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $month)) {
            return [null, null, null, response()->json([
                'error' => 'A GST return is filed for one calendar month. Give it as YYYY-MM.',
                'reason' => 'month_invalid',
            ], 422)];
        }

        [$from, $to] = GstReturnService::month($month);

        return [$branch, $from, $to, null];
    }

    /** What the pickers need, and the months there is anything to file for. */
    private function context(Request $request, object $branch, string $from, string $to): array
    {
        return [
            'branch' => $branch,
            'branches' => $this->branches(),
            'month' => date('Y-m', strtotime($from)),
            'months' => $this->months($branch->id),
        ];
    }

    /**
     * Every month this branch raised a document in, newest first — so the picker offers months that exist
     * rather than a calendar the accountant has to guess their way around.
     */
    private function months(int $agentId)
    {
        return DB::table('accounts_invoices')
            ->where('agent_id', $agentId)->where('status', '!=', 'draft')
            ->selectRaw("DATE_FORMAT(document_date, '%Y-%m') AS month, COUNT(*) AS documents")
            ->groupBy('month')->orderByDesc('month')->get();
    }

    private function branches()
    {
        return DB::table('agents_info')
            ->where('company_id', UserContext::for(auth()->user())->companyId)
            ->orderBy('agent_name')
            ->get(['id', 'agent_name', 'branch_code', 'gst_no']);
    }
}
