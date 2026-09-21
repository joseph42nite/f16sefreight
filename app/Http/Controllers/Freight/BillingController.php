<?php

namespace App\Http\Controllers\Freight;

use App\AccountsInvoice;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use App\Services\Billing\BillPdf;
use App\Support\BillingDocuments;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * The billing desk (user, 2026-09-19: "look at whatever is in the billing section and build it so that it matches").
 *
 * One register over the five sales documents (PRD §6.2), the columns a bill register prints, and the three things a
 * billing desk does with a selection of them: print, mail, export.
 *
 * 🔒 Reading is `viewFinancials` — the Boss reads the register. Raising and mailing a document is `finalizeInvoice`,
 * which is accounts alone: the role that sets the margin never issues the bill.
 */
class BillingController extends Controller
{
    public function __construct(private readonly BillPdf $pdf, private readonly AuditLogger $audit) {}

    /** How a register may be ordered. A free `sort` string would be an injection hole. */
    private const SORTS = [
        'transaction_no' => 'i.invoice_no',
        'date' => 'i.document_date',
        'organization' => 'organization',
        'amount' => 'i.grand_total',
    ];

    /**
     * The register: every document of the chosen types, with the columns Logi-Sys prints and the two ours needs.
     *
     * ⚠️ `Amount` and `Amount (INR)` are DIFFERENT columns and both are kept. A register that shows only the billing
     * currency cannot be totalled; one that shows only INR hides what the client was actually asked for.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $rows = $this->register($request, $branches)->get();

        return response()->json([
            'rows' => $rows,
            'totals' => [
                'count' => $rows->count(),
                // Only the INR column can be summed — mixed currencies have no meaningful total.
                'amount_inr' => round($rows->sum(fn ($r) => $r->direction * $r->amount_inr), 2),
                'outstanding_inr' => round($rows->sum(fn ($r) => $r->direction * $r->outstanding_inr), 2),
                'credited_inr' => round($rows->where('type', 'credit_note')->sum('amount_inr'), 2),
            ],
            'branches' => $branches,
            'types' => BillingDocuments::TYPES,
            'currencies' => DB::table('accounts_invoices')->whereIn('agent_id', $branches->pluck('id'))
                ->distinct()->orderBy('currency')->pluck('currency'),
            'created_by' => DB::table('users')->whereIn('id', DB::table('accounts_invoices')
                ->whereIn('agent_id', $branches->pluck('id'))->distinct()->pluck('created_by'))
                ->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /** The same register as a CSV — Logi-Sys calls it Data Export. */
    public function export(Request $request): Response
    {
        $this->authorize('viewFinancials');

        $rows = $this->register($request, $this->branches())->get();
        $columns = ['Trans No.', 'Date', 'Type', 'Organization', 'Shipment', 'Curr', 'Amount', 'Amount (INR)',
            'Outstanding (INR)', 'Status', 'Narration'];

        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, $columns);

        foreach ($rows as $row) {
            fputcsv($csv, [$row->invoice_no, $row->document_date, BillingDocuments::label($row->type), $row->organization,
                $row->job_no, $row->currency, $row->amount, $row->amount_inr, $row->outstanding_inr, $row->status, $row->narration]);
        }

        rewind($csv);

        return response(stream_get_contents($csv), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="billing-' . now()->format('Ymd-His') . '.csv"',
        ]);
    }

    /** Multiple Bill Printing: the chosen documents as one PDF, in the order they were chosen. */
    public function print(Request $request): Response
    {
        $this->authorize('viewFinancials');

        $invoices = $this->chosen($request);

        if ($invoices->isEmpty()) {
            return response()->json(['error' => 'Pick at least one document to print.', 'reason' => 'nothing_chosen'], 422);
        }

        return response($this->pdf->render($invoices), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $this->pdf->filename($invoices->pluck('invoice_no')->all()) . '"',
        ]);
    }

    /**
     * Send each chosen bill to the organization it is addressed to, from the user's own mailbox.
     *
     * 🔴 **One mail per document, never one mail with everything attached.** Two clients' bills in one envelope is a
     * disclosure, and it is the obvious way to build this.
     *
     * ⚠️ A draft is never mailed. It has no number, and a client who receives `DRAFT-…` will quote it back forever.
     */
    public function mail(Request $request): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $invoices = $this->chosen($request);
        $connection = \App\MailboxConnection::withoutGlobalScopes()->where('user_id', auth()->id())
            ->where('is_active', true)->whereNull('disconnected_at')->where('auth_state', 'connected')->latest('id')->first();

        if ($connection === null) {
            return response()->json(['error' => 'Connect your Outlook first (in Settings), so the bills go from you.', 'reason' => 'no_mailbox'], 422);
        }

        $provider = app(\App\Services\Mail\MailProviderRegistry::class)->for($connection->provider);
        $mailBody = app(\App\Services\Mail\MailBody::class);
        $signature = app(\App\Services\Mail\ThreadMailer::class)->signatureFor($connection, auth()->user());
        $sent = [];
        $skipped = [];

        foreach ($invoices as $invoice) {
            if ($invoice->status === 'draft') {
                $skipped[] = ['invoice_no' => $invoice->invoice_no, 'why' => 'It is still a draft.'];

                continue;
            }

            $to = $this->addressesFor($invoice);

            if ($to === []) {
                $skipped[] = ['invoice_no' => $invoice->invoice_no, 'why' => 'We have no email address for them.'];

                continue;
            }

            $label = BillingDocuments::label($invoice->type);
            $body = $mailBody->forEmail(
                '<p>Hello,</p><p>Please find ' . e($label) . ' ' . e($invoice->invoice_no) . ' attached, for '
                . e($invoice->currency) . ' ' . number_format((float) $invoice->grand_total, 2) . '.</p><p>Kind regards,</p>',
                $signature, null
            );

            $result = $provider->send($connection, $to, [], $label . ' ' . $invoice->invoice_no, $body, null, [[
                'name' => $this->pdf->filename([$invoice->invoice_no]),
                'mime_type' => 'application/pdf',
                'bytes' => $this->pdf->render([$invoice]),
            ]]);

            if (! ($result['ok'] ?? false)) {
                $skipped[] = ['invoice_no' => $invoice->invoice_no, 'why' => $result['error'] ?? 'The mail provider refused it.'];

                continue;
            }

            $sent[] = ['invoice_no' => $invoice->invoice_no, 'to' => $to];
            $this->audit->record($invoice->agent_id, 'invoice.mailed', 'invoice', $invoice->id, auth()->id());
        }

        return response()->json(['sent' => $sent, 'skipped' => $skipped, 'from' => $connection->email_address]);
    }

    /**
     * The e-invoice register: which finalized documents the IRP has acknowledged and which are still waiting.
     *
     * ❓ **Nothing here talks to the portal.** An IRN is minted by the IRP through a GSP, against the company's own
     * credentials, which we do not hold — so the number is RECORDED when it comes back, and the register says plainly
     * what is outstanding. Flagged in GAPS #371 rather than faked.
     */
    public function eInvoice(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();

        $rows = DB::table('accounts_invoices as i')
            ->leftJoin('customers as c', 'c.id', '=', 'i.customer_id')
            ->whereIn('i.agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('i.agent_id', $request->integer('agent_id')))
            // Only a numbered document can carry an IRN, and only a B2B one needs one.
            ->whereNotIn('i.status', ['draft', 'void'])
            ->whereIn('i.type', ['invoice', 'debit_note', 'credit_note'])
            ->orderByDesc('i.document_date')
            ->limit(500)
            ->get(['i.id', 'i.invoice_no', 'i.type', 'i.document_date', 'i.grand_total', 'i.currency',
                   'i.irn', 'i.irn_status', 'i.ack_no', 'i.ack_date', 'c.name as organization', 'c.gst_no']);

        foreach ($rows as $row) {
            // A client with no GSTIN is a B2C sale: it never goes to the IRP at all.
            $row->needed = filled($row->gst_no);
            $row->state = ! $row->needed ? 'not_required' : ($row->irn ? 'generated' : 'pending');
        }

        return response()->json([
            'rows' => $rows,
            'waiting' => $rows->where('state', 'pending')->count(),
            'branches' => $branches,
            // Said once, on the screen, rather than left for somebody to discover at filing time.
            'note' => 'IRNs are recorded here, not minted: the portal is reached through your GSP with the company\'s own credentials.',
        ]);
    }

    /** Record what the IRP gave back for one document. */
    public function recordIrn(Request $request, int $id): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $data = $request->validate([
            'irn' => 'required|string|max:100',
            'ack_no' => 'nullable|string|max:30',
            'ack_date' => 'nullable|date',
        ]);

        $invoice = $this->own($id);

        if ($invoice->status === 'draft') {
            return response()->json(['error' => 'A draft has no number to register.', 'reason' => 'not_finalized'], 422);
        }

        $invoice->update(array_merge($data, ['irn_status' => 'generated']));
        $this->audit->record($invoice->agent_id, 'invoice.irn_recorded', 'invoice', $invoice->id, auth()->id());

        return response()->json($invoice->fresh());
    }

    /**
     * Raise a document: a note against an invoice, or a brokerage or consol bill on a shipment.
     *
     * 🔴 The note's client and job are the PARENT's, never the request's — PRD §6.2 locks them, and taking them from
     * the caller is how a credit note ends up crediting a different client's invoice.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $data = $request->validate([
            'type' => 'required|in:invoice,debit_note,credit_note,brokerage,consol_invoice',
            'parent_invoice_id' => 'required_if:type,debit_note,credit_note|nullable|integer',
            'job_id' => 'required_if:type,invoice,brokerage,consol_invoice|nullable|integer',
            'customer_id' => 'required_if:type,invoice|nullable|integer|exists:customers,id',
            'partner_id' => 'required_if:type,brokerage,consol_invoice|nullable|integer|exists:partners,id',
            'basis' => 'nullable|string|max:30',
            'reason' => 'required_if:type,debit_note,credit_note|nullable|string|max:255',
            'narration' => 'nullable|string|max:255',
            'document_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'lines' => 'required|array|min:1',
            'lines.*.description' => 'required|string|max:255',
            'lines.*.charge_type' => 'nullable|string|max:30',
            'lines.*.hsn_sac_code' => 'nullable|string|max:10',
            'lines.*.house_job_id' => 'nullable|integer',
            'lines.*.quantity' => 'nullable|numeric|min:0',
            'lines.*.rate' => 'required|numeric',
            'lines.*.tax_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        $parent = null;

        if (in_array($data['type'], BillingDocuments::NOTES, true)) {
            $parent = $this->own((int) $data['parent_invoice_id']);

            if (in_array($parent->status, ['draft', 'void'], true)) {
                return response()->json([
                    'error' => 'A note can only be raised against a finalized invoice; correct the draft instead.',
                    'reason' => 'parent_not_finalized',
                ], 422);
            }
        }

        $agentId = $parent?->agent_id ?? $this->jobBranch((int) $data['job_id']);

        if ($agentId === null || ! $this->branches()->contains('id', $agentId)) {
            return response()->json(['error' => 'That shipment is not one of yours.', 'reason' => 'job_not_found'], 404);
        }

        $invoice = DB::transaction(function () use ($data, $parent, $agentId) {
            // Who the document is addressed to, by type: a note follows its parent, an invoice bills the client, and
            // brokerage and consol bill a partner with NO customer debtor at all (PRD §6.2).
            [$billedType, $billedId, $role, $customerId] = match (true) {
                $parent !== null => [$parent->billed_party_type, $parent->billed_party_id, $parent->billed_party_role, $parent->customer_id],
                $data['type'] === 'invoice' => ['customer', (int) $data['customer_id'], 'client', (int) $data['customer_id']],
                default => ['partner', (int) $data['partner_id'], $data['type'] === 'brokerage' ? 'broker' : 'agent', null],
            };

            $invoice = AccountsInvoice::create([
                'agent_id' => $agentId,
                'job_id' => $parent?->job_id ?? $data['job_id'],
                'transport_mode' => $parent?->transport_mode ?? DB::table('jobs')->where('id', $data['job_id'])->value('transport_mode'),
                'customer_id' => $customerId,
                'billed_party_type' => $billedType,
                'billed_party_id' => $billedId,
                'billed_party_role' => $role,
                'parent_invoice_id' => $parent?->id,
                'created_by' => auth()->id(),
                'invoice_no' => AccountsInvoice::placeholderNumber($parent?->job_id ?? (int) $data['job_id']),
                'type' => $data['type'],
                'document_date' => $data['document_date'] ?? now()->toDateString(),
                'due_date' => $data['due_date'] ?? null,
                'status' => 'draft',
                'reason' => $data['reason'] ?? null,
                'narration' => $data['narration'] ?? null,
                'currency' => $parent?->currency ?? 'INR',
                'exchange_rate' => $parent?->exchange_rate ?? 1,
            ]);

            foreach ($data['lines'] as $line) {
                $quantity = (float) ($line['quantity'] ?? 1);
                $amount = round($quantity * (float) $line['rate'], 2);
                $tax = round($amount * (float) ($line['tax_percentage'] ?? 0) / 100, 2);

                $invoice->items()->create([
                    'house_job_id' => $line['house_job_id'] ?? null,
                    'charge_type' => $line['charge_type'] ?? 'other',
                    'hsn_sac_code' => $line['hsn_sac_code'] ?? null,
                    'description' => $line['description'],
                    'quantity' => $quantity,
                    'rate' => $line['rate'],
                    'amount' => $amount,
                    'tax_percentage' => $line['tax_percentage'] ?? 0,
                    'tax_amount' => $tax,
                    'net_amount' => round($amount + $tax, 2),
                ]);
            }

            // The extension row each of these two documents carries (PRD §6.2).
            if ($data['type'] === 'brokerage') {
                \App\AccountsInvoiceBrokerageDetail::create(['invoice_id' => $invoice->id,
                    'partner_agent_id' => $data['partner_id'], 'brokerage_basis' => $data['basis'] ?? 'flat_rate']);
            }

            if ($data['type'] === 'consol_invoice') {
                \App\AccountsInvoiceConsolDetail::create(['invoice_id' => $invoice->id,
                    'partner_agent_id' => $data['partner_id'], 'consol_basis' => $data['basis'] ?? 'flat_rate']);
            }

            $invoice->update([
                'subtotal' => $subtotal = round((float) $invoice->items()->sum('amount'), 2),
                'tax_amount' => $tax = round((float) $invoice->items()->sum('tax_amount'), 2),
                'grand_total' => round($subtotal + $tax, 2),
            ]);

            $this->audit->record($agentId, 'invoice.raised', 'invoice', $invoice->id, auth()->id());

            return $invoice;
        });

        return response()->json($invoice->fresh()->load('items'), 201);
    }

    /**
     * One document, opened: its header, its lines, who it is for, what it amends, what has been raised against it,
     * what has been received against it, and the journal posting it would write.
     *
     * ⚠️ Everything the drawer shows comes from HERE, in one round trip. A screen that fetches the lines, then the
     * receipts, then the journal shows a document that is half one version and half another while it loads.
     */
    public function show(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');

        $invoice = $this->own($id);
        $job = DB::table('jobs')->where('id', $invoice->job_id)->first(['id', 'execution_job_no', 'awb_number', 'transport_mode']);

        return response()->json([
            'document' => array_merge($invoice->toArray(), [
                'label' => BillingDocuments::label($invoice->type),
                'organization' => $this->organisation($invoice),
                'job' => $job,
                'outstanding' => $invoice->outstanding(),
                'amount_inr' => round((float) $invoice->grand_total * (float) ($invoice->exchange_rate ?: 1), 2),
                'parent' => $invoice->parent_invoice_id
                    ? AccountsInvoice::withoutTenantScope()->where('id', $invoice->parent_invoice_id)
                        ->first(['id', 'invoice_no', 'type', 'grand_total'])
                    : null,
                'raised_by' => DB::table('users')->where('id', $invoice->created_by)->value('name'),
            ]),
            'items' => $invoice->items()->orderBy('id')->get(),
            // The notes raised against this document, so nobody raises the same credit twice.
            'notes' => AccountsInvoice::withoutTenantScope()->where('parent_invoice_id', $invoice->id)
                ->orderBy('id')->get(['id', 'invoice_no', 'type', 'document_date', 'status', 'grand_total', 'reason']),
            'receipts' => DB::table('accounts_receipt_allocations as a')
                ->join('accounts_receipts as r', 'r.id', '=', 'a.receipt_id')
                ->where('a.invoice_id', $invoice->id)
                ->get(['r.receipt_no', 'r.receipt_date', 'r.mode', 'r.reference', 'a.amount', 'a.resolution', 'r.is_posted']),
            'journal' => app(\App\Services\LedgerPostingService::class)
                ->summarise(app(\App\Services\LedgerPostingService::class)->linesForInvoice($invoice)),
            // What this document can do next, decided once on the server rather than re-derived by every button.
            'can' => [
                'edit' => $invoice->status === 'draft',
                'finalize' => $invoice->status === 'draft',
                'post' => $invoice->status !== 'draft' && ! $invoice->is_posted,
                // 🔴 A POSTED DOCUMENT IS NEVER VOIDED. It is in the ledger and in the GST register; the correction
                // is a credit note, which leaves both trails intact (PRD §9.3). Nor is one money has arrived
                // against — the flag carries BOTH rules, so the button is never offered only to refuse.
                'void' => ! $invoice->is_posted && $invoice->status !== 'void' && (float) $invoice->amount_paid <= 0,
                'note' => in_array($invoice->type, ['invoice'], true) && ! in_array($invoice->status, ['draft', 'void'], true),
                'print' => true,
            ],
        ]);
    }

    /** The header of a draft: its dates, its currency, what it is for. */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $invoice = $this->draft($id);

        if (! $invoice instanceof AccountsInvoice) {
            return $invoice;
        }

        $invoice->update($request->validate([
            'document_date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:document_date',
            'narration' => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:255',
            'currency' => 'nullable|string|size:3',
            'exchange_rate' => 'nullable|numeric|min:0.0001',
        ]));

        return $this->show($id);
    }

    /** Add a line to a draft. */
    public function storeLine(Request $request, int $id): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $invoice = $this->draft($id);

        if (! $invoice instanceof AccountsInvoice) {
            return $invoice;
        }

        $invoice->items()->create($this->line($request->validate($this->lineRules())));
        $this->retotal($invoice);

        return $this->show($id);
    }

    /** Change one line of a draft. */
    public function updateLine(Request $request, int $id, int $lineId): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $invoice = $this->draft($id);

        if (! $invoice instanceof AccountsInvoice) {
            return $invoice;
        }

        $item = $invoice->items()->where('id', $lineId)->first();

        abort_if($item === null, 404, 'That line is not on this document.');

        $item->update($this->line($request->validate($this->lineRules())));
        $this->retotal($invoice);

        return $this->show($id);
    }

    public function destroyLine(int $id, int $lineId): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $invoice = $this->draft($id);

        if (! $invoice instanceof AccountsInvoice) {
            return $invoice;
        }

        $invoice->items()->where('id', $lineId)->delete();
        $this->retotal($invoice);

        return $this->show($id);
    }

    /**
     * Void a document that must not stand.
     *
     * 🔴 **A status, never a delete** (PRD §9.3). A void invoice stays in the register and in the audit trail with a
     * reason against it; a deleted one leaves a hole in the number sequence that nobody can explain at filing time.
     */
    public function void(Request $request, int $id): JsonResponse
    {
        $this->authorize('finalizeInvoice');

        $invoice = $this->own($id);
        $data = $request->validate(['reason' => 'required|string|max:255']);

        if ($invoice->is_posted) {
            return response()->json([
                'error' => 'This document is in the ledger. Raise a credit note against it instead of voiding it.',
                'reason' => 'already_posted',
            ], 422);
        }

        if ((float) $invoice->amount_paid > 0) {
            return response()->json([
                'error' => 'Money has been received against this document. Reverse the receipt first.',
                'reason' => 'has_receipts',
            ], 422);
        }

        $invoice->update(['status' => 'void', 'reason' => $data['reason']]);
        $this->audit->record($invoice->agent_id, 'invoice.voided', 'invoice', $invoice->id, auth()->id());

        return $this->show($id);
    }

    /** Validation shared by the two line endpoints. */
    private function lineRules(): array
    {
        return [
            'description' => 'required|string|max:255',
            'charge_type' => 'nullable|string|max:30',
            'hsn_sac_code' => 'nullable|string|max:10',
            'house_job_id' => 'nullable|integer',
            'quantity' => 'nullable|numeric|min:0',
            'rate' => 'required|numeric',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
        ];
    }

    /** One line's figures, computed here so the screen never sends a total we did not calculate. */
    private function line(array $data): array
    {
        $quantity = (float) ($data['quantity'] ?? 1);
        $amount = round($quantity * (float) $data['rate'], 2);
        $tax = round($amount * (float) ($data['tax_percentage'] ?? 0) / 100, 2);

        return [
            'house_job_id' => $data['house_job_id'] ?? null,
            'charge_type' => $data['charge_type'] ?? 'other',
            'hsn_sac_code' => $data['hsn_sac_code'] ?? null,
            'description' => $data['description'],
            'quantity' => $quantity,
            'rate' => $data['rate'],
            'amount' => $amount,
            'tax_percentage' => $data['tax_percentage'] ?? 0,
            'tax_amount' => $tax,
            'net_amount' => round($amount + $tax, 2),
        ];
    }

    /** The header follows the lines, always — a stored total that is typed can disagree with what is printed. */
    private function retotal(AccountsInvoice $invoice): void
    {
        $subtotal = round((float) $invoice->items()->sum('amount'), 2);
        $tax = round((float) $invoice->items()->sum('tax_amount'), 2);

        $invoice->update(['subtotal' => $subtotal, 'tax_amount' => $tax, 'grand_total' => round($subtotal + $tax, 2)]);
    }

    /** A draft of the caller's own, or the refusal to send back. */
    private function draft(int $id)
    {
        $invoice = $this->own($id);

        return $invoice->status === 'draft' ? $invoice : response()->json([
            'error' => 'This document is ' . $invoice->status . '. Raise a note against it instead of editing it.',
            'reason' => 'not_draft',
        ], 422);
    }

    /** Who the document is addressed to, whichever directory they are in. */
    private function organisation(AccountsInvoice $invoice): ?object
    {
        $table = $invoice->billed_party_type === 'partner' ? 'partners' : 'customers';
        $id = $invoice->billed_party_id ?: $invoice->customer_id;

        return $id === null ? null : DB::table($table)->where('id', $id)->first(['id', 'name', 'gst_no', 'email']);
    }

    /** What a note may still credit — shown before it is typed, not after it is refused. */
    public function creditRoom(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');

        $parent = $this->own($id);
        $credited = (float) AccountsInvoice::withoutTenantScope()
            ->where('parent_invoice_id', $parent->id)->where('type', 'credit_note')
            ->whereNotIn('status', ['draft', 'void'])->sum('grand_total');

        return response()->json([
            'invoice_no' => $parent->invoice_no,
            'grand_total' => round((float) $parent->grand_total, 2),
            'already_credited' => round($credited, 2),
            'room' => round((float) $parent->grand_total - $credited, 2),
        ]);
    }

    /** The register query, shared by the screen and the export so the two can never disagree. */
    private function register(Request $request, $branches)
    {
        $types = array_values(array_intersect(
            (array) ($request->input('types') ?: array_keys(BillingDocuments::TYPES)),
            array_keys(BillingDocuments::TYPES)
        ));

        $sort = self::SORTS[$request->input('sort')] ?? self::SORTS['date'];

        return DB::table('accounts_invoices as i')
            ->leftJoin('jobs as j', 'j.id', '=', 'i.job_id')
            ->leftJoin('customers as c', 'c.id', '=', 'i.customer_id')
            ->leftJoin('partners as p', function ($join) {
                $join->on('p.id', '=', 'i.billed_party_id')->where('i.billed_party_type', '=', 'partner');
            })
            ->whereIn('i.agent_id', $branches->pluck('id'))
            ->whereIn('i.type', $types ?: ['invoice'])
            ->when($request->filled('agent_id'), fn ($q) => $q->where('i.agent_id', $request->integer('agent_id')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('i.document_date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('i.document_date', '<=', $request->date('to')))
            ->when($request->filled('status'), fn ($q) => $q->where('i.status', $request->string('status')))
            ->when($request->filled('currency'), fn ($q) => $q->where('i.currency', $request->string('currency')))
            ->when($request->filled('created_by'), fn ($q) => $q->where('i.created_by', $request->integer('created_by')))
            ->when($request->boolean('outstanding'), fn ($q) => $q->whereNotIn('i.status', ['draft', 'void', 'paid']))
            // Stage ① of Money in: cost sheets pricing has handed over and nobody has billed (guide §11.2).
            ->when($request->boolean('awaiting'), fn ($q) => $q->whereNotNull('i.sent_to_accounts_at')->where('i.status', 'draft'))
            // Stage ②: raised on this desk and not finalized — a draft nobody handed over.
            ->when($request->boolean('own_drafts'), fn ($q) => $q->whereNull('i.sent_to_accounts_at')->where('i.status', 'draft'))
            // Logi-Sys calls it "Exclude Reverse Txns": the credit notes that give money back.
            ->when($request->boolean('exclude_credit_notes'), fn ($q) => $q->where('i.type', '!=', 'credit_note'))
            ->when($request->filled('q'), function ($q) use ($request) {
                $term = '%' . $request->string('q') . '%';
                $q->where(fn ($w) => $w->where('c.name', 'like', $term)->orWhere('p.name', 'like', $term)
                    ->orWhere('i.invoice_no', 'like', $term)->orWhere('j.execution_job_no', 'like', $term));
            })
            ->orderBy($sort, $request->input('direction') === 'asc' ? 'asc' : 'desc')
            ->limit(1000)
            ->select([
                'i.id', 'i.invoice_no', 'i.document_date', 'i.due_date', 'i.type', 'i.status', 'i.currency',
                'i.grand_total as amount', 'i.amount_paid', 'i.narration', 'i.is_posted', 'i.irn',
                'j.execution_job_no as job_no', 'i.exchange_rate',
                DB::raw('COALESCE(c.name, p.name) AS organization'),
                DB::raw('ROUND(i.grand_total * i.exchange_rate, 2) AS amount_inr'),
                DB::raw('ROUND((i.grand_total - i.amount_paid) * i.exchange_rate, 2) AS outstanding_inr'),
                // 🔴 A CREDIT NOTE COUNTS THE OTHER WAY. Its own face reads as a positive amount — that is what the
                // document says and what the client receives — but in a total it GIVES money back, so a register
                // that adds it reports revenue that was reversed. The row shows what is printed; the total nets.
                DB::raw("CASE WHEN i.type = 'credit_note' THEN -1 ELSE 1 END AS direction"),
            ]);
    }

    /** The documents a selection names, in the caller's own company, in the order given. */
    private function chosen(Request $request)
    {
        $ids = array_values(array_filter(array_map('intval', (array) $request->input('ids', []))));

        $invoices = AccountsInvoice::withoutTenantScope()
            ->whereIn('id', $ids)
            ->whereIn('agent_id', $this->branches()->pluck('id'))
            ->get()
            ->keyBy('id');

        return collect($ids)->map(fn ($id) => $invoices[$id] ?? null)->filter()->values();
    }

    private function own(int $id): AccountsInvoice
    {
        $invoice = AccountsInvoice::withoutTenantScope()->where('id', $id)
            ->whereIn('agent_id', $this->branches()->pluck('id'))->first();

        abort_if($invoice === null, 404, 'That document is not one of yours.');

        return $invoice;
    }

    private function jobBranch(int $jobId): ?int
    {
        return DB::table('jobs')->where('id', $jobId)->value('agent_id');
    }

    /** Where a bill is sent: the client's billing contacts, or the partner's one address. */
    private function addressesFor(AccountsInvoice $invoice): array
    {
        if ($invoice->billed_party_type === 'partner') {
            return array_values(array_filter([DB::table('partners')->where('id', $invoice->billed_party_id)->value('email')]));
        }

        return DB::table('customer_contacts')->where('customer_id', $invoice->customer_id)
            ->orderByDesc('message_count')->limit(3)->pluck('email')->all();
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
