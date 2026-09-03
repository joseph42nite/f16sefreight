<?php

namespace App\Http\Controllers\Generators;

use App\Http\Controllers\Controller;

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
    private const MULTIPLE_PDF_PAGES = ['ORIGINAL-1', 'ORIGINAL-2', 'ORIGINAL-3', 'COPY-4', 'COPY-5', 'COPY-6', 'COPY-7', 'COPY-8', 'EXTRA-COPY-1', 'EXTRA-COPY-2', 'EXTRA-COPY-3'];

    // Fetch the AirWayBill along with related data and parse the fields
    // shared by every PDF variant (special handling info, HS code, airline address).
    private function loadAwbPdfData($id)
    {
        $airWayBill = AirWayBills::with(['paymentInfo', 'wayBillAddress', 'consignmentData', 'otherCustomInformation', 'agentsInfo', 'otherCharge'])->where('id', $id)->first();
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

        return compact('airWayBill', 'specialHandlingInfo', 'hsCode', 'airlineAddress');
    }

    // Renders one copy of the AWB view per entry in self::MULTIPLE_PDF_PAGES
    // and joins them into a single HTML document for DomPDF.
    private function renderMultipleAwbPages($id, bool $showBothPage)
    {
        ['airWayBill' => $airWayBill, 'specialHandlingInfo' => $specialHandlingInfo, 'hsCode' => $hsCode, 'airlineAddress' => $airlineAddress] = $this->loadAwbPdfData($id);

        $renderedPages = [];
        foreach (self::MULTIPLE_PDF_PAGES as $page) {
            $renderedPages[] = view('documents.generate-awb-pdf', compact('airWayBill', 'specialHandlingInfo', 'airlineAddress', 'hsCode', 'page', 'showBothPage'))->render();
        }

        return implode('', $renderedPages);
    }

    /**
     * Render the waybill, STORE it, and record it as a job document.
     *
     * 🔴 **A streamed PDF cannot be shared.** `downloadPdf()` builds the document and sends
     * it straight to the browser, so nothing persists — which is why `job_documents` was
     * empty and the share links had nothing to point at. A client link must resolve to a
     * file that still exists next week, not to a render that happened once.
     *
     * ⚠️ **Only on request, never on every download.** Persisting each preview would fill
     * storage with near-identical copies of a document somebody merely glanced at. This
     * runs when an operator asks to share.
     *
     * ⚠️ Re-publishing REPLACES the stored file and reuses the row, so an existing share
     * link keeps working and serves the corrected document. A second row would leave the
     * client holding a link to the version that was wrong.
     */
    public function publish($id, \App\Services\AuditLogger $audit): \Illuminate\Http\JsonResponse
    {
        $waybill = \App\AirwayBills::find($id);

        if ($waybill === null) {
            return response()->json(['error' => 'Waybill not found.'], 404);
        }

        $context = \App\Support\UserContext::for(auth()->user());

        // 🔒 The waybill must belong to the acting branch. Without this, a waybill id is
        // enough to publish another tenant's document and mint a public link to it.
        if ((int) $waybill->agent_id !== (int) $context->agentId) {
            return response()->json(['error' => 'Waybill not found.'], 404);
        }

        // 🔗 The document hangs off the JOB, and the link between them is only there
        // because AwbJobLinker made it (GAPS #39). An unlinked waybill cannot be filed
        // against a shipment, and saying so beats writing an orphan row.
        if ($waybill->job_id === null) {
            return response()->json([
                'error'  => 'This waybill is not linked to a job yet, so there is nothing to file the document against.',
                'reason' => 'no_job',
            ], 422);
        }

        ['airWayBill' => $airWayBill, 'specialHandlingInfo' => $specialHandlingInfo,
         'hsCode' => $hsCode, 'airlineAddress' => $airlineAddress] = $this->loadAwbPdfData($id);

        $showBothPage = true;

        $pdf = Pdf::loadView('documents.generate-awb-pdf',
            compact('airWayBill', 'specialHandlingInfo', 'hsCode', 'showBothPage', 'airlineAddress'))
            ->setPaper('a4', 'portrait')
            ->set_option('isHtml5ParserEnabled', true);

        $fileName = 'AWB-' . \App\Support\AwbNumber::normalise((string) $waybill->awb_code . $waybill->awb_no) . '.pdf';
        $path = 'documents/awb/' . $id . '.pdf';

        \Illuminate\Support\Facades\Storage::put($path, $pdf->output());

        $document = \App\JobDocument::updateOrCreate(
            ['job_id' => $waybill->job_id, 'document_type' => 'awb'],
            [
                'agent_id'    => $waybill->agent_id,
                'file_name'   => $fileName,
                'file_path'   => $path,
                'mime_type'   => 'application/pdf',
                'file_size'   => \Illuminate\Support\Facades\Storage::size($path),
                'uploaded_by' => auth()->id(),
            ]
        );

        $audit->record((int) $waybill->agent_id, 'document.published', 'job_document',
            $document->id, auth()->id());

        return response()->json([
            'document_id' => $document->id,
            'file_name'   => $document->file_name,
        ], 201);
    }

    // This Function will work when user click on generate PDF file
    public function downloadPdf($id) {
        ['airWayBill' => $airWayBill, 'specialHandlingInfo' => $specialHandlingInfo, 'hsCode' => $hsCode, 'airlineAddress' => $airlineAddress] = $this->loadAwbPdfData($id);

        // Create a variable with true value to show or hide back page.
        $showBothPage = true;
        $pdf = Pdf::loadView('documents.generate-awb-pdf', compact('airWayBill', 'specialHandlingInfo', 'hsCode', 'showBothPage','airlineAddress'))->setPaper('a4', 'portrait')->set_option('isHtml5ParserEnabled', true);
        return $pdf->stream();
    }

    public function downloadMultipleAwbPdf($id) {
        ini_set('memory_limit', '512M');
        set_time_limit(300);
        $pdfContent = $this->renderMultipleAwbPages($id, false);

        $pdf = Pdf::loadHTML($pdfContent)
            ->setPaper('a4', 'portrait')
            ->set_option('isHtml5ParserEnabled', true);

        return $pdf->stream("awb_{$id}_multiple.pdf");
    }

    // This function will work when user click on Generate Multiple PDF file with back page
    public function downloadMultipleWithBackAwbPdf($id) {
        ini_set('memory_limit', '512M');
        set_time_limit(300);
        $pdfContent = $this->renderMultipleAwbPages($id, true);

        $pdf = Pdf::loadHTML($pdfContent)
            ->setPaper('a4', 'portrait')
            ->set_option('isHtml5ParserEnabled', true);

        return $pdf->stream("awb_{$id}_multiple.pdf");
    }
}
