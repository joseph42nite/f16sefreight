<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Enquiry;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * §5.5 — funnel reporting and the sales cockpit.
 *
 * The three rules under test are the ones the guide states outright: read the engine
 * tables and never aggregate live, scope by mode, and strip margin from every
 * sales-facing response. The fourth — the Tactical/Command gap — is the product.
 */
class SalesAnalyticsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Sales Co', 'code' => 'SLS', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
    }

    private function user(string $designation, string $suffix = ''): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}{$suffix}-sls@test.local",
            'password' => Hash::make('x'),
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

    private function url(string $path, string $host = 'focusair.f16sefreight.com'): string
    {
        return "http://{$host}{$path}";
    }

    private function customer(?int $salesId = null, string $name = 'Globex'): Customer
    {
        return Customer::create([
            'company_id' => $this->company->id, 'name' => $name,
            'email_domain' => strtolower($name) . '.test', 'sales_id' => $salesId,
        ]);
    }

    private function snapshot(Customer $c, string $mode, array $overrides = []): void
    {
        DB::table('customer_performance_snapshots')->insert(array_merge([
            'agent_id' => $this->branch->id, 'customer_id' => $c->id,
            'transport_mode' => $mode, 'snapshot_date' => now()->toDateString(),
            'tonnage_mtd' => 12.500, 'tonnage_ytd' => 140.000,
            'shipment_count_mtd' => 4, 'enquiry_count_mtd' => 9,
            'revenue_mtd' => 250000.00, 'revenue_ytd' => 2400000.00,
            'last_computed_at' => now(), 'created_at' => now(), 'updated_at' => now(),
        ], $overrides));
    }

    private function enquiry(string $status, string $mode = 'air', ?string $at = null): Enquiry
    {
        $prefix = ['air' => 'ENQA', 'sea' => 'ENQS', 'road' => 'ENQR'][$mode];

        $e = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => $mode, 'status' => $status,
            'enquiry_no' => "{$prefix}-SLSBOM-26-" . str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        if ($at !== null) {
            DB::table('enquiries')->where('id', $e->id)->update(['created_at' => $at]);
        }

        return $e;
    }

    // ─── The funnel ──────────────────────────────────────────────────────────

    /**
     * 🔴 THE DOUBLE-COUNT TRAP, ENFORCED AT THE API. ysr_funnel_view is a UNION ALL
     * over two year bases; querying it without one counts every enquiry twice. The
     * endpoint REFUSES rather than defaulting silently, so the caller states which
     * twelve-month window they mean.
     */
    public function test_a_yearly_funnel_without_a_basis_is_refused(): void
    {
        $this->api($this->user('sales'))
            ->getJson($this->url('/api/analytics/funnel?grain=year'))
            ->assertStatus(422)
            ->assertJsonPath('reason', 'basis_required');
    }

    public function test_a_yearly_funnel_with_a_basis_returns_one_row_per_year(): void
    {
        $this->enquiry('converted', 'air', '2026-03-15 10:00:00');

        $fiscal = $this->api($this->user('sales'))
            ->getJson($this->url('/api/analytics/funnel?grain=year&basis=fiscal'))
            ->assertOk()
            ->json('periods');

        $this->assertCount(1, $fiscal);
        $this->assertSame('2025-04-01', substr((string) $fiscal[0]['period_start'], 0, 10));
        $this->assertSame(1, (int) $fiscal[0]['enquiries_raised']);
    }

    /**
     * 🔴 THE MODE SCOPE COMES FROM THE PORTAL, NOT A PARAMETER. An air rep on
     * focusair. must never see the sea funnel — the two are different businesses and
     * a blended rate describes neither.
     */
    public function test_the_funnel_is_scoped_by_the_portal_not_by_the_caller(): void
    {
        $this->enquiry('converted', 'air');
        $this->enquiry('lost', 'sea');
        $this->enquiry('lost', 'sea');

        $periods = $this->api($this->user('sales'))
            ->getJson($this->url('/api/analytics/funnel?grain=day'))
            ->assertOk()
            ->assertJsonPath('mode', 'air')
            ->json('periods');

        $this->assertCount(1, $periods, 'Only the air row.');
        $this->assertSame(1, (int) $periods[0]['enquiries_raised']);
        $this->assertSame('air', $periods[0]['transport_mode']);
    }

    /**
     * 🔴 NULL, NEVER 0%, ON AN EMPTY DENOMINATOR — carried all the way to the wire.
     * "Nothing came in" and "everything was lost" are opposite facts.
     */
    public function test_a_period_with_no_enquiries_produces_no_row_rather_than_zero(): void
    {
        $periods = $this->api($this->user('sales'))
            ->getJson($this->url('/api/analytics/funnel?grain=day'))
            ->assertOk()
            ->json('periods');

        $this->assertSame([], $periods);
    }

    /** 🔒 Analytics are explicitly closed to operations and pricing. */
    public function test_operations_and_pricing_are_refused_the_funnel(): void
    {
        foreach (['operations', 'pricing'] as $designation) {
            $this->api($this->user($designation))
                ->getJson($this->url('/api/analytics/funnel?grain=day'))
                ->assertForbidden();
        }
    }

    // ─── The cockpit ─────────────────────────────────────────────────────────

    /**
     * 🔴 **THE TIER GAP IS THE PRODUCT.** Tactical reports at branch level with NO
     * client attribution; a rep who could see client names on Tactical has been given
     * the thing Command is sold for.
     */
    public function test_a_tactical_rep_gets_branch_figures_and_no_client_names(): void
    {
        $this->company->update(['tier' => 'tactical']);
        $rep = $this->user('sales');
        $this->snapshot($this->customer($rep->id, 'Globex'), 'air');

        $body = $this->api($rep)
            ->getJson($this->url('/api/sales/dashboard'))
            ->assertOk()
            ->assertJsonPath('scope', 'branch')
            ->assertJsonMissingPath('book')
            ->getContent();

        $this->assertStringNotContainsString('Globex', $body, 'No client name at Tactical.');
    }

    public function test_a_command_rep_gets_the_client_book(): void
    {
        $rep = $this->user('sales');
        $this->snapshot($this->customer($rep->id, 'Globex'), 'air');

        $this->api($rep)
            ->getJson($this->url('/api/sales/dashboard'))
            ->assertOk()
            ->assertJsonPath('scope', 'my_book')
            ->assertJsonPath('book.0.name', 'Globex');
    }

    /**
     * 🔒 A rep sees THEIR OWN book. Another rep's client is another rep's commission,
     * and an attribution mistake at month-end is a dispute, not a bug report.
     */
    public function test_a_rep_never_sees_another_reps_clients(): void
    {
        $mine = $this->user('sales', '-a');
        $theirs = $this->user('sales', '-b');

        $this->snapshot($this->customer($mine->id, 'Mine'), 'air');
        $this->snapshot($this->customer($theirs->id, 'Theirs'), 'air');

        $book = $this->api($mine)
            ->getJson($this->url('/api/sales/dashboard'))
            ->assertOk()
            ->json('book');

        $this->assertCount(1, $book);
        $this->assertSame('Mine', $book[0]['name']);
    }

    /** A boss is not sales-scoped — oversight sees the whole branch. */
    public function test_a_boss_sees_every_client_in_the_branch(): void
    {
        $rep = $this->user('sales');
        $boss = $this->user('boss');

        $this->snapshot($this->customer($rep->id, 'Mine'), 'air');
        $this->snapshot($this->customer($rep->id, 'Theirs'), 'air');

        $book = $this->api($boss)
            ->getJson($this->url('/api/sales/dashboard', 'admin.f16sefreight.com'))
            ->assertOk()
            ->json('book');

        $this->assertCount(2, $book);
    }

    /**
     * 🔴 MARGIN AND BUY-SIDE COST NEVER REACH THE SALES SURFACE, AT ANY TIER.
     * Asserted against the raw response body, because a field omitted from a Vue
     * template still arrives in the JSON.
     */
    public function test_no_margin_or_cost_field_reaches_the_sales_response(): void
    {
        $rep = $this->user('sales');
        $this->snapshot($this->customer($rep->id, 'Globex'), 'air');

        foreach (['/api/sales/dashboard', '/api/sales/accounts'] as $path) {
            $body = $this->api($rep)->getJson($this->url($path))->assertOk()->getContent();

            foreach (['margin', 'buy_rate', 'cost_of_sales', 'net_amount', 'purchase'] as $forbidden) {
                $this->assertStringNotContainsString($forbidden, $body, "{$forbidden} leaked into {$path}");
            }
        }
    }

    /**
     * 🔒 Below Command the client book is a 403, not an empty list. An empty grid
     * reads as "you have no clients" — a different and demoralising claim from "this
     * view needs an upgrade", and it is the frontend's cue to render the teaser.
     */
    public function test_the_accounts_grid_is_a_403_below_command_not_an_empty_list(): void
    {
        $this->company->update(['tier' => 'tactical']);

        $this->api($this->user('sales'))
            ->getJson($this->url('/api/sales/accounts'))
            ->assertForbidden()
            ->assertJsonPath('reason', 'tier')
            ->assertJsonPath('required_tier', 'command');
    }

    /** The cockpit is mode-scoped too — a sea snapshot never lands in an air book. */
    public function test_the_client_book_is_mode_scoped(): void
    {
        $rep = $this->user('sales');
        $customer = $this->customer($rep->id, 'Globex');

        $this->snapshot($customer, 'air', ['tonnage_ytd' => 100.000]);
        $this->snapshot($customer, 'sea', ['tonnage_ytd' => 900.000]);

        $book = $this->api($rep)
            ->getJson($this->url('/api/sales/dashboard'))
            ->assertOk()
            ->json('book');

        $this->assertCount(1, $book);
        $this->assertSame('air', $book[0]['transport_mode']);
        $this->assertSame('100.000', (string) $book[0]['tonnage_ytd']);
    }

    // ─── Staleness ───────────────────────────────────────────────────────────

    /**
     * PRD.md §7 requires the banner. A dashboard that cannot say how fresh it is
     * invites the reader to assume "live", which is the one thing it is not.
     */
    public function test_an_overdue_rollup_is_reported_as_stale(): void
    {
        $rep = $this->user('sales');
        $this->snapshot($this->customer($rep->id), 'air', ['last_computed_at' => now()->subHours(3)]);

        $this->api($rep)
            ->getJson($this->url('/api/sales/dashboard'))
            ->assertOk()
            ->assertJsonPath('staleness.is_stale', true)
            ->assertJsonPath('staleness.reason', 'rollup_overdue');
    }

    /**
     * ⚠️ "Never computed" is NOT "a branch that shipped nothing". Zeroes would read as
     * the second, and a rep would act on figures no rollup ever produced.
     */
    public function test_a_branch_with_no_rollup_reports_null_not_zero(): void
    {
        $this->api($this->user('sales'))
            ->getJson($this->url('/api/sales/dashboard'))
            ->assertOk()
            ->assertJsonPath('staleness.reason', 'never_computed')
            ->assertJsonPath('branch.tonnage_mtd', null)
            ->assertJsonPath('branch.revenue_mtd', null);
    }

    // ─── Today's Actions ─────────────────────────────────────────────────────

    /**
     * 🔴 A NULL narration is a first-class state. Layer 3 is disposable: if the model
     * is down the row keeps every number and merely loses its prose. An action that
     * vanished because narration failed is a lost opportunity nobody knows about.
     */
    public function test_an_un_narrated_action_still_appears_with_its_numbers(): void
    {
        $rep = $this->user('sales');
        $customer = $this->customer($rep->id);

        DB::table('sales_action_queue')->insert([
            'agent_id' => $this->branch->id, 'customer_id' => $customer->id,
            'sales_id' => $rep->id, 'transport_mode' => 'air', 'audience' => 'internal',
            'action_type' => 'churn_outreach', 'priority_score' => 91.5,
            'impact_value' => 480000.00,
            'fact_packet' => json_encode(['gap_days' => 41, 'expected_gap_days' => 18]),
            'narrated_text' => null,   // the model was unavailable
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->api($rep)
            ->getJson($this->url('/api/sales/actions'))
            ->assertOk()
            ->assertJsonPath('actions.0.action_type', 'churn_outreach')
            ->assertJsonPath('actions.0.narrated_text', null)
            ->assertJsonPath('actions.0.facts.gap_days', 41);
    }

    /**
     * ⚠️ INTERNAL findings only. A client-audience row carries a drafted email and
     * belongs to the outreach surface, which has its own consent rules.
     */
    public function test_a_client_audience_row_never_appears_in_todays_actions(): void
    {
        $rep = $this->user('sales');
        $customer = $this->customer($rep->id);

        DB::table('sales_action_queue')->insert([
            'agent_id' => $this->branch->id, 'customer_id' => $customer->id,
            'sales_id' => $rep->id, 'transport_mode' => 'air', 'audience' => 'client',
            'action_type' => 'churn_outreach', 'priority_score' => 99.9,
            'fact_packet' => json_encode(['gap_days' => 41]),
            'draft_subject' => 'Checking in', 'draft_body' => 'Hello,',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $this->api($rep)
            ->getJson($this->url('/api/sales/actions'))
            ->assertOk()
            ->assertJsonPath('actions', []);
    }

    /** Ranked by priority, highest first — it is a worklist, not a log. */
    public function test_actions_are_ranked_by_priority(): void
    {
        $rep = $this->user('sales');
        $customer = $this->customer($rep->id);

        foreach ([['collections_call', 40.0], ['churn_outreach', 95.0], ['cross_sell_lane', 70.0]] as [$type, $score]) {
            DB::table('sales_action_queue')->insert([
                'agent_id' => $this->branch->id, 'customer_id' => $customer->id,
                'sales_id' => $rep->id, 'transport_mode' => 'air', 'audience' => 'internal',
                'action_type' => $type, 'priority_score' => $score,
                'fact_packet' => json_encode([]), 'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        $actions = $this->api($rep)->getJson($this->url('/api/sales/actions'))->assertOk()->json('actions');

        $this->assertSame(
            ['churn_outreach', 'cross_sell_lane', 'collections_call'],
            array_column($actions, 'action_type')
        );
    }

    /**
     * On Tactical only BRANCH-level actions are meaningful: a per-client action would
     * name the client the tier is not entitled to see.
     */
    public function test_tactical_sees_only_branch_level_actions(): void
    {
        $this->company->update(['tier' => 'tactical']);
        $rep = $this->user('sales');
        $customer = $this->customer($rep->id, 'Globex');

        foreach ([[$customer->id, 'churn_outreach'], [null, 'consolidation_pitch']] as [$customerId, $type]) {
            DB::table('sales_action_queue')->insert([
                'agent_id' => $this->branch->id, 'customer_id' => $customerId,
                'transport_mode' => 'air', 'audience' => 'internal',
                'action_type' => $type, 'priority_score' => 80.0,
                'fact_packet' => json_encode([]), 'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        $body = $this->api($rep)->getJson($this->url('/api/sales/actions'))->assertOk();

        $body->assertJsonCount(1, 'actions')
             ->assertJsonPath('actions.0.action_type', 'consolidation_pitch');
    }
}
