<?php

namespace App\Services;

use App\Support\BillingDocuments;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * What is owed, and how long it has been owed (user, 2026-09-20).
 *
 * 🔴 **A CREDIT NOTE SUBTRACTS.** It carries a positive amount on its face — that is what the client receives — but
 * it reduces what they owe. An ageing that adds it reports a client as owing more the moment we give money back,
 * and the collections queue then chases them for it.
 *
 * 🔴 **Age is measured from the DUE date, not the document date.** A bill raised on the 1st with 30 days to pay is
 * not overdue on the 2nd. Where no due date was set the document date stands in — that is the strictest reading,
 * and it is visible as such rather than silently generous.
 *
 * ⚠️ Ageing is per BRANCH, like the credit gate (PRD §1.2): one branch's overdue invoice is not another's problem.
 * The screen rolls branches up for reading; the figures underneath stay branch-scoped.
 */
class AgeingService
{
    /** Past-due bands, in days. `not_due` is everything that has not reached its due date. */
    public const BUCKETS = [
        'not_due' => 'Not due yet',
        'd1_30' => '1 – 30 days',
        'd31_60' => '31 – 60 days',
        'd61_90' => '61 – 90 days',
        'd90_plus' => 'Over 90 days',
    ];

    /** Statuses that represent money genuinely owed. A draft is not owed; a void never was. */
    public const OWED = ['finalized', 'sent', 'partially_paid'];

    /**
     * Every open document, as one flat list with its age worked out.
     *
     * @return \Illuminate\Support\Collection<int, object>
     */
    public function documents(array $branchIds, ?Carbon $asOf = null, array $filters = [])
    {
        $asOf = ($asOf ?? now())->startOfDay();

        $rows = DB::table('accounts_invoices as i')
            ->leftJoin('customers as c', 'c.id', '=', 'i.customer_id')
            ->leftJoin('partners as p', function ($join) {
                $join->on('p.id', '=', 'i.billed_party_id')->where('i.billed_party_type', '=', 'partner');
            })
            ->leftJoin('jobs as j', 'j.id', '=', 'i.job_id')
            ->whereIn('i.agent_id', $branchIds)
            ->whereIn('i.status', self::OWED)
            ->when(! empty($filters['agent_id']), fn ($q) => $q->where('i.agent_id', $filters['agent_id']))
            // 🔴 COALESCE, not `billed_party_id` alone. Older invoices carry only `customer_id`, and grouping on the
            // raw column split one client into two rows — a NULL row of 24 documents and a real row of 1 — which
            // reads on the ageing as two organizations owing half each.
            ->when(! empty($filters['party_type']), fn ($q) => $q->whereRaw(
                "COALESCE(i.billed_party_type, 'customer') = ?", [$filters['party_type']]))
            ->when(! empty($filters['party_id']), fn ($q) => $q->whereRaw(
                'COALESCE(i.billed_party_id, i.customer_id) = ?', [$filters['party_id']]))
            ->when(! empty($filters['q']), function ($q) use ($filters) {
                $term = '%' . $filters['q'] . '%';
                $q->where(fn ($w) => $w->where('c.name', 'like', $term)->orWhere('p.name', 'like', $term)
                    ->orWhere('i.invoice_no', 'like', $term));
            })
            ->get([
                'i.id', 'i.agent_id', 'i.invoice_no', 'i.type', 'i.document_date', 'i.due_date', 'i.status',
                'i.currency', 'i.exchange_rate', 'i.grand_total', 'i.amount_paid',
                DB::raw("COALESCE(i.billed_party_type, 'customer') AS party_type"),
                DB::raw('COALESCE(i.billed_party_id, i.customer_id) AS party_id'),
                'j.execution_job_no as job_no',
                DB::raw('COALESCE(c.name, p.name) AS party_name'),
                DB::raw('COALESCE(c.email_domain, p.email) AS party_contact'),
            ]);

        foreach ($rows as $row) {
            // No due date set: the document date stands in, and the screen says so.
            $due = Carbon::parse($row->due_date ?: $row->document_date)->startOfDay();

            $row->due_assumed = $row->due_date === null;
            $row->due_on = $due->toDateString();
            $row->days_overdue = max(0, $due->diffInDays($asOf, false));
            $row->label = BillingDocuments::label($row->type);
            // 🔴 A credit note counts the other way; see the class docblock.
            $row->sign = $row->type === 'credit_note' ? -1 : 1;
            $row->outstanding = round($row->sign * ((float) $row->grand_total - (float) $row->amount_paid), 2);
            $row->outstanding_inr = round($row->outstanding * (float) ($row->exchange_rate ?: 1), 2);
            $row->bucket = $this->bucket($row->days_overdue, $due, $asOf);
        }

        return $rows;
    }

    /** One party per row, with a column per bucket — the ageing everybody means by "the ageing". */
    public function byParty(array $branchIds, ?Carbon $asOf = null, array $filters = [])
    {
        $parties = [];

        foreach ($this->documents($branchIds, $asOf, $filters) as $row) {
            $key = $row->party_type . ':' . $row->party_id;

            $parties[$key] ??= array_merge(
                ['party_type' => $row->party_type, 'party_id' => $row->party_id, 'name' => $row->party_name,
                 'total' => 0.0, 'documents' => 0, 'oldest_days' => 0, 'contact' => $row->party_contact],
                array_fill_keys(array_keys(self::BUCKETS), 0.0)
            );

            $parties[$key][$row->bucket] += $row->outstanding_inr;
            $parties[$key]['total'] += $row->outstanding_inr;
            $parties[$key]['documents']++;
            $parties[$key]['oldest_days'] = max($parties[$key]['oldest_days'], $row->days_overdue);
        }

        return collect($parties)->map(function ($party) {
            foreach (array_keys(self::BUCKETS) as $bucket) {
                $party[$bucket] = round($party[$bucket], 2);
            }

            $party['total'] = round($party['total'], 2);
            // What is actually late, which is what a collections desk sorts by.
            $party['overdue'] = round($party['total'] - $party['not_due'], 2);

            return $party;
        })->sortByDesc('overdue')->values();
    }

    /** The column under each bucket, and the grand total. */
    public function totals($parties): array
    {
        $totals = array_fill_keys(array_keys(self::BUCKETS), 0.0);

        foreach ($parties as $party) {
            foreach (array_keys(self::BUCKETS) as $bucket) {
                $totals[$bucket] += $party[$bucket];
            }
        }

        $totals = array_map(fn ($v) => round($v, 2), $totals);
        $totals['total'] = round(array_sum($totals), 2);
        $totals['overdue'] = round($totals['total'] - $totals['not_due'], 2);

        return $totals;
    }

    private function bucket(int $daysOverdue, Carbon $due, Carbon $asOf): string
    {
        if ($due->greaterThanOrEqualTo($asOf)) {
            return 'not_due';
        }

        return match (true) {
            $daysOverdue <= 30 => 'd1_30',
            $daysOverdue <= 60 => 'd31_60',
            $daysOverdue <= 90 => 'd61_90',
            default => 'd90_plus',
        };
    }
}
