<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\AccountsReceipt;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\EnquirySequenceService;
use App\Services\LedgerPostingService;
use App\Services\TdsService;
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
        private readonly TdsService $tds,
        private readonly \App\Services\ExchangeRateService $fx,
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
            'bank_accounts' => \App\BankAccount::withoutTenantScope()
                ->whereIn('agent_id', $branches->pluck('id'))->active()->orderBy('name')
                ->get(['id', 'agent_id', 'name', 'bank_name', 'last_four', 'currency', 'is_default']),
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
            // Which of our accounts it landed in. Optional: a receipt recorded before the master existed, or by
            // somebody who does not know yet, posts to the undifferentiated `1100-Bank` and says so.
            'bank_account_id' => 'nullable|integer',
            'allocations' => 'nullable|array',
            'allocations.*.invoice_id' => 'required|integer',
            'allocations.*.amount' => 'required|numeric|min:0.01',
            // 🔴 `tds` is the fourth, and the one the other three were being misused for: a client who
            // deducted tax at source has PAID IN FULL, and the difference is an asset, not a cost.
            'allocations.*.resolution' => 'nullable|in:write_off,discount,tds',
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

        foreach ($allocations as $i => $allocation) {
            $invoice = AccountsInvoice::withoutTenantScope()->find($allocation['invoice_id']);

            if ($invoice === null || ! $this->branches()->contains('id', $invoice->agent_id)) {
                return response()->json(['error' => 'One of those documents is not one of yours.', 'reason' => 'invoice_not_found'], 404);
            }

            // 🔴 The rupees placed against it, in ITS currency (GAPS #411): a USD bill is owed in dollars, and ₹84,000
            // against a USD 1,000 balance is not "₹83,000 over-allocated". No rate for the day refuses the receipt.
            $settles = $this->fx->settle($invoice, round((float) $allocation['amount'], 2), $data['receipt_date']);

            if ($settles === null) {
                return response()->json(\App\Services\ExchangeRateService::noRate($invoice->currency, $data['receipt_date']), 422);
            }

            if ($settles['invoice_amount'] > $invoice->outstanding() + 0.009) {
                return response()->json([
                    'error' => sprintf('%s has only %s %s outstanding; you have placed %s %s against it.',
                        $invoice->invoice_no, $invoice->currency ?: 'INR', number_format($invoice->outstanding(), 2),
                        $invoice->currency ?: 'INR', number_format($settles['invoice_amount'], 2)),
                    'reason' => 'over_allocated_invoice',
                ], 422);
            }

            $allocations[$i]['settles'] = $settles;
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
                'bank_account_id' => $this->bankAccount($data['bank_account_id'] ?? null)?->id,
                'narration' => $data['narration'] ?? null,
                'created_by' => auth()->id(),
            ]);

            foreach ($allocations as $allocation) {
                $foreign = $allocation['settles']['rate'] !== 1.0;
                $receipt->allocations()->create([
                    'invoice_id' => $allocation['invoice_id'],
                    'amount' => round((float) $allocation['amount'], 2),
                    // Left NULL for rupees: `amount` IS the invoice amount then.
                    'invoice_amount' => $foreign ? $allocation['settles']['invoice_amount'] : null,
                    'exchange_rate' => $foreign ? $allocation['settles']['rate'] : null,
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
                $this->ledger->linesForReceipt((float) $receipt->amount, $this->adjustments($receipt),
                    into: $this->bankAccount($receipt->bank_account_id), forex: $this->forex($receipt)),
                $receipt->agent_id, $period->id, $receipt->id, 'receipt'
            );

            $this->recordTds($receipt);

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
            $this->ledger->linesForReceipt((float) $receipt->amount, $this->adjustments($receipt),
                into: $this->bankAccount($receipt->bank_account_id), forex: $this->forex($receipt))
        ));
    }

    /**
     * Where each resolved shortfall goes — one leg per resolution.
     *
     * 🔴 **This ignored the resolution entirely and sent everything to Sales Adjustments.** A write-off is an
     * expense we absorbed (`5100-Bank-Charges`); a discount is revenue we gave up (`4900-Sales-Adjustments`);
     * they belong in different halves of the P&L, and `BankReconciliationService::adjustmentAccountFor()` had
     * said so since the beginning — this path just never asked it. The bank-matching path did, so the same
     * write-off posted to two different accounts depending on which screen closed it.
     *
     * 🔴 And TDS is the one that made it urgent: sent to Sales Adjustments it would have reduced revenue by
     * tax we are entitled to reclaim, losing the money twice.
     *
     * @return list<array{account: array, amount: float}>
     */
    private function adjustments(AccountsReceipt $receipt): array
    {
        $legs = [];

        foreach ($receipt->allocations()->whereNotNull('resolution')->get() as $allocation) {
            $shortfall = $this->shortfall((int) $allocation->invoice_id);

            if ($shortfall <= 0.0) {
                continue;
            }

            $account = match ($allocation->resolution) {
                'tds' => TdsService::RECEIVABLE,
                'write_off' => LedgerPostingService::BANK_CHARGES,
                default => LedgerPostingService::SALES_ADJUSTMENTS,
            };

            // In rupees at the invoice's own rate: the part written off was never received, so it carries no exchange.
            $invoice = AccountsInvoice::withoutTenantScope()->find($allocation->invoice_id);
            $legs[] = ['account' => $account, 'amount' => $this->fx->booked($invoice, $shortfall), 'resolution' => $allocation->resolution,
                       'invoice_id' => (int) $allocation->invoice_id];
        }

        return $legs;
    }

    /** The register row for every invoice on this receipt that a client settled net of TDS. */
    private function recordTds(AccountsReceipt $receipt): void
    {
        foreach ($this->adjustments($receipt) as $leg) {
            if ($leg['resolution'] !== 'tds') {
                continue;
            }

            $invoice = AccountsInvoice::withoutTenantScope()->find($leg['invoice_id']);

            if ($invoice !== null) {
                // ⚠️ Inside the post's transaction, so the register and the ledger can never disagree about
                // what was deducted: either both rows exist or neither does.
                $this->tds->recordInward($invoice, $leg['amount'], 'receipt', (int) $receipt->id,
                    $receipt->receipt_date instanceof \DateTimeInterface
                        ? $receipt->receipt_date->format('Y-m-d')
                        : (string) $receipt->receipt_date);
            }
        }
    }

    /**
     * Realised exchange on this receipt: rupees received against foreign invoices less what those invoices were
     * booked at (GAPS #411). Signed — positive is a gain. Nothing on a rupee allocation, whose `invoice_amount` is NULL.
     */
    private function forex(AccountsReceipt $receipt): float
    {
        return round((float) DB::table('accounts_receipt_allocations as a')
            ->join('accounts_invoices as i', 'i.id', '=', 'a.invoice_id')
            ->where('a.receipt_id', $receipt->id)->whereNotNull('a.invoice_amount')
            ->sum(DB::raw('a.amount - ROUND(a.invoice_amount * i.exchange_rate, 2)')), 2);
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

        // In the invoice's own currency: what each allocation SETTLED, not the rupees that arrived (GAPS #411).
        $paid = round((float) DB::table('accounts_receipt_allocations')->where('invoice_id', $invoiceId)
            ->sum(DB::raw('COALESCE(invoice_amount, amount)')), 2);
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

    /** One of OUR bank accounts, or none — never another company's. */
    private function bankAccount(?int $id): ?\App\BankAccount
    {
        return $id === null ? null : \App\BankAccount::withoutTenantScope()->where('id', $id)
            ->whereIn('agent_id', $this->branches()->pluck('id'))->first();
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
