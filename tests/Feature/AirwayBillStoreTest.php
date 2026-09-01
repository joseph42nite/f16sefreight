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
 * `POST /api/user/create-focusair` — the defects found by putting real data in
 * (GAPS #41, #43, #44).
 *
 * ⚠️ Every one of these was invisible from the UI. The Vue form always sends every routing
 * key and always sends a status, so the form never triggered them — but an API client, an
 * integration, or an OCR-driven create does, and each returned a 500.
 */
class AirwayBillStoreTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;
    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Store Co', 'code' => 'AWS', 'tier' => 'command']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);

        $this->user = User::create([
            'name' => 'Pricing', 'email' => 'pricing-aws@test.local', 'password' => Hash::make('x'),
            'company_name' => $company->id, 'branch_name' => $this->branch->id,
            'designation' => 'pricing', 'is_active' => 1,
        ]);
    }

    /**
     * ⚠️ NOT named `post()`. `TestCase::post()` is public, and a private override of it is a
     * FATAL error at class-load time, not a test failure — the whole file refuses to run.
     * This project has hit it before.
     */
    private function create(array $payload)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . auth()->guard('user-api')->login($this->user),
            'Accept' => 'application/json',
        ])->postJson('http://focusair.localhost/api/user/create-focusair', $payload);
    }

    private function firstBox(string $serial): array
    {
        return ['awb_code' => '176', 'awb_no' => $serial, 'consolidated_mawb' => 'false', 'awb' => 'true'];
    }

    private function directRouting(): array
    {
        // A DIRECT flight — one leg, nothing for legs 2 and 3. The common case.
        return ['departure_airport' => 'BOM', 'destination_airport' => 'DXB',
                'from' => 'BOM', 'to' => 'DXB', 'by' => 'EK', 'flight' => '0511',
                'date' => '2026-09-04'];
    }

    // ─── #43: a direct flight has one leg ────────────────────────────────────

    /**
     * 🔴 The second and third legs are `nullable` in the validator, but were read
     * unconditionally — `Undefined array key "to_2"`, a 500. A shipment that flies direct
     * is not an edge case.
     */
    public function test_a_direct_flight_with_no_second_leg_is_accepted(): void
    {
        $this->create([
            'first_box' => $this->firstBox('20000001'),
            'routing_information' => $this->directRouting(),
        ])->assertOk();

        $row = DB::table('air_way_bills')->where('id', 17620000001)->first(['to', 'to_2', 'to_3']);

        $this->assertSame('DXB', $row->to);
        $this->assertNull($row->to_2);
        $this->assertNull($row->to_3);
    }

    // ─── #41: a missing status must not wipe a NOT NULL column ───────────────

    /**
     * 🔴 `$request->status` is NULL when omitted and was written into a NOT NULL column —
     * AFTER every section had already saved. The caller got a 500 with no way to know the
     * waybill had in fact been created and fully populated.
     */
    public function test_omitting_status_does_not_fail_the_request(): void
    {
        $this->create([
            'first_box' => $this->firstBox('20000002'),
            'routing_information' => $this->directRouting(),
        ])->assertOk();

        $this->assertSame(1, DB::table('air_way_bills')->where('id', 17620000002)->count());
    }

    /** ⚠️ And an omitted status LEAVES the existing one, rather than blanking it. */
    public function test_omitting_status_preserves_the_status_already_set(): void
    {
        $this->create(['first_box' => $this->firstBox('20000003'), 'status' => 'send_to_airline']);
        $this->create(['first_box' => $this->firstBox('20000003')])->assertOk();

        $this->assertSame('send_to_airline',
            DB::table('air_way_bills')->where('id', 17620000003)->value('status'));
    }

    // ─── #44: real addresses ─────────────────────────────────────────────────

    /**
     * 🔴 THE ADDRESSES THAT ACTUALLY EXIST. The old rule allowed only
     * `[a-zA-Z0-9\s.,-]`, so an Indian industrial address, a German party name and a unit
     * number were all refused. A forwarder cannot file a shipment for a client whose
     * address the form will not hold.
     */
    public function test_real_world_addresses_are_accepted(): void
    {
        $addresses = [
            'Plot 42/A, MIDC Andheri East',      // the slash
            'Müller & Co., Hafenstrasse 12',     // ampersand and umlaut
            'Unit 5 (Rear), Dock Road',          // parentheses
            "O'Connor Wharf #3",                 // apostrophe and hash
        ];

        foreach ($addresses as $i => $address) {
            $serial = '2000010' . $i;

            $this->create([
                'first_box' => $this->firstBox($serial),
                'shipper_address' => [
                    'ship_name' => 'Test Shipper', 'ship_address' => $address,
                    'ship_city' => 'Mumbai', 'ship_state' => 'Maharashtra',
                    'ship_country' => 'IN', 'ship_post_code' => '400093',
                ],
            ])->assertOk("rejected: {$address}");
        }
    }

    /**
     * 🔴 AND STORED EXACTLY — accepting an address is worthless if it arrives mangled.
     * This is the same class of failure as the silent truncation already fixed in both air
     * forms, where "Müller & Co." was written to the database as "Mller Co".
     */
    public function test_an_accented_address_is_stored_byte_for_byte(): void
    {
        $address = 'Müller & Co., Hafenstraße 12/B (Tor 4)';

        $this->create([
            'first_box' => $this->firstBox('20000200'),
            'shipper_address' => [
                'ship_name' => 'Müller & Co.', 'ship_address' => $address,
                'ship_city' => 'Köln', 'ship_state' => 'NRW',
                'ship_country' => 'DE', 'ship_post_code' => '50667',
            ],
        ])->assertOk();

        $stored = DB::table('way_bill_addresses')->where('awb_id', '17620000200')
            ->value('ship_address');

        $this->assertSame($address, $stored, 'The address was altered on the way in.');
    }

    /** ⚠️ Control characters are still refused — the rule was widened, not removed. */
    public function test_control_characters_are_still_rejected(): void
    {
        $this->create([
            'first_box' => $this->firstBox('20000300'),
            'shipper_address' => [
                'ship_name' => 'Test', 'ship_address' => "Line one\x00\x07 injected",
                'ship_city' => 'Mumbai', 'ship_state' => 'MH',
                'ship_country' => 'IN', 'ship_post_code' => '400093',
            ],
        ])->assertStatus(422);
    }
}
