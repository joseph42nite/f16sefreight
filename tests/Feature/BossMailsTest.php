<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Customer;
use App\Services\Sales\BossMails;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The Boss's mails to his team (user, 2026-09-16), each formula checked against figures worked out by hand.
 * The date is 22 September 2026 unless a test says otherwise; "months" are complete months before it.
 */
class BossMailsTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private Customer $client;
    private User $boss;
    private User $rep;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.openrouter.key' => null]); // the plain template: no model in tests
        $this->company = Company::create(['name' => 'Mail Co', 'code' => 'BML', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'Mumbai', 'branch_code' => 'BOM']);
        $this->boss = $this->user('boss');
        $this->rep = $this->user('sales');
        $this->user('pricing');
        $this->client = Customer::create(['company_id' => $this->company->id, 'name' => 'Northwind', 'email_domain' => 'northwind.test', 'sales_id' => $this->rep->id]);
    }

    private function user(string $designation): User
    {
        return User::create(['name' => ucfirst($designation), 'email' => "{$designation}-bml@test.local", 'password' => Hash::make('x'),
            'company_name' => $this->company->id, 'branch_name' => $this->branch->id, 'designation' => $designation, 'is_active' => 1]);
    }

    /** $kg a month for months $from..$to before September 2026 (1 = August). */
    private function months(int $from, int $to, float $kg, int $shipments = 4): void
    {
        for ($i = $from; $i <= $to; $i++) {
            DB::table('customer_lane_stats')->insert(['agent_id' => $this->branch->id, 'customer_id' => $this->client->id, 'transport_mode' => 'air',
                'origin_code' => 'BOM', 'dest_code' => 'FRA', 'period_month' => Carbon::parse('2026-09-01')->subMonths($i)->toDateString(),
                'shipment_count' => $shipments, 'tonnage' => $kg, 'revenue' => $kg * 100, 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    private function findings(string $date = '2026-09-22'): array
    {
        return collect(app(BossMails::class)->findings($this->company->id, true, Carbon::parse($date)))->keyBy('kind')->all();
    }

    /**
     * Volume drop: months 4–12 at 1,000 kg, months 1–3 at 200 kg → (200 − 1,000) ÷ 1,000 = −80%.
     * Top clients gone quiet: months 4–15 = 12 × 1,000 = 12,000 kg, a usual quarter of 3,000; the last 3 months,
     * 600 kg, are under a quarter of that (750).
     */
    public function test_a_drop_and_a_top_client_gone_quiet(): void
    {
        $this->months(4, 15, 1000);
        $this->months(1, 3, 200);

        $f = $this->findings();

        $this->assertSame([-80, 1000, 200], [$f['volume_drop']['facts']['change_percent'],
            $f['volume_drop']['facts']['monthly_tonnage_kg_before'], $f['volume_drop']['facts']['monthly_tonnage_kg_last_3_months']]);
        $this->assertSame(['client' => 'Northwind', 'monthly_kg_before' => 1000, 'monthly_kg_last_3_months' => 200], $f['volume_drop']['facts']['clients_falling_most'][0]);
        $this->assertSame(['client' => 'Northwind', 'usual_quarter_kg' => 3000, 'last_3_months_kg' => 600], $f['top_clients_quiet']['facts']['clients'][0]);
        $this->assertSame([$this->rep->id], $f['top_clients_quiet']['to'], 'the client\'s own rep is asked');
    }

    /**
     * Next month's targets, from the 20th: last 3 months 1,200 kg and 6 shipments a month; the 9 before 1,000 kg →
     * trend +20%, held to +15% → 1,380 kg (to the nearest 10) and 7 shipments (6.9). Revenue 120,000 → 138,000.
     * Before the 20th there is no targets mail.
     */
    public function test_next_months_targets_follow_the_last_3_months_and_a_held_trend(): void
    {
        $this->months(4, 12, 1000, 5);
        $this->months(1, 3, 1200, 6);

        $air = $this->findings()['next_month_targets']['facts']['modes']['air'];

        $this->assertSame([15, 1380, 7, 138000], [$air['trend_percent'], $air['proposed_tonnage_kg'], $air['proposed_shipments'], $air['proposed_revenue_inr']]);
        $this->assertSame('October 2026', $this->findings()['next_month_targets']['facts']['month']);
        $this->assertArrayNotHasKey('next_month_targets', $this->findings('2026-09-12'));
    }

    /**
     * Behind target on the 10th: 30 shipments targeted, 6 so far → 6 × 30 days ÷ 10 = 18 at month end = 60% pace,
     * under 85%. Losing on price: 6 of 8 closed enquiries on BOM → FRA lost on the rate in 90 days = 75%.
     */
    public function test_behind_target_and_losing_on_price(): void
    {
        DB::table('sales_targets')->insert(['company_id' => $this->company->id, 'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'period_month' => '2026-09-01', 'shipments' => 30, 'created_at' => now(), 'updated_at' => now()]);
        DB::table('customer_performance_snapshots')->insert(['agent_id' => $this->branch->id, 'customer_id' => $this->client->id, 'transport_mode' => 'air',
            'snapshot_date' => '2026-09-10', 'shipment_count_mtd' => 6, 'tonnage_mtd' => 100, 'last_computed_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        foreach (array_merge(array_fill(0, 6, 'lost'), ['converted', 'converted']) as $n => $status) {
            DB::table('enquiries')->insert(['agent_id' => $this->branch->id, 'transport_mode' => 'air', 'status' => $status,
                'lost_reason' => $status === 'lost' ? 'rates_high' : null, 'origin_code' => 'BOM', 'dest_code' => 'FRA',
                'enquiry_no' => 'ENQA-BML-26-' . (100 + $n), 'created_at' => '2026-09-01', 'updated_at' => '2026-09-01']);
        }

        $f = $this->findings('2026-09-10');

        $this->assertSame(['mode' => 'air', 'measure' => 'shipments', 'target' => 30, 'so_far' => 6, 'month_end_pace_percent' => 60], $f['behind_target']['facts']['behind'][0]);
        // One mode targeted and nothing else done: the branch total would repeat that line word for word, so it is left out.
        $this->assertCount(1, $f['behind_target']['facts']['behind']);
        $this->assertSame(['lane' => 'BOM → FRA', 'lost_on_price' => 6, 'closed' => 8, 'share_percent' => 75], $f['losing_on_price']['facts']['lanes'][0]);
    }

    /**
     * 🔴 The branch's total is checked too (user, 2026-09-26), revenue with general billing, which has no mode.
     * On the 10th, pace = so far × 30 ÷ 10:
     *
     *   air revenue    ₹4,00,000 of ₹15,00,000 → ₹12,00,000 = 80%       behind
     *   sea revenue    ₹1,00,000 of  ₹5,00,000 →  ₹3,00,000 = 60%       behind
     *   all modes      ₹5,00,000 of ₹20,00,000 → ₹15,00,000 = 75%       behind
     *   + general      ₹1,00,000 (a draft of ₹5,00,000 does not count) → ₹6,00,000 → ₹18,00,000 = 90%   on pace
     *
     * Shipments: only air has a target (30); air 6, sea 3 → the branch 9 → 27 = 90%, on pace, while air alone is 60%.
     */
    public function test_behind_target_checks_the_branch_total_with_general_billing(): void
    {
        foreach (['air' => [1500000, 30], 'sea' => [500000, null]] as $mode => [$revenue, $shipments]) {
            DB::table('sales_targets')->insert(['company_id' => $this->company->id, 'agent_id' => $this->branch->id, 'transport_mode' => $mode,
                'period_month' => '2026-09-01', 'revenue_inr' => $revenue, 'shipments' => $shipments, 'created_at' => now(), 'updated_at' => now()]);
        }
        foreach (['air' => [400000, 6], 'sea' => [100000, 3]] as $mode => [$revenue, $shipments]) {
            DB::table('customer_performance_snapshots')->insert(['agent_id' => $this->branch->id, 'customer_id' => $this->client->id,
                'transport_mode' => $mode, 'snapshot_date' => '2026-09-10', 'revenue_mtd' => $revenue, 'shipment_count_mtd' => $shipments,
                'tonnage_mtd' => 100, 'last_computed_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        }
        $behind = fn () => collect($this->findings('2026-09-10')['behind_target']['facts']['behind'])
            ->mapWithKeys(fn ($b) => ["{$b['mode']} {$b['measure']}" => $b['month_end_pace_percent']])->all();

        $this->assertSame(['air shipments' => 60, 'air revenue' => 80, 'sea revenue' => 60, 'all modes revenue' => 75], $behind());

        $bill = fn (float $net, string $status) => DB::table('accounts_invoices')->insert(['agent_id' => $this->branch->id, 'job_id' => null,
            'customer_id' => $this->client->id, 'billed_party_type' => 'customer', 'billed_party_id' => $this->client->id,
            'invoice_no' => 'G-BML-' . random_int(1, 99999), 'type' => 'invoice', 'document_date' => '2026-09-05', 'status' => $status,
            'currency' => 'INR', 'exchange_rate' => 1, 'subtotal' => $net, 'tax_amount' => $net * 0.18, 'grand_total' => $net * 1.18,
            'created_at' => now(), 'updated_at' => now()]);
        $bill(100000, 'finalized');
        $bill(500000, 'draft');

        // General billing carries the branch to 90%; air and sea are still behind on their own.
        $this->assertSame(['air shipments' => 60, 'air revenue' => 80, 'sea revenue' => 60], $behind());

        // Short of 85% with it, the line says how much of "so far" was billed not for a shipment.
        DB::table('sales_targets')->where('transport_mode', 'sea')->where('agent_id', $this->branch->id)->update(['revenue_inr' => 1000000]);
        $total = collect($this->findings('2026-09-10')['behind_target']['facts']['behind'])->firstWhere('mode', 'all modes');
        $this->assertSame(['mode' => 'all modes', 'measure' => 'revenue', 'target' => 2500000, 'so_far' => 600000,
            'month_end_pace_percent' => 72, 'of_which_general_billing' => 100000], $total);
    }

    /** 🔴 A dismissed suggestion rests 30 days; the Boss drafts, and cannot send without his own mailbox. Only the Boss. */
    public function test_the_boss_drafts_dismisses_and_the_rest_rule_holds(): void
    {
        $this->months(4, 15, 1000);
        $this->months(1, 3, 200);
        Carbon::setTestNow('2026-09-22 09:00');
        app(BossMails::class)->refresh($this->company->id, Carbon::parse('2026-09-22'));

        $api = fn (User $u) => $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
        $mails = collect($api($this->boss)->getJson('http://admin.localhost/api/boss/mails')->assertOk()->json('mails'))->keyBy('kind');
        $drop = $mails['volume_drop'];

        $draft = $api($this->boss)->postJson("http://admin.localhost/api/boss/mails/{$drop['id']}/draft")->assertOk()->json();
        $this->assertSame('template', $draft['written_by']);
        $this->assertStringContainsString('200 kg a month', $draft['body']);
        $this->assertContains($this->rep->email, $draft['to']);

        $api($this->boss)->postJson("http://admin.localhost/api/boss/mails/{$drop['id']}/send", ['to' => $draft['to'], 'subject' => 'x', 'body' => 'y'])
            ->assertStatus(422)->assertJsonPath('reason', 'no_mailbox');

        $quiet = $mails['top_clients_quiet'];
        $api($this->boss)->postJson("http://admin.localhost/api/boss/mails/{$quiet['id']}/dismiss", ['reason' => 'already_discussed'])->assertOk();

        app(BossMails::class)->refresh($this->company->id, Carbon::parse('2026-09-23'));
        $kinds = collect($api($this->boss)->getJson('http://admin.localhost/api/boss/mails')->json('mails'))->pluck('kind')->all();
        $this->assertNotContains('top_clients_quiet', $kinds, 'dismissed: resting');
        $this->assertContains('volume_drop', $kinds, 'drafted: kept');

        $api($this->rep)->getJson('http://focusair.localhost/api/boss/mails')->assertForbidden();
        Carbon::setTestNow();
    }
}
