<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Job;
use App\ManifestFiling;
use App\Services\AuditLogger;
use App\Services\IcegateValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
    ) {}

    /** Filings for this branch, newest first. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewManifest');

        $filings = ManifestFiling::query()
            ->when($request->filled('job_id'), fn ($q) => $q->where('job_id', $request->integer('job_id')))
            ->with('job:id,job_order_no,transport_mode,awb_number,status')
            ->latest('created_at')
            ->paginate(50);

        return response()->json($filings);
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
     * Record a filing.
     *
     * 🔴 **This does NOT transmit anything.** The ICEGATE wire format is not specified
     * anywhere in the planning set, and a flat file invented here would look correct,
     * pass our own tests and be rejected by the gateway — the worst of the three
     * outcomes. See GAPS.md #26. What this endpoint does today is the part that is
     * fully specified: validate to the letter, then record the filing.
     */
    public function store(Request $request, Job $job): JsonResponse
    {
        $this->authorize('fileManifest');

        $data = $request->validate([
            'icegate_id' => 'required|string|max:' . IcegateValidator::ICEGATE_ID_MAX,
        ]);

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

        $filing = ManifestFiling::create([
            'agent_id'   => $job->agent_id,
            'job_id'     => $job->id,
            'icegate_id' => $data['icegate_id'],
        ]);

        $this->audit->record($job->agent_id, 'manifest.filed', 'job', $job->id, auth()->id());

        return response()->json($filing->fresh('job'), 201);
    }
}
