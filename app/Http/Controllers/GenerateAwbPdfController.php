<?php

namespace App\Http\Controllers;

use App\AirwayBills; // Import the model
use App\PaymentInfo; // Import the model
use App\ConsignmentData; // Import the model
use App\Agent; // Import the model
use App\Airline;
use App\OtherCharge; // Import the model
use App\GeneratePdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateAwbPdfController extends Controller
{
    // This Function will work when user click on generate PDF file
    public function downloadPdf($id) {

        // Fetch the AirWayBill along with related data
       $airWayBill = AirWayBills::with(['paymentInfo', 'wayBillAddress', 'consignmentData', 'otherCustomInformation', 'agentsInfo', 'otherCharge'])
            ->where('id', $id)
            ->first();
            $prefix = substr($airWayBill->awb_code, 0, 3);
            $airline = Airline::where('prefix', $prefix)->whereNotNull('airline_address')->first();
            $airlineAddress = $airline ? $airline->airline_address : '';
            // dd($airWayBill);die;
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
        
        // Create a variable with true value to show or hide back page.
        $showBothPage = true;
        $pdf = Pdf::loadView('./pdf/generate-awb-pdf', compact('airWayBill', 'specialHandlingInfo', 'hsCode', 'showBothPage','airlineAddress'))->setPaper('a4', 'portrait')->set_option('isHtml5ParserEnabled', true);
        return $pdf->stream();
    }
    
    public function downloadMultipleAwbPdf($id) {

        // Fetch the AirWayBill along with related data
        $airWayBill = AirWayBills::with(['paymentInfo', 'wayBillAddress', 'consignmentData', 'otherCustomInformation', 'agentsInfo', 'otherCharge'])
            ->where('id', $id)
            ->first();
            $prefix = substr($airWayBill->awb_code, 0, 3);
            $airline = Airline::where('prefix', $prefix)->whereNotNull('airline_address')->first();
            $airlineAddress = $airline ? $airline->airline_address : '';
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

            // Create an array of pages to render (same content repeated times)
            $pages = ['ORIGINAL-1', 'ORIGINAL-2', 'ORIGINAL-3', 'COPY-4', 'COPY-5', 'COPY-6', 'COPY-7', 'COPY-8', 'EXTRA-COPY-1', 'EXTRA-COPY-2', 'EXTRA-COPY-3'];
            $renderedPages = [];

            foreach ($pages as $page) {
                $renderedPages[] = view('./pdf/generate-awb-pdf', compact('airWayBill', 'specialHandlingInfo', 'airlineAddress', 'hsCode', 'page'))->render();
            }
            
            // Join all pages together
            $pdfContent = implode('', $renderedPages);

            // Generate the final PDF with the repeated content
            $pdf = Pdf::loadHTML($pdfContent)
                ->setPaper('a4', 'portrait')
                ->set_option('isHtml5ParserEnabled', true);

            // Stream the PDF
            return $pdf->stream("awb_{$id}_multiple.pdf");
    }

    // This function will work when user click on Generate Multiple PDF file with back page
    public function downloadMultipleWithBackAwbPdf($id) {

        // Fetch the AirWayBill along with related data
        $airWayBill = AirWayBills::with(['paymentInfo', 'wayBillAddress', 'consignmentData', 'otherCustomInformation', 'agentsInfo', 'otherCharge'])
            ->where('id', $id)
            ->first();
            $prefix = substr($airWayBill->awb_code, 0, 3);
            $airline = Airline::where('prefix', $prefix)->whereNotNull('airline_address')->first();
            $airlineAddress = $airline ? $airline->airline_address : '';
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

            // Create an array of pages to render (same content repeated times)
            $pages = ['ORIGINAL-1', 'ORIGINAL-2', 'ORIGINAL-3', 'COPY-4', 'COPY-5', 'COPY-6', 'COPY-7', 'COPY-8', 'EXTRA-COPY-1', 'EXTRA-COPY-2', 'EXTRA-COPY-3'];
            $renderedPages = [];

            // Create a variable with true value to show or hide back page.
            $showBothPage = true;

            foreach ($pages as $page) {
                $renderedPages[] = view('./pdf/generate-awb-pdf', compact('airWayBill', 'specialHandlingInfo', 'airlineAddress', 'hsCode', 'page', 'showBothPage'))->render();
            }
            
            // Join all pages together
            $pdfContent = implode('', $renderedPages);

            // Generate the final PDF with the repeated content
            $pdf = Pdf::loadHTML($pdfContent)
                ->setPaper('a4', 'portrait')
                ->set_option('isHtml5ParserEnabled', true);

            // Stream the PDF
            return $pdf->stream("awb_{$id}_multiple.pdf");
    }
}

