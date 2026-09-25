<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * The two registers accounts read but never write (PRD §6.2 items 7 and 8), 2026-09-18.
 *
 * 🔴 **Nothing here posts anything.** The GST register is written when a document is POSTED (not finalized — PRD
 * §1555 says finalize; the user kept it on post, 2026-09-26, GAPS #396) and the unposted queue
 * is written when one is drafted and cleared when it posts — both by `LedgerPostingService`. These are the views of
 * that work: what has been charged in tax, and what is still waiting to reach the ledger.
 *
 * ⚠️ One accounts login covers the whole company (user, 2026-09-18), so every list takes an optional branch.
 */
class RegisterController extends Controller
{
    /** The tax charged per document, for GSTR-1. CGST + SGST within the state, IGST across it (PRD §6.2.7). */
    public function gst(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');
        [$branches, $picked] = $this->branches($request);

        // 🔴 Two document types, one register (2026-09-26, GAPS #396): purchase vouchers now write a row
        // too, and this screen was built only ever expecting `voucher_type = 'invoice'`. A voucher has no
        // stored `customer_id`, so its counterparty is the VENDOR, and no stored grand total either — see
        // `PurchaseVoucherController`'s own note that every figure there is summed from the items, not read
        // off a header column, which is why `grand_total` is honestly NULL for these rows rather than a
        // second query per row to compute one.
        $rows = DB::table('gst_ledger_entries as g')
            ->join('agents_info as a', 'a.id', '=', 'g.agent_id')
            ->leftJoin('accounts_invoices as i', fn ($j) => $j->on('i.id', '=', 'g.voucher_id')->where('g.voucher_type', '=', 'invoice'))
            ->leftJoin('customers as c', 'c.id', '=', 'i.customer_id')
            ->leftJoin('accounts_purchase_vouchers as pv', fn ($j) => $j->on('pv.id', '=', 'g.voucher_id')->where('g.voucher_type', '=', 'purchase_voucher'))
            ->leftJoin('partners as ve', 've.id', '=', 'pv.vendor_id')
            ->whereIn('g.agent_id', $branches->pluck('id'))
            ->when($picked, fn ($q) => $q->where('g.agent_id', $picked))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('g.created_at', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('g.created_at', '<=', $request->date('to')))
            ->orderByDesc('g.created_at')->limit(500)
            ->get(['g.id', 'g.created_at', 'g.voucher_type', 'g.cgst_amount', 'g.sgst_amount', 'g.igst_amount',
                   'a.agent_name as branch', 'i.grand_total', 'i.type as document_type',
                   DB::raw('COALESCE(i.invoice_no, pv.voucher_no) as invoice_no'),
                   DB::raw('COALESCE(i.document_date, pv.document_date) as document_date'),
                   DB::raw('COALESCE(c.name, ve.name) as customer')]);

        // 🔴 A credit note SUBTRACTS. The register row holds the tax the note reverses as a positive figure, and
        // this total used to add it — overstating the tax charged by twice every credit note. Signed per row, so
        // the column on screen adds up to the total under it.
        $rows->each(function ($row) {
            $sign = $row->document_type === 'credit_note' ? -1 : 1;
            $row->direction = $row->voucher_type === 'purchase_voucher' ? 'input' : 'output';

            foreach (['cgst_amount', 'sgst_amount', 'igst_amount'] as $head) {
                $row->{$head} = round($sign * (float) $row->{$head}, 2);
            }
        });

        // 🔴 NEVER one total across both directions. Output tax is a liability owed to the government; input
        // credit is an asset claimed back from it. A single sum would describe a position nobody holds — the
        // same reason the TDS register keeps its two sides apart.
        $total = fn (string $direction) => [
            'cgst' => round((float) $rows->where('direction', $direction)->sum('cgst_amount'), 2),
            'sgst' => round((float) $rows->where('direction', $direction)->sum('sgst_amount'), 2),
            'igst' => round((float) $rows->where('direction', $direction)->sum('igst_amount'), 2),
        ];

        return response()->json([
            'rows' => $rows,
            'totals' => ['output' => $total('output'), 'input' => $total('input')],
            'branches' => $branches,
            'branch_picked' => $picked,
        ]);
    }

    /** Documents drafted or approved and NOT yet in the ledger, with what each is waiting on (PRD §6.2.8). */
    public function unposted(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');
        [$branches, $picked] = $this->branches($request);

        $rows = DB::table('unposted_transactions_queue as q')
            ->join('agents_info as a', 'a.id', '=', 'q.agent_id')
            ->leftJoin('users as u', 'u.id', '=', 'q.created_by')
            ->leftJoin('accounts_invoices as i', fn ($j) => $j->on('i.id', '=', 'q.source_id')->where('q.source_type', '=', 'invoice'))
            ->leftJoin('accounts_purchase_vouchers as v', fn ($j) => $j->on('v.id', '=', 'q.source_id')->where('q.source_type', '=', 'purchase_voucher'))
            ->whereIn('q.agent_id', $branches->pluck('id'))
            ->when($picked, fn ($q) => $q->where('q.agent_id', $picked))
            ->orderBy('q.created_at')
            ->get(['q.id', 'q.created_at', 'q.source_type', 'q.source_id', 'q.net_amount', 'a.agent_name as branch',
                   'u.name as created_by', 'i.invoice_no', 'i.status as invoice_status', 'v.voucher_no', 'v.status as voucher_status']);

        return response()->json([
            'rows' => $rows->map(fn ($r) => (array) $r + [
                // What it is waiting for, in words: a draft has to be finalized before anything can post.
                'waiting_for' => $r->source_type === 'invoice'
                    ? ($r->invoice_status === 'draft' ? 'Finalize the invoice first' : 'Ready to post')
                    : ($r->voucher_status === 'paid' ? 'Ready to post' : 'Ready to post'),
                'number' => $r->invoice_no ?? $r->voucher_no,
            ]),
            'total' => round((float) $rows->sum('net_amount'), 2),
            'branches' => $branches,
            'branch_picked' => $picked,
        ]);
    }

    /** The company's branches, and the one asked for — refusing a branch outside the company. */
    private function branches(Request $request): array
    {
        $context = \App\Support\UserContext::for(auth()->user());
        $branches = DB::table('agents_info')->where('company_id', $context->companyId)->orderBy('agent_name')->get(['id', 'agent_name as name']);
        $picked = $request->filled('agent_id') && $branches->contains('id', (int) $request->integer('agent_id'))
            ? (int) $request->integer('agent_id') : null;

        return [$branches, $picked];
    }
}
