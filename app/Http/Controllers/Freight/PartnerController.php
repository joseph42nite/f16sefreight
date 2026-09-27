<?php

namespace App\Http\Controllers\Freight;

use App\Http\Controllers\Controller;
use App\Partner;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    /**
     * 🔒 Accounts figures — Command only (user, 2026-09-26), exactly as for clients (`CustomerController`): Tactical
     * has no accounts, so a partner there is a name, a type and contact details — never a GSTIN, a PAN, or the TDS
     * section and s.197 rate that decide what is withheld from a payment it will never make. Stripped HERE, not in the
     * component: a column left out of a template still arrives in the JSON.
     */
    private const ACCOUNTS_FIELDS = ['gst_no', 'pan_no', 'tds_section', 'tds_rate_override'];

    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): JsonResponse
    {
        $partners = Partner::query()
            ->when($request->filled('type'), fn ($q) => $q->ofType($request->string('type')))
            ->when($request->filled('q'), fn ($q) => $q->where('name', 'like', '%' . $request->string('q') . '%'))
            ->orderBy('name')
            ->paginate(50);

        // Which branch each partner belongs to — the Boss sees every branch's (user, 2026-09-16).
        $branches = \Illuminate\Support\Facades\DB::table('agents_info')
            ->whereIn('id', $partners->getCollection()->pluck('agent_id')->unique())->pluck('agent_name', 'id');
        $partners->getCollection()->each(fn ($p) => $p->setAttribute('branch', $branches[$p->agent_id] ?? null));

        if (! $this->withAccounts()) {
            $partners->getCollection()->each->makeHidden(self::ACCOUNTS_FIELDS);
        }

        return response()->json(array_merge($partners->toArray(), ['with_accounts' => $this->withAccounts()]));
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
        ] + ($this->withAccounts() ? [
            // Only where there are accounts to use them — on Tactical a GSTIN sent anyway is not stored.
            'gst_no'       => ['nullable', 'string', 'max:30'],
            'pan_no'       => ['nullable', 'string', 'max:20'],
        ] : []));

        $context = \App\Support\UserContext::for(auth()->user());

        // 🔴 The BRANCH owns the row, because the GSTIN on it is a state registration.
        // `company_id` is kept so a company-wide view stays possible without a join, but
        // the tenant filter is on `agent_id` — see Partner::$tenantColumn.
        $partner = Partner::create($data + [
            'company_id' => (int) $context->companyId,
            'agent_id'   => (int) $context->agentId,
        ]);

        $this->audit->record((int) auth()->user()->branch_name, 'partner.created', 'partner', $partner->id, auth()->id());

        return response()->json($this->withAccounts() ? $partner : $partner->makeHidden(self::ACCOUNTS_FIELDS), 201);
    }

    /** The closed value set, so the UI never invents a type the validator will refuse. */
    public function types(): JsonResponse
    {
        return response()->json(['types' => Partner::TYPES]);
    }

    /**
     * Which section this vendor is deducted under, and a s.197 certificate rate if they hold one.
     *
     * 🔴 `manageFinanceSettings`, not `triage` — a classification that decides how much a vendor is actually
     * paid belongs to the same desk that sets the rate table, not to whoever added the vendor's name and
     * phone number.
     */
    public function updateTds(Request $request, Partner $partner): JsonResponse
    {
        $this->authorize('manageFinanceSettings');

        $data = $request->validate([
            'tds_section' => ['nullable', 'string', 'max:20'],
            // A s.197 certificate: a lower rate, or nil (0). NULL means no certificate — the section's own rate applies.
            'tds_rate_override' => ['nullable', 'numeric', 'min:0', 'max:100'],
            // Jev's suggestion, if one was shown, so the section saved is recorded against it (GAPS #415).
            'decision_id' => ['nullable', 'integer'],
        ]);

        $partner->update(\Illuminate\Support\Arr::except($data, ['decision_id']));

        app(\App\Services\Accounts\JevDecisions::class)->record($data['decision_id'] ?? null, (int) $partner->company_id,
            $data['tds_section'] ?? 'none', (int) auth()->id());

        return response()->json($partner->fresh());
    }

    /**
     * ⑥ Which TDS section this supplier's services fall under (GAPS #415) — asked ON DEMAND, from the edit, never for
     * every row a list shows. The options are the branch's OWN rate table, as accounts describe each section, plus
     * none and not sure: no tax law is written into the question. A legal classification, so it only pre-fills the
     * select, labelled to be checked against their certificate; Save is still the person's.
     */
    public function suggestTds(Partner $partner): JsonResponse
    {
        $this->authorize('manageFinanceSettings');

        $sections = DB::table('tds_rates')->where('agent_id', $partner->agent_id)->where('is_active', 1)
            ->orderBy('section')->pluck('description', 'section');

        $options = $sections->map(fn ($d, $s) => "{$s}: {$d}")->all() + [
            'none' => config('accounts_decisions.questions.vendor_tds.none'),
            'not_sure' => config('accounts_decisions.questions.vendor_tds.not_sure'),
        ];

        // Facts PHP can state. The PAN's fourth letter IS the holder's type — the difference between two sections.
        $holder = ['P' => 'an individual', 'C' => 'a company', 'H' => 'a Hindu undivided family', 'F' => 'a firm or LLP',
                   'A' => 'an association of persons', 'T' => 'a trust', 'B' => 'a body of individuals', 'G' => 'a government body',
                   'L' => 'a local authority', 'J' => 'an artificial juridical person'];
        $pan = strtoupper((string) $partner->pan_no);

        $jev = app(\App\Services\Accounts\JevDecisions::class)->ask('vendor_tds', (int) $partner->agent_id, 'partner', (int) $partner->id, [
            'supplier' => $partner->name,
            'kind_of_partner' => str_replace('_', ' ', (string) $partner->partner_type),
            'pan_holder_is' => strlen($pan) === 10 ? ($holder[$pan[3]] ?? 'not stated by the PAN') : 'unknown — no PAN on file',
            'what_we_have_booked_from_them' => DB::table('accounts_purchase_items as i')
                ->join('accounts_purchase_vouchers as v', 'v.id', '=', 'i.purchase_voucher_id')
                ->where('v.vendor_id', $partner->id)->distinct()->limit(8)->pluck('i.description')->filter()->implode('; ') ?: 'nothing yet',
        ], $options);

        return response()->json(['jev' => $jev, 'sections' => $sections]);
    }

    private function withAccounts(): bool
    {
        return \App\Support\UserContext::for(auth()->user())->tierAtLeast('command');
    }
}
