<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\HousewayBills; // Import the model
use App\PaymentInfo; // Import the model
use App\ConsignmentData; // Import the model
use App\Agent; // Import the model
use App\OtherCharge; // Import the model
use App\WayBillAddress;
use Illuminate\Support\Facades\App;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateHawbPdfController extends Controller
{
    public function downloadHawbPdf($hawb_id = '123456789') {

        $houseWayBill = HouseWayBills::join('payment_info', 'house_way_bills.id', '=', 'payment_info.awb_id')
            ->join('way_bill_addresses', 'house_way_bills.id', '=', 'way_bill_addresses.awb_id')
            ->join('way_bill_consignment_data', 'house_way_bills.id', '=', 'way_bill_consignment_data.awb_id')
            ->join('way_bill_custom_info', 'house_way_bills.id', '=', 'way_bill_custom_info.awb_id')
            ->join('agents_info', 'house_way_bills.agent_id', '=', 'agents_info.id')
            ->where('house_way_bills.id', $hawb_id)
            ->select(
                // returning id of each table with different name 
                'house_way_bills.id as house_way_bills_id', 
                'payment_info.id as payment_info_id', 
                'way_bill_addresses.id as way_bill_addresses_id', 
                'way_bill_consignment_data.id as way_bill_consignment_data_id',
                'way_bill_custom_info.id as way_bill_custom_info_id', 
                'agents_info.id as agents_info_id',
                // returning all column of each table 
                'house_way_bills.*', 
                'payment_info.*', 
                'way_bill_addresses.*', 
                'way_bill_consignment_data.*', 
                'way_bill_custom_info.*', 
                'agents_info.*'
            )
            ->first();
            if ($houseWayBill) {
                // Now, fetch the other_charges_code rows separately
                $otherChargesRow = OtherCharge::where('awb_id', $hawb_id)->get();
                // Attach this data to the houseWayBill result (if needed)
                $houseWayBill->other_charges = $otherChargesRow;
            }
        
            // dd($houseWayBill);
        $pdf = Pdf::loadView('generate-hawb-pdf', compact('houseWayBill'))->setPaper('a4', 'portrait')->set_option('isHtml5ParserEnabled', true);
        return $pdf->stream();
    }
}
