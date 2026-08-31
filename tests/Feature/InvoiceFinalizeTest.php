<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\Support\SpawnsChildProcesses;
use Tests\TestCase;

/**
 * Invoice finalization and posting — guide §8.1.
 *
 * The balanced-journal and GST-account clauses are asserted in `CreditGateTest`
 * (`test_posting_writes_a_balanced_journal`, `test_gst_is_credited_to_a_liability_and_
 * never_to_revenue`) and the split arithmetic in `GstSplitTest`. This file covers the two
 * clauses nothing else reaches: **an explicitly CLOSED period**, and **concurrency locks
 * preventing duplicate invoice numbers**.
 *
 * ⚠️ Not transactional — the concurrency test spawns real processes, which cannot see
 * uncommitted rows. The tenant is reused rather than recreated because posting writes
 * `audit_logs`, which is append-only by trigger and holds FKs to `agents_info`/`users`.
 */
class InvoiceFinalizeTest extends TestCase
{
    use SpawnsChildProcesses;

    private Agent $branch;
    private User $accounts;
    private Customer $customer;
    private array $invoiceIds = [];
    private array $jobIds = [];
    private array $enquiryIds = [];
    private array $periodIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::firstOrCreate(['code' => 'IFT'], ['name' => 'Finalize Co', 'tier' => 'command']);

        $this->branch = Agent::withoutGlobalScopes()->firstOrCreate(
            ['company_id' => $company->id, 'branch_code' => 'IFB'],
            ['agent_name' => 'Finalize Branch']
        );

        $this->accounts = User::withoutGlobalScopes()->firstOrCreate(
            ['email' => 'accounts-ift@test.local'],
            [
                'name' => 'Accounts', 'password' => Hash::make('x'),
                'company_name' => $company->id, 'branch_name' => $this->branch->id,
                'designation' => 'accounts', 'is_active' => 1,
            ]
        );

        $this->customer = Customer::withoutGlobalScopes()->firstOrCreate(
            ['company_id' => $company->id, 'name' => 'Finalize Client'],
            ['email_domain' => 'finalize.test']
        );
    }

    protected function tearDown(): void
    {
        DB::table('accounts_ledger_entries')->whereIn('source_id', $this->invoiceIds)
            ->where('source_type', 'invoice')->delete();
        DB::table('accounts_invoice_items')->whereIn('invoice_id', $this->invoiceIds)->delete();
        DB::table('accounts_invoices')->whereIn('id', $this->invoiceIds)->delete();
        DB::table('jobs')->whereIn('id', $this->jobIds)->delete();
        DB::table('enquiries')->whereIn('id', $this->enquiryIds)->delete();
        DB::table('accounting_periods')->whereIn('id', $this->periodIds)->delete();

        parent::tearDown();
    }

    /** A draft invoice with NO number yet — finalization is what mints it. */
    private function draft(float $amount = 10000.00): int
    {
        $enquiryId = DB::table('enquiries')->insertGetId([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-IFTIFB-26-' . random_int(1000, 9999),
            'status' => 'converted', 'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->enquiryIds[] = $enquiryId;

        $jobId = DB::table('jobs')->insertGetId([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiryId,
            'transport_mode' => 'air', 'status' => 'Intake',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->jobIds[] = $jobId;

        // ⚠️ The placeholder mirrors PRODUCTION exactly (JobCostSheetController::
        // invoiceFor). `invoice_no` is NOT NULL with no default (GAPS.md #27), and
        // `uq_invoice_agent_no` is UNIQUE on (agent_id, invoice_no) — so a branch cannot
        // hold two drafts carrying the same placeholder. An earlier draft of this fixture
        // used the empty string and collided on the second invoice.
        $invoiceId = DB::table('accounts_invoices')->insertGetId([
            'agent_id' => $this->branch->id, 'job_id' => $jobId,
            'customer_id' => $this->customer->id,
            'invoice_no' => 'DRAFT-' . $jobId . '-' . now()->format('YmdHis'),
            'type' => 'invoice', 'document_date' => now()->toDateString(),
            'status' => 'draft', 'subtotal' => $amount, 'tax_amount' => 0,
            'grand_total' => $amount, 'created_at' => now(), 'updated_at' => now(),
        ]);
        $this->invoiceIds[] = $invoiceId;

        DB::table('accounts_invoice_items')->insert([
            'invoice_id' => $invoiceId, 'charge_type' => 'air_freight', 'description' => 'Freight',
            'quantity' => 1, 'rate' => $amount, 'amount' => $amount, 'net_amount' => $amount,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return $invoiceId;
    }

    private function period(string $status): void
    {
        $this->periodIds[] = DB::table('accounting_periods')->insertGetId([
            'agent_id' => $this->branch->id, 'period_name' => 'FY26 ' . $status,
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'status' => $status, 'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function api(): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->accounts),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path): string
    {
        return 'http://accounts.localhost' . $path;
    }

    // ─── 1. A CLOSED period, not merely a missing one ────────────────────────

    /**
     * 🔴 A period row that EXISTS and is `closed` is a different case from no period at
     * all, and only this one is the guide's wording. The absent-period case is covered in
     * CreditGateTest; a naive implementation that checks `whereNotNull` rather than
     * `status = 'open'` passes that test and fails this one — while quietly letting
     * postings land in a month that has already been filed.
     *
     * ⚠️ **DOC vs CODE, unresolved:** guide §8.1 and PRD §2391 both say this returns
     * `403`. The code returns `422 no_open_period`. This test asserts only what both
     * agree on — that it is REFUSED and nothing is written — until that is settled.
     * See GAPS.md.
     */
    public function test_posting_into_a_closed_period_is_refused(): void
    {
        $invoiceId = $this->draft();
        DB::table('accounts_invoices')->where('id', $invoiceId)->update(['status' => 'finalized']);
        $this->period('closed');

        $response = $this->api()->postJson($this->url("/api/invoices/{$invoiceId}/post"));

        $this->assertContains($response->getStatusCode(), [403, 422],
            'Posting into a closed period must be refused.');
        $this->assertSame('no_open_period', $response->json('reason'));
    }

    /**
     * 🔴 THE PART THAT ACTUALLY MATTERS: the refusal leaves NO ledger rows and the
     * invoice unposted. A refusal that had already written half a journal would be worse
     * than no check at all — the period would be filed with an entry nobody authorised.
     */
    public function test_a_refused_posting_writes_nothing_at_all(): void
    {
        $invoiceId = $this->draft();
        DB::table('accounts_invoices')->where('id', $invoiceId)->update(['status' => 'finalized']);
        $this->period('closed');

        $this->api()->postJson($this->url("/api/invoices/{$invoiceId}/post"));

        $this->assertSame(0, DB::table('accounts_ledger_entries')
            ->where('source_type', 'invoice')->where('source_id', $invoiceId)->count(),
            'A refused posting left ledger rows behind.');

        $this->assertSame(0, (int) DB::table('accounts_invoices')->where('id', $invoiceId)->value('is_posted'));
    }

    /** An open period covering the same date posts, so the refusal above is the STATUS. */
    public function test_the_same_invoice_posts_once_a_period_is_open(): void
    {
        $invoiceId = $this->draft();
        DB::table('accounts_invoices')->where('id', $invoiceId)->update(['status' => 'finalized']);
        $this->period('open');

        $this->api()->postJson($this->url("/api/invoices/{$invoiceId}/post"))
            ->assertOk()
            ->assertJsonPath('is_posted', true);
    }

    // ─── 2. Concurrency: no two invoices share a number ──────────────────────

    /**
     * 🔴 SIX FINALIZATIONS AT ONCE, SIX DISTINCT NUMBERS. An invoice number is the
     * document's identity to a client and to the GST return; two invoices sharing one is
     * not a display bug, it is a filing that cannot be corrected after submission.
     *
     * ⚠️ This races the real endpoint, not a re-implementation of its query — six
     * separate processes each finalizing a DIFFERENT draft, all minting from the same
     * counter at the same moment.
     */
    public function test_parallel_finalizations_never_share_an_invoice_number(): void
    {
        // 🔴 FORCE A COLD START. With the counter row already present every child takes
        // the UPDATE path, which never deadlocks — so a run against a warm database
        // proves only half the code. Deleting the row first means all six race to CREATE
        // it, which is the April-1st case and the one that actually broke: this test
        // passed in isolation and failed in the full suite purely because an earlier run
        // had left the row behind.
        DB::table('sequence_counters')
            ->where('agent_id', $this->branch->id)->where('prefix', 'INV')->delete();

        $ids = array_map(fn () => $this->draft(), range(1, 6));
        $token = auth()->guard('user-api')->login($this->accounts);

        $commands = array_map(
            fn (int $id) => $this->httpChild('POST', $this->url("/api/invoices/{$id}/finalize"), $token),
            $ids
        );

        [$outputs, $stderr] = $this->runInParallel($commands);

        $ok = 0;

        foreach ($outputs as $out) {
            if (str_starts_with(trim($out), '200')) {
                $ok++;
            }
        }

        $this->assertSame(6, $ok, "Every finalization should succeed. stderr:\n" . $stderr
            . "\nstdout:\n" . implode("\n", $outputs));

        $numbers = DB::table('accounts_invoices')->whereIn('id', $ids)->pluck('invoice_no')->all();

        foreach ($numbers as $n) {
            $this->assertStringStartsWith('INV-', $n,
                "A finalized invoice kept its draft placeholder: {$n}");
        }

        $this->assertSame(6, count(array_unique($numbers)),
            'Two invoices share a number: ' . implode(', ', $numbers));
    }

    /**
     * ⚠️ Finalizing twice must not mint a SECOND number for the same invoice. The
     * controller guards on `status !== 'draft'`, and the `?:` on `invoice_no` is the
     * second line of defence — burning a number is a gap in a sequence a tax authority
     * expects to be contiguous.
     */
    public function test_finalizing_twice_does_not_renumber_or_burn_a_number(): void
    {
        $invoiceId = $this->draft();

        $this->api()->postJson($this->url("/api/invoices/{$invoiceId}/finalize"))->assertOk();
        $first = DB::table('accounts_invoices')->where('id', $invoiceId)->value('invoice_no');

        $this->api()->postJson($this->url("/api/invoices/{$invoiceId}/finalize"))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'not_draft');

        $this->assertSame($first, DB::table('accounts_invoices')->where('id', $invoiceId)->value('invoice_no'));
    }
}
