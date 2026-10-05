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
 * The quarterly staff review (owner, 2026-10-05; GAPS #457): once a quarter closes, per client — the Boss's draft to the
 * client's salesperson, and the salesperson's to the ops and pricing staff who worked it. Clean subject, every job and
 * person in the body, a link to the review page, staff-only recipients, Command only, never sent without a click.
 */
class StaffReviewsTest extends TestCase
{
    use DatabaseTransactions;

    /** Two days into Q3: Q2 (Jul–Sep) has closed. */
    private const DATE = '2026-10-02';

    private Company $company;
    private Agent $branch;
    private User $boss;
    private User $sales;
    private User $ops1;
    private User $ops2;
    private User $pricing;
    private Customer $client;

    protected function setUp(): void
    {
        parent::setUp();
        config(['f16s.portal_domain' => 'localhost:8099', 'f16s.portal_scheme' => 'http']);

        $this->company = Company::create(['name' => 'Review Co', 'code' => 'REVQ', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->boss = $this->user('boss', 'Bina Boss');
        $this->sales = $this->user('sales', 'Sam Sales');
        $this->ops1 = $this->user('operations', 'Olu Ops');
        $this->ops2 = $this->user('operations', 'Oma Ops');
        $this->pricing = $this->user('pricing', 'Priya Pricing');
        $this->client = Customer::create(['company_id' => $this->company->id, 'branch_id' => $this->branch->id, 'name' => 'Northwind',
            'email_domain' => 'northwind-rev.test', 'sales_id' => $this->sales->id]);
    }

    private function user(string $designation, string $name, ?Company $company = null): User
    {
        $company ??= $this->company;
        $branch = $company->is($this->company) ? $this->branch : Agent::where('company_id', $company->id)->first();

        return User::create(['name' => $name, 'email' => strtolower(str_replace(' ', '.', $name)) . '-' . $company->code . '@rev.test',
            'password' => Hash::make('x'), 'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => $designation, 'is_active' => 1]);
    }

    private function enquiry(string $on, string $status, array $extra = []): int
    {
        return DB::table('enquiries')->insertGetId(array_merge(['agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'customer_id' => $this->client->id, 'enquiry_no' => 'ENQA-REV-26-' . random_int(100000, 999999), 'status' => $status,
            'pricing_id' => $this->pricing->id, 'created_at' => $on, 'updated_at' => $on], $extra));
    }

    private function job(string $on, string $no, array $extra = []): int
    {
        return DB::table('jobs')->insertGetId(array_merge(['agent_id' => $this->branch->id, 'enquiry_id' => $this->enquiry($on, 'converted'),
            'transport_mode' => 'air', 'customer_id' => $this->client->id, 'execution_job_no' => $no, 'status' => 'Completed',
            'ops_id' => $this->ops1->id, 'pricing_id' => $this->pricing->id, 'created_at' => $on, 'updated_at' => $on], $extra));
    }

    /** Q2: three jobs (one cancelled, one rejected by the airline), one enquiry lost on price. Q1: one job. */
    private function quarter(): void
    {
        $this->job('2026-05-10', 'JOBA-REV-001');
        $this->job('2026-07-10', 'JOBA-REV-101', ['awb_number' => '176-55500001']);
        $this->job('2026-08-10', 'JOBA-REV-102', ['awb_number' => '176-55500002', 'ops_id' => $this->ops2->id]);
        $this->job('2026-09-01', 'JOBA-REV-103', ['status' => 'Cancelled', 'cancellation_reason' => 'cargo_not_ready']);
        $this->enquiry('2026-08-20', 'lost', ['lost_reason' => 'rates_high', 'enquiry_no' => 'ENQA-REV-26-LOST1']);
        DB::table('status_response')->insert(['business_id' => '176-55500002', 'business_name' => 'Air Waybill',
            'business_status_code' => 'Rejected', 'reason' => 'Shipper address missing', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function api(User $u)
    {
        return $this->withHeaders(['Authorization' => 'Bearer ' . auth()->guard('user-api')->login($u), 'Accept' => 'application/json']);
    }

    private function roll(string $date = self::DATE): void
    {
        $this->artisan('sales:compute-snapshots', ['--date' => $date])->assertSuccessful();
    }

    private function reviews()
    {
        return DB::table('boss_mail_suggestions')->where('company_id', $this->company->id)->where('kind', 'quarterly_review')->get();
    }

    public function test_a_closed_quarter_gets_the_boss_and_the_sales_review_once(): void
    {
        $this->quarter();
        $this->roll();
        $this->roll();   // a second night adds nothing, and the nightly Boss-mail sweep leaves them alone

        $reviews = $this->reviews()->keyBy(fn ($r) => $r->owner_user_id === null ? 'boss' : 'sales');
        $this->assertCount(2, $reviews);

        // The Boss's goes to the salesperson only; the salesperson's to everyone who worked the jobs.
        $this->assertSame([$this->sales->id], json_decode($reviews['boss']->suggested_to, true));
        $this->assertSame($this->sales->id, (int) $reviews['sales']->owner_user_id);
        $this->assertEqualsCanonicalizing([$this->ops1->id, $this->ops2->id, $this->pricing->id], json_decode($reviews['sales']->suggested_to, true));

        // MySQL's JSON column keeps its own key order: compared by content.
        $f = json_decode($reviews['boss']->facts, true);
        $this->assertSame('Q2 FY 2026-27', $f['quarter']);
        $this->assertSame('Q1 FY 2026-27', $f['previous_quarter']);
        $this->assertEquals(['total' => 4, 'converted' => 3, 'lost' => 1], $f['enquiries']);
        $this->assertEquals([['enquiry' => 'ENQA-REV-26-LOST1', 'reason' => 'Rates too high', 'pricing' => 'Priya Pricing']], $f['lost']);
        $this->assertSame('Cargo not ready / no-show', $f['cancelled'][0]['reason']);
        $this->assertEquals(['job' => 'JOBA-REV-102', 'awb' => '176-55500002', 'status' => 'Completed', 'ops' => 'Oma Ops',
            'pricing' => 'Priya Pricing', 'reason' => 'Shipper address missing'], $f['rejected_by_airline'][0]);
        $this->assertSame(2, $f['shipments']);
        $this->assertSame(1, $f['previous_shipments']);

        // The closed quarter's scorecard is kept as the record.
        $this->assertTrue(DB::table('customer_ops_quarters')->where('customer_id', $this->client->id)->where('quarter_start', '2026-07-01')->exists());
    }

    public function test_tactical_and_clients_without_a_salesperson_get_none(): void
    {
        $this->quarter();
        $this->company->update(['tier' => 'tactical']);
        $this->roll();
        $this->assertCount(0, $this->reviews());

        $this->company->update(['tier' => 'command']);
        $this->client->update(['sales_id' => null]);
        $this->roll();
        $this->assertCount(0, $this->reviews());
    }

    /** The draft: the clean header, every job and person, the link — and the Boss's list never shows the sales one. */
    public function test_the_draft_names_the_chain_and_links_to_the_review(): void
    {
        $this->quarter();
        $this->roll();

        $mails = collect($this->api($this->boss)->getJson('http://admin.localhost/api/boss/mails')->assertOk()->json('mails'));
        $this->assertCount(1, $mails->where('kind', 'quarterly_review'));
        $id = $mails->firstWhere('kind', 'quarterly_review')['id'];

        $draft = $this->api($this->boss)->postJson("http://admin.localhost/api/boss/mails/{$id}/draft")->assertOk()->json();

        $this->assertSame('Quarterly review · Northwind · Air · Q2 FY 2026-27', $draft['subject']);
        $this->assertSame([$this->sales->email], $draft['to']);
        foreach (['Hi Sam Sales,', 'JOBA-REV-101', '176-55500001', 'JOBA-REV-103 — Cargo not ready / no-show — ops: Olu Ops, pricing: Priya Pricing',
                  'JOBA-REV-102 (AWB 176-55500002) — Shipper address missing — ops: Oma Ops', 'ENQA-REV-26-LOST1 — Rates too high (pricing: Priya Pricing)',
                  'ops Olu Ops, Oma Ops', "http://focusair.localhost:8099/review/{$id}", 'See the details'] as $line) {
            $this->assertStringContainsString(e($line), $draft['body'], $line);
        }
    }

    /** The salesperson sees their own review only; a Tactical or another salesperson does not; the Boss never sees it. */
    public function test_the_sales_review_is_the_salespersons_own(): void
    {
        $this->quarter();
        $this->roll();

        $mine = $this->api($this->sales)->getJson('http://focusair.localhost/api/sales/team-mails')->assertOk()->json('mails');
        $this->assertCount(1, $mine);
        $draft = $this->api($this->sales)->postJson("http://focusair.localhost/api/sales/team-mails/{$mine[0]['id']}/draft")->assertOk()->json();
        $this->assertStringContainsString('Hi team,', $draft['body']);

        $other = $this->user('sales', 'Sid Other');
        $this->assertCount(0, $this->api($other)->getJson('http://focusair.localhost/api/sales/team-mails')->assertOk()->json('mails'));
        $this->api($other)->postJson("http://focusair.localhost/api/sales/team-mails/{$mine[0]['id']}/draft")->assertNotFound();
        $this->api($this->ops1)->getJson('http://focusair.localhost/api/sales/team-mails')->assertForbidden();

        $this->company->update(['tier' => 'tactical']);
        $this->api($this->sales)->getJson('http://focusair.localhost/api/sales/team-mails')->assertForbidden();
    }

    /** FocusAir lists the air reviews and FocusSea the sea ones — air and sea are never blended. */
    public function test_each_portal_lists_its_own_modes_reviews(): void
    {
        $this->quarter();
        $sea = DB::table('enquiries')->insertGetId(['agent_id' => $this->branch->id, 'transport_mode' => 'sea',
            'customer_id' => $this->client->id, 'enquiry_no' => 'ENQS-REV-26-000001', 'status' => 'converted',
            'pricing_id' => $this->pricing->id, 'created_at' => '2026-08-15', 'updated_at' => '2026-08-15']);
        DB::table('jobs')->insert(['agent_id' => $this->branch->id, 'enquiry_id' => $sea, 'transport_mode' => 'sea',
            'customer_id' => $this->client->id, 'execution_job_no' => 'JOBS-REV-201', 'status' => 'Completed',
            'ops_id' => $this->ops1->id, 'pricing_id' => $this->pricing->id, 'created_at' => '2026-08-15', 'updated_at' => '2026-08-15']);
        $this->roll();

        $air = $this->api($this->sales)->getJson('http://focusair.localhost/api/sales/team-mails')->assertOk()->json('mails');
        $seaMails = $this->api($this->sales)->getJson('http://focussea.localhost/api/sales/team-mails')->assertOk()->json('mails');
        $this->assertSame(['air'], array_column(array_column($air, 'facts'), 'mode'));
        $this->assertSame(['sea'], array_column(array_column($seaMails, 'facts'), 'mode'));
        // The Boss's view is not scoped to one mode: both.
        $this->assertCount(2, collect($this->api($this->boss)->getJson('http://admin.localhost/api/boss/mails')->json('mails'))
            ->where('kind', 'quarterly_review'));
    }

    /** 🔒 Only the company's own staff can receive it — checked before anything is sent. */
    public function test_a_review_goes_only_to_staff(): void
    {
        $this->quarter();
        $this->roll();
        $id = $this->reviews()->firstWhere('owner_user_id', null)->id;

        $this->api($this->boss)->postJson("http://admin.localhost/api/boss/mails/{$id}/send",
            ['to' => [$this->sales->email, 'buyer@northwind-rev.test'], 'subject' => 'x', 'body' => 'y'])
            ->assertStatus(422)->assertJsonPath('reason', 'not_staff');

        // Staff only: it passes the check and stops at the mailbox (no mailbox here, so nothing is sent).
        $this->api($this->boss)->postJson("http://admin.localhost/api/boss/mails/{$id}/send",
            ['to' => [$this->sales->email], 'subject' => 'x', 'body' => 'y'])
            ->assertStatus(422)->assertJsonPath('reason', 'no_mailbox');
    }

    /** "See the details" opens for the people in the chain only. */
    public function test_the_review_page_is_for_the_chain(): void
    {
        $this->quarter();
        $this->roll();
        $salesReview = $this->reviews()->firstWhere('owner_user_id', $this->sales->id)->id;

        $this->api($this->ops2)->getJson("http://focusair.localhost/api/staff-reviews/{$salesReview}")->assertOk()
            ->assertJsonPath('facts.client', 'Northwind');
        $this->api($this->sales)->getJson("http://focusair.localhost/api/staff-reviews/{$salesReview}")->assertOk();
        $this->api($this->boss)->getJson("http://admin.localhost/api/staff-reviews/{$salesReview}")->assertOk();

        $outsider = $this->user('operations', 'Ozzy Elsewhere');
        $this->api($outsider)->getJson("http://focusair.localhost/api/staff-reviews/{$salesReview}")->assertForbidden();
    }
}
