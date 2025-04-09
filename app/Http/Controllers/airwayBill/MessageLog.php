<?php

namespace App\Http\Controllers\airwayBill;

use App\Agent;
use App\AirwayBills;
use App\ConsignmentData;
use App\HousewayBills;
use App\Http\Controllers\Controller;
use App\OtherCustomInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MessageLog extends Controller
{
    public function index()
    {
        $awbNo = 12345678;
        $awbCode = 123;
        $wayBill = HousewayBills::where('awb_no', $awbNo)->where('awb_code', $awbCode)->get();
        // dd($wayBill);
        if ($wayBill) {
            return $wayBill;
        } else {
            return response()->json(['message' => 'Record not found'], 404);
        }
    }

    public function searchHouseWayBills(Request $request)
    {
        $user = auth()->guard('user-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();
        $agentId = $agent->id;
        $request->validate([
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'required|regex:/^[0-9]+$/|size:8'
        ]);
        // $existsInAirwayBills = AirwayBills::where('awb_no', $request->awb_no)
        // ->where('awb_code', $request->awb_code)
        // ->exists();

        // if (!$existsInAirwayBills) {
        //     return response()->json(['message' => 'No records found in AirwayBills'], 404);
        // }

        $wayBills = HousewayBills::where('house_way_bills.awb_no', $request->awb_no)
            ->where('house_way_bills.awb_code', $request->awb_code)
            ->where('house_way_bills.agent_id', $agentId)
            ->leftJoin('way_bill_consignment_data', 'house_way_bills.id', '=', 'way_bill_consignment_data.awb_id')
            ->leftJoin('way_bill_custom_info', 'house_way_bills.id', '=', 'way_bill_custom_info.awb_id')
            // ->leftJoin('way_bill_custom_info', 'house_way_bills.id', '=', 'way_bill_custom_info.awb_id')
            ->select(
                'house_way_bills.id',
                'house_way_bills.master_origin',
                'house_way_bills.master_destination',
                'house_way_bills.special_handling_info',
                'house_way_bills.special_service_request',
                'house_way_bills.other_service_information',

                // Fields from way_bill_consignment_data
                'way_bill_consignment_data.pieces',
                'way_bill_consignment_data.gross_weight',
                'way_bill_consignment_data.description',

                'way_bill_custom_info.country_code',
                'way_bill_custom_info.info_identifier',
                'way_bill_custom_info.custom_info_identifier',
                'way_bill_custom_info.supplementary_info'
            )
            ->get();
            $groupedWayBills = $wayBills->groupBy('id')->map(function ($group) {
                $waybill = $group->first()->toArray();
                // Extract custom information based on `country_code` and `info_identifier`
                $customInfo = $group->map(function ($item) {
                    return [
                        'country_code' => $item->country_code,
                        'info_identifier' => $item->info_identifier,
                        'custom_info_identifier' => $item->custom_info_identifier,
                        'supplementary_info' => $item->supplementary_info,
                    ];
                });
                $waybill['custom_info'] = $customInfo->isEmpty() ? [] : $customInfo->values()->all();
            
                return $waybill;
            });
            
        return response()->json($groupedWayBills->values());
    }
    public function getHouseWayBills($awb_code, $awb_no)
    {
        try {
            // Get the authenticated user's agent_id
            $user = auth()->guard('user-api')->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            $branch_name = $user->branch_name;
            $agent = Agent::where('id', $branch_name)->first();
            $agentId = $agent->id;
    
            // Query house way bills related to the airway bill
            $houseWayBills = HousewayBills::where('house_way_bills.awb_code', $awb_code)->where('house_way_bills.awb_no', $awb_no)
                ->where('house_way_bills.agent_id', $agentId)
                ->leftJoin('way_bill_consignment_data', 'house_way_bills.id', '=', 'way_bill_consignment_data.awb_id')
                ->select(
                    'house_way_bills.id',
                    'house_way_bills.awb_no',
                    'house_way_bills.awb_code',
                    'house_way_bills.destination_airport',
                    'house_way_bills.created_at',
                    'way_bill_consignment_data.pieces',
                    'way_bill_consignment_data.description'
                )
                ->get();
    
            return response()->json($houseWayBills);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch house way bills',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'required|regex:/^[0-9]+$/|size:8',
            'master_origin' => 'required|string|max:255',
            'master_destination' => 'required|string|max:255',
            'special_handling_info' => 'nullable|string',
            'other_service_information' => 'nullable|string'
        ]);
        $wayBill = HousewayBills::find($id);
        // dd($wayBill);die;
        if (!$wayBill) {
            return response()->json(['message' => 'Waybill not found'], 404);
        }
        $wayBill->awb_code = $request->awb_code;
        $wayBill->awb_no = $request->awb_no;
        $wayBill->master_origin = $request->master_origin;
        $wayBill->master_destination = $request->master_destination;
        $wayBill->special_handling_info = $request->special_handling_info ?? $wayBill->special_handling_info;
        $wayBill->other_service_information = $request->other_service_information ?? $wayBill->other_service_information;

        $wayBill->save();
        $consignmentData = ConsignmentData::where('awb_id', $id)->first();
        if (!empty($consignmentData)) {

            if ($consignmentData) {
                $consignmentData->pieces = $request->pieces;
                $consignmentData->gross_weight = $request->gross_weight;
                $consignmentData->description = $request->description;
                $consignmentData->save();
            }
        }
        $customInfoData = OtherCustomInformation::where('awb_id', $id)->first();
        if ($request->has('oci_entries') && is_array($request->oci_entries)) {
            foreach ($request->oci_entries as $oci_entry) {
                $customInfoData = OtherCustomInformation::where('awb_id', $id)
                    ->where('info_identifier', $oci_entry['info_identifier'])
                    ->first();
                if (!$customInfoData) {
                    $customInfoData = new OtherCustomInformation();
                    $customInfoData->awb_id = $id;
                }
                $customInfoData->country_code = $oci_entry['country_code'] ?? $customInfoData->country_code;
                $customInfoData->custom_info_identifier = $oci_entry['custom_info_identifier'] ?? $customInfoData->custom_info_identifier;
                $customInfoData->supplementary_info = $oci_entry['supplementary_info'] ?? $customInfoData->supplementary_info;
                $customInfoData->info_identifier = $oci_entry['info_identifier'] ?? $customInfoData->info_identifier;
                $customInfoData->save();
            }
        }
        return response()->json(['message' => 'Waybill and related data updated successfully', 'data' => $wayBill, 'custom_info' => $customInfoData, 'consignee_data' => $consignmentData]);
    }
    public function fetchTableData(Request $request)
    {
        // Validate inputs
        $request->validate([
            'awb_code' => 'nullable|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'nullable|regex:/^[0-9]+$/|size:8',
        ]);
    
        // Initialize query
        $query = AirwayBills::query();
    
        // Filter by awb_code and awb_no
        if ($request->filled('awb_code') && $request->filled('awb_no')) {
            $query->where('awb_code', $request->awb_code)
                  ->where('awb_no', $request->awb_no);
        }
    
        // Fetch specific fields
        $data = $query->get(['awb_no as air_waybill_number', 'departure_airport as master_origin', 'destination_airport as master_destination', 'total_volume as air_waybill_quantity']);
    
        return response()->json($data);
    }

    public function getAllAirwayBill(Request $request)
    {
        try {
            $user = auth()->guard('user-api')->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            $branch_name = $user->branch_name;
            $agent = Agent::where('id', $branch_name)->first();
            $agentId = $agent->id;

            $query = AirwayBills::where('agent_id', $agentId);

            // Apply search filters if provided
            if ($request->filled('awb_code') && $request->filled('awb_no')) {
                $query->where('awb_code', $request->awb_code)
                    ->where('awb_no', $request->awb_no);
            }

            $airwayBills = $query->get();
            
            return response()->json($airwayBills);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteHouseWayBill($id)
    {
        try {
            $user = auth()->guard('user-api')->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $houseWayBill = HousewayBills::find($id);
            
            if (!$houseWayBill) {
                return response()->json(['message' => 'House way bill not found'], 404);
            }

            // Check if user has permission to delete this house way bill
            if ($houseWayBill->agent_id != $user->branch_name) {
                return response()->json(['message' => 'Unauthorized to delete this house way bill'], 403);
            }
            ConsignmentData::where('awb_id', $id)->delete();
            OtherCustomInformation::where('awb_id', $id)->delete();

            // Delete the house way bill
            $houseWayBill->delete();

            return response()->json(['message' => 'House way bill deleted successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete house way bill',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
