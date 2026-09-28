<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Customer;
use App\Enums\TransportMode;
use App\Job;
use App\Services\AuditLogger;
use App\Services\ConsolidationService;
use App\Services\CreditGateService;
use App\Services\EnquirySequenceService;
use App\Services\IcegateValidator;
use App\Services\SeaParties;
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

    /** PRD §5.8 header. */
    public const CONSOL_TYPES = ['agent_consol', 'buyers_consol', 'direct', 'back_to_back', 'none'];

    public const BOOKING_THRU = ['self', 'agent'];

    /** §4.1.2 — the only units ICEGATE takes. */
    public const WEIGHT_UNITS = ['KGS', 'LBS'];

    public const VOLUME_UNITS = ['CBM', 'CFT'];

    /** PRD §5.8 tab 6. */
    public const RELEASE_TYPES = ['original', 'telex', 'seaway'];

    /** Columns of sea_shipment_details that cannot be emptied. */
    private const NOT_NULL = ['piece_count', 'gross_weight', 'net_weight', 'chargeable_weight', 'volume_cbm', 'filing_status'];

    /** Cargo types that carry containers on THIS document. */
    private const CONTAINERISED = ['fcl', 'liquid_cont'];

    public function __construct(
        private readonly IcegateValidator $validator,
        private readonly AuditLogger $audit,
        private readonly ConsolidationService $consol,
        private readonly SeaParties $parties,
        private readonly EnquirySequenceService $sequences,
    ) {}

    /**
     * The branch's sea shipments, newest first — what FocusSea opens on. Branch-wide like the consol screen: a bill
     * of lading is the branch's document, whoever priced the shipment.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewManifest');

        $term = trim((string) $request->query('q', ''));

        $jobs = Job::forActivePortal()->where('transport_mode', 'sea')
            ->when($term !== '', fn ($q) => $q->where(fn ($w) => $w->where('execution_job_no', 'like', "%{$term}%")
                ->orWhereIn('id', DB::table('sea_shipment_details')->where('hbl_number', 'like', "%{$term}%")
                    ->orWhere('mbl_number', 'like', "%{$term}%")->select('job_id'))
                ->orWhereIn('customer_id', DB::table('customers')->where('name', 'like', "%{$term}%")->select('id'))))
            ->orderByDesc('id')->limit(200)
            ->get(['id', 'execution_job_no', 'direction', 'status', 'cargo_type', 'is_consolidation', 'parent_job_id', 'customer_id']);

        $details = DB::table('sea_shipment_details')->whereIn('job_id', $jobs->pluck('id'))
            ->get(['job_id', 'hbl_number', 'mbl_number', 'vessel_name', 'pol_code', 'pod_code'])->keyBy('job_id');
        $clients = DB::table('customers')->whereIn('id', $jobs->pluck('customer_id')->filter())->pluck('name', 'id');
        $parents = DB::table('jobs')->whereIn('id', $jobs->pluck('parent_job_id')->filter())->pluck('execution_job_no', 'id');

        return response()->json(['data' => $jobs->map(fn (Job $j) => [
            'id' => $j->id, 'execution_job_no' => $j->execution_job_no, 'direction' => $j->direction,
            'status' => $j->status, 'cargo_type' => $j->cargo_type,
            'document' => JobEntityController::documentKind($j),
            'client' => $clients[$j->customer_id] ?? null,
            'parent_no' => $parents[$j->parent_job_id] ?? null,
            'hbl_number' => $details[$j->id]->hbl_number ?? null,
            'mbl_number' => $details[$j->id]->mbl_number ?? null,
            'vessel_name' => $details[$j->id]->vessel_name ?? null,
            'pol_code' => $details[$j->id]->pol_code ?? null,
            'pod_code' => $details[$j->id]->pod_code ?? null,
        ])]);
    }

    /**
     * A new MASTER — the carrier's MBL for a consol, created here because no client enquiry stands behind it (owner,
     * 2026-09-28). `enquiry_id` stays NULL, which the database allows for a consolidation master only; the branch is
     * its shipper from the start.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'direction'  => 'nullable|string|in:export,import',
            'cargo_type' => 'nullable|string|in:' . implode(',', self::CARGO_TYPES),
        ]);

        $agentId = (int) auth()->user()->branch_name;

        $job = DB::transaction(fn () => Job::create([
            'agent_id'         => $agentId,
            'enquiry_id'       => null,
            'transport_mode'   => 'sea',
            'direction'        => $data['direction'] ?? 'export',
            'is_consolidation' => true,
            'cargo_type'       => $data['cargo_type'] ?? null,
            'delivery_mode'    => $this->lockingFor($data['cargo_type'] ?? null)['delivery_mode'],
            'pricing_id'       => auth()->id(),
            'execution_job_no' => $this->sequences->next($agentId, TransportMode::Sea->jobPrefix()),
        ]), EnquirySequenceService::DEADLOCK_ATTEMPTS);

        $this->parties->prefill($job);
        $this->audit->record($job->agent_id, 'sea_shipment.master_created', 'job', $job->id, auth()->id());

        return response()->json($this->show($job->fresh())->getData(true), 201);
    }

    /** The whole record the form binds to. */
    public function show(Job $job): JsonResponse
    {
        $this->authorize('viewManifest');

        $details = DB::table('sea_shipment_details')->where('job_id', $job->id)->first();
        $parent = $job->parent_job_id ? Job::withoutTenantScope()->find($job->parent_job_id, ['id', 'execution_job_no']) : null;
        $customer = $job->customer_id ? Customer::find($job->customer_id) : null;
        $credit = $customer ? app(CreditGateService::class)->check($customer) : null;

        return response()->json([
            'job'        => $job->only([
                'id', 'execution_job_no', 'transport_mode', 'direction', 'cargo_type', 'delivery_mode', 'status',
                'consol_type', 'booking_thru', 'job_order_no', 'quotation_no', 'planned_clearance_date',
                'is_sub_shipment', 'is_consolidation', 'parent_job_id', 'pickup_address', 'enquiry_id',
            ]),
            // House or master — the page names its own document, and the parties follow it (PRD §5.8).
            'document'   => JobEntityController::documentKind($job),
            // What a house on a master takes from it and cannot change itself.
            'from_master' => $job->parent_job_id !== null ? ConsolidationService::CASCADE : [],
            'parent'     => $parent,
            'client'     => $customer?->only(['id', 'name']),
            // The banner only: whether the client is over its limit. The figures stay with accounts.
            'credit'     => $credit ? ['blocked' => $credit['blocked'], 'reason' => $credit['reason']] : null,
            'details'    => $details,
            'containers' => DB::table('sea_containers')
                ->where('job_id', $job->id)->whereNull('deleted_at')
                ->get(['id', 'container_number', 'container_type', 'seal_number']),
            'vocabulary' => [
                'cargo_types'     => self::CARGO_TYPES,
                'container_types' => self::CONTAINER_TYPES,
                'consol_types'    => self::CONSOL_TYPES,
                'booking_thru'    => self::BOOKING_THRU,
                'weight_units'    => self::WEIGHT_UNITS,
                'volume_units'    => self::VOLUME_UNITS,
                'release_types'   => self::RELEASE_TYPES,
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
            'filing_status'  => 'nullable|string|in:not_filed,submitted,cleared,rejected',
            'shipping_bill_no'   => 'nullable|string|max:30',
            'shipping_bill_date' => 'nullable|date',
            'carrier_id'          => 'nullable|integer',
            'service_contract_no' => 'nullable|string|max:30',
            'ts1_code' => 'nullable|string|max:5',
            'ts2_code' => 'nullable|string|max:5',
            'ts3_code' => 'nullable|string|max:5',
            'etd'      => 'nullable|date',
            'eta'      => 'nullable|date|after_or_equal:etd',
            'commodity_description' => 'nullable|string|max:500',
            'hs_code'        => 'nullable|string|regex:/^\d{6,10}$/',
            'marks_numbers'  => 'nullable|string|max:2000',
            'package_code'   => 'nullable|string|max:10',
            'weight_unit'    => 'nullable|string|in:' . implode(',', self::WEIGHT_UNITS),
            'volume_unit'    => 'nullable|string|in:' . implode(',', self::VOLUME_UNITS),
            'bl_type'        => 'nullable|string|max:30',
            'release_type'   => 'nullable|string|in:' . implode(',', self::RELEASE_TYPES),
            'haulage_provider_id' => 'nullable|integer',
            'empty_depot'    => 'nullable|string|max:150',
            'containers'         => 'nullable|array',
            'containers.*.container_number' => 'required_with:containers|string|max:11',
            'containers.*.container_type'   => 'nullable|string|in:' . implode(',', self::CONTAINER_TYPES),
            'containers.*.seal_number'      => 'nullable|string|max:15',
        ]);

        // The header lives on the job (PRD §5.8 "Global header fields").
        $header = $request->validate([
            'consol_type'  => 'nullable|string|in:' . implode(',', self::CONSOL_TYPES),
            'booking_thru' => 'nullable|string|in:' . implode(',', self::BOOKING_THRU),
            'job_order_no' => 'nullable|string|max:30',
            'quotation_no' => 'nullable|string|max:30',
            'planned_clearance_date' => 'nullable|date',
            'pickup_address' => 'nullable|string|max:500',
            'parent_job_id'  => 'nullable|integer',
        ]);

        // Any partner of the company may act as carrier or haulier: partner_type is only its PRIMARY role (Partner).
        foreach (['carrier_id', 'haulage_provider_id'] as $field) {
            if (! empty($data[$field]) && ! $this->ownPartner((int) $data[$field], $job)) {
                return response()->json(['error' => 'That partner is not on this branch.', 'reason' => 'partner_not_found'], 422);
            }
        }

        // 🔗 A house joins its master through the consol engine, so the roll-up and the routing cascade run —
        // never by writing parent_job_id here.
        if (array_key_exists('parent_job_id', $header)) {
            $linked = $this->reparent($job, $header['parent_job_id']);
            if ($linked !== null) {
                return $linked;
            }
        }
        unset($header['parent_job_id']);

        // 🔴 On a house that travels on a master, the routing and vessel ARE the master's — cascaded down, and a
        // mismatch between the two is a customs rejection (PRD §5.8). The house's own copy is not written over them.
        if ($job->parent_job_id !== null) {
            $data = array_diff_key($data, array_flip(ConsolidationService::CASCADE));
        }

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

        DB::transaction(function () use ($job, $data, $header, $cargoType, $locking, $containers) {
            // A field sent empty is CLEARED — except the counts and weights the table keeps NOT NULL.
            $fields = collect($data)->except(['cargo_type', 'containers'])
                ->reject(fn ($v, $k) => $v === null && in_array($k, self::NOT_NULL, true))->all();

            if ($fields !== []) {
                DB::table('sea_shipment_details')->updateOrInsert(
                    ['job_id' => $job->id],
                    $fields + ['updated_at' => now(), 'created_at' => now()]
                );
            }

            // delivery_mode is DERIVED from cargo_type, never sent by the client — the
            // matrix says what it must be, so accepting one would let them disagree.
            $job->update($header + [
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
                        'container_type'   => $c['container_type'] ?? null,
                        'seal_number'      => $c['seal_number'] ?? null,
                        'created_at'       => now(), 'updated_at' => now(),
                    ]);
                }
            }
        });

        // The house's own pieces and weights may have changed with this save: its master sums them again.
        if ($job->parent_job_id !== null) {
            $this->consol->rollUp((int) $job->parent_job_id);
        }

        $this->audit->record($job->agent_id, 'sea_shipment.saved', 'job', $job->id, auth()->id());

        return response()->json($this->show($job)->getData(true));
    }

    /**
     * Put a house on a master, or take it off. Returns a response only when refused.
     */
    private function reparent(Job $job, ?int $parentId): ?JsonResponse
    {
        if ((int) $job->parent_job_id === (int) $parentId) {
            return null;
        }

        if ($parentId === null) {
            $this->consol->unlink($job);

            return null;
        }

        $master = Job::forActivePortal()->where('is_consolidation', true)->find($parentId);
        if ($master === null) {
            return response()->json(['error' => 'That master is not a sea consol on this branch.', 'reason' => 'not_found'], 422);
        }

        if ($job->is_consolidation && $job->parent_job_id === null
            && Job::withoutTenantScope()->where('parent_job_id', $job->id)->exists()) {
            return response()->json(['error' => 'A master that carries houses cannot itself become a house.', 'reason' => 'is_master'], 422);
        }

        if ($job->parent_job_id !== null) {
            $this->consol->unlink($job);
            $job->refresh();
        }

        $result = $this->consol->link($master, $job);

        return $result['ok'] ? null : response()->json([
            'error'  => 'That house cannot go on that master.',
            'reason' => $result['reason'],
        ], 422);
    }

    /** A partner of this shipment's company. */
    private function ownPartner(int $id, Job $job): bool
    {
        $companyId = DB::table('agents_info')->where('id', $job->agent_id)->value('company_id');

        return DB::table('partners')->where('id', $id)->where('company_id', $companyId)->exists();
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
