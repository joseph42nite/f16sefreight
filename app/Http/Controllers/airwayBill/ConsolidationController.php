<?php

namespace App\Http\Controllers\airwayBill;

use App\ConsignmentData;
use App\HousewayBills;
use App\Http\Controllers\Controller;
use App\OtherCustomInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ConsolidationController extends Controller
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
        $request->validate([
            'awb_code' => 'required|regex:/^[0-9]+$/|size:3',
            'awb_no' => 'required|regex:/^[0-9]+$/|size:8'
        ]);
        $wayBills = HousewayBills::where('house_way_bills.awb_no', $request->awb_no)
            ->where('house_way_bills.awb_code', $request->awb_code)
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
}
