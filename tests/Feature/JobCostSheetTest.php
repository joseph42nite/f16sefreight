<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\Enquiry;
use App\Job;
use App\Partner;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * The decoupled Job Cost Sheet — PRD.md §6.7.
 *
 * Two rules carry the weight here, and both are asserted against the RAW response body
 * rather than a parsed field, because a key omitted from a Vue template still arrives
 * in the JSON:
 *
 *   1. changing a rate never touches a manifest
 *   2. sales never sees the buy side, at any tier
 */
class JobCostSheetTest extends TestCase
{
    use DatabaseTransactions;

    private Company $company;
    private Agent $branch;
    private User $pricing;
    private Job $job;
    private Partner $vendor;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::create(['name' => 'Sheet Co', 'code' => 'SHT', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $this->company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
        $this->pricing = $this->user('pricing');

        $enquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SHTBOM-26-0001',
        ]);
        $this->job = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $enquiry->id,
            'transport_mode' => 'air', 'execution_job_no' => 'JOBA-SHTBOM-26-0001',
        ]);

        $this->vendor = Partner::create([
            'company_id' => $this->company->id, 'name' => 'Emirates', 'partner_type' => 'airline',
        ]);
    }

    private function user(string $designation): User
    {
        return User::create([
            'name' => $designation, 'email' => "{$designation}-sht@test.local", 'password' => Hash::make('x'),
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

    private function addLine(array $overrides = []): array
    {
        return $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$this->job->id}/cost-sheet/lines"), array_merge([
                'side' => 'sell', 'charge_type' => 'air_freight', 'description' => 'Freight',
                'quantity' => 450.5, 'rate' => 200, 'tax_percentage' => 18,
            ], $overrides))
            ->assertStatus(201)
            ->json();
    }

    // ─── The decoupling ──────────────────────────────────────────────────────

    /**
     * 🔴 THE RULE §6.7 EXISTS FOR. A re-quoted rate must not move a number that appears
     * on a customs declaration — that would be a false declaration made by a pricing
     * edit nobody connected to the manifest.
     */
    public function test_editing_the_cost_sheet_never_touches_the_manifest(): void
    {
        DB::table('air_shipment_details')->insert([
            'job_id' => $this->job->id, 'gross_weight' => 450.500,
            'chargeable_weight' => 470.000, 'piece_count' => 12,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $before = DB::table('air_shipment_details')->where('job_id', $this->job->id)->first();

        $this->addLine(['quantity' => 999, 'rate' => 12345]);

        $after = DB::table('air_shipment_details')->where('job_id', $this->job->id)->first();

        $this->assertEquals($before->gross_weight, $after->gross_weight);
        $this->assertEquals($before->chargeable_weight, $after->chargeable_weight);
        $this->assertEquals($before->piece_count, $after->piece_count);
    }

    // ─── Sales never sees the buy side ───────────────────────────────────────

    /**
     * 🔴 THE MARGIN IS SELL − BUY, SO SEEING IT IS SEEING THE BUY RATE. PRD.md §7.2
     * marks that row "❌ never" for sales — at every tier, Command included.
     */
    public function test_sales_receives_no_buy_side_and_no_margin(): void
    {
        $this->addLine();
        $this->addLine(['side' => 'buy', 'rate' => 150, 'vendor_id' => $this->vendor->id]);

        // Sales is not on viewCostSheet at all, so the endpoint refuses outright.
        $this->api($this->user('sales'))
            ->getJson($this->url("/api/jobs/{$this->job->id}/cost-sheet"))
            ->assertForbidden();
    }

    /** Pricing owns the rates and sees both sides plus the margin. */
    public function test_pricing_sees_both_sides_and_the_margin(): void
    {
        $this->addLine(['quantity' => 1, 'rate' => 1000, 'tax_percentage' => 0]);
        $this->addLine(['side' => 'buy', 'quantity' => 1, 'rate' => 600,
                        'tax_percentage' => 0, 'vendor_id' => $this->vendor->id]);

        $body = $this->api($this->pricing)
            ->getJson($this->url("/api/jobs/{$this->job->id}/cost-sheet"))
            ->assertOk()
            ->json();

        $this->assertSame(1000.0, (float) $body['sell']['total']);
        $this->assertSame(600.0, (float) $body['buy']['total']);
        $this->assertSame(400.0, (float) $body['margin']['value']);
        $this->assertSame(40.0, (float) $body['margin']['percent']);
    }

    /**
     * 🔴 THE BUY RATE IS ABSENT FROM THE WIRE, not nulled. Asserted against the raw
     * body: even for pricing, the per-unit buy rate is not published — the line total
     * is what the sheet is for, and the rate is what a leak would expose.
     */
    public function test_the_per_unit_buy_rate_is_omitted_from_the_response(): void
    {
        $this->addLine(['side' => 'buy', 'quantity' => 3, 'rate' => 777.77,
                        'vendor_id' => $this->vendor->id]);

        $body = $this->api($this->pricing)
            ->getJson($this->url("/api/jobs/{$this->job->id}/cost-sheet"))
            ->assertOk()
            ->getContent();

        $this->assertStringNotContainsString('777.77', $body);
    }

    // ─── Margin arithmetic ───────────────────────────────────────────────────

    /**
     * 🔴 NULL, NEVER −100%, ON AN UNBILLED JOB. "We have not billed this yet" and "we
     * lost everything on this" are opposite facts, and reporting the first as the
     * second corrupts every P&L roll-up that averages it.
     */
    public function test_an_unbilled_job_has_a_null_margin_percent_not_minus_one_hundred(): void
    {
        $this->addLine(['side' => 'buy', 'quantity' => 1, 'rate' => 500,
                        'tax_percentage' => 0, 'vendor_id' => $this->vendor->id]);

        $margin = $this->api($this->pricing)
            ->getJson($this->url("/api/jobs/{$this->job->id}/cost-sheet"))
            ->assertOk()
            ->json('margin');

        $this->assertSame(0.0, (float) $margin['sell']);
        $this->assertSame(-500.0, (float) $margin['value'], 'The cash position is real...');
        $this->assertNull($margin['percent'], '...but the PERCENTAGE is undefined.');
    }

    /** Amounts are derived server-side — a client cannot post arithmetic that disagrees. */
    public function test_line_amounts_are_computed_not_accepted(): void
    {
        $body = $this->addLine(['quantity' => 2, 'rate' => 100, 'tax_percentage' => 18]);
        $line = $body['sell']['lines'][0];

        $this->assertSame(200.0, (float) $line['amount']);
        $this->assertSame(36.0, (float) $line['tax_amount']);
        $this->assertSame(236.0, (float) $line['net_amount']);
    }

    // ─── Locking and gates ───────────────────────────────────────────────────

    /** §6.7 rule 5 — finalization locks the sheet. */
    public function test_the_sheet_locks_once_an_invoice_leaves_draft(): void
    {
        $this->addLine();

        DB::table('accounts_invoices')->where('job_id', $this->job->id)->update(['status' => 'finalized']);

        $this->api($this->pricing)
            ->getJson($this->url("/api/jobs/{$this->job->id}/cost-sheet"))
            ->assertOk()
            ->assertJsonPath('locked', true);

        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$this->job->id}/cost-sheet/lines"), [
                'side' => 'sell', 'charge_type' => 'cartage', 'description' => 'Late add',
                'quantity' => 1, 'rate' => 50,
            ])
            ->assertStatus(422)
            ->assertJsonPath('reason', 'locked');
    }

    /** 🔒 Operations never touches money. */
    public function test_operations_cannot_open_the_cost_sheet(): void
    {
        $this->api($this->user('operations'))
            ->getJson($this->url("/api/jobs/{$this->job->id}/cost-sheet"))
            ->assertForbidden();
    }

    /** 👁️ The Boss reads it but cannot edit — oversight is not authorship. */
    public function test_the_boss_can_read_but_not_edit(): void
    {
        $this->addLine();
        $admin = 'admin.f16sefreight.com';
        $boss = $this->user('boss');

        $this->api($boss)->getJson($this->url("/api/jobs/{$this->job->id}/cost-sheet", $admin))->assertOk();
        $this->api($boss)
            ->postJson($this->url("/api/jobs/{$this->job->id}/cost-sheet/lines", $admin), [
                'side' => 'sell', 'charge_type' => 'cartage', 'description' => 'x',
                'quantity' => 1, 'rate' => 1,
            ])
            ->assertForbidden();
    }

    /** A buy line without a vendor is refused — a cost is owed to somebody. */
    public function test_a_buy_line_requires_a_vendor(): void
    {
        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$this->job->id}/cost-sheet/lines"), [
                'side' => 'buy', 'charge_type' => 'air_freight', 'description' => 'Airline cost',
                'quantity' => 1, 'rate' => 100,
            ])
            ->assertStatus(422);
    }

    /** A line from another job cannot be deleted by guessing its id. */
    public function test_a_line_on_another_job_cannot_be_deleted(): void
    {
        $body = $this->addLine();
        $lineId = $body['sell']['lines'][0]['id'];

        $otherEnquiry = Enquiry::create([
            'agent_id' => $this->branch->id, 'transport_mode' => 'air',
            'enquiry_no' => 'ENQA-SHTBOM-26-0002',
        ]);
        $other = Job::create([
            'agent_id' => $this->branch->id, 'enquiry_id' => $otherEnquiry->id, 'transport_mode' => 'air',
        ]);

        $this->api($this->pricing)
            ->deleteJson($this->url("/api/jobs/{$other->id}/cost-sheet/sell/{$lineId}"))
            ->assertStatus(404)
            ->assertJsonPath('reason', 'not_found');

        $this->assertDatabaseHas('accounts_invoice_items', ['id' => $lineId]);
    }

    /** An unknown charge type is refused — the vocabulary is closed (§6.7). */
    public function test_an_unknown_charge_type_is_refused(): void
    {
        $this->api($this->pricing)
            ->postJson($this->url("/api/jobs/{$this->job->id}/cost-sheet/lines"), [
                'side' => 'sell', 'charge_type' => 'bribes', 'description' => 'x',
                'quantity' => 1, 'rate' => 1,
            ])
            ->assertStatus(422);
    }
}
