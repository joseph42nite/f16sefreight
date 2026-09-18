<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\Bank\VendorStatements;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Supplier statements — every kind of supplier, not only airlines (user, 2026-09-19).
 *
 * An airline's CASS, a trucker's month, a broker's or a warehouse's: import what they say we owe, compare it with our
 * own vouchers shipment by shipment, and query what does not agree. 🔒 Reading is `viewFinancials`; importing and
 * disputing are accounts'.
 */
class VendorStatementController extends Controller
{
    public function __construct(private readonly VendorStatements $statements) {}

    /** Every statement, newest first, with how its lines stand. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');
        $branches = $this->branches();

        $rows = DB::table('vendor_statements as s')
            ->join('partners as p', 'p.id', '=', 's.vendor_id')
            ->join('agents_info as a', 'a.id', '=', 's.agent_id')
            ->whereIn('s.agent_id', $branches->pluck('id'))
            ->when($request->filled('agent_id'), fn ($q) => $q->where('s.agent_id', $request->integer('agent_id')))
            ->when($request->filled('vendor_type'), fn ($q) => $q->where('s.vendor_type', $request->string('vendor_type')))
            ->orderByDesc('s.created_at')
            ->get(['s.id', 's.period', 's.statement_no', 's.statement_date', 's.currency', 's.their_total', 's.status',
                   's.vendor_type', 'p.name as vendor', 'a.agent_name as branch']);

        foreach ($rows as $row) {
            $states = DB::table('vendor_statement_lines')->where('vendor_statement_id', $row->id)
                ->selectRaw('state, COUNT(*) AS n, COALESCE(SUM(difference), 0) AS diff')->groupBy('state')->get();

            $row->lines = (int) $states->sum('n');
            $row->by_state = $states->pluck('n', 'state');
            $row->difference = round((float) $states->sum('diff'), 2);
        }

        return response()->json([
            'statements' => $rows,
            'branches' => $branches,
            // Every kind of supplier can be reconciled this way, so the whole list is offered.
            'vendor_types' => \App\Partner::TYPES,
            'states' => VendorStatements::STATES,
        ]);
    }

    /** One statement, line by line, with our figure beside theirs. */
    public function show(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');
        $statement = $this->own($id);

        $lines = DB::table('vendor_statement_lines as l')
            ->leftJoin('jobs as j', 'j.id', '=', 'l.matched_job_id')
            ->where('l.vendor_statement_id', $id)
            ->orderByRaw("FIELD(l.state, 'different', 'not_booked', 'unmatched', 'agreed')")
            ->get(['l.*', 'j.execution_job_no as job_no']);

        return response()->json([
            'statement' => $statement,
            'lines' => $lines,
            'totals' => [
                'theirs' => round((float) $lines->sum('their_amount'), 2),
                'ours' => round((float) $lines->sum('our_amount'), 2),
                'difference' => round((float) $lines->sum('difference'), 2),
            ],
            'states' => VendorStatements::STATES,
        ]);
    }

    /** Import one supplier's period. Sending it again replaces that period. */
    public function import(Request $request): JsonResponse
    {
        $this->authorize('reconcile');

        $data = $request->validate([
            'agent_id' => 'required|integer',
            'vendor_id' => 'required|integer|exists:partners,id',
            'period' => 'required|string|max:50',
            'statement_no' => 'nullable|string|max:60',
            'statement_date' => 'nullable|date',
            'currency' => 'nullable|string|size:3',
            'csv' => 'required_without:lines|nullable|string',
            'lines' => 'required_without:csv|nullable|array',
        ]);

        if (! $this->branches()->contains('id', (int) $data['agent_id'])) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        $lines = $data['lines'] ?? $this->statements->fromCsv($data['csv']);
        $id = $this->statements->import((int) $data['agent_id'], (int) $data['vendor_id'], $data['period'], $lines, $data, auth()->id());

        return $this->show($id);
    }

    /** Compare again — vouchers move, and a line that had no cost booked last week may have one today. */
    public function recompare(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');
        $this->own($id);
        $this->statements->compare($id);

        return $this->show($id);
    }

    /** Mark a line as queried with the supplier, in words somebody can read later. */
    public function dispute(Request $request, int $id, int $lineId): JsonResponse
    {
        $this->authorize('reconcile');
        $this->own($id);

        $data = $request->validate(['dispute_note' => 'nullable|string|max:500']);

        DB::table('vendor_statement_lines')->where('id', $lineId)->where('vendor_statement_id', $id)
            ->update(['dispute_note' => $data['dispute_note'] ?? null, 'updated_at' => now()]);
        DB::table('vendor_statements')->where('id', $id)->update(['status' => 'disputed', 'updated_at' => now()]);

        return $this->show($id);
    }

    /** The mail that asks the supplier about what does not agree. Nothing is sent here. */
    public function draftQuery(int $id): JsonResponse
    {
        $this->authorize('viewFinancials');
        $statement = $this->own($id);

        $lines = DB::table('vendor_statement_lines as l')->leftJoin('jobs as j', 'j.id', '=', 'l.matched_job_id')
            ->where('l.vendor_statement_id', $id)->whereIn('l.state', ['different', 'not_booked'])
            ->orderByDesc(DB::raw('ABS(COALESCE(l.difference, l.their_amount))'))
            ->limit(15)
            ->get(['l.reference', 'l.description', 'l.their_amount', 'l.our_amount', 'l.difference', 'l.state', 'j.execution_job_no as job_no']);

        if ($lines->isEmpty()) {
            return response()->json(['error' => 'Nothing on this statement disagrees with our vouchers.', 'reason' => 'nothing_to_query'], 422);
        }

        $facts = [
            'vendor' => $statement->vendor,
            'period' => $statement->period,
            'statement_no' => $statement->statement_no,
            'their_total' => round((float) $statement->their_total, 2),
            'difference_total' => round((float) $lines->sum(fn ($l) => (float) ($l->difference ?? $l->their_amount)), 2),
            'lines' => $lines->map(fn ($l) => array_filter([
                'reference' => $l->reference, 'shipment' => $l->job_no, 'description' => $l->description,
                'they_billed' => round((float) $l->their_amount, 2),
                'we_booked' => $l->our_amount === null ? null : round((float) $l->our_amount, 2),
                'difference' => $l->difference === null ? null : round((float) $l->difference, 2),
                'state' => $l->state,
            ], fn ($v) => $v !== null))->all(),
        ];

        $draft = app(\App\Services\Bank\PaymentQueryDrafter::class)->draft('vendor_difference', $facts, auth()->user());

        return response()->json($draft + [
            'to' => array_values(array_filter([DB::table('partners')->where('id', $statement->vendor_id)->value('email')])),
            'facts' => $facts,
        ]);
    }

    /** A statement of the caller's own company, or 404. */
    private function own(int $id): object
    {
        $statement = DB::table('vendor_statements as s')->join('partners as p', 'p.id', '=', 's.vendor_id')
            ->where('s.id', $id)->whereIn('s.agent_id', $this->branches()->pluck('id'))
            ->first(['s.*', 'p.name as vendor', 'p.email as vendor_email']);

        abort_if($statement === null, 404, 'That statement is not one of yours.');

        return $statement;
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
