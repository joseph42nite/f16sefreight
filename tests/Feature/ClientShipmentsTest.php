<?php

namespace Tests\Feature;

use App\SuperAdmin;
use App\Company;
use App\Agent;
use App\AirwayBills;
use App\ConsignmentData;
use App\HousewayBills;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientShipmentsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Unguard
        SuperAdmin::unguard();
        Company::unguard();
        Agent::unguard();
        AirwayBills::unguard();
        ConsignmentData::unguard();
        HousewayBills::unguard();

        // Clean up test records
        SuperAdmin::where('email', 'testadmin@example.com')->delete();
        Company::where('name', 'Acme Test Logistics')->delete();
        AirwayBills::where('id', '11122223333')->delete();
        ConsignmentData::where('awb_id', '11122223333')->delete();
        HousewayBills::where('id', 'HAWB-TEST-01')->delete();
    }

    public function test_superadmin_can_view_shipments_per_client()
    {
        // 1. Create a SuperAdmin
        $superAdmin = SuperAdmin::create([
            'name' => 'Test SuperAdmin',
            'email' => 'testadmin@example.com',
            'password' => bcrypt('password123'),
        ]);

        // 2. Create Company & Agent
        $company = Company::create([
            'name' => 'Acme Test Logistics',
        ]);

        $agent = Agent::create([
            'company_id' => $company->id,
            'agent_name' => 'Acme Test Branch',
        ]);

        // 3. Create AWB and associated HAWB
        $awb = AirwayBills::create([
            'id' => '11122223333',
            'awb_code' => '111',
            'awb_no' => '22223333',
            'departure_airport' => 'JFK',
            'destination_airport' => 'LHR',
            'agent_id' => $agent->id,
        ]);

        ConsignmentData::create([
            'awb_id' => $awb->id,
            'pieces' => 15,
            'gross_weight' => '300',
        ]);

        HousewayBills::create([
            'id' => 'HAWB-TEST-01',
            'awb_code' => 111,
            'awb_no' => 22223333,
            'agent_id' => $agent->id,
            'departure_airport' => 'JFK',
            'destination_airport' => 'LHR',
        ]);

        // 4. Test unauthorized request
        $response = $this->getJson('/api/superadmin/client-shipments');
        $response->assertStatus(401);

        // 5. Test authorized request (all shipments)
        $response = $this->actingAs($superAdmin, 'superAdmin-api')
            ->getJson('/api/superadmin/client-shipments');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'shipments',
                'total_awb',
                'total_hawb',
                'pagination' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ]
            ]);

        // 6. Test filtering by company_id
        $response = $this->actingAs($superAdmin, 'superAdmin-api')
            ->getJson('/api/superadmin/client-shipments?company_id=' . $company->id);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'total_awb' => 1,
                'total_hawb' => 1,
            ]);

        // 6a. Test AWB Search (hyphen search)
        $response = $this->actingAs($superAdmin, 'superAdmin-api')
            ->getJson('/api/superadmin/client-shipments?search=111-22223333');
        $response->assertStatus(200)
            ->assertJsonFragment([
                'total_awb' => 1,
            ]);

        // 6b. Test AWB Search (partial code search)
        $response = $this->actingAs($superAdmin, 'superAdmin-api')
            ->getJson('/api/superadmin/client-shipments?search=222233');
        $response->assertStatus(200)
            ->assertJsonFragment([
                'total_awb' => 1,
            ]);

        // 6c. Test export=all parameter (skips pagination metadata)
        $response = $this->actingAs($superAdmin, 'superAdmin-api')
            ->getJson('/api/superadmin/client-shipments?export=all');
        $response->assertStatus(200)
            ->assertJsonMissing(['pagination'])
            ->assertJsonStructure([
                'shipments',
                'total_awb',
                'total_hawb'
            ]);

        // 7. Test XML view endpoint
        $response = $this->actingAs($superAdmin, 'superAdmin-api')
            ->getJson('/api/superadmin/shipment-xml/' . $awb->id);

        $response->assertStatus(200);
        $this->assertStringContainsString('111-22223333', $response->getContent());
        $this->assertStringContainsString('JFK', $response->getContent());
        $this->assertStringContainsString('LHR', $response->getContent());

        // 8. Test superadmin location endpoint
        $response = $this->actingAs($superAdmin, 'superAdmin-api')
            ->getJson('/api/superadmin/get-location');
        $response->assertStatus(200);
    }
}
