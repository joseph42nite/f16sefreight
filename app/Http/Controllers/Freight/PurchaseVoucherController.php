<?php

namespace App\Http\Controllers\Freight;

use App\AccountsPurchaseVoucher;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\GstSplitService;
use App\Services\LedgerPostingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Purchase vouchers — the BUY side. Guide §5.3.
 *
 * 🔴 **`accounts_purchase_items.rate` IS THE BUY RATE AND MUST NEVER REACH A
 * SALES-FACING RESPONSE, AT ANY TIER.** One of the product's load-bearing rules. It is
 * stripped HERE, server-side, not hidden in a Vue component: a field omitted from the
 * template still arrives in the JSON, and the browser devtools are one keystroke away.
 * This controller is `accounts`-only, so nothing sales-facing reaches it — but the
 * stripping lives in the resource shaping below so that stays true if the gate is ever
 * widened.
 *
 * ⚠️ A voucher has NO header totals in the schema. `accounts_purchase_vouchers` carries
 * status and dates only, so every figure is summed from the items. That is not a
 * defensive recomputation — it is the only source there is.
 */
class PurchaseVoucherController extends Controller
{
    public function __construct(
        private readonly LedgerPostingService $ledger,
        private readonly GstSplitService $gst,
        private readonly AuditLogger $audit,
    ) {}

    /** The AP register. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $vouchers = AccountsPurchaseVoucher::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('job_id'), fn ($q) => $q->where('job_id', $request->integer('job_id')))
            ->with(['vendor:id,name,partner_type', 'items'])
            ->latest('document_date')
            ->paginate(50);

        $vouchers->getCollection()->transform(fn ($v) => $this->shape($v));

        return response()->json($vouchers);
    }

    /**
     * Post the voucher to the ledger.
     *
     * 🔒 `accounts` only — not even the Boss, exactly as on the sell side. Segregation
     * of duties is not a sell-side-only concept: the role that approves a vendor bill
     * must not also be the role that books it.
     */
    public function post(AccountsPurchaseVoucher $voucher): JsonResponse
    {
        $this->authorize('postLedger');

        if ($voucher->status === 'void') {
            return response()->json([
                'error'  => 'A void voucher cannot be posted.',
                'reason' => 'voucher_void',
            ], 422);
        }

        if ($this->isPosted($voucher)) {
            return response()->json([
                'error'  => 'This voucher is already posted.',
                'reason' => 'already_posted',
            ], 422);
        }

        // A voucher with no lines has nothing to post, and would produce a 0.00 journal
        // that balances trivially while asserting a liability of nothing.
        if ($voucher->items()->count() === 0) {
            return response()->json([
                'error'  => 'This voucher has no cost lines to post.',
                'reason' => 'no_items',
            ], 422);
        }

        $period = $this->ledger->openPeriodFor($voucher->agent_id, $voucher->document_date);

        if ($period === null) {
            return response()->json([
                'error'  => 'No open accounting period covers this document date.',
                'reason' => 'no_open_period',
            ], 422);
        }

        DB::transaction(function () use ($voucher, $period) {
            $this->ledger->write(
                $this->ledger->linesForVoucher($voucher),
                $voucher->agent_id, $period->id, $voucher->id, 'purchase_voucher'
            );

            $this->writeGstRegister($voucher);

            $this->audit->record($voucher->agent_id, 'voucher.posted', 'purchase_voucher', $voucher->id, auth()->id());
        });

        return response()->json($this->shape($voucher->fresh(['vendor', 'items'])));
    }

    /**
     * The GST register row — the buy-side mirror of `InvoiceController::writeGstRegister`, and public for
     * the same reason (2026-09-26, GAPS #396): this used to not exist at all — 3B's ITC is computed from
     * vouchers directly so the filed figure was already right, but the register was outward-only, and the
     * decision on checking was to complete it rather than leave it one-sided.
     *
     * 🔴 **The roles are reversed from the sell side.** The vendor is the one issuing us a tax invoice, so
     * THEY are the supplier and WE are the counterparty — the opposite of `InvoiceController`, where we bill
     * and the customer is the counterparty. `GstSplitService::split()` only compares two state codes, so
     * which argument is named "supplier" doesn't change the arithmetic, but keeping OUR OWN GSTIN in that
     * slot on both sides keeps `supplier_gstin_missing` meaning the same thing — ours absent — everywhere it
     * is raised, rather than flipping meaning between the two document types.
     */
    public function writeGstRegister(AccountsPurchaseVoucher $voucher): void
    {
        $tax = round((float) $voucher->items->sum('tax_amount'), 2);
        $vendorGstin = $voucher->vendor?->gst_no;
        $ourGstin = DB::table('agents_info')->where('id', $voucher->agent_id)->value('gst_no');

        $split = $this->gst->split($tax, $vendorGstin, $ourGstin);

        $this->ledger->writeGstRegisterRow($voucher->agent_id, 'purchase_voucher', $voucher->id, $split);
    }

    /** The journal this posting writes — the same lines, from the same method. */
    public function postingPreview(AccountsPurchaseVoucher $voucher): JsonResponse
    {
        $this->authorize('viewFinancials');

        return response()->json(
            $this->ledger->summarise($this->ledger->linesForVoucher($voucher))
        );
    }

    /**
     * 🔴 **`is_posted` IS DERIVED, NOT STORED.** `accounts_purchase_vouchers` has no
     * such column — unlike invoices, which do. Reading it from the ledger means the
     * answer cannot drift from the ledger it describes, which a duplicated boolean
     * eventually does.
     */
    private function isPosted(AccountsPurchaseVoucher $voucher): bool
    {
        return DB::table('accounts_ledger_entries')
            ->where('source_type', 'purchase_voucher')
            ->where('source_id', $voucher->id)
            ->exists();
    }

    /**
     * Shape one voucher for the wire.
     *
     * 🔴 THE BUY RATE IS REMOVED HERE. `amount` (the line total) stays, because the
     * cost side of the margin is exactly what accounts and the Boss are looking at;
     * `rate` — what we pay per unit, the number a customer must never see quoted back
     * at them — does not.
     */
    private function shape(AccountsPurchaseVoucher $voucher): array
    {
        $items = $voucher->items->map(fn ($i) => [
            'id'           => $i->id,
            'charge_type'  => $i->charge_type,
            'description'  => $i->description,
            'quantity'     => $i->quantity,
            'amount'       => $i->amount,
            'tax_amount'   => $i->tax_amount,
            'net_amount'   => $i->net_amount,
            'hsn_sac_code' => $i->hsn_sac_code,
            // 'rate' is deliberately absent. See the class docblock.
        ]);

        return [
            'id'             => $voucher->id,
            'voucher_no'     => $voucher->voucher_no,
            'job_id'         => $voucher->job_id,
            'transport_mode' => $voucher->transport_mode,
            'document_date'  => $voucher->document_date,
            'status'         => $voucher->status,
            'vendor'         => $voucher->vendor ? $voucher->vendor->only(['id', 'name', 'partner_type']) : null,
            'net_amount'     => round((float) $voucher->items->sum('amount'), 2),
            'tax_amount'     => round((float) $voucher->items->sum('tax_amount'), 2),
            'gross_amount'   => round((float) $voucher->items->sum('amount') + (float) $voucher->items->sum('tax_amount'), 2),
            'is_posted'      => $this->isPosted($voucher),
            'items'          => $items,
        ];
    }
}
