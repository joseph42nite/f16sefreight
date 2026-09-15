<?php

namespace App\Http\Controllers\Logistics;

use App\Agent;
use App\AirwayBills;
use App\ConsignmentData;
use App\HousewayBills;
use App\StatusReponse;
use App\Http\Controllers\Controller;
use App\OtherCustomInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MessageLogController extends Controller
{


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
            $houseWayBills = HousewayBills::where('house_way_bills.awb_code', $awb_code)->where('house_way_bills.status', 'send')->where('house_way_bills.awb_no', $awb_no)
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

            $query = AirwayBills::where('agent_id', $agentId)->orderBy('created_at', 'desc');

            // Apply search filters if provided
            if ($request->filled('awb_code') && $request->filled('awb_no')) {
                $query->where('awb_code', $request->awb_code)
                    ->where('awb_no', $request->awb_no);
            }

            $perPage = (int) $request->input('perPage', 10);
            $airwayBills = $query->paginate($perPage);

            // Eager-load house waybills only for the page items in one query
            $awbCodes = $airwayBills->pluck('awb_code')->toArray();
            $awbNos   = $airwayBills->pluck('awb_no')->toArray();

            $houseWayBillsAll = HousewayBills::where('agent_id', $agentId)
                ->where('status', 'send')
                ->whereIn('awb_code', $awbCodes)
                ->get(['id', 'awb_code', 'awb_no', 'destination_airport', 'created_at']);

            // Group by awb_code-awb_no composite key
            $hwbGrouped = $houseWayBillsAll->groupBy(function ($hwb) {
                return $hwb->awb_code . '-' . $hwb->awb_no;
            });

            // Attach house_way_bills array to each master AWB in the current page collection
            $airwayBills->getCollection()->transform(function ($awb) use ($hwbGrouped) {
                $key = $awb->awb_code . '-' . $awb->awb_no;
                $awb->house_way_bills = $hwbGrouped->get($key, collect())->values();
                return $awb;
            });

            return response()->json($airwayBills);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getMasterAwbsWithHouseWaybills()
    {
        try {
            $user = auth()->guard('user-api')->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $branch_name = $user->branch_name;
            $agent = Agent::where('id', $branch_name)->first();
            $agentId = $agent->id;

            // Get master AWBs that have house waybills
            $masterAwbs = AirwayBills::where('agent_id', $agentId)
                ->whereHas('houseWayBills', function ($query) use ($agentId) {
                    $query->where('agent_id', $agentId);
                })
                ->with(['consignmentData'])
                ->select('id', 'awb_code', 'awb_no', 'departure_airport', 'destination_airport', 'created_at', 'updated_at')
                ->orderBy('updated_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json($masterAwbs);
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

    public function searchBills(Request $request)
    {
        $user = auth()->guard('user-api')->user();
        $request->validate([
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'required|regex:/^[0-9]+$/|size:8'
        ]);

        $branch_name = $user->branch_name;
        $agent = Agent::where('id', $branch_name)->first();
        $agentId = $agent->id;

        // ✅ Fetch Airway Bill (master-level info)
        $airwayBill = AirwayBills::where('awb_no', $request->awb_no)->where('awb_code', $request->awb_code)->where('agent_id', $agentId)->first();
        if (!$airwayBill) {
            return response()->json(['message' => 'No AirwayBill Found'], 404);
        }

        // ✅ Fetch House Way Bills with related data
        $houseWayBills = HousewayBills::where('house_way_bills.status', 'send')->where('house_way_bills.awb_no', $request->awb_no)->where('house_way_bills.awb_code', $request->awb_code)->where('house_way_bills.agent_id', $agentId)->leftJoin('way_bill_consignment_data', 'house_way_bills.id', '=', 'way_bill_consignment_data.awb_id')->leftJoin('way_bill_custom_info', 'house_way_bills.id', '=', 'way_bill_custom_info.awb_id')->select(
            'house_way_bills.id',
            'house_way_bills.destination_airport',
            'house_way_bills.master_origin',
            'house_way_bills.master_destination',
            'house_way_bills.special_handling_info',
            'house_way_bills.special_service_request',
            'house_way_bills.other_service_information',
            'house_way_bills.created_at',
            'house_way_bills.updated_at',
            'way_bill_consignment_data.pieces',
            'way_bill_consignment_data.gross_weight',
            'way_bill_consignment_data.description',
            'way_bill_custom_info.country_code',
            'way_bill_custom_info.info_identifier',
            'way_bill_custom_info.custom_info_identifier',
            'way_bill_custom_info.supplementary_info'
        )->get();
        $groupedHouseBills = $houseWayBills->groupBy('id')->map(function ($group) {
            $bill = $group->first()->toArray();
            $customInfo = $group->map(function ($item) {
                return [
                    'country_code' => $item->country_code,
                    'info_identifier' => $item->info_identifier,
                    'custom_info_identifier' => $item->custom_info_identifier,
                    'supplementary_info' => $item->supplementary_info,
                ];
            });

            $bill['custom_info'] = $customInfo->isEmpty() ? [] : $customInfo->values()->all();
            return $bill;
        })->values();
        // ✅ Return combined result
        $awb_id = $request->awb_code . '-' . $request->awb_no;
        $status_reponse = StatusReponse::where('message_id', $airwayBill['t_id'])->orWhere('business_id', $awb_id)->get();
        return response()->json([
            'airway_bill' => $airwayBill,
            'house_way_bills' => $groupedHouseBills,
            'status_reponse' => $status_reponse
        ]);
    }
}
