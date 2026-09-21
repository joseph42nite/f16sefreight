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

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
