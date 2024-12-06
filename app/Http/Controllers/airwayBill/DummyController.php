<?php

namespace App\Http\Controllers\DummyController;

use App\Agent;
use App\AirwayBills;
use App\Http\Controllers\Controller;
use App\PaymentInfo;
use App\WayBillAddress;
use App\SavedAddress;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DummyController extends Controller
{
    public function index()
    {
    }
    public function store(Request $request)
    {

        $consignee_info = json_decode($request->input('consignee_info'), true);
        $oci_entries = json_decode($request->input('oci_entries'), true);
        $other_charges = json_decode($request->input('other_charges'), true);
        $spclHandlingCode = json_decode($request->input('special_handling_code'), true);
        // Additional validation for decoded data
        $validator = Validator::make($request->all(), [
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'required|size:8',
            'consolidated_mawb' => 'nullable|boolean',
            'awb' => 'nullable|boolean',
            'accounting_information' => 'nullable|string|max:70',
            'special_service_request' => 'nullable|string|max:195',
            'other_service_information' => 'nullable|string|max:195',
            'shipment_ref_no' => 'nullable|string|max:35',
            'supplementary_shipment_Info' => 'nullable|string|max:35',

            'ship_name' => 'required|string|max:70',
            'ship_account' => 'nullable|string|max:14',
            'ship_address' => 'required|max:40|regex:/^[a-zA-Z0-9\s]+$/',
            'ship_address_line_2' => 'nullable|max:30|regex:/^[a-zA-Z0-9\s]+$/',
            'ship_city' => 'required|string|max:70',
            'ship_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            'ship_post_code' => 'nullable|string|max:9',
            'ship_state' => 'nullable|string|max:9',
            'ship_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'ship_phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            //digits_between:1,35  regex:/^[0-9]+$/
            'ship_fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'ship_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',

            'cons_name' => 'required|string|max:70',
            'cons_account' => 'nullable|string|max:14',
            'cons_city_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
            //airport code 
            'cons_address' => 'required|max:35|regex:/^[a-zA-Z0-9\s]+$/',
            'cons_address_line_2' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
            'cons_city' => 'required|string|max:70',
            'cons_post_code' => 'nullable|regex:/^[0-9]+$/|max:35',
            'cons_state' => 'nullable|string|max:9',
            'cons_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
            'cons_phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
            'cons_fax' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
            'cons_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',

            'departure_airport' => 'required|string',
            'destination_airport' => 'required|string',
            'from' => 'nullable|string',
            'to' => 'required|string',
            'by' => 'required|string|max:20',
            'flight' => 'required|string|max:20',
            'date' => 'required|string',

            'from_2' => 'nullable|string',
            'to_2' => 'nullable|string',
            'by_2' => 'nullable|string|max:20',
            'flight_2' => 'nullable|string|max:20',
            'date_2' => 'nullable|string',

            'from_3' => 'nullable|string',
            'to_3' => 'nullable|string',
            'by_3' => 'nullable|string|max:20',
            'flight_3' => 'nullable|string|max:20',
            'date_3' => 'nullable|string',
            'customs_origin_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:2',

            'type_of_payment' => 'required',
            'total_charges' => 'nullable|numeric|min:0.000|max:999999999999',
            'currency' => 'nullable|string|max:3',
            'no_value_declear_carriage' => 'nullable|boolean',
            //carriage
            'declear_value_carriage' => 'nullable|numeric|min:0.000|max:999999999999',
            'no_value_declear_customs' => 'nullable|boolean',
            //customs
            'declear_value_customs' => 'nullable|numeric|min:0.000|max:999999999999',
            'no_value_declear_insurance' => 'nullable|boolean',
            //Insurance
            'declear_value_insurance' => 'nullable|numeric|min:0.001|max:99999999999',

            'agent_name' => 'nullable|string|max:35',
            'agent_address' => 'nullable|max:70|regex:/^[a-zA-Z0-9\s]+$/',
            'agent_issue_sign' => 'required|max:20|string',
            'agent_issue_loc_code' => 'required|string|max:3',
            'agent_issue_date' => 'required',
            'agent_account' => 'nullable',
            'office_airport' => 'nullable',
            'office_function_designator' => '',
            //2
            'office_company_designator' => '',
            //2
            'iata_agent_code' => 'nullable|regex:/^[0-9]+$/|size:7',
            //7
            'iata_agent_cass' => 'nullable|regex:/^[0-9]+$/|size:4',
            //4
            'office_file_reference' => 'nullable',
            'participant_airport' => 'nullable',
            'prticipant_identifer' => 'required',
            'participant_code' => 'required|string',
            'participant_file_reference' => 'nullable',
            //office_file_reference

            'other_charge_code' => 'nullable|string', //max:2
        ]);
        $validator = Validator::make([
            'consignee_info' => $consignee_info,
            'oci_entries' => $oci_entries,
            'other_charges' => $other_charges,
            'spclHandlingCode' => $spclHandlingCode
        ], [
                'oci_entries' => 'nullable|array',
                'oci_entries.*.oci_country_code' => 'nullable|string|max:2',
                'oci_entries.*.oci_info_identifier' => 'nullable|string|max:3',
                'oci_entries.*.oci_custom_info_identifier' => 'nullable|string|max:2',
                'oci_entries.*.oci_supplementary_info' => 'nullable|string|max:70',

                
                'pieces' => 'nullable|digits_between:1,4',
                'description' => 'nullable|string|max:70',
                'rate_class' => 'nullable|string|max:1',
                'uld_rate_class' => 'nullable|regex:/^\d[A-Za-z]{2}$/',
                'service_code' => 'nullable|string|max:1',
                'commodity_item' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:11',
                'country_origin_goods' => 'nullable|string|max:2',
                'slac' => 'nullable|string',
                'hsCode' => 'nullable|array',
                'hsCode.*.hs_code' => 'required|regex:/^[a-zA-Z0-9\s]+$/|min:6|max:18',
                'gross_weight' => 'nullable|numeric|min:0.1|max:9999999',
                'chargable_weight' => 'nullable|numeric|min:0.1|max:9999999',
                'weight_code' => 'nullable|string|max:3',
                'rate' => 'nullable|numeric|min:0.0001|max:99999999',
                'height' => 'nullable|regex:/^[0-9]+$/|max:5',
                'width' => 'nullable|regex:/^[0-9]+$/|max:5',
                'length' => 'nullable|regex:/^[0-9]+$/|max:5',
                'unit' => 'nullable|string|max:3',
                'volume' => 'nullable|string',
                'dimention_unit' => 'nullable|string|max:2',
                'total_volume' => 'nullable|regex:/^[0-9]+$/|max:9',
                'total_amount' => 'nullable|numeric|min:0.01|max:999999999',
                'uld_type' => 'nullable|string|size:3',
                'uld_info.*.uld_serial' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:5',
                'uld_info.*.owner' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|size:2',

                'other_charges' => 'nullable|array',
                'other_charges.*.payment_type' => 'nullable|string',
                'other_charges.*.other_code' => 'nullable|string',
                'other_charges.*.code' => 'nullable|string',
                'other_charges.*.amount' => 'nullable|numeric|min:0.01|max:999999999',
                'other_charges.*.due' => 'nullable|string',

                'special_handling_code' => 'nullable|array',
                'special_handling_code.*.special_handling_code' => 'nullable|string|max:3',
            ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        try {

            $agent = new Agent();
            $agent->agent_name = $request->agent_name;
            $agent->agent_address = $request->agent_address;
            $agent->agent_issue_sign = $request->agent_issue_sign;
            $agent->agent_issue_loc_code = $request->agent_issue_loc_code;
            $agent->agent_issue_date = $request->agent_issue_date;
            $agent->agent_account = $request->agent_account;
            $agent->office_airport = $request->office_airport;
            $agent->office_function_designator = $request->office_function_designator;
            $agent->office_company_designator = $request->office_company_designator;
            $agent->iata_agent_code = $request->iata_agent_code;
            $agent->iata_agent_cass = $request->iata_agent_cass;
            $agent->office_file_reference = $request->office_file_reference;
            $agent->participant_airport = $request->participant_airport;
            $agent->prticipant_identifer = $request->prticipant_identifer;
            $agent->participant_code = $request->participant_code;
            $agent->participant_file_reference = $request->participant_file_reference;
            $agent->save();

            // Save Shipper
            $shipper = new Shipper();
            $shipper->ship_name = $request->ship_name;
            $shipper->ship_account = $request->ship_account;
            $shipper->ship_address = $request->ship_address;
            $shipper->ship_address_line_2 = $request->ship_address_line_2;
            $shipper->ship_city = $request->ship_city;
            $shipper->ship_airport_code = $request->ship_airport_code;
            $shipper->ship_post_code = $request->ship_post_code;
            $shipper->ship_state = $request->ship_state;
            $shipper->ship_country = $request->ship_country;
            $shipper->ship_phone = $request->ship_phone;
            $shipper->ship_fax = $request->ship_fax;
            $shipper->ship_telex = $request->ship_telex;
            $shipper->save();

            // Save Consignee
            $consignee = new Consignee();
            $consignee->cons_name = $request->cons_name;
            $consignee->cons_account = $request->cons_account;
            $consignee->cons_address = $request->cons_address;
            $consignee->cons_address_line_2 = $request->cons_address_line_2;
            $consignee->cons_address_line_2 = $request->cons_address_line_2;
            $consignee->cons_post_code = $request->cons_post_code;
            $consignee->cons_state = $request->cons_state;
            $consignee->cons_country = $request->cons_country;
            $consignee->cons_phone = $request->cons_phone;
            $consignee->cons_fax = $request->cons_fax;
            $consignee->cons_telex = $request->cons_telex;
            $consignee->save();


            $paymentInfo = new PaymentInfo();
            $paymentInfo->type_of_payment = $request->type_of_payment;
            $paymentInfo->total_charges = $request->total_charges;
            $paymentInfo->currency = $request->currency;
            $paymentInfo->no_value_declear_carriage = $request->no_value_declear_carriage;
            $paymentInfo->declear_value_carriage = $request->declear_value_carriage;
            $paymentInfo->no_value_declear_customs = $request->no_value_declear_customs;
            $paymentInfo->declear_value_customs = $request->declear_value_customs;
            $paymentInfo->no_value_declear_insurance = $request->no_value_declear_insurance;
            $paymentInfo->declear_value_insurance = $request->declear_value_insurance;


            $paymentInfo->save();
            $airwayBill = new AirwayBills();
            $airwayBill->consignee_info = $consignee_info;
            $airwayBill->oci_entries = $oci_entries;
            $airwayBill->other_charges = json_decode($request->other_charges, true);
            $airwayBill->special_handling_code = json_decode($request->special_handling_code, true);
            $airwayBill->customs_origin_code = $request->customs_origin_code;
            $airwayBill->$request = $shipper->id;
            $airwayBill->consignee_id = $consignee->id;
            $airwayBill->agent_id = $agent->id;
            $airwayBill->payment_id = $paymentInfo->id;
            $airwayBill->departure_airport = $request->departure_airport;
            $airwayBill->destination_airport = $request->destination_airport;
            $airwayBill->from = $request->from;
            $airwayBill->to = $request->to;
            $airwayBill->by = $request->by;
            $airwayBill->flight = $request->flight;
            $airwayBill->date = $request->date;

            $airwayBill->from_2 = $request->from_2;
            $airwayBill->to_2 = $request->to_2;
            $airwayBill->by_2 = $request->by_2;
            $airwayBill->flight_2 = $request->flight_2;
            $airwayBill->date_2 = $request->date_2;
            $airwayBill->from_3 = $request->from_3;
            $airwayBill->to_3 = $request->to_3;
            $airwayBill->by_3 = $request->by_3;
            $airwayBill->flight_3 = $request->flight_3;
            $airwayBill->date_3 = $request->date_3;
            $airwayBill->customs_origin_code = $request->customs_origin_code;
            $airwayBill->save();


            // $airwayBill = AirwayBills::create([
            //     'consignee_info' => $consignee_info,
            //     'oci_entries' => $oci_entries,
            //     'other_charges' => json_decode($request->other_charges, true),
            //     'special_handling_code' => json_decode($request->special_handling_code, true),
            //     'customs_origin_code' => $request['customs_origin_code'],
            //     'shipper_id' => $shipper->id,
            //     'consignee_id' => $consignee->id,
            //     'agent_id' => $agent->id,
            //     'payment_id' => $paymentInfo->id,
            // ]);
            return response()->json([
                'success' => true,
                'message' => 'Data saved successfully!',
                'data' => $airwayBill
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error saving data:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Data saving failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    private function otherCharges($awb_no, $charges){
        $validator = Validator::make($charges, [
        'payment_type' => 'nullable|string',
        'other_code' => 'nullable|string',
        'other_charge_code' => 'nullable|string',
        'amount' => 'nullable|numeric|min:0.01|max:999999999',
        'due' => 'nullable|string',   
        ]);
        
        
    }
}