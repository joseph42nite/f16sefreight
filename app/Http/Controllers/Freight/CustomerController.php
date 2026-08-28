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
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): JsonResponse
    {
        $customers = Customer::query()
            ->when($request->filled('q'), function ($q) use ($request) {
                $term = '%' . $request->string('q') . '%';
                $q->where(fn ($w) => $w->where('name', 'like', $term)
                    ->orWhere('email_domain', 'like', $term)
                    ->orWhere('gst_no', 'like', $term));
            })
            // §9.10 — the client book is scoped to the rep on Command. A sales user sees
            // their own accounts; everyone else sees the tenant's whole directory.
            ->when($this->scopeToOwnBook(), fn ($q) => $q->where('sales_id', auth()->id()))
            ->orderBy('name')
            ->paginate(50);

        return response()->json($customers);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('triage'); // pricing owns onboarding at this stage

        $data = $request->validate([
            'name'               => ['required', 'string', 'max:100'],
            'email_domain'       => ['nullable', 'string', 'max:100'],
            'email'              => ['nullable', 'email', 'max:100'],
            'phone'              => ['nullable', 'string', 'max:30'],
            'address'            => ['nullable', 'string'],
            'gst_no'             => ['nullable', 'string', 'max:30'],
            'pan_no'             => ['nullable', 'string', 'max:20'],
            'payment_terms_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'credit_limit'       => ['nullable', 'numeric', 'min:0'],
            'sales_id'           => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $customer = Customer::create($data + [
            'company_id' => $this->companyId(),
        ]);

        $this->audit->record($this->agentId(), 'customer.created', 'customer', $customer->id, auth()->id());

        return response()->json($customer, 201);
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
        if (blank($customer->email_domain)) {
            return response()->json(['members' => [$customer], 'group_credit_limit' => $customer->credit_limit]);
        }

        $members = Customer::where('email_domain', $customer->email_domain)->orderBy('name')->get();

        return response()->json([
            'email_domain'       => $customer->email_domain,
            'members'            => $members,
            'group_credit_limit' => $members->sum('credit_limit'), // displayed, never enforced
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
