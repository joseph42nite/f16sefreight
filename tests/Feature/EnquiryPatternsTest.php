<?php

namespace Tests\Feature;

use App\Agent;
use App\Company;
use App\EmailMessage;
use App\Services\RegexClassificationService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

/**
 * The customer-enquiry patterns, learnt from the first real inbox (joseph@f16sefreight.com, 2026-09-17). Each sample
 * is a real mail or a phrase the user named; the negatives are real mails in that inbox that are NOT enquiries.
 */
class EnquiryPatternsTest extends TestCase
{
    use DatabaseTransactions;

    private Agent $branch;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::create(['name' => 'Pattern Co', 'code' => 'PTN', 'tier' => 'tactical']);
        $this->branch = Agent::create(['company_id' => $company->id, 'agent_name' => 'BOM', 'branch_code' => 'BOM']);
    }

    private function filed(string $subject, string $body): string
    {
        return app(RegexClassificationService::class)->classify(new EmailMessage([
            'agent_id' => $this->branch->id, 'direction' => 'inbound', 'from' => 'someone@unknown-ptn.test',
            'subject' => $subject, 'body_snippet' => $body, 'is_historical' => false,
        ]), 'air')['classification'];
    }

    public function test_a_request_for_a_quote_or_rate_is_an_enquiry(): void
    {
        foreach ([
            'Can you please quote for 2 shipments next week',
            'Please quote the best rate',
            'Kindly share your best rates',
            'Give the best rate for this',
            'Requesting quotation for :',
            'Request for quote',
            'Could you share your rates to Dubai',
            'Need rates for this lane',
            'Rate request',
            'Please share the confirmed booking schedule',
        ] as $body) {
            $this->assertSame('customer_enquiry', $this->filed('Hello', $body), $body);
        }

        $this->assertSame('customer_enquiry', $this->filed('BLR JFK AC Booking RFQ', 'Dear Sir,'), 'RFQ in the subject');
    }

    public function test_the_figures_forwarders_write_are_read(): void
    {
        $cargo = app(RegexClassificationService::class)->extractCargo(
            "hi,\n\nRequesting quotation for :\n\nBLR-ORD\nPCS : 21\nWEIGHT : 300 kgs\nDimensions : 60 x 30 x20\nGeneral cargo", 'air');

        $this->assertSame([21, 300.0, 'high', '60 x 30 x 20'], [$cargo['pieces']['value'], $cargo['gross_weight']['value'],
            $cargo['gross_weight']['confidence'], $cargo['dimensions']['value']]);

        $cargo = app(RegexClassificationService::class)->extractCargo(
            "Agreed rate 350++\nPcs 400\nGross wgt 17400kgs\nCh wt 18000 kgs\nDims 40x30x30 cms", 'air');

        $this->assertSame([400, 17400.0, 18000.0, '40 x 30 x 30 cms'], [$cargo['pieces']['value'], $cargo['gross_weight']['value'],
            $cargo['chargeable_weight']['value'], $cargo['dimensions']['value']]);
    }

    public function test_real_mails_that_are_not_enquiries_stay_other(): void
    {
        foreach ([
            ['Commercial Quotation – Focus Air By F16s | MG Logistics', 'As discussed, please find below the commercial quotation for Focus Air, the web-based air freight platform'],
            ['Re: E-AWB Compliance with F16s E-freight Solutions Proposal', 'Thank you for your response. Please find the clarifications and our best commercial offer below.'],
            ['Rate your support experience - SR-6987568: FNA received', 'Your feedback matters! Please take a moment to rate your recent support experience.'],
            ['FNA 607-53138691', 'Please note below FNA received. 607-53138691 / SKYLINK FREIGHT FORWARDERS LTD / 0 HAWB / BOM / Mumbai / TLV / Tel Aviv Yafo / 1 / 12.6 KGM'],
            ['Re: AWB NO:176-28955006', 'FWB/FHL processed successfully. Sl / AWB Number / Client / HAWB Count / Origin / Destination / Pcs / Weight / Time & Date Sent'],
            ['Your Lusha Account Will Close in 30 Days', 'Your Lusha account is scheduled for closure in 30 days due to inactivity.'],
        ] as [$subject, $body]) {
            $this->assertSame('other', $this->filed($subject, $body), $subject);
        }
    }
}
