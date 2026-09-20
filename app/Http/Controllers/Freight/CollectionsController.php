<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Services\AgeingService;
use App\Services\AuditLogger;
use App\Support\UserContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ageing and collections (user, 2026-09-20).
 *
 * Two halves of one job: **who owes what, and for how long**, and **what has been done about it**. They are one
 * screen because a collections queue without the ageing beside it is a to-do list nobody trusts, and an ageing
 * without the chasing is a report nobody acts on.
 *
 * 🔒 Reading is `viewFinancials` — the Boss watches the ageing. Logging a chase is accounts'.
 */
class CollectionsController extends Controller
{
    public function __construct(private readonly AgeingService $ageing, private readonly AuditLogger $audit) {}

    /** The ageing: one row per party, one column per bucket. */
    public function ageing(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $asOf = $request->filled('as_of') ? Carbon::parse($request->string('as_of')) : now();
        $parties = $this->ageing->byParty($branches->pluck('id')->all(), $asOf, $this->filters($request));

        // What has been promised, so the ageing says who is already being chased.
        $promises = DB::table('collection_follow_ups')
            ->whereIn('agent_id', $branches->pluck('id'))->where('state', 'open')
            ->get(['party_type', 'party_id', 'promised_date', 'promised_amount', 'next_action_date'])
            ->groupBy(fn ($p) => $p->party_type . ':' . $p->party_id);

        $parties = $parties->map(function ($party) use ($promises) {
            $open = $promises[$party['party_type'] . ':' . $party['party_id']] ?? collect();

            $party['promised'] = round((float) $open->sum('promised_amount'), 2);
            $party['promised_by'] = $open->pluck('promised_date')->filter()->min();
            $party['next_action'] = $open->pluck('next_action_date')->filter()->min();
            $party['being_chased'] = $open->isNotEmpty();

            return $party;
        });

        return response()->json([
            'parties' => $parties,
            'totals' => $this->ageing->totals($parties),
            'buckets' => AgeingService::BUCKETS,
            'branches' => $branches,
            'as_of' => $asOf->toDateString(),
        ]);
    }

    /** One party: every open document with its age, and every chase logged against them. */
    public function party(Request $request, string $partyType, int $partyId): JsonResponse
    {
        $this->authorize('viewFinancials');

        abort_unless(in_array($partyType, ['customer', 'partner'], true), 404);

        $branches = $this->branches();
        $asOf = $request->filled('as_of') ? Carbon::parse($request->string('as_of')) : now();

        $documents = $this->ageing->documents($branches->pluck('id')->all(), $asOf,
            ['party_type' => $partyType, 'party_id' => $partyId]);

        $table = $partyType === 'partner' ? 'partners' : 'customers';
        $party = DB::table($table)->where('id', $partyId)->first();

        abort_if($party === null, 404, 'We have no such organization.');

        return response()->json([
            'party' => ['id' => $party->id, 'name' => $party->name, 'type' => $partyType,
                        'gst_no' => $party->gst_no ?? null, 'email' => $party->email ?? null,
                        'credit_limit' => $party->credit_limit ?? null],
            'documents' => $documents->sortByDesc('days_overdue')->values(),
            'total' => round($documents->sum('outstanding_inr'), 2),
            'overdue' => round($documents->where('bucket', '!=', 'not_due')->sum('outstanding_inr'), 2),
            'follow_ups' => $this->followUpsFor($partyType, $partyId, $branches->pluck('id')->all()),
            // Where a chase would go, so nobody hunts for an address.
            'contacts' => $partyType === 'partner'
                ? array_values(array_filter([$party->email ?? null]))
                : DB::table('customer_contacts')->where('customer_id', $partyId)
                    ->orderByDesc('message_count')->limit(3)->pluck('email')->all(),
        ]);
    }

    /**
     * The work queue: who to call today.
     *
     * ⚠️ Ordered by what is **due to be actioned**, not by what is largest. The biggest debtor is often the one
     * already promising to pay on Friday; the one nobody has called is the one that turns into a write-off.
     */
    public function queue(Request $request): JsonResponse
    {
        $this->authorize('viewFinancials');

        $branches = $this->branches();
        $today = now()->startOfDay();
        $parties = $this->ageing->byParty($branches->pluck('id')->all(), $today, $this->filters($request))
            ->filter(fn ($p) => $p['overdue'] > 0)->keyBy(fn ($p) => $p['party_type'] . ':' . $p['party_id']);

        $followUps = DB::table('collection_follow_ups')
            ->whereIn('agent_id', $branches->pluck('id'))->where('state', 'open')
            ->orderBy('next_action_date')
            ->get();

        $rows = [];

        foreach ($followUps as $followUp) {
            $key = $followUp->party_type . ':' . $followUp->party_id;
            $party = $parties[$key] ?? null;
            $promiseDue = $followUp->promised_date !== null && Carbon::parse($followUp->promised_date)->lt($today);

            $rows[$key] ??= [
                'party_type' => $followUp->party_type, 'party_id' => $followUp->party_id,
                'name' => $party['name'] ?? $this->partyName($followUp->party_type, $followUp->party_id),
                'overdue' => $party['overdue'] ?? 0.0, 'oldest_days' => $party['oldest_days'] ?? 0,
                'promised' => 0.0, 'promised_by' => null, 'next_action' => null,
                'promise_broken' => false, 'due_today' => false, 'last_note' => null,
            ];

            $rows[$key]['promised'] += (float) ($followUp->promised_amount ?? 0);
            $rows[$key]['promised_by'] = $this->earliest($rows[$key]['promised_by'], $followUp->promised_date);
            $rows[$key]['next_action'] = $this->earliest($rows[$key]['next_action'], $followUp->next_action_date);
            // A promise whose date has passed and whose money has not arrived is the most actionable row here.
            $rows[$key]['promise_broken'] = $rows[$key]['promise_broken'] || ($promiseDue && ($party['overdue'] ?? 0) > 0);
            $rows[$key]['due_today'] = $rows[$key]['due_today']
                || ($followUp->next_action_date !== null && Carbon::parse($followUp->next_action_date)->lte($today));
            $rows[$key]['last_note'] = $followUp->note;
        }

        // Everybody overdue that nobody has chased at all. These come first: they are the ones being forgotten.
        foreach ($parties as $key => $party) {
            $rows[$key] ??= array_merge($party, ['promised' => 0.0, 'promised_by' => null, 'next_action' => null,
                'promise_broken' => false, 'due_today' => true, 'last_note' => null, 'never_chased' => true]);
        }

        $queue = collect($rows)->map(fn ($row) => $row + ['never_chased' => false])
            ->sortBy([
                fn ($a, $b) => ($b['promise_broken'] <=> $a['promise_broken']),
                fn ($a, $b) => ($b['never_chased'] <=> $a['never_chased']),
                fn ($a, $b) => ($b['overdue'] <=> $a['overdue']),
            ])->values();

        return response()->json([
            'queue' => $queue,
            'summary' => [
                'parties' => $queue->count(),
                'overdue' => round($queue->sum('overdue'), 2),
                'promised' => round($queue->sum('promised'), 2),
                'broken_promises' => $queue->where('promise_broken', true)->count(),
                'never_chased' => $queue->where('never_chased', true)->count(),
                'due_today' => $queue->where('due_today', true)->count(),
            ],
            'branches' => $branches,
        ]);
    }

    /** Log a chase: what was said, what was promised, and when to ask again. */
    public function logFollowUp(Request $request): JsonResponse
    {
        $this->authorize('reconcile');

        $data = $request->validate([
            'agent_id' => 'required|integer',
            'party_type' => 'required|in:customer,partner',
            'party_id' => 'required|integer',
            'invoice_id' => 'nullable|integer',
            'channel' => 'nullable|in:email,call,whatsapp,visit,other',
            'note' => 'required|string|max:2000',
            'promised_date' => 'nullable|date',
            'promised_amount' => 'nullable|numeric|min:0',
            'next_action_date' => 'nullable|date',
        ]);

        if (! $this->branches()->contains('id', (int) $data['agent_id'])) {
            return response()->json(['error' => 'That branch is not one of yours.', 'reason' => 'branch_not_found'], 404);
        }

        $id = DB::table('collection_follow_ups')->insertGetId(array_merge($data, [
            'channel' => $data['channel'] ?? 'email',
            'state' => 'open',
            'created_by' => auth()->id(),
            'created_at' => now(), 'updated_at' => now(),
        ]));

        $this->audit->record((int) $data['agent_id'], 'collection.logged', 'follow_up', $id, auth()->id());

        return response()->json(['id' => $id] + $this->partyPayload($data['party_type'], (int) $data['party_id']), 201);
    }

    /**
     * Close a chase: they paid, they did not, or it is no longer worth chasing.
     *
     * 🔴 A broken promise is CLOSED as broken, never deleted. It is the most useful row in the table the next time
     * that client asks for terms.
     */
    public function closeFollowUp(Request $request, int $id): JsonResponse
    {
        $this->authorize('reconcile');

        $data = $request->validate([
            'state' => 'required|in:kept,broken,closed',
            'outcome_note' => 'nullable|string|max:255',
        ]);

        $followUp = DB::table('collection_follow_ups')->where('id', $id)
            ->whereIn('agent_id', $this->branches()->pluck('id'))->first();

        abort_if($followUp === null, 404, 'That follow-up is not one of yours.');

        DB::table('collection_follow_ups')->where('id', $id)->update([
            'state' => $data['state'], 'outcome_note' => $data['outcome_note'] ?? null, 'updated_at' => now(),
        ]);

        return response()->json($this->partyPayload($followUp->party_type, (int) $followUp->party_id));
    }

    /**
     * The chasing mail, written from what they actually owe.
     *
     * ⚠️ Nothing sends. Accounts read it, edit it and send it from their own mailbox — the same rule as every other
     * drafted mail in the product.
     */
    public function draftChase(Request $request, string $partyType, int $partyId): JsonResponse
    {
        $this->authorize('viewFinancials');

        $body = $this->party($request, $partyType, $partyId)->getData(true);
        $overdue = collect($body['documents'])->filter(fn ($d) => $d['bucket'] !== 'not_due' && $d['outstanding'] > 0);

        if ($overdue->isEmpty()) {
            return response()->json(['error' => 'Nothing of theirs is overdue.', 'reason' => 'nothing_overdue'], 422);
        }

        $facts = [
            'client' => $body['party']['name'],
            'total_overdue' => round($overdue->sum('outstanding_inr'), 2),
            'oldest_days' => (int) $overdue->max('days_overdue'),
            'invoices' => $overdue->sortByDesc('days_overdue')->take(12)->map(fn ($d) => [
                'invoice_no' => $d['invoice_no'],
                'document_date' => $d['document_date'],
                'due_on' => $d['due_on'],
                'days_overdue' => $d['days_overdue'],
                'outstanding' => $d['outstanding'],
            ])->values()->all(),
        ];

        $draft = app(\App\Services\Bank\PaymentQueryDrafter::class)->draft('collection', $facts, auth()->user());

        return response()->json($draft + ['to' => $body['contacts'], 'facts' => $facts]);
    }

    /** The ageing as a CSV, for the meeting nobody holds in a browser. */
    public function export(Request $request): Response
    {
        $this->authorize('viewFinancials');

        $asOf = $request->filled('as_of') ? Carbon::parse($request->string('as_of')) : now();
        $parties = $this->ageing->byParty($this->branches()->pluck('id')->all(), $asOf, $this->filters($request));

        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, array_merge(['Organization', 'Documents'], array_values(AgeingService::BUCKETS), ['Total', 'Overdue', 'Oldest (days)']));

        foreach ($parties as $party) {
            fputcsv($csv, array_merge(
                [$party['name'], $party['documents']],
                array_map(fn ($b) => $party[$b], array_keys(AgeingService::BUCKETS)),
                [$party['total'], $party['overdue'], $party['oldest_days']]
            ));
        }

        rewind($csv);

        return response(stream_get_contents($csv), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="ageing-' . $asOf->format('Ymd') . '.csv"',
        ]);
    }

    /** One party's documents and chases, for the answer to a write. */
    private function partyPayload(string $partyType, int $partyId): array
    {
        return ['follow_ups' => $this->followUpsFor($partyType, $partyId, $this->branches()->pluck('id')->all())];
    }

    private function followUpsFor(string $partyType, int $partyId, array $branchIds)
    {
        return DB::table('collection_follow_ups as f')
            ->leftJoin('users as u', 'u.id', '=', 'f.created_by')
            ->leftJoin('accounts_invoices as i', 'i.id', '=', 'f.invoice_id')
            ->where('f.party_type', $partyType)->where('f.party_id', $partyId)
            ->whereIn('f.agent_id', $branchIds)
            ->orderByDesc('f.created_at')
            ->get(['f.*', 'u.name as logged_by', 'i.invoice_no']);
    }

    private function partyName(string $partyType, int $partyId): ?string
    {
        return DB::table($partyType === 'partner' ? 'partners' : 'customers')->where('id', $partyId)->value('name');
    }

    /** The earlier of two dates, either of which may be missing. */
    private function earliest(?string $current, ?string $candidate): ?string
    {
        if ($candidate === null) {
            return $current;
        }

        return $current === null ? $candidate : min($current, $candidate);
    }

    private function filters(Request $request): array
    {
        return array_filter([
            'agent_id' => $request->integer('agent_id') ?: null,
            'party_type' => $request->string('party_type')->toString() ?: null,
            'q' => $request->string('q')->toString() ?: null,
        ]);
    }

    private function branches()
    {
        $context = UserContext::for(auth()->user());

        return DB::table('agents_info')->where('company_id', $context->companyId)
            ->orderBy('agent_name')->get(['id', 'agent_name as name']);
    }
}
