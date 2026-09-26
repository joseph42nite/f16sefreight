<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The standing money rules, held by three figures that broke them (user, 2026-09-26): the sales dashboard's revenue,
 * the margin preview, and the credit gate's currency.
 *
 *   Revenue is NET OF TAX (the subtotal) · a credit note SUBTRACTS, a debit note adds · a void never stood
 *   · everything in INR at the document's own rate — the limit is rupees, and so is the cost.
 *
 * One client, one rep, all air. Worked by hand:
 *
 *   I1  invoice        ₹100,000 + 18%     = ₹118,000
 *   I2  invoice        USD 1,000 + 18% @83 = ₹83,000 net, ₹97,940 gross
 *   C1  credit note    ₹10,000 + 18%      = ₹11,800            subtracts
 *   D1  debit note     ₹5,000 + 18%       = ₹5,900             adds
 *   V1  VOID invoice   ₹50,000 + 18%                           never counted
 *
 *   revenue  100,000 + 83,000 − 10,000 + 5,000   = 178,000
 *   owed     118,000 + 97,940 − 11,800 + 5,900   = 210,040
 */
class RevenueRulesTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $accounts;
    private User $boss;
    private User $rep;
    private Customer $client;
    private Job $job;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Rules Co', 'code' => 'RUL', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $user = fn (string $role) => User::create(['name' => ucfirst($role), 'email' => "{$role}-rul@test.local",
            'password' => Hash::make('x'), 'company_name' => $this->company->id, 'branch_name' => $this->branch->id,
            'designation' => $role, 'is_active' => 1]);
        $this->accounts = $user('accounts');
        $this->boss = $user('boss');
        $this->rep = $user('sales');

        $this->client = Customer::create(['company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test',
            'sales_id' => $this->rep->id, 'branch_id' => $this->branch->id, 'credit_limit' => 1000000]);

        $enquiry = Enquiry::create(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => 'converted',
            'enquiry_no' => 'ENQA-RULBOM-26-0001', 'customer_id' => $this->client->id]);
        $this->job = Job::create(['agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id, 'transport_mode' => 'air',
            'execution_job_no' => 'JOBA-RULBOM-26-0001', 'customer_id' => $this->client->id]);

        DB::table('accounting_periods')->insert(['agent_id' => $this->branch->id, 'period_name' => 'FY26',
            'start_date' => now()->startOfYear()->toDateString(), 'end_date' => now()->endOfYear()->toDateString(),
            'status' => 'open', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function as(User $u): self
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function doc(string $no, string $type, float $net, string $status = 'finalized', string $currency = 'INR',
        float $rate = 1, ?Customer $to = null, ?int $parent = null): int
    {
        $to ??= $this->client;
        $tax = round($net * 0.18, 2);
        $id = DB::table('accounts_invoices')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $this->job->id,
            'transport_mode' => 'air', 'customer_id' => $to->id, 'billed_party_type' => 'customer', 'billed_party_id' => $to->id,
            'parent_invoice_id' => $parent, 'invoice_no' => $no, 'type' => $type, 'document_date' => now()->toDateString(),
            'status' => $status, 'currency' => $currency, 'exchange_rate' => $rate, 'subtotal' => $net, 'tax_amount' => $tax,
            'grand_total' => $net + $tax, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_invoice_items')->insert(['invoice_id' => $id, 'charge_type' => 'freight', 'description' => 'Freight',
            'hsn_sac_code' => '996531', 'quantity' => 1, 'rate' => $net, 'amount' => $net, 'tax_percentage' => 18,
            'tax_amount' => $tax, 'net_amount' => $net + $tax, 'created_at' => now(), 'updated_at' => now()]);

        return $id;
    }

    /** The five documents in the class docblock. */
    private function theSet(): void
    {
        $i1 = $this->doc('INV-RUL-1', 'invoice', 100000);
        $this->doc('INV-RUL-2', 'invoice', 1000, 'finalized', 'USD', 83);
        $this->doc('CN-RUL-1', 'credit_note', 10000, 'finalized', 'INR', 1, null, $i1);
        $this->doc('DN-RUL-1', 'debit_note', 5000, 'finalized', 'INR', 1, null, $i1);
        $this->doc('INV-RUL-V', 'invoice', 50000, 'void');
    }

    // ─── The sales dashboard ─────────────────────────────────────────────────

    public function test_a_reps_revenue_is_net_of_tax_in_inr_with_notes_signed_and_voids_out(): void
    {
        $this->theSet();

        $staff = $this->as($this->boss)->getJson('http://admin.f16sefreight.com/api/sales/staff?grain=month')->assertOk()->json();

        // Not 236,000-odd of grand totals with the void in and the credit note out: 178,000.
        $this->assertEquals(178000, collect($staff['sales'])->firstWhere('id', $this->rep->id)['revenue']);
    }

    public function test_the_snapshot_revenue_and_what_is_owed_follow_the_same_rules(): void
    {
        $this->theSet();

        $this->artisan('sales:compute-snapshots', ['--date' => now()->toDateString()])->assertSuccessful();
        $snapshot = DB::table('customer_performance_snapshots')->where('customer_id', $this->client->id)
            ->where('transport_mode', 'air')->first();

        $this->assertEquals(178000, (float) $snapshot->revenue_mtd);
        $this->assertEquals(178000, (float) $snapshot->revenue_ytd);
        // All of it is under 30 days old: 210,040 owed, the credit note taken OFF, the dollar bill in rupees.
        $this->assertEquals(210040, (float) $snapshot->outstanding_0_30);
        // 210,040 of a 1,000,000 limit.
        $this->assertEquals(21.0, (float) $snapshot->credit_utilization);
    }

    // ─── The credit gate ─────────────────────────────────────────────────────

    public function test_the_credit_gate_counts_a_foreign_currency_bill_in_rupees(): void
    {
        $this->theSet();

        // 210,040 — the same figure the ageing and the snapshot now give, not 113,280 with USD at face value.
        $this->assertSame(210040.0, app(\App\Services\CreditGateService::class)->exposure($this->client));
    }

    public function test_a_dollar_invoice_that_would_breach_the_limit_in_rupees_is_stopped(): void
    {
        $small = Customer::create(['company_id' => $this->company->id, 'name' => 'Initech', 'email_domain' => 'initech.test',
            'credit_limit' => 50000]);
        // USD 700 + 18% = 826 at 83 is ₹68,558 — over ₹50,000. Counted at face value, 826 sailed through.
        $draft = $this->doc('DRAFT-RUL-USD', 'invoice', 700, 'draft', 'USD', 83, $small);

        $this->as($this->accounts)->postJson("http://accounts.localhost/api/invoices/{$draft}/finalize")
            ->assertStatus(422)->assertJsonPath('credit.projected', 68558);
    }

    /** 🔴 Giving a client money back can never be blocked for exceeding their credit. */
    public function test_a_credit_note_is_never_stopped_by_the_credit_gate(): void
    {
        $this->theSet();
        $this->client->update(['credit_limit' => 100000]);   // already 210,040 against 100,000 — over

        $parent = DB::table('accounts_invoices')->where('invoice_no', 'INV-RUL-1')->value('id');
        $note = $this->as($this->accounts)->postJson('http://accounts.localhost/api/billing/documents', [
            'type' => 'credit_note', 'parent_invoice_id' => $parent, 'reason' => 'Rate dispute settled',
            'lines' => [['description' => 'Rate adjustment', 'rate' => 5000, 'tax_percentage' => 18]],
        ])->assertCreated()->json();

        $this->postJson("http://accounts.localhost/api/invoices/{$note['id']}/finalize")->assertOk();
    }

    // ─── The margin preview ──────────────────────────────────────────────────

    public function test_the_margin_preview_is_net_of_tax_and_in_rupees(): void
    {
        // ₹20,000 sold at 18%, on a ₹15,000 cost with NO tax: the margin is 5,000 — not 23,600 − 15,000 = 8,600.
        $taxed = $this->doc('DRAFT-RUL-A', 'invoice', 20000, 'draft');
        DB::table('accounts_invoices')->where('id', $taxed)->update(['sent_to_accounts_at' => now()]);

        $vendor = Partner::create(['company_id' => $this->company->id, 'agent_id' => $this->branch->id,
            'name' => 'Carrier', 'partner_type' => 'airline']);
        $voucher = DB::table('accounts_purchase_vouchers')->insertGetId(['agent_id' => $this->branch->id, 'job_id' => $this->job->id,
            'vendor_id' => $vendor->id, 'transport_mode' => 'air', 'voucher_no' => 'PV-RUL-1', 'document_date' => now()->toDateString(),
            'status' => 'unpaid', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('accounts_purchase_items')->insert(['purchase_voucher_id' => $voucher, 'charge_type' => 'freight',
            'description' => 'Carrier', 'quantity' => 1, 'rate' => 15000, 'amount' => 15000, 'tax_percentage' => 0,
            'tax_amount' => 0, 'net_amount' => 15000, 'created_at' => now(), 'updated_at' => now()]);

        $row = collect($this->as($this->accounts)->getJson('http://accounts.localhost/api/invoices?awaiting=1')->assertOk()->json('data'))
            ->firstWhere('id', $taxed);
        $this->assertEquals([20000, 15000, 5000], [$row['sell_total'], $row['buy_total'], $row['margin']]);

        // A dollar sale less a rupee cost: USD 300 at 83 is ₹24,900, less ₹15,000 = ₹9,900.
        DB::table('accounts_invoices')->where('id', $taxed)->update(['currency' => 'USD', 'exchange_rate' => 83]);
        DB::table('accounts_invoice_items')->where('invoice_id', $taxed)->update(['amount' => 300, 'rate' => 300]);

        $row = collect($this->getJson('http://accounts.localhost/api/invoices?awaiting=1')->json('data'))->firstWhere('id', $taxed);
        $this->assertEquals([24900, 9900], [$row['sell_total'], $row['margin']]);
    }
}
