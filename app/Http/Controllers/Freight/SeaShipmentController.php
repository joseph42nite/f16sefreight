<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use App\Services\IcegateValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * FocusSea — the sea shipment record behind the 12-tab form. PRD.md §5.8.
 *
 * ═══ 🔴 THE CARGO-TYPE MATRIX IS ENFORCED HERE, NOT IN THE WATCHER ══════════
 * PRD.md §5.8 describes a Vue watcher that enables and clears tabs as `cargo_type`
 * changes. That watcher is a convenience. If it were the only enforcement, an LCL
 * shipment could still be saved carrying containers by any caller that is not the
 * form — and containers on an LCL house is a manifest that contradicts itself, which
 * customs rejects at the gate rather than at filing.
 *
 *   fcl · liquid_cont   delivery_mode locked to 'fcl'   containers REQUIRED
 *   lcl                 delivery_mode locked to 'lcl'   containers REFUSED (managed
 *                                                       at master level)
 *   break_bulk · bulk · liquid_bulk · ro_ro
 *                       delivery_mode cleared           containers REFUSED
 *
 * ═══ ⚠️ VALIDATION IS SHARED WITH THE MANIFEST FILER ════════════════════════
 * ISO 6346 and "an IMDG class requires a UN number" live in `IcegateValidator` and are
 * called from here. Re-implementing them for the form would let the form accept what
 * the filing later refuses — the worst possible split, because the operator learns at
 * the gateway instead of at the keyboard.
 */
class SeaShipmentController extends Controller
{
    /** PRD.md §5.8 tab 7. */
    public const CONTAINER_TYPES = ['20GP', '40GP', '40HC', '20RF', '40RF', '20TK', '40OT'];

    public const CARGO_TYPES = ['liquid_cont', 'fcl', 'lcl', 'break_bulk', 'liquid_bulk', 'bulk', 'ro_ro'];

    /** Cargo types that carry containers on THIS document. */
    private const CONTAINERISED = ['fcl', 'liquid_cont'];

    public function __construct(
        private readonly IcegateValidator $validator,
        private readonly AuditLogger $audit,
    ) {}

    /** The whole record the form binds to. */
    public function show(Job $job): JsonResponse
    {
        $this->authorize('viewManifest');

        $details = DB::table('sea_shipment_details')->where('job_id', $job->id)->first();

        return response()->json([
            'job'        => $job->only(['id', 'execution_job_no', 'transport_mode', 'cargo_type', 'delivery_mode', 'status']),
            'details'    => $details,
            'containers' => DB::table('sea_containers')
                ->where('job_id', $job->id)->whereNull('deleted_at')
                ->get(['id', 'container_number', 'seal_number']),
            'vocabulary' => [
                'cargo_types'     => self::CARGO_TYPES,
                'container_types' => self::CONTAINER_TYPES,
            ],
            // The form reads this rather than re-deriving the matrix — one source.
            'locking'    => $this->lockingFor($job->cargo_type),
            // Everything the manifest filer would refuse, available before saving.
            'violations' => $this->validator->validate($job),
        ]);
    }

    /**
     * Save tabs 2–8 and 11.
     *
     * ⚠️ Tabs 9 and 10 (Charges, Financials) are DELIBERATELY not writable here. They
     * belong to the cost sheet, and §6.7's whole point is that a rate edit never
     * touches a manifest. Accepting them on this endpoint would reintroduce the
     * coupling from the other direction.
     */
    public function save(Request $request, Job $job): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'cargo_type'     => 'nullable|string|in:' . implode(',', self::CARGO_TYPES),
            'vessel_name'    => 'nullable|string|max:100',
            'voyage_no'      => 'nullable|string|max:30',
            'vessel_flag'    => 'nullable|string|max:50',
            'imo_number'     => 'nullable|string|regex:/^[0-9]{7}$/',
            'por_code'       => 'nullable|string|max:5',
            'pol_code'       => 'nullable|string|max:5',
            'pod_code'       => 'nullable|string|max:5',
            'del_code'       => 'nullable|string|max:5',
            'imdg_class'     => 'nullable|string|max:10',
            'un_number'      => 'nullable|string|max:10',
            'mbl_number'     => 'nullable|string|max:20',
            'hbl_number'     => 'nullable|string|max:20',
            'freight_terms'  => 'nullable|string|in:prepaid,collect',
            'piece_count'    => 'nullable|integer|min:0',
            'gross_weight'   => 'nullable|numeric|min:0',
            'net_weight'     => 'nullable|numeric|min:0',
            'chargeable_weight' => 'nullable|numeric|min:0',
            'volume_cbm'     => 'nullable|numeric|min:0',
            'container_type' => 'nullable|string|in:' . implode(',', self::CONTAINER_TYPES),
            'filing_status'  => 'nullable|string|in:not_filed,submitted,cleared,rejected',
            'shipping_bill_no'   => 'nullable|string|max:30',
            'shipping_bill_date' => 'nullable|date',
            'containers'         => 'nullable|array',
            'containers.*.container_number' => 'required_with:containers|string|max:11',
            'containers.*.seal_number'      => 'nullable|string|max:15',
        ]);

        $cargoType = $data['cargo_type'] ?? $job->cargo_type;
        $locking = $this->lockingFor($cargoType);
        $containers = $data['containers'] ?? null;

        // 🔴 The matrix, enforced. See the class docblock for why this is not left to
        // the watcher.
        if ($containers !== null && $containers !== [] && ! $locking['containers_enabled']) {
            return response()->json([
                'error'  => sprintf(
                    '%s cargo carries no containers on this document%s.',
                    strtoupper(str_replace('_', ' ', (string) $cargoType)),
                    $cargoType === 'lcl' ? ' — LCL boxes are managed at master level' : ''
                ),
                'reason' => 'containers_not_allowed',
            ], 422);
        }

        // ⚠️ An IMDG class REQUIRES a UN number, checked BEFORE the write. Dangerous
        // goods declared by class with no substance identified is a filing customs
        // rejects outright, and the two fields sit on different tabs — which is
        // exactly why this cannot be left to the form.
        $imdg = $data['imdg_class'] ?? null;
        $un = $data['un_number'] ?? null;
        if (! blank($imdg) && blank($un)) {
            return response()->json([
                'error'  => "IMDG class {$imdg} needs a UN number. Dangerous goods must identify the substance, not only its class.",
                'reason' => 'imdg_requires_un',
            ], 422);
        }

        foreach ($containers ?? [] as $c) {
            if (! $this->validator->isValidContainerNumber($c['container_number'])) {
                return response()->json([
                    'error'  => "Container {$c['container_number']} fails the ISO 6346 check digit. "
                              . 'A mistyped container number is rejected at the terminal gate, not at filing.',
                    'reason' => 'iso_6346',
                ], 422);
            }
        }

        DB::transaction(function () use ($job, $data, $cargoType, $locking, $containers) {
            $fields = collect($data)->except(['cargo_type', 'containers'])->filter(fn ($v) => $v !== null)->all();

            if ($fields !== []) {
                DB::table('sea_shipment_details')->updateOrInsert(
                    ['job_id' => $job->id],
                    $fields + ['updated_at' => now(), 'created_at' => now()]
                );
            }

            // delivery_mode is DERIVED from cargo_type, never sent by the client — the
            // matrix says what it must be, so accepting one would let them disagree.
            $job->update([
                'cargo_type'    => $cargoType,
                'delivery_mode' => $locking['delivery_mode'],
            ]);

            if ($containers !== null) {
                DB::table('sea_containers')->where('job_id', $job->id)->delete();

                foreach ($containers as $c) {
                    DB::table('sea_containers')->insert([
                        'agent_id'         => $job->agent_id,
                        'job_id'           => $job->id,
                        'container_number' => strtoupper(trim($c['container_number'])),
                        'seal_number'      => $c['seal_number'] ?? null,
                        'created_at'       => now(), 'updated_at' => now(),
                    ]);
                }
            }
        });

        $this->audit->record($job->agent_id, 'sea_shipment.saved', 'job', $job->id, auth()->id());

        return response()->json($this->show($job)->getData(true));
    }

    /**
     * The matrix as data, so the form and the server cannot disagree about it.
     *
     * `delivery_mode` is NULL for the bulk types — the PRD says "disabled & cleared",
     * and NULL is what "cleared" means. Writing 'bulk' into it would invent a value the
     * enum does not have.
     */
    private function lockingFor(?string $cargoType): array
    {
        $containerised = in_array($cargoType, self::CONTAINERISED, true);

        return [
            'cargo_type'         => $cargoType,
            'delivery_mode'      => $containerised ? 'fcl' : ($cargoType === 'lcl' ? 'lcl' : null),
            'delivery_mode_locked' => $cargoType !== null,
            'containers_enabled' => $containerised,
            'containers_required' => $containerised,
            // LCL is the one type where the Item/Goods tab is MANDATED rather than
            // merely available: without dimensions and CBM an LCL box cannot be
            // allocated into a container at all.
            'dimensions_required' => $cargoType === 'lcl',
        ];
    }
}
