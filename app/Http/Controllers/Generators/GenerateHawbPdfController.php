<?php

namespace App\Http\Controllers\Generators;

use App\Http\Controllers\Controller;

use App\HousewayBills; // Import the model
use App\OtherCustomInformation; // Import the model
use App\OtherCharge; // Import the model
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class GenerateHawbPdfController extends Controller
{
    private const MULTIPLE_PDF_PAGES = ['ORIGINAL-1', 'ORIGINAL-2', 'ORIGINAL-3', 'COPY-4', 'COPY-5', 'COPY-6', 'COPY-7', 'COPY-8', 'EXTRA-COPY-1', 'EXTRA-COPY-2', 'EXTRA-COPY-3'];

    // The full column projection shared by all three PDF variants (identical in
    // every method pre-refactor). The join set differs per method, so only the
    // select list + post-fetch handling are shared here.
    private function hawbPdfSelectColumns(): array
    {
        return [
            'house_way_bills.id as house_way_bills_id',
            'house_way_bills.awb_code as awb_code',
            'house_way_bills.awb_no as awb_no',
            'house_way_bills.departure_airport as departure_airport',
            'house_way_bills.destination_airport as destination_airport',
            'house_way_bills.to as to',
            'house_way_bills.to_2 as to_2',
            'house_way_bills.to as to_3',
            'house_way_bills.by as by',
            'house_way_bills.by_2 as by_2',
            'house_way_bills.by_3 as by_3',
            'house_way_bills.flight as flight',
            'house_way_bills.flight_2 as flight_2',
            'house_way_bills.flight_3 as flight_3',
            'house_way_bills.date as date',
            'house_way_bills.date_2 as date_2',
            'house_way_bills.date_3 as date_3',
            'house_way_bills.special_handling_info as special_handling_info',
            'house_way_bills.total_amount as total_amount',
            'house_way_bills.as_agreed as as_agreed',
            'house_way_bills.other_service_information as other_service_information',
            'house_way_bills.special_service_request as special_service_request',
            'house_way_bills.extra_print as extra_print',
            'house_way_bills.shipment_ref_no as shipment_ref_no',
            'house_way_bills.supplementary_shipment_info as supplementary_shipment_info',
            'house_way_bills.accounting_information as accounting_information',
            'house_way_bills.total_volume as total_volume',
            'house_way_bills.dimention_unit as dimention_unit',
            'house_way_bills.customs_origin_code as customs_origin_code',
            'house_way_bills.ho_name as ho_name',
            'house_way_bills.ho_address as ho_address',
            'house_way_bills.ho_city as ho_city',
            'house_way_bills.ho_pincode as ho_pincode',
            'house_way_bills.ho_state as ho_state',
            'house_way_bills.ho_country as ho_country',
            'payment_info.id as payment_info_id',
            'payment_info.currency as currency',
            'payment_info.type_of_payment as type_of_payment',
            'payment_info.taxes as taxes',
            'payment_info.weight_charge as weight_charge',
            'payment_info.declear_value_carriage as declear_value_carriage',
            'payment_info.declear_value_customs as declear_value_customs',
            'payment_info.declear_value_insurance as declear_value_insurance',
            'payment_info.total_charges_prepaid as total_charges_prepaid',
            'payment_info.total_charges_collect as total_charges_collect',
            'payment_info.other_charges_due_agent_prepaid as other_charges_due_agent_prepaid',
            'payment_info.other_charges_due_agent_collect as other_charges_due_agent_collect',
            'payment_info.other_charges_due_carrier_prepaid as other_charges_due_carrier_prepaid',
            'payment_info.other_charges_due_carrier_collect as other_charges_due_carrier_collect',
            'way_bill_addresses.id as way_bill_addresses_id',
            'way_bill_addresses.ship_name as ship_name',
            'way_bill_addresses.ship_name_2 as ship_name_2',
            'way_bill_addresses.ship_address as ship_address',
            'way_bill_addresses.ship_address_line_2 as ship_address_line_2',
            'way_bill_addresses.ship_city as ship_city',
            'way_bill_addresses.ship_state as ship_state',
            'way_bill_addresses.ship_post_code as ship_post_code',
            'way_bill_addresses.ship_phone as ship_phone',
            'way_bill_addresses.ship_fax as ship_fax',
            'way_bill_addresses.ship_telex as ship_telex',
            'way_bill_addresses.ship_account as ship_account',
            'way_bill_addresses.cons_name as cons_name',
            'way_bill_addresses.cons_name_2 as cons_name_2',
            'way_bill_addresses.cons_address as cons_address',
            'way_bill_addresses.cons_address_line_2 as cons_address_line_2',
            'way_bill_addresses.cons_account as cons_account',
            'way_bill_addresses.cons_city as cons_city',
            'way_bill_addresses.cons_state as cons_state',
            'way_bill_addresses.cons_post_code as cons_post_code',
            'way_bill_addresses.cons_phone as cons_phone',
            'way_bill_addresses.cons_fax as cons_fax',
            'way_bill_addresses.cons_telex as cons_telex',
            'way_bill_consignment_data.pieces as pieces',
            'way_bill_consignment_data.description as description',
            'way_bill_consignment_data.rate_class as rate_class',
            'way_bill_consignment_data.service_code as service_code',
            'way_bill_consignment_data.hs_code as hs_code',
            'way_bill_consignment_data.gross_weight as gross_weight',
            'way_bill_consignment_data.chargable_weight as chargable_weight',
            'way_bill_consignment_data.rate as rate',
            'way_bill_consignment_data.pieces_info as pieces_info',
            'agents_info.id as agents_info_id',
            'agents_info.agent_name as agent_name',
            'agents_info.agent_city as agent_city',
            'agents_info.agent_pincode as agent_pincode',
            'agents_info.agent_address as agent_address',
            'agents_info.agent_account as agent_account',
            'agents_info.iata_agent_code as iata_agent_code',
            'agents_info.iata_agent_cass as iata_agent_cass',
            'agents_info.agent_issue_sign as agent_issue_sign',
            'agents_info.agent_issue_date as agent_issue_date',
            'agents_info.agent_issue_loc_code as agent_issue_loc_code',
            'airlines.airline_address as airline_address',
        ];
    }

    // Attaches the separately-queried other-charges and custom-information rows
    // onto the fetched house waybill, exactly as each method did inline.
    private function attachHawbRelatedData($houseWayBill, $hawb_id): void
    {
        $houseWayBill->otherCustomInformation = OtherCustomInformation::where('awb_id', $hawb_id)
            ->select('country_code', 'info_identifier', 'custom_info_identifier', 'supplementary_info')
            ->get();
        $houseWayBill->other_charges = OtherCharge::where('awb_id', $hawb_id)
            ->select('other_charge_code', 'amount', 'due')
            ->get();
    }

    // Renders one copy of the HAWB view per page label and joins them for DomPDF.
    // showBothPage is only *passed* for the with-back variant — the blade checks
    // isset($showBothPage), so it must stay absent (not false) otherwise.
    private function renderHawbMultiplePages($houseWayBill, bool $showBothPage): string
    {
        $renderedPages = [];
        foreach (self::MULTIPLE_PDF_PAGES as $page) {
            $data = compact('houseWayBill', 'page');
            if ($showBothPage) {
                $data['showBothPage'] = true;
            }
            $renderedPages[] = view('documents.generate-hawb-pdf', $data)->render();
        }
        return implode('', $renderedPages);
    }

    public function downloadHawbPdf($hawb_id) {
        $houseWayBill = HouseWayBills::leftJoin('payment_info', 'house_way_bills.id', '=', 'payment_info.awb_id')
            ->leftJoin('way_bill_addresses', 'house_way_bills.id', '=', 'way_bill_addresses.awb_id')
            ->leftJoin('way_bill_consignment_data', 'house_way_bills.id', '=', 'way_bill_consignment_data.awb_id')
            ->leftJoin('way_bill_custom_info', 'house_way_bills.id', '=', 'way_bill_custom_info.awb_id')
            ->leftJoin('agents_info', 'house_way_bills.agent_id', '=', 'agents_info.id')
            ->leftJoin('airlines', function($join) {
                $join->on('airlines.prefix', '=', DB::raw('SUBSTRING(house_way_bills.awb_code, 1, LENGTH(airlines.prefix))'));
            })
            ->where('house_way_bills.id', $hawb_id)
            ->select($this->hawbPdfSelectColumns())
            ->first();
        if ($houseWayBill) {
            $this->attachHawbRelatedData($houseWayBill, $hawb_id);
            // Create a variable with true value to show or hide back page.
            $showBothPage = true;
            $pdf = Pdf::loadView('documents.generate-hawb-pdf', compact('houseWayBill', 'showBothPage'))->setPaper('a4', 'portrait')->set_option('isHtml5ParserEnabled', true);
            return $pdf->stream();
        }
    }

    public function downloadMultipleHawbPdf($hawb_id) {
        ini_set('memory_limit', '512M');
        set_time_limit(300);
        $houseWayBill = $this->loadHawbForMultiple($hawb_id);
        if ($houseWayBill) {
            $this->attachHawbRelatedData($houseWayBill, $hawb_id);
            $pdfContent = $this->renderHawbMultiplePages($houseWayBill, false);
            $pdf = Pdf::loadHTML($pdfContent)
                ->setPaper('a4', 'portrait')
                ->set_option('isHtml5ParserEnabled', true);
            return $pdf->stream("hawb_{$hawb_id}_multiple.pdf");
        }
    }

    // This function will work when user click on Generate Multiple PDF file with back page
    public function downloadMultipleWithBackHawbPdf($hawb_id) {
        ini_set('memory_limit', '512M');
        set_time_limit(300);
        $houseWayBill = $this->loadHawbForMultiple($hawb_id);
        if ($houseWayBill) {
            $this->attachHawbRelatedData($houseWayBill, $hawb_id);
            $pdfContent = $this->renderHawbMultiplePages($houseWayBill, true);
            $pdf = Pdf::loadHTML($pdfContent)
                ->setPaper('a4', 'portrait')
                ->set_option('isHtml5ParserEnabled', true);
            return $pdf->stream("hawb_{$hawb_id}_multiple.pdf");
        }
    }

    // Shared query for the two "multiple" variants: inner joins (a HAWB only
    // renders here when payment/address/consignment/agent rows all exist) plus a
    // left join for the optional airline address. Note this deliberately differs
    // from downloadHawbPdf(), which left-joins everything.
    private function loadHawbForMultiple($hawb_id)
    {
        return HouseWayBills::join('payment_info', 'house_way_bills.id', '=', 'payment_info.awb_id')
            ->join('way_bill_addresses', 'house_way_bills.id', '=', 'way_bill_addresses.awb_id')
            ->join('way_bill_consignment_data', 'house_way_bills.id', '=', 'way_bill_consignment_data.awb_id')
            ->join('agents_info', 'house_way_bills.agent_id', '=', 'agents_info.id')
            ->leftJoin('airlines', function($join) {
                $join->on('airlines.prefix', '=', DB::raw('SUBSTRING(house_way_bills.awb_code, 1, LENGTH(airlines.prefix))'));
            })
            ->where('house_way_bills.id', $hawb_id)
            ->select($this->hawbPdfSelectColumns())
            ->first();
    }
}
