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
     * ❓ PRD §2.3 gives the Boss a "target assigner (revenue or tonnage)" and no
     * targets table exists. Reported as UNAVAILABLE rather than faked with a
     * hard-coded goal — a dashboard showing progress against an invented target is
     * worse than one that admits it has none.
     */
    public function test_targets_are_reported_unavailable_not_invented(): void
    {
        $this->snapshot($this->bom, 'air');

        $this->api($this->boss)
            ->getJson($this->url('/api/sales/branches'))
            ->assertOk()
            ->assertJsonPath('targets.available', false)
            ->assertJsonPath('targets.reason', 'no_targets_table');
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
}
