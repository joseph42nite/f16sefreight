<?php

namespace Tests\Feature;

use App\Agent;
use App\Airline;
use App\AirwayBills;
use App\Company;
use App\ConsignmentData;
use App\OtherCharge;
use App\OtherCustomInformation;
use App\PaymentInfo;
use App\WayBillAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AwbPdfGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Company::unguard();
        Agent::unguard();
        Airline::unguard();
        AirwayBills::unguard();
        WayBillAddress::unguard();
        ConsignmentData::unguard();
        PaymentInfo::unguard();
        OtherCharge::unguard();
        OtherCustomInformation::unguard();
    }

    private function seedAwb(): string
    {
        $awbId = '99911112222';

        $company = Company::create(['name' => 'PDF Test Company']);

        $agent = Agent::create([
            'company_id' => $company->id,
            'agent_name' => 'PDF Test Agent',
            'agent_address' => '1 Agent Way',
        ]);

        Airline::create([
            'name' => 'Test Airways',
            'code' => 'TA',
            'prefix' => '999',
            'country' => 'US',
            'airline_address' => "123 Airline Rd,Suite 1,Air City,AC 10001",
        ]);

        AirwayBills::create([
            'id' => $awbId,
            'awb_no' => '11112222',
            'awb_code' => '999',
            'agent_id' => $agent->id,
            'departure_airport' => 'JFK',
            'destination_airport' => 'LHR',
            'from' => 'JFK',
            'to' => 'LHR',
            'by' => 'AA',
            'flight' => '123',
            'date' => '2026-07-15 12:00:00',
            'special_handling_info' => json_encode(['ELI', 'PER']),
            'total_volume' => '100',
            'total_amount' => '500',
        ]);

        WayBillAddress::create([
            'awb_id' => $awbId,
            'ship_name' => 'Shipper Co',
            'ship_address' => '123 Shipper St',
            'ship_city' => 'Ship City',
            'cons_name' => 'Consignee Co',
            'cons_address' => '456 Consignee Rd',
            'cons_city' => 'Cons City',
        ]);

        ConsignmentData::create([
            'awb_id' => $awbId,
            'pieces' => 5,
            'gross_weight' => '50',
            'hs_code' => json_encode(['1234.56', '7890.12']),
        ]);

        PaymentInfo::create([
            'awb_id' => $awbId,
            'currency' => 'USD',
        ]);

        OtherCharge::create([
            'awb_id' => $awbId,
            'other_charge_code' => 'AWC',
            'amount' => '10',
        ]);

        OtherCustomInformation::create([
            'awb_id' => $awbId,
            'country_code' => 'US',
        ]);

        return $awbId;
    }

    public function test_all_three_awb_pdf_routes_render_successfully()
    {
        $awbId = $this->seedAwb();

        // Golden-master byte lengths captured against the pre-refactor
        // controller (DomPDF output is otherwise deterministic here since
        // the blade view has no now()/timestamp output). A mismatch means
        // the refactored controller produced different PDF content, not
        // just a different creation-date byte.
        $single = $this->get("/download-awb-pdf/{$awbId}");
        $single->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $single->headers->get('Content-Type'));
        $this->assertSame(21686, strlen($single->getContent()));

        $multiple = $this->get("/download-multiple-awb-pdf/{$awbId}");
        $multiple->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $multiple->headers->get('Content-Type'));
        $this->assertSame(92488, strlen($multiple->getContent()));

        $multipleWithBack = $this->get("/download-multiple-both-page-awb-pdf/{$awbId}");
        $multipleWithBack->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $multipleWithBack->headers->get('Content-Type'));
        $this->assertSame(151020, strlen($multipleWithBack->getContent()));
    }
}
