<?php

namespace App\Http\Controllers\airwayBill;

use App\Agent;
use App\Airline;
use App\AirwayBills;
use App\Http\Controllers\Controller;
use App\PaymentInfo;
use App\WayBillAddress;
use App\SavedAddress;
use App\ConsignmentData;
use App\OtherCharge;
use App\OtherCustomInformation;
use App\Location;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\ConversionController;
use phpseclib3\Crypt\PublicKeyLoader;
use phpseclib3\Net\SFTP;

class AirwayBill extends Controller
{
    protected $conversionController;

    public function __construct(ConversionController $conversionController)
    {
        $this->conversionController = $conversionController;
    }
    public function get_agent()
    {
        $user = auth()->guard('user-api')->user();
        $user_id = $user->id;
        $company_id = $user->company_id; // Company ID from user table
        $branch_name = $user->branch_name;
        // $agent = Agent::where('id', $branch_name)->first();
        $data = Agent::where('id', $branch_name)->get(['agent_name', 'agent_address', 'agent_issue_sign', 'agent_issue_loc_code', 'agent_issue_date', 'agent_pincode', 'agent_city', 'agent_account', 'office_airport', 'office_function_designator', 'office_company_designator', 'iata_agent_code', 'iata_agent_cass', 'office_file_reference', 'participant', 'participant_airport', 'prticipant_identifer', 'participant_code', 'participant_file_reference', 'ho_name', 'ho_address', 'ho_city', 'ho_pincode', 'ho_state', 'ho_country']);
        return json_encode($data);
    }
    private function saveShipperAddress($awb_no, $awb_code, $shipper_address, $is_shipper_address_save)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $validator = Validator::make($shipper_address, [
            'ship_name' => 'required|string|max:70',
            'ship_name_2' => 'nullable|string|max:70',
            'ship_account' => 'nullable|regex:/^[a-zA-Z0-9]+$/|max:14',
            'ship_address' => 'required|regex:/^[a-zA-Z0-9\s.,-]+$/|max:255',
            'ship_address_line_2' => 'nullable|regex:/^[a-zA-Z0-9\s.,-]+$/|max:30',
            'ship_city' => 'required|string|max:70',
            'ship_airport_code' => 'nullable|regex:/^[a-zA-Z0-9]+$/|max:3',
            'ship_post_code' => 'nullable|max:15',
            'ship_state' => 'nullable|string|max:35',
            'ship_country' => 'required|regex:/^[a-zA-Z0-9]+$/|max:2',
            'ship_phone' => 'nullable|max:20',
            'ship_fax' => 'nullable|max:50',
            'ship_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $awb_id = $awb_code . $awb_no;
        //for update
        $WayBillAddress = WayBillAddress::where('awb_id', $awb_id)->first();

        //for insert
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = "$awb_id";
        $WayBillAddress->ship_name = $shipper_address['ship_name'];
        $WayBillAddress->ship_name_2 = $shipper_address['ship_name_2'] ?? null;
        $WayBillAddress->ship_account = $shipper_address['ship_account'] ?? null;
        $WayBillAddress->ship_address = $shipper_address['ship_address'];
        $WayBillAddress->ship_address_line_2 = $shipper_address['ship_address_line_2'] ?? null;
        $WayBillAddress->ship_city = $shipper_address['ship_city'];
        $WayBillAddress->ship_airport_code = $shipper_address['ship_airport_code'] ?? null;
        $WayBillAddress->ship_post_code = $shipper_address['ship_post_code'] ?? null;
        $WayBillAddress->ship_state = $shipper_address['ship_state'];
        $WayBillAddress->ship_country = $shipper_address['ship_country'];
        $WayBillAddress->ship_phone = $shipper_address['ship_phone'] ?? null;
        $WayBillAddress->ship_fax = $shipper_address['ship_fax'] ?? null;
        $WayBillAddress->ship_telex = $shipper_address['ship_telex'] ?? null;
        $WayBillAddress->agent_id = $agent->id ?? null;
        // dd($WayBillAddress);die();
        $WayBillAddress->save();

        //insert address if saved button checked
        if ($is_shipper_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $awb_id], ['address_type', 'shipper_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = "$awb_id";
            // $SavedAddress->id = '123456';
            $SavedAddress->address_type = 'shipper_address';
            $SavedAddress->name = $shipper_address['ship_name'];
            $SavedAddress->name_2 = $shipper_address['ship_name_2'] ?? null;
            $SavedAddress->account = $shipper_address['ship_account'] ?? null;
            $SavedAddress->address = $shipper_address['ship_address'];
            $SavedAddress->address_line_2 = $shipper_address['ship_address_line_2'] ?? null;
            $SavedAddress->city = $shipper_address['ship_city'];
            $SavedAddress->airport_code = $shipper_address['ship_airport_code'] ?? null;
            $SavedAddress->post_code = $shipper_address['ship_post_code'] ?? null;
            $SavedAddress->state = $shipper_address['ship_state'] ?? null;
            $SavedAddress->country = $shipper_address['ship_country'];
            $SavedAddress->phone = $shipper_address['ship_phone'] ?? null;
            $SavedAddress->fax = $shipper_address['ship_fax'] ?? null;
            $SavedAddress->telex = $shipper_address['ship_telex'] ?? null;
            $SavedAddress->agent_id = $agent->id ?? null;
            $SavedAddress->user_id = $user->id ?? null;
            // dd($SavedAddress);die();
            $SavedAddress->save();
        }
        return 'shipper address saved successfull';
    }
    private function saveConsigneeAddress($awb_no, $awb_code, $consignee_address, $is_consignee_address_save)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $validator = Validator::make($consignee_address, [
            'cons_name' => 'required|string|max:70',
            'cons_name_2' => 'nullable|string|max:70',
            'cons_account' => 'nullable|regex:/^[a-zA-Z0-9]+$/|max:14',
            'cons_address' => 'required|max:255|regex:/^[a-zA-Z0-9\s.,-]+$/',
            'cons_address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s.,-]+$/',
            'cons_city' => 'required|string|max:70',
            'cons_airport_code' => 'nullable|regex:/^[a-zA-Z0-9]+$/|max:3',
            'cons_post_code' => 'nullable|max:15',
            'cons_state' => 'nullable|string|max:35',
            'cons_country' => 'required|regex:/^[a-zA-Z0-9]+$/|max:2',
            'cons_phone' => 'nullable|max:20',
            'cons_fax' => 'nullable|max:50',
            'cons_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $awb_id = $awb_code . $awb_no;
        $WayBillAddress = WayBillAddress::where('awb_id', $awb_id)->first();
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = "$awb_id";
        $WayBillAddress->cons_name = $consignee_address['cons_name'];
        $WayBillAddress->cons_name_2 = $consignee_address['cons_name_2'] ?? null;
        $WayBillAddress->cons_account = $consignee_address['cons_account'] ?? null;
        $WayBillAddress->cons_address = $consignee_address['cons_address'];
        $WayBillAddress->cons_address_line_2 = $consignee_address['cons_address_line_2'] ?? null;
        $WayBillAddress->cons_city = $consignee_address['cons_city'];
        $WayBillAddress->cons_airport_code = $consignee_address['cons_airport_code'] ?? null;
        $WayBillAddress->cons_post_code = $consignee_address['cons_post_code'] ?? null;
        $WayBillAddress->cons_state = $consignee_address['cons_state'] ?? null;
        $WayBillAddress->cons_country = $consignee_address['cons_country'];
        $WayBillAddress->cons_phone = $consignee_address['cons_phone'] ?? null;
        $WayBillAddress->cons_fax = $consignee_address['cons_fax'] ?? null;
        $WayBillAddress->cons_telex = $consignee_address['cons_telex'] ?? null;
        $WayBillAddress->agent_id = $agent->id;
        $WayBillAddress->save();

        //insert address if saved button checked
        if ($is_consignee_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $awb_id], ['address_type', 'consignee_address']])->first();
            if (!isset($SavedAddress)) {
                $SavedAddress = new SavedAddress();
            }
            $SavedAddress->awb_id = "$awb_id";
            // $SavedAddress->id = '123456';
            $SavedAddress->address_type = 'consignee_address';
            $SavedAddress->name = $consignee_address['cons_name'];
            $SavedAddress->name_2 = $consignee_address['cons_name_2'] ?? null;
            $SavedAddress->account = $consignee_address['cons_account'] ?? null;
            $SavedAddress->address = $consignee_address['cons_address'];
            $SavedAddress->address_line_2 = $consignee_address['cons_address_line_2'] ?? null;
            $SavedAddress->city = $consignee_address['cons_city'];
            $SavedAddress->airport_code = $consignee_address['cons_airport_code'] ?? null;
            $SavedAddress->post_code = $consignee_address['cons_post_code'] ?? null;
            $SavedAddress->state = $consignee_address['cons_state'] ?? null;
            $SavedAddress->country = $consignee_address['cons_country'];
            $SavedAddress->phone = $consignee_address['cons_phone'] ?? null;
            $SavedAddress->fax = $consignee_address['cons_fax'] ?? null;
            $SavedAddress->telex = $consignee_address['cons_telex'] ?? null;
            $SavedAddress->agent_id = $agent->id ?? null;
            $SavedAddress->save();
        }
        return "consignee address saved successfull";
    }
    private function saveAlsoNotify($awb_no, $awb_code, $also_notify_address, $is_also_notify_address_save)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $validator = Validator::make($also_notify_address, [
            'also_name' => 'required|string|max:70',
            'also_name_2' => 'nullable|string|max:70',
            'also_address' => 'required|max:255|regex:/^[a-zA-Z0-9\s]+$/',
            'also_address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'also_city' => 'required|string|max:70',
            'also_airport_code' => 'nullable|regex:/^[a-zA-Z0-9]+$/|max:3',
            'also_post_code' => 'nullable|max:15',
            'also_state' => 'nullable|string|max:35',
            'also_country' => 'required|regex:/^[a-zA-Z0-9]+$/|max:2',
            'also_phone' => 'nullable|max:20',
            'also_fax' => 'nullable|max:35',
            'also_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $awb_id = $awb_code . $awb_no;
        $WayBillAddress = WayBillAddress::where('awb_id', $awb_id)->first();
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = "$awb_id";
        $WayBillAddress->also_name = $also_notify_address['also_name'];
        $WayBillAddress->also_address = $also_notify_address['also_address'];
        $WayBillAddress->also_address_line_2 = $also_notify_address['also_address_line_2'] ?? null;
        $WayBillAddress->also_city = $also_notify_address['also_city'];
        $WayBillAddress->also_airport_code = $also_notify_address['also_airport_code'] ?? null;
        $WayBillAddress->also_post_code = $also_notify_address['also_post_code'] ?? null;
        $WayBillAddress->also_state = $also_notify_address['also_state'] ?? null;
        $WayBillAddress->also_country = $also_notify_address['also_country'];
        $WayBillAddress->also_phone = $also_notify_address['also_phone'] ?? null;
        $WayBillAddress->also_fax = $also_notify_address['also_fax'] ?? null;
        $WayBillAddress->also_telex = $also_notify_address['also_telex'] ?? null;
        $WayBillAddress->agent_id = $agent->id ?? null;
        $WayBillAddress->save();

        if ($is_also_notify_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $awb_id], ['address_type', 'also_notify_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = "$awb_id";
            // $SavedAddress->id = '123456';
            $SavedAddress->address_type = 'also_notify_address';
            $SavedAddress->name = $also_notify_address['also_name'];
            $SavedAddress->address = $also_notify_address['also_address'];
            $SavedAddress->address_line_2 = $also_notify_address['also_address_line_2'] ?? null;
            $SavedAddress->city = $also_notify_address['also_city'];
            $SavedAddress->airport_code = $also_notify_address['also_airport_code'] ?? null;
            $SavedAddress->post_code = $also_notify_address['also_post_code'] ?? null;
            $SavedAddress->state = $also_notify_address['also_state'] ?? null;
            $SavedAddress->country = $also_notify_address['also_country'];
            $SavedAddress->phone = $also_notify_address['also_phone'] ?? null;
            $SavedAddress->fax = $also_notify_address['also_fax'] ?? null;
            $SavedAddress->telex = $also_notify_address['also_telex'] ?? null;
            $SavedAddress->agent_id = $agent->id ?? null;
            $SavedAddress->save();
        }
        return "Also notify address saved successfull";
    }
    private function firstBox($first_box, $id = null)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        if ($first_box['consolidated_mawb'] == true) {
            $first_box['consolidated_mawb'] = "true";
        } else {
            $first_box['consolidated_mawb'] = "false";
        }
        if ($first_box['awb'] == true) {
            $first_box['awb'] = "true";
        } else {
            $first_box['awb'] = "false";
        }
        $validator = Validator::make($first_box, [
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'required|regex:/^[0-9]+$/|size:8',
            // 'consolidated_mawb' => 'boolean',
            // 'awb' => 'boolean',
            'consolidated_mawb' => 'nullable',
            'awb' => 'nullable',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $awb_id = ($first_box['awb_code'] . $first_box['awb_no']);
        // $AirwayBills = AirwayBills::find($first_box['awb_no']);
        $AirwayBills = AirwayBills::find($awb_id);
        if ($AirwayBills) {
            // $AirwayBills->id = $awb_id;
            $AirwayBills->awb_no = $first_box['awb_no'];
            $AirwayBills->awb_code = $first_box['awb_code'];
            $AirwayBills->consolidated_mawb = $first_box['consolidated_mawb'];
            $AirwayBills->awb = $first_box['awb'];
            $AirwayBills->agent_id = $agent->id ?? null;
            // dd($first_box);
            $AirwayBills->save();
            return response()->json([
                'message' => 'First box created successfully',
                'data' => $AirwayBills
            ], 201);
        } else {
            $AirwayBills = new AirwayBills();
            $AirwayBills->id = "$awb_id";
            $AirwayBills->awb_no = $first_box['awb_no'];
            $AirwayBills->awb_code = $first_box['awb_code'];
            $AirwayBills->consolidated_mawb = $first_box['consolidated_mawb'];
            $AirwayBills->awb = $first_box['awb'];
            $AirwayBills->agent_id = $agent->id ?? null;
            // dd($first_box);
            // $AirwayBills->consolidated_mawb = ($first_box['consolidated_mawb'] == 1) ? true : false;
            // $AirwayBills->awb = ($first_box['awb'] == 1) ? true : false;
            $AirwayBills->save();
            return response()->json([
                'message' => 'First box created successfully',
                'data' => $AirwayBills
            ], 200);
        }
        // if (!isset($AirwayBills))

        // $AirwayBills->id = $awb_id;
        // $AirwayBills->awb_no = $first_box['awb_no'];
        // $AirwayBills->awb_code = $first_box['awb_code'];
        // $AirwayBills->consolidated_mawb = $first_box['consolidated_MAWB'];
        // $AirwayBills->awb = $first_box['awb'];
        // $AirwayBills->save();
        return "first box saved successfull";
    }
    private function routingInformation($awb_no, $awb_code, $routing_information)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $validator = Validator::make($routing_information, [
            'departure_airport' => 'required|string',
            'destination_airport' => 'required|string',
            'from' => 'nullable|string',
            'to' => 'required|string',
            'by' => 'required|string|size:2',
            'flight' => 'required|regex:/^[a-zA-Z0-9]+$/|max:4',
            'date' => 'required',
            'to_2' => 'nullable|string',
            'by_2' => 'nullable|string|size:2',
            'flight_2' => 'nullable|string|max:4',
            'date_2' => 'nullable',
            'to_3' => 'nullable|string',
            'by_3' => 'nullable|string|size:2',
            'flight_3' => 'nullable|string|max:4',
            'date_3' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Additional date validation after basic validation passes
        if (isset($routing_information['date']) && !empty($routing_information['date'])) {
            if (strtotime($routing_information['date']) === false) {
                return response()->json(['errors' => ['date' => ['The date field must be a valid date.']]], 422);
            }
        }
        if (isset($routing_information['date_2']) && !empty($routing_information['date_2'])) {
            if (strtotime($routing_information['date_2']) === false) {
                return response()->json(['errors' => ['date_2' => ['The date_2 field must be a valid date.']]], 422);
            }
        }
        if (isset($routing_information['date_3']) && !empty($routing_information['date_3'])) {
            if (strtotime($routing_information['date_3']) === false) {
                return response()->json(['errors' => ['date_3' => ['The date_3 field must be a valid date.']]], 422);
            }
        }

        // Format dates to ensure proper format Y-m-d H:i:s
        if (isset($routing_information['date']) && !empty($routing_information['date'])) {
            $dateValue = $routing_information['date'];
            $timestamp = strtotime($dateValue);
            if ($timestamp !== false) {
                $routing_information['date'] = date('Y-m-d H:i:s', $timestamp);
            } else {
                // Try to handle common date formats
                if (is_string($dateValue)) {
                    // Try different date parsing approaches
                    $timestamp = strtotime(str_replace(['T', 'Z'], [' ', ''], $dateValue));
                    if ($timestamp !== false) {
                        $routing_information['date'] = date('Y-m-d H:i:s', $timestamp);
                    }
                }
            }
        }
        if (isset($routing_information['date_2']) && !empty($routing_information['date_2'])) {
            $dateValue = $routing_information['date_2'];
            $timestamp = strtotime($dateValue);
            if ($timestamp !== false) {
                $routing_information['date_2'] = date('Y-m-d H:i:s', $timestamp);
            } else {
                // Try to handle common date formats
                if (is_string($dateValue)) {
                    $timestamp = strtotime(str_replace(['T', 'Z'], [' ', ''], $dateValue));
                    if ($timestamp !== false) {
                        $routing_information['date_2'] = date('Y-m-d H:i:s', $timestamp);
                    }
                }
            }
        }
        if (isset($routing_information['date_3']) && !empty($routing_information['date_3'])) {
            $dateValue = $routing_information['date_3'];
            $timestamp = strtotime($dateValue);
            if ($timestamp !== false) {
                $routing_information['date_3'] = date('Y-m-d H:i:s', $timestamp);
            } else {
                // Try to handle common date formats
                if (is_string($dateValue)) {
                    $timestamp = strtotime(str_replace(['T', 'Z'], [' ', ''], $dateValue));
                    if ($timestamp !== false) {
                        $routing_information['date_3'] = date('Y-m-d H:i:s', $timestamp);
                    }
                }
            }
        }

        $awb_id = $awb_code . $awb_no;
        $AirwayBills = AirwayBills::find($awb_id);
        if (!isset($AirwayBills))
            $AirwayBills = new AirwayBills();

        $AirwayBills->departure_airport = $routing_information['departure_airport'];
        $AirwayBills->destination_airport = $routing_information['destination_airport'];
        $AirwayBills->from = $routing_information['from'];
        $AirwayBills->to = $routing_information['to'];
        $AirwayBills->by = $routing_information['by'];
        $AirwayBills->flight = $routing_information['flight'];
        $AirwayBills->date = $routing_information['date'];
        $AirwayBills->to_2 = $routing_information['to_2'];
        $AirwayBills->by_2 = $routing_information['by_2'];
        $AirwayBills->flight_2 = $routing_information['flight_2'];
        $AirwayBills->date_2 = $routing_information['date_2'];
        $AirwayBills->to_3 = $routing_information['to_3'];
        $AirwayBills->by_3 = $routing_information['by_3'];
        $AirwayBills->flight_3 = $routing_information['flight_3'];
        $AirwayBills->date_3 = $routing_information['date_3'];
        $AirwayBills->agent_id = $agent->id ?? null;
        $AirwayBills->save();
        return "Routing Information saved successfull";
    }
    private function consignmentInformation($awb_no, $awb_code, $entries)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $awb_id = $awb_code . $awb_no;

        foreach ($entries as $entry) {
            $ConsignmentData = ConsignmentData::where('awb_id', $awb_id)->first();
            if (!isset($ConsignmentData))
                $ConsignmentData = new ConsignmentData();
            // Update the fields
            $ConsignmentData->awb_id = "$awb_id";
            $ConsignmentData->pieces = $entry['pieces'];
            $ConsignmentData->description = $entry['description'];
            $ConsignmentData->rate_class = $entry['rate_class'];
            $ConsignmentData->uld_rate_class = $entry['uld_rate_class'];
            $ConsignmentData->service_code = $entry['service_code'];
            $ConsignmentData->commodity_item = $entry['commodity_item'];
            $ConsignmentData->country_origin_goods = $entry['country_origin_goods'];
            $ConsignmentData->slac = $entry['slac'];
            $ConsignmentData->hs_code = json_encode($entry['hsCodes']);
            $ConsignmentData->gross_weight = $entry['gross_weight'];
            $ConsignmentData->weight_code = $entry['weight_code'];
            $ConsignmentData->chargable_weight = $entry['chargable_weight'];
            $ConsignmentData->rate = $entry['rate'];
            $ConsignmentData->pieces_info = json_encode($entry['itemss']);
            $ConsignmentData->uld_info = json_encode($entry['uld_infos']);
            $ConsignmentData->agent_id = $agent->id ?? null;
            // Save the updated or new record
            $ConsignmentData->save();
        }

        return "Consignment Data saved successfully";
    }
    private function customOriginAndOsiInfo($awb_no, $awb_code, $custom_origin)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();


        $validator = Validator::make($custom_origin, [
            'customs_origin_code' => 'nullable|regex:/^[a-zA-Z0-9]+$/|max:2',
            'accounting_information' => 'nullable|string|max:70',
            'special_service_request' => 'nullable|string|max:195',
            'other_service_information' => 'nullable|string|max:195',
            'shipment_ref_no' => 'nullable|string|max:35',
            'supplementary_shipment_info' => 'nullable|string|max:35',
            'supplementary_shipment_info_line_2' => 'nullable|string|max:35',
            'letter_credit' => 'nullable|string|size:3',
            'extra_print' => 'nullable|string|max:195'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $awb_id = $awb_code . $awb_no;
        $AirwayBills = AirwayBills::find($awb_id);
        if (!isset($AirwayBills))
            $AirwayBills = new AirwayBills();

        $AirwayBills->customs_origin_code = $custom_origin['customs_origin_code'];
        $AirwayBills->accounting_information = $custom_origin['accounting_information'];
        $AirwayBills->special_service_request = $custom_origin['special_service_request'];
        $AirwayBills->other_service_information = $custom_origin['other_service_information'];
        $AirwayBills->shipment_ref_no = $custom_origin['shipment_ref_no'];
        $AirwayBills->supplementary_shipment_info = $custom_origin['supplementary_shipment_info'];
        $AirwayBills->supplementary_shipment_info_line_2 = $custom_origin['supplementary_shipment_info_line_2'];
        $AirwayBills->letter_credit = $custom_origin['letter_credit'];
        $AirwayBills->extra_print = $custom_origin['extra_print'];
        $AirwayBills->agent_id = $agent->id ?? null;
        $AirwayBills->save();
        return "Custom Origin Code and other tab information save successfully";
    }
    private function otherCharges($awb_no, $awb_code, $charges)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();
        $awb_id = $awb_code . $awb_no;
        OtherCharge::where('awb_id', $awb_id)->delete();
        for ($i = 0; $i < sizeof($charges); $i++) {
            $finalOtherChargeCode = isset($charges[$i]['other_code']) && !empty($charges[$i]['other_code'])
                ? $charges[$i]['other_code']
                : (isset($charges[$i]['other_charge_code']) ? $charges[$i]['other_charge_code'] : null);

            // Validate the data
            $validator = Validator::make(array_merge($charges[$i], ['final_other_charge_code' => $finalOtherChargeCode]), [
                'payment_type' => 'nullable|string',
                'final_other_charge_code' => 'required|string',
                'amount' => 'nullable|numeric|min:0.01|max:999999999',
                'due' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $otherChargesData = new OtherCharge();
            $otherChargesData->awb_id = "$awb_id";
            $otherChargesData->other_charge_code = $finalOtherChargeCode;
            $otherChargesData->payment_type = $charges[$i]['payment_type'] ?? null;
            $otherChargesData->due = $charges[$i]['due'] ?? null;
            $otherChargesData->amount = $charges[$i]['amount'] ?? null;
            $otherChargesData->agent_id = $agent->id ?? null;
            $otherChargesData->save();
        }
        return "Other Charges Data saved successfully";
    }
    private function paymentInformation($awb_no, $awb_code, $payment_info)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $validator = Validator::make($payment_info, [
            'type_of_payment' => 'required',
            // 'total_charges' => 'nullable|numeric|min:0.000|max:999999999999',
            'currency' => 'nullable|string|size:3',
            // 'declear_value_carriage' => 'required|min:0.000|max:999999999999',// Either 'NVD' or a number or decimal
            'declear_value_carriage' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!is_numeric($value) && $value !== 'NVD') {
                        $fail($attribute . ' must be a number or "NVD".');
                    } elseif (is_numeric($value) && ($value < 0 || $value > 999999999999)) {
                        $fail($attribute . ' must be a number between 0.000 and 999999999999.');
                    }
                }
            ],
            'declear_value_customs' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!is_numeric($value) && $value !== 'NCV') {
                        $fail($attribute . ' must be a number or "NCV".');
                    } elseif (is_numeric($value) && ($value < 0 || $value > 999999999999)) {
                        $fail($attribute . ' must be a number between 0.000 and 999999999999.');
                    }
                }
            ],
            'declear_value_insurance' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!is_numeric($value) && $value !== 'XXX') {
                        $fail($attribute . ' must be a number or "XXX".');
                    } elseif (is_numeric($value) && ($value < 0 || $value > 999999999999)) {
                        $fail($attribute . ' must be a number between 0.000 and 999999999999.');
                    }
                }
            ],
            //customs
            // 'declear_value_customs' => 'nullable|numeric|min:0.000|max:999999999999',
            // 'declear_value_insurance' => 'nullable|numeric|min:0.001|max:99999999999',
            'weight_charge' => 'required|numeric|min:0.000|max:999999999999',
            'taxes' => 'nullable|integer',
            'total_charges_prepaid' => 'nullable|numeric|min:0.000|max:999999999999',
            'total_charges_collect' => 'nullable|numeric|min:0.000|max:999999999999'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $awb_id = $awb_code . $awb_no;
        $AirwayBills = PaymentInfo::where('awb_id', $awb_id)->first();
        if (!isset($AirwayBills))
            $AirwayBills = new PaymentInfo();

        $AirwayBills->awb_id = "$awb_id";
        $AirwayBills->type_of_payment = $payment_info['type_of_payment'];
        // $AirwayBills->total_charges = $payment_info['total_charges'];
        $AirwayBills->currency = $payment_info['currency'] ?? 'INR';
        $AirwayBills->declear_value_carriage = $payment_info['declear_value_carriage'] ?? 'NVD';
        $AirwayBills->declear_value_customs = $payment_info['declear_value_customs'] ?? 'NCV';
        $AirwayBills->declear_value_insurance = $payment_info['declear_value_insurance'] ?? 'XXX';
        $AirwayBills->weight_charge = $payment_info['weight_charge'];
        $AirwayBills->taxes = $payment_info['taxes'] ?? 0;
        $AirwayBills->total_charges_prepaid = $payment_info['total_charges_prepaid'] ?? 0;
        $AirwayBills->total_charges_collect = $payment_info['total_charges_collect'] ?? 0;
        $AirwayBills->other_charges_due_agent_prepaid = $payment_info['other_charges_due_agent_prepaid'] ?? 0;
        $AirwayBills->other_charges_due_agent_collect = $payment_info['other_charges_due_agent_collect'] ?? 0;
        $AirwayBills->other_charges_due_carrier_prepaid = $payment_info['other_charges_due_carrier_prepaid'] ?? 0;
        $AirwayBills->other_charges_due_carrier_collect = $payment_info['other_charges_due_carrier_collect'] ?? 0;
        $AirwayBills->agent_id = $agent->id ?? null;
        $AirwayBills->save();
        return "Payment Information save successfully";
    }
    private function otherCustomInformation($awb_no, $awb_code, $oci_entries)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $awb_id = $awb_code . $awb_no;
        foreach ($oci_entries as $oci_entry) {
            $validator = Validator::make(
                $oci_entry,
                [
                    'country_code' => 'required|string|max:2',
                    'info_identifier' => 'required|string|max:3',
                    'custom_info_identifier' => 'nullable|string|max:2',
                    'supplementary_info' => 'required|string|max:70|regex:/^[a-zA-Z0-9\s\-]+$/',
                ],
                [
                    'supplementary_info.regex' => 'Supplementary information may consist of a-z, 0-9, hyphen.',
                ]
            );

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $oci_info_identifier = $oci_entry['info_identifier'];
            $OtherCustomInfo = OtherCustomInformation::where([
                ['awb_id', $awb_id],
                ['info_identifier', $oci_info_identifier]
            ])->first();
            if (!isset($OtherCustomInfo)) {
                $OtherCustomInfo = new OtherCustomInformation();
            }
            $OtherCustomInfo->awb_id = "$awb_id";
            $OtherCustomInfo->info_identifier = $oci_info_identifier;
            $OtherCustomInfo->country_code = $oci_entry['country_code'];
            $OtherCustomInfo->custom_info_identifier = $oci_entry['custom_info_identifier'];
            $OtherCustomInfo->supplementary_info = $oci_entry['supplementary_info'];
            $OtherCustomInfo->agent_id = $agent->id ?? null;
            if (!$OtherCustomInfo->save()) {
                Log::error('Failed to save OtherCustomInformation for AWB:', ['awb_id' => $awb_id, 'oci_entry' => $oci_entry]);
            }
        }
        return "Other Custom Information saved successfully";
    }
    private function totalAmountValume($awb_no, $awb_code, $totals)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $validator = Validator::make($totals, [
            'total_volume' => 'required|numeric|min:0|max:999999999',
            //'required|regex:/^[0-9]+$/|max:9',
            'total_amount' => 'required|numeric|min:0.01|max:999999999',
            'dimention_unit' => 'nullable|string|max:3',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $awb_id = $awb_code . $awb_no;
        $AirwayBills = AirwayBills::find($awb_id);
        if (!isset($AirwayBills))
            $AirwayBills = new AirwayBills();

        $AirwayBills->total_volume = $totals['total_volume'];
        $AirwayBills->total_amount = $totals['total_amount'];
        if ($totals['dimention_unit'])
            $AirwayBills->dimention_unit = $totals['dimention_unit'];
        $AirwayBills->agent_id = $agent->id ?? null;
        $AirwayBills->save();
        return "Toatl Amount and Total Volume saved successfull";
    }
    // private function saveSpecialHandlingCode($awb_no, $awb_code, $tableCodes)
    // {
    //     $awb_id = $awb_code . $awb_no;
    //     if (empty($tableCodes)) {
    //         return "Code is missing in tableCodes entry.";
    //     }
    //     $codesArray = [];
    //     foreach ($tableCodes as $code) {
    //         if (!empty($code)) {
    //             $codesArray[] = $code;
    //         }
    //     }
    //     $codesJson = json_encode($codesArray);
    //     $handlingCode = AirwayBills::find($awb_id)->first();
    //     if (!$handlingCode) {
    //         $handlingCode = new AirwayBills();
    //     }
    //     $handlingCode->special_handling_info = $codesJson;
    //     $handlingCode->save();
    //     return "Special Handling Codes saved successfully.";
    // }
    public function saveSpecialHandlingCode($awb_no, $awb_code, $tableCodes)
    {
        $user = auth()->guard('user-api')->user();
        $company_id = $user->company_id;
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();

        $awb_id = $awb_code . $awb_no;
        if (empty($tableCodes)) {
            return response()->json(['message' => "Code is missing in tableCodes entry."], 400);
        }
        $handlingCode = AirwayBills::where('id', $awb_id)->first();
        if (!$handlingCode) {
            $handlingCode = new AirwayBills();
            $handlingCode->hawb_no = "$awb_id";
        }
        $handlingCode->special_handling_info = json_encode(array_values(array_filter($tableCodes)));
        $handlingCode->save();
        return response()->json(['message' => "Special Handling Codes saved successfully."]);
    }
    public function store(Request $request)
    {
        $main_return_data = [];
        $error_data = '';
        //for awb code and awb number 
        if (!empty($request->first_box['awb_code'])) {
            $error_data = $this->firstBox($request->first_box);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['first_box'] = $error_data;
        }
        //for storing shipper address
        if (!empty($request->shipper_address['ship_name']) && !empty($request->shipper_address['ship_country']) && !empty($request->shipper_address['ship_city'])) {
            $error_data = $this->saveShipperAddress($request->first_box['awb_no'], $request->first_box['awb_code'], $request->shipper_address, $request->is_shipper_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['shipper_address'] = $error_data;
        }
        // for storing consignee address
        if (!empty($request->consignee_address['cons_name'])) {
            $error_data = $this->saveConsigneeAddress($request->first_box['awb_no'], $request->first_box['awb_code'], $request->consignee_address, $request->is_consignee_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['consignee_address'] = $error_data;
        }
        //for storing also notify address
        if (!empty($request->also_notify_address['also_name'])) {
            $error_data = $this->saveAlsoNotify($request->first_box['awb_no'], $request->first_box['awb_code'], $request->also_notify_address, $request->is_also_notify_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['also_notify_address'] = $error_data;
        }

        // && !empty($request->routing_information['from'])
        if (!empty($request->routing_information['departure_airport'])) {
            $error_data = $this->routingInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->routing_information);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['routing_information'] = $error_data;
        }
        //for storing Consignment Information
        if (!empty($request->entries)) {
            $main_return_data['entries'] = $this->consignmentInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->entries);
        }
        //for custom origin code and OSI, SSR, Accounting and shipment reference information
        if (!empty($request->custom_origin)) {
            $error_data = $this->customOriginAndOsiInfo($request->first_box['awb_no'], $request->first_box['awb_code'], $request->custom_origin);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['custom_origin'] = $error_data;
        }
        // for other charges 
        if (!empty($request->charges)) {
            $main_return_data['charges'] = $this->otherCharges($request->first_box['awb_no'], $request->first_box['awb_code'], $request->charges);
        }
        //For payment information
        if (!empty($request->payment_info['currency']) && !empty($request->payment_info['type_of_payment'])) {
            $error_data = $this->paymentInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->payment_info);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['payment_info'] = $error_data;
        }
        //for Other custom Information
        if (!empty($request->oci_entries)) {
            $error_data = $this->otherCustomInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->oci_entries);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['oci_entries'] = $error_data;
        }
        //for Total Consignee Amount and Total Volume
        if (!empty($request->totals['total_volume']) && !empty($request->totals['total_amount'])) {
            $error_data = $this->totalAmountValume($request->first_box['awb_no'], $request->first_box['awb_code'], $request->totals);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['totals'] = $error_data;
        }
        if (!empty($request->tableCodes) && is_array($request->tableCodes)) {
            $main_return_data['tableCodes'] = $this->saveSpecialHandlingCode($request->first_box['awb_no'], $request->first_box['awb_code'], $request->tableCodes);
        }

        //for status update
        $awb_id = $request->first_box['awb_code'] . $request->first_box['awb_no'];
        $status = $request->status;
        AirwayBills::where(['id' => $awb_id])->update(['status' => $status]);
        $send_response = [];
        if ($status == 'send') {
            $send_response = $this->conversionController->WayBillConversion($awb_id);
            $send_response = $send_response->getData(true);
            AirwayBills::where(['id' => $awb_id])->update(['t_id' => $send_response['data']['tid'], 'send_created' => $send_response['data']['created'], 'send_status' => $send_response['status']]);
        }
        return response()->json(['data' => $main_return_data, 'send_response' => $send_response]);
    }
    public function update(Request $request, $id, $awb_no = null)
    {
        $main_return_data = [];
        $error_data = '';
        if (!empty($id)) {
            $error_data = $this->firstBox($request->first_box, $id);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422) {
                return $error_data;
            } else {
                $main_return_data['first_box'] = $error_data;
            }
        }
        if (!empty($id) && !empty($request->routing_information['departure_airport'])) {
            $error_data = $this->routingInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->routing_information);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['routing_information'] = $error_data;
        }
        if (!empty($id) && !empty($request->totals['total_volume']) && !empty($request->totals['total_amount'])) {
            $error_data = $this->totalAmountValume($request->first_box['awb_no'], $request->first_box['awb_code'], $request->totals);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['totals'] = $error_data;
        }
        if (!empty($id) && !empty($request->custom_origin)) {
            $error_data = $this->customOriginAndOsiInfo($request->first_box['awb_no'], $request->first_box['awb_code'], $request->custom_origin);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['custom_origin'] = $error_data;
        }
        if (!empty($id) && !empty($request->oci_entries)) {
            $error_data = $this->otherCustomInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->oci_entries);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['oci_entries'] = $error_data;
        }
        if (!empty($id)) {
            $error_data = $this->saveShipperAddress($request->first_box['awb_no'], $request->first_box['awb_code'], $request->shipper_address, $request->is_shipper_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['shipper_address'] = $error_data;
        }
        // for storing consignee address
        if (!empty($id)) {
            $error_data = $this->saveConsigneeAddress($request->first_box['awb_no'], $request->first_box['awb_code'], $request->consignee_address, $request->is_consignee_address_save, $awb_no = null);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['consignee_address'] = $error_data;
        }
        //for storing also notify address
        if (!empty($id) && !empty($request->also_notify_address['also_name'])) {
            $error_data = $this->saveAlsoNotify($request->first_box['awb_no'], $request->first_box['awb_code'], $request->also_notify_address, $request->is_also_notify_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['also_notify_address'] = $error_data;
        }
        if (!empty($id) && !empty($request->payment_info['type_of_payment'])) {
            $error_data = $this->paymentInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->payment_info);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['payment_info'] = $error_data;
        }
        if (!empty($id)) {
            $main_return_data['charges'] = $this->otherCharges($request->first_box['awb_no'], $request->first_box['awb_code'], $request->charges);
        }
        if (!empty($id)) {
            $main_return_data['entries'] = $this->consignmentInformation($request->first_box['awb_no'], $request->first_box['awb_code'], $request->entries);
        }
        if (!empty($id)) {
            $main_return_data['tableCodes'] = $this->saveSpecialHandlingCode($request->first_box['awb_no'], $request->first_box['awb_code'], $request->tableCodes);
        }

        //for status update
        $status = $request->status;
        $awb_id = $request->first_box['awb_code'] . $request->first_box['awb_no'];
        if ($status != 'generate_pdf')
            AirwayBills::where(['id' => $awb_id])->update(['status' => $status]);
        $send_response = [];
        if ($status == 'send') {
            $send_response = $this->conversionController->WayBillConversion($awb_id);
            $send_response = $send_response->getData(true);
            AirwayBills::where(['id' => $awb_id])->update(['t_id' => $send_response['data']['tid'], 'send_created' => $send_response['data']['created'], 'send_status' => $send_response['status']]);
        }
        return response()->json(['data' => $main_return_data, 'send_response' => $send_response]);
    }
    public function show($id)
    {
        $airwayBill = AirwayBills::with(['paymentInfo', 'wayBillAddress', 'savedAddress', 'consignmentData', 'otherCharge', 'otherCustomInformation'])->find($id);
        if (!$airwayBill) {
            return response()->json(['message' => 'Record not found'], 404);
        }
        return response()->json($airwayBill, 200);
    }
    public function getAirwayBills($status)
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $agentId = $user->branch_name;
        $airwayBill = AirwayBills::with([
            'paymentInfo',
            'wayBillAddress',
            'savedAddress',
            'consignmentData',
            'otherCharge',
            'otherCustomInformation'
        ])->where('agent_id', $agentId)->where('status', $status)->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        if ($airwayBill->isEmpty()) {
            return response()->json(['message' => 'Record not found'], 404);
        }
        return response()->json($airwayBill, 200);
    }
    public function getConsignmentError(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pieces' => 'required|digits_between:1,4',
            'description' => 'nullable|string|max:70',
            'rate_class' => 'nullable|string|max:1',
            'uld_rate_class' => 'nullable|regex:/^\d[A-Za-z]{2}$/',
            'service_code' => 'nullable|string|max:1',
            'commodity_item' => 'nullable|regex:/^[a-zA-Z0-9]+$/|max:11',
            'country_origin_goods' => 'nullable|string|max:2',
            'slac' => 'nullable|string',

            'gross_weight' => 'nullable|numeric|min:0.1|max:9999999',
            'chargable_weight' => 'nullable|numeric|min:0.1|max:9999999',
            'weight_code' => 'nullable|string|max:3',
            'volume' => 'nullable|string',
            // 'dimention_unit' => 'nullable|string|max:3',
            'total_volume' => 'nullable|regex:/^[0-9]+$/|max:9',
            'total_amount' => 'nullable|numeric|min:0.01|max:999999999',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        return response()->json(['msg' => 'No error'], 200);
    }
    public function getShippers(Request $request)
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $agentId = $user->branch_name;
        // $shippers = SavedAddress::all();
        $shippers = SavedAddress::where('agent_id', $agentId)->get();
        // dd($shippers);
        return response()->json($shippers);
    }
    public function getShipperAddress(Request $request)
    {
        $addressId = $request->id;
        $addressType = $request->address_type ?? 'shipper_address';
        $agenData = SavedAddress::where('id', $addressId)->first();
        if (!$agenData) {
            return response()->json(['error' => 'Address not found'], 404);
        }
        $userId = $agenData->id;

        $query = SavedAddress::where('id', $userId);
        if ($addressId) {
            $query->where('id', $addressId);
        } else {
            $query->where('address_type', $addressType);
        }
        $address = $query->first();

        if ($address) {
            return response()->json([
                'ship_name' => $address->name,
                'ship_account' => $address->account,
                'ship_address' => $address->address,
                'ship_address_line_2' => $address->address_line_2,
                'ship_city' => $address->city,
                'ship_airport_code' => $address->airport_code,
                'ship_post_code' => $address->post_code,
                'ship_state' => $address->state,
                'ship_country' => $address->country,
                'ship_phone' => $address->phone,
                'ship_fax' => $address->fax,
                'ship_telex' => $address->telex,
            ], 200);
        }
        return response()->json(['error' => 'Address not found'], 404);
    }
    public function getConsigneeAddress(Request $request)
    {
        $addressId = $request->query('id');
        $address_type = $request->query('address_type', 'consignee_address');
        $address = SavedAddress::where('id', $addressId)->where('address_type', $address_type)->first();
        if ($address) {
            return response()->json([
                'cons_name' => $address->name,
                'cons_account' => $address->account,
                'cons_address' => $address->address,
                'cons_address_line_2' => $address->address_line_2,
                'cons_city' => $address->city,
                'cons_airport_code' => $address->airport_code,
                'cons_post_code' => $address->post_code,
                'cons_state' => $address->state,
                'cons_country' => $address->country,
                'cons_phone' => $address->phone,
                'cons_fax' => $address->fax,
                'cons_telex' => $address->telex,
            ], 200);
        }
        return response()->json(['error' => 'Address not found'], 404);
    }
    public function getAlsoNotifyAddress(Request $request)
    {
        $addressId = $request->query('id');
        $address_type = $request->query('address_type', 'also_notify_address');
        $address = SavedAddress::where('id', $addressId)->where('address_type', $address_type)->first();
        if ($address) {
            return response()->json([
                'also_name' => $address->name,
                'also_account' => $address->account,
                'also_address' => $address->address,
                'also_address_line_2' => $address->address_line_2,
                'also_city' => $address->city,
                'also_airport_code' => $address->airport_code,
                'also_post_code' => $address->post_code,
                'also_state' => $address->state,
                'also_country' => $address->country,
                'also_phone' => $address->phone,
                'also_fax' => $address->fax,
                'also_telex' => $address->telex,
            ], 200);
        }
        return response()->json(['error' => 'Address not found'], 404);
    }
    public function loadAWB(Request $request)
    {
        $validated = $request->validate([
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            // AWB Code: 3 numeric characters
            'awb_no' => 'required',
        ]);
        $awb_code = $request->input('awb_code');
        $awb_no = $request->input('awb_no');
        $data = AirwayBills::where('awb_code', $awb_code)
            ->where('awb_no', $awb_no)
            ->first();
        if ($data) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No data found for the provided AWB code and number.',
            ]);
        }
    }
    public function getAwbPrefixData($code)
    {
        $awbDetails = Airline::where('prefix', $code)->first();

        if (!empty($awbDetails)) {
            return response()->json([
                'name' => $awbDetails->name,
                'code' => $awbDetails->code,
                'prefix' => $awbDetails->prefix,
            ]);
        } else {
            return response()->json(null, 404);
        }
    }
    public function sendFileToServerFTP($local_file_path, $remote_file_name)
    {
        // FTP Credentials
        $ftp_host = '65.0.228.88';
        $ftp_username = 'ubuntu';
        $ftp_password = '';
        $ftp_port = 22;
        $remote_folder = '/var/www/html/f16sefreight.com/public/xml-conversion-files/';

        // file exists locally
        if (!file_exists($local_file_path)) {
            throw new \Exception('Local XML file does not exist');
        }

        // Connect to FTP Server
        $ftp_conn = ftp_connect($ftp_host, $ftp_port);
        if (!$ftp_conn) {
            throw new \Exception('Could not connect to FTP server');
        }

        // Login to FTP
        if (!ftp_login($ftp_conn, $ftp_username, $ftp_password)) {
            ftp_close($ftp_conn);
            throw new \Exception('FTP Login Failed - Check credentials');
        }

        // Set Passive Mode
        ftp_pasv($ftp_conn, true);

        // Upload File to FTP
        $remote_file_path = $remote_folder . $remote_file_name;
        if (!ftp_put($ftp_conn, $remote_file_path, $local_file_path, FTP_BINARY)) {
            ftp_close($ftp_conn);
            throw new \Exception('FTP File Upload Failed');
        }

        // Close FTP Connection
        ftp_close($ftp_conn);

        return true;
    }

    public function get_airport_by_airport_code(Request $request)
    {
        $data = Location::whereIn('iata_code', $request->airport_code)->get(['destination', 'iata_code']);
        return response()->json(['status' => true, 'data' => $data, 'msg' => '']);
    }

}