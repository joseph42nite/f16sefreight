<?php

namespace App\Http\Controllers\airwayBill;

use App\Agent;
use App\AirwayBills;
use App\Http\Controllers\Controller;
use App\PaymentInfo;
use App\WayBillAddress;
use App\SavedAddress;
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
            'address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            'address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'city' => 'required|string|max:70',
            'airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
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
            'address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            'address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'city' => 'required|string|max:70',
            'airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
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
    public function store(Request $request)
    {
        $main_return_data = [];
        if (!empty($request->shipper_address['account']) && !empty($request->shipper_address['telex'])) {
            $main_return_data['shipper_address_data'] = $this->saveShipperAddress($request->awb_no, $request->shipper_address, $request->is_shipper_address_save);
        }
        if (!empty($request->consignee_address['account']) && !empty($request->consignee_address['telex'])) {
            $main_return_data['consignee_address_data'] = $this->saveConsigneeAddress($request->awb_no, $request->consignee_address, $request->is_consignee_address_save);
        }
        return json_encode($main_return_data);
    }
}
