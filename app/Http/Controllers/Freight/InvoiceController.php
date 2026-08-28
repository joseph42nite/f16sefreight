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
     * Write the balanced double-entry pair and mark the invoice posted.
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
            $accounts = $this->resolveAccounts($invoice->agent_id);

            // A BALANCED PAIR. The balance itself is a service-layer invariant — no
            // database constraint can express "these two rows sum to zero".
            foreach ([
                [$accounts['receivable'], $invoice->grand_total, 0],
                [$accounts['revenue'], 0, $invoice->grand_total],
            ] as [$accountId, $debit, $credit]) {
                DB::table('accounts_ledger_entries')->insert([
                    'agent_id'             => $invoice->agent_id,
                    'chart_of_account_id'  => $accountId,
                    'accounting_period_id' => $period->id,
                    'posting_date'         => now()->toDateString(),
                    'debit_amount'         => $debit,
                    'credit_amount'        => $credit,
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
     * Minimal chart of accounts, created on first use so posting is never blocked by
     * missing setup. A real chart is configured in /settings/finance by accounts.
     */
    private function resolveAccounts(int $agentId): array
    {
        $find = function (string $code, string $name) use ($agentId) {
            $id = DB::table('chart_of_accounts')
                ->where('agent_id', $agentId)->where('account_code', $code)->value('id');

            return $id ?: DB::table('chart_of_accounts')->insertGetId([
                'agent_id' => $agentId, 'account_code' => $code, 'account_name' => $name,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        };

        return [
            'receivable' => $find('1200-AR', 'Accounts Receivable'),
            'revenue'    => $find('4000-REV', 'Freight Revenue'),
        ];
    }
}
