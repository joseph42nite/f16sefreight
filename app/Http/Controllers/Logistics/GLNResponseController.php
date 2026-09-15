<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\StatusReponse;
use App\AirwayBills;
use Mail;

class GLNResponseController extends Controller
{
    public function store(Request $request)
    {
        $xmlContent = $request->getContent();
        $xml = simplexml_load_string($xmlContent, "SimpleXMLElement", LIBXML_NOCDATA);
        $xml->registerXPathNamespace('rsm', 'iata:response:3');
        $xml->registerXPathNamespace('ram', 'iata:datamodel:3');
        $message_type = (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:Name')[0] ?? null);
        if ($message_type == 'Cargo Status') {
            $business_id = (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:ID')[0] ?? null);
            $business_status_code = 'Cargo Status';
            $condition_code = substr($business_id, -3);
            $cargo_status_description = config('common-data.cargo_status_description');
            $reason = $cargo_status_description[$condition_code] ?? '';
            $business_id = substr($business_id, 0, -3);
        } else {
            $business_id = (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:ID')[0] ?? null);
            $business_status_code = (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:StatusCode')[0] ?? null);
            $condition_code = (string) ($xml->xpath('//rsm:ResponseStatus/ram:ConditionCode')[0] ?? null);
            
            $reasons = [];
            foreach ($xml->xpath('//rsm:ResponseStatus/ram:Reason') as $r) {
                $reasons[] = trim((string) $r);
            }
            $reasons = array_filter(array_unique($reasons));
            $reason = implode("\n", $reasons);
        }
        $data = [
            'message_id' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:ID')[0] ?? null),
            'type_code' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:TypeCode')[0] ?? null),
            'issue_date_time' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:IssueDateTime')[0] ?? null),
            'conversation_id' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:ConversationID')[0] ?? null),
            'primary_id' => (string) ($xml->xpath('//rsm:MessageHeaderDocument/ram:SenderParty/ram:PrimaryID')[0] ?? null),
            'business_id' => $business_id,
            'business_name' => (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:Name')[0] ?? null),
            'business_type_code' => (string) ($xml->xpath('//rsm:BusinessHeaderDocument/ram:TypeCode')[0] ?? null),
            'business_status_code' => $business_status_code,
            'condition_code' => $condition_code,
            'reason' => $reason,
        ];
        StatusReponse::create($data);
        if ($message_type == 'Cargo Status') {
            $this->prepareClientUpdate($business_id, $condition_code);
        }
        try {
            if ($business_status_code == 'Rejected' && $data['business_name'] == 'Air Waybill') {
                $business_id_arr = explode('-', $business_id);
                $way_bill_data = AirwayBills::where('awb_code', $business_id_arr[0])->where('awb_no', $business_id_arr[1])->first(['awb_no', 'awb_code', 'awb_email', 'departure_airport', 'destination_airport', 'total_volume', 'dimention_unit'])->toArray();
                $send_to = $way_bill_data['awb_email'];
                if (!empty($send_to)) {
                    $way_bill_data['status'] = $business_status_code;
                    $way_bill_data['reason'] = $reason;
                    $way_bill_data['date_time'] = date("d M Y h:i A");
                    $subject = "$business_id - {$way_bill_data['destination_airport']} - Rejection Notification (FNA Received)";
                    Mail::send('emails.awb-reject-status', $way_bill_data, function ($message) use ($send_to, $subject) {
                        $message->to($send_to)
                            ->subject($subject);
                    });
                }
            }
        } catch (\Exception $e) {
            Log::error('GLNResponseController: failed to process GLN response', [
                'error' => $e->getMessage(),
            ]);
        }
        // $filePath = storage_path('logs/gln_responses.txt');
        // file_put_contents($filePath, "=================\n" . $xmlContent, FILE_APPEND);
        return response()->json(['status' => true], 200);
    }

    /**
     * The airline says the cargo departed, reached the hub or was delivered: prepare that update for the client, to be
     * approved on the conversation (user, 2026-09-16). Delivered can also come from the job being completed; each is
     * prepared once.
     */
    private function prepareClientUpdate(string $awbNumber, string $code): void
    {
        // RCF — received from the flight at the hub (user, 2026-09-16: "reached hub with all the pieces").
        $stage = ['DEP' => 'departed', 'RCF' => 'arrived', 'DLV' => 'delivered', 'DDL' => 'delivered'][$code] ?? null;
        $number = \App\Support\AwbNumber::normalise($awbNumber);

        if ($stage === null || $number === null) {
            return;
        }

        // ⚠️ "All pieces" is only true without a discrepancy: a DIS on the AWB (short-landed, damaged) holds it back.
        if ($stage === 'arrived' && StatusReponse::where('condition_code', 'DIS')
            ->whereRaw("REPLACE(REPLACE(business_id, '-', ''), ' ', '') = ?", [str_replace('-', '', $number)])->exists()) {
            return;
        }

        // Stored as typed, so compared on the digits: 176-10000008 and 17610000008 are one waybill.
        $jobs = \App\Job::withoutGlobalScopes()->where('transport_mode', 'air')
            ->whereRaw("REPLACE(REPLACE(awb_number, '-', ''), ' ', '') = ?", [str_replace('-', '', $number)])->get();

        foreach ($jobs as $job) {
            app(\App\Services\ClientNotificationService::class)->prepareForJob($job, $stage);
        }
    }

    public function get_awb($awb_id)
    {
        abort_unless(ctype_digit((string) $awb_id), 404);
        $this->abortUnlessOwnWaybill(AirwayBills::class, $awb_id);
        $content = Storage::get("xml-conversion-files/xml_airway_bill_$awb_id.xml");
        return $content;
    }
}