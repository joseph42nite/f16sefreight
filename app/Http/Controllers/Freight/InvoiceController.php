<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\Customer;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\CreditGateService;
use App\Services\EnquirySequenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Invoices — guide §5.3.
 *
 * 🔒 **Two abilities, two roles, and the separation is the point.** Pricing edits the
 * cost sheet; ONLY accounts finalizes and posts. The person who sets the margin never
 * books the revenue. `postLedger` and `managePeriod` exclude even the Boss — the guide
 * calls this the single most likely permission to get wrongly widened.
 */
class InvoiceController extends Controller
{
    public function __construct(
        private readonly CreditGateService $credit,
        private readonly EnquirySequenceService $sequences,
        private readonly AuditLogger $audit,
    ) {}

    /** The AR register. Read-only for boss, full for accounts. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $invoices = AccountsInvoice::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->boolean('outstanding'), fn ($q) => $q->outstanding())
            ->with('customer:id,name,email_domain')
            ->latest('document_date')
            ->paginate(50);

        return response()->json($invoices);
    }

    /**
     * Draft -> finalized. The number is minted HERE, not at draft.
     *
     * 🔴 **The credit gate runs before the number is issued.** Numbers are never
     * recycled, so minting one for an invoice the gate then rejects would burn it
     * permanently and leave a hole in the sequence a GST auditor will ask about.
     *
     * ⚠️ **`422` on breach, aborting the whole transaction.** Never a warning the UI can
     * dismiss — this is the check that stops cargo moving for a client who cannot pay.
     */
    public function finalize(Request $request, AccountsInvoice $invoice): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        if ($invoice->status !== 'draft') {
            return response()->json([
                'error'  => 'Only a draft invoice can be finalized.',
                'reason' => 'not_draft',
                'status' => $invoice->status,
            ], 422);
        }

        // Recompute from the lines rather than trusting the stored header: a line edited
        // after the header was last written would otherwise finalize at a stale total.
        $subtotal = (float) $invoice->items()->sum('amount');
        $tax = (float) $invoice->items()->sum('tax_amount');
        $grandTotal = round($subtotal + $tax, 2);

        if ($invoice->customer_id !== null) {
            $customer = Customer::withoutTenantScope()->find($invoice->customer_id);
            $check = $this->credit->check($customer, $grandTotal);

            if ($check['blocked']) {
                return response()->json([
                    'error'  => sprintf(
                        'Finalizing this invoice would put %s at %s against a limit of %s.',
                        $customer->name,
                        number_format($check['projected'], 2),
                        number_format($check['limit'], 2)
                    ),
                    'reason' => 'credit_limit_exceeded',
                    'credit' => $check,
                ], 422);
            }
        }

        DB::transaction(function () use ($invoice, $subtotal, $tax, $grandTotal) {
            $invoice->update([
                'invoice_no'  => $invoice->invoice_no ?: $this->sequences->next($invoice->agent_id, 'INV'),
                'subtotal'    => $subtotal,
                'tax_amount'  => $tax,
                'grand_total' => $grandTotal,
                'status'      => 'finalized',
            ]);

            $this->audit->record($invoice->agent_id, 'invoice.finalized', 'invoice', $invoice->id, auth()->id());
        });

        return response()->json($invoice->fresh());
    }

    /**
     * Write the balanced journal and mark the invoice posted. See journalLines() for
     * the accounts — notably that GST is credited to a LIABILITY, not to revenue.
     *
     * 🔒 **`accounts` only — not even the Boss.** The role that sets targets must not
     * book the revenue those targets are measured in.
     *
     * ⚠️ Posting is IRREVERSIBLE in the product's terms: a posted invoice cannot be
     * cancelled with its job, only voided or credited. That is why it is a separate
     * action from finalization rather than a side effect of it.
     */
    public function post(AccountsInvoice $invoice): JsonResponse
    {
        $this->authorize('postLedger');

        if ($invoice->status === 'draft') {
            return response()->json([
                'error'  => 'Finalize the invoice before posting it.',
                'reason' => 'not_finalized',
            ], 422);
        }

        if ($invoice->is_posted) {
            return response()->json([
                'error'  => 'This invoice is already posted.',
                'reason' => 'already_posted',
            ], 422);
        }

        $period = DB::table('accounting_periods')
            ->where('agent_id', $invoice->agent_id)
            ->where('status', 'open')
            ->whereDate('start_date', '<=', $invoice->document_date)
            ->whereDate('end_date', '>=', $invoice->document_date)
            ->first();

        if ($period === null) {
            return response()->json([
                'error'  => 'No open accounting period covers this document date.',
                'reason' => 'no_open_period',
            ], 422);
        }

        DB::transaction(function () use ($invoice, $period) {
            foreach ($this->journalLines($invoice) as $line) {
                DB::table('accounts_ledger_entries')->insert([
                    'agent_id'             => $invoice->agent_id,
                    'chart_of_account_id'  => $this->accountId($invoice->agent_id, $line['code'], $line['name']),
                    'accounting_period_id' => $period->id,
                    'posting_date'         => now()->toDateString(),
                    'debit_amount'         => $line['debit'],
                    'credit_amount'        => $line['credit'],
                    'source_id'            => $invoice->id,
                    'source_type'          => 'invoice', // morph key, never a class name
                    'created_at'           => now(),
                    'updated_at'           => now(),
                ]);
            }

            $invoice->update(['is_posted' => true]);

            DB::table('unposted_transactions_queue')
                ->where('source_type', 'invoice')->where('source_id', $invoice->id)->delete();

            $this->audit->record($invoice->agent_id, 'invoice.posted', 'invoice', $invoice->id, auth()->id());
        });

        return response()->json($invoice->fresh());
    }

    /** The client's current exposure, plus the group roll-up for display. */
    public function creditStanding(Customer $customer): JsonResponse
    {
        $this->authorize('viewFinancials');

        return response()->json([
            'customer' => $customer->only(['id', 'name', 'email_domain', 'credit_limit']),
            'branch'   => $this->credit->check($customer),
            // Displayed, never enforced on — see CreditGateService.
            'group'    => $this->credit->groupExposure($customer),
        ]);
    }

    /**
     * The exact journal the post WILL write — so the confirmation the accountant reads
     * is the server's own computation, not the UI's guess at it.
     *
     * 🔴 A preview derived client-side can drift from the posting code and still look
     * right. ui_ux_guide §9.6 requires the lines to be shown before commit; showing
     * lines that are not the ones written would be a lie in the one dialog that must
     * never contain one.
     */
    public function postingPreview(AccountsInvoice $invoice): JsonResponse
    {
        $this->authorize('viewFinancials');

        $lines = $this->journalLines($invoice);

        return response()->json([
            'lines'    => $lines,
            'debits'   => round(array_sum(array_column($lines, 'debit')), 2),
            'credits'  => round(array_sum(array_column($lines, 'credit')), 2),
            'balanced' => round(array_sum(array_column($lines, 'debit')), 2)
                       === round(array_sum(array_column($lines, 'credit')), 2),
        ]);
    }

    /**
     * The journal for one invoice — PRD.md §12 (Sales invoice):
     *
     *   Dr  1200-AR                grand total
     *   Cr  4000-Freight-Revenue   subtotal
     *   Cr  2200-GST-Output        tax
     *
     * 🔴 **GST IS A LIABILITY, NOT REVENUE.** Tax collected on behalf of the government
     * is owed to it. Crediting the grand total to revenue — which this method used to
     * do — overstates revenue by the tax and leaves the GST liability at zero, so the
     * P&L, the balance sheet and the GST register all disagree with the invoice. The
     * ledger still balanced, which is exactly why the balance assertion did not catch
     * it: a wrong-account posting balances just as well as a right one.
     *
     * The GST line is OMITTED when tax is zero rather than written as 0.00 — an export
     * invoice has no output tax at all, and a zero row in the GST register is a filing
     * claim we did not mean to make.
     *
     * @return list<array{code: string, name: string, debit: float, credit: float}>
     */
    private function journalLines(AccountsInvoice $invoice): array
    {
        $subtotal = round((float) $invoice->subtotal, 2);
        $tax = round((float) $invoice->tax_amount, 2);
        $total = round((float) $invoice->grand_total, 2);

        $lines = [
            ['code' => '1200-AR', 'name' => 'Accounts Receivable', 'debit' => $total, 'credit' => 0.0],
            ['code' => '4000-Freight-Revenue', 'name' => 'Freight Revenue', 'debit' => 0.0, 'credit' => $subtotal],
        ];

        if ($tax > 0) {
            $lines[] = ['code' => '2200-GST-Output', 'name' => 'GST Output', 'debit' => 0.0, 'credit' => $tax];
        }

        return $lines;
    }

    /**
     * Resolve one account, creating it on first use so posting is never blocked by
     * missing setup. A real chart is configured in /settings/finance by accounts.
     */
    private function accountId(int $agentId, string $code, string $name): int
    {
        $id = DB::table('chart_of_accounts')
            ->where('agent_id', $agentId)->where('account_code', $code)->value('id');

        return $id ?: DB::table('chart_of_accounts')->insertGetId([
            'agent_id' => $agentId, 'account_code' => $code, 'account_name' => $name,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
}
