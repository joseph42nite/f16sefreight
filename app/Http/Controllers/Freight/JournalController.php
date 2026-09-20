<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\BillingDocuments;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * The day book, and the way down from a report to the document behind it (user, 2026-09-20).
 *
 * 🔴 **A figure you cannot open is a figure you have to take on faith**, which is the single reason people keep a
 * spreadsheet beside their accounting system. Every line here carries the document that wrote it, so the chain
 * runs: a P&L line → the account → its entries → the invoice, voucher or receipt → its own lines.
 *
 * ⚠️ Read-only, for everyone. Nothing in the ledger is edited, ever: a posting is corrected by another posting.
 * There is no endpoint here that writes, and that is deliberate rather than unfinished.
 */
class JournalController extends Controller
{
    /** Where a ledger entry came from, and where to find it again. */
    private const SOURCES = [
        'invoice' => ['table' => 'accounts_invoices', 'number' => 'invoice_no', 'label' => 'Sales document'],
        'purchase_voucher' => ['table' => 'accounts_purchase_vouchers', 'number' => 'voucher_no', 'label' => 'Purchase voucher'],
        'receipt' => ['table' => 'accounts_receipts', 'number' => 'receipt_no', 'label' => 'Receipt'],
    ];

    /** The day book: every posting, newest first, with the document that wrote it. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $rows = $this->entries($request, $branches)->limit(1000)->get();
        $this->describe($rows);

        return response()->json([
            'entries' => $rows,
            'totals' => [
                'count' => $rows->count(),
                'debits' => round($rows->sum('debit_amount'), 2),
                'credits' => round($rows->sum('credit_amount'), 2),
            ],
            'branches' => $branches,
            'accounts' => $this->accounts($branches),
            'periods' => DB::table('accounting_periods')->whereIn('agent_id', $branches->pluck('id'))
                ->orderByDesc('start_date')->get(['id', 'agent_id', 'period_name', 'start_date', 'end_date', 'status']),
            'sources' => array_map(fn ($s) => $s['label'], self::SOURCES),
        ]);
    }

    /**
     * One account's ledger: what it stood at, what moved, what it stands at now.
     *
     * 🔴 The opening balance is every entry BEFORE the window, not zero. An account ledger that starts at zero on
     * the 1st of the month is not a ledger, it is a filter — and the closing figure will not agree with the trial
     * balance, which is the one thing it has to agree with.
     */
    public function account(Request $request, string $code): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $account = DB::table('chart_of_accounts')->whereIn('agent_id', $branches->pluck('id'))
            ->where('account_code', $code)->first(['account_code', 'account_name']);

        abort_if($account === null, 404, 'No such account in your chart.');

        $request->merge(['account' => $code]);
        // 🔴 `reorder()`, not another `orderBy`. Laravel APPENDS an order, so the day book's newest-first ordering
        // would still win and the running balance would read up the page instead of down it.
        $rows = $this->entries($request, $branches)->reorder()->orderBy('l.posting_date')->orderBy('l.id')->get();
        $this->describe($rows);

        $opening = $this->openingBalance($request, $branches, $code);
        $movements = ['debits' => round($rows->sum('debit_amount'), 2), 'credits' => round($rows->sum('credit_amount'), 2)];

        // Running balance down the page, as a ledger reads.
        $balance = $opening;

        foreach ($rows as $row) {
            $balance = round($balance + (float) $row->debit_amount - (float) $row->credit_amount, 2);
            $row->balance = $balance;
        }

        return response()->json([
            'account' => $account,
            'entries' => $rows,
            'opening' => $opening,
            'movements' => $movements,
            'closing' => round($opening + $movements['debits'] - $movements['credits'], 2),
            'branches' => $branches,
        ]);
    }

    /**
     * One entry, drilled through: the document that wrote it, that document's own lines, and the OTHER SIDE of the
     * journal it belongs to.
     *
     * ⚠️ The whole journal, not just this line. Half a double entry answers nothing — the question somebody has
     * when they click a credit to revenue is "against what?", and the answer is the debit beside it.
     */
    public function entry(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $entry = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->whereIn('l.agent_id', $branches->pluck('id'))->where('l.id', $id)
            ->first(['l.*', 'c.account_code', 'c.account_name']);

        abort_if($entry === null, 404, 'That entry is not one of yours.');

        $journal = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.source_type', $entry->source_type)->where('l.source_id', $entry->source_id)
            ->where('l.agent_id', $entry->agent_id)
            ->orderByDesc('l.debit_amount')
            ->get(['l.id', 'l.debit_amount', 'l.credit_amount', 'c.account_code', 'c.account_name']);

        return response()->json([
            'entry' => $entry,
            'journal' => [
                'lines' => $journal,
                'debits' => round($journal->sum('debit_amount'), 2),
                'credits' => round($journal->sum('credit_amount'), 2),
                'balanced' => round($journal->sum('debit_amount'), 2) === round($journal->sum('credit_amount'), 2),
            ],
            'document' => $this->document($entry->source_type, (int) $entry->source_id),
            'period' => DB::table('accounting_periods')->where('id', $entry->accounting_period_id)
                ->first(['id', 'period_name', 'start_date', 'end_date', 'status']),
        ]);
    }

    /** The day book as a CSV — the file an auditor asks for. */
    public function export(Request $request): Response
    {
        $this->authorize('viewFinancials');

        $rows = $this->entries($request, $this->branches())->limit(20000)->get();
        $this->describe($rows);

        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, ['Date', 'Account', 'Account name', 'Debit', 'Credit', 'Document', 'Type', 'Organization', 'Branch']);

        foreach ($rows as $row) {
            fputcsv($csv, [$row->posting_date, $row->account_code, $row->account_name,
                $row->debit_amount, $row->credit_amount, $row->document_no, $row->source_label,
                $row->organization, $row->branch]);
        }

        rewind($csv);

        return response(stream_get_contents($csv), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="day-book-' . now()->format('Ymd-His') . '.csv"',
        ]);
    }

    /** The one query both the day book and an account ledger are built from. */
    private function entries(Request $request, $branches)
    {
        return DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->join('agents_info as a', 'a.id', '=', 'l.agent_id')
            ->whereIn('l.agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('l.agent_id', $request->integer('agent_id')))
            ->when($request->filled('period_id'), fn ($q) => $q->where('l.accounting_period_id', $request->integer('period_id')))
            ->when($request->filled('account'), fn ($q) => $q->where('c.account_code', $request->string('account')))
            ->when($request->filled('source_type'), fn ($q) => $q->where('l.source_type', $request->string('source_type')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('l.posting_date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('l.posting_date', '<=', $request->date('to')))
            ->when($request->filled('side'), fn ($q) => $request->string('side')->toString() === 'debit'
                ? $q->where('l.debit_amount', '>', 0) : $q->where('l.credit_amount', '>', 0))
            ->orderByDesc('l.posting_date')->orderByDesc('l.id')
            ->select(['l.id', 'l.posting_date', 'l.debit_amount', 'l.credit_amount', 'l.source_type', 'l.source_id',
                      'l.accounting_period_id', 'l.agent_id', 'c.account_code', 'c.account_name', 'a.agent_name as branch']);
    }

    /** Everything before the window began — see the account() docblock. */
    private function openingBalance(Request $request, $branches, string $code): float
    {
        $before = $request->filled('from')
            ? $request->date('from')
            : ($request->filled('period_id')
                ? DB::table('accounting_periods')->where('id', $request->integer('period_id'))->value('start_date')
                : null);

        if ($before === null) {
            return 0.0;
        }

        $row = DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->whereIn('l.agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('l.agent_id', $request->integer('agent_id')))
            ->where('c.account_code', $code)
            ->whereDate('l.posting_date', '<', $before)
            ->selectRaw('COALESCE(SUM(l.debit_amount), 0) AS dr, COALESCE(SUM(l.credit_amount), 0) AS cr')
            ->first();

        return round((float) $row->dr - (float) $row->cr, 2);
    }

    /**
     * Put the document on every row.
     *
     * ⚠️ Three small lookups keyed by type rather than three LEFT JOINs on the main query: the joins made the day
     * book's plan scan all three document tables for every row, and the page has to open on a ledger of a hundred
     * thousand entries.
     */
    private function describe($rows): void
    {
        $byType = $rows->groupBy('source_type');
        $documents = [];

        foreach ($byType as $type => $group) {
            if (! isset(self::SOURCES[$type])) {
                continue;
            }

            $source = self::SOURCES[$type];
            $documents[$type] = DB::table($source['table'])->whereIn('id', $group->pluck('source_id')->unique())
                // array_merge, never `+`: the union keeps the LEFT value on a shared key and would silently drop a
                // party column the day the two lists overlap.
                ->get(array_merge(['id', $source['number'] . ' as number'], $this->partyColumns($type)))
                ->keyBy('id');
        }

        $names = $this->partyNames($documents);

        foreach ($rows as $row) {
            $document = $documents[$row->source_type][$row->source_id] ?? null;

            $row->document_no = $document->number ?? null;
            $row->source_label = self::SOURCES[$row->source_type]['label'] ?? $row->source_type;
            $row->organization = $document === null ? null : ($names[$this->partyKey($row->source_type, $document)] ?? null);
        }
    }

    /** Which columns identify the other party, per document type. */
    private function partyColumns(string $type): array
    {
        return match ($type) {
            'invoice' => ['customer_id', 'billed_party_type', 'billed_party_id', 'type'],
            'purchase_voucher' => ['vendor_id'],
            'receipt' => ['payer_type', 'payer_id'],
            default => [],
        };
    }

    /** `customers:12` or `partners:7` for one document. */
    private function partyKey(string $type, object $document): ?string
    {
        return match ($type) {
            'invoice' => ($document->billed_party_type === 'partner' ? 'partners:' : 'customers:')
                . ($document->billed_party_id ?: $document->customer_id),
            'purchase_voucher' => 'partners:' . $document->vendor_id,
            'receipt' => ($document->payer_type === 'partner' ? 'partners:' : 'customers:') . $document->payer_id,
            default => null,
        };
    }

    /** Every party named across every document, in two queries. */
    private function partyNames(array $documents): array
    {
        $keys = [];

        foreach ($documents as $type => $rows) {
            foreach ($rows as $document) {
                $key = $this->partyKey($type, $document);

                if ($key !== null) {
                    $keys[$key] = true;
                }
            }
        }

        $names = [];

        foreach (['customers', 'partners'] as $table) {
            $ids = array_map(fn ($k) => (int) explode(':', $k)[1],
                array_filter(array_keys($keys), fn ($k) => str_starts_with($k, $table . ':')));

            foreach (DB::table($table)->whereIn('id', $ids)->get(['id', 'name']) as $party) {
                $names[$table . ':' . $party->id] = $party->name;
            }
        }

        return $names;
    }

    /** The document behind an entry, with enough of itself to be recognised. */
    private function document(string $type, int $id): ?array
    {
        if (! isset(self::SOURCES[$type])) {
            return null;
        }

        $source = self::SOURCES[$type];
        $row = DB::table($source['table'])->where('id', $id)->first();

        if ($row === null) {
            return null;
        }

        $lines = match ($type) {
            'invoice' => DB::table('accounts_invoice_items')->where('invoice_id', $id)
                ->get(['description', 'quantity', 'rate', 'amount', 'tax_amount', 'net_amount']),
            'purchase_voucher' => DB::table('accounts_purchase_items')->where('purchase_voucher_id', $id)
                ->get(['description', 'quantity', 'rate', 'amount', 'tax_amount', 'net_amount']),
            'receipt' => DB::table('accounts_receipt_allocations as a')
                ->join('accounts_invoices as i', 'i.id', '=', 'a.invoice_id')
                ->where('a.receipt_id', $id)
                ->get(['i.invoice_no as description', 'a.amount as net_amount', 'a.resolution']),
            default => collect(),
        };

        return [
            'type' => $type,
            'label' => $source['label'],
            'number' => $row->{$source['number']},
            'date' => $row->document_date ?? $row->receipt_date ?? null,
            'organization' => $this->partyNames([$type => collect([$row])])[$this->partyKey($type, $row)] ?? null,
            'total' => (float) ($row->grand_total ?? $row->amount ?? $lines->sum('net_amount')),
            'currency' => $row->currency ?? 'INR',
            'job_no' => isset($row->job_id) ? DB::table('jobs')->where('id', $row->job_id)->value('execution_job_no') : null,
            // A sales document says which of the five it is, so the drill lands on the right screen.
            'document_type' => $type === 'invoice' ? BillingDocuments::label($row->type) : null,
            'lines' => $lines,
        ];
    }

    /** Every account that has been posted to, for the picker. */
    private function accounts($branches)
    {
        return DB::table('chart_of_accounts')->whereIn('agent_id', $branches->pluck('id'))
            ->select('account_code', 'account_name')->distinct()->orderBy('account_code')->get();
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
