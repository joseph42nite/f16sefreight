<?php

namespace Tests\Feature;

use App\AccountsInvoice;
use App\AccountsInvoiceItem;
use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Services\CreditGateService;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The client credit gate — PRD.md §6, guide §5.3.
 *
 * This is the check that stops cargo moving for a client who cannot pay, so the
 * NULL-vs-zero distinction is not a nicety: reading NULL as 0 credit-blocks every newly
 * onboarded customer.
 */
class CreditGateTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Credit Co', 'code' => 'CRD', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->accounts = $this->user('accounts');
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-cr@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function customer(?float $limit): Customer
    {
        return Customer::create([
            'company_id' => $this->company->id, 'name' => 'Globex ' . random_int(1, 99999),
            'email_domain' => 'globex.test', 'credit_limit' => $limit,
        ]);
    }

    private function invoice(Customer $customer, float $amount, string $status = 'draft', float $tax = 0.0): AccountsInvoice
    {
        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-CRDBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);
        $job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air']);

        $invoice = AccountsInvoice::create([
            'agent_id' => $this->branch->id, 'job_id' => $job->id, 'customer_id' => $customer->id,
            'invoice_no' => 'INV-CRDBOM-26-' . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            'type' => 'invoice', 'document_date' => now()->toDateString(),
            'status' => $status, 'subtotal' => $amount - $tax, 'tax_amount' => $tax,
            'grand_total' => $amount,
        ]);

        AccountsInvoiceItem::create([
            'invoice_id' => $invoice->id, 'charge_type' => 'air_freight', 'description' => 'Freight',
            'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'net_amount' => $amount,
        ]);

        return $invoice;
    }

    private function gate(): CreditGateService
    {
        return app(CreditGateService::class);
    }

    // ─── NULL is not zero ────────────────────────────────────────────────────

    /**
     * 🔴 THE REGRESSION THE MIGRATION EXISTS FOR. With credit_limit NOT NULL DEFAULT
     * 0.00, every customer onboarded without an explicit limit was instantly blocked —
     * which reads to the desk as a broken gate, not as missing configuration.
     */
    public function test_a_customer_with_no_configured_limit_is_not_blocked(): void
    {
        $check = $this->gate()->check($this->customer(null), 500000.00);

        $this->assertFalse($check['blocked']);
        $this->assertSame('no_limit_configured', $check['reason']);
        $this->assertNull($check['limit']);
    }

    /** ...but an explicit zero means exactly that: no credit at all. */
    public function test_a_customer_with_a_zero_limit_is_blocked_by_any_amount(): void
    {
        $check = $this->gate()->check($this->customer(0.00), 0.01);

        $this->assertTrue($check['blocked']);
        $this->assertSame('credit_limit_exceeded', $check['reason']);
    }

    // ─── Exposure ────────────────────────────────────────────────────────────

    /** Drafts and voids are not money owed. Only issued documents are exposure. */
    public function test_only_issued_invoices_count_toward_exposure(): void
    {
        $customer = $this->customer(100000.00);

        $this->invoice($customer, 40000.00, 'finalized');
        $this->invoice($customer, 90000.00, 'draft');
        $this->invoice($customer, 70000.00, 'void');
        $this->invoice($customer, 25000.00, 'paid');

        $this->assertSame(40000.00, $this->gate()->exposure($customer));
    }

    public function test_partial_payment_reduces_exposure(): void
    {
        $customer = $this->customer(100000.00);
        $invoice = $this->invoice($customer, 50000.00, 'partially_paid');
        $invoice->update(['amount_paid' => 20000.00]);

        $this->assertSame(30000.00, $this->gate()->exposure($customer));
    }

    public function test_the_gate_blocks_only_when_the_projected_total_exceeds_the_limit(): void
    {
        $customer = $this->customer(100000.00);
        $this->invoice($customer, 80000.00, 'finalized');

        $this->assertFalse($this->gate()->check($customer, 20000.00)['blocked'], 'Exactly at the limit is allowed.');
        $this->assertTrue($this->gate()->check($customer, 20000.01)['blocked']);
    }

    // ─── Per branch, never per group ─────────────────────────────────────────

    /**
     * 🔴 Separate GSTINs are separate billing entities. One branch's overdue invoice must
     * not freeze another branch's cargo (PRD.md §1.2).
     */
    public function test_one_branch_of_a_client_group_does_not_block_another(): void
    {
        $mumbai = $this->customer(100000.00);
        $chennai = $this->customer(100000.00);

        $this->invoice($mumbai, 100000.00, 'finalized'); // Mumbai is at its limit

        $this->assertTrue($this->gate()->check($mumbai, 1.00)['blocked']);
        $this->assertFalse($this->gate()->check($chennai, 90000.00)['blocked'],
            'Chennai is a separate billing entity and must be unaffected.');
    }

    /** The group total is shown to the desk but never passed to the gate. */
    public function test_the_group_rollup_sees_the_whole_relationship(): void
    {
        $mumbai = $this->customer(100000.00);
        $chennai = $this->customer(100000.00);

        $this->invoice($mumbai, 60000.00, 'finalized');
        $this->invoice($chennai, 25000.00, 'finalized');

        $group = $this->gate()->groupExposure($mumbai);

        $this->assertSame(2, $group['members']);
        $this->assertSame(85000.00, $group['exposure']);
    }

    // ─── Over HTTP ───────────────────────────────────────────────────────────

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    /**
     * The financial register is reachable from BOTH cross-mode portals, but each role
     * uses its own: accounts works at `accounts.`, the Boss at `admin.`. A boss hitting
     * `accounts.` is refused by EnforcePortalAccess before any role gate runs — the
     * portal decides WHERE you work, the gate decides WHAT you may do there.
     */
    private function url(string $path, string $host = 'accounts.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    /** ⚠️ 422 aborts finalization — never a warning the UI can dismiss. */
    public function test_finalizing_over_the_limit_returns_422_and_does_not_finalize(): void
    {
        $customer = $this->customer(50000.00);
        $invoice = $this->invoice($customer, 80000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/finalize"))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'credit_limit_exceeded');

        $this->assertSame('draft', $invoice->fresh()->status, 'The invoice must remain a draft.');
    }

    public function test_finalizing_within_the_limit_succeeds(): void
    {
        $customer = $this->customer(100000.00);
        $invoice = $this->invoice($customer, 80000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/finalize"))
            ->assertOk()
            ->assertJsonPath('status', 'finalized');
    }

    /** A client with no configured limit must not be blocked at onboarding. */
    public function test_finalizing_for_a_customer_with_no_limit_succeeds(): void
    {
        $invoice = $this->invoice($this->customer(null), 5000000.00);

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/finalize"))
            ->assertOk();
    }

    // ─── Segregation of duties ───────────────────────────────────────────────

    /**
     * 🔒 The single most likely permission to get wrongly widened. Posting and period
     * control are exclusive to `accounts`.
     */
    public function test_a_boss_cannot_finalize_or_post(): void
    {
        $boss = $this->user('boss');
        $invoice = $this->invoice($this->customer(null), 1000.00, 'finalized');

        // On admin., where the Boss legitimately works — so this proves the ROLE gate
        // refuses them, not merely the portal.
        $admin = 'admin.f16sefreight.com';
        $this->api($boss)->postJson($this->url("/api/invoices/{$invoice->id}/finalize", $admin))->assertForbidden();
        $this->api($boss)->postJson($this->url("/api/invoices/{$invoice->id}/post", $admin))->assertForbidden();
    }

    /** ...but the Boss may READ the registers — from their own portal. */
    public function test_a_boss_may_read_the_register_from_the_admin_portal(): void
    {
        $this->api($this->user('boss'))
            ->getJson($this->url('/api/invoices', 'admin.f16sefreight.com'))
            ->assertOk();
    }

    /** The portal decides WHERE you work, before any role gate is consulted. */
    public function test_a_boss_is_refused_on_the_accounts_portal_entirely(): void
    {
        $this->api($this->user('boss'))
            ->getJson($this->url('/api/invoices'))
            ->assertForbidden()
            ->assertJsonPath('reason', 'designation');
    }

    public function test_posting_requires_an_open_accounting_period(): void
    {
        $invoice = $this->invoice($this->customer(null), 1000.00, 'finalized');

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/post"))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'no_open_period');
    }

    /** An open period the posting tests can land in. */
    private function openPeriod(): void
    {
        \Illuminate\Support\Facades\DB::table('accounting_periods')->insert([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26 Q2',
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    /** The journal actually written for one invoice, keyed by account code. */
    private function journalOf(AccountsInvoice $invoice): array
    {
        return \Illuminate\Support\Facades\DB::table('accounts_ledger_entries as l')
            ->join('chart_of_accounts as c', 'c.id', '=', 'l.chart_of_account_id')
            ->where('l.source_type', 'invoice')->where('l.source_id', $invoice->id)
            ->get(['c.account_code', 'l.debit_amount', 'l.credit_amount'])
            ->keyBy('account_code')
            ->map(fn ($r) => ['dr' => (float) $r->debit_amount, 'cr' => (float) $r->credit_amount])
            ->all();
    }

    /** Posting writes a BALANCED journal — the invariant no constraint can express. */
    public function test_posting_writes_a_balanced_journal(): void
    {
        $invoice = $this->invoice($this->customer(null), 195880.00, 'finalized');
        $this->openPeriod();

        $this->api($this->accounts)
            ->postJson($this->url("/api/invoices/{$invoice->id}/post"))
            ->assertOk()
            ->assertJsonPath('is_posted', true);

        $entries = \Illuminate\Support\Facades\DB::table('accounts_ledger_entries')
            ->where('source_type', 'invoice')->where('source_id', $invoice->id)->get();

        $this->assertSame(
            (float) $entries->sum('debit_amount'),
            (float) $entries->sum('credit_amount'),
            'The journal must balance.'
        );
    }

    /**
     * 🔴 THE REGRESSION THIS TEST EXISTS FOR. Posting used to credit the GRAND TOTAL to
     * revenue, so tax collected for the government was booked as our own income. The
     * journal balanced perfectly while doing it — which is precisely why the balance
     * assertion above did not catch it. A wrong-account posting balances just as well
     * as a right one, so the accounts themselves must be asserted.
     */
    public function test_gst_is_credited_to_a_liability_and_never_to_revenue(): void
    {
        // ₹1,00,000 freight + ₹18,000 GST — the worked example in ui_ux_guide §9.6.
        $invoice = $this->invoice($this->customer(null), 118000.00, 'finalized', 18000.00);
        $this->openPeriod();

        $this->api($this->accounts)->postJson($this->url("/api/invoices/{$invoice->id}/post"))->assertOk();

        $journal = $this->journalOf($invoice);

        $this->assertSame(118000.00, $journal['1200-AR']['dr'], 'AR carries the full receivable.');
        $this->assertSame(100000.00, $journal['4000-Freight-Revenue']['cr'], 'Revenue is the subtotal ONLY.');
        $this->assertSame(18000.00, $journal['2200-GST-Output']['cr'], 'The tax is a liability.');
    }

    /**
     * An export invoice has no output tax AT ALL. A 0.00 row in the GST register is a
     * filing claim we did not mean to make, so the line is omitted rather than zeroed.
     */
    public function test_a_zero_tax_invoice_writes_no_gst_line(): void
    {
        $invoice = $this->invoice($this->customer(null), 50000.00, 'finalized', 0.0);
        $this->openPeriod();

        $this->api($this->accounts)->postJson($this->url("/api/invoices/{$invoice->id}/post"))->assertOk();

        $this->assertArrayNotHasKey('2200-GST-Output', $this->journalOf($invoice));
    }

    /**
     * The confirmation the accountant reads must be the SERVER's journal, not the UI's
     * guess at it — a preview that drifts from the posting code still looks right.
     */
    public function test_the_posting_preview_is_the_journal_that_gets_written(): void
    {
        $invoice = $this->invoice($this->customer(null), 118000.00, 'finalized', 18000.00);
        $this->openPeriod();

        $preview = $this->api($this->accounts)
            ->getJson($this->url("/api/invoices/{$invoice->id}/posting-preview"))
            ->assertOk()
            ->assertJsonPath('balanced', true)
            ->json('lines');

        $this->api($this->accounts)->postJson($this->url("/api/invoices/{$invoice->id}/post"))->assertOk();

        $journal = $this->journalOf($invoice);

        $this->assertCount(count($journal), $preview, 'Same number of lines.');
        foreach ($preview as $line) {
            $this->assertSame((float) $line['debit'], $journal[$line['code']]['dr'], $line['code'] . ' debit');
            $this->assertSame((float) $line['credit'], $journal[$line['code']]['cr'], $line['code'] . ' credit');
        }
    }

    /** The Boss may READ the consequence of a posting they are not allowed to perform. */
    public function test_a_boss_may_read_the_posting_preview_but_not_post(): void
    {
        $boss = $this->user('boss');
        $admin = 'admin.f16sefreight.com'; // where the Boss legitimately works.
        $invoice = $this->invoice($this->customer(null), 118000.00, 'finalized', 18000.00);

        $this->api($boss)->getJson($this->url("/api/invoices/{$invoice->id}/posting-preview", $admin))->assertOk();
        $this->api($boss)->postJson($this->url("/api/invoices/{$invoice->id}/post", $admin))->assertForbidden();
    }

}
