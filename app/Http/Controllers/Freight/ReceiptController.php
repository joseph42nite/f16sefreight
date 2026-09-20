<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\AccountsReceipt;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\EnquirySequenceService;
use App\Services\LedgerPostingService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Receipts — money in, and the documents it settled (user, 2026-09-19: Billing → Receipts).
 *
 * 🔴 **The allocation is the record, not `amount_paid`.** One payment settles several invoices and one invoice takes
 * several payments; `accounts_invoices.amount_paid` is kept in step as a convenience for the AR screens, but it is
 * DERIVED from the allocations and never typed.
 *
 * 🔒 Recording and posting a receipt is accounts'. The Boss reads them.
 */
class ReceiptController extends Controller
{
    public function __construct(
        private readonly EnquirySequenceService $sequences,
        private readonly LedgerPostingService $ledger,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();

        $rows = DB::table('accounts_receipts as r')
            ->leftJoin('customers as c', function ($join) {
                $join->on('c.id', '=', 'r.payer_id')->where('r.payer_type', '=', 'customer');
            })
            ->leftJoin('partners as p', function ($join) {
                $join->on('p.id', '=', 'r.payer_id')->where('r.payer_type', '=', 'partner');
            })
            ->whereIn('r.agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('r.agent_id', $request->integer('agent_id')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('r.receipt_date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('r.receipt_date', '<=', $request->date('to')))
            ->orderByDesc('r.receipt_date')->orderByDesc('r.id')
            ->limit(500)
            ->get(['r.*', DB::raw('COALESCE(c.name, p.name) AS organization')]);

        $allocations = DB::table('accounts_receipt_allocations as a')
            ->join('accounts_invoices as i', 'i.id', '=', 'a.invoice_id')
            ->whereIn('a.receipt_id', $rows->pluck('id'))
            ->get(['a.receipt_id', 'a.amount', 'a.resolution', 'i.invoice_no'])
            ->groupBy('receipt_id');

        foreach ($rows as $row) {
            $row->allocations = $allocations[$row->id] ?? collect();
            $row->allocated = round((float) $row->allocations->sum('amount'), 2);
            $row->unallocated = round((float) $row->amount - $row->allocated, 2);
        }

        return response()->json([
            'rows' => $rows,
            'total' => round($rows->sum('amount'), 2),
            'branches' => $branches,
            'modes' => AccountsReceipt::MODES,
        ]);
    }

    /** What this client still owes, so a receipt is allocated against real balances rather than from memory. */
    public function openDocuments(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $rows = DB::table('accounts_invoices as i')
            ->whereIn('i.agent_id', $this->branches()->pluck('id'))
            ->whereNotIn('i.status', ['draft', 'void', 'paid'])
            ->when($request->filled('customer_id'), fn ($q) => $q->where('i.customer_id', $request->integer('customer_id')))
            ->when($request->filled('partner_id'), fn ($q) => $q->where('i.billed_party_type', 'partner')
                ->where('i.billed_party_id', $request->integer('partner_id')))
            // A credit note reduces what they owe; it is never something they pay.
            ->where('i.type', '!=', 'credit_note')
            ->orderBy('i.document_date')
            ->get(['i.id', 'i.invoice_no', 'i.type', 'i.document_date', 'i.due_date', 'i.currency',
                   'i.grand_total', 'i.amount_paid',
                   DB::raw('ROUND(i.grand_total - i.amount_paid, 2) AS outstanding')]);

        return response()->json(['rows' => $rows, 'total' => round($rows->sum('outstanding'), 2)]);
    }

    /**
     * Record a receipt and place it against documents.
     *
     * ⚠️ An allocation may not exceed what the document still owes, and the allocations together may not exceed the
     * money that arrived. Both are refused rather than clamped: a silently reduced allocation is a figure nobody
     * typed and nobody can explain later.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('postLedger');

        $data = $request->validate([
            'agent_id' => 'required|integer',
            'payer_type' => 'nullable|in:customer,partner',
            'payer_id' => 'nullable|integer',
            'receipt_date' => 'required|date',
            'mode' => 'required|in:' . implode(',', AccountsReceipt::MODES),
            'reference' => 'nullable|string|max:60',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'nullable|string|size:3',
            'exchange_rate' => 'nullable|numeric|min:0',
            'narration' => 'nullable|string|max:255',
            'bank_transaction_id' => 'nullable|integer',
            'allocations' => 'nullable|array',
            'allocations.*.invoice_id' => 'required|integer',
            'allocations.*.amount' => 'required|numeric|min:0.01',
            'allocations.*.resolution' => 'nullable|in:write_off,discount',
        ]);

        if (! $this->branches()->contains('id', (int) $data['agent_id'])) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        $allocations = $data['allocations'] ?? [];

        if (round(array_sum(array_column($allocations, 'amount')), 2) > round((float) $data['amount'], 2) + 0.009) {
            return response()->json([
                'error' => 'The allocations come to more than the money that arrived.',
                'reason' => 'over_allocated',
            ], 422);
        }

        foreach ($allocations as $allocation) {
            $invoice = AccountsInvoice::withoutTenantScope()->find($allocation['invoice_id']);

            if ($invoice === null || ! $this->branches()->contains('id', $invoice->agent_id)) {
                return response()->json(['error' => 'One of those documents is not one of yours.', 'reason' => 'invoice_not_found'], 404);
            }

            if (round((float) $allocation['amount'], 2) > $invoice->outstanding() + 0.009) {
                return response()->json([
                    'error' => sprintf('%s has only %s outstanding; you have placed %s against it.',
                        $invoice->invoice_no, number_format($invoice->outstanding(), 2), number_format((float) $allocation['amount'], 2)),
                    'reason' => 'over_allocated_invoice',
                ], 422);
            }
        }

        $receipt = DB::transaction(function () use ($data, $allocations) {
            $receipt = AccountsReceipt::create([
                'agent_id' => $data['agent_id'],
                'payer_type' => $data['payer_type'] ?? 'customer',
                'payer_id' => $data['payer_id'] ?? null,
                'receipt_no' => $this->sequences->next((int) $data['agent_id'], 'RCPT'),
                'receipt_date' => $data['receipt_date'],
                'mode' => $data['mode'],
                'reference' => $data['reference'] ?? null,
                'amount' => round((float) $data['amount'], 2),
                'currency' => strtoupper($data['currency'] ?? 'INR'),
                'exchange_rate' => $data['exchange_rate'] ?? 1,
                'bank_transaction_id' => $data['bank_transaction_id'] ?? null,
                'narration' => $data['narration'] ?? null,
                'created_by' => auth()->id(),
            ]);

            foreach ($allocations as $allocation) {
                $receipt->allocations()->create([
                    'invoice_id' => $allocation['invoice_id'],
                    'amount' => round((float) $allocation['amount'], 2),
                    'resolution' => $allocation['resolution'] ?? null,
                ]);

                $this->settle((int) $allocation['invoice_id']);
            }

            $this->audit->record((int) $data['agent_id'], 'receipt.recorded', 'receipt', $receipt->id, auth()->id());

            return $receipt;
        }, EnquirySequenceService::DEADLOCK_ATTEMPTS);

        return response()->json($receipt->fresh()->load('allocations'), 201);
    }

    /**
     * Post the receipt: cash up, receivable down.
     *
     * 🔒 `accounts` only, like every other posting. A short settlement resolved as a write-off or a discount posts
     * that difference to sales adjustments — the receivable really did clear, and the difference really was a cost.
     */
    public function post(int $id): JsonResponse
    {
        $this->authorize('postLedger');

        $receipt = $this->own($id);

        if ($receipt->is_posted) {
            return response()->json(['error' => 'This receipt is already posted.', 'reason' => 'already_posted'], 422);
        }

        $period = $this->ledger->openPeriodFor($receipt->agent_id, $receipt->receipt_date);

        if ($period === null) {
            return response()->json(['error' => 'No open accounting period covers this receipt date.', 'reason' => 'no_open_period'], 422);
        }

        DB::transaction(function () use ($receipt, $period) {
            $this->ledger->write(
                $this->ledger->linesForReceipt((float) $receipt->amount, ...$this->adjustment($receipt)),
                $receipt->agent_id, $period->id, $receipt->id, 'receipt'
            );

            $receipt->update(['is_posted' => true]);
            $this->audit->record($receipt->agent_id, 'receipt.posted', 'receipt', $receipt->id, auth()->id());
        });

        return response()->json($receipt->fresh());
    }

    /** The exact journal the post will write, for the confirmation accounts read before committing. */
    public function postingPreview(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');

        $receipt = $this->own($id);

        return response()->json($this->ledger->summarise(
            $this->ledger->linesForReceipt((float) $receipt->amount, ...$this->adjustment($receipt))
        ));
    }

    /** What was written off or discounted on this receipt, as the ledger service wants it. */
    private function adjustment(AccountsReceipt $receipt): array
    {
        $written = (float) $receipt->allocations()->whereNotNull('resolution')->get()
            ->sum(fn ($a) => $this->shortfall((int) $a->invoice_id));

        return $written > 0 ? [LedgerPostingService::SALES_ADJUSTMENTS, round($written, 2)] : [null, 0.0];
    }

    private function shortfall(int $invoiceId): float
    {
        $invoice = AccountsInvoice::withoutTenantScope()->find($invoiceId);

        return $invoice === null ? 0.0 : max(0.0, $invoice->outstanding());
    }

    /**
     * Re-derive what a document has been paid, from its allocations.
     *
     * 🔴 Never `increment()`. A receipt corrected or re-allocated would leave the running total carrying the old
     * figure forever; summing the allocations cannot drift.
     */
    private function settle(int $invoiceId): void
    {
        $invoice = AccountsInvoice::withoutTenantScope()->find($invoiceId);

        if ($invoice === null) {
            return;
        }

        $paid = round((float) DB::table('accounts_receipt_allocations')->where('invoice_id', $invoiceId)->sum('amount'), 2);
        $resolved = DB::table('accounts_receipt_allocations')->where('invoice_id', $invoiceId)->whereNotNull('resolution')->exists();
        $total = round((float) $invoice->grand_total, 2);

        $invoice->update([
            'amount_paid' => $paid,
            // A short payment somebody wrote off or discounted is settled; one nobody has resolved is still owed.
            'status' => match (true) {
                $paid + 0.009 >= $total, $resolved => 'paid',
                $paid > 0 => 'partially_paid',
                default => $invoice->status,
            },
        ]);
    }

    private function own(int $id): AccountsReceipt
    {
        $receipt = AccountsReceipt::withoutTenantScope()->where('id', $id)
            ->whereIn('agent_id', $this->branches()->pluck('id'))->first();

        abort_if($receipt === null, 404, 'That receipt is not one of yours.');

        return $receipt;
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
