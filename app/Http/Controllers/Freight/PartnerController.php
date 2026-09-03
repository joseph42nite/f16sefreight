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

    /**
     * Partners the SIBLING branches of this company already have, for the add form.
     *
     * 🔴 A convenience, never a shortcut past the state registration. A branch adding a
     * broker its Chennai office already uses should not retype the name and address — but
     * it must supply its OWN GSTIN, because that is a Tamil Nadu registration and this is
     * Maharashtra. So the name, type and address come across and the tax numbers do not.
     *
     * ⚠️ Deliberately `withoutGlobalScopes()` on the branch filter and re-scoped to the
     * COMPANY by hand: a sibling's row is invisible under the ordinary tenant scope, which
     * is exactly right for reading and exactly wrong for a picker.
     */
    public function siblings(Request $request): JsonResponse
    {
        $context = \App\Support\UserContext::for(auth()->user());

        $rows = Partner::withoutGlobalScopes()
            ->where('company_id', $context->companyId)
            ->where('agent_id', '!=', $context->agentId)
            ->when($request->filled('type'), fn ($q) => $q->where('partner_type', $request->string('type')))
            ->orderBy('name')
            ->limit(200)
            // 🔐 No `gst_no`, no `pan_no`, no bank columns. Those are the branch's own
            // registration details and the copying branch must enter its own.
            ->get(['id', 'name', 'partner_type', 'email', 'phone', 'address', 'agent_id']);

        return response()->json(['partners' => $rows]);
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

        $context = \App\Support\UserContext::for(auth()->user());

        // 🔴 The BRANCH owns the row, because the GSTIN on it is a state registration.
        // `company_id` is kept so a company-wide view stays possible without a join, but
        // the tenant filter is on `agent_id` — see Partner::$tenantColumn.
        $partner = Partner::create($data + [
            'company_id' => (int) $context->companyId,
            'agent_id'   => (int) $context->agentId,
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
