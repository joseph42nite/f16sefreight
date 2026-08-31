<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\AccountsPurchaseItem;
use App\AccountsPurchaseVoucher;
use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * The decoupled Job Cost Sheet — PRD.md §6.7.
 *
 * ═══ 🔴 THE DECOUPLING IS THE WHOLE POINT ═══════════════════════════════════
 * Pricing must be free to adjust buy and sell figures **without corrupting IATA and
 * customs manifests**. So:
 *
 *   manifests   air_way_bills · house_way_bills · *_shipment_details
 *               official cargo weights, dimensions and carriers AS PARSED
 *   cost sheet  accounts_invoice_items (sell) · accounts_purchase_items (buy)
 *               billing lines only
 *
 * **Nothing in this controller writes to a manifest table.** Changing a rate must never
 * move a number that appears on a customs declaration — a re-quoted freight rate that
 * silently edited the declared chargeable weight would be a false declaration.
 *
 * ═══ 🔴 SALES NEVER SEES THE BUY SIDE, AT ANY TIER ══════════════════════════
 * The margin is sell − buy, so *seeing the margin is seeing the buy rate*. PRD.md §7.2
 * marks that row "❌ never" for sales. It is enforced here, server-side, by omitting the
 * keys entirely — not by hiding them in the component, because a field left out of a
 * template still arrives in the JSON.
 *
 * ═══ 🔒 PRICING CANNOT FINALIZE ITS OWN SHEET ═══════════════════════════════
 * `[Finalize]` lives on InvoiceController and is `accounts` only, at every tier. The
 * person who sets the margin never books the revenue it produces.
 */
class JobCostSheetController extends Controller
{
    /** PRD.md §6.7 — shared by both sides of the sheet. */
    public const CHARGE_TYPES = [
        'air_freight', 'ocean_freight', 'delivery_order_fee', 'customs_clearance',
        'cartage', 'terminal_handling', 'storage_demurrage', 'documentation', 'miscellaneous',
    ];

    public const CHARGE_BASES = ['per_container', 'per_cbm', 'per_bl', 'flat_rate', 'per_weight_ton'];

    public const TAX_STATUSES = ['taxable', 'exempt', 'zero_rated'];

    public function __construct(private readonly AuditLogger $audit) {}

    /**
     * The sheet for one job.
     *
     * ⚠️ A job with no invoice or voucher yet returns EMPTY SIDES, not a 404. The sheet
     * is where those documents get built; refusing to open it until one exists would
     * make it impossible to create the first line.
     */
    public function show(Job $job): JsonResponse
    {
        $this->authorize('viewCostSheet');

        $sell = $this->sellLines($job);
        $buy = $this->buyLines($job);

        $sellTotal = round($sell->sum(fn ($i) => (float) $i->net_amount), 2);
        $buyTotal = round($buy->sum(fn ($i) => (float) $i->net_amount), 2);

        $payload = [
            'job' => $job->only(['id', 'execution_job_no', 'transport_mode', 'status']),
            'sell' => [
                'lines' => $sell->map(fn ($i) => $this->sellShape($i))->values(),
                'total' => $sellTotal,
            ],
            'vocabulary' => [
                'charge_types' => self::CHARGE_TYPES,
                'charge_bases' => self::CHARGE_BASES,
                'tax_statuses' => self::TAX_STATUSES,
            ],
            'locked' => $this->isLocked($job),
        ];

        // 🔴 The buy side and the margin travel together and are OMITTED together.
        // Sales reaches this endpoint only if the gate is ever widened; the shape it
        // would get carries no buy rate at all rather than a nulled-out one.
        if (\Illuminate\Support\Facades\Gate::allows('viewMargin')) {
            $payload['buy'] = [
                'lines' => $buy->map(fn ($i) => $this->buyShape($i))->values(),
                'total' => $buyTotal,
            ];
            $payload['margin'] = $this->margin($sellTotal, $buyTotal);
        }

        return response()->json($payload);
    }

    /**
     * Add a line to either side.
     *
     * ⚠️ Creates the parent invoice or voucher on first use. A cost sheet that demanded
     * one be created elsewhere first would be a dead end on every new job.
     */
    public function storeLine(Request $request, Job $job): JsonResponse
    {
        $this->authorize('editCostSheet');

        if ($this->isLocked($job)) {
            return response()->json([
                'error'  => 'This cost sheet has been finalized and posted. Corrections need a credit note.',
                'reason' => 'locked',
            ], 422);
        }

        $data = $request->validate([
            'side'           => 'required|string|in:sell,buy',
            'charge_type'    => 'required|string|in:' . implode(',', self::CHARGE_TYPES),
            'description'    => 'required|string|max:255',
            'quantity'       => 'required|numeric|min:0',
            'rate'           => 'required|numeric|min:0',
            'charge_basis'   => 'nullable|string|in:' . implode(',', self::CHARGE_BASES),
            'tax_status'     => 'nullable|string|in:' . implode(',', self::TAX_STATUSES),
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
            'vendor_id'      => 'nullable|integer|exists:partners,id',
        ]);

        // Derived, never posted by the client: a caller that could send its own amount
        // could send one that does not equal quantity × rate, and the sheet would show
        // arithmetic that does not add up.
        $amount = round($data['quantity'] * $data['rate'], 2);
        $taxPct = (float) ($data['tax_percentage'] ?? 0);
        $tax = round($amount * $taxPct / 100, 2);

        $line = DB::transaction(function () use ($job, $data, $amount, $tax, $taxPct) {
            if ($data['side'] === 'sell') {
                return AccountsInvoiceItem::create([
                    'invoice_id'     => $this->invoiceFor($job)->id,
                    'charge_type'    => $data['charge_type'],
                    'charge_basis'   => $data['charge_basis'] ?? null,
                    'description'    => $data['description'],
                    'quantity'       => $data['quantity'],
                    'rate'           => $data['rate'],
                    'amount'         => $amount,
                    'tax_status'     => $data['tax_status'] ?? 'taxable',
                    'tax_percentage' => $taxPct,
                    'tax_amount'     => $tax,
                    'net_amount'     => round($amount + $tax, 2),
                ]);
            }

            return AccountsPurchaseItem::create([
                'purchase_voucher_id' => $this->voucherFor($job, $data['vendor_id'] ?? null)->id,
                'charge_type'    => $data['charge_type'],
                'description'    => $data['description'],
                'quantity'       => $data['quantity'],
                'rate'           => $data['rate'],
                'amount'         => $amount,
                'tax_percentage' => $taxPct,
                'tax_amount'     => $tax,
                'net_amount'     => round($amount + $tax, 2),
            ]);
        });

        $this->audit->record($job->agent_id, "costsheet.{$data['side']}_line_added", 'job', $job->id, auth()->id());

        return response()->json($this->show($job)->getData(true), 201);
    }

    /** Remove a line. Same lock, same gate. */
    public function destroyLine(Request $request, Job $job, string $side, int $lineId): JsonResponse
    {
        $this->authorize('editCostSheet');

        if (! in_array($side, ['sell', 'buy'], true)) {
            return response()->json(['error' => 'Unknown side.', 'reason' => 'bad_side'], 422);
        }

        if ($this->isLocked($job)) {
            return response()->json([
                'error'  => 'This cost sheet has been finalized and posted. Corrections need a credit note.',
                'reason' => 'locked',
            ], 422);
        }

        // Scoped through the job, so a line id from another job cannot be deleted by
        // guessing a number.
        $deleted = $side === 'sell'
            ? AccountsInvoiceItem::whereKey($lineId)
                ->whereIn('invoice_id', AccountsInvoice::withoutTenantScope()->where('job_id', $job->id)->select('id'))
                ->delete()
            : AccountsPurchaseItem::whereKey($lineId)
                ->whereIn('purchase_voucher_id', AccountsPurchaseVoucher::withoutTenantScope()->where('job_id', $job->id)->select('id'))
                ->delete();

        if ($deleted === 0) {
            return response()->json(['error' => 'That line is not on this job.', 'reason' => 'not_found'], 404);
        }

        return response()->json($this->show($job)->getData(true));
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    private function sellLines(Job $job)
    {
        return AccountsInvoiceItem::whereIn(
            'invoice_id',
            AccountsInvoice::withoutTenantScope()->where('job_id', $job->id)->select('id')
        )->get();
    }

    private function buyLines(Job $job)
    {
        return AccountsPurchaseItem::whereIn(
            'purchase_voucher_id',
            AccountsPurchaseVoucher::withoutTenantScope()->where('job_id', $job->id)->select('id')
        )->get();
    }

    /**
     * 🔴 `rate` — the BUY rate — is absent from this shape entirely. It is the one
     * number that must never reach a sales-facing response, and omitting the key is a
     * stronger guarantee than nulling it.
     */
    private function buyShape(AccountsPurchaseItem $i): array
    {
        return [
            'id' => $i->id, 'charge_type' => $i->charge_type, 'description' => $i->description,
            'quantity' => $i->quantity, 'amount' => $i->amount,
            'tax_amount' => $i->tax_amount, 'net_amount' => $i->net_amount,
        ];
    }

    private function sellShape(AccountsInvoiceItem $i): array
    {
        return [
            'id' => $i->id, 'charge_type' => $i->charge_type, 'charge_basis' => $i->charge_basis,
            'description' => $i->description, 'quantity' => $i->quantity, 'rate' => $i->rate,
            'amount' => $i->amount, 'tax_status' => $i->tax_status,
            'tax_percentage' => $i->tax_percentage, 'tax_amount' => $i->tax_amount,
            'net_amount' => $i->net_amount,
        ];
    }

    /**
     * Gross margin — PRD.md §7.2.
     *
     * 🔴 **NULL, NEVER −100%, ON AN UNBILLED JOB.** A job with no revenue yet has no
     * margin; reporting it as a total loss would corrupt every P&L roll-up that
     * averages it. "We have not billed this yet" and "we lost everything on this" are
     * opposite facts.
     */
    private function margin(float $sell, float $buy): array
    {
        return [
            'sell'    => $sell,
            'buy'     => $buy,
            'value'   => round($sell - $buy, 2),
            'percent' => $sell <= 0.0 ? null : round((($sell - $buy) / $sell) * 100, 2),
        ];
    }

    /**
     * Finalization locks the sheet — §6.7 rule 5.
     *
     * Locked once ANY invoice on the job has left draft. Before that the sheet is a
     * working document; after it, the numbers have been issued to a client.
     */
    private function isLocked(Job $job): bool
    {
        return AccountsInvoice::withoutTenantScope()
            ->where('job_id', $job->id)
            ->where('status', '!=', 'draft')
            ->exists();
    }

    private function invoiceFor(Job $job): AccountsInvoice
    {
        $draft = AccountsInvoice::withoutTenantScope()
            ->where('job_id', $job->id)->where('status', 'draft')->first();

        return $draft ?? AccountsInvoice::create([
            'agent_id' => $job->agent_id, 'job_id' => $job->id,
            'transport_mode' => $job->transport_mode, 'customer_id' => $job->customer_id,
            'created_by' => auth()->id(),
            // A PLACEHOLDER, not a number: the column is NOT NULL and UNIQUE per branch
            // (GAPS.md #27), so a draft cannot be left blank. Finalization replaces this
            // with a real sequence number — see AccountsInvoice::needsNumber().
            'invoice_no' => AccountsInvoice::placeholderNumber($job->id),
            'type' => 'invoice', 'document_date' => now()->toDateString(),
            'status' => 'draft', 'currency' => 'INR',
        ]);
    }

    private function voucherFor(Job $job, ?int $vendorId): AccountsPurchaseVoucher
    {
        $existing = AccountsPurchaseVoucher::withoutTenantScope()
            ->where('job_id', $job->id)
            ->when($vendorId !== null, fn ($q) => $q->where('vendor_id', $vendorId))
            ->first();

        if ($existing) {
            return $existing;
        }

        // A voucher needs a vendor. Falling back to the first partner would attribute a
        // cost to somebody who is not owed it, so the caller must name one.
        abort_if($vendorId === null, 422, 'A buy line needs a vendor.');

        return AccountsPurchaseVoucher::create([
            'agent_id' => $job->agent_id, 'job_id' => $job->id,
            'transport_mode' => $job->transport_mode, 'vendor_id' => $vendorId,
            'created_by' => auth()->id(),
            'voucher_no' => 'PV-' . $job->id . '-' . now()->format('YmdHis'),
            'document_date' => now()->toDateString(), 'status' => 'unpaid',
        ]);
    }
}
