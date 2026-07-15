<?php

namespace Tests\Feature;

use App\User;
use App\Agent;
use App\Company;
use App\SavedAddress;
use App\AirwayBills;
use App\HousewayBills;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WaybillRefactoringTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        User::unguard();
        Agent::unguard();
        Company::unguard();
        SavedAddress::unguard();
        AirwayBills::unguard();
        HousewayBills::unguard();

        // Clean up test records
        User::where('email', 'testuser@example.com')->delete();
        Company::where('name', 'Refactor Test Company')->delete();
        Agent::where('agent_name', 'Test Agent')->delete();
        SavedAddress::where('name', 'Refactor Test Address')->delete();
        AirwayBills::where('id', '99912345678')->delete();
        HousewayBills::where('id', '99987654321')->delete();
    }

    public function test_user_can_retrieve_address_endpoints_with_correct_prefixes()
    {
        // 1. Create a Company and Agent
        $company = Company::create([
            'name' => 'Refactor Test Company',
        ]);
        $agent = Agent::create([
            'company_id' => $company->id,
            'agent_name' => 'Test Agent',
        ]);
        $user = User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => bcrypt('password123'),
            'branch_name' => $agent->id,
        ]);

        // 2. Create SavedAddress
        $address = SavedAddress::create([
            'name' => 'Refactor Test Address',
            'name_2' => 'Suite 100',
            'account' => 'ACC123',
            'address' => '123 Test St',
            'city' => 'Test City',
            'airport_code' => 'JFK',
            'post_code' => '12345',
            'state' => 'NY',
            'country' => 'US',
            'phone' => '1234567890',
            'fax' => '0987654321',
            'telex' => 'TLX123',
            'address_type' => 'shipper_address',
        ]);

        // 3. Test getShipperAddress (should return keys prefixed with "ship_")
        $response = $this->actingAs($user, 'user-api')
            ->getJson('/api/user/get-shipper-address?id=' . $address->id);

        $response->assertStatus(200)
            ->assertJson([
                'ship_name' => 'Refactor Test Address',
                'ship_name_2' => 'Suite 100',
                'ship_account' => 'ACC123',
                'ship_address' => '123 Test St',
                'ship_city' => 'Test City',
            ]);

        // 4. Test getConsigneeAddress (should return keys prefixed with "cons_")
        $response = $this->actingAs($user, 'user-api')
            ->getJson('/api/user/get-consignee-address?id=' . $address->id);

        $response->assertStatus(200)
            ->assertJson([
                'cons_name' => 'Refactor Test Address',
                'cons_name_2' => 'Suite 100',
                'cons_account' => 'ACC123',
                'cons_address' => '123 Test St',
                'cons_city' => 'Test City',
            ]);

        // 5. Test getAlsoNotifyAddress (should return keys prefixed with "also_")
        $response = $this->actingAs($user, 'user-api')
            ->getJson('/api/user/get-alsonotify-address?id=' . $address->id);

        $response->assertStatus(200)
            ->assertJson([
                'also_name' => 'Refactor Test Address',
                'also_name_2' => 'Suite 100',
                'also_account' => 'ACC123',
            ]);
    }

    public function test_routing_date_validation_and_parsing()
    {
        // 1. Create Company and Agent
        $company = Company::create([
            'name' => 'Refactor Test Company',
        ]);
        $agent = Agent::create([
            'company_id' => $company->id,
            'agent_name' => 'Test Agent',
        ]);
        $user = User::create([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => bcrypt('password123'),
            'branch_name' => $agent->id,
        ]);

        // Setup payload for AirwayBill store
        $payload = [
            'status' => 'generate_pdf',
            'awb_email' => 'test@example.com',
            'first_box' => [
                'awb_code' => '999',
                'awb_no' => '12345678',
                'consolidated_mawb' => false,
                'awb' => true,
            ],
            'routing_information' => [
                'departure_airport' => 'JFK',
                'destination_airport' => 'LHR',
                'from' => 'JFK',
                'to' => 'LHR',
                'by' => 'AA',
                'flight' => '123',
                'date' => '2026-07-15T12:00:00.000Z', // ISO Format
                'to_2' => null,
                'by_2' => null,
                'flight_2' => null,
                'date_2' => '2026-07-16 14:30:00',     // Standard Format
                'to_3' => null,
                'by_3' => null,
                'flight_3' => null,
                'date_3' => null,
            ],
            'shipper_address' => [
                'ship_name' => 'Shipper Co',
                'ship_address' => '123 Shipper St',
                'ship_city' => 'Ship City',
                'ship_post_code' => '12345',
            ],
            'consignee_address' => [
                'cons_name' => 'Consignee Co',
                'cons_address' => '456 Consignee Rd',
                'cons_city' => 'Cons City',
                'cons_post_code' => '54321',
                'cons_state' => 'CA',
                'cons_country' => 'US',
            ],
            'totals' => [
                'total_volume' => 150.5,
                'total_amount' => 1200.00,
            ]
        ];

        // 2. Post valid payload
        $response = $this->actingAs($user, 'user-api')
            ->postJson('/api/user/create-focusair', $payload);

        $response->assertStatus(200);

        // Verify dates are parsed and formatted correctly in DB
        $awb = AirwayBills::find('99912345678');
        $this->assertNotNull($awb);
        $this->assertEquals('2026-07-15 17:30:00', $awb->date);
        $this->assertEquals('2026-07-16 14:30:00', $awb->date_2);

        // 3. Post payload with invalid date
        $payload['routing_information']['date'] = 'invalid-date-string';

        $responseInvalid = $this->actingAs($user, 'user-api')
            ->postJson('/api/user/create-focusair', $payload);

        $responseInvalid->assertStatus(422)
            ->assertJsonStructure(['errors' => ['date']]);
    }
}
