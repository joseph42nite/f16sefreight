<?php

namespace Tests\Feature;

use App\Agent;
use App\Airline;
use App\Company;
use App\ConsignmentData;
use App\HousewayBills;
use App\OtherCharge;
use App\OtherCustomInformation;
use App\PaymentInfo;
use App\WayBillAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HawbPdfGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Company::unguard();
        Agent::unguard();
        Airline::unguard();
        HousewayBills::unguard();
        WayBillAddress::unguard();
        ConsignmentData::unguard();
        PaymentInfo::unguard();
        OtherCharge::unguard();
        OtherCustomInformation::unguard();
    }

    private function seedHawb(): string
    {
        $hawbId = '99944443333';

        $company = Company::create(['name' => 'HAWB PDF Co']);

        $agent = Agent::create([
            'company_id' => $company->id,
            'agent_name' => 'HAWB PDF Agent',
            'agent_address' => '1 Agent Way',
            'agent_city' => 'Agent City',
            'agent_pincode' => '10001',
            'agent_account' => 'AGACC',
            'iata_agent_code' => 1234567,
            'iata_agent_cass' => 1234,
        ]);

        Airline::create([
            'name' => 'Test Airways',
            'code' => 'TA',
            'prefix' => '999',
            'country' => 'US',
            'airline_address' => '123 Airline Rd,Suite 1,Air City,AC 10001',
        ]);

        HousewayBills::create([
            'id' => $hawbId,
            'awb_no' => '44443333',
            'awb_code' => '999',
            'agent_id' => $agent->id,
            'departure_airport' => 'JFK',
            'destination_airport' => 'LHR',
            'from' => 'JFK',
            'to' => 'CDG',
            'to_2' => 'FRA',
            'to_3' => 'LHR',
            'by' => 'AA',
            'by_2' => 'BA',
            'by_3' => 'CA',
            'flight' => '100',
            'date' => '2026-07-15 10:00:00',
            'special_handling_info' => json_encode(['ELI', 'PER']),
            'total_volume' => '100',
            'total_amount' => '500',
            'ho_name' => 'House Origin',
            'ho_address' => '9 House St',
            'ho_city' => 'House City',
            'ho_pincode' => '33333',
            'ho_state' => 'HS',
            'ho_country' => 'US',
        ]);

        WayBillAddress::create([
            'awb_id' => $hawbId,
            'ship_name' => 'Shipper Co',
            'ship_address' => '123 Shipper St',
            'ship_city' => 'Ship City',
            'cons_name' => 'Consignee Co',
            'cons_address' => '456 Consignee Rd',
            'cons_city' => 'Cons City',
        ]);

        ConsignmentData::create([
            'awb_id' => $hawbId,
            'pieces' => 5,
            'gross_weight' => '50',
            'chargable_weight' => 50,
            'rate' => 10,
            'hs_code' => json_encode(['1234.56', '7890.12']),
            'description' => 'General cargo',
            'rate_class' => 'Q',
            'pieces_info' => json_encode([]),
        ]);

        PaymentInfo::create([
            'awb_id' => $hawbId,
            'currency' => 'USD',
        ]);

        OtherCharge::create([
            'awb_id' => $hawbId,
            'other_charge_code' => 'AWC',
            'amount' => '10',
            'due' => 'C',
        ]);

        OtherCustomInformation::create([
            'awb_id' => $hawbId,
            'country_code' => 'US',
        ]);

        return $hawbId;
    }

    public function test_all_three_hawb_pdf_routes_render_successfully()
    {
        $hawbId = $this->seedHawb();

        // Golden-master byte lengths captured against the pre-refactor controller.
        // A tolerance is used because the hawb blade emits date('d-M-y') and DomPDF's
        // multi-page deflate stream varies by a handful of bytes depending on process
        // state (test order) — this jitter is identical for the old and new controller,
        // so it isn't a refactor signal. A real content change shifts output by far
        // more than the delta (content repeats across 11 pages).
        //
        // Rebaselined when Requested Flight/Date started printing "15JUL" instead
        // of the raw "2026-07-15 10:00:00", and stopped emitting a bare "BA / "
        // and "CA / " for the second and third legs when no flight is set.
        // Rebaselined again when the rate grid's header and totals rules were made
        // continuous and level across the columns. The totals row now fills down
        // to the foot of the grid, with the totals rules lowered to sit directly above
        // the totals figures and the dividers meeting the rule above Prepaid.
        // Rebaselined again for the Charges-at-Destination rule moving to the row
        // foot, the restored "Created by" footer, and the larger page-2 IATA logo.
        // Rebaselined again when Pieces/Gross Weight/kg-lb became top-level grid
        // columns so their dividers span the grid at any content height.
        // Rebaselined again for the Other PPD|COLL divider spanning its band and the
        // larger waybill number under Total Collect Charges.
        $single = $this->get("/download-hawb-pdf/{$hawbId}");
        $single->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $single->headers->get('Content-Type'));
        $this->assertEqualsWithDelta(22468, strlen($single->getContent()), 256);

        $multiple = $this->get("/download-multiple-hawb-pdf/{$hawbId}");
        $multiple->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $multiple->headers->get('Content-Type'));
        $this->assertEqualsWithDelta(96931, strlen($multiple->getContent()), 256);

        $multipleWithBack = $this->get("/download-multiple-both-page-hawb-pdf/{$hawbId}");
        $multipleWithBack->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $multipleWithBack->headers->get('Content-Type'));
        $this->assertEqualsWithDelta(156890, strlen($multipleWithBack->getContent()), 256);
    }

    // A pieces_info entry missing optional keys (unit, or any dimension) used to
    // raise "Undefined array key" inside the blade and fail the whole request.
    public function test_hawb_pdf_renders_when_pieces_info_entries_are_incomplete()
    {
        $hawbId = $this->seedHawb();

        ConsignmentData::where('awb_id', $hawbId)->update([
            'pieces_info' => json_encode([
                ['pcs' => '6', 'length' => '120', 'width' => '80', 'height' => '95'], // no unit
                ['pcs' => '4'],                                                        // no dimensions
            ]),
        ]);

        $response = $this->get("/download-hawb-pdf/{$hawbId}");

        $response->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $response->headers->get('Content-Type'));
    }

    // HS codes are stored independently of pieces_info; the blade used to emit
    // them only inside the pieces_info branch, silently dropping them otherwise.
    public function test_hawb_pdf_shows_hs_codes_without_pieces_info()
    {
        $hawbId = $this->seedHawb();

        ConsignmentData::where('awb_id', $hawbId)->update(['pieces_info' => null]);

        $withoutPiecesInfo = strlen($this->get("/download-hawb-pdf/{$hawbId}")->getContent());

        ConsignmentData::where('awb_id', $hawbId)->update(['hs_code' => null]);
        $withoutEither = strlen($this->get("/download-hawb-pdf/{$hawbId}")->getContent());

        $this->assertGreaterThan($withoutEither, $withoutPiecesInfo);
    }

    // Requested Flight/Date renders one segment per leg as "<carrier><flight> /
    // <ddMMM>". The second and third legs were previously unreachable because the
    // controller never selected flight_2/date_2/flight_3/date_3.
    public function test_hawb_pdf_renders_every_requested_flight_leg()
    {
        $hawbId = $this->seedHawb();

        HousewayBills::where('id', $hawbId)->update([
            'flight_2' => '200', 'date_2' => '2026-08-01 22:15:00',
            'flight_3' => '300', 'date_3' => '2026-08-02 06:40:00',
        ]);

        $text = $this->pdfText($this->get("/download-hawb-pdf/{$hawbId}")->getContent());

        $this->assertStringContainsString('AA100 / 15JUL', $text);
        $this->assertStringContainsString('BA200 / 01AUG', $text);
        $this->assertStringContainsString('CA300 / 02AUG', $text);
    }

    // With no second or third flight, those segments stay blank rather than
    // printing a stray carrier code and slash.
    public function test_hawb_pdf_leaves_unused_flight_legs_blank()
    {
        $hawbId = $this->seedHawb();

        $text = $this->pdfText($this->get("/download-hawb-pdf/{$hawbId}")->getContent());

        $this->assertStringContainsString('AA100 / 15JUL', $text);
        $this->assertStringNotContainsString('BA /', $text);
        $this->assertStringNotContainsString('CA /', $text);
    }

    // DomPDF compresses page content, so assertions on rendered text need the
    // stream inflated rather than matched against the raw PDF bytes.
    private function pdfText(string $pdf): string
    {
        $text = '';
        if (preg_match_all('/stream\r?\n(.*?)\r?\nendstream/s', $pdf, $matches)) {
            foreach ($matches[1] as $stream) {
                $text .= @gzuncompress($stream) ?: '';
            }
        }

        return $text;
    }
}
