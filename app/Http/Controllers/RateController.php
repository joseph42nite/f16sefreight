<?php

namespace App\Http\Controllers;
ini_set('max_execution_time', '0');
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\RateImportClass;
use Illuminate\Support\Facades\Validator;
use App\Rate;
use App\Location;

class RateController extends Controller
{
    //
    public function rateImport(Request $request)
    {
        $file = $request->file('file');
        Excel::import(new RateImportClass, $file);
    }

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
        $rate_data=Rate::where('online_offline',$request->on_off)->where('origin_airport_code','like','%'.$request->from.'%')->where('dest_airport_code','like','%'.$request->to.'%')->orWhere('zone', $zone)->get();
        $data['rates']=$rate_data;
        $data['country_code']=$location_details->country_code;
        $data['region']=$location_details->region;
        $data['zone']=$zone;
        return json_encode($data);
    }

    public function getAirlineList(){
        $data = Rate::select('carrier_code')->distinct()->get();
        return json_encode($data);
    }

    public function deleteRate($carrier_code,$carrier_prefix){
        Rate::where('carrier_code', $carrier_code)->delete();
        echo "data deleted successful";
    }
}

//hjhghg
