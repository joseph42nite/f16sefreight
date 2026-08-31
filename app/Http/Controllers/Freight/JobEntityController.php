<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * The parties on a shipment — `job_entities`. PRD.md §5.8 tab 1.
 *
 * ═══ 🔴 THE SAME ROLE MEANS A DIFFERENT COMPANY ON EACH DOCUMENT ════════════
 * This is the rule the HBL/MBL mapping exists for, and it is the easiest thing in the
 * product to get quietly wrong:
 *
 *   role        House BL (HBL)                 Master BL (MBL)
 *   shipper     the actual exporter            THE FORWARDER BRANCH ITSELF
 *   consignee   the overseas buyer             the counterpart destination agent
 *   notify      the buyer or their broker      same as consignee — the dest agent
 *
 * So `shipper` on a house is a `customers` row and on a master is the branch. Copying a
 * house's shipper onto its master would print the exporter's name where the carrier
 * expects the forwarder — a bill of lading naming the wrong contracting party.
 *
 * The endpoint therefore reports the EXPECTED party type per role for the document
 * being edited, and refuses a mismatch rather than storing it.
 *
 * ═══ ⚠️ notify_party MAY REPEAT; EVERY OTHER ROLE MAY NOT ═══════════════════
 * `unique_role_gate` is a generated column that is NULL for `notify_party` and equal to
 * `role` otherwise, backing a unique index on `(job_id, unique_role_gate)`. A shipment
 * has one shipper and one consignee; it can have several notify parties. That is
 * enforced in the database — this controller returns a usable error instead of a
 * driver exception.
 */
class JobEntityController extends Controller
{
    public const ROLES = [
        'shipper', 'consignee', 'notify_party', 'origin_agent', 'dest_agent',
        'selling_agent', 'customs_broker', 'transporter', 'other',
    ];

    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Job $job): JsonResponse
    {
        $this->authorize('viewManifest');

        return response()->json([
            'document'   => $this->documentKind($job),
            'entities'   => $this->hydrate($job),
            'roles'      => self::ROLES,
            // What each role SHOULD be on this document. The form reads this rather
            // than hard-coding the matrix, so the two cannot disagree.
            'expected'   => $this->expectedParties($job),
        ]);
    }

    public function store(Request $request, Job $job): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'role'              => 'required|string|in:' . implode(',', self::ROLES),
            'party_type'        => 'required|string|in:customer,partner',
            'party_id'          => 'required|integer',
            'custom_role_label' => 'nullable|string|max:50',
        ]);

        if ($data['role'] === 'other' && blank($data['custom_role_label'] ?? null)) {
            return response()->json([
                'error'  => 'A custom role needs a label, or nobody reading the document knows what it is.',
                'reason' => 'label_required',
            ], 422);
        }

        // 🔴 The mapping, enforced. See the class docblock.
        $expected = $this->expectedParties($job);
        if (isset($expected[$data['role']]) && $expected[$data['role']]['party_type'] !== $data['party_type']) {
            return response()->json([
                'error'  => sprintf(
                    'On %s, the %s is %s — not a %s.',
                    $this->documentKind($job) === 'master' ? 'a master bill' : 'a house bill',
                    str_replace('_', ' ', $data['role']),
                    $expected[$data['role']]['description'],
                    $data['party_type']
                ),
                'reason'   => 'party_type_mismatch',
                'expected' => $expected[$data['role']],
            ], 422);
        }

        if (! $this->partyExists($data['party_type'], $data['party_id'], $job)) {
            return response()->json([
                'error'  => 'That party is not on this tenant.',
                'reason' => 'party_not_found',
            ], 404);
        }

        // ⚠️ The unique index refuses a second shipper. Caught here so the operator
        // reads a sentence rather than an SQLSTATE.
        $duplicate = $data['role'] !== 'notify_party'
            && DB::table('job_entities')
                ->where('job_id', $job->id)->where('role', $data['role'])
                ->whereNull('deleted_at')->exists();

        if ($duplicate) {
            return response()->json([
                'error'  => sprintf('This shipment already has a %s. Remove it first — a bill of '
                                  . 'lading names one.', str_replace('_', ' ', $data['role'])),
                'reason' => 'role_taken',
            ], 422);
        }

        DB::table('job_entities')->insert([
            'agent_id'          => $job->agent_id,
            'job_id'            => $job->id,
            'party_type'        => $data['party_type'],
            'party_id'          => $data['party_id'],
            'role'              => $data['role'],
            'custom_role_label' => $data['custom_role_label'] ?? null,
            'created_at'        => now(), 'updated_at' => now(),
        ]);

        $this->audit->record($job->agent_id, 'job.entity_added', 'job', $job->id, auth()->id());

        return response()->json($this->index($job)->getData(true), 201);
    }

    public function destroy(Job $job, int $entityId): JsonResponse
    {
        $this->authorize('fileManifest');

        // Soft — job_entities carries deleted_at, and the generated unique gate frees
        // up with it so the role can be filled again.
        $deleted = DB::table('job_entities')
            ->where('id', $entityId)->where('job_id', $job->id)
            ->whereNull('deleted_at')
            ->update(['deleted_at' => now(), 'updated_at' => now()]);

        if ($deleted === 0) {
            return response()->json(['error' => 'That party is not on this shipment.', 'reason' => 'not_found'], 404);
        }

        return response()->json($this->index($job)->getData(true));
    }

    // ─── Internals ───────────────────────────────────────────────────────────

    /**
     * A job is a MASTER when it carries houses (or is flagged as a consolidation), and
     * a HOUSE when it has a parent. A plain direct shipment is treated as a house: its
     * shipper is the real exporter, which is the house reading.
     */
    private function documentKind(Job $job): string
    {
        if ($job->parent_job_id !== null) {
            return 'house';
        }

        return $job->is_consolidation ? 'master' : 'house';
    }

    /** @return array<string, array{party_type: string, description: string}> */
    private function expectedParties(Job $job): array
    {
        if ($this->documentKind($job) === 'master') {
            return [
                'shipper'      => ['party_type' => 'partner', 'description' => 'the forwarder branch itself'],
                'consignee'    => ['party_type' => 'partner', 'description' => 'the counterpart destination agent'],
                'notify_party' => ['party_type' => 'partner', 'description' => 'the destination agent'],
            ];
        }

        return [
            'shipper'      => ['party_type' => 'customer', 'description' => 'the actual exporter'],
            'consignee'    => ['party_type' => 'customer', 'description' => 'the overseas buyer'],
            'notify_party' => ['party_type' => 'customer', 'description' => 'the buyer or their local broker'],
        ];
    }

    private function partyExists(string $type, int $id, Job $job): bool
    {
        $companyId = DB::table('agents_info')->where('id', $job->agent_id)->value('company_id');

        return DB::table($type === 'customer' ? 'customers' : 'partners')
            ->where('id', $id)->where('company_id', $companyId)->exists();
    }

    /** Resolve each polymorphic party to a name the form can print. */
    private function hydrate(Job $job): array
    {
        $rows = DB::table('job_entities')
            ->where('job_id', $job->id)->whereNull('deleted_at')
            ->get(['id', 'party_type', 'party_id', 'role', 'custom_role_label']);

        $customers = DB::table('customers')
            ->whereIn('id', $rows->where('party_type', 'customer')->pluck('party_id'))
            ->pluck('name', 'id');
        $partners = DB::table('partners')
            ->whereIn('id', $rows->where('party_type', 'partner')->pluck('party_id'))
            ->pluck('name', 'id');

        return $rows->map(fn ($r) => [
            'id'         => $r->id,
            'role'       => $r->role,
            'label'      => $r->role === 'other' ? $r->custom_role_label : str_replace('_', ' ', $r->role),
            'party_type' => $r->party_type,
            'party_id'   => $r->party_id,
            'name'       => $r->party_type === 'customer'
                ? ($customers[$r->party_id] ?? null)
                : ($partners[$r->party_id] ?? null),
        ])->all();
    }
}
