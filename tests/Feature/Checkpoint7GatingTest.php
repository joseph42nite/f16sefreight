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
 * ✅ CHECKPOINT 7 — guide Step 7.
 *
 * *"Verify tier + mode gating end-to-end: a Tactical sales user sees branch aggregates
 * with no client names and no money; a Command sales user sees only
 * `customers.sales_id = me`; an air sales user sees ZERO sea rows in every engine
 * table, and vice versa."*
 *
 * Encoded as tests rather than eyeballed, because two of the three are invisible when
 * they fail: a leaked client name looks like data, and a blended mode looks like a
 * bigger number.
 */
class Checkpoint7GatingTest extends TestCase
{
    use DatabaseTransactions;

    private Company $command;
    private Company $tactical;
    private Agent $cmdBranch;
    private Agent $tacBranch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->command = Company::create(['name' => 'Cmd Co', 'code' => 'CP7', 'tier' => 'command']);
        $this->cmdBranch = Agent::create(['company_id' => $this->command->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->tactical = Company::create(['name' => 'Tac Co', 'code' => 'TP7', 'tier' => 'tactical']);
        $this->tacBranch = Agent::create(['company_id' => $this->tactical->id, 'agent_name' => 'MAA', 'branch_code' => 'MAA']);
    }

    private function user(string $designation, Agent $branch, Company $company, string $suffix = ''): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}{$suffix}-cp7@test.local",
            'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => $designation, 'is_active' => 1,
        ]);
    }

    private function customer(Company $company, string $name, ?int $salesId = null): Customer
    {
        return Customer::create([
            'company_id' => $company->id, 'name' => $name,
            'email_domain' => strtolower($name) . '.test', 'sales_id' => $salesId,
        ]);
    }

    private function snapshot(Agent $branch, Customer $c, string $mode, array $attrs = []): void
    {
        DB::table('customer_performance_snapshots')->insert(array_merge([
            'agent_id' => $branch->id, 'customer_id' => $c->id,
            'transport_mode' => $mode, 'snapshot_date' => now()->toDateString(),
            'tonnage_mtd' => 10, 'tonnage_ytd' => 100, 'shipment_count_mtd' => 2,
            'enquiry_count_mtd' => 5, 'revenue_mtd' => 500000, 'revenue_ytd' => 900000,
            'last_computed_at' => now(), 'created_at' => now(), 'updated_at' => now(),
        ], $attrs));
    }

    private function laneStat(Agent $branch, Customer $c, string $mode): void
    {
        DB::table('customer_lane_stats')->insert([
            'agent_id' => $branch->id, 'customer_id' => $c->id, 'transport_mode' => $mode,
            'origin_code' => $mode === 'air' ? 'INBOM' : 'INNSA',
            'dest_code' => $mode === 'air' ? 'DEFRA' : 'DEHAM',
            'period_month' => now()->startOfMonth()->toDateString(),
            'tonnage' => 50, 'shipment_count' => 2, 'enquiry_count' => 3,
            'created_at' => now(), 'updated_at' => now(),
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

    private function url(string $path, string $host): string
    {
        return "http://{$host}{$path}";
    }

    // ─── 1. Tactical: branch aggregates, no client names, NO MONEY ───────────

    /**
     * 🔴 THE CLAUSE THAT IS EASY TO MISS: **no money**. PRD §7.4's Tactical list is
     * tonnage, shipment counts, conversion, loss mix, lanes and staff load — revenue
     * appears nowhere in it, and the note beneath says the rep cannot see "any client's
     * revenue or tonnage, or who owes money". Money is the upsell.
     */
    public function test_a_tactical_sales_user_sees_no_money_at_all(): void
    {
        $rep = $this->user('sales', $this->tacBranch, $this->tactical);
        $this->snapshot($this->tacBranch, $this->customer($this->tactical, 'Globex', $rep->id), 'air');

        $body = $this->api($rep)
            ->getJson($this->url('/api/sales/dashboard', 'focusair.f16sefreight.com'))
            ->assertOk()
            ->getContent();

        foreach (['revenue', 'outstanding', 'credit', 'dso'] as $money) {
            $this->assertStringNotContainsString($money, $body, "'{$money}' must not reach a Tactical sales response.");
        }
    }

    /** ...but the volume figures it IS entitled to still arrive. */
    public function test_a_tactical_sales_user_still_sees_branch_volume(): void
    {
        $rep = $this->user('sales', $this->tacBranch, $this->tactical);
        $this->snapshot($this->tacBranch, $this->customer($this->tactical, 'Globex', $rep->id), 'air');

        $body = $this->api($rep)
            ->getJson($this->url('/api/sales/dashboard', 'focusair.f16sefreight.com'))
            ->assertOk()
            ->json();

        $this->assertSame('branch', $body['scope']);
        $this->assertSame(100.0, (float) $body['branch']['tonnage_ytd']);
        $this->assertSame(2, (int) $body['branch']['shipment_count_mtd']);
    }

    /** No client names, and no book at all — the gap IS the upsell. */
    public function test_a_tactical_sales_user_sees_no_client_names(): void
    {
        $rep = $this->user('sales', $this->tacBranch, $this->tactical);
        $this->snapshot($this->tacBranch, $this->customer($this->tactical, 'Globex', $rep->id), 'air');

        $body = $this->api($rep)
            ->getJson($this->url('/api/sales/dashboard', 'focusair.f16sefreight.com'))
            ->assertOk()
            ->getContent();

        $this->assertStringNotContainsString('Globex', $body);
        $this->assertStringNotContainsString('"book"', $body);
    }

    // ─── 2. Command: only customers.sales_id = me ────────────────────────────

    public function test_a_command_sales_user_sees_only_their_own_clients(): void
    {
        $mine = $this->user('sales', $this->cmdBranch, $this->command, '-a');
        $theirs = $this->user('sales', $this->cmdBranch, $this->command, '-b');

        $this->snapshot($this->cmdBranch, $this->customer($this->command, 'Mine', $mine->id), 'air');
        $this->snapshot($this->cmdBranch, $this->customer($this->command, 'Theirs', $theirs->id), 'air');

        $book = $this->api($mine)
            ->getJson($this->url('/api/sales/dashboard', 'focusair.f16sefreight.com'))
            ->assertOk()
            ->json('book');

        $this->assertCount(1, $book);
        $this->assertSame('Mine', $book[0]['name']);
    }

    // ─── 3. ZERO cross-mode rows in EVERY engine table ───────────────────────

    /**
     * 🔴 THE STRONGEST CLAUSE: *"an air sales user sees ZERO sea rows in every engine
     * table, and vice versa."* A blended mode does not look like a bug — it looks like
     * a bigger number, which is why this is asserted per table rather than spot-checked
     * on one screen.
     */
    public function test_an_air_user_sees_zero_sea_rows_and_vice_versa(): void
    {
        $rep = $this->user('sales', $this->cmdBranch, $this->command);
        $customer = $this->customer($this->command, 'Globex', $rep->id);

        foreach (['air', 'sea'] as $mode) {
            $this->snapshot($this->cmdBranch, $customer, $mode, [
                'tonnage_ytd' => $mode === 'air' ? 111 : 999,
            ]);
            $this->laneStat($this->cmdBranch, $customer, $mode);
        }

        foreach ([['focusair.f16sefreight.com', 'air', 'sea'], ['focussea.f16sefreight.com', 'sea', 'air']] as [$host, $own, $other]) {
            // customer_performance_snapshots, via the book
            $book = $this->api($rep)->getJson($this->url('/api/sales/dashboard', $host))->assertOk()->json('book');
            $this->assertCount(1, $book, "{$host}: exactly one snapshot row");
            $this->assertSame($own, $book[0]['transport_mode'], "{$host}: and it is the portal's own mode");

            // customer_lane_stats, via the charts
            $charts = $this->api($rep)->getJson($this->url('/api/sales/charts?grain=month', $host))->assertOk()->json();
            $this->assertCount(1, $charts['lanes'], "{$host}: exactly one lane row");
            $expectedLane = $own === 'air' ? 'INBOM → DEFRA' : 'INNSA → DEHAM';
            $this->assertSame($expectedLane, $charts['lanes'][0]['lane'], "{$host}: no {$other} lane");
        }
    }

    /**
     * ⚠️ And the ACTIONS queue too — a churn action raised on a sea relationship must
     * not surface in an air rep's worklist, or they will act on a rhythm they cannot
     * influence.
     */
    public function test_the_action_queue_is_mode_scoped(): void
    {
        $rep = $this->user('sales', $this->cmdBranch, $this->command);
        $customer = $this->customer($this->command, 'Globex', $rep->id);

        foreach (['air', 'sea'] as $mode) {
            DB::table('sales_action_queue')->insert([
                'agent_id' => $this->cmdBranch->id, 'customer_id' => $customer->id,
                'sales_id' => $rep->id, 'transport_mode' => $mode, 'audience' => 'internal',
                'action_type' => 'churn_outreach', 'priority_score' => 90,
                'fact_packet' => json_encode(['mode' => $mode]),
                'status' => 'open', 'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        $actions = $this->api($rep)
            ->getJson($this->url('/api/sales/actions', 'focusair.f16sefreight.com'))
            ->assertOk()
            ->json('actions');

        $this->assertCount(1, $actions);
        $this->assertSame('air', $actions[0]['transport_mode']);
    }

    /** The funnel views are mode-partitioned at the source, so the API must be too. */
    public function test_the_funnel_is_mode_scoped(): void
    {
        $rep = $this->user('sales', $this->cmdBranch, $this->command);

        foreach ([['air', 'ENQA'], ['sea', 'ENQS']] as [$mode, $prefix]) {
            \App\Enquiry::create([
                'agent_id' => $this->cmdBranch->id, 'transport_mode' => $mode, 'status' => 'converted',
                'enquiry_no' => "{$prefix}-CP7BOM-26-" . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
            ]);
        }

        $periods = $this->api($rep)
            ->getJson($this->url('/api/analytics/funnel?grain=day', 'focusair.f16sefreight.com'))
            ->assertOk()
            ->json('periods');

        $this->assertCount(1, $periods);
        $this->assertSame('air', $periods[0]['transport_mode']);
    }
}
