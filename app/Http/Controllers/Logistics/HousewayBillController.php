<?php

namespace App\Http\Controllers\Logistics;

use App\Agent;
use App\Http\Controllers\Controller;
use App\PaymentInfo;
use App\WayBillAddress;
use App\SavedAddress;
use App\ConsignmentData;
use App\HousewayBills;
use App\OtherCharge;
use App\OtherCustomInformation;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class HousewayBillController extends Controller
{
    protected $conversionController;
    public function __construct(ConversionController $conversionController)
    {
        $this->conversionController = $conversionController;
    }
    public function get_agent()
    {
        $user = auth()->guard('user-api')->user();
        $branch_name = $user->branch_name;
        $data = Agent::where('id', $branch_name)->get(['agent_name', 'agent_address', 'agent_issue_sign', 'agent_issue_loc_code', 'agent_issue_date', 'agent_pincode', 'agent_city', 'agent_account', 'office_airport', 'office_function_designator', 'office_company_designator', 'iata_agent_code', 'iata_agent_cass', 'office_file_reference', 'participant', 'participant_airport', 'prticipant_identifer', 'participant_code', 'participant_file_reference']);
        return json_encode($data);
    }
    public function getCountry()
    {
        $countries = config('country');
        return response()->json($countries);
    }
    public function getOtherCharges()
    {
        $other_charge_code = config('info_identifier.Other_charge');
        return response()->json($other_charge_code);
    }
    public function getOCIData()
    {
        $identifiers = config('info_identifier.identifires');
        $ociCustomInfoIdentifier = config('info_identifier.oci_custom_info_identifier');

        return response()->json([
            'identifiers' => $identifiers,
            'oci_custom_info_identifier' => $ociCustomInfoIdentifier
        ]);
    }
    private function getAuthAgent()
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return null;
        }
        return Agent::where('id', $user->branch_name)->first();
    }
    private function validateAndFormatRouteDates(array &$routing_information)
    {
        $dateFields = ['date', 'date_2', 'date_3'];
        foreach ($dateFields as $field) {
            if (isset($routing_information[$field]) && !empty($routing_information[$field])) {
                $dateValue = $routing_information[$field];
                $timestamp = strtotime($dateValue);
                if ($timestamp === false && is_string($dateValue)) {
                    $timestamp = strtotime(str_replace(['T', 'Z'], [' ', ''], $dateValue));
                }
                if ($timestamp === false) {
                    $fieldNameForErr = $field === 'date' ? 'date' : $field;
                    return response()->json(['errors' => [$field => ["The {$fieldNameForErr} field must be a valid date."]]], 422);
                }
                $routing_information[$field] = date('Y-m-d H:i:s', $timestamp);
            }
        }
        return null;
    }
    private function getAddressByType(Request $request, string $addressType, string $prefix)
    {
        $addressId = $request->input('id') ?? $request->query('id');
        $address = null;
        if ($addressId) {
            $address = SavedAddress::where('id', $addressId)->first();
        } else {
            $address = SavedAddress::where('address_type', $addressType)->first();
        }

        if ($address) {
            return response()->json([
                "{$prefix}_name" => $address->name,
                "{$prefix}_name_2" => $address->name_2,
                "{$prefix}_account" => $address->account,
                "{$prefix}_address" => $address->address,
                "{$prefix}_address_line_2" => $address->address_line_2,
                "{$prefix}_city" => $address->city,
                "{$prefix}_airport_code" => $address->airport_code,
                "{$prefix}_post_code" => $address->post_code,
                "{$prefix}_state" => $address->state,
                "{$prefix}_country" => $address->country,
                "{$prefix}_phone" => $address->phone,
                "{$prefix}_fax" => $address->fax,
                "{$prefix}_telex" => $address->telex,
            ], 200);
        }
        return response()->json(['error' => 'Address not found'], 404);
    }
    private function saveShipperAddress($hawb_no, $shipper_address, $is_shipper_address_save)
    {
        $user = auth()->guard('user-api')->user();
        $agent = $this->getAuthAgent();

        $validator = Validator::make($shipper_address, [
            'ship_name' => 'required|string|max:70',
            'ship_name_2' => 'nullable|string|max:70',
            'ship_account' => 'nullable|string|max:14',
            'ship_address' => 'required|regex:/^[a-zA-Z0-9\s.,-]+$/|max:40',
            'ship_address_line_2' => 'nullable|regex:/^[a-zA-Z0-9\s.,-]+$/|max:30',
            'ship_city' => 'required|string|max:70',
            'ship_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'ship_post_code' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:15',
            'ship_state' => 'required|string|max:9',
            'ship_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'ship_phone' => 'nullable|max:20',
            'ship_fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'ship_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        //for update
        $WayBillAddress = WayBillAddress::where('awb_id', $hawb_no)->first();
        if (!empty($WayBillAddress)) {
            $WayBillAddress->awb_id = $hawb_no;
            $WayBillAddress->ship_name = $shipper_address['ship_name'];
            $WayBillAddress->ship_name_2 = $shipper_address['ship_name_2'] ?? null;
            $WayBillAddress->ship_account = $shipper_address['ship_account'] ?? null;
            $WayBillAddress->ship_address = $shipper_address['ship_address'];
            $WayBillAddress->ship_address_line_2 = $shipper_address['ship_address_line_2'] ?? null;
            $WayBillAddress->ship_city = $shipper_address['ship_city'];
            $WayBillAddress->ship_airport_code = $shipper_address['ship_airport_code'] ?? null;
            $WayBillAddress->ship_post_code = $shipper_address['ship_post_code'] ?? null;
            $WayBillAddress->ship_state = $shipper_address['ship_state'] ?? null;
            $WayBillAddress->ship_country = $shipper_address['ship_country'];
            $WayBillAddress->ship_phone = $shipper_address['ship_phone'] ?? null;
            $WayBillAddress->ship_fax = $shipper_address['ship_fax'] ?? null;
            $WayBillAddress->ship_telex = $shipper_address['ship_telex'] ?? null;
            $WayBillAddress->agent_id = $agent->id ?? null;
            $WayBillAddress->save();
            return response()->json([
                'message' => 'Shipper address updated successfully',
                'data' => $WayBillAddress
            ], 200);
        }
        //for insert
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = $hawb_no;
        $WayBillAddress->ship_name = $shipper_address['ship_name'];
        $WayBillAddress->ship_name_2 = $shipper_address['ship_name_2'] ?? null;
        $WayBillAddress->ship_account = $shipper_address['ship_account'] ?? null;
        $WayBillAddress->ship_address = $shipper_address['ship_address'];
        $WayBillAddress->ship_address_line_2 = $shipper_address['ship_address_line_2'] ?? null;
        $WayBillAddress->ship_city = $shipper_address['ship_city'];
        $WayBillAddress->ship_airport_code = $shipper_address['ship_airport_code'] ?? null;
        $WayBillAddress->ship_post_code = $shipper_address['ship_post_code'] ?? null;
        $WayBillAddress->ship_state = $shipper_address['ship_state'] ?? null;
        $WayBillAddress->ship_country = $shipper_address['ship_country'];
        $WayBillAddress->ship_phone = $shipper_address['ship_phone'] ?? null;
        $WayBillAddress->ship_fax = $shipper_address['ship_fax'] ?? null;
        $WayBillAddress->ship_telex = $shipper_address['ship_telex'] ?? null;
        $WayBillAddress->agent_id = $agent->id ?? null;
        $WayBillAddress->save();

        //insert address if saved button checked
        if ($is_shipper_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $hawb_no], ['address_type', 'shipper_address']])->first();
            if (!empty($SavedAddress)) {
                // Update existing record — fix: agent_id = branch, user_id = real user
                $SavedAddress->awb_id = $hawb_no;
                $SavedAddress->agent_id = $agent->id ?? null;
                $SavedAddress->user_id = $user->id ?? null;
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
                $SavedAddress->save();
                return response()->json([
                    'message' => 'Shippers Information updated successfully',
                    'data' => $SavedAddress
                ], 200);
            }
            // Insert new record — fix: agent_id = branch, user_id = real user
            $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $hawb_no;
            $SavedAddress->agent_id = $agent->id ?? null;
            $SavedAddress->user_id = $user->id ?? null;
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
            $SavedAddress->save();
        }
        return 'shipper address saved successfull';
    }
    private function saveConsigneeAddress($hawb_no, $consignee_address, $is_consignee_address_save)
    {
        $agent = $this->getAuthAgent();

        $validator = Validator::make($consignee_address, [
            'cons_name' => 'required|string|max:70',
            'cons_name_2' => 'nullable|string|max:70',
            'cons_account' => 'nullable|string|max:14',
            'cons_address' => 'required|max:40|regex:/^[a-zA-Z0-9\s.,-]+$/',
            'cons_address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s.,-]+$/',
            'cons_city' => 'required|string|max:70',
            'cons_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'cons_post_code' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:15',
            'cons_state' => 'required|string|max:9',
            'cons_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'cons_phone' => 'nullable|max:20',
            'cons_fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'cons_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $WayBillAddress = WayBillAddress::where('awb_id', $hawb_no)->first();
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = $hawb_no;
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
        $WayBillAddress->agent_id = $agent->id ?? null;
        $WayBillAddress->save();

        //insert address if saved button checked — fix: agent_id = branch, user_id = real user
        if ($is_consignee_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $hawb_no], ['address_type', 'consignee_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $hawb_no;
            $SavedAddress->agent_id = $agent->id ?? null;
            $SavedAddress->user_id = $user->id ?? null;
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
            $SavedAddress->save();
        }
        return "consignee address saved successfull";
    }
    private function saveAlsoNotify($hawb_no, $also_notify_address, $is_also_notify_address_save)
    {
        $agent = $this->getAuthAgent();

        $validator = Validator::make($also_notify_address, [
            'also_name' => 'required|string|max:70',
            'also_address' => 'required|max:40|regex:/^[a-zA-Z0-9\s.,-]+$/',
            'also_address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s.,-]+$/',
            'also_city' => 'required|string|max:70',
            'also_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'also_post_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:15',
            'also_state' => 'nullable|string|max:9',
            'also_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'also_phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'also_fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'also_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $WayBillAddress = WayBillAddress::where('awb_id', $hawb_no)->first();
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = $hawb_no;
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
            // fix: agent_id = branch, user_id = real user
            $SavedAddress = SavedAddress::where([['awb_id', $hawb_no], ['address_type', 'also_notify_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $hawb_no;
            $SavedAddress->agent_id = $agent->id ?? null;
            $SavedAddress->user_id = $user->id ?? null;
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
            $SavedAddress->save();
        }
        return "Also notify address saved successfull";
    }
    private function firstBox($first_box, $id = null)
    {
        $agent = $this->getAuthAgent();

        $validator = Validator::make($first_box, [
            'hawb_no' => 'required|regex:/^[a-zA-Z0-9]+$/|max:35',
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'required|regex:/^[0-9]+$/|size:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $HousewayBill = HousewayBills::find($first_box['hawb_no']);
        if ($HousewayBill) {
            // Update the existing record
            $HousewayBill->awb_no = $first_box['awb_no'];
            $HousewayBill->awb_code = $first_box['awb_code'];
            $HousewayBill->agent_id = $agent->id ?? null;
            $HousewayBill->save();

            return response()->json([
                'message' => 'First box updated successfully',
                'data' => $HousewayBill
            ], 200);
        } else {
            // Create a new record
            $HousewayBill = new HousewayBills();
            $HousewayBill->id = $first_box['hawb_no'];
            $HousewayBill->awb_no = $first_box['awb_no'];
            $HousewayBill->awb_code = $first_box['awb_code'];
            $HousewayBill->agent_id = $agent->id ?? null;
            $HousewayBill->save();

            return response()->json([
                'message' => 'First box created successfully',
                'data' => $HousewayBill
            ], 201);
        }
    }

    private function routingInformation($hawb_no, $routing_information)
    {
        $agent = $this->getAuthAgent();

        $validator = Validator::make($routing_information, [
            'departure_airport' => 'required|string',
            'destination_airport' => 'required|string',
            'from' => 'required|string',
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
            'master_origin' => 'required|regex:/^[a-zA-Z0-9]+$/|max:3',
            'master_destination' => 'required|regex:/^[a-zA-Z0-9]+$/|max:3'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $dateError = $this->validateAndFormatRouteDates($routing_information);
        if ($dateError) {
            return $dateError;
        }

        $HousewayBills = HousewayBills::find($hawb_no);
        if (!empty($hawb_no)) {
            $HousewayBills->id = $hawb_no;
            $HousewayBills->departure_airport = $routing_information['departure_airport'];
            $HousewayBills->destination_airport = $routing_information['destination_airport'];
            $HousewayBills->from = $routing_information['departure_airport'];
            $HousewayBills->to = $routing_information['to'];
            $HousewayBills->by = $routing_information['by'];
            $HousewayBills->flight = $routing_information['flight'];
            $HousewayBills->date = $routing_information['date'];
            $HousewayBills->to_2 = $routing_information['to_2'];
            $HousewayBills->by_2 = $routing_information['by_2'];
            $HousewayBills->flight_2 = $routing_information['flight_2'];
            $HousewayBills->date_2 = $routing_information['date_2'];
            $HousewayBills->to_3 = $routing_information['to_3'];
            $HousewayBills->by_3 = $routing_information['by_3'];
            $HousewayBills->flight_3 = $routing_information['flight_3'];
            $HousewayBills->date_3 = $routing_information['date_3'];
            $HousewayBills->master_origin = $routing_information['master_origin'];
            $HousewayBills->master_destination = $routing_information['master_destination'];
            $HousewayBills->agent_id = $agent->id ?? null;
            $HousewayBills->save();
            return response()->json([
                'message' => 'Routing Information updated successfully',
                'data' => $HousewayBills
            ], 200);
        }

        if (!isset($HousewayBills))
            $HousewayBills = new HousewayBills();
        $HousewayBills->departure_airport = $routing_information['departure_airport'];
        $HousewayBills->destination_airport = $routing_information['destination_airport'];
        $HousewayBills->from = $routing_information['departure_airport'];
        $HousewayBills->to = $routing_information['to'];
        $HousewayBills->by = $routing_information['by'];
        $HousewayBills->flight = $routing_information['flight'];
        $HousewayBills->date = $routing_information['date'];
        $HousewayBills->to_2 = $routing_information['to_2'];
        $HousewayBills->by_2 = $routing_information['by_2'];
        $HousewayBills->flight_2 = $routing_information['flight_2'];
        $HousewayBills->date_2 = $routing_information['date_2'];
        $HousewayBills->to_3 = $routing_information['to_3'];
        $HousewayBills->by_3 = $routing_information['by_3'];
        $HousewayBills->flight_3 = $routing_information['flight_3'];
        $HousewayBills->date_3 = $routing_information['date_3'];
        $HousewayBills->master_origin = $routing_information['master_origin'];
        $HousewayBills->master_destination = $routing_information['master_destination'];
        $HousewayBills->agent_id = $agent->id ?? null;
        $HousewayBills->save();
        return "Routing Information saved successfull";
    }
    private function consignmentInformation($hawb_no, $entries)
    {
        $agent = $this->getAuthAgent();

        for ($i = 0; $i < sizeof($entries); $i++) {
            $pieces = $entries[$i]['pieces'];
            $ConsignmentData = ConsignmentData::where([['awb_id', $hawb_no], ['pieces', $pieces]])->first();
            if (!isset($ConsignmentData))
                $ConsignmentData = new ConsignmentData();
            $ConsignmentData->awb_id = $hawb_no;
            $ConsignmentData->pieces = $pieces;
            $ConsignmentData->description = $entries[$i]['description'];
            $ConsignmentData->rate_class = $entries[$i]['rate_class'];
            $ConsignmentData->uld_rate_class = $entries[$i]['uld_rate_class'];
            $ConsignmentData->service_code = $entries[$i]['service_code'];
            $ConsignmentData->commodity_item = $entries[$i]['commodity_item'];
            $ConsignmentData->country_origin_goods = $entries[$i]['country_origin_goods'];
            $ConsignmentData->slac = $entries[$i]['slac'];
            $ConsignmentData->hs_code = json_encode($entries[$i]['hsCodes']);
            $ConsignmentData->gross_weight = $entries[$i]['gross_weight'];
            $ConsignmentData->weight_code = $entries[$i]['weight_code'];
            $ConsignmentData->chargable_weight = $entries[$i]['chargable_weight'];
            $ConsignmentData->rate = $entries[$i]['rate'];
            $ConsignmentData->pieces_info = json_encode($entries[$i]['itemss']);
            $ConsignmentData->uld_info = json_encode($entries[$i]['uld_infos']);
            $ConsignmentData->agent_id = $agent->id ?? null;
            // $ConsignmentData->dimention_unit = $entries[$i]['dimention_unit'];
            $ConsignmentData->save();
            return "Consignment Data saved successfull";
        }
    }
    private function customOriginAndOsiInfo($hawb_no, $custom_origin)
    {
        $agent = $this->getAuthAgent();

        $validator = Validator::make($custom_origin, [
            'customs_origin_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:2',
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

        $HousewayBills = HousewayBills::find($hawb_no);
        if (!isset($HousewayBills))
            $HousewayBills = new HousewayBills();

        $HousewayBills->customs_origin_code = $custom_origin['customs_origin_code'];
        $HousewayBills->accounting_information = $custom_origin['accounting_information'];
        $HousewayBills->special_service_request = $custom_origin['special_service_request'];
        $HousewayBills->other_service_information = $custom_origin['other_service_information'];
        $HousewayBills->shipment_ref_no = $custom_origin['shipment_ref_no'];
        $HousewayBills->supplementary_shipment_info = $custom_origin['supplementary_shipment_info'];
        $HousewayBills->supplementary_shipment_info_line_2 = $custom_origin['supplementary_shipment_info_line_2'];
        $HousewayBills->letter_credit = $custom_origin['letter_credit'];
        $HousewayBills->extra_print = $custom_origin['extra_print'];
        $HousewayBills->agent_id = $agent->id ?? null;
        $HousewayBills->save();
        return "Custom Origin Code and other tab information save successfully";
    }
    private function otherCharges($hawb_no, $charges)
    {
        $agent = $this->getAuthAgent();
        OtherCharge::where('awb_id', $hawb_no)->delete();
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
            $otherChargesData->awb_id = $hawb_no;
            $otherChargesData->other_charge_code = $finalOtherChargeCode;
            $otherChargesData->payment_type = $charges[$i]['payment_type'] ?? null;
            $otherChargesData->due = $charges[$i]['due'] ?? null;
            $otherChargesData->amount = $charges[$i]['amount'] ?? null;
            $otherChargesData->agent_id = $agent->id ?? null;
            $otherChargesData->save();
        }
        return "Other Charges Data saved successfully";
    }
    private function paymentInformation($hawb_no, $payment_info)
    {
        $agent = $this->getAuthAgent();

        $validator = Validator::make($payment_info, [
            'type_of_payment' => 'required',
            // 'total_charges' => 'required|numeric|min:0.000|max:999999999999',
            'currency' => 'nullable|string|size:3',
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
            // 'weight_charge' => 'required|numeric|min:0.000|max:999999999999',
            'taxes' => 'nullable|integer',
            'total_charges_prepaid' => 'nullable|numeric|min:0.000|max:999999999999',
            'total_charges_collect' => 'nullable|numeric|min:0.000|max:999999999999',
        ]);


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $HousewayBills = PaymentInfo::where('awb_id', $hawb_no)->first();
        if (!isset($HousewayBills))
            $HousewayBills = new PaymentInfo();
        $HousewayBills->awb_id = $hawb_no;
        $HousewayBills->type_of_payment = $payment_info['type_of_payment'];
        // $HousewayBills->total_charges = $payment_info['total_charges'];
        $HousewayBills->currency = $payment_info['currency'];
        $HousewayBills->declear_value_carriage = $payment_info['declear_value_carriage'] ?? null;
        $HousewayBills->declear_value_customs = $payment_info['declear_value_customs'] ?? null;
        $HousewayBills->declear_value_insurance = $payment_info['declear_value_insurance'] ?? null;
        $HousewayBills->weight_charge = $payment_info['weight_charge'] ?? null;
        $HousewayBills->taxes = $payment_info['taxes'] ?? null;
        $HousewayBills->total_charges_prepaid = $payment_info['total_charges_prepaid'] ?? null;
        $HousewayBills->total_charges_collect = $payment_info['total_charges_collect'] ?? null;
        $HousewayBills->other_charges_due_agent_prepaid = $payment_info['other_charges_due_agent_prepaid'] ?? null;
        $HousewayBills->other_charges_due_agent_collect = $payment_info['other_charges_due_agent_collect'] ?? null;
        $HousewayBills->other_charges_due_carrier_prepaid = $payment_info['other_charges_due_carrier_prepaid'] ?? null;
        $HousewayBills->other_charges_due_carrier_collect = $payment_info['other_charges_due_carrier_collect'] ?? null;
        $HousewayBills->agent_id = $agent->id ?? null;
        $HousewayBills->save();
        return "Payment Information save successfully";
    }
    private function otherCustomInformation($hawb_no, $oci_entries)
    {
        $agent = $this->getAuthAgent();

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
                ['awb_id', $hawb_no],
                ['info_identifier', $oci_info_identifier]
            ])->first();
            if (!isset($OtherCustomInfo)) {
                $OtherCustomInfo = new OtherCustomInformation();
            }
            $OtherCustomInfo->awb_id = $hawb_no;
            $OtherCustomInfo->info_identifier = $oci_info_identifier;
            $OtherCustomInfo->country_code = $oci_entry['country_code'];
            $OtherCustomInfo->custom_info_identifier = $oci_entry['custom_info_identifier'];
            $OtherCustomInfo->supplementary_info = $oci_entry['supplementary_info'];
            $OtherCustomInfo->agent_id = $agent->id ?? null;
            if (!$OtherCustomInfo->save()) {
                Log::error('Failed to save OtherCustomInformation for AWB:', ['awb_id' => $hawb_no, 'oci_entry' => $oci_entry]);
            }
        }
        return "Other Custom Information saved successfully";
    }
    private function totalAmountValume($hawb_no, $totals)
    {
        $agent = $this->getAuthAgent();

        $validator = Validator::make($totals, [
            // 'total_volume' => 'required|numeric|min:0|max:999999999',
            //'required|regex:/^[0-9]+$/|max:9',
            // 'total_amount' => 'required|numeric|min:0.01|max:999999999',
            'master_pcs' => 'required|regex:/^[0-9]+$/|max:4',
            'master_weight' => 'required|numeric|min:0.1|max:9999999|regex:/^\d{1,7}(\.\d{1,3})?$/',
            'dimention_unit' => 'nullable|string|max:3',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $HousewayBills = HousewayBills::find($hawb_no);
        if (!empty($hawb_no)) {
            $HousewayBills->id = $hawb_no;
            if (!empty($totals['total_volume']) && $totals['total_volume'] != '0.00')
                $HousewayBills->total_volume = $totals['total_volume'];
            $HousewayBills->total_amount = $totals['total_amount'] ?? null;
            $HousewayBills->master_pcs = $totals['master_pcs'];
            $HousewayBills->master_weight = $totals['master_weight'];
            if (isset($totals['dimention_unit']) && $totals['dimention_unit'])
                $HousewayBills->dimention_unit = $totals['dimention_unit'];
            $HousewayBills->agent_id = $agent->id ?? null;
            $HousewayBills->save();
            return response()->json([
                'message' => 'Toatl Amount and Total Volume updated successfully',
                'data' => $HousewayBills
            ], 200);
        } else {
            // if (!isset($HousewayBills))
            $HousewayBills = new HousewayBills();
            $HousewayBills->total_volume = $totals['total_volume'];
            $HousewayBills->total_amount = $totals['total_amount'];
            $HousewayBills->master_pcs = $totals['master_pcs'];
            $HousewayBills->master_weight = $totals['master_weight'];
            if ($totals['dimention_unit'])
                $HousewayBills->dimention_unit = $totals['dimention_unit'];
            $HousewayBills->agent_id = $agent->id ?? null;
            $HousewayBills->save();
        }
        return "Toatl Amount and Total Volume saved successfull";
    }
    public function saveSpecialHandlingCode($hawb_no, $tableCodes)
    {
        $agent = $this->getAuthAgent();

        if (empty($tableCodes)) {
            return response()->json(['message' => "Code is missing in tableCodes entry."], 400);
        }
        $handlingCode = HousewayBills::where('id', $hawb_no)->first();
        if (!$handlingCode) {
            $handlingCode = new HousewayBills();
            $handlingCode->hawb_no = $hawb_no;
        }
        $handlingCode->special_handling_info = json_encode(array_values(array_filter($tableCodes)));
        $handlingCode->save();
        return response()->json(['message' => "Special Handling Codes saved successfully."]);
    }

    public function store(Request $request)
    {
        $main_return_data = [];
        $hawb_id = $request->first_box['hawb_no'];
        $error_data = '';
        //for storing shipper address
        if (!empty($request->shipper_address['ship_name'])) {
            $error_data = $this->saveShipperAddress($hawb_id, $request->shipper_address, $request->is_shipper_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['shipper_address'] = $error_data;
        }
        // for storing consignee address
        if (!empty($request->consignee_address['cons_name'])) {
            $error_data = $this->saveConsigneeAddress($hawb_id, $request->consignee_address, $request->is_consignee_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['consignee_address'] = $error_data;
        }
        //for storing also notify address
        if (!empty($request->also_notify_address['also_name'])) {
            $error_data = $this->saveAlsoNotify($hawb_id, $request->also_notify_address, $request->is_also_notify_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['also_notify_address'] = $error_data;
        }
        if (!empty($hawb_id)) {
            $error_data = $this->firstBox($request->first_box);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['first_box'] = $error_data;
        }
        // && !empty($request->routing_information['from'])
        if (!empty($request->routing_information['departure_airport'])) {
            $error_data = $this->routingInformation($hawb_id, $request->routing_information);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['routing_information'] = $error_data;
        }
        //for storing Consignment Information
        if (!empty($request->entries)) {
            $main_return_data['entries'] = $this->consignmentInformation($hawb_id, $request->entries);
        }
        //for custom origin code and OSI, SSR, Accounting and shipment reference information
        if (!empty($request->custom_origin)) {
            $error_data = $this->customOriginAndOsiInfo($hawb_id, $request->custom_origin);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['custom_origin'] = $error_data;
        }
        // for other charges 
        if (!empty($request->charges)) {
            $main_return_data['charges'] = $this->otherCharges($hawb_id, $request->charges);
        }
        //For payment information
        if (!empty($request->payment_info['type_of_payment']) && !empty($request->payment_info['currency'])) {
            $error_data = $this->paymentInformation($hawb_id, $request->payment_info);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['payment_info'] = $error_data;
        }
        //for Other custom Information
        if (!empty($request->oci_entries)) {
            $error_data = $this->otherCustomInformation($hawb_id, $request->oci_entries);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['oci_entries'] = $error_data;
        }
        $error_data = $this->totalAmountValume($hawb_id, $request->totals);
        if (!is_string($error_data) && $error_data->getStatusCode() == 422)
            return $error_data;
        else
            $main_return_data['totals'] = $error_data;
        if (!empty($request->tableCodes) && is_array($request->tableCodes)) {
            $main_return_data['tableCodes'] = $this->saveSpecialHandlingCode($hawb_id, $request->tableCodes);
        }
        $status = $request->status;
        $update_arr = [
            'status' => $status,
            'ho_name' => $request->agent_head_office['ho_name'],
            'ho_address' => $request->agent_head_office['ho_address'],
            'ho_city' => $request->agent_head_office['ho_city'],
            'ho_pincode' => $request->agent_head_office['ho_pincode'],
            'ho_state' => $request->agent_head_office['ho_state'],
            'ho_country' => $request->agent_head_office['ho_country'],
            'as_agreed' => $request->as_agreed ?? 0,
        ];
        HousewayBills::where(['id' => $hawb_id])->update($update_arr);
        $send_response = [];
        if ($status == 'send') {
            $send_response = $this->conversionController->HouseWayBillConversion($hawb_id);
            $send_response = $send_response->getData(true);
            HousewayBills::where(['id' => $hawb_id])->update(['t_id' => $send_response['data']['tid'], 'send_created' => $send_response['data']['created'], 'send_status' => $send_response['status']]);
        }
        return response()->json(['data' => $main_return_data, 'send_response' => $send_response]);
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

    public function update(Request $request, $id)
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
            $error_data = $this->routingInformation($id, $request->routing_information);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['routing_information'] = $error_data;
        }
        // && !empty($request->totals['master_pcs']) && !empty($request->totals['master_weight'])
        if (!empty($id)) {
            $error_data = $this->totalAmountValume($id, $request->totals);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['totals'] = $error_data;
        }
        if (!empty($id) && !empty($request->custom_origin)) {
            $error_data = $this->customOriginAndOsiInfo($id, $request->custom_origin);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['custom_origin'] = $error_data;
        }
        if (!empty($id) && !empty($request->oci_entries)) {
            $error_data = $this->otherCustomInformation($id, $request->oci_entries);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['oci_entries'] = $error_data;
        }
        if (!empty($id) && !empty($request->shipper_address['ship_name'])) {
            $error_data = $this->saveShipperAddress($id, $request->shipper_address, $request->is_shipper_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['shipper_address'] = $error_data;
        }
        // for storing consignee address
        if (!empty($id) && !empty($request->consignee_address['cons_name'])) {
            $error_data = $this->saveConsigneeAddress($id, $request->consignee_address, $request->is_consignee_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['consignee_address'] = $error_data;
        }
        //for storing also notify address
        if (!empty($id) && !empty($request->also_notify_address['also_name'])) {
            $error_data = $this->saveAlsoNotify($id, $request->also_notify_address, $request->is_also_notify_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['also_notify_address'] = $error_data;
        }
        if (!empty($id) && !empty($request->payment_info['currency']) && !empty($request->payment_info['type_of_payment'])) {
            $error_data = $this->paymentInformation($id, $request->payment_info);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['payment_info'] = $error_data;
        }
        if (!empty($id) && !empty($request->charges)) {
            $main_return_data['charges'] = $this->otherCharges($id, $request->charges);
        }
        if (!empty($id) && !empty($request->entries)) {
            $main_return_data['entries'] = $this->consignmentInformation($id, $request->entries);
        }
        if (!empty($id) && !empty($request->tableCodes) && is_array($request->tableCodes)) {
            $main_return_data['tableCodes'] = $this->saveSpecialHandlingCode($id, $request->tableCodes);
        }

        $status = $request->status;
        $update_arr = [
            'status' => $status,
            'ho_name' => $request->agent_head_office['ho_name'],
            'ho_address' => $request->agent_head_office['ho_address'],
            'ho_city' => $request->agent_head_office['ho_city'],
            'ho_pincode' => $request->agent_head_office['ho_pincode'],
            'ho_state' => $request->agent_head_office['ho_state'],
            'ho_country' => $request->agent_head_office['ho_country'],
            'as_agreed' => $request->as_agreed ?? 0,
        ];
        if ($status != 'generate_pdf')
            HousewayBills::where(['id' => $id])->update($update_arr);
        $send_response = [];
        if ($status == 'send') {
            $send_response = $this->conversionController->HouseWayBillConversion($id);
            $send_response = $send_response->getData(true);
            HousewayBills::where(['id' => $id])->update(['t_id' => $send_response['data']['tid'], 'send_created' => $send_response['data']['created'], 'send_status' => $send_response['status']]);
        }
        return response()->json(['data' => $main_return_data, 'send_response' => $send_response]);
    }

    public function show($id)
    {
        $housewayBill = HousewayBills::with([
            'paymentInfo',
            'wayBillAddress',
            'savedAddress',
            'consignmentData',
            'otherCharge',
            'otherCustomInformation'
        ])->find($id);
        if (!$housewayBill) {
            return response()->json(['message' => 'Record not found'], 404);
        }
        return response()->json($housewayBill, 200);
    }

    public function getAllHawb($status)
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $agentId = $user->branch_name;
        $housewayBill = array();
        $query = HousewayBills::with(['paymentInfo', 'wayBillAddress', 'savedAddress', 'consignmentData', 'otherCharge', 'otherCustomInformation'])->where('agent_id', $agentId);
        if ($status == 'send')
            $housewayBill = $query->whereIn('status', ['send', 'generate_pdf'])->orderBy('created_at', 'desc')->limit(10)->get();
        else
            $housewayBill = $query->where('status', $status)->orderBy('created_at', 'desc')->limit(10)->get();
        if ($housewayBill->isEmpty()) {
            return response()->json([], 200);
        }
        return response()->json($housewayBill, 200);
    }

    public function getShippers(Request $request)
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $agentId = $user->branch_name;
        $shippers = SavedAddress::where(function($q) use ($agentId) {
            if ($agentId) {
                $q->where('agent_id', $agentId)->orWhereNull('agent_id');
            }
        })->get();

        if ($shippers->isEmpty()) {
            $shippers = SavedAddress::all();
        }
        return response()->json($shippers);
    }
    public function getShipperAddress(Request $request)
    {
        return $this->getAddressByType($request, $request->address_type ?? 'shipper_address', 'ship');
    }
    public function getConsigneeAddress(Request $request)
    {
        return $this->getAddressByType($request, $request->query('address_type', 'consignee_address'), 'cons');
    }
    public function getAlsoNotifyAddress(Request $request)
    {
        return $this->getAddressByType($request, $request->query('address_type', 'also_notify_address'), 'also');
    }
    }
}
