<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * What each shipment actually made (user, 2026-09-20).
 *
 * 🔴 **PROFIT IS NET OF TAX.** Revenue is the invoice SUBTOTAL and cost is the voucher line AMOUNT — never the
 * grand totals. GST is a liability we collect and an asset we reclaim; folding either into a margin overstates
 * every shipment by the tax on it, and a lane that looks 18% better than it is gets priced accordingly.
 *
 * 🔴 **A credit note SUBTRACTS revenue; a debit note adds it.** Same rule as the ageing and the credit gate: the
 * note's face is positive, and what it does to the figure is not.
 *
 * ⚠️ **A job's whole P&L stays together.** The window filters on the SHIPMENT's own date, and then every rupee
 * billed and booked against it counts, whenever the paperwork was raised. Filtering on the document date instead
 * would split one shipment across two months and report both halves as thin.
 */
class ProfitabilityService
{
    /** Documents that represent real billing. A draft was never sent; a void never stood. */
    private const BILLED = ['finalized', 'sent', 'partially_paid', 'paid'];

    /**
     * One row per shipment: what it billed, what it cost, and what that leaves.
     *
     * @return \Illuminate\Support\Collection<int, object>
     */
    public function jobs(array $branchIds, array $filters = [])
    {
        $revenue = DB::table('accounts_invoices')
            ->whereIn('status', self::BILLED)
            ->selectRaw('job_id, SUM(CASE WHEN type = ? THEN -1 ELSE 1 END * subtotal * exchange_rate) AS revenue',
                ['credit_note'])
            ->groupBy('job_id');

        $cost = DB::table('accounts_purchase_items as i')
            ->join('accounts_purchase_vouchers as v', 'v.id', '=', 'i.purchase_voucher_id')
            ->selectRaw('v.job_id, SUM(i.amount) AS cost, COUNT(DISTINCT v.id) AS vouchers')
            ->groupBy('v.job_id');

        $rows = DB::table('jobs as j')
            ->leftJoin('enquiries as e', 'e.id', '=', 'j.enquiry_id')
            ->leftJoinSub($revenue, 'r', 'r.job_id', '=', 'j.id')
            ->leftJoinSub($cost, 'c', 'c.job_id', '=', 'j.id')
            ->leftJoin('customers as cu', 'cu.id', '=', DB::raw('COALESCE(j.customer_id, e.customer_id)'))
            ->leftJoin('agents_info as a', 'a.id', '=', 'j.agent_id')
            ->whereIn('j.agent_id', $branchIds)
            ->whereNull('j.deleted_at')
            // A shipment with neither revenue nor cost has no P&L to report; it is work in progress.
            ->where(fn ($q) => $q->whereNotNull('r.revenue')->orWhereNotNull('c.cost'))
            ->when(! empty($filters['agent_id']), fn ($q) => $q->where('j.agent_id', $filters['agent_id']))
            ->when(! empty($filters['customer_id']), fn ($q) => $q->whereRaw(
                'COALESCE(j.customer_id, e.customer_id) = ?', [$filters['customer_id']]))
            ->when(! empty($filters['mode']), fn ($q) => $q->where('j.transport_mode', $filters['mode']))
            ->when(! empty($filters['origin']), fn ($q) => $q->where('e.origin_code', $filters['origin']))
            ->when(! empty($filters['dest']), fn ($q) => $q->where('e.dest_code', $filters['dest']))
            ->when(! empty($filters['from']), fn ($q) => $q->whereRaw(
                'DATE(COALESCE(j.completed_at, j.created_at)) >= ?', [$filters['from']]))
            ->when(! empty($filters['to']), fn ($q) => $q->whereRaw(
                'DATE(COALESCE(j.completed_at, j.created_at)) <= ?', [$filters['to']]))
            ->when(! empty($filters['q']), function ($q) use ($filters) {
                $term = '%' . $filters['q'] . '%';
                $q->where(fn ($w) => $w->where('j.execution_job_no', 'like', $term)
                    ->orWhere('j.awb_number', 'like', $term)->orWhere('cu.name', 'like', $term));
            })
            ->get([
                'j.id', 'j.execution_job_no as job_no', 'j.awb_number', 'j.transport_mode as mode', 'j.status',
                'j.completed_at', 'j.created_at', 'e.origin_code', 'e.dest_code',
                'cu.id as customer_id', 'cu.name as customer', 'a.agent_name as branch',
                DB::raw('COALESCE(r.revenue, 0) AS revenue'),
                DB::raw('COALESCE(c.cost, 0) AS cost'),
                DB::raw('COALESCE(c.vouchers, 0) AS vouchers'),
            ]);

        foreach ($rows as $row) {
            $row->revenue = round((float) $row->revenue, 2);
            $row->cost = round((float) $row->cost, 2);
            $row->margin = round($row->revenue - $row->cost, 2);
            // NULL, never 0%, on no revenue: a shipment that billed nothing has no margin, and reporting 0% reads
            // as "we broke even".
            $row->margin_pct = $row->revenue > 0 ? round($row->margin / $row->revenue * 100, 2) : null;
            $row->job_date = substr((string) ($row->completed_at ?: $row->created_at), 0, 10);
            $row->lane = $this->lane($row->origin_code, $row->dest_code);
            // 🔴 Said out loud. A shipment billed with no cost booked shows a 100% margin that is not real, and it
            // is the single most common way a profitability report lies.
            $row->no_cost_booked = $row->revenue > 0 && (int) $row->vouchers === 0;
            $row->not_billed = $row->cost > 0 && $row->revenue <= 0;
        }

        return $rows;
    }

    /** The same shipments rolled up by whichever column is asked for. */
    public function rollUp($jobs, string $by): \Illuminate\Support\Collection
    {
        $groups = [];

        foreach ($jobs as $job) {
            [$key, $label, $extra] = match ($by) {
                'client' => ['c:' . ($job->customer_id ?: 0), $job->customer ?: 'No client on the shipment',
                             ['customer_id' => $job->customer_id]],
                default => ['l:' . $job->lane . ':' . $job->mode, $job->lane,
                            ['origin' => $job->origin_code, 'dest' => $job->dest_code, 'mode' => $job->mode]],
            };

            $groups[$key] ??= array_merge(['key' => $key, 'name' => $label, 'shipments' => 0,
                'revenue' => 0.0, 'cost' => 0.0, 'no_cost_booked' => 0, 'not_billed' => 0], $extra);

            $groups[$key]['shipments']++;
            $groups[$key]['revenue'] += $job->revenue;
            $groups[$key]['cost'] += $job->cost;
            $groups[$key]['no_cost_booked'] += $job->no_cost_booked ? 1 : 0;
            $groups[$key]['not_billed'] += $job->not_billed ? 1 : 0;
        }

        return collect($groups)->map(function ($group) {
            $group['revenue'] = round($group['revenue'], 2);
            $group['cost'] = round($group['cost'], 2);
            $group['margin'] = round($group['revenue'] - $group['cost'], 2);
            $group['margin_pct'] = $group['revenue'] > 0 ? round($group['margin'] / $group['revenue'] * 100, 2) : null;
            // What one shipment on this lane, or for this client, is worth on average.
            $group['margin_each'] = round($group['margin'] / max(1, $group['shipments']), 2);

            return $group;
        })->sortByDesc('margin')->values();
    }

    /** The figures under the table. */
    public function totals($rows): array
    {
        $revenue = round(collect($rows)->sum('revenue'), 2);
        $cost = round(collect($rows)->sum('cost'), 2);

        return [
            'count' => count($rows),
            'revenue' => $revenue,
            'cost' => $cost,
            'margin' => round($revenue - $cost, 2),
            'margin_pct' => $revenue > 0 ? round(($revenue - $cost) / $revenue * 100, 2) : null,
            // How much of this report cannot be trusted, stated rather than left to be discovered.
            'no_cost_booked' => collect($rows)->where('no_cost_booked', true)->count(),
            'not_billed' => collect($rows)->where('not_billed', true)->count(),
        ];
    }

    /** `BOM → FRA`, or what we have of it. */
    private function lane(?string $origin, ?string $dest): string
    {
        if (blank($origin) && blank($dest)) {
            return 'Lane not recorded';
        }

        return ($origin ?: '???') . ' → ' . ($dest ?: '???');
    }

    /**
     * Port and airport names for the codes in use.
     *
     * ⚠️ Air codes resolve from `locations`; sea LOCODEs do not, because `ports` is empty (GAPS #375). A code with
     * no name shows as the code, which is what the desk calls it anyway.
     */
    public function placeNames(array $codes): array
    {
        return DB::table('locations')->whereIn('iata_code', array_filter($codes))
            ->pluck('destination', 'iata_code')->all();
    }
}
