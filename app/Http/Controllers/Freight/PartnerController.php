<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Partner;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * The partner directory — carriers, brokers, transporters, vendors.
 *
 * Tenant-wide like customers. ⚠️ NOT the legacy `airlines` table, which is retained for
 * the email exclusion engine's carrier-domain list; accounting and operational carrier
 * records live here (PRD.md §10).
 *
 * 🔐 Banking columns are `$hidden` on the model and never appear in these responses.
 */
class PartnerController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): JsonResponse
    {
        $partners = Partner::query()
            ->when($request->filled('type'), fn ($q) => $q->ofType($request->string('type')))
            ->when($request->filled('q'), fn ($q) => $q->where('name', 'like', '%' . $request->string('q') . '%'))
            ->orderBy('name')
            ->paginate(50);

        return response()->json($partners);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('triage');

        $data = $request->validate([
            'name'         => ['required', 'string', 'max:100'],
            // One row can act in several roles across shipments; partner_type is only the
            // PRIMARY classification. The actual role belongs to the relationship.
            'partner_type' => ['required', Rule::in(Partner::TYPES)],
            'email'        => ['nullable', 'email', 'max:100'],
            'phone'        => ['nullable', 'string', 'max:30'],
            'address'      => ['nullable', 'string'],
            'gst_no'       => ['nullable', 'string', 'max:30'],
            'pan_no'       => ['nullable', 'string', 'max:20'],
        ]);

        $partner = Partner::create($data + [
            'company_id' => (int) \App\Support\UserContext::for(auth()->user())->companyId,
        ]);

        $this->audit->record((int) auth()->user()->branch_name, 'partner.created', 'partner', $partner->id, auth()->id());

        return response()->json($partner, 201);
    }

    /** The closed value set, so the UI never invents a type the validator will refuse. */
    public function types(): JsonResponse
    {
        return response()->json(['types' => Partner::TYPES]);
    }
}
