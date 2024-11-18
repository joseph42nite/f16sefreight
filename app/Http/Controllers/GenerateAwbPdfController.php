<?php

namespace App\Http\Controllers;

use App\AirwayBills; // Import the model
use App\PaymentInfo; // Import the model
use App\ConsignmentData; // Import the model
use App\Agent; // Import the model
use App\OtherCharge; // Import the model
use App\GeneratePdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateAwbPdfController extends Controller
{
    public function downloadPdf($id)
    {
        // Fetch the AirWayBill along with related data
       $airWayBill = AirWayBills::with(['paymentInfo', 'wayBillAddress', 'consignmentData', 'customInfo' => function ($query) {
        $query->select('awb_id'); // Specify limited columns
    }, 'agentsInfo', 'otherCharge'])
            ->where('id', $id)
            ->first();
            
            $specialHandlingInfo = '';
            if ($airWayBill && !empty($airWayBill->special_handling_info)) {
                $decodedInfo = json_decode($airWayBill->special_handling_info, true);
                if (is_array($decodedInfo)) {
                    $specialHandlingInfo = implode(' ', $decodedInfo);
                }
            }
            // getting HS Code array
            $hsCode = '';
            if ($airWayBill && !empty($airWayBill->consignmentData->hs_code)) {
                $decodedInfo = json_decode($airWayBill->consignmentData->hs_code, true);
                if (is_array($decodedInfo)) {
                    $hsCode = implode(' ', $decodedInfo);
                }
            }   

        $pdf = Pdf::loadView('./pdf/generate-awb-pdf', compact('airWayBill', 'specialHandlingInfo', 'hsCode'))->setPaper('a4', 'portrait')->set_option('isHtml5ParserEnabled', true);
        return $pdf->stream();
    
    }
}

