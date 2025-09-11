<?php

namespace App\Http\Controllers\airwayBill;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GLNResponseController extends Controller
{
    public function handle(Request $request)
    {
        $rawBody = $request->getContent();

        // Path to your text file
        $filePath = storage_path('logs/gln_responses.txt');

        // Start building log entry
        $logText = "============================\n";
        $logText .= "GLN Callback Received\n";
        $logText .= "Time: " . now()->toDateTimeString() . "\n";

        // Detect if XML or JSON
        if (str_contains($request->header('content-type'), 'xml')) {
            $xml = simplexml_load_string($rawBody);

            $tid = (string) $xml->tid;
            $error = (string) $xml->error;
            $errorShort = (string) $xml->errorShort;
            $errorDetail = (string) $xml->errorDetail;
            $retryAfter = (string) $xml->retryAfter;
            $processingLog = isset($xml->processingLog) ? $xml->processingLog->asXML() : null;

            $logText .= "TID: $tid\n";
            $logText .= "Error: $error\n";
            $logText .= "Error Short: $errorShort\n";
            $logText .= "Error Detail: $errorDetail\n";
            $logText .= "Retry After: $retryAfter\n";
            $logText .= "Processing Log: $processingLog\n";
        } else {
            $json = $request->json()->all();
            $logText .= "JSON Response: " . json_encode($json, JSON_PRETTY_PRINT) . "\n";
        }

        $logText .= "Raw Body:\n" . $rawBody . "\n";
        $logText .= "============================\n\n";

        // Append log entry to file
        file_put_contents($filePath, $logText, FILE_APPEND);

        return response()->json(['status' => 'ok'], 200);
    }

}