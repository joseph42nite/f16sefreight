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

    public function __construct(
        private readonly AuditLogger $audit,
        private readonly \App\Services\EnquirySequenceService $sequences,
    ) {}

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
            // Where the sell lines come from, so an empty sheet says what to do (user, 2026-09-18).
            'from_waybill' => $this->waybillState($job),
            // The carrier the AWB prefix names — the vendor a buy line takes by default.
            'awb_airline' => $this->airlineOf($job),
            // Pricing's hand-over to accounts: when it was sent, and by whom.
            'sent_to_accounts' => $this->sentState($job),
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

        // 🔴 Billing locks the sheet — but a supplier invoice routinely arrives AFTER the shipment is billed, and a
        // billed shipment with no cost reads as pure profit. So once billed (user, 2026-09-26): the sell side stays
        // locked (corrections are a credit note), and ACCOUNTS may still ADD a cost — never change or remove one.
        // That is the Money out ① "Cost to book" queue. Pricing's sheet stays locked after billing, as before.
        $late = $this->isLocked($job);

        if ($late && ! ($data['side'] === 'buy' && \Illuminate\Support\Facades\Gate::allows('bookLateCost'))) {
            return response()->json([
                'error'  => 'This cost sheet has been finalized and posted. Corrections need a credit note.',
                'reason' => 'locked',
            ], 422);
        }

        // Derived, never posted by the client: a caller that could send its own amount
        // could send one that does not equal quantity × rate, and the sheet would show
        // arithmetic that does not add up.
        $amount = round($data['quantity'] * $data['rate'], 2);
        $taxPct = (float) ($data['tax_percentage'] ?? 0);
        $tax = round($amount * $taxPct / 100, 2);

        // 🔴 The airline is not a partner anybody types in: the AWB's first three digits ARE the carrier (user,
        // 2026-09-18: "we have an airline table — you will get to know from the 3 letter code of the AWB number which
        // airline it is"). A buy line with no vendor takes the airline off the waybill.
        if ($data['side'] === 'buy' && empty($data['vendor_id'])) {
            $data['vendor_id'] = $this->airlineVendor($job);
        }

        // 🔴 Never add to a POSTED voucher (user, 2026-09-26). A line appended to one changes the total of a document
        // whose journal is already written, so the ledger and the voucher stop agreeing without anything saying so.
        // This held before billing too — the sheet would happily append to a voucher posted the day before.
        if ($data['side'] === 'buy' && ! empty($data['vendor_id'])) {
            $existing = AccountsPurchaseVoucher::withoutTenantScope()
                ->where('job_id', $job->id)->where('vendor_id', $data['vendor_id'])->first();

            if ($existing && DB::table('accounts_ledger_entries')->where('source_type', 'purchase_voucher')
                ->where('source_id', $existing->id)->exists()) {
                return response()->json([
                    'error'  => "{$existing->voucher_no} to this supplier is already posted, so nothing can be added to it "
                        . '— it would change a document the ledger has already recorded.',
                    'reason' => 'voucher_posted',
                ], 422);
            }
        }

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
        // A new voucher mints a sequence number, and a transaction that mints one replays on deadlock — the retry
        // belongs to the caller, see EnquirySequenceService::DEADLOCK_ATTEMPTS.
        }, \App\Services\EnquirySequenceService::DEADLOCK_ATTEMPTS);

        // A cost booked after billing is its own event in the trail: it moves the margin of a shipment already billed.
        $this->audit->record($job->agent_id, $late ? 'costsheet.late_cost_booked' : "costsheet.{$data['side']}_line_added",
            'job', $job->id, auth()->id());

        return response()->json($this->show($job)->getData(true), 201);
    }

    /**
     * Change a line that is already on the sheet (user, 2026-09-18). Same gate, same lock as adding one.
     *
     * ⚠️ A line written from the waybill can be edited like any other, and doing so makes it the operator's: it is
     * marked as typed, so the next save of the draft waybill does not overwrite what they decided.
     */
    public function updateLine(Request $request, Job $job, string $side, int $lineId): JsonResponse
    {
        $this->authorize('editCostSheet');

        if (! in_array($side, ['sell', 'buy'], true)) {
            return response()->json(['error' => 'Unknown side.'], 404);
        }

        if ($this->isLocked($job)) {
            return response()->json(['error' => 'This cost sheet has been finalized and posted. Corrections need a credit note.',
                'reason' => 'locked'], 422);
        }

        $data = $request->validate([
            'charge_type'    => 'required|string|in:' . implode(',', self::CHARGE_TYPES),
            'description'    => 'required|string|max:255',
            'quantity'       => 'required|numeric|min:0',
            'rate'           => 'required|numeric|min:0',
            'charge_basis'   => 'nullable|string|in:' . implode(',', self::CHARGE_BASES),
            'tax_status'     => 'nullable|string|in:' . implode(',', self::TAX_STATUSES),
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        $line = $side === 'sell'
            ? AccountsInvoiceItem::whereKey($lineId)->whereIn('invoice_id', AccountsInvoice::withoutTenantScope()->where('job_id', $job->id)->select('id'))->first()
            : AccountsPurchaseItem::whereKey($lineId)->whereIn('purchase_voucher_id', AccountsPurchaseVoucher::withoutTenantScope()->where('job_id', $job->id)->select('id'))->first();

        if ($line === null) {
            return response()->json(['error' => 'Line not found on this sheet.'], 404);
        }

        $amount = round($data['quantity'] * $data['rate'], 2);
        $taxPct = (float) ($data['tax_percentage'] ?? 0);
        $tax = round($amount * $taxPct / 100, 2);

        $line->forceFill([
            'charge_type' => $data['charge_type'],
            'description' => $data['description'],
            'quantity' => $data['quantity'],
            'rate' => $data['rate'],
            'amount' => $amount,
            'tax_percentage' => $taxPct,
            'tax_amount' => $tax,
            'net_amount' => round($amount + $tax, 2),
        ] + ($side === 'sell'
            // A sell line edited by hand becomes the operator's: the next save of the draft waybill leaves it alone.
            // `charge_basis` and `tax_status` are the sell side's alone — the buy table carries neither.
            ? ['source' => null, 'charge_basis' => $data['charge_basis'] ?? $line->charge_basis, 'tax_status' => $data['tax_status'] ?? $line->tax_status]
            : []))->save();

        $this->audit->record($job->agent_id, "costsheet.{$side}_line_edited", 'job', $job->id, auth()->id());

        return response()->json($this->show($job)->getData(true));
    }

    /**
     * Pricing hands the sheet to accounts (user, 2026-09-18). The screen confirms the figures first; this records the
     * hand-over, and accounts do the finalizing as before — nothing is posted here.
     */
    public function sendToAccounts(Job $job): JsonResponse
    {
        $this->authorize('editCostSheet');

        if ($this->isLocked($job)) {
            return response()->json(['error' => 'This cost sheet has already been finalized.', 'reason' => 'locked'], 422);
        }

        $invoice = AccountsInvoice::withoutTenantScope()->where('job_id', $job->id)->where('status', 'draft')->first();

        if ($invoice === null || $invoice->items()->count() === 0) {
            return response()->json(['error' => 'There is nothing to send: the sell side is empty.', 'reason' => 'nothing_to_send'], 422);
        }

        $invoice->forceFill(['sent_to_accounts_at' => now(), 'sent_to_accounts_by' => auth()->id()])->save();
        $this->audit->record($job->agent_id, 'costsheet.sent_to_accounts', 'job', $job->id, auth()->id());

        return response()->json($this->show($job)->getData(true));
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
        return AccountsPurchaseItem::query()
            ->join('accounts_purchase_vouchers as v', 'v.id', '=', 'accounts_purchase_items.purchase_voucher_id')
            ->leftJoin('partners as p', 'p.id', '=', 'v.vendor_id')
            ->where('v.job_id', $job->id)
            ->orderBy('p.name')->orderBy('accounts_purchase_items.id')
            ->get(['accounts_purchase_items.*', 'p.name as vendor_name']);
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
            // Who is owed it: each supplier has its own voucher (user, 2026-09-18), so the line has to say which.
            'vendor' => $i->vendor_name,
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
    /**
     * The draft waybill the sell lines are written from, and whether it carries a rate yet.
     *
     * ⚠️ An empty cost sheet has two very different causes — no waybill at all, or a waybill nobody has priced — and
     * "No sell lines yet" says neither.
     *
     * @return ?array{awb_number: string, chargeable_weight: ?float, has_rate: bool}
     */
    private function waybillState(Job $job): ?array
    {
        $waybill = DB::table('air_way_bills')->where('job_id', $job->id)->first(['id', 'awb_code', 'awb_no']);

        if ($waybill === null) {
            return null;
        }

        $cargo = DB::table('way_bill_consignment_data')->where('awb_id', $waybill->id)->first(['chargable_weight', 'gross_weight', 'rate']);
        $charge = (float) DB::table('payment_info')->where('awb_id', $waybill->id)->value('weight_charge');

        return [
            'awb_number' => \App\Support\AwbNumber::normalise((string) $waybill->awb_code . $waybill->awb_no) ?? (string) $waybill->id,
            'chargeable_weight' => $cargo ? (float) ($cargo->chargable_weight ?: $cargo->gross_weight) : null,
            'has_rate' => (float) ($cargo->rate ?? 0) > 0 || $charge > 0,
        ];
    }

    /** @return ?array{name: string, code: ?string, prefix: string} the carrier named by the waybill's prefix */
    private function airlineOf(Job $job): ?array
    {
        $prefix = substr(preg_replace('/\D/', '', (string) $job->awb_number), 0, 3);

        if ($job->transport_mode !== 'air' || strlen($prefix) !== 3) {
            return null;
        }

        $airline = DB::table('airlines')->where('prefix', $prefix)->where('is_active', true)->first(['name', 'code']);

        return $airline === null ? null : ['name' => $airline->name, 'code' => $airline->code, 'prefix' => $prefix];
    }

    /** @return ?array{at: string, by: ?string} */
    private function sentState(Job $job): ?array
    {
        $invoice = AccountsInvoice::withoutTenantScope()->where('job_id', $job->id)->whereNotNull('sent_to_accounts_at')
            ->orderByDesc('sent_to_accounts_at')->first(['sent_to_accounts_at', 'sent_to_accounts_by']);

        return $invoice === null ? null : [
            'at' => (string) $invoice->sent_to_accounts_at,
            'by' => DB::table('users')->where('id', $invoice->sent_to_accounts_by)->value('name'),
        ];
    }

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

    /**
     * The carrier this shipment flies on, as a vendor to owe money to — from `jobs.awb_number`'s prefix and the
     * platform's airline list (user, 2026-09-18).
     *
     * ⚠️ A purchase voucher points at `partners`, so the airline is kept as this BRANCH's partner row the first time
     * it is owed anything: found by name, created as an `airline` partner otherwise. Nothing is invented — the name is
     * the directory's — and a prefix the directory does not know returns NULL, leaving the old "name a vendor" error.
     *
     * 🔴 Per BRANCH, not per company (user, 2026-09-26, GAPS #399). A partner row carries a GSTIN, and a GSTIN is a
     * state registration — see `Partner::$tenantColumn`. This used to find the airline company-wide, so a Chennai cost
     * landed on the Emirates row registered in Mumbai (27), and the voucher's input credit was split against another
     * state's registration: IGST where Chennai's own registration would have made it CGST + SGST.
     */
    private function airlineVendor(Job $job): ?int
    {
        $prefix = substr(preg_replace('/\D/', '', (string) $job->awb_number), 0, 3);

        if ($job->transport_mode !== 'air' || strlen($prefix) !== 3) {
            return null;
        }

        $airline = DB::table('airlines')->where('prefix', $prefix)->where('is_active', true)->first(['name', 'code']);

        if ($airline === null) {
            return null;
        }

        $companyId = DB::table('agents_info')->where('id', $job->agent_id)->value('company_id');
        $existing = DB::table('partners')->where('agent_id', $job->agent_id)->whereRaw('LOWER(name) = ?', [strtolower($airline->name)])->value('id');

        return $existing ?? DB::table('partners')->insertGetId([
            'company_id' => $companyId, 'agent_id' => $job->agent_id, 'name' => $airline->name,
            'partner_type' => 'airline', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /**
     * The voucher for ONE supplier on this shipment (user, 2026-09-18: "each supplier should have its own voucher").
     *
     * 🔴 A voucher is what a supplier is paid against, so it is per supplier, never per shipment. It used to return
     * whichever voucher the job already had when no vendor was named, so cartage owed to a trucker landed on the
     * airline's voucher and accounts would have paid the wrong party.
     */
    private function voucherFor(Job $job, ?int $vendorId): AccountsPurchaseVoucher
    {
        // A voucher needs a vendor. Falling back to the first partner would attribute a
        // cost to somebody who is not owed it, so the caller must name one.
        abort_if($vendorId === null, 422, 'A buy line needs a vendor.');

        $existing = AccountsPurchaseVoucher::withoutTenantScope()
            ->where('job_id', $job->id)->where('vendor_id', $vendorId)->first();

        if ($existing) {
            return $existing;
        }

        return AccountsPurchaseVoucher::create([
            'agent_id' => $job->agent_id, 'job_id' => $job->id,
            'transport_mode' => $job->transport_mode, 'vendor_id' => $vendorId,
            'created_by' => auth()->id(),
            // 🔴 A real number from the branch's own PV sequence (user, 2026-09-26, GAPS #400). This was a placeholder
            // — `PV-{job}-{vendor}-{timestamp}` — that no step ever replaced, unlike an invoice's at finalize, so a
            // voucher raised from the sheet carried it for life into the register, the payment run and the supplier's
            // remittance. Minted at creation, as a payment is at the run: a number consumed by a voucher later emptied
            // is a gap, and gaps are acceptable — a number is never recycled (implementation_guide, Conventions).
            'voucher_no' => $this->sequences->next($job->agent_id, 'PV'),
            'document_date' => now()->toDateString(), 'status' => 'unpaid',
        ]);
    }
}
