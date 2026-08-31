<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\Customer;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\CreditGateService;
use App\Services\EnquirySequenceService;
use App\Services\LedgerPostingService;
use App\Services\GstSplitService;
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
        private readonly LedgerPostingService $ledger,
        private readonly GstSplitService $gst,
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
            // ⚠️ Re-read before deciding. This closure is REPLAYED on a deadlock, and the
            // failed attempt left its rolled-back values on the model in memory — without
            // this, a retry would keep a number whose reservation was rolled back with it.
            $invoice->refresh();

            $invoice->update([
                // 🔴 NOT `?:`. A draft's placeholder is truthy, so `?:` kept it and the
                // invoice was issued to the client numbered `DRAFT-…` — the sequence
                // service was never called for INV at all. Caught by
                // InvoiceFinalizeTest; see AccountsInvoice::DRAFT_NUMBER_PREFIX.
                'invoice_no'  => $invoice->needsNumber()
                    ? $this->sequences->next($invoice->agent_id, 'INV')
                    : $invoice->invoice_no,
                'subtotal'    => $subtotal,
                'tax_amount'  => $tax,
                'grand_total' => $grandTotal,
                'status'      => 'finalized',
            ]);

            $this->audit->record($invoice->agent_id, 'invoice.finalized', 'invoice', $invoice->id, auth()->id());
        }, EnquirySequenceService::DEADLOCK_ATTEMPTS);

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

        $period = $this->ledger->openPeriodFor($invoice->agent_id, $invoice->document_date);

        if ($period === null) {
            return response()->json([
                'error'  => 'No open accounting period covers this document date.',
                'reason' => 'no_open_period',
            ], 422);
        }

        DB::transaction(function () use ($invoice, $period) {
            $this->ledger->write(
                $this->ledger->linesForInvoice($invoice),
                $invoice->agent_id, $period->id, $invoice->id, 'invoice'
            );

            $this->writeGstRegister($invoice);

            $invoice->update(['is_posted' => true]);

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
     * The GST register row — PRD.md §7, for GSTR-1.
     *
     * 🔴 **WRITTEN ONLY WHEN THE SPLIT IS DETERMINABLE.** CGST+SGST and IGST total the
     * same amount, so an undeterminable split does not affect what the client is billed
     * — but filing it under the wrong heads means the customer cannot claim the input
     * credit they actually paid. A row is better absent from the register (visible, and
     * fixable before filing) than present and wrong (invisible until they complain).
     *
     * The blocker is that our own GSTIN has no column anywhere in the schema — see
     * GstSplitService and GAPS.md #36.
     */
    private function writeGstRegister(AccountsInvoice $invoice): void
    {
        $tax = round((float) $invoice->tax_amount, 2);

        $counterparty = $invoice->customer_id !== null
            ? Customer::withoutTenantScope()->find($invoice->customer_id)?->gst_no
            : null;

        // 🔴 THE COLUMN DOES NOT EXIST YET (GAPS #36). Guarded rather than assumed, so
        // this code is ready the day `agents_info.gst_no` lands and returns NULL —
        // which `GstSplitService` reports as `supplier_gstin_missing` — until then.
        // Querying it unguarded is exactly the mistake this gap describes, and it took
        // down six unrelated tests with a 500.
        $supplier = \Illuminate\Support\Facades\Schema::hasColumn('agents_info', 'gst_no')
            ? DB::table('agents_info')->where('id', $invoice->agent_id)->value('gst_no')
            : null;

        $split = $this->gst->split($tax, $counterparty, $supplier);

        if (! $split['determinable'] || $split['kind'] === 'none') {
            return;
        }

        $companyId = DB::table('agents_info')->where('id', $invoice->agent_id)->value('company_id');

        DB::table('gst_ledger_entries')->insert([
            'agent_id'     => $invoice->agent_id,
            // GSTR-1 is filed per GSTIN, which is a COMPANY concept — the ledger stays
            // per branch. Both columns exist precisely because they differ.
            'company_id'   => $companyId,
            'voucher_id'   => $invoice->id,
            'voucher_type' => 'invoice',
            'cgst_amount'  => $split['cgst'],
            'sgst_amount'  => $split['sgst'],
            'igst_amount'  => $split['igst'],
            'created_at'   => now(), 'updated_at' => now(),
        ]);
    }

    /**
     * The exact journal the post WILL write — so the confirmation the accountant reads
     * is the server's own computation, not the UI's guess at it.
     *
     * 🔴 A preview derived client-side can drift from the posting code and still look
     * right. ui_ux_guide §9.6 requires the lines to be shown before commit; showing
     * lines that are not the ones written would be a lie in the one dialog that must
     * never contain one. Sharing LedgerPostingService is what makes that guarantee
     * structural rather than a promise to keep two methods in step.
     */
    public function postingPreview(AccountsInvoice $invoice): JsonResponse
    {
        $this->authorize('viewFinancials');

        return response()->json(
            $this->ledger->summarise($this->ledger->linesForInvoice($invoice))
        );
    }
}
