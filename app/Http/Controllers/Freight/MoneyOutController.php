<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Money out — the buy side as one pipeline (guide §11.2, user 2026-09-21).
 *
 * ① Cost to book → ② Vouchers → ③ Statements to check → ④ Due to pay
 *
 * 🔴 **Stage ① is the one that did not exist and matters most.** A shipment billed with nothing costed reads as
 * pure profit; until now that was a warning on a report nobody opened at the right moment. Here it is the first
 * thing on the page that pays suppliers.
 *
 * ⚠️ Counts only — every list is served by the register that already owns it, exactly as on Money in.
 */
class MoneyOutController extends Controller
{
    public function stages(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $picked = $request->integer('agent_id') ?: null;
        $scope = $picked ? [$picked] : $branches->pluck('id')->all();

        // ① Billed shipments with no purchase voucher at all — their margin is not real.
        $toCost = DB::table('accounts_invoices as i')
            ->whereIn('i.agent_id', $scope)->where('i.type', 'invoice')->whereNotIn('i.status', ['draft', 'void'])
            // 🔴 Shipments only. General billing (2026-09-26) has no shipment and so no cost to book; COUNT(DISTINCT)
            // skipped its NULL job, but the SUM did not, and ① showed rupees the list beside it could not account for.
            ->whereNotNull('i.job_id')
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('accounts_purchase_vouchers as v')
                ->whereColumn('v.job_id', 'i.job_id'))
            ->selectRaw('COUNT(DISTINCT i.job_id) AS n, COALESCE(SUM(i.subtotal * i.exchange_rate), 0) AS total')
            ->first();

        // ② Everything booked on the buy side, at its gross.
        $vouchers = DB::table('accounts_purchase_vouchers as v')
            ->leftJoinSub(
                DB::table('accounts_purchase_items')->selectRaw('purchase_voucher_id, SUM(net_amount) AS gross')
                    ->groupBy('purchase_voucher_id'),
                'i', 'i.purchase_voucher_id', '=', 'v.id'
            )
            ->whereIn('v.agent_id', $scope)
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(i.gross), 0) AS total, COALESCE(SUM(v.amount_paid), 0) AS paid')
            ->first();

        // ③ Supplier statement lines that do not agree with our vouchers.
        $statements = DB::table('vendor_statement_lines as l')
            ->join('vendor_statements as s', 's.id', '=', 'l.vendor_statement_id')
            ->whereIn('s.agent_id', $scope)->whereIn('l.state', ['different', 'not_booked'])
            ->selectRaw('COUNT(*) AS n, COALESCE(SUM(ABS(COALESCE(l.difference, l.their_amount))), 0) AS total')
            ->first();

        // ④ What is still owed to suppliers, and to how many of them.
        $due = DB::table('accounts_purchase_vouchers as v')
            ->leftJoinSub(
                DB::table('accounts_purchase_items')->selectRaw('purchase_voucher_id, SUM(net_amount) AS gross')
                    ->groupBy('purchase_voucher_id'),
                'i', 'i.purchase_voucher_id', '=', 'v.id'
            )
            ->whereIn('v.agent_id', $scope)
            ->whereRaw('COALESCE(i.gross, 0) - v.amount_paid > 0.009')
            ->selectRaw('COUNT(DISTINCT v.vendor_id) AS vendors, COUNT(*) AS n,
                         COALESCE(SUM(COALESCE(i.gross, 0) - v.amount_paid), 0) AS total')
            ->first();

        return response()->json([
            'stages' => [
                ['key' => 'to_cost', 'step' => 1, 'label' => 'Cost to book',
                 'count' => (int) $toCost->n, 'amount' => round((float) $toCost->total, 2),
                 'tone' => (int) $toCost->n > 0 ? 'warning' : null,
                 'note' => (int) $toCost->n > 0
                     ? (int) $toCost->n . ' billed shipment(s) have no cost booked, so their margin is not real.'
                     : 'Every billed shipment has its cost booked.'],
                ['key' => 'vouchers', 'step' => 2, 'label' => 'Vouchers',
                 'count' => (int) $vouchers->n, 'amount' => round((float) $vouchers->total, 2),
                 'note' => 'Booked on the buy side, gross of input tax.'],
                ['key' => 'statements', 'step' => 3, 'label' => 'Statements to check',
                 'count' => (int) $statements->n, 'amount' => round((float) $statements->total, 2),
                 'tone' => (int) $statements->n > 0 ? 'warning' : null,
                 'note' => (int) $statements->n > 0
                     ? (int) $statements->n . ' supplier line(s) do not agree with our vouchers.'
                     : 'Every supplier statement agrees with our vouchers.'],
                ['key' => 'due', 'step' => 4, 'label' => 'Due to pay',
                 'count' => (int) $due->vendors, 'amount' => round((float) $due->total, 2),
                 'vouchers' => (int) $due->n,
                 'note' => (int) $due->n > 0
                     ? (int) $due->n . ' voucher(s) across ' . (int) $due->vendors . ' supplier(s).'
                     : 'Nothing is owed to suppliers.'],
            ],
            'paid' => round((float) $vouchers->paid, 2),
            'branches' => $branches,
        ]);
    }

    /**
     * ① as a queue, not a count (user, 2026-09-26): every billed shipment with no cost booked, oldest billed first,
     * each with what it was billed at and the supplier its cost most likely belongs to.
     *
     * ⚠️ READ-ONLY. The default supplier is the airline the AWB prefix names — the same rule the cost sheet applies —
     * but only LOOKED UP here. The cost sheet creates the airline as a partner the first time it is owed money; a
     * list that did that would write a partner row every time somebody opened Money out.
     *
     * Booking goes through the cost sheet's own `POST /jobs/{job}/cost-sheet/lines` with `side=buy`, so there is one
     * path that creates a voucher — see `JobCostSheetController::storeLine` for the after-billing rule.
     */
    public function toCost(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $picked = $request->integer('agent_id') ?: null;
        $scope = $picked && $branches->contains('id', $picked) ? [$picked] : $branches->pluck('id')->all();

        // The same definition as the ① count above, so the list and the number on the pipeline always agree.
        $rows = DB::table('accounts_invoices as i')
            ->join('jobs as j', 'j.id', '=', 'i.job_id')
            ->join('agents_info as a', 'a.id', '=', 'i.agent_id')
            ->leftJoin('customers as c', 'c.id', '=', 'j.customer_id')
            ->whereIn('i.agent_id', $scope)->where('i.type', 'invoice')->whereNotIn('i.status', ['draft', 'void'])
            ->whereNotExists(fn ($q) => $q->select(DB::raw(1))->from('accounts_purchase_vouchers as v')
                ->whereColumn('v.job_id', 'i.job_id'))
            ->groupBy('j.id', 'j.execution_job_no', 'j.transport_mode', 'j.awb_number', 'c.name', 'i.agent_id', 'a.agent_name')
            ->orderByRaw('MIN(i.document_date), j.id')
            ->get(['j.id as job_id', 'j.execution_job_no as job_no', 'j.transport_mode', 'j.awb_number',
                   'c.name as customer', 'i.agent_id', 'a.agent_name as branch',
                   DB::raw("GROUP_CONCAT(i.invoice_no ORDER BY i.invoice_no SEPARATOR ', ') AS invoices"),
                   // Net of tax: the margin at stake is on the subtotal, never the grand total.
                   DB::raw('ROUND(SUM(i.subtotal * i.exchange_rate), 2) AS billed'),
                   DB::raw('MIN(i.document_date) AS billed_on')]);

        $airlines = DB::table('airlines')->where('is_active', true)
            ->whereIn('prefix', $rows->map(fn ($r) => $this->awbPrefix($r))->filter()->unique())
            ->pluck('name', 'prefix');

        $suppliers = DB::table('partners')->whereIn('agent_id', $scope)->orderBy('name')
            ->get(['id', 'agent_id', 'name', 'partner_type']);

        // A NAME only. Booking with the default sends no vendor, and the cost sheet resolves the airline exactly as it
        // always does — so what is shown here and what is booked cannot come from two different lookups.
        $rows->each(function ($row) use ($airlines) {
            $row->default_supplier = $row->transport_mode === 'air' ? ($airlines[$this->awbPrefix($row)] ?? null) : null;
        });

        return response()->json([
            'rows' => $rows,
            'total' => round((float) $rows->sum('billed'), 2),
            // Per branch: a supplier's GSTIN is a state registration, so a voucher is raised against the branch's own.
            'suppliers' => $suppliers->groupBy('agent_id'),
            'charge_types' => JobCostSheetController::CHARGE_TYPES,
            'can_book' => \Illuminate\Support\Facades\Gate::allows('bookLateCost'),
        ]);
    }

    private function awbPrefix(object $row): ?string
    {
        $prefix = substr(preg_replace('/\D/', '', (string) $row->awb_number), 0, 3);

        return strlen($prefix) === 3 ? $prefix : null;
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
