<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Saving an airway bill through `create-focusair` — the path the MAWB form and the
 * extraction panel both use.
 *
 * 🔴 **This file exists because nothing tested the cargo save, and it had never worked.**
 * `ConsignmentData` wrote `agent_id` and `way_bill_consignment_data` had no such column,
 * so every save carrying `entries` died with *"Unknown column 'agent_id'"* — pieces, gross
 * weight, goods description and every dimension line (GAPS #45). The AWB and its addresses
 * saved first, so the failure arrived as a 500 sitting on top of a half-written document.
 */
class AirwayBillDraftTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Draft Co', 'code' => 'DRF', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->user = User::create([
            'name' => 'Pricing', 'email' => 'pricing-drf@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);
    }

    /**
     * ⚠️ NOT named `post()`. A private `post()` shadows `TestCase::post()` and PHP refuses
     * to load the class — a FATAL, not a failing test, so the whole file silently stops
     * existing. Hit twice in this codebase now.
     */
    private function submit(array $payload)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->user),
            'Accept' => 'application/json',
        ])->postJson('http://focusair.localhost/api/user/create-focusair', $payload);
    }

    private function draft(array $overrides = []): array
    {
        return array_merge([
            'first_box' => ['awb_code' => '176', 'awb_no' => '90000001',
                            'consolidated_mawb' => 'false', 'awb' => 'true'],
            'shipper_address' => [
                'ship_name' => 'Globex Exports Pvt Ltd',
                'ship_address' => 'Plot 42/A, MIDC Andheri East',
                'ship_city' => 'Mumbai', 'ship_state' => 'Maharashtra',
                'ship_country' => 'IN', 'ship_post_code' => '400093',
            ],
            'consignee_address' => [
                'cons_name' => 'Emirates Trading LLC',
                'cons_address' => 'Warehouse 7, Jebel Ali Free Zone',
                'cons_city' => 'Dubai', 'cons_state' => 'Dubai',
                'cons_country' => 'AE', 'cons_post_code' => '17000',
            ],
            'entries' => [[
                'pieces' => '14', 'description' => 'Machine parts', 'gross_weight' => '698.5',
                'rate_class' => '', 'uld_rate_class' => '', 'service_code' => '',
                'commodity_item' => '', 'country_origin_goods' => '', 'slac' => '',
                'weight_code' => 'K', 'chargable_weight' => '', 'rate' => '',
                'hsCodes' => [], 'uld_infos' => [],
                'itemss' => [['pcs' => '14', 'wgt' => '', 'length' => 120,
                              'width' => 80, 'height' => 90, 'unit' => 'CMT']],
            ]],
            'status' => 'generate_pdf',
        ], $overrides);
    }

    /** 🔴 The regression guard: cargo reaches the database at all. */
    public function test_a_draft_saves_its_cargo(): void
    {
        $this->submit($this->draft())->assertOk();

        $row = DB::table('way_bill_consignment_data')->where('awb_id', '17690000001')->first();

        $this->assertNotNull($row, 'The consignment line was not stored.');
        $this->assertSame('14', (string) $row->pieces);
        $this->assertSame('Machine parts', $row->description);
        $this->assertSame('698.5', (string) $row->gross_weight);
    }

    /**
     * ⚠️ `agent_id` comes from the ACTING USER, never the request. The branch is a
     * property of who is logged in; accepting it from the payload would let one branch
     * file cargo against another.
     */
    public function test_cargo_is_attributed_to_the_acting_users_branch(): void
    {
        $this->submit($this->draft())->assertOk();

        $this->assertSame(
            (int) $this->branch->id,
            (int) DB::table('way_bill_consignment_data')->where('awb_id', '17690000001')->value('agent_id')
        );
    }

    /**
     * Dimension lines survive as structured JSON, not a flattened string — the AWB form
     * reads them back into its own rows, and a printed waybill prices from them.
     */
    public function test_dimension_lines_round_trip_as_json(): void
    {
        $this->submit($this->draft())->assertOk();

        $raw = DB::table('way_bill_consignment_data')->where('awb_id', '17690000001')->value('pieces_info');
        $lines = json_decode($raw, true);

        $this->assertIsArray($lines);
        $this->assertSame(120, $lines[0]['length']);
        $this->assertSame(80, $lines[0]['width']);
        $this->assertSame(90, $lines[0]['height']);
        $this->assertSame('CMT', $lines[0]['unit']);
    }

    /**
     * 🔴 GAPS #44 — a real address saves. `Plot 42/A` was rejected outright by the old
     * allow-list, which permitted only `[a-zA-Z0-9\s.,-]`; Indian industrial addresses
     * carry slashes as a matter of course.
     */
    public function test_a_real_address_with_a_slash_is_accepted(): void
    {
        $this->submit($this->draft())->assertOk();

        $this->assertSame(
            'Plot 42/A, MIDC Andheri East',
            DB::table('way_bill_addresses')->where('awb_id', '17690000001')->value('ship_address')
        );
    }

    /**
     * ⚠️ GAPS #46 — a party carrying only a NAME is what extraction usually produces, and
     * the endpoint will not store it. Asserted so the behaviour is known rather than
     * discovered: the shipper is skipped in silence, which is why `ExtractionPanel` warns
     * before saving instead of after.
     */
    public function test_a_name_only_shipper_is_silently_skipped(): void
    {
        $this->submit($this->draft(['shipper_address' => ['ship_name' => 'Globex Exports Pvt Ltd']]))
            ->assertOk();

        $this->assertNull(
            DB::table('way_bill_addresses')->where('awb_id', '17690000001')->value('ship_name'),
            'A name-only shipper was stored — the guard in store() has changed.'
        );
    }
}
