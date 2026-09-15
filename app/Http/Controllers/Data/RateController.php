<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
ini_set('max_execution_time', '0');
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Rate;
use App\Location;

class RateController extends Controller
{

    public function index(Request $request){
        $validator = Validator::make($request->all(), [
            'from' => ['required', 'string', 'max:50'],
            'to' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $location_details=Location::where('iata_code',$request->to)->first(['country_code','zone','region']);
        $zone=$location_details->zone;
        // $rate_data=Rate::where('origin_airport_code','like','%'.$request->from.'%')->where('dest_airport_code','like','%'.$request->to.'%')->orWhere('zone', $zone)->get();
        $rate_data = Rate::where('origin_airport_code', 'like', '%' . $request->from . '%')->where(function($query) use ($request, $zone) {$query->where('dest_airport_code', 'like', '%' . $request->to . '%')->orWhere('zone', $zone);})->get();
        $data['rates']=$rate_data;
        $data['country_code']=$location_details->country_code;
        $data['region']=$location_details->region;
        $data['zone']=$zone;
        return json_encode($data);
    }

}

//hjhghg
