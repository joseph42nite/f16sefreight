<?php

namespace App\Http\Controllers\airwayBill;

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

class HousewayBill extends Controller
{
    public function get_agent()
    {
        $data = Agent::where('user_id', 1)->get(['agent_name', 'agent_address', 'agent_issue_sign', 'agent_issue_loc_code', 'agent_issue_date', 'agent_pincode', 'agent_city', 'agent_account', 'office_airport', 'office_function_designator', 'office_company_designator', 'iata_agent_code', 'iata_agent_cass', 'office_file_reference', 'participant', 'participant_airport', 'prticipant_identifer', 'participant_code', 'participant_file_reference']);
        return json_encode($data);
    }
    public function getCountry(){
        $countries = config('country');
        return response()->json($countries);
    }
    private function saveShipperAddress($hawb_no, $shipper_address, $is_shipper_address_save)
    {
        $validator = Validator::make($shipper_address, [
            'ship_name' => 'required|string|max:70',
            'ship_account' => 'required|string|max:14',
            'ship_address' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:40',
            'ship_address_line_2' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:30',
            'ship_city' => 'required|string|max:70',
            'ship_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'ship_post_code' => 'nullable|regex:/^[0-9]+$/|max:9',
            'ship_state' => 'nullable|string|max:9',
            'ship_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'ship_phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'ship_fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'ship_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        //for update
        $WayBillAddress = WayBillAddress::where('awb_id', $hawb_no)->first();
        if(!empty($WayBillAddress)){
            $WayBillAddress->awb_id = $hawb_no;
            $WayBillAddress->ship_name = $shipper_address['ship_name'];
            $WayBillAddress->ship_account = $shipper_address['ship_account'];
            $WayBillAddress->ship_address = $shipper_address['ship_address'];
            $WayBillAddress->ship_address_line_2 = $shipper_address['ship_address_line_2'];
            $WayBillAddress->ship_city = $shipper_address['ship_city'];
            $WayBillAddress->ship_airport_code = $shipper_address['ship_airport_code'];
            $WayBillAddress->ship_post_code = $shipper_address['ship_post_code'];
            $WayBillAddress->ship_state = $shipper_address['ship_state'];
            $WayBillAddress->ship_country = $shipper_address['ship_country'];
            $WayBillAddress->ship_phone = $shipper_address['ship_phone'];
            $WayBillAddress->ship_fax = $shipper_address['ship_fax'];
            $WayBillAddress->ship_telex = $shipper_address['ship_telex'];
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
        $WayBillAddress->ship_account = $shipper_address['ship_account'];
        $WayBillAddress->ship_address = $shipper_address['ship_address'];
        $WayBillAddress->ship_address_line_2 = $shipper_address['ship_address_line_2'];
        $WayBillAddress->ship_city = $shipper_address['ship_city'];
        $WayBillAddress->ship_airport_code = $shipper_address['ship_airport_code'];
        $WayBillAddress->ship_post_code = $shipper_address['ship_post_code'];
        $WayBillAddress->ship_state = $shipper_address['ship_state'];
        $WayBillAddress->ship_country = $shipper_address['ship_country'];
        $WayBillAddress->ship_phone = $shipper_address['ship_phone'];
        $WayBillAddress->ship_fax = $shipper_address['ship_fax'];
        $WayBillAddress->ship_telex = $shipper_address['ship_telex'];
        $WayBillAddress->save();

        //insert address if saved button checked
        if ($is_shipper_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $hawb_no], ['address_type', 'shipper_address']])->first();
            if(!empty($hawb_no)){
                dd();
                 $SavedAddress->awb_id = $hawb_no;
                $SavedAddress->user_id = '123456';
                $SavedAddress->address_type = 'shipper_address';
                $SavedAddress->name = $shipper_address['ship_name'];
                $SavedAddress->account = $shipper_address['ship_account'];
                $SavedAddress->address = $shipper_address['ship_address'];
                $SavedAddress->address_line_2 = $shipper_address['ship_address_line_2'];
                $SavedAddress->city = $shipper_address['ship_city'];
                $SavedAddress->airport_code = $shipper_address['ship_airport_code'];
                $SavedAddress->post_code = $shipper_address['ship_post_code'];
                $SavedAddress->state = $shipper_address['ship_state'];
                $SavedAddress->country = $shipper_address['ship_country'];
                $SavedAddress->phone = $shipper_address['ship_phone'];
                $SavedAddress->fax = $shipper_address['ship_fax'];
                $SavedAddress->telex = $shipper_address['ship_telex'];
                dd($SavedAddress);die;
                $SavedAddress->save();
                return response()->json([
                    'message' => 'Shippers Information updated successfully',
                    'data' => $SavedAddress
                ], 200);
            }
            if (!isset($SavedAddress))
            dd("sdfd");die;
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $hawb_no;
            $SavedAddress->user_id = '123456';
            $SavedAddress->address_type = 'shipper_address';
            $SavedAddress->name = $shipper_address['ship_name'];
            $SavedAddress->account = $shipper_address['ship_account'];
            $SavedAddress->address = $shipper_address['ship_address'];
            $SavedAddress->address_line_2 = $shipper_address['ship_address_line_2'];
            $SavedAddress->city = $shipper_address['ship_city'];
            $SavedAddress->airport_code = $shipper_address['ship_airport_code'];
            $SavedAddress->post_code = $shipper_address['ship_post_code'];
            $SavedAddress->state = $shipper_address['ship_state'];
            $SavedAddress->country = $shipper_address['ship_country'];
            $SavedAddress->phone = $shipper_address['ship_phone'];
            $SavedAddress->fax = $shipper_address['ship_fax'];
            $SavedAddress->telex = $shipper_address['ship_telex'];
            $SavedAddress->save();
        }
        return 'shipper address saved successfull';
    }
    private function saveConsigneeAddress($hawb_no, $consignee_address, $is_consignee_address_save)
    {
        $validator = Validator::make($consignee_address, [
            'cons_name' => 'required|string|max:70',
            'cons_account' => 'required|string|max:14',
            'cons_address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            'cons_address_line_2' => 'required|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'cons_city' => 'required|string|max:70',
            'cons_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'cons_post_code' => 'nullable|regex:/^[0-9]+$/|max:9',
            'cons_state' => 'nullable|string|max:9',
            'cons_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'cons_phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
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
        $WayBillAddress->cons_account = $consignee_address['cons_account'];
        $WayBillAddress->cons_address = $consignee_address['cons_address'];
        $WayBillAddress->cons_address_line_2 = $consignee_address['cons_address_line_2'];
        $WayBillAddress->cons_city = $consignee_address['cons_city'];
        $WayBillAddress->cons_airport_code = $consignee_address['cons_airport_code'];
        $WayBillAddress->cons_post_code = $consignee_address['cons_post_code'];
        $WayBillAddress->cons_state = $consignee_address['cons_state'];
        $WayBillAddress->cons_country = $consignee_address['cons_country'];
        $WayBillAddress->cons_phone = $consignee_address['cons_phone'];
        $WayBillAddress->cons_fax = $consignee_address['cons_fax'];
        $WayBillAddress->cons_telex = $consignee_address['cons_telex'];
        $WayBillAddress->save();

        //insert address if saved button checked
        if ($is_consignee_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $hawb_no], ['address_type', 'consignee_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $hawb_no;
            $SavedAddress->user_id = '123456';
            $SavedAddress->address_type = 'consignee_address';
            $SavedAddress->name = $consignee_address['cons_name'];
            $SavedAddress->account = $consignee_address['cons_account'];
            $SavedAddress->address = $consignee_address['cons_address'];
            $SavedAddress->address_line_2 = $consignee_address['cons_address_line_2'];
            $SavedAddress->city = $consignee_address['cons_city'];
            $SavedAddress->airport_code = $consignee_address['cons_airport_code'];
            $SavedAddress->post_code = $consignee_address['cons_post_code'];
            $SavedAddress->state = $consignee_address['cons_state'];
            $SavedAddress->country = $consignee_address['cons_country'];
            $SavedAddress->phone = $consignee_address['cons_phone'];
            $SavedAddress->fax = $consignee_address['cons_fax'];
            $SavedAddress->telex = $consignee_address['cons_telex'];
            $SavedAddress->save();
        }
        return "consignee address saved successfull";
    }
    private function saveAlsoNotify($hawb_no, $also_notify_address, $is_also_notify_address_save)
    {
        $validator = Validator::make($also_notify_address, [
            'also_name' => 'required|string|max:70',
            'also_address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            'also_address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'also_city' => 'required|string|max:70',
            'also_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'also_post_code' => 'nullable|regex:/^[0-9]+$/|max:9',
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
        $WayBillAddress->also_address_line_2 = $also_notify_address['also_address_line_2'];
        $WayBillAddress->also_city = $also_notify_address['also_city'];
        $WayBillAddress->also_airport_code = $also_notify_address['also_airport_code'];
        $WayBillAddress->also_post_code = $also_notify_address['also_post_code'];
        $WayBillAddress->also_state = $also_notify_address['also_state'];
        $WayBillAddress->also_country = $also_notify_address['also_country'];
        $WayBillAddress->also_phone = $also_notify_address['also_phone'];
        $WayBillAddress->also_fax = $also_notify_address['also_fax'];
        $WayBillAddress->also_telex = $also_notify_address['also_telex'];
        $WayBillAddress->save();

        if ($is_also_notify_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $hawb_no], ['address_type', 'also_notify_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $hawb_no;
            $SavedAddress->user_id = '123456';
            $SavedAddress->address_type = 'also_notify_address';
            $SavedAddress->name = $also_notify_address['also_name'];
            $SavedAddress->address = $also_notify_address['also_address'];
            $SavedAddress->address_line_2 = $also_notify_address['also_address_line_2'];
            $SavedAddress->city = $also_notify_address['also_city'];
            $SavedAddress->airport_code = $also_notify_address['also_airport_code'];
            $SavedAddress->post_code = $also_notify_address['also_post_code'];
            $SavedAddress->state = $also_notify_address['also_state'];
            $SavedAddress->country = $also_notify_address['also_country'];
            $SavedAddress->phone = $also_notify_address['also_phone'];
            $SavedAddress->fax = $also_notify_address['also_fax'];
            $SavedAddress->telex = $also_notify_address['also_telex'];
            $SavedAddress->save();
        }
        return "Also notify address saved successfull";
    }
    private function firstBox($first_box, $id = null)
    {
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
            $HousewayBill->save();
    
            return response()->json([
                'message' => 'First box created successfully',
                'data' => $HousewayBill
            ], 201);
        }
    }

    private function routingInformation($hawb_no, $routing_information)
    {
        $validator = Validator::make($routing_information, [
            'departure_airport' => 'required|string',
            'destination_airport' => 'required|string',
            'from' => 'nullable|string',
            'to' => 'required|string',
            'by' => 'required|string|size:2',
            'flight' => 'required|regex:/^[a-zA-Z0-9]+$/|max:5',
            'date' => 'required|string',
            'to_2' => 'nullable|string',
            'by_2' => 'nullable|string|size:2',
            'flight_2' => 'nullable|string|max:5',
            'date_2' => 'nullable|string',
            'to_3' => 'nullable|string',
            'by_3' => 'nullable|string|size:2',
            'flight_3' => 'nullable|string|max:5',
            'date_3' => 'nullable|string',
            'master_origin' => 'required|regex:/^[a-zA-Z0-9]+$/|max:3',
            'master_destination' => 'required|regex:/^[a-zA-Z0-9]+$/|max:3'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $HousewayBills = HousewayBills::find($hawb_no);
        if(!empty($hawb_no)){
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
    //    dd($HousewayBills);die;
       $HousewayBills->save();
        return "Routing Information saved successfull";
    }
    private function consignmentInformation($hawb_no, $entries)
    {
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
            $ConsignmentData->uld_info = json_encode($entries[$i]['uld_info']);
            $ConsignmentData->save();
            return "Consignment Data saved successfull";
        }
    }
    private function customOriginAndOsiInfo($hawb_no, $custom_origin)
    {
        $validator = Validator::make($custom_origin, [
            'customs_origin_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'accounting_information' => 'nullable|string|max:70',
            'special_service_request' => 'nullable|string|max:195',
            'other_service_information' => 'nullable|string|max:195',
            'shipment_ref_no' => 'nullable|string|max:35',
            'supplementary_shipment_info' => 'nullable|string|max:35',
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
        $HousewayBills->letter_credit = $custom_origin['letter_credit'];
        $HousewayBills->extra_print = $custom_origin['extra_print'];
        $HousewayBills->save();
        return "Custom Origin Code and other tab information save successfully";
    }
    private function otherCharges($hawb_no, $charges)
    {
        for ($i = 0; $i < sizeof($charges); $i++) {
            $validator = Validator::make($charges[$i], [
                'payment_type' => 'nullable|string',
                'other_code' => 'nullable|string',
                'other_charge_code' => 'nullable|string',
                'amount' => 'nullable|numeric|min:0.01|max:999999999',
                'due' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $other_charge_code = $charges[$i]['other_charge_code'];
            $otherChargesData = OtherCharge::where([['awb_id', $hawb_no], ['other_charge_code', $other_charge_code]])->first();

            if (!isset($otherChargesData)) {
                $otherChargesData = new OtherCharge();
            }
            $otherChargesData->awb_id = $hawb_no;
            $otherChargesData->other_charge_code = $other_charge_code;
            $otherChargesData->other_code = $charges[$i]['other_code'];
            $otherChargesData->payment_type = $charges[$i]['payment_type'];
            $otherChargesData->due = $charges[$i]['due'];
            $otherChargesData->amount = $charges[$i]['amount'];
            $otherChargesData->save();
        }
        return "Other Charges Data saved successfully";
    }
    private function paymentInformation($hawb_no, $payment_info)
    {
        // dd($payment_info['declear_value_carriage']);die;
        $validator = Validator::make($payment_info, [
            'type_of_payment' => 'required',
            // 'total_charges' => 'required|numeric|min:0.000|max:999999999999',
            'currency' => 'nullable|string|size:3',
            'declear_value_carriage' => [
                'required', 
                function ($attribute, $value, $fail) {
                    if (!is_numeric($value) && $value !== 'NVD') {
                        $fail($attribute.' must be a number or "NVD".');
                    } elseif (is_numeric($value) && ($value < 0 || $value > 999999999999)) {
                        $fail($attribute.' must be a number between 0.000 and 999999999999.');
                    }
                }
            ],
            'declear_value_customs' => [
                'required', 
                function ($attribute, $value, $fail) {
                    if (!is_numeric($value) && $value !== 'NCV') {
                        $fail($attribute.' must be a number or "NCV".');
                    } elseif (is_numeric($value) && ($value < 0 || $value > 999999999999)) {
                        $fail($attribute.' must be a number between 0.000 and 999999999999.');
                    }
                }
            ],
            'declear_value_insurance' => [
                'required', 
                function ($attribute, $value, $fail) {
                    if (!is_numeric($value) && $value !== 'XXX') {
                        $fail($attribute.' must be a number or "XXX".');
                    } elseif (is_numeric($value) && ($value < 0 || $value > 999999999999)) {
                        $fail($attribute.' must be a number between 0.000 and 999999999999.');
                    }
                }
            ],
            'weight_charge' => 'required|numeric|min:0.000|max:999999999999',
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
        $HousewayBills->declear_value_carriage =  $payment_info['declear_value_carriage'];
        $HousewayBills->declear_value_customs =  $payment_info['declear_value_customs'];
        $HousewayBills->declear_value_insurance =  $payment_info['declear_value_insurance'];
        $HousewayBills->weight_charge = $payment_info['weight_charge'];
        $HousewayBills->taxes = $payment_info['taxes'];
        $HousewayBills->total_charges_prepaid = $payment_info['total_charges_prepaid'];
        $HousewayBills->total_charges_collect = $payment_info['total_charges_collect'];
        $HousewayBills->other_charges_due_agent_prepaid = $payment_info['other_charges_due_agent_prepaid'];
        $HousewayBills->other_charges_due_agent_collect = $payment_info['other_charges_due_agent_collect'];
        $HousewayBills->other_charges_due_carrier_prepaid = $payment_info['other_charges_due_carrier_prepaid'];
        $HousewayBills->other_charges_due_carrier_collect = $payment_info['other_charges_due_carrier_collect'];
        
        $HousewayBills->save();
        return "Payment Information save successfully";
    }
    private function otherCustomInformation($hawb_no, $oci_entries)
    {
        foreach ($oci_entries as $oci_entry) {
            $validator = Validator::make($oci_entry, [
                'country_code' => 'required|string|max:2',
                'info_identifier' => 'required|string|max:3',
                'custom_info_identifier' => 'required|string|max:2',
                'supplementary_info' => 'required|string|max:70|regex:/^[a-zA-Z0-9\s\-]+$/',
            ],[
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
            if (!$OtherCustomInfo->save()) {
                Log::error('Failed to save OtherCustomInformation for AWB:', ['awb_id' => $hawb_no, 'oci_entry' => $oci_entry]);
            }
        }
        return "Other Custom Information saved successfully";
    }
    private function totalAmountValume($hawb_no, $totals)
    {
        $validator = Validator::make($totals, [
            'total_volume' => 'required|numeric|min:0|max:999999999',
            //'required|regex:/^[0-9]+$/|max:9',
            'total_amount' => 'required|numeric|min:0.01|max:999999999',
            'master_pcs' => 'required|regex:/^[0-9]+$/|max:4',
            'master_weight' => 'required|numeric|min:0.1|max:9999999|regex:/^\d{1,7}(\.\d{1,3})?$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $HousewayBills = HousewayBills::find($hawb_no);
        if (!empty($hawb_no)) {
            $HousewayBills->id = $hawb_no;
            $HousewayBills->total_volume = $totals['total_volume'];
            $HousewayBills->total_amount = $totals['total_amount'];
            $HousewayBills->master_pcs = $totals['master_pcs'];
            $HousewayBills->master_weight = $totals['master_weight'];
            $HousewayBills->save();
            return response()->json([
                'message' => 'Toatl Amount and Total Volume updated successfully',
                'data' => $HousewayBills
            ], 200);
        }else{
        // if (!isset($HousewayBills))
            $HousewayBills = new HousewayBills();
        $HousewayBills->total_volume = $totals['total_volume'];
        $HousewayBills->total_amount = $totals['total_amount'];
        $HousewayBills->master_pcs = $totals['master_pcs'];
        $HousewayBills->master_weight = $totals['master_weight'];
        $HousewayBills->save();
        }
        return "Toatl Amount and Total Volume saved successfull";
    }
    private function saveSpecialHandlingCode($hawb_no, $tableCodes)
    {
        if (empty($tableCodes)) {
            return "Code is missing in tableCodes entry.";
        }
        $codesArray = [];
        foreach ($tableCodes as $code) {
            if (!empty($code)) {
                $codesArray[] = $code;
            }
        }
        $codesJson = json_encode($codesArray);
        $handlingCode = HousewayBills::find($hawb_no)->first();
        if (!$handlingCode) {
            $handlingCode = new HousewayBills();
        }
        $handlingCode->special_handling_info = $codesJson;
        $handlingCode->save();
        return "Special Handling Codes saved successfully.";
    }

    public function store(Request $request)
    {
        $main_return_data = [];
        $error_data = '';
        //for storing shipper address
        if (!empty($request->shipper_address['ship_name']) && !empty($request->shipper_address['ship_country']) && !empty($request->shipper_address['ship_city'])) {
            $error_data = $this->saveShipperAddress($request->first_box['hawb_no'], $request->shipper_address, $request->is_shipper_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['shipper_address'] = $error_data;
        }
        // for storing consignee address
        if (!empty($request->consignee_address['cons_name']) && !empty($request->consignee_address['cons_country']) && !empty($request->consignee_address['cons_city'])) {
            $error_data = $this->saveConsigneeAddress($request->first_box['hawb_no'], $request->consignee_address, $request->is_consignee_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['consignee_address'] = $error_data;
        }
        //for storing also notify address
        if (!empty($request->also_notify_address['also_name']) && !empty($request->also_notify_address['also_country']) && !empty($request->also_notify_address['also_city'])) {
            $error_data = $this->saveAlsoNotify($request->first_box['hawb_no'], $request->also_notify_address, $request->is_also_notify_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['also_notify_address'] = $error_data;
        }
        if (!empty($request->first_box['hawb_no']) && !empty($request->first_box['awb_code']) && !empty($request->first_box['awb_no'])) {
            $error_data = $this->firstBox($request->first_box);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['first_box'] = $error_data;
        }
        // && !empty($request->routing_information['from'])
        if (!empty($request->routing_information['departure_airport']) && !empty($request->routing_information['destination_airport']) && !empty($request->routing_information['to']) && !empty($request->routing_information['date'])) {
            $error_data = $this->routingInformation($request->first_box['hawb_no'], $request->routing_information);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['routing_information'] = $error_data;
        }
        //for storing Consignment Information
        if (!empty($request->entries)) {
            $main_return_data['entries'] = $this->consignmentInformation($request->first_box['hawb_no'], $request->entries);
        }
        //for custom origin code and OSI, SSR, Accounting and shipment reference information
        if (!empty($request->custom_origin)) {
            $error_data = $this->customOriginAndOsiInfo($request->first_box['hawb_no'], $request->custom_origin);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['custom_origin'] = $error_data;
        }
        // for other charges 
        if (!empty($request->charges)) {
            $main_return_data['charges'] = $this->otherCharges($request->first_box['hawb_no'], $request->charges);
        }
        //For payment information
        if (!empty($request->payment_info['currency']) && !empty($request->payment_info['type_of_payment']) && !empty($request->payment_info['weight_charge'])) {
            $error_data = $this->paymentInformation($request->first_box['hawb_no'], $request->payment_info);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['payment_info'] = $error_data;
        }
        //for Other custom Information
        if (!empty($request->oci_entries)) {
            $error_data = $this->otherCustomInformation($request->first_box['hawb_no'], $request->oci_entries);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['oci_entries'] = $error_data;
        }
        //for Total Consignee Amount and Total Volume
        if (!empty($request->totals['total_volume']) && !empty($request->totals['total_amount'])) {
            $error_data = $this->totalAmountValume($request->first_box['hawb_no'], $request->totals);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['totals'] = $error_data;
        }
        if (!empty($request->tableCodes) && is_array($request->tableCodes)) {
            $main_return_data['tableCodes'] = $this->saveSpecialHandlingCode($request->first_box['hawb_no'], $request->tableCodes);
        }
        return json_encode($main_return_data);
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
            'dimention_unit' => 'nullable|string|max:3',
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
        if (!empty($id) && !empty($request->routing_information['departure_airport']) && !empty($request->routing_information['destination_airport']) && !empty($request->routing_information['to']) && !empty($request->routing_information['date'])) {
            $error_data = $this->routingInformation($id, $request->routing_information);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['routing_information'] = $error_data;
        }
        if (!empty($id) && !empty($request->totals['total_volume']) && !empty($request->totals['total_amount'])) {
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
        if (!empty($id) && !empty($request->shipper_address['ship_name']) && !empty($request->shipper_address['ship_country']) && !empty($request->shipper_address['ship_city'])) {
            $error_data = $this->saveShipperAddress($id, $request->shipper_address, $request->is_shipper_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['shipper_address'] = $error_data;
        }
        // for storing consignee address
        if (!empty($id) && !empty($request->consignee_address['cons_name']) && !empty($request->consignee_address['cons_country']) && !empty($request->consignee_address['cons_city'])) {
            $error_data = $this->saveConsigneeAddress($id, $request->consignee_address, $request->is_consignee_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['consignee_address'] = $error_data;
        }
        //for storing also notify address
        if (!empty($id) && !empty($request->also_notify_address['also_name']) && !empty($request->also_notify_address['also_country']) && !empty($request->also_notify_address['also_city'])) {
            $error_data = $this->saveAlsoNotify($id, $request->also_notify_address, $request->is_also_notify_address_save);
            if (!is_string($error_data) && $error_data->getStatusCode() == 422)
                return $error_data;
            else
                $main_return_data['also_notify_address'] = $error_data;
        }
        if (!empty($id) && !empty($request->payment_info['currency']) && !empty($request->payment_info['type_of_payment']) && !empty($request->payment_info['weight_charge'])) {
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
    }

    public function show($id){
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

    public function getAllHawb(){
        $housewayBill = HousewayBills::with([
            'paymentInfo',
            'wayBillAddress',
            'savedAddress',
            'consignmentData',
            'otherCharge',
            'otherCustomInformation'
        ])->get();
        if ($housewayBill->isEmpty()) {
            return response()->json(['message' => 'Record not found'], 404);
        }
        return response()->json($housewayBill, 200);
    }   
}