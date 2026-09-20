<?php

namespace App\Http\Controllers\Freight;

use App\Customer;
use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The client directory — guide §5, ui_ux_guide.md §9.10.
 *
 * ⚠️ **Customers are TENANT-wide, not branch-scoped.** `TenantScope` filters this table
 * on `company_id`, so every branch of a tenant sees the same client list.
 * `customers.branch_id` is an advisory managing/proximity branch used for routing and
 * sales assignment — **not an isolation boundary** (PRD.md §1.2). Scoping by branch
 * would hide a client from the branch actually handling their shipment.
 *
 * 🔐 **Banking columns never leave this controller.** `Customer` marks them `$hidden`, so
 * they are absent from every response here. Editing them is a separate, narrower
 * endpoint — a directory list is not the place to expose account numbers.
 */
class CustomerController extends Controller
{
    /**
     * 🔒 Accounts figures — Command only (user, 2026-09-16): Tactical has no accounts, so its client page shows the
     * domain, name and contact details, never a GSTIN, PAN, payment terms or credit limit.
     */
    private const ACCOUNTS_FIELDS = ['gst_no', 'pan_no', 'payment_terms_days', 'credit_limit'];

    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): JsonResponse
    {
        $customers = Customer::query()
            ->when($request->filled('q'), function ($q) use ($request) {
                $term = '%' . $request->string('q') . '%';
                $q->where(fn ($w) => $w->where('name', 'like', $term)
                    ->orWhere('email_domain', 'like', $term)
                    ->when($this->withAccounts(), fn ($w) => $w->orWhere('gst_no', 'like', $term)));
            })
            // §9.10 — the client book is scoped to the rep on Command. A sales user sees
            // their own accounts; everyone else sees the tenant's whole directory.
            ->when($this->scopeToOwnBook(), fn ($q) => $q->where('sales_id', auth()->id()))
            // Every branch's clients, or one branch's (user, 2026-09-20: "show all the clients of all the branches").
            ->when($request->filled('branch_id'), fn ($q) => $q->where('branch_id', $request->integer('branch_id')))
            ->when($request->filled('sales_id'), fn ($q) => $q->where('sales_id', $request->integer('sales_id')))
            ->when($request->boolean('unassigned'), fn ($q) => $q->whereNull('sales_id'))
            ->when($request->boolean('no_limit'), fn ($q) => $q->whereNull('credit_limit'))
            // The mail addresses saved from the client's domain.
            ->withCount('contacts')
            ->orderBy('name')
            ->paginate($request->integer('per_page') ?: 50);

        if (! $this->withAccounts()) {
            $customers->getCollection()->each->makeHidden(self::ACCOUNTS_FIELDS);
        }

        $this->describe($customers->getCollection());

        return response()->json(array_merge($customers->toArray(), [
            'with_accounts' => $this->withAccounts(),
            'options' => $this->options(),
        ]));
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('editClients');

        $customer = Customer::create($this->validated($request) + [
            'company_id' => $this->companyId(),
        ]);
        app(\App\Services\ClientContacts::class)->backfill($customer);

        $this->audit->record($this->agentId(), 'customer.created', 'customer', $customer->id, auth()->id());

        return response()->json($this->shown($customer), 201);
    }

    /** Write in or correct a client's name and details — on Tactical, usually the name for a domain. */
    public function update(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('editClients');

        $customer->update($this->validated($request));
        if ($customer->wasChanged('email_domain')) {
            app(\App\Services\ClientContacts::class)->backfill($customer);
        }

        $this->audit->record($this->agentId(), 'customer.updated', 'customer', $customer->id, auth()->id());

        return response()->json($this->shown($customer->fresh()));
    }

    /**
     * Put the branch, the rep and the money on every row.
     *
     * ⚠️ Three lookups for the page, not one per client. A credit check per row is what turns a 50-row directory
     * into 150 queries, and this page is the one the Boss leaves open.
     */
    private function describe($customers): void
    {
        $branches = \Illuminate\Support\Facades\DB::table('agents_info')
            ->whereIn('id', $customers->pluck('branch_id')->filter()->unique())->pluck('agent_name', 'id');
        $reps = \Illuminate\Support\Facades\DB::table('users')
            ->whereIn('id', $customers->pluck('sales_id')->filter()->unique())->pluck('name', 'id');

        // What each client owes, in one grouped query. Credit notes subtract — the same rule as the ageing and
        // the credit gate, and the reason all three agree.
        $owed = \App\AccountsInvoice::withoutGlobalScopes()
            ->whereIn('customer_id', $customers->pluck('id'))
            ->whereIn('status', \App\Services\AgeingService::OWED)
            ->selectRaw('customer_id, SUM(CASE WHEN type = ? THEN -1 ELSE 1 END * (grand_total - amount_paid)) AS owed', ['credit_note'])
            ->groupBy('customer_id')->pluck('owed', 'customer_id');

        foreach ($customers as $customer) {
            $customer->setAttribute('branch', $branches[$customer->branch_id] ?? null);
            $customer->setAttribute('salesperson', $reps[$customer->sales_id] ?? null);

            if (! $this->withAccounts()) {
                continue;
            }

            $exposure = round((float) ($owed[$customer->id] ?? 0), 2);
            $limit = $customer->credit_limit === null ? null : (float) $customer->credit_limit;

            $customer->setAttribute('exposure', $exposure);
            // NULL limit is "not configured", never zero — the difference decides whether cargo moves.
            $customer->setAttribute('available', $limit === null ? null : round($limit - $exposure, 2));
            $customer->setAttribute('on_hold', $limit !== null && $exposure > $limit);
        }
    }

    /** What the onboarding form has to offer: our branches, our reps, and the ports directory. */
    private function options(): array
    {
        $companyId = $this->companyId();

        return [
            'branches' => \Illuminate\Support\Facades\DB::table('agents_info')->where('company_id', $companyId)
                ->orderBy('agent_name')->get(['id', 'agent_name as name']),
            'salespeople' => \Illuminate\Support\Facades\DB::table('users')->where('company_name', $companyId)
                ->whereIn('designation', ['sales', 'boss'])->where('is_active', 1)
                ->orderBy('name')->get(['id', 'name', 'designation', 'branch_name as branch_id']),
        ];
    }

    /** The ports picker, searched rather than listed — 25,158 rows is not a dropdown. */
    public function ports(Request $request): JsonResponse
    {
        $term = $request->string('q')->toString();

        return response()->json(['ports' => \Illuminate\Support\Facades\DB::table('ports')
            ->where('is_active', true)
            ->when($term !== '', fn ($q) => $q->where(fn ($w) => $w->where('locode', 'like', strtoupper($term) . '%')
                ->orWhere('port_name', 'like', '%' . $term . '%')))
            ->orderBy('locode')->limit(25)->get(['id', 'locode', 'port_name', 'country_code', 'port_type'])]);
    }

    /** The addresses the client writes from, most used first. */
    public function contacts(Customer $customer): JsonResponse
    {
        $this->authorize('editClients');

        return response()->json(['contacts' => $customer->contacts()
            ->orderByDesc('message_count')->orderBy('email')
            ->get(['id', 'email', 'name', 'message_count', 'last_seen_at', 'include_in_cc', 'opted_out_at', 'source'])]);
    }

    /** The client fields this tier may write; the accounts figures only on Command. */
    private function validated(Request $request): array
    {
        $rules = [
            'name'         => ['required', 'string', 'max:100'],
            'email_domain' => ['nullable', 'string', 'max:100'],
            'email'        => ['nullable', 'email', 'max:100'],
            'phone'        => ['nullable', 'string', 'max:30'],
            'address'      => ['nullable', 'string'],
            // Who owns the relationship, and which of our branches carries it (PRD §2.2). Both are checked
            // against THIS tenant below — `exists:users,id` alone would let another company's rep be attached.
            'sales_id'     => ['nullable', 'integer'],
            'branch_id'    => ['nullable', 'integer'],
            'default_port_id' => ['nullable', 'integer', 'exists:ports,id'],
        ];

        if ($this->withAccounts()) {
            $rules += [
                'gst_no'             => ['nullable', 'string', 'max:30'],
                'pan_no'             => ['nullable', 'string', 'max:20'],
                'duns_no'            => ['nullable', 'string', 'max:20'],
                'payment_terms_days' => ['nullable', 'integer', 'min:0', 'max:365'],
                'credit_limit'       => ['nullable', 'numeric', 'min:0'],
                'bank_name'          => ['nullable', 'string', 'max:100'],
                'bank_account_no'    => ['nullable', 'string', 'max:40'],
                'bank_ifsc_code'     => ['nullable', 'string', 'max:20'],
            ];
        }

        $data = $request->validate($rules);

        // 🔴 **A rep and a branch of OUR company, or neither.** `exists:users,id` passes for any user on the
        // platform, so an id typed or guessed would attach a client to a stranger's sales rep — and
        // `customers.sales_id` is the scoping key for the entire Command-tier client book, so that client would
        // then appear in their book and vanish from ours.
        foreach ([['sales_id', 'users', 'company_name'], ['branch_id', 'agents_info', 'company_id']] as [$field, $table, $column]) {
            if (! empty($data[$field]) && ! \Illuminate\Support\Facades\DB::table($table)
                ->where('id', $data[$field])->where($column, $this->companyId())->exists()) {
                abort(422, 'That ' . ($field === 'sales_id' ? 'salesperson' : 'branch') . ' is not one of yours.');
            }
        }

        // The column is NOT NULL with a default; an empty box means "use the default", not NULL.
        if (array_key_exists('payment_terms_days', $data) && $data['payment_terms_days'] === null) {
            unset($data['payment_terms_days']);
        }

        return $data;
    }

    private function shown(Customer $customer): Customer
    {
        return $this->withAccounts() ? $customer : $customer->makeHidden(self::ACCOUNTS_FIELDS);
    }

    private function withAccounts(): bool
    {
        return \App\Support\UserContext::for(auth()->user())->tierAtLeast('command');
    }

    /**
     * The DERIVED client group — every row sharing (company_id, email_domain).
     *
     * That pair IS the grouping key; there is deliberately no parent_customer_id
     * (PRD.md §2.2). One client with five branches is five rows sharing a domain, which
     * is what makes "how is Globex doing?" answerable without inventing an entity.
     *
     * ⚠️ The roll-up is for DISPLAY. Credit is never evaluated across the group: separate
     * GSTINs are separate billing entities, and one branch's overdue invoice must not
     * freeze another branch's cargo.
     */
    public function group(Customer $customer): JsonResponse
    {
        $members = blank($customer->email_domain)
            ? collect([$customer])
            : Customer::where('email_domain', $customer->email_domain)->orderBy('name')->get();

        return response()->json([
            'email_domain'       => $customer->email_domain,
            'members'            => $members->map(fn ($m) => $this->shown($m)),
            // Displayed, never enforced — and a Command figure.
            'group_credit_limit' => $this->withAccounts() ? $members->sum('credit_limit') : null,
        ]);
    }

    /** Command-tier sales users see only their own book (PRD.md §2.3.3). */
    private function scopeToOwnBook(): bool
    {
        $context = \App\Support\UserContext::for(auth()->user());

        return $context->designation === 'sales' && $context->tier === 'command';
    }

    private function companyId(): int
    {
        return (int) \App\Support\UserContext::for(auth()->user())->companyId;
    }

    private function agentId(): int
    {
        return (int) auth()->user()->branch_name;
    }
}
