<?php

namespace App\Http\Controllers\airwayBill;

use App\Agent;
use App\AirwayBills;
use App\Http\Controllers\Controller;
use App\PaymentInfo;
use App\WayBillAddress;
use App\SavedAddress;
use App\ConsignmentData;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AirwayBill extends Controller
{
    public function get_agent()
    {
        $data = Agent::where('user_id', 1)->get(['agent_name', 'agent_address', 'agent_issue_sign', 'agent_issue_loc_code', 'agent_issue_date', 'agent_pincode', 'agent_city', 'agent_account', 'office_airport', 'office_function_designator', 'office_company_designator', 'iata_agent_code', 'iata_agent_cass', 'office_file_reference', 'participant', 'participant_airport', 'prticipant_identifer', 'participant_code', 'participant_file_reference']);
        return json_encode($data);
    }
    private function saveShipperAddress($awb_no, $shipper_address, $is_shipper_address_save)
    {
        $validator = Validator::make($shipper_address, [
            'name' => 'required|string|max:70',
            'account' => 'nullable|string|max:14',
            // 'address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            // 'address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'city' => 'required|string|max:70',
            // 'airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'post_code' => 'nullable|string|max:9',
            'state' => 'nullable|string|max:9',
            'country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
        ]);
        if ($validator->fails()) {
            Log::error('Validation failed:', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        //for update
        $WayBillAddress = WayBillAddress::where('awb_id', $awb_no)->first();

        //for insert
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = $awb_no;
        $WayBillAddress->ship_name = $shipper_address['name'];
        $WayBillAddress->ship_account = $shipper_address['account'];
        $WayBillAddress->ship_address = $shipper_address['address'];
        $WayBillAddress->ship_address_line_2 = $shipper_address['address_line_2'];
        $WayBillAddress->ship_city = $shipper_address['city'];
        $WayBillAddress->ship_airport_code = $shipper_address['airport_code'];
        $WayBillAddress->ship_post_code = $shipper_address['post_code'];
        $WayBillAddress->ship_state = $shipper_address['state'];
        $WayBillAddress->ship_country = $shipper_address['country'];
        $WayBillAddress->ship_phone = $shipper_address['phone'];
        $WayBillAddress->ship_fax = $shipper_address['fax'];
        $WayBillAddress->ship_telex = $shipper_address['telex'];
        $WayBillAddress->save();

        //insert address if saved button checked
        if ($is_shipper_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $awb_no], ['address_type', 'shipper_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $awb_no;
            $SavedAddress->user_id = '123456';
            $SavedAddress->address_type = 'shipper_address';
            $SavedAddress->name = $shipper_address['name'];
            $SavedAddress->account = $shipper_address['account'];
            $SavedAddress->address = $shipper_address['address'];
            $SavedAddress->address_line_2 = $shipper_address['address_line_2'];
            $SavedAddress->city = $shipper_address['city'];
            $SavedAddress->airport_code = $shipper_address['airport_code'];
            $SavedAddress->post_code = $shipper_address['post_code'];
            $SavedAddress->state = $shipper_address['state'];
            $SavedAddress->country = $shipper_address['country'];
            $SavedAddress->phone = $shipper_address['phone'];
            $SavedAddress->fax = $shipper_address['fax'];
            $SavedAddress->telex = $shipper_address['telex'];
            $SavedAddress->save();
        }
        return "shipper address saved successfull";
    }
    private function saveConsigneeAddress($awb_no, $consignee_address, $is_consignee_address_save)
    {
        $validator = Validator::make($consignee_address, [
            'name' => 'required|string|max:70',
            'account' => 'nullable|string|max:14',
            // 'address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            // 'address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'city' => 'required|string|max:70',
            // 'airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'post_code' => 'nullable|string|max:9',
            'state' => 'nullable|string|max:9',
            'country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
        ]);
        if ($validator->fails()) {
            Log::error('Validation failed:', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $WayBillAddress = WayBillAddress::where('awb_id', $awb_no)->first();
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = $awb_no;
        $WayBillAddress->cons_name = $consignee_address['name'];
        $WayBillAddress->cons_account = $consignee_address['account'];
        $WayBillAddress->cons_address = $consignee_address['address'];
        $WayBillAddress->cons_address_line_2 = $consignee_address['address_line_2'];
        $WayBillAddress->cons_city = $consignee_address['city'];
        $WayBillAddress->cons_airport_code = $consignee_address['airport_code'];
        $WayBillAddress->cons_post_code = $consignee_address['post_code'];
        $WayBillAddress->cons_state = $consignee_address['state'];
        $WayBillAddress->cons_country = $consignee_address['country'];
        $WayBillAddress->cons_phone = $consignee_address['phone'];
        $WayBillAddress->cons_fax = $consignee_address['fax'];
        $WayBillAddress->cons_telex = $consignee_address['telex'];
        $WayBillAddress->save();

        //insert address if saved button checked
        if ($is_consignee_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $awb_no], ['address_type', 'consignee_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $awb_no;
            $SavedAddress->user_id = '123456';
            $SavedAddress->address_type = 'consignee_address';
            $SavedAddress->name = $consignee_address['name'];
            $SavedAddress->account = $consignee_address['account'];
            $SavedAddress->address = $consignee_address['address'];
            $SavedAddress->address_line_2 = $consignee_address['address_line_2'];
            $SavedAddress->city = $consignee_address['city'];
            $SavedAddress->airport_code = $consignee_address['airport_code'];
            $SavedAddress->post_code = $consignee_address['post_code'];
            $SavedAddress->state = $consignee_address['state'];
            $SavedAddress->country = $consignee_address['country'];
            $SavedAddress->phone = $consignee_address['phone'];
            $SavedAddress->fax = $consignee_address['fax'];
            $SavedAddress->telex = $consignee_address['telex'];
            $SavedAddress->save();
        }
        return "consignee address saved successfull";
    }
    private function saveAlsoNotify($awb_no, $also_notify_address, $is_also_notify_address_save)
    {
        $validator = Validator::make($also_notify_address, [
            'name' => 'required|string|max:70',
            // 'address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            // 'address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'city' => 'required|string|max:70',
            // 'airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'post_code' => 'nullable|string|max:9',
            'state' => 'nullable|string|max:9',
            'country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
        ]);
        if ($validator->fails()) {
            Log::error('Validation failed:', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        $WayBillAddress = WayBillAddress::where('awb_id', $awb_no)->first();
        if (!isset($WayBillAddress))
            $WayBillAddress = new WayBillAddress();
        $WayBillAddress->awb_id = $awb_no;
        $WayBillAddress->also_name = $also_notify_address['name'];
        $WayBillAddress->cons_address = $also_notify_address['address'];
        $WayBillAddress->also_address_line_2 = $also_notify_address['address_line_2'];
        $WayBillAddress->also_city = $also_notify_address['city'];
        $WayBillAddress->also_airport_code = $also_notify_address['airport_code'];
        $WayBillAddress->also_post_code = $also_notify_address['post_code'];
        $WayBillAddress->also_state = $also_notify_address['state'];
        $WayBillAddress->also_country = $also_notify_address['country'];
        $WayBillAddress->also_phone = $also_notify_address['phone'];
        $WayBillAddress->also_fax = $also_notify_address['fax'];
        $WayBillAddress->also_telex = $also_notify_address['telex'];
        $WayBillAddress->save();

        if ($is_also_notify_address_save) {
            $SavedAddress = SavedAddress::where([['awb_id', $awb_no], ['address_type', 'also_notify_address']])->first();
            if (!isset($SavedAddress))
                $SavedAddress = new SavedAddress();
            $SavedAddress->awb_id = $awb_no;
            $SavedAddress->user_id = '123456';
            $SavedAddress->address_type = 'also_notify_address';
            $SavedAddress->name = $also_notify_address['name'];
            $SavedAddress->address = $also_notify_address['address'];
            $SavedAddress->address_line_2 = $also_notify_address['address_line_2'];
            $SavedAddress->city = $also_notify_address['city'];
            $SavedAddress->airport_code = $also_notify_address['airport_code'];
            $SavedAddress->post_code = $also_notify_address['post_code'];
            $SavedAddress->state = $also_notify_address['state'];
            $SavedAddress->country = $also_notify_address['country'];
            $SavedAddress->phone = $also_notify_address['phone'];
            $SavedAddress->fax = $also_notify_address['fax'];
            $SavedAddress->telex = $also_notify_address['telex'];
            $SavedAddress->save();
        }
        return "Also notify address saved successfull";
    }
    private function firstBox($first_box)
    {
        $validator = Validator::make($first_box, [
            'awb_code' => 'required',
            //|regex:/^[0-9]+$/|size:3
            'awb_no' => 'required',
            //|size:8
            'consolidated_MAWB' => 'nullable|boolean',
            'awb' => 'nullable|boolean',
        ]);
        if ($validator->fails()) {
            Log::error('Validation failed:', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        $AirwayBills = AirwayBills::find($first_box['awb_no']);
        if (!isset($AirwayBills))
            $AirwayBills = new AirwayBills();
        $AirwayBills->id = $first_box['awb_no'];
        $AirwayBills->awb_code = $first_box['awb_code'];
        $AirwayBills->consolidated_mawb = $first_box['consolidated_MAWB'];
        $AirwayBills->awb = $first_box['awb'];
        $AirwayBills->save();
        return "first box saved successfull";
    }
    private function routingInformation($awb_no, $routing_information)
    {
        $validator = Validator::make($routing_information, [
            'departure_airport' => 'required|string',
            'destination_airport' => 'required|string',
            'from' => 'nullable|string',
            'to' => 'required|string',
            'by' => 'required|string|max:20',
            'flight' => 'required|string|max:20',
            'date' => 'required|string',
            'to_2' => 'nullable|string',
            'by_2' => 'nullable|string|max:20',
            'flight_2' => 'nullable|string|max:20',
            'date_2' => 'nullable|string',
            'to_3' => 'nullable|string',
            'by_3' => 'nullable|string|max:20',
            'flight_3' => 'nullable|string|max:20',
            'date_3' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $AirwayBills = AirwayBills::find($awb_no);
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
        $AirwayBills->save();
        return "Routing Information saved successfull";
    }
    private function consignmentInformation($awb_no, $entries)
    {
        for ($i = 0; $i < sizeof($entries); $i++) {
            $pieces = $entries[$i]['pieces'];
            $ConsignmentData = ConsignmentData::where([['awb_id', $awb_no], ['pieces', $pieces]])->first();
            if (!isset($ConsignmentData))
                $ConsignmentData = new ConsignmentData();
            $ConsignmentData->awb_id = $awb_no;
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
    public function store(Request $request)
    {
        $main_return_data = [];
        //for storing shipper address
        if (!empty($request->shipper_address['name']) && !empty($request->shipper_address['country']) && !empty($request->shipper_address['city'])) {
            $main_return_data['shipper_address'] = $this->saveShipperAddress($request->first_box['awb_no'], $request->shipper_address, $request->is_shipper_address_save);
        }
        //for storing consignee address
        if (!empty($request->consignee_address['name']) && !empty($request->consignee_address['country']) && !empty($request->consignee_address['city'])) {
            $main_return_data['consignee_address'] = $this->saveConsigneeAddress($request->first_box['awb_no'], $request->consignee_address, $request->is_consignee_address_save);
        }
        //for storing also notify address
        if (!empty($request->also_notify_address['name']) && !empty($request->also_notify_address['country']) && !empty($request->also_notify_address['city'])) {
            $main_return_data['also_notify_address'] = $this->saveAlsoNotify($request->first_box['awb_no'], $request->also_notify_address, $request->is_also_notify_address_save);
        }
        if (!empty($request->first_box['awb_code']) && !empty($request->first_box['awb_no'])) {
            $main_return_data['first_box'] = $this->firstBox($request->first_box);
        }
        // && !empty($request->routing_information['from'])
        if (!empty($request->routing_information['departure_airport']) && !empty($request->routing_information['destination_airport']) && !empty($request->routing_information['to']) && !empty($request->routing_information['date'])) {
            $main_return_data['routing_information'] = $this->routingInformation($request->first_box['awb_no'], $request->routing_information);
        }
        //for storing Consignment Information
        if (!empty($request->entries)) {
            $main_return_data['entries'] = $this->consignmentInformation($request->first_box['awb_no'], $request->entries);
        }

        return json_encode($main_return_data);
    }
}
