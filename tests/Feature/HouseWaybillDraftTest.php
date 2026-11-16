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
 * A house waybill DRAFT keeps what was collected, the same as a master one.
 *
 * 🔴 The Extraction panel saves a house waybill through `create-houseway-bill`, which refused
 * a party missing any part, so a draft from a real invoice lost its parties.
 */
class HouseWaybillDraftTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Hawb Draft Co', 'code' => 'HDR', 'tier' => 'command']);
        $branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->user = User::create([
            'name' => 'Pricing', 'email' => 'pricing-hdr@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);
    }

    /** ⚠️ Not named `post()`: a private `post()` shadows `TestCase::post()` and the file fails to load. */
    private function submit(string $status)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->user),
            'Accept' => 'application/json',
        ])->postJson('http://focusair.localhost/api/user/create-houseway-bill', [
            'first_box' => ['hawb_no' => 'HDRTEST001', 'awb_code' => '176', 'awb_no' => '90000002'],
            'shipper_address' => ['ship_name' => 'TRAILSPEC GEARS PRIVATE LIMITED', 'ship_city' => 'KALAMASEERY'],
            'status' => $status,
        ]);
    }

    /**
     * ⚠️ The payload carries NO `totals`, like the panel's: it sends them only with both volume
     * and amount. That alone used to 500 this endpoint before a party was looked at.
     */
    public function test_a_draft_keeps_a_party_missing_its_state_and_country(): void
    {
        $this->submit('draft')->assertOk();

        $row = DB::table('way_bill_addresses')->where('ship_name', 'TRAILSPEC GEARS PRIVATE LIMITED')->first();

        $this->assertNotNull($row, 'The draft did not store the shipper.');
        $this->assertSame('KALAMASEERY', $row->ship_city);
        $this->assertNull($row->ship_country);
    }

    /** 🔴 Only a draft is relaxed. Any other save still needs every part. */
    public function test_outside_a_draft_a_partial_shipper_is_still_refused(): void
    {
        $this->submit('generate_pdf')->assertStatus(422);
    }

    /** FW6 (frontend audit 2026-11-15): an empty list on an update removes the rows; a request with no list leaves them. */
    public function test_an_update_removes_what_was_taken_off_the_form(): void
    {
        $this->submit('draft')->assertOk();
        $line = ['country_code' => 'IN', 'info_identifier' => 'SHP', 'custom_info_identifier' => 'T', 'supplementary_info' => 'ONE'];
        $charge = ['other_charge_code' => 'MY', 'amount' => '100', 'due' => 'C', 'payment_type' => 'PP'];
        $update = fn (array $changes) => $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->user), 'Accept' => 'application/json',
        ])->putJson('http://focusair.localhost/api/user/update-houseway-bill/HDRTEST001', $changes + [
            'first_box' => ['hawb_no' => 'HDRTEST001', 'awb_code' => '176', 'awb_no' => '90000002'],
            'shipper_address' => ['ship_name' => 'TRAILSPEC GEARS PRIVATE LIMITED', 'ship_city' => 'KALAMASEERY'],
            'status' => 'draft',
        ]);
        $stored = fn () => [
            \Illuminate\Support\Facades\DB::table('way_bill_custom_info')->where('awb_id', 'HDRTEST001')->count(),
            \Illuminate\Support\Facades\DB::table('other_charges_code')->where('awb_id', 'HDRTEST001')->count(),
            \Illuminate\Support\Facades\DB::table('house_way_bills')->where('id', 'HDRTEST001')->value('special_handling_info'),
        ];

        $update(['oci_entries' => [$line], 'charges' => [$charge], 'tableCodes' => ['PER']])->assertOk();
        $this->assertSame([1, 1, '["PER"]'], $stored());

        $update([])->assertOk();
        $this->assertSame([1, 1, '["PER"]'], $stored());

        $update(['oci_entries' => [], 'charges' => [], 'tableCodes' => []])->assertOk();
        $this->assertSame([0, 0, '[]'], $stored());
    }
}
