<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The Boss overview — PRD.md §7.4.
 *
 * 🔴 This is the ONE screen that deliberately crosses both partitions the rest of the
 * product maintains: a rep is scoped to their book, a portal is scoped to its mode, and
 * the Boss is scoped to neither. "Air is soft this month but sea is carrying it" is a
 * sentence only somebody seeing both can say.
 *
 * ⚠️ It is still TENANT-bound, and that is the distinction these tests pin hardest.
 * `admin.` has no PORTAL scope; it has never had a licence to read another company.
 */
class BossOverviewTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $bom;
    private Agent $maa;
    private User $boss;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Boss Co', 'code' => 'BSS', 'tier' => 'command']);
        $this->bom = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->maa = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Chennai', 'branch_code' => 'MAA']);
        $this->boss = $this->user('boss', $this->bom);
    }

    private function user(string $designation, Agent $branch, string $suffix = ''): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}{$suffix}-bss@test.local",
            'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function snapshot(Agent $branch, string $mode, array $attrs = [], ?Company $company = null): void
    {
        $customer = Customer::create([
            'company_id' => ($company ?? $this->company)->id,
            'name' => 'Client ' . random_int(1, 99999), 'email_domain' => 'c.test',
        ]);

        DB::table('customer_performance_snapshots')->insert(array_merge([
            'agent_id' => $branch->id, 'customer_id' => $customer->id,
            'transport_mode' => $mode, 'snapshot_date' => now()->toDateString(),
            'tonnage_mtd' => 10, 'tonnage_ytd' => 100, 'shipment_count_mtd' => 2,
            'revenue_mtd' => 50000, 'outstanding_60_plus' => 0,
            'last_computed_at' => now(), 'created_at' => now(), 'updated_at' => now(),
        ], $attrs));
    }

    private function api(User $as): self
    {
        $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($as),
            'Accept' => 'application/json',
        ]);

        return $this;
    }

    private function url(string $path, string $host = 'admin.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    // ─── Crossing both partitions ────────────────────────────────────────────

    /** Every branch of the tenant, with a cell per mode. */
    public function test_the_boss_sees_every_branch_and_every_mode(): void
    {
        $this->snapshot($this->bom, 'air', ['tonnage_ytd' => 100]);
        $this->snapshot($this->bom, 'sea', ['tonnage_ytd' => 250]);
        $this->snapshot($this->maa, 'air', ['tonnage_ytd' => 40]);

        $body = $this->api($this->boss)
            ->getJson($this->url('/api/sales/branches'))
            ->assertOk()
            ->json();

        $byCode = collect($body['branches'])->keyBy('code');

        $this->assertCount(2, $body['branches']);
        $this->assertSame(350.0, (float) $byCode['BOM']['totals']['tonnage_ytd'], 'Both modes summed.');
        $this->assertArrayHasKey('air', $byCode['BOM']['modes']);
        $this->assertArrayHasKey('sea', $byCode['BOM']['modes']);
        // 🔴 Chennai has no sea rows, and the cell is ABSENT rather than zero — a
        // branch that does not run sea is a different fact from one that ran no sea.
        $this->assertArrayNotHasKey('sea', $byCode['MAA']['modes']);
    }

    /**
     * 🔴 STILL TENANT-BOUND. `admin.` drops the PORTAL scope, never the tenant one.
     * Conflating the two is how a client's Boss reads a competitor's books.
     */
    public function test_the_boss_never_sees_another_tenant(): void
    {
        $other = Company::create(['name' => 'Rival Ltd', 'code' => 'RVL', 'tier' => 'command']);
        $rivalBranch = Agent::create(['company_id' => $other->id, 'agent_name' => 'Delhi', 'branch_code' => 'DEL']);

        $this->snapshot($this->bom, 'air');
        $this->snapshot($rivalBranch, 'air', [], $other);

        $codes = collect($this->api($this->boss)
            ->getJson($this->url('/api/sales/branches'))
            ->assertOk()
            ->json('branches'))->pluck('code');

        $this->assertTrue($codes->contains('BOM'));
        $this->assertFalse($codes->contains('DEL'), 'A rival branch must never appear.');
    }

    /** 🔒 A rep is scoped to their own book — the cross-branch view is not theirs. */
    public function test_a_sales_rep_is_refused_the_cross_branch_view(): void
    {
        $rep = $this->user('sales', $this->bom);

        $this->api($rep)
            ->getJson($this->url('/api/sales/branches', 'focusair.f16sefreight.com'))
            ->assertForbidden()
            ->assertJsonPath('reason', 'designation');
    }

    /**
     * ⚠️ "Never computed" is reported as such, not as a branch that shipped nothing.
     * A Boss acting on zeroes no rollup produced is worse than one who knows there is
     * no data yet.
     */
    public function test_no_rollup_reports_never_computed_rather_than_zeroes(): void
    {
        $this->api($this->boss)
            ->getJson($this->url('/api/sales/branches'))
            ->assertOk()
            ->assertJsonPath('reason', 'never_computed')
            ->assertJsonPath('branches', []);
    }

    /**
     * 🔴 The Boss sets a branch's monthly targets per mode, and sees month-to-date against them and the month-end
     * pace (user, 2026-09-15). Fixed at 10 September: Mumbai air has 12 shipments, 4,000 kg, ₹6,00,000 so far;
     * pace = so far ÷ 10 days × 30 days.
     */
    public function test_the_boss_sets_targets_and_sees_progress_and_pace(): void
    {
        \Illuminate\Support\Carbon::setTestNow('2026-09-10 12:00:00');
        $this->snapshot($this->bom, 'air', ['tonnage_mtd' => 4000, 'shipment_count_mtd' => 12, 'revenue_mtd' => 600000]);

        $body = $this->api($this->boss)->putJson($this->url('/api/sales/targets'), [
            'month' => '2026-09',
            'targets' => [['agent_id' => $this->bom->id, 'mode' => 'air', 'shipments' => 40, 'tonnage' => 10000, 'revenue' => 1500000]],
        ])->assertOk()->json();

        $row = collect($body['rows'])->first(fn ($r) => $r['agent_id'] === $this->bom->id && $r['mode'] === 'air');
        $this->assertSame([40, 12, 30, 36], [(int) $row['measures']['shipments']['target'], (int) $row['measures']['shipments']['actual'],
            (int) $row['measures']['shipments']['percent'], (int) $row['measures']['shipments']['month_end']]);
        $this->assertSame([40.0, 12000.0], [(float) $row['measures']['tonnage']['percent'], (float) $row['measures']['tonnage']['month_end']]);
        $this->assertSame(40.0, (float) $row['measures']['revenue']['percent']);

        // Every branch and mode is listed so a target can be set where nothing has shipped yet — and each branch's total.
        $this->assertCount(6, $body['rows']);
        \Illuminate\Support\Carbon::setTestNow();
    }

    /**
     * 🔴 General billing counts toward the branch's revenue target (user, 2026-09-26). It has no mode, so it counts
     * toward the branch total — the sum of its mode targets — and never toward air or sea. Fixed at 10 September:
     *
     *   Mumbai targets     air ₹15,00,000 + sea ₹5,00,000                 = ₹20,00,000
     *   rollup so far      air ₹6,00,000 + sea ₹2,00,000                  = ₹8,00,000
     *   general billing    ₹3,47,000 + USD 1,000 @ 83 − credit note ₹30,000 = ₹4,00,000   (net of tax)
     *                      not a draft, not a void, not August's, not Chennai's
     *   branch             ₹12,00,000 of ₹20,00,000 = 60% · month end ₹12,00,000 ÷ 10 × 30 = ₹36,00,000
     */
    public function test_general_billing_counts_toward_the_branch_revenue_target(): void
    {
        \Illuminate\Support\Carbon::setTestNow('2026-09-10 12:00:00');
        $this->snapshot($this->bom, 'air', ['shipment_count_mtd' => 12, 'revenue_mtd' => 600000]);
        $this->snapshot($this->bom, 'sea', ['shipment_count_mtd' => 3, 'revenue_mtd' => 200000]);
        $client = Customer::create(['company_id' => $this->company->id, 'name' => 'Warehousing client', 'email_domain' => 'w.test']);

        $bill = fn (Agent $branch, string $type, float $net, string $date, string $status = 'finalized', string $currency = 'INR', float $rate = 1)
            => DB::table('accounts_invoices')->insert(['agent_id' => $branch->id, 'job_id' => null, 'transport_mode' => null,
                'customer_id' => $client->id, 'billed_party_type' => 'customer', 'billed_party_id' => $client->id,
                'invoice_no' => 'G-' . random_int(1, 999999), 'type' => $type, 'document_date' => $date, 'status' => $status,
                'currency' => $currency, 'exchange_rate' => $rate, 'subtotal' => $net, 'tax_amount' => round($net * 0.18, 2),
                'grand_total' => round($net * 1.18, 2), 'created_at' => now(), 'updated_at' => now()]);
        $bill($this->bom, 'invoice', 347000, '2026-09-05');
        $bill($this->bom, 'invoice', 1000, '2026-09-08', 'sent', 'USD', 83);
        $bill($this->bom, 'credit_note', 30000, '2026-09-09');
        $bill($this->bom, 'invoice', 99000, '2026-09-06', 'draft');
        $bill($this->bom, 'invoice', 55000, '2026-09-06', 'void');
        $bill($this->bom, 'invoice', 77000, '2026-08-31');
        $bill($this->maa, 'invoice', 66000, '2026-09-04');

        $body = $this->api($this->boss)->putJson($this->url('/api/sales/targets'), ['month' => '2026-09', 'targets' => [
            ['agent_id' => $this->bom->id, 'mode' => 'air', 'shipments' => 40, 'revenue' => 1500000],
            ['agent_id' => $this->bom->id, 'mode' => 'sea', 'shipments' => 10, 'revenue' => 500000],
        ]])->assertOk()->json();
        $row = fn (string $mode) => collect($body['rows'])->first(fn ($r) => $r['agent_id'] === $this->bom->id && $r['mode'] === $mode);

        // Air and sea are what they shipped — a bill not for a shipment is neither.
        $this->assertEquals([600000, 40], [$row('air')['measures']['revenue']['actual'], $row('air')['measures']['revenue']['percent']]);
        $this->assertEquals([200000, 40], [$row('sea')['measures']['revenue']['actual'], $row('sea')['measures']['revenue']['percent']]);

        $total = $row('total');
        $this->assertEquals(400000, $total['general']);
        $this->assertEquals([2000000, 1200000, 60, 3600000], array_values($total['measures']['revenue']));
        $this->assertEquals([50, 15, 30], [$total['measures']['shipments']['target'], $total['measures']['shipments']['actual'],
            $total['measures']['shipments']['percent']]);

        // Chennai billed ₹66,000 not for a shipment and set no target: the figure shows, a percentage does not.
        $chennai = collect($body['rows'])->first(fn ($r) => $r['agent_id'] === $this->maa->id && $r['mode'] === 'total');
        $this->assertEquals([null, 66000, null], [$chennai['measures']['revenue']['target'], $chennai['measures']['revenue']['actual'],
            $chennai['measures']['revenue']['percent']]);

        // A saved target is only ever a mode's — the total is their sum, not a row of its own.
        $this->assertSame(['air', 'sea'], DB::table('sales_targets')->where('agent_id', $this->bom->id)->orderBy('transport_mode')
            ->pluck('transport_mode')->all());

        // The rep's card on the Sales page reads the same 60%.
        $rep = $this->user('sales', $this->bom, '-rep');
        $staff = $this->api($this->boss)->getJson($this->url('/api/sales/staff?grain=month'))->assertOk()->json();
        $this->assertEquals(60, collect($staff['sales'])->firstWhere('id', $rep->id)['target']['revenue_pct']);
        \Illuminate\Support\Carbon::setTestNow();
    }

    /** 🔒 Only the Boss sets targets; a Tactical company has no revenue target; another company's branch is refused. */
    public function test_only_the_boss_sets_targets_for_their_own_branches(): void
    {
        $body = ['month' => now()->format('Y-m'), 'targets' => [['agent_id' => $this->bom->id, 'mode' => 'air', 'shipments' => 10, 'revenue' => 5000]]];

        $this->api($this->user('pricing', $this->bom))->putJson($this->url('/api/sales/targets'), $body)->assertForbidden();

        $other = Company::create(['name' => 'Other Co', 'code' => 'OTH', 'tier' => 'command']);
        $foreign = Agent::create(['company_id' => $other->id, 'agent_name' => 'Delhi', 'branch_code' => 'DEL']);
        $this->api($this->boss)->putJson($this->url('/api/sales/targets'), ['month' => $body['month'], 'targets' => [['agent_id' => $foreign->id, 'mode' => 'air', 'shipments' => 1]]])
            ->assertStatus(422);

        $this->company->update(['tier' => 'tactical']);
        $saved = $this->api($this->boss)->putJson($this->url('/api/sales/targets'), $body)->assertOk()->json();
        $this->assertFalse($saved['with_revenue']);
        $this->assertNull(DB::table('sales_targets')->where('agent_id', $this->bom->id)->value('revenue_inr'));
    }

    /** Overdue receivables roll up per branch — the number a Boss chases. */
    public function test_overdue_receivables_are_totalled_per_branch(): void
    {
        $this->snapshot($this->bom, 'air', ['outstanding_60_plus' => 120000]);
        $this->snapshot($this->bom, 'sea', ['outstanding_60_plus' => 80000]);
        $this->snapshot($this->maa, 'air', ['outstanding_60_plus' => 0]);

        $byCode = collect($this->api($this->boss)
            ->getJson($this->url('/api/sales/branches'))
            ->assertOk()
            ->json('branches'))->keyBy('code');

        $this->assertSame(200000.0, (float) $byCode['BOM']['totals']['overdue_60_plus']);
        $this->assertSame(0.0, (float) $byCode['MAA']['totals']['overdue_60_plus']);
    }

    // ─── The Boss sees everything on the Sales page (user, 2026-09-16) ───────

    /** 🔴 The Boss's Sales page covers every branch, and narrows to one when picked; a rep stays on their own. */
    public function test_the_boss_sales_page_covers_every_branch_and_a_rep_stays_on_theirs(): void
    {
        $this->snapshot($this->bom, 'air', ['tonnage_mtd' => 10]);
        $this->snapshot($this->maa, 'air', ['tonnage_mtd' => 30]);

        $all = $this->api($this->boss)->getJson($this->url('/api/sales/dashboard'))->assertOk()->json();
        $this->assertEquals(40, $all['branch']['tonnage_mtd']);
        $this->assertSame(['Chennai', 'Mumbai'], collect($all['branch_options'])->pluck('name')->all());

        $chennai = $this->api($this->boss)->getJson($this->url("/api/sales/dashboard?branch={$this->maa->id}"))->assertOk()->json();
        $this->assertEquals(30, $chennai['branch']['tonnage_mtd']);

        // A branch from another company is ignored — the Boss is still bound to their own.
        $other = Agent::create(['company_id' => Company::create(['name' => 'X', 'code' => 'XBS', 'tier' => 'command'])->id, 'agent_name' => 'X', 'branch_code' => 'XXX']);
        $this->assertEquals(40, $this->api($this->boss)->getJson($this->url("/api/sales/dashboard?branch={$other->id}"))->json('branch.tonnage_mtd'));

        // A rep asking for the other branch still gets their own.
        $rep = $this->user('sales', $this->bom, '-rep');
        $mine = $this->api($rep)->getJson($this->url("/api/sales/dashboard?branch={$this->maa->id}", 'focusair.f16sefreight.com'))->assertOk()->json();
        $this->assertEquals(10, $mine['branch']['tonnage_mtd']);
        $this->assertArrayNotHasKey('branch_options', $mine);
    }

    /** 🔴 How each person is doing: pricing conversion, shipments handled, a rep's book — the Boss's alone. */
    public function test_the_boss_sees_how_each_person_is_doing(): void
    {
        $pricing = $this->user('pricing', $this->maa, '-p');
        $ops = $this->user('operations', $this->bom, '-o');
        $rep = $this->user('sales', $this->bom, '-s');

        foreach (['converted', 'converted', 'lost', 'new'] as $n => $status) {
            DB::table('enquiries')->insert(['agent_id' => $this->maa->id, 'transport_mode' => 'air', 'status' => $status,
                'pricing_id' => $pricing->id, 'enquiry_no' => 'ENQA-BSS-26-' . (100 + $n), 'created_at' => now(), 'updated_at' => now()]);
        }
        foreach (['Completed', 'Verification', 'Cancelled'] as $n => $status) {
            $enquiryId = DB::table('enquiries')->insertGetId(['agent_id' => $this->bom->id, 'transport_mode' => 'air', 'status' => 'converted',
                'enquiry_no' => 'ENQA-BSS-26-' . (200 + $n), 'created_at' => now(), 'updated_at' => now()]);
            DB::table('jobs')->insert(['agent_id' => $this->bom->id, 'enquiry_id' => $enquiryId, 'transport_mode' => 'air', 'status' => $status,
                'ops_id' => $ops->id, 'execution_job_no' => 'JOBA-BSS-26-' . (100 + $n), 'created_at' => now(), 'updated_at' => now()]);
        }
        Customer::create(['company_id' => $this->company->id, 'name' => 'Globex', 'email_domain' => 'globex.test', 'sales_id' => $rep->id]);

        $staff = $this->api($this->boss)->getJson($this->url('/api/sales/staff?grain=month'))->assertOk()->json();

        $p = collect($staff['pricing'])->firstWhere('id', $pricing->id);
        $this->assertSame([4, 2, 1, 1, 50], [$p['raised'], $p['converted'], $p['lost'], $p['open'], (int) $p['conversion_pct']]);
        $o = collect($staff['operations'])->firstWhere('id', $ops->id);
        $this->assertSame([3, 1, 1], [$o['assigned'], $o['completed'], $o['in_progress']]);
        $this->assertSame(1, collect($staff['sales'])->firstWhere('id', $rep->id)['clients']);

        // Narrowed to Mumbai, the Chennai pricing member is out of view.
        $mumbai = $this->api($this->boss)->getJson($this->url("/api/sales/staff?grain=month&branch={$this->bom->id}"))->json();
        $this->assertSame([], $mumbai['pricing']);

        $this->api($rep)->getJson($this->url('/api/sales/staff', 'focusair.f16sefreight.com'))->assertForbidden();
    }
}
