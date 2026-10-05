<?php

namespace App\Services\Sales;

use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * The quarterly staff review — one per client and mode, each financial-year quarter (owner, 2026-10-05; GAPS #457).
 *
 * When a quarter has closed, two drafts are prepared for each client worked in it, once:
 *   - the **Boss's**, to the client's salesperson only — one client can have many ops staff, and sales coordinates them;
 *   - the **salesperson's**, to the ops and pricing staff who worked the client that quarter.
 * Both carry the whole quarter beside the one before (so the company can see it improving): enquiries won and lost with
 * the reason and who priced them, cancellations, the airline's rejections (FNA), how much slower than our normal our
 * own steps ran, the declared-vs-actual weight gap, and every job and AWB, each with its ops and pricing person.
 *
 * 🔒 Internal: addressed to staff user ids only, never a client contact (PRD §7.3.7, kept). Command only (§7.3.8).
 * 🔴 Nothing is sent from here — the Boss or the salesperson reads, edits and sends from their own mailbox.
 */
class StaffReviews
{
    public const KIND = 'quarterly_review';

    /** As the Inbox labels them (JobInbox.vue). */
    public const LOST_REASONS = [
        'rates_high' => 'Rates too high',
        'delay_in_response' => 'We replied too slowly',
        'client_cancelled' => 'Client cancelled the shipment',
        'capacity_issue' => 'No capacity',
        'other' => 'Other',
    ];

    public function __construct(private readonly OpsScorecard $ops) {}

    /** Prepare the last closed quarter's reviews that do not exist yet. Returns how many drafts were added. */
    public function prepare(int $companyId, Carbon $date): int
    {
        if (DB::table('companies')->where('id', $companyId)->value('tier') !== 'command') {
            return 0;
        }

        $current = OpsScorecard::quarterStart($date);
        $quarter = $current->copy()->subMonths(3);
        $end = $current->copy()->subSecond();
        $branchIds = DB::table('agents_info')->where('company_id', $companyId)->pluck('id')->all();

        if ($branchIds === []) {
            return 0;
        }

        $worked = fn (string $table) => DB::table($table)->whereIn('agent_id', $branchIds)->whereNotNull('customer_id')
            ->whereNull('deleted_at')->whereBetween('created_at', [$quarter, $end])
            ->select('customer_id', 'transport_mode')->distinct()->get();
        $pairs = $worked('jobs')->concat($worked('enquiries'))->unique(fn ($p) => $p->customer_id . '|' . $p->transport_mode);

        $added = 0;
        foreach ($pairs as $pair) {
            $added += $this->prepareOne($companyId, $branchIds, (int) $pair->customer_id, $pair->transport_mode, $quarter, $end);
        }

        return $added;
    }

    private function prepareOne(int $companyId, array $branchIds, int $customerId, string $mode, Carbon $quarter, Carbon $end): int
    {
        $customer = DB::table('customers')->find($customerId);

        // Nobody to address the review to: the Boss has no salesperson to send it to, the salesperson does not exist.
        if ($customer === null || $customer->sales_id === null) {
            return 0;
        }

        $key = fn (string $who) => self::KIND . ":{$who}:{$customerId}:{$mode}:{$quarter->toDateString()}";
        $exists = DB::table('boss_mail_suggestions')->where('company_id', $companyId)
            ->whereIn('rest_key', [$key('boss'), $key('sales')])->pluck('rest_key')->flip();

        if (isset($exists[$key('boss')]) && isset($exists[$key('sales')])) {
            return 0;
        }

        $agentId = in_array((int) $customer->branch_id, $branchIds, true) ? (int) $customer->branch_id : $branchIds[0];
        $facts = $this->facts($branchIds, $customer, $mode, $quarter, $end);
        // The closed quarter's scorecard, final — the record next quarter's review compares against.
        $this->ops->record($agentId, $customerId, $mode, $quarter, $facts['_ops']);
        unset($facts['_ops']);

        $team = collect($facts['_team'])->reject(fn ($id) => $id === (int) $customer->sales_id)->values()->all();
        unset($facts['_team']);

        $rows = [];
        if (! isset($exists[$key('boss')])) {
            $rows[] = ['owner' => null, 'who' => 'boss', 'to' => [(int) $customer->sales_id]];
        }
        if (! isset($exists[$key('sales')]) && $team !== []) {
            $rows[] = ['owner' => (int) $customer->sales_id, 'who' => 'sales', 'to' => $team];
        }

        foreach ($rows as $r) {
            DB::table('boss_mail_suggestions')->insert([
                'company_id' => $companyId, 'agent_id' => $agentId, 'owner_user_id' => $r['owner'], 'kind' => self::KIND,
                'rest_key' => $key($r['who']), 'priority' => 0,
                'facts' => json_encode($facts + ['version' => $r['who']], JSON_UNESCAPED_UNICODE),
                'suggested_to' => json_encode($r['to']), 'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        return count($rows);
    }

    private function facts(array $branchIds, object $customer, string $mode, Carbon $quarter, Carbon $end): array
    {
        $previous = $quarter->copy()->subMonths(3);
        $previousEnd = $quarter->copy()->subSecond();

        $jobs = $this->jobs($branchIds, $customer->id, $mode, $quarter, $end);
        $enquiries = $this->enquiries($branchIds, $customer->id, $mode, $quarter, $end);
        $previousJobs = $this->jobs($branchIds, $customer->id, $mode, $previous, $previousEnd);
        $previousEnquiries = $this->enquiries($branchIds, $customer->id, $mode, $previous, $previousEnd);

        $people = DB::table('users')->whereIn('id', $jobs->pluck('ops_id')->concat($jobs->pluck('pricing_id'))
            ->concat($enquiries->pluck('pricing_id'))->push($customer->sales_id)->filter()->unique())
            ->pluck('name', 'id');
        $name = fn ($id) => $id === null ? null : ($people[$id] ?? null);

        $rejections = $this->rejections($jobs);
        $ops = $this->ops->measure($branchIds, $customer->id, $mode, $quarter, $end);
        $before = $this->ops->measure($branchIds, $customer->id, $mode, $previous, $previousEnd);

        $job = fn ($j) => [
            'job' => $this->jobLabel($j), 'awb' => $j->awb_number, 'status' => $j->status,
            'ops' => $name($j->ops_id), 'pricing' => $name($j->pricing_id),
        ];

        return [
            'client' => $customer->name, 'client_id' => (int) $customer->id, 'mode' => $mode,
            'quarter' => OpsScorecard::quarterLabel($quarter), 'previous_quarter' => OpsScorecard::quarterLabel($previous),
            'sales' => $name($customer->sales_id),
            'ops_staff' => $jobs->pluck('ops_id')->filter()->unique()->map($name)->filter()->values()->all(),
            'pricing_staff' => $jobs->pluck('pricing_id')->concat($enquiries->pluck('pricing_id'))->filter()->unique()
                ->map($name)->filter()->values()->all(),
            'enquiries' => $this->funnel($enquiries), 'previous_enquiries' => $this->funnel($previousEnquiries),
            'lost' => $enquiries->where('status', 'lost')->map(fn ($e) => [
                'enquiry' => $e->enquiry_no,
                'reason' => $e->lost_reason === 'other' && $e->lost_reason_custom
                    ? $e->lost_reason_custom : (self::LOST_REASONS[$e->lost_reason] ?? 'No reason recorded'),
                'pricing' => $name($e->pricing_id),
            ])->values()->all(),
            'shipments' => $jobs->where('status', '!=', 'Cancelled')->count(),
            'previous_shipments' => $previousJobs->where('status', '!=', 'Cancelled')->count(),
            'cancelled' => $jobs->where('status', 'Cancelled')->map(fn ($j) => $job($j) + [
                'reason' => $j->cancellation_reason_custom
                    ?: (\App\Http\Controllers\Freight\JobController::CANCELLATION_REASONS[$j->cancellation_reason] ?? 'No reason recorded'),
            ])->values()->all(),
            'rejected_by_airline' => $jobs->filter(fn ($j) => isset($rejections[$j->awb_number]))
                ->map(fn ($j) => $job($j) + ['reason' => $rejections[$j->awb_number]])->values()->all(),
            'our_steps' => ['days_slower' => $ops['days_slower'], 'step_deltas' => $ops['step_deltas'],
                'previous_days_slower' => $before['days_slower']],
            'rates' => [
                'cancellation_rate' => $ops['cancellation_rate'], 'previous_cancellation_rate' => $before['cancellation_rate'],
                'fna_rate' => $ops['fna_rate'], 'previous_fna_rate' => $before['fna_rate'],
                'weight_gap_pct' => $ops['weight_gap_pct'], 'previous_weight_gap_pct' => $before['weight_gap_pct'],
            ],
            'jobs' => $jobs->map($job)->values()->all(),
            '_ops' => $ops,
            '_team' => DB::table('users')->whereIn('id', $jobs->pluck('ops_id')->concat($jobs->pluck('pricing_id'))
                ->concat($enquiries->pluck('pricing_id'))->filter()->unique())
                ->where('is_active', 1)->pluck('id')->map(fn ($id) => (int) $id)->all(),
        ];
    }

    private function jobs(array $branchIds, int $customerId, string $mode, Carbon $from, Carbon $to): Collection
    {
        return DB::table('jobs')->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->whereNull('deleted_at')->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at')
            ->get(['id', 'execution_job_no', 'job_order_no', 'awb_number', 'status', 'ops_id', 'pricing_id',
                'cancellation_reason', 'cancellation_reason_custom']);
    }

    private function enquiries(array $branchIds, int $customerId, string $mode, Carbon $from, Carbon $to): Collection
    {
        return DB::table('enquiries')->whereIn('agent_id', $branchIds)->where('customer_id', $customerId)
            ->where('transport_mode', $mode)->whereNull('deleted_at')->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at')
            ->get(['id', 'enquiry_no', 'status', 'lost_reason', 'lost_reason_custom', 'pricing_id']);
    }

    private function funnel(Collection $enquiries): array
    {
        return ['total' => $enquiries->count(), 'converted' => $enquiries->where('status', 'converted')->count(),
            'lost' => $enquiries->where('status', 'lost')->count()];
    }

    /** AWB => the airline's reason, for each waybill it rejected (FNA) at least once. */
    private function rejections(Collection $jobs): array
    {
        $awbs = $jobs->pluck('awb_number')->filter()->unique()->values()->all();

        return $awbs === [] ? [] : DB::table('status_response')->whereIn('business_id', $awbs)
            ->where('business_status_code', 'Rejected')->orderBy('id')->get(['business_id', 'reason'])
            ->groupBy('business_id')
            ->map(fn ($rows) => trim((string) $rows->first()->reason) ?: 'No reason given')
            ->all();
    }

    private function jobLabel(object $j): string
    {
        return $j->execution_job_no ?: ($j->job_order_no ?: 'Job ' . $j->id);
    }
}
