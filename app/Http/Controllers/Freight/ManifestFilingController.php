<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Job;
use App\ManifestFiling;
use App\Services\AuditLogger;
use App\Services\IcegateConnection;
use App\Services\IcegateValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Manifest filing — guide §5.4.
 *
 * 🔒 `fileManifest` — operations. Document work is done by the same operations user
 * who executes the shipment (PRD.md §2.3: `documentation` is a legacy designation
 * value, not a login). Pricing and sales may READ a filing; neither may transmit one.
 *
 * ⚠️ **Validation runs BEFORE compilation, and a blocking violation aborts.** ICEGATE
 * rejects a malformed manifest at the gateway, and a rejection is not a retry — it is
 * an amendment, with its own number and its own paper trail. Catching a bad container
 * check digit here costs a correction; catching it there costs a truck turned away.
 */
class ManifestFilingController extends Controller
{
    public function __construct(
        private readonly IcegateValidator $validator,
        private readonly AuditLogger $audit,
        private readonly IcegateConnection $icegate,
    ) {}

    /** Filings for this branch, newest first, filtered as PRD §5.8's CGM Filing grid is. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewManifest');

        $filings = ManifestFiling::query()
            // FocusAir sees air filings and FocusSea sea filings — one screen, read by the portal it is opened in.
            ->whereIn('job_id', Job::forActivePortal()->select('id'))
            ->when($request->filled('job_id'), fn ($q) => $q->where('job_id', $request->integer('job_id')))
            ->when($request->filled('filing_type'), fn ($q) => $q->where('filing_type', $request->input('filing_type')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->when($request->filled('custom_house_code'), fn ($q) => $q->where('custom_house_code', strtoupper($request->input('custom_house_code'))))
            ->when($request->filled('icegate_id'), fn ($q) => $q->where('icegate_id', $request->input('icegate_id')))
            ->when($request->filled('job_no'), fn ($q) => $q->whereHas('job',
                fn ($j) => $j->where('execution_job_no', 'like', '%' . $request->input('job_no') . '%')))
            ->when($request->filled('from'), fn ($q) => $q->whereDate('filed_at', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('filed_at', '<=', $request->date('to')))
            ->with('job:id,execution_job_no,job_order_no,transport_mode,awb_number,status')
            ->latest('id')
            ->paginate(50);

        return response()->json($filings);
    }

    /**
     * What can be filed from this portal: the filing types and the branch's jobs. Sea offers consol masters (a CGM is
     * the consol's manifest); air offers jobs holding a MAWB. Branch-wide, not owner-scoped — filing is the branch's.
     */
    public function jobs(Request $request): JsonResponse
    {
        $this->authorize('viewManifest');

        $mode = app()->bound('active_portal_scope') ? app('active_portal_scope') : 'sea';
        $term = trim((string) $request->input('q'));

        $jobs = Job::query()->where('transport_mode', $mode)
            ->where('status', '!=', 'Cancelled')
            ->when($mode === 'sea', fn ($q) => $q->where('is_consolidation', true))
            ->when($mode === 'air', fn ($q) => $q->whereNotNull('awb_number')->where('is_sub_shipment', false))
            ->when($term !== '', fn ($q) => $q->where(fn ($w) => $w->where('execution_job_no', 'like', "%{$term}%")
                ->orWhere('awb_number', 'like', "%{$term}%")))
            ->latest('id')->limit(100)
            ->get(['id', 'execution_job_no', 'awb_number', 'direction']);

        $mbls = $mode === 'sea'
            ? DB::table('sea_shipment_details')->whereIn('job_id', $jobs->pluck('id'))->pluck('mbl_number', 'job_id')
            : collect();

        return response()->json([
            'mode'  => $mode,
            'types' => ManifestFiling::TYPES_BY_MODE[$mode],
            'jobs'  => $jobs->map(fn (Job $j) => [
                'id'               => $j->id,
                'execution_job_no' => $j->execution_job_no,
                'document_no'      => $mode === 'sea' ? $mbls[$j->id] ?? null : $j->awb_number,
                'direction'        => $j->direction,
            ])->values(),
        ]);
    }

    /** Whether Auto File can run, and what is missing — env key names, never their values. */
    public function connection(): JsonResponse
    {
        $this->authorize('viewManifest');

        return response()->json($this->icegate->status());
    }

    /**
     * A DRY RUN — every violation, changing nothing.
     *
     * Read-only and open to anyone who may view the manifest, deliberately: pricing
     * seeing that a consignee name is eight characters too long is how it gets fixed
     * in the address book rather than at the gateway.
     */
    public function check(Job $job): JsonResponse
    {
        $this->authorize('viewManifest');

        $violations = $this->validator->validate($job);

        return response()->json([
            'job_id'     => $job->id,
            'mode'       => $job->transport_mode,
            'filable'    => count($violations) === 0,
            'violations' => $violations,
        ]);
    }

    /**
     * Record a filing — PRD §5.8's *Submit CGM Data*.
     *
     * 🔴 **This does NOT transmit anything yet.** `auto` is refused with 422 until ICEGATE is connected
     * (IcegateConnection names what is missing); `manual` and `email` record a filing the operator made outside the
     * system, as an IRN is recorded rather than minted. Validation runs first either way.
     *
     * The amendment number is the next one for this job and filing type — a rejection is answered by an amendment,
     * never by editing the rejected filing.
     */
    public function store(Request $request, Job $job): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'icegate_id'        => 'required|string|max:' . IcegateValidator::ICEGATE_ID_MAX,
            'filing_type'       => ['required', Rule::in(ManifestFiling::TYPES_BY_MODE[$job->transport_mode] ?? [])],
            'custom_house_code' => ['required', 'string', 'regex:/^[A-Za-z0-9]{6}$/'],
            'sending_method'    => ['required', Rule::in(ManifestFiling::METHODS)],
            'filed_at'          => 'nullable|date',
        ], [
            'custom_house_code.regex' => 'A custom house code is the 6-character ICEGATE code, e.g. INNSA1.',
        ]);

        // Unreachable in practice until a transmitter exists: canTransmit() is false while config's transmitter is NULL.
        if ($data['sending_method'] === 'auto' && ! $this->icegate->canTransmit()) {
            return response()->json([
                'error'   => $this->icegate->reason(),
                'reason'  => 'icegate_not_connected',
                'missing' => $this->icegate->missing(),
            ], 422);
        }

        $violations = $this->validator->validate($job);
        $blocking = array_values(array_filter($violations, fn ($v) => $v['severity'] === 'blocking'));

        if ($blocking !== []) {
            return response()->json([
                'error'  => count($blocking) === 1
                    ? 'One structural violation must be resolved before filing.'
                    : count($blocking) . ' structural violations must be resolved before filing.',
                'reason' => 'icegate_validation_failed',
                'violations' => $blocking,
            ], 422);
        }

        $filing = DB::transaction(function () use ($job, $data) {
            $previous = ManifestFiling::where('job_id', $job->id)->where('filing_type', $data['filing_type'])
                ->lockForUpdate()->max('amendment_no');
            $amendment = $previous === null ? 0 : $previous + 1;

            $filing = ManifestFiling::create([
                'agent_id'          => $job->agent_id,
                'job_id'            => $job->id,
                'icegate_id'        => $data['icegate_id'],
                'filing_type'       => $data['filing_type'],
                'custom_house_code' => strtoupper($data['custom_house_code']),
                'amendment_no'      => $amendment,
                'filed_at'          => $data['filed_at'] ?? now(),
                'sending_method'    => $data['sending_method'],
                'status'            => 'submitted',
                'status_log'        => [$this->logEntry('submitted', sprintf(
                    '%s amendment %d filed at %s (%s).',
                    $data['filing_type'], $amendment, strtoupper($data['custom_house_code']), $data['sending_method']
                ))],
            ]);

            $this->syncBill($filing);

            return $filing;
        });

        $this->audit->record($job->agent_id, 'manifest.filed', 'job', $job->id, auth()->id());

        return response()->json($filing->fresh('job'), 201);
    }

    /**
     * What the gateway answered — cleared or rejected — recorded by the operator from ICEGATE's acknowledgement.
     * Only a submitted filing has an answer to record; a rejected one is followed by a new amendment.
     */
    public function outcome(Request $request, ManifestFiling $filing): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'status' => ['required', Rule::in(ManifestFiling::OUTCOMES)],
            'note'   => 'nullable|string|max:500',
        ]);

        if ($filing->status !== 'submitted') {
            return response()->json([
                'error'  => "This filing is already {$filing->status}. A correction is a new amendment.",
                'reason' => 'filing_already_answered',
            ], 422);
        }

        DB::transaction(function () use ($filing, $data) {
            $filing->update([
                'status'     => $data['status'],
                'status_log' => array_merge($filing->status_log ?? [], [$this->logEntry($data['status'], $data['note'] ?? null)]),
            ]);

            $this->syncBill($filing);
        });

        $this->audit->record($filing->agent_id, "manifest.{$data['status']}", 'job', $filing->job_id, auth()->id());

        return response()->json($filing->fresh('job'));
    }

    private function logEntry(string $status, ?string $note): array
    {
        return ['at' => now()->toIso8601String(), 'by' => auth()->user()?->name, 'status' => $status, 'note' => $note];
    }

    /**
     * The bill's tab 11 status follows its LATEST filing — an answer to an older amendment must not overwrite the
     * state of the one that replaced it.
     */
    private function syncBill(ManifestFiling $filing): void
    {
        $latest = ManifestFiling::where('job_id', $filing->job_id)->max('id');

        // Air has no filing status column; its filings are its state.
        if ((int) $latest === (int) $filing->id && $filing->job->transport_mode === 'sea') {
            DB::table('sea_shipment_details')->where('job_id', $filing->job_id)
                ->update(['filing_status' => $filing->status, 'updated_at' => now()]);
        }
    }
}
