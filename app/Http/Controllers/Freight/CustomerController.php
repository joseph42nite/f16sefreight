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
            // The mail addresses saved from the client's domain.
            ->withCount('contacts')
            ->orderBy('name')
            ->paginate(50);

        if (! $this->withAccounts()) {
            $customers->getCollection()->each->makeHidden(self::ACCOUNTS_FIELDS);
        }

        return response()->json($customers->toArray() + ['with_accounts' => $this->withAccounts()]);
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
            'sales_id'     => ['nullable', 'integer', 'exists:users,id'],
        ];

        if ($this->withAccounts()) {
            $rules += [
                'gst_no'             => ['nullable', 'string', 'max:30'],
                'pan_no'             => ['nullable', 'string', 'max:20'],
                'payment_terms_days' => ['nullable', 'integer', 'min:0', 'max:365'],
                'credit_limit'       => ['nullable', 'numeric', 'min:0'],
            ];
        }

        $data = $request->validate($rules);

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
