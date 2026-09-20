<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\ProfitabilityService;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * What each shipment, each client and each lane actually made (user, 2026-09-20).
 *
 * Three views of ONE calculation. A client roll-up that disagreed with the shipments under it, or a lane total
 * that disagreed with both, would leave the desk choosing which screen to believe — so all three come from
 * `ProfitabilityService::jobs()` and the two roll-ups are that list, grouped.
 *
 * 🔒 `viewFinancials`: the Boss and accounts. Margin is the number the Boss runs the business on.
 */
class ProfitabilityController extends Controller
{
    public function __construct(private readonly ProfitabilityService $profit) {}

    /** Shipment by shipment. */
    public function jobs(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $rows = $this->rows($request);

        return response()->json(array_merge([
            'jobs' => $this->sort($rows, $request)->take(500)->values(),
            'totals' => $this->profit->totals($rows),
        ], $this->context()));
    }

    /** The same shipments, by client. */
    public function clients(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $rows = $this->rows($request);

        return response()->json(array_merge([
            'groups' => $this->profit->rollUp($rows, 'client'),
            'totals' => $this->profit->totals($rows),
        ], $this->context()));
    }

    /** The same shipments, by lane — which is what pricing buys against. */
    public function lanes(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $rows = $this->rows($request);
        $groups = $this->profit->rollUp($rows, 'lane');

        // Put a name to the codes where we have one, so a lane reads as a route rather than a pair of initials.
        $names = $this->profit->placeNames($groups->flatMap(fn ($g) => [$g['origin'] ?? null, $g['dest'] ?? null])->all());

        $groups = $groups->map(function ($group) use ($names) {
            $group['origin_name'] = $names[$group['origin']] ?? null;
            $group['dest_name'] = $names[$group['dest']] ?? null;

            return $group;
        });

        return response()->json(array_merge([
            'groups' => $groups,
            'totals' => $this->profit->totals($rows),
        ], $this->context()));
    }

    /** Any of the three as a CSV. */
    public function export(Request $request): Response
    {
        $this->authorize('viewFinancials');

        $rows = $this->rows($request);
        $by = $request->string('by')->toString();

        $csv = fopen('php://temp', 'r+');

        if ($by === 'client' || $by === 'lane') {
            fputcsv($csv, [$by === 'client' ? 'Client' : 'Lane', 'Mode', 'Shipments', 'Revenue', 'Cost', 'Margin',
                'Margin %', 'Margin each', 'No cost booked', 'Not billed']);

            foreach ($this->profit->rollUp($rows, $by) as $group) {
                fputcsv($csv, [$group['name'], $group['mode'] ?? '', $group['shipments'], $group['revenue'],
                    $group['cost'], $group['margin'], $group['margin_pct'], $group['margin_each'],
                    $group['no_cost_booked'], $group['not_billed']]);
            }
        } else {
            fputcsv($csv, ['Shipment', 'Date', 'Client', 'Lane', 'Mode', 'AWB', 'Revenue', 'Cost', 'Margin',
                'Margin %', 'Warning']);

            foreach ($this->sort($rows, $request) as $job) {
                fputcsv($csv, [$job->job_no, $job->job_date, $job->customer, $job->lane, $job->mode, $job->awb_number,
                    $job->revenue, $job->cost, $job->margin, $job->margin_pct,
                    $job->no_cost_booked ? 'no cost booked' : ($job->not_billed ? 'not billed' : '')]);
            }
        }

        rewind($csv);

        return response(stream_get_contents($csv), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="profitability-' . ($by ?: 'jobs') . '-' . now()->format('Ymd') . '.csv"',
        ]);
    }

    private function rows(Request $request)
    {
        return $this->profit->jobs($this->branches()->pluck('id')->all(), array_filter([
            'agent_id' => $request->integer('agent_id') ?: null,
            'customer_id' => $request->integer('customer_id') ?: null,
            'mode' => $request->string('mode')->toString() ?: null,
            'origin' => $request->string('origin')->toString() ?: null,
            'dest' => $request->string('dest')->toString() ?: null,
            'from' => $request->string('from')->toString() ?: null,
            'to' => $request->string('to')->toString() ?: null,
            'q' => $request->string('q')->toString() ?: null,
        ]));
    }

    /**
     * ⚠️ Losses first by default. A profitability report sorted by revenue puts the biggest shipments on top,
     * which is the list you already know; the one worth opening is the one that lost money.
     */
    private function sort($rows, Request $request)
    {
        $rows = collect($rows);

        return match ($request->string('sort')->toString()) {
            'revenue' => $rows->sortByDesc('revenue'),
            'margin_pct' => $rows->sortBy(fn ($r) => $r->margin_pct ?? PHP_INT_MAX),
            'date' => $rows->sortByDesc('job_date'),
            default => $rows->sortBy('margin'),
        };
    }

    /** What the filters need to offer, on every answer. */
    private function context(): array
    {
        $branches = $this->branches();

        return [
            'branches' => $branches,
            'clients' => DB::table('customers')
                ->where('company_id', UserContext::for(auth()->user())->companyId)
                ->orderBy('name')->get(['id', 'name']),
            'modes' => DB::table('jobs')->whereIn('agent_id', $branches->pluck('id'))
                ->whereNotNull('transport_mode')->distinct()->orderBy('transport_mode')->pluck('transport_mode'),
        ];
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
