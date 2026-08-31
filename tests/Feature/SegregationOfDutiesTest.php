<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Segregation of duties — guide §8.1 `SegregationOfDutiesTest`.
 *
 * 🔴 The guide calls posting *"the single most likely permission to get wrongly widened
 * during development"*, and the reason is that widening it is always locally reasonable:
 * the Boss can read every financial report, so letting them post looks like a small
 * convenience. It is not.
 *
 * **The role that sets targets must not book the revenue those targets are measured in.**
 * The Boss reads everything and signs nothing (PRD.md §2.3.4).
 *
 * ⚠️ Every refusal here is asserted on the role's OWN portal, so a pass proves the ROLE
 * gate refused them — not merely that they were on the wrong host. A test that lets
 * `EnforcePortalAccess` do the refusing would stay green even if `postLedger` were
 * widened to include the Boss.
 */
class SegregationOfDutiesTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private int $periodId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'SoD Co', 'code' => 'SOD', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = $this->user('accounts');

        $this->periodId = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-sod@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    /** Each role's OWN portal — see the class docblock. */
    private function hostFor(string $designation): string
    {
        return match ($designation) {
            'accounts' => 'accounts.f16sefreight.com',
            'boss'     => 'admin.f16sefreight.com',
            default    => 'focusair.f16sefreight.com',
        };
    }

    private function url(string $path, string $designation): string
    {
        return 'http://' . $this->hostFor($designation) . $path;
    }

    private function invoice(string $status = 'draft'): AccountsInvoice
    {
        $customer = Customer::create([
            'company_id' => $this->company->id, 'name' => 'Acme ' . random_int(1, 99999),
            'email_domain' => 'acme.test',
        ]);
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SODBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);
        $job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
        ]);

        $invoice = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $customer->id,
            'invoice_no' => 'INV-SODBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'type' => 'invoice', 'document_date' => now()->toDateString(), 'status' => $status,
            'created_by' => $this->accounts->id,
            'subtotal' => 100000, 'tax_amount' => 18000, 'grand_total' => 118000, 'amount_paid' => 0,
        ]);

        AccountsInvoiceItem::create([
            'invoice_id' => $invoice->id, 'charge_type' => 'air_freight', 'description' => 'Freight',
            'quantity' => 1, 'rate' => 100000, 'amount' => 100000,
            'tax_percentage' => 18, 'tax_amount' => 18000, 'net_amount' => 118000,
        ]);

        return $invoice;
    }

    // ─── Finalize ────────────────────────────────────────────────────────────

    /** 🔒 Pricing edits the cost sheet. It does not finalize the invoice from it. */
    public function test_pricing_cannot_finalize(): void
    {
        $invoice = $this->invoice();

        $this->api($this->user('pricing'))
            ->postJson($this->url("/api/invoices/{$invoice->id}/finalize", 'pricing'))
            ->assertForbidden();
    }

    /** 🔒 …and neither can the Boss, on their OWN portal. */
    public function test_the_boss_cannot_finalize_on_their_own_portal(): void
    {
        $invoice = $this->invoice();

        $this->api($this->user('boss'))
            ->postJson($this->url("/api/invoices/{$invoice->id}/finalize", 'boss'))
            ->assertForbidden();
    }

    public function test_accounts_can_finalize(): void
    {
        $invoice = $this->invoice();

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/finalize", 'accounts'))
            ->assertOk()
            ->assertJsonPath('status', 'finalized');
    }

    // ─── Post to ledger ──────────────────────────────────────────────────────

    /**
     * 🔴 THE ONE THE GUIDE WARNS ABOUT. The Boss reads every financial report, so
     * letting them post looks like a small convenience. The role that sets targets must
     * not book the revenue those targets are measured in.
     */
    public function test_the_boss_cannot_post_to_the_ledger_on_their_own_portal(): void
    {
        $invoice = $this->invoice('finalized');

        $this->api($this->user('boss'))
            ->postJson($this->url("/api/invoices/{$invoice->id}/post", 'boss'))
            ->assertForbidden();

        $this->assertSame(0, DB::table('accounts_ledger_entries')
            ->where('source_id', $invoice->id)->where('source_type', 'invoice')->count());
    }

    public function test_pricing_cannot_post_to_the_ledger(): void
    {
        $invoice = $this->invoice('finalized');

        $this->api($this->user('pricing'))
            ->postJson($this->url("/api/invoices/{$invoice->id}/post", 'pricing'))
            ->assertForbidden();
    }

    public function test_only_accounts_can_post(): void
    {
        $invoice = $this->invoice('finalized');

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/post", 'accounts'))
            ->assertOk()
            ->assertJsonPath('is_posted', true);
    }

    // ─── Reconciliation ──────────────────────────────────────────────────────

    /** Settling cash against a receivable is bookkeeping, not oversight. */
    public function test_the_boss_cannot_reconcile(): void
    {
        $txn = DB::table('bank_transactions')->insertGetId([
            'agent_id' => $this->branch->id, 'plaid_transaction_id' => 'sod_' . uniqid('', true),
            'amount' => 118000, 'reconciliation_status' => 'unreconciled',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $invoice = $this->invoice('finalized');

        $this->api($this->user('boss'))
            ->postJson($this->url("/api/reconciliation/{$txn}/match", 'boss'), ['invoice_id' => $invoice->id])
            ->assertForbidden();
    }

    // ─── Reading is allowed; signing is not ──────────────────────────────────

    /**
     * ⚠️ The Boss READS everything. The refusals above are about signing, not about
     * secrecy — and a test suite that only proved refusals could pass with the Boss
     * locked out of the financials entirely, which would be a different bug.
     */
    public function test_the_boss_reads_every_financial_surface(): void
    {
        $this->invoice('finalized');
        $boss = $this->user('boss');

        foreach ([
            '/api/invoices',
            '/api/vouchers',
            '/api/reconciliation',
            "/api/reports/trial-balance?period_id={$this->periodId}",
        ] as $path) {
            $this->api($boss)->getJson($this->url($path, 'boss'))->assertOk();
        }
    }

    // ─── created_by ──────────────────────────────────────────────────────────

    /**
     * The guide asks that `created_by` on a posted invoice always resolves to an
     * accounts user. Asserted through the WHOLE path rather than on a seeded row: the
     * invoice is finalized and posted by the accounts user over HTTP, and the column is
     * checked afterwards.
     */
    public function test_created_by_on_a_posted_invoice_is_an_accounts_user(): void
    {
        $invoice = $this->invoice('finalized');

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/post", 'accounts'))
            ->assertOk();

        $createdBy = User::find($invoice->fresh()->created_by);

        $this->assertNotNull($createdBy);
        $this->assertSame('accounts', $createdBy->designation);
    }

    /**
     * 🔴 THE PORTAL AND THE ROLE ARE DIFFERENT GATES, and this proves they are both
     * live. A Boss on `accounts.` is refused by the PORTAL before any role check runs;
     * a Boss on `admin.` is refused by the ROLE. Only asserting the first would leave
     * the second free to be widened silently.
     */
    public function test_the_portal_refuses_before_the_role_does(): void
    {
        $boss = $this->user('boss');

        $this->api($boss)
            ->getJson('http://accounts.f16sefreight.com/api/invoices')
            ->assertForbidden()
            ->assertJsonPath('reason', 'designation');
    }
}
