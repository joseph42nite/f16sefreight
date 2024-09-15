<?php

namespace App\Http\Controllers\airwayBill;

use App\AirwayBills;
use App\Consignee;
use App\ConsignmentRate;
use App\Http\Controllers\Controller;
use App\Shipper;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class HousewayBill extends Controller
{
    public function index() {}
    public function store(Request $request)
    {
        try {
            $request->validate([
                'HAWB_no' =>'required|numeric|size:12',
                'awb_code' => 'required|numeric|size:3',
                'awb_no' => 'required|size:8',
                'consolidated_MAWB' => 'nullable|boolean',
                'awb' => 'nullable|boolean',
                'accounting_information' => 'nullable|string|max:70',
                'special_handling_code' => 'required|string|max:3',
                'special_service_request' => 'nullable|string|max:195',
                'other_service_information' => 'nullable|string|max:195',
                'oci_country_code' => 'nullable|string|max:2',//Other Customs Information(OCI)
                'oci_info_identifier' => 'nullable|string|max:3',
                'oci_custom_info_identifier' => 'nullable|string|max:2',
                'oci_supplementary_info' => 'nullable|string|max:70',
                'shipment_ref_no' => 'nullable|string|max:35',
                'supplementary_shipment_Info' => 'nullable|string|max:35',

                'ship_name' => 'required|string|max:70',
                'ship_account' => 'nullable|string|max:14',
                'ship_address' => 'required|max:70|regex:/^[a-zA-Z0-9\s]+$/',
                'ship_city' => 'required|string|max:70',
                'ship_airport_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',
                'ship_post_code' => 'nullable|string|max:9',
                'ship_state' => 'nullable|string|max:9',
                'ship_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
                'ship_phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35', //digits_between:1,35  regex:/^[0-9]+$/
                'ship_fax' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
                'ship_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',

                'cons_name' => 'required|string|max:70',
                'cons_account' => 'nullable|string|max:14',
                'cons_city_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:3',   //airport code 
                'cons_address' => 'required|max:70|regex:/^[a-zA-Z0-9\s]+$/',
                'cons_city' => 'required|string|max:70',
                'cons_post_code' => 'nullable|regex:/^[0-9]+$/|max:35',
                'cons_state' => 'nullable|string|max:9',
                'cons_country' => 'required|regex:/^[a-zA-Z0-9\s]+$/|max:2',
                'cons_phone' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:35',
                'cons_fax' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',
                'cons_telex' => 'nullable|max:35|regex:/^[a-zA-Z0-9\s]+$/',

                'departure_airport' => 'required|string',
                'destination_airport' => 'required|string',
                'from' => 'required|string',
                'to' => 'required|string',
                'by' => 'required|string|max:20',
                'flight' => 'required|string|max:20',
                'date' => 'required|string',
                'customs_origin_code' => 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:2',

                'awb_id' => 'nullable|string',
                'pieces' => 'nullable|digits_between:1,4',
                'description'=> 'nullable|string|max:70',
                'rate_class'=> 'nullable|string|max:1',
                'uld_rate_class' => 'nullable|regex:/^\d[A-Za-z]{2}$/',
                'service_code'=> 'nullable|string|max:1',
                'commodity_item'=> 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:11',
                'country_origin_goods'=> 'nullable|string|max:2',
                'slac'=> 'nullable|string',
                'hs_code'=> 'nullable|regex:/^[a-zA-Z0-9\s]+$/|min:6|max:18',
                'gross_weight'=> 'nullable|numeric|min:0.1|max:9999999',
                'chargable_weight'=> 'nullable|numeric|min:0.1|max:9999999',
                'weight_code'=> 'nullable|string|max:3', //kgs/lbs
                // $table->float('rate');
                'rate'=> 'nullable|numeric|min:0.0001|max:99999999',
                'height'=> 'nullable|regex:/^[0-9]+$/|max:5',
                'width'=> 'nullable|regex:/^[0-9]+$/|max:5',
                'length'=> 'nullable|regex:/^[0-9]+$/|max:5',
                'unit'=> 'nullable|string|max:3',
                'volume'=> 'nullable|string',
                'dimention_unit'=> 'nullable|string|max:2',
                'uld_type'=> 'nullable|string|size:3',
                'uld_serial'=> 'nullable|regex:/^[a-zA-Z0-9\s]+$/|max:5',
                'owner'=> 'nullable|regex:/^[a-zA-Z0-9\s]+$/|size:2',
                'total_volume'=> 'nullable|regex:/^[0-9]+$/|max:9',
                'total_amount'=> 'nullable|numeric|min:0.01|max:999999999',

                'master_pcs' => 'required|regex:/^[0-9]+$/|max:9999',
                'master_weight' => 'required|regex:/^[0-9]+$/|min:0.1|max:9999999',

                'total_charges' => 'nullable|numeric|min:0.000|max:999999999999',
                'currency' => 'nullable|string|max:3',
                'no_value_declear_carriage' => 'nullable|boolean',  //carriage
                'declear_value_carriage' => 'nullable|numeric|min:0.000|max:999999999999',
                'no_value_declear_customs' =>'nullable|boolean',    //customs
                'declear_value_customs' => 'nullable|numeric|min:0.000|max:999999999999',
                'no_value_declear_insurance' => 'nullable|boolean',    //Insurance
                'declear_value_insurance' => 'nullable|numeric|min:0.001|max:99999999999',  

                'agent_name' => 'nullable|string|max:35',
                'agent_address' => 'nullable|max:70|regex:/^[a-zA-Z0-9\s]+$/',
                'agent_issue_sign' => 'required|max:20|string',
                'agent_issue_loc_code' => 'required|string|max:3',
                'agent_issue_date' => 'required',
                'agent_account' => '',
                'office_airport' => '',
                'office_function_designator' => '', //2
                'office_company_designator' => '', //2
                'office_file_reference:' => '',	
                'iata_agent_code' => 'nullable|numeric|size:7',  //7
                'iata_agent_cass' => 'nullable|numeric|size:4', //4
                'participant_airport' => '',
                'prticipant_identifer' => '',
                'participant_code' => '',
                'participant_file_reference:' => '',	//office_file_reference
                'other_charge_code' => 'nullable|string', //max:2
            ]);

            // Handle shipper data
            $shipperData = $request->only([
                'ship_name', 'ship_account', 'ship_address', 'ship_city',
                'ship_airport_code', 'ship_post_code', 'ship_state',
                'ship_country', 'ship_phone', 'ship_fax', 'ship_telex'
            ]);

            // Handle consignee data
            $consigneeData = $request->only([
                'cons_name', 'cons_account', 'cons_address', 'cons_city',
                'cons_post_code', 'cons_state', 'cons_country', 'cons_phone',
                'cons_fax', 'cons_telex'
            ]);

            $awbData = $request->only([
                'HAWB_no','awb_code', 'awb_no', 'consolidate', 'awb',
                'departure_airport', 'destination_airport', 'from', 'to', 'by','flight', 'date','to_2', 'by_2','flight_2', 'date_2', 'to_3', 'by_3','flight_3', 'date_3', 'customs_origin_code',
                'accounting_information',
                'special_handling_code',
                'special_service_request',
                'other_service_information',
                'oci_country_code',//Other Customs Information(OCI)
                'oci_info_identifier',
                'oci_custom_info_identifier',
                'oci_supplementary_info',
                'shipment_ref_no',
                'supplementary_shipment_Info'
            ]);

            $consignee_info = $request->only([
                'awb_id',
                'pieces',
                'description',
                'rate_class',
                'uld_rate_class',
                'service_code',
                'commodity_item',
                'country_origin_goods',
                'slac',
                'hs_code',
                'gross_weight',
                'chargable_weight',
                'weight_code', //kgs/lbs
                // $table->float('rate');
                'rate',
                'height',
                'width',
                'length',
                'unit',
                'volume',
                'dimention_unit',
                'uld_type',
                'uld_serial',
                'owner',
                'total_volume',
                'total_amount'
            ]);
            
            $shipper = Shipper::create($shipperData);
            $consignee = Consignee::create($consigneeData);
            // $consignee_info = ConsignmentRate::create($consignee_info);
            $additionalData = [
                'shipper_id' => $shipper->id,
                'consignee_id' => $consignee->id,
            ];
            
            $awbData = array_merge($awbData, $additionalData);
            
            $awb = AirwayBills::create($awbData);
            $additional_info = [
                'awb_id' => $awb->id
            ];
            $consigneeData = array_merge($consignee_info, $additional_info);
            $consignee_rate = ConsignmentRate::create($consigneeData);
            return response()->json([
                'success' => true,
                'message' => 'Data created successfully!',
                'shipper' => $shipper,
                'consignee' => $consignee,
                'awb' => $awb,
                'consignment_rate_info' => $consignee_rate,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Capture validation errors
            $errors = $e->errors();
        
            // Log validation errors
            Log::error('Validation errors: ' . json_encode($errors));
        
            // Return response with validation errors
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ], 422);
        }
    }
}