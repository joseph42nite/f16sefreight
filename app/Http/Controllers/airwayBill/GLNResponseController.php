<?php

namespace App\Http\Controllers\airwayBill;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\StatusReponse;

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

    public function store(Request $request)
    {
        $xmlContent = $request->getContent();
        $xml = simplexml_load_string($xmlContent, "SimpleXMLElement", LIBXML_NOCDATA);
        $xml->registerXPathNamespace('rsm', 'iata:response:3');
        $xml->registerXPathNamespace('ram', 'iata:datamodel:3');
        $data = [
            'message_id' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:ID')[0] ?? null),
            'type_code' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:TypeCode')[0] ?? null),
            'issue_date_time' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:IssueDateTime')[0] ?? null),
            'conversation_id' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:ConversationID')[0] ?? null),
            'primary_id' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:SenderParty/ram:PrimaryID')[0] ?? null),
            'business_id' => (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:ID')[0] ?? null),
            'business_name' => (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:Name')[0] ?? null),
            'business_type_code' => (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:TypeCode')[0] ?? null),
            'business_status_code' => (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:StatusCode')[0] ?? null),
        ];
        StatusReponse::create($data);
        $filePath = storage_path('logs/gln_responses.txt');
        file_put_contents($filePath, '================='.$xmlContent, FILE_APPEND);
        return response()->json(['status' => true], 200);
    }
}