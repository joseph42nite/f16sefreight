<?php

namespace App\Http\Controllers;

use App\HousewayBills; // Import the model
use App\AirwayBills; // Import the model
use App\PaymentInfo; // Import the model
use App\ConsignmentData; // Import the model
use App\Agent; // Import the model
use App\OtherCharge; // Import the model
use App\WayBillAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateConsolidationPdfController extends Controller
{
    public function downloadConsolidationPdf($awb_code = 123, $awbId = '12345678')
    {
        $airWayBill = AirWayBills::where('awb_code', $awb_code)
            ->where('awb_no', $awbId)
            ->first();

            if($airWayBill)
            {
                $awb_code = $airWayBill->awb_code;
                $awb_no = $airWayBill->awb_no;
                $awb_id = $airWayBill->awb_code.''.$airWayBill->awb_no;
                $agent_id = $airWayBill->agent_id;
                
                // Query definition here
                $houseWayBills = HouseWayBills::where('awb_code', $awb_code)
                    ->where('awb_no', $awb_no)
                    ->get();

                $agentInfo = Agent::where('id', $agent_id)
                    ->first();
                
                $wayBillAddress = WayBillAddress::where('awb_id', $awb_id)
                ->first();

                $wayBillConsignmentData = ConsignmentData::where('awb_id', $awb_id)
                ->first();

                $paymentInfo = PaymentInfo::where('awb_id', $awb_id)
                ->first();

                $pdf = Pdf::loadView('generate-Consolidation-pdf', compact('airWayBill', 'houseWayBills', 'agentInfo', 'wayBillAddress', 'wayBillConsignmentData', 'paymentInfo'))->setPaper('a4', 'portrait')->set_option('isHtml5ParserEnabled', true);
                return $pdf->stream();
            }
    
    }
}
