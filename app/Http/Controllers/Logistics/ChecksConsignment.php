<?php

namespace App\Http\Controllers\Logistics;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * The consignment check a waybill form runs before it is saved. A master and a house waybill carry the same
 * consignment fields, so they are checked by the same rules (2026-11-10 audit §6 — this was written out in both).
 */
trait ChecksConsignment
{
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
}
