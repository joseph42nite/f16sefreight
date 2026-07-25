<?php

namespace Tests\Feature;

use App\Agent;
use App\AirwayBills;
use App\Company;
use App\ConsignmentData;
use App\HousewayBills;
use App\Http\Controllers\Logistics\ConversionController;
use App\OtherCharge;
use App\OtherCustomInformation;
use App\PaymentInfo;
use App\User;
use App\WayBillAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ConversionXmlGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // config/common-data.php is gitignored (holds real Descartes
        // credentials); override just enough for withBasicAuth()/Http::fake()
        // to work without needing that file to exist.
        config([
            'common-data.descartes_username' => 'test-user',
            'common-data.descartes_password' => 'test-pass',
            'common-data.descartes_upload_url' => 'https://descartes.test/upload',
            'common-data.descartes_upload_url_testing' => 'https://descartes.test/upload-testing',
        ]);

        Company::unguard();
        Agent::unguard();
        User::unguard();
        AirwayBills::unguard();
        HousewayBills::unguard();
        WayBillAddress::unguard();
        ConsignmentData::unguard();
        PaymentInfo::unguard();
        OtherCharge::unguard();
        OtherCustomInformation::unguard();
    }

    // Every route's IssueDateTime/ActualDateTime use gmdate(), and the house
    // waybill's message ID embeds time() — both change every run even with
    // zero code changes, so they're masked before comparing against the
    // golden fixture captured from the pre-refactor controller.
    private function normalizeVolatileXml(string $xml, ?string $idPrefix = null): string
    {
        $xml = preg_replace('/<ram:IssueDateTime>.*?<\/ram:IssueDateTime>/', '<ram:IssueDateTime>NORMALIZED</ram:IssueDateTime>', $xml);
        $xml = preg_replace('/<ram:ActualDateTime>.*?<\/ram:ActualDateTime>/', '<ram:ActualDateTime>NORMALIZED</ram:ActualDateTime>', $xml);
        if ($idPrefix !== null) {
            $xml = preg_replace('/<ram:ID>' . preg_quote($idPrefix, '/') . '_\d+<\/ram:ID>/', "<ram:ID>{$idPrefix}_NORMALIZED</ram:ID>", $xml, 1);
        }
        return $xml;
    }

    private function seedCommon(string $awbId, string $addressAwbId, string $consignmentAwbId, string $paymentAwbId, string $chargeAwbId, string $companyName, string $agentName): array
    {
        $company = Company::create(['name' => $companyName, 'in_testing_mode' => true]);
        $agent = Agent::create([
            'company_id' => $company->id,
            'agent_name' => $agentName,
            'agent_address' => '1 Agent Way',
            'agent_pincode' => '10001',
            'agent_city' => 'Agent City',
            'agent_country' => 'US',
            'agent_issue_sign' => 'SIGN',
            'agent_issue_loc_code' => 'LOC1',
            'iata_agent_code' => 1234567,
            'iata_agent_cass' => 1234,
            'agent_contact_person_phone' => '5551234',
            'agent_contact_person_email' => 'agent@example.com',
        ]);
        $user = User::create([
            'name' => 'Conversion Test User',
            'email' => strtolower($companyName) . '@example.com',
            'password' => bcrypt('password123'),
            'branch_name' => $agent->id,
            'company_name' => $company->id,
            'pima_address' => 'PIMAADDR',
        ]);

        WayBillAddress::create([
            'awb_id' => $addressAwbId,
            'ship_name' => 'Shipper Co',
            'ship_account' => 'SHIPACC',
            'ship_address' => '123 Shipper St',
            'ship_city' => 'Ship City',
            'ship_country' => 'US',
            'ship_post_code' => '11111',
            'cons_name' => 'Consignee Co',
            'cons_account' => 'CONSACC',
            'cons_address' => '456 Consignee Rd',
            'cons_city' => 'Cons City',
            'cons_country' => 'GB',
            'cons_post_code' => '22222',
        ]);

        ConsignmentData::create([
            'awb_id' => $consignmentAwbId,
            'pieces' => 5,
            'gross_weight' => '50',
            'weight_code' => 'KGM',
            'hs_code' => json_encode(['1234.56']),
            'description' => 'General cargo',
            'rate_class' => 'Q',
            'chargable_weight' => 50,
            'rate' => 10,
            'uld_info' => json_encode([]),
            'pieces_info' => json_encode([]),
        ]);

        PaymentInfo::create([
            'awb_id' => $paymentAwbId,
            'currency' => 'USD',
            'type_of_payment' => 'PP',
            'declear_value_carriage' => 'NVD',
            'declear_value_customs' => 'NCV',
            'declear_value_insurance' => 'XXX',
            'weight_charge' => 100,
            'total_charges_prepaid' => 150,
        ]);

        OtherCharge::create([
            'awb_id' => $chargeAwbId,
            'other_charge_code' => 'AWC',
            'amount' => '10',
            'payment_type' => 'P',
            'due' => 'A',
        ]);

        return [$company, $agent, $user];
    }

    public function test_waybill_conversion_xml_matches_golden_master()
    {
        Storage::fake('local');
        Http::fake();

        $awbId = '99977778888';
        [, , $user] = $this->seedCommon($awbId, $awbId, $awbId, $awbId, $awbId, 'AWB Conv Co', 'AWB Conv Agent');

        AirwayBills::create([
            'id' => $awbId,
            'awb_no' => '77778888',
            'awb_code' => '999',
            'consolidated_mawb' => 'false',
            'departure_airport' => 'JFK',
            'destination_airport' => 'LHR',
            'from' => 'JFK',
            'to' => 'CDG',
            'by' => 'AA',
            'flight' => '100',
            'date' => '2026-07-15 10:00:00',
            'to_2' => 'FRA',
            'by_2' => 'BA',
            'flight_2' => '200',
            'date_2' => '2026-07-15 14:00:00',
            'to_3' => 'LHR',
            'by_3' => 'CA',
            'flight_3' => '300',
            'date_3' => '2026-07-15 18:00:00',
            'total_volume' => '100',
            'total_amount' => '500',
            'special_handling_info' => json_encode([]),
        ]);

        $this->actingAs($user, 'user-api')->getJson("/api/user/waybill/{$awbId}")->assertStatus(200);

        $xmlFile = "xml-conversion-files/xml_airway_bill_{$awbId}.xml";
        Storage::disk('local')->assertExists($xmlFile);
        $xml = $this->normalizeVolatileXml(Storage::disk('local')->get($xmlFile));

        $fixture = __DIR__ . '/../Fixtures/waybill_conversion_golden.xml';
        $this->assertSame(file_get_contents($fixture), $xml);
    }

    public function test_houseway_bill_conversion_xml_matches_golden_master()
    {
        Storage::fake('local');
        Http::fake();

        $hawbId = '99966665555';
        [, , $user] = $this->seedCommon($hawbId, $hawbId, $hawbId, $hawbId, $hawbId, 'HAWB Conv Co', 'HAWB Conv Agent');

        HousewayBills::create([
            'id' => $hawbId,
            'awb_no' => '66665555',
            'awb_code' => '999',
            'departure_airport' => 'JFK',
            'destination_airport' => 'LHR',
            'from' => 'JFK',
            'to' => 'CDG',
            'by' => 'AA',
            'flight' => '100',
            'date' => '2026-07-15 10:00:00',
            'to_2' => 'FRA',
            'by_2' => 'BA',
            'flight_2' => '200',
            'date_2' => '2026-07-15 14:00:00',
            'to_3' => 'LHR',
            'by_3' => 'CA',
            'flight_3' => '300',
            'date_3' => '2026-07-15 18:00:00',
            'total_volume' => '100',
            'total_amount' => '500',
        ]);

        $this->actingAs($user, 'user-api');
        app(ConversionController::class)->HouseWayBillConversion($hawbId);

        $xmlFile = "xml-conversion-files/xml_houseway_bill_{$hawbId}.xml";
        Storage::disk('local')->assertExists($xmlFile);
        $xml = $this->normalizeVolatileXml(Storage::disk('local')->get($xmlFile), $hawbId);

        $fixture = __DIR__ . '/../Fixtures/houseway_bill_conversion_golden.xml';
        $this->assertSame(file_get_contents($fixture), $xml);
    }
}
