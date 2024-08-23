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

class AirwayBill extends Controller
{
    public function index() {}

    public function store(Request $request)
    {
        try {
            $request->validate([
                'awb_code' => 'required|string|max:3',
                'awb_no' => 'required|string|max:8',
                'consolidated_MAWB' => 'nullable|boolean',
                'awb' => 'nullable|boolean',

                'ship_name' => 'nullable|string|max:255',
                'ship_account' => 'nullable|string|max:255',
                'ship_address' => 'nullable|string|max:255',
                'ship_city' => 'nullable|string|max:255',
                'ship_airport_code' => 'nullable|string|max:10',
                'ship_post_code' => 'nullable|string|max:10',
                'ship_state' => 'nullable|string|max:255',
                'ship_country' => 'nullable|string|max:255',
                'ship_phone' => 'nullable|string|max:20',
                'ship_fax' => 'nullable|string|max:20',
                'ship_telex' => 'nullable|string|max:20',

                'cons_name' => 'nullable|string|max:255',
                'cons_account' => 'nullable|string|max:255',
                'cons_address' => 'nullable|string|max:255',
                'cons_city' => 'nullable|string|max:255',
                'cons_post_code' => 'nullable|string|max:10',
                'cons_state' => 'nullable|string|max:255',
                'cons_country' => 'nullable|string|max:255',
                'cons_phone' => 'nullable|string|max:20',
                'cons_fax' => 'nullable|string|max:20',
                'cons_telex' => 'nullable|string|max:20',

                'departure_airport' => 'nullable|string',
                'destination_airport' => 'nullable|string',
                'from' => 'nullable|string',
                'to' => 'nullable|string',
                'by' => 'nullable|string|max:20',
                'flight' => 'nullable|string|max:20',
                'date' => 'nullable|string',
                'customs_origin_code' => 'nullable',

                'awb_id' => 'nullable|string',
                'pieces' => 'nullable|string',
                'description'=> 'nullable|string',
                'rate_class'=> 'nullable|string',
                'uld_rate_class'=> 'nullable|string',
                'service_code'=> 'nullable|string',
                'commodity_item'=> 'nullable|string',
                'country_origin_goods'=> 'nullable|string',
                'slac'=> 'nullable|string',
                'hs_code'=> 'nullable|string',
                'gross_weight'=> 'nullable|string',
                'chargable_weight'=> 'nullable|string',
                'weight_code'=> 'nullable|string', //kgs/lbs
                // $table->float('rate');
                'rate'=> 'nullable|string',
                'height'=> 'nullable|string',
                'width'=> 'nullable|string',
                'length'=> 'nullable|string',
                'unit'=> 'nullable|string',
                'volume'=> 'nullable|string',
                'dimention_unit'=> 'nullable|string',
                'uld_type'=> 'nullable|string',
                'uld_serial'=> 'nullable',
                'owner'=> 'nullable|string',
                'total_volume'=> 'nullable|string',
                'total_amount'=> 'nullable|string'
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
                'awb_code', 'awb_no', 'consolidate', 'awb',
                'departure_airport', 'destination_airport', 'from', 'to', 'by',
                'flight', 'date', 'customs_origin_code'
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
