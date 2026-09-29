<?php

namespace App\Http\Controllers\Freight;

use App\Customer;
use App\Http\Controllers\Controller;
use App\Job;
use App\Services\AuditLogger;
use App\Services\CreditGateService;
use App\Services\EnquirySequenceService;
use App\Services\ImportPdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Import, both modes (GAPS #434) — PRD §5.8 sea import, §5.9 and §8.1 air import.
 *
 * One controller read by the portal it is called from: FocusSea's import is a sea job with `direction = import`
 * (its IGM on `sea_shipment_details`), FocusAir's an air job with the same direction and its PRD §8.1 fields on
 * `air_import_details`. Both share the arrival notice and the delivery order.
 *
 * 🔒 Reading is `viewManifest`; everything that writes or releases is `fileManifest` (operations), as for filing.
 *
 * 🔴 **A delivery order releases cargo, so its print is the gate** (PRD §5.8): refused 422 until the DO is saved AND
 * the job's issued bills are paid or the client is within credit — decided here, never by the button's state.
 */
class ImportController extends Controller
{
    private const FILING = ['not_filed', 'submitted', 'cleared', 'rejected'];

    public function __construct(
        private readonly AuditLogger $audit,
        private readonly EnquirySequenceService $sequences,
        private readonly ImportPdf $pdf,
    ) {}

    /** This portal's import jobs, newest first — masters with their houses beneath, and single shipments. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewManifest');

        $mode = $this->mode();
        $term = trim((string) $request->input('q'));

        $jobs = Job::query()->where('transport_mode', $mode)->where('direction', 'import')
            ->when($term !== '', fn ($q) => $q->where(fn ($w) => $w->where('execution_job_no', 'like', "%{$term}%")
                ->orWhere('awb_number', 'like', "%{$term}%")))
            ->latest('id')->limit(200)
            ->get(['id', 'execution_job_no', 'awb_number', 'status', 'is_consolidation', 'parent_job_id', 'customer_id']);

        $ids = $jobs->pluck('id');
        $details = $mode === 'sea'
            ? DB::table('sea_shipment_details')->whereIn('job_id', $ids)->get(['job_id', 'mbl_number', 'hbl_number', 'eta', 'igm_no'])->keyBy('job_id')
            : DB::table('air_import_details')->whereIn('job_id', $ids)->get(['job_id', 'arrived_at', 'igm_no'])->keyBy('job_id');
        $orders = DB::table('delivery_orders')->whereIn('job_id', $ids)->get(['job_id', 'do_number', 'status'])->keyBy('job_id');
        $clients = DB::table('customers')->whereIn('id', $jobs->pluck('customer_id')->filter())->pluck('name', 'id');

        return response()->json([
            'mode' => $mode,
            'jobs' => $jobs->map(function (Job $j) use ($mode, $details, $orders, $clients) {
                $d = $details[$j->id] ?? null;

                return [
                    'id'          => $j->id,
                    'job_no'      => $j->execution_job_no,
                    'document'    => $j->is_consolidation ? 'master' : 'house',
                    'parent_id'   => $j->parent_job_id,
                    'client'      => $clients[$j->customer_id] ?? null,
                    'document_no' => $mode === 'sea'
                        ? ($j->is_consolidation ? ($d->mbl_number ?? null) : ($d->hbl_number ?? null))
                        : $j->awb_number,
                    'arrival'     => $mode === 'sea' ? ($d->eta ?? null) : ($d->arrived_at ?? null),
                    'igm_no'      => $d->igm_no ?? null,
                    'do'          => $orders[$j->id] ?? null,
                    'status'      => $j->status,
                ];
            })->values(),
        ]);
    }

    /**
     * A new AIR import consol (a master, with no enquiry behind it — the CHECK allows exactly that). A sea import consol
     * is created by FocusSea's own `POST /sea-shipments` with `direction: import`, which prefills its parties.
     */
    public function store(): JsonResponse
    {
        $this->authorize('fileManifest');

        abort_unless($this->mode() === 'air', 422, 'A sea import consol is created from Bills of Lading → New master.');

        $agentId = (int) auth()->user()->branch_name;

        $job = DB::transaction(fn () => Job::create([
            'agent_id'         => $agentId,
            'enquiry_id'       => null,
            'transport_mode'   => 'air',
            'direction'        => 'import',
            'is_consolidation' => true,
            'pricing_id'       => auth()->id(),
            'execution_job_no' => $this->sequences->next($agentId, 'JOBA'),
        ]), EnquirySequenceService::DEADLOCK_ATTEMPTS);

        $this->audit->record($job->agent_id, 'import.consol_created', 'job', $job->id, auth()->id());

        return response()->json($this->payload($job->fresh()), 201);
    }

    public function show(Job $job): JsonResponse
    {
        $this->authorize('viewManifest');
        $this->mustBeImport($job);

        return response()->json($this->payload($job));
    }

    /** Save the import fields: IGM for both modes; flight, arrival and storage for air (PRD §8.1). */
    public function save(Request $request, Job $job): JsonResponse
    {
        $this->authorize('fileManifest');
        $this->mustBeImport($job);

        $partner = Rule::exists('partners', 'id')->where('company_id', DB::table('agents_info')->where('id', $job->agent_id)->value('company_id'));
        $common = [
            'igm_no'            => 'nullable|string|max:20',
            'igm_date'          => 'nullable|date',
            'handling_agent_id' => ['nullable', 'integer', $partner],
        ];

        if ($job->transport_mode === 'sea') {
            $data = $request->validate($common);
            $this->upsert('sea_shipment_details', $job, $data);
        } else {
            $data = $request->validate($common + [
                'awb_number'        => ['nullable', 'string', 'regex:/^\d{3}-\d{8}$/'],
                'consol_type'       => 'nullable|string|in:agent_consol,buyers_consol',
                'flight_number'     => 'nullable|string|max:20',
                'flight_date'       => 'nullable|date',
                'carrier_name'      => 'nullable|string|max:100',
                'pol_code'          => 'nullable|string|size:3',
                'pod_code'          => 'nullable|string|size:3',
                'piece_count'       => 'nullable|integer|min:0',
                'gross_weight'      => 'nullable|numeric|min:0',
                'chargeable_weight' => 'nullable|numeric|min:0',
                'arrived_at'        => 'nullable|date',
                'free_storage_days' => 'nullable|integer|min:0|max:365',
                'storage_from'      => 'nullable|date',
                'filing_status'     => ['nullable', Rule::in(self::FILING)],
            ], ['awb_number.regex' => 'A master air waybill is NNN-NNNNNNNN.']);

            DB::transaction(function () use ($job, $data) {
                $job->update(array_filter(['awb_number' => $data['awb_number'] ?? null, 'consol_type' => $data['consol_type'] ?? null],
                    fn ($v) => $v !== null));

                // NOT NULL columns on air_shipment_details keep their default when left out.
                $this->upsert('air_shipment_details', $job, array_filter(
                    array_intersect_key($data, array_flip(['flight_number', 'flight_date', 'carrier_name', 'pol_code', 'pod_code',
                        'piece_count', 'gross_weight', 'chargeable_weight'])),
                    fn ($v) => $v !== null));
                $this->upsert('air_import_details', $job, array_intersect_key($data, array_flip(['arrived_at', 'free_storage_days',
                    'storage_from', 'igm_no', 'igm_date', 'handling_agent_id']))
                    + ['filing_status' => $data['filing_status'] ?? 'not_filed']);
            });
        }

        $this->audit->record($job->agent_id, 'import.saved', 'job', $job->id, auth()->id());

        return response()->json($this->payload($job->fresh()));
    }

    /** The cargo arrival notice's number — minted once per job, never recycled. */
    public function arrivalNotice(Job $job): JsonResponse
    {
        $this->authorize('fileManifest');
        $this->mustBeImport($job);

        if (! DB::table('cargo_arrival_notices')->where('job_id', $job->id)->exists()) {
            DB::table('cargo_arrival_notices')->insert([
                'agent_id' => $job->agent_id, 'job_id' => $job->id,
                'notice_number' => $this->sequences->next($job->agent_id, 'CAN'),
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $this->audit->record($job->agent_id, 'import.arrival_notice', 'job', $job->id, auth()->id());
        }

        return response()->json($this->payload($job));
    }

    public function arrivalNoticePdf(Job $job)
    {
        $this->authorize('viewManifest');
        $this->mustBeImport($job);

        $can = DB::table('cargo_arrival_notices')->where('job_id', $job->id)->first();
        abort_if($can === null, 422, 'Issue the arrival notice first; it has no number yet.');

        return $this->pdfResponse($this->pdf->arrivalNotice($job), $can->notice_number);
    }

    /** Create or change the delivery order while it is a draft. A released DO has let cargo go and is not edited. */
    public function saveDeliveryOrder(Request $request, Job $job): JsonResponse
    {
        $this->authorize('fileManifest');
        $this->mustBeImport($job);

        $data = $request->validate([
            'do_date'     => 'nullable|date',
            'do_given_to' => 'nullable|string|max:150',
            'can_id'      => ['nullable', 'integer', Rule::exists('cargo_arrival_notices', 'id')->where('job_id', $job->id)],
            'invoice_id'  => ['nullable', 'integer', Rule::exists('accounts_invoices', 'id')->where('job_id', $job->id)],
            'fee'         => 'nullable|numeric|min:0',
        ], [
            'can_id.exists'     => 'That arrival notice is not this shipment\'s.',
            'invoice_id.exists' => 'That invoice is not this shipment\'s.',
        ]);

        $existing = DB::table('delivery_orders')->where('job_id', $job->id)->first();

        if ($existing?->status === 'released') {
            return response()->json(['error' => 'This delivery order has been released; the cargo has gone against it.',
                'reason' => 'released'], 422);
        }

        if ($existing === null) {
            DB::table('delivery_orders')->insert($data + [
                'agent_id' => $job->agent_id, 'job_id' => $job->id,
                'do_number' => $this->sequences->next($job->agent_id, 'DO'),
                'do_date' => $data['do_date'] ?? now()->toDateString(), 'status' => 'draft',
                'created_at' => now(), 'updated_at' => now(),
            ]);
        } else {
            DB::table('delivery_orders')->where('id', $existing->id)
                ->update(array_filter($data, fn ($v, $k) => $k !== 'do_date' || $v !== null, ARRAY_FILTER_USE_BOTH) + ['updated_at' => now()]);
        }

        $this->audit->record($job->agent_id, 'import.do_saved', 'job', $job->id, auth()->id());

        return response()->json($this->payload($job));
    }

    /** Print the DO — the release. Refused 422 unless saved AND paid or within credit (PRD §5.8). */
    public function deliveryOrderPdf(Job $job)
    {
        $this->authorize('fileManifest');
        $this->mustBeImport($job);

        $gate = $this->release($job);

        if (! $gate['allowed']) {
            return response()->json(['error' => $gate['message'], 'reason' => $gate['reason']], 422);
        }

        $do = DB::table('delivery_orders')->where('job_id', $job->id)->first();

        if ($do->status !== 'released') {
            DB::table('delivery_orders')->where('id', $do->id)
                ->update(['status' => 'released', 'released_at' => now(), 'released_by' => auth()->id(), 'updated_at' => now()]);
            $this->audit->record($job->agent_id, 'import.do_released', 'job', $job->id, auth()->id());
        }

        return $this->pdfResponse($this->pdf->deliveryOrder($job), $do->do_number);
    }

    /**
     * Whether the DO may be released: saved, and the job's issued bills paid — or the client within credit.
     *
     * ⚠️ A client with no credit limit set is "not configured" and never blocks (the money rules); a limit of 0.00 does.
     *
     * @return array{allowed: bool, reason: string, message: string, outstanding: ?float}
     */
    private function release(Job $job): array
    {
        if (! DB::table('delivery_orders')->where('job_id', $job->id)->exists()) {
            return ['allowed' => false, 'reason' => 'not_saved', 'message' => 'Save the delivery order before printing it.', 'outstanding' => null];
        }

        $customer = $job->customer_id ? Customer::withoutTenantScope()->find($job->customer_id) : null;

        if ($customer === null) {
            return ['allowed' => false, 'reason' => 'no_client',
                'message' => 'This shipment has no client, so there is nobody to check payment against.', 'outstanding' => null];
        }

        $issued = DB::table('accounts_invoices')->where('job_id', $job->id)->where('customer_id', $customer->id)
            ->whereNotIn('status', ['draft', 'void']);
        $count = (clone $issued)->count();
        $outstanding = round((float) (clone $issued)->sum(DB::raw(
            "CASE WHEN type = 'credit_note' THEN -1 ELSE 1 END * (grand_total - amount_paid) * exchange_rate")), 2);

        if ($count > 0 && $outstanding <= 0.009) {
            return ['allowed' => true, 'reason' => 'paid', 'message' => 'Paid in full.', 'outstanding' => 0.0];
        }

        $credit = app(CreditGateService::class)->check($customer);

        if (! $credit['blocked']) {
            return ['allowed' => true, 'reason' => 'within_credit',
                'message' => $count === 0 ? 'Nothing billed yet; the client is within credit.' : 'Not yet paid; the client is within credit.',
                'outstanding' => $outstanding];
        }

        // Say what actually blocks it: this shipment's unpaid amount when there is one, and the client's own position.
        $position = sprintf('%s owes ₹%s against a limit of ₹%s', $customer->name,
            number_format((float) $credit['exposure'], 2), number_format((float) $credit['limit'], 2));

        return ['allowed' => false, 'reason' => 'payment_required',
            'message' => ($outstanding > 0.009 ? '₹' . number_format($outstanding, 2) . ' is unpaid on this shipment, and ' : '')
                . $position . '. Collect it, or have Accounts raise the limit, before releasing the cargo.',
            'outstanding' => $outstanding];
    }

    /** Everything the import page binds to, in one read. */
    private function payload(Job $job): array
    {
        $mode = $job->transport_mode;
        $parent = $job->parent_job_id ? Job::withoutTenantScope()->find($job->parent_job_id, ['id', 'execution_job_no']) : null;

        return [
            'mode'     => $mode,
            'document' => $job->is_consolidation ? 'master' : 'house',
            'job'      => $job->only(['id', 'execution_job_no', 'awb_number', 'consol_type', 'status', 'customer_id', 'parent_job_id']),
            'client'   => $job->customer_id ? DB::table('customers')->where('id', $job->customer_id)->value('name') : null,
            'parent'   => $parent,
            'houses'   => Job::withoutTenantScope()->where('parent_job_id', $job->id)->orderBy('id')
                ->get(['id', 'execution_job_no', 'awb_number', 'customer_id']),
            'details'  => $mode === 'sea'
                ? DB::table('sea_shipment_details')->where('job_id', $job->id)
                    ->first(['vessel_name', 'voyage_no', 'pol_code', 'pod_code', 'eta', 'mbl_number', 'hbl_number',
                        'piece_count', 'gross_weight', 'igm_no', 'igm_date', 'handling_agent_id', 'filing_status'])
                : DB::table('air_shipment_details')->where('job_id', $job->id)
                    ->first(['flight_number', 'flight_date', 'carrier_name', 'pol_code', 'pod_code', 'piece_count',
                        'gross_weight', 'chargeable_weight']),
            'import'   => $mode === 'air' ? DB::table('air_import_details')->where('job_id', $job->id)->first() : null,
            'arrival_notice' => DB::table('cargo_arrival_notices')->where('job_id', $job->id)->first(['id', 'notice_number', 'created_at']),
            'delivery_order' => DB::table('delivery_orders')->where('job_id', $job->id)->first(),
            'release'  => $this->release($job),
            'invoices' => DB::table('accounts_invoices')->where('job_id', $job->id)->whereNotIn('status', ['draft', 'void'])
                ->get(['id', 'invoice_no', 'type', 'grand_total', 'amount_paid', 'currency']),
            'agents'   => DB::table('partners')->where('company_id', DB::table('agents_info')->where('id', $job->agent_id)->value('company_id'))
                ->whereIn('partner_type', ['agent', 'overseas_agent', 'handling_agent', 'cfs_warehouse'])->orderBy('name')->get(['id', 'name']),
        ];
    }

    private function mode(): string
    {
        return app()->bound('active_portal_scope') ? app('active_portal_scope') : 'sea';
    }

    private function mustBeImport(Job $job): void
    {
        abort_unless($job->direction === 'import', 422, 'This is an export shipment; import documents are for cargo arriving.');
    }

    /** Write a 1:1 detail row, creating it on first save. */
    private function upsert(string $table, Job $job, array $values): void
    {
        $values['updated_at'] = now();

        if (DB::table($table)->where('job_id', $job->id)->exists()) {
            DB::table($table)->where('job_id', $job->id)->update($values);

            return;
        }

        $row = $values + ['job_id' => $job->id, 'created_at' => now()];

        if ($table === 'air_import_details') {
            $row['agent_id'] = $job->agent_id;
        }

        DB::table($table)->insert($row);
    }

    private function pdfResponse(string $bytes, string $name)
    {
        return response($bytes, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . preg_replace('/[^A-Za-z0-9\-]/', '', $name) . '.pdf"',
        ]);
    }
}
