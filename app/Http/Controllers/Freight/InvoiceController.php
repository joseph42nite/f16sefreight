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
            // Cost sheets pricing has handed over and nobody has billed yet (user, 2026-09-18).
            ->when($request->boolean('awaiting'), fn ($q) => $q->whereNotNull('sent_to_accounts_at')->where('status', 'draft'))
            ->with('customer:id,name,email_domain')
            ->latest('document_date')
            ->paginate(50);

        // What each document is worth, and what the shipment cost — the figures accounts decide on.
        $invoices->getCollection()->transform(function (AccountsInvoice $invoice) {
            $sell = (float) $invoice->items()->sum('net_amount');

            // 🔴 General billing has no shipment, so no cost side and no margin — NULL, never the whole sale shown
            // as 100% margin, which is what a cost lookup on a NULL job would have produced.
            if ($invoice->isGeneral()) {
                return array_merge($invoice->toArray(), [
                    'job_no' => null, 'general' => true, 'sell_total' => round($sell, 2), 'buy_total' => null,
                    'margin' => null, 'sent_to_accounts_at' => $invoice->sent_to_accounts_at,
                    'sent_to_accounts_by' => DB::table('users')->where('id', $invoice->sent_to_accounts_by)->value('name'),
                ]);
            }

            $buy = (float) DB::table('accounts_purchase_items as i')
                ->join('accounts_purchase_vouchers as v', 'v.id', '=', 'i.purchase_voucher_id')
                ->where('v.job_id', $invoice->job_id)->sum('i.net_amount');

            // array_merge, never `+`: with `+` the model's own `sent_to_accounts_by` (an id) would win over the name.
            return array_merge($invoice->toArray(), [
                'job_no' => DB::table('jobs')->where('id', $invoice->job_id)->value('execution_job_no'),
                'sell_total' => round($sell, 2),
                'buy_total' => round($buy, 2),
                'margin' => $sell > 0 ? round($sell - $buy, 2) : null,
                'sent_to_accounts_at' => $invoice->sent_to_accounts_at,
                'sent_to_accounts_by' => DB::table('users')->where('id', $invoice->sent_to_accounts_by)->value('name'),
            ]);
        });

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

        $override = $request->validate([
            // 🔴 An override needs a REASON, always. "Why was this shipment released over the limit?" is the
            // question somebody asks months later, and an override with no answer to it is indistinguishable
            // from somebody clicking through a warning.
            'override_credit_hold' => 'nullable|boolean',
            'override_reason' => 'required_if:override_credit_hold,true,1|nullable|string|max:255',
        ]);

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
                $wanted = (bool) ($override['override_credit_hold'] ?? false);

                // 🔒 Overriding is its OWN ability (PRD §251), separate from finalizing: the person who bills
                // every day is not automatically the person who decides to ship on credit that is already spent.
                if (! $wanted || ! \Illuminate\Support\Facades\Gate::allows('overrideCreditHold')) {
                    return response()->json([
                        'error'  => sprintf(
                            'Finalizing this invoice would put %s at %s against a limit of %s.',
                            $customer->name,
                            number_format($check['projected'], 2),
                            number_format($check['limit'], 2)
                        ),
                        'reason' => 'credit_limit_exceeded',
                        'credit' => $check,
                        // ⚠️ Said plainly, so the desk is not left guessing whether there is a way through.
                        'can_override' => \Illuminate\Support\Facades\Gate::allows('overrideCreditHold'),
                        'override_hint' => 'Finalize again with a reason to issue it over the limit.',
                    ], 422);
                }

                // Recorded on the document itself — see the migration's docblock.
                $invoice->forceFill([
                    'credit_override_reason' => $override['override_reason'],
                    'credit_override_by' => auth()->id(),
                    'credit_override_at' => now(),
                ])->save();

                $this->audit->record($invoice->agent_id, 'invoice.credit_hold_overridden',
                    'invoice', $invoice->id, auth()->id());
            }
        }

        // 🔴 A credit note may never give back more than the invoice was worth. Checked HERE, against what the
        // other notes have already credited, because lines can be edited after the note was created (PRD §6.2).
        if ($invoice->type === 'credit_note' && $invoice->parent_invoice_id !== null) {
            $room = $this->creditRoom($invoice);

            if ($grandTotal > $room + 0.009) {
                return response()->json([
                    'error' => sprintf('This invoice has only %s left to credit; this note is for %s.',
                        number_format($room, 2), number_format($grandTotal, 2)),
                    'reason' => 'exceeds_parent_invoice',
                    'room' => $room,
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
                // Each document type has its own counter and prefix — INV, DN, CN, BRK, CSINV (PRD §6.3).
                'invoice_no'  => $invoice->needsNumber()
                    ? $this->sequences->next($invoice->agent_id, \App\Support\BillingDocuments::prefix($invoice->type))
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

    /** What is still creditable against a note's parent invoice: its total, less every other note already raised. */
    private function creditRoom(AccountsInvoice $note): float
    {
        $parent = AccountsInvoice::withoutTenantScope()->find($note->parent_invoice_id);

        if ($parent === null) {
            return 0.0;
        }

        $credited = (float) AccountsInvoice::withoutTenantScope()
            ->where('parent_invoice_id', $parent->id)->where('type', 'credit_note')
            ->where('id', '!=', $note->id)->whereNotIn('status', ['draft', 'void'])
            ->sum('grand_total');

        return round((float) $parent->grand_total - $credited, 2);
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
     *
     * 🔴 Public, and called from `AccountsRegressionSeeder`/`BillingDemoSeeder` too (2026-09-26) — both
     * post through `LedgerPostingService::write()` directly rather than this controller's own `post()`,
     * which is the one place this used to run. Found by checking the Financials → GST register screen
     * against a freshly reseeded demo: `gst_ledger_entries` had zero rows anywhere in the system, because
     * every seeded invoice reached the ledger by a shortcut that never called this. The return itself was
     * unaffected — `GstReturnService` derives from documents, never from this table — but the one screen
     * built to show this register, and the ledger-vs-register cross-check both rely on, had nothing to show.
     */
    public function writeGstRegister(AccountsInvoice $invoice): void
    {
        $tax = round((float) $invoice->tax_amount, 2);

        // ⚠️ The BILLED PARTY, not the customer. A brokerage or consol invoice is billed
        // to a PARTNER and carries no `customer_id` at all (PRD §6.2), so reading only
        // that column left every one of them with no counterparty, undeterminable, and
        // absent from the register even when the partner was registered. Same resolution
        // as `GstReturnService`, or the register and the return disagree by construction.
        $counterparty = match ($invoice->billed_party_type) {
            'partner' => \App\Partner::withoutGlobalScopes()->find($invoice->billed_party_id)?->gst_no,
            default => $invoice->customer_id !== null
                ? Customer::withoutTenantScope()->find($invoice->customer_id)?->gst_no
                : null,
        };

        // 🟢 Our own GSTIN — `agents_info.gst_no`, which landed 2026-09-22 and closed GAPS #36. Until then
        // this was behind a `Schema::hasColumn` guard and always NULL, so `GstSplitService` reported
        // `supplier_gstin_missing` and NOT ONE ROW was ever written here. Set it per branch in
        // Settings → Finance; still NULL for a branch that has not, which refuses rather than guesses.
        $supplier = DB::table('agents_info')->where('id', $invoice->agent_id)->value('gst_no');

        $split = $this->gst->split($tax, $counterparty, $supplier);

        $this->ledger->writeGstRegisterRow($invoice->agent_id, 'invoice', $invoice->id, $split);
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
