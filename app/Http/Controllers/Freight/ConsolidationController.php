<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use App\Services\ConsolidationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * FocusSeaConsol — the master/house grid and the container stuffing matrix.
 * PRD.md §5.8.
 *
 * 🔒 `fileManifest` — operations. A consolidation decides what appears on which bill of
 * lading, which is a manifest decision, not a commercial one.
 */
class ConsolidationController extends Controller
{
    public function __construct(
        private readonly ConsolidationService $consol,
        private readonly AuditLogger $audit,
    ) {}

    /** The consol: its houses, its containers, and what is stuffed where. */
    public function show(Job $master): JsonResponse
    {
        $this->authorize('viewManifest');

        $houses = Job::withoutTenantScope()
            ->where('parent_job_id', $master->id)
            ->whereNull('deleted_at')
            ->with('customer:id,name')
            ->get(['id', 'execution_job_no', 'customer_id', 'cargo_type']);

        $details = DB::table('sea_shipment_details')
            ->whereIn('job_id', $houses->pluck('id')->push($master->id))
            ->get()->keyBy('job_id');

        $containers = DB::table('sea_containers')
            ->where('job_id', $master->id)->whereNull('deleted_at')
            ->get(['id', 'container_number', 'seal_number']);

        return response()->json([
            'master' => [
                'id' => $master->id,
                'execution_job_no' => $master->execution_job_no,
                'details' => $details[$master->id] ?? null,
            ],
            'houses' => $houses->map(fn ($h) => [
                'id' => $h->id,
                'execution_job_no' => $h->execution_job_no,
                'customer' => $h->customer ? $h->customer->name : null,
                'cargo_type' => $h->cargo_type,
                'piece_count' => (int) ($details[$h->id]->piece_count ?? 0),
                'gross_weight' => (float) ($details[$h->id]->gross_weight ?? 0),
                'volume_cbm' => (float) ($details[$h->id]->volume_cbm ?? 0),
                'hbl_number' => $details[$h->id]->hbl_number ?? null,
            ]),
            'containers' => $containers,
            'stuffing' => DB::table('sea_container_items')
                ->whereIn('container_id', $containers->pluck('id'))
                ->get(['id', 'container_id', 'job_id', 'piece_count']),
            // The reconciliation IcegateValidator will run at filing, shown here first.
            'reconciliation' => $this->reconcile($master, $houses, $details),
        ]);
    }

    /**
     * Houses with no master, for the association panel.
     *
     * ⚠️ Scoped to the SAME transport mode. A sea consol cannot carry an air house, and
     * offering one in the picker invites a link the service would then refuse.
     */
    public function unassociated(Request $request): JsonResponse
    {
        $this->authorize('viewManifest');

        $rows = Job::forActivePortal()
            ->whereNull('parent_job_id')
            ->where('is_consolidation', false)
            ->when($request->filled('transport_mode'), fn ($q) => $q->where('transport_mode', $request->string('transport_mode')))
            ->with('customer:id,name')
            ->limit(100)
            ->get(['id', 'execution_job_no', 'customer_id', 'transport_mode']);

        return response()->json(['data' => $rows]);
    }

    public function link(Request $request, Job $master): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate(['house_id' => 'required|integer']);

        $house = Job::forActivePortal()->find($data['house_id']);

        if ($house === null) {
            return response()->json(['error' => 'That shipment is not on this branch.', 'reason' => 'not_found'], 404);
        }

        $result = $this->consol->link($master, $house);

        if (! $result['ok']) {
            return response()->json([
                'error' => match ($result['reason']) {
                    'already_linked' => 'That house already belongs to another consol. Unlink it there first — '
                                      . 'moving it silently would take cargo off one manifest and add it to another.',
                    'self_link'      => 'A shipment cannot be its own house.',
                    'mode_mismatch'  => 'A sea consol cannot carry an air house.',
                    default          => 'That house cannot be linked.',
                },
                'reason' => $result['reason'],
            ], 422);
        }

        $this->audit->record($master->agent_id, 'consol.hbl_linked', 'job', $house->id, auth()->id());

        return response()->json($this->show($master)->getData(true));
    }

    public function unlink(Job $master, Job $house): JsonResponse
    {
        $this->authorize('fileManifest');

        if ((int) $house->parent_job_id !== (int) $master->id) {
            return response()->json(['error' => 'That house is not on this consol.', 'reason' => 'not_linked'], 422);
        }

        $this->consol->unlink($house);
        $this->audit->record($master->agent_id, 'consol.hbl_unlinked', 'job', $house->id, auth()->id());

        return response()->json($this->show($master)->getData(true));
    }

    /**
     * Allocate pieces from one house into one container.
     *
     * ❓ **Pieces only.** PRD.md §5.8 describes the matrix as allocating
     * *"pieces/weight/volume per HBL-container pair"*, but `sea_container_items`
     * (schema doc #20) carries only `piece_count` — no weight, no volume columns.
     * Built to the schema, raised in GAPS.md #32.
     *
     * 🔴 **An allocation may not exceed what the house declares.** Stuffing 60 pieces
     * of a 50-piece house into containers means the manifest claims cargo that does not
     * exist, and the discrepancy surfaces at the terminal, not at filing.
     */
    public function stuff(Request $request, Job $master): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'container_id' => 'required|integer',
            'house_id'     => 'required|integer',
            'piece_count'  => 'required|integer|min:0',
        ]);

        $container = DB::table('sea_containers')
            ->where('id', $data['container_id'])->where('job_id', $master->id)->first();

        if ($container === null) {
            return response()->json(['error' => 'That container is not on this consol.', 'reason' => 'not_found'], 404);
        }

        $house = Job::withoutTenantScope()
            ->where('id', $data['house_id'])->where('parent_job_id', $master->id)->first();

        if ($house === null) {
            return response()->json(['error' => 'That house is not on this consol.', 'reason' => 'not_linked'], 422);
        }

        $declared = (int) DB::table('sea_shipment_details')->where('job_id', $house->id)->value('piece_count');

        $allocatedElsewhere = (int) DB::table('sea_container_items')
            ->where('job_id', $house->id)
            ->where('container_id', '!=', $container->id)
            ->sum('piece_count');

        if ($allocatedElsewhere + $data['piece_count'] > $declared) {
            return response()->json([
                'error' => sprintf(
                    'That would stuff %d of a %d-piece house. %d are already in other containers.',
                    $allocatedElsewhere + $data['piece_count'], $declared, $allocatedElsewhere
                ),
                'reason' => 'over_allocated',
            ], 422);
        }

        // Zero means "not in this container" — the row is removed rather than kept at
        // 0, so the matrix holds only real allocations.
        if ($data['piece_count'] === 0) {
            DB::table('sea_container_items')
                ->where('container_id', $container->id)->where('job_id', $house->id)->delete();
        } else {
            DB::table('sea_container_items')->updateOrInsert(
                ['container_id' => $container->id, 'job_id' => $house->id],
                ['agent_id' => $master->agent_id, 'piece_count' => $data['piece_count'],
                 'updated_at' => now(), 'created_at' => now()]
            );
        }

        return response()->json($this->show($master)->getData(true));
    }

    /**
     * What the filing will check, checked here first.
     *
     * The house/master piece reconciliation is `IcegateValidator`'s rule; surfacing it
     * on the consol screen means the operator fixes it while building the consol rather
     * than discovering it at submission.
     */
    private function reconcile(Job $master, $houses, $details): array
    {
        $masterPieces = (int) ($details[$master->id]->piece_count ?? 0);
        $housePieces = $houses->sum(fn ($h) => (int) ($details[$h->id]->piece_count ?? 0));

        $stuffed = (int) DB::table('sea_container_items')
            ->whereIn('job_id', $houses->pluck('id'))
            ->sum('piece_count');

        return [
            'master_pieces' => $masterPieces,
            'house_pieces'  => $housePieces,
            'balanced'      => $houses->isNotEmpty() && $masterPieces === $housePieces,
            'stuffed_pieces' => $stuffed,
            'unstuffed'     => max($housePieces - $stuffed, 0),
        ];
    }
}
