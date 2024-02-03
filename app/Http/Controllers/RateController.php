<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\RateImportClass;
use Illuminate\Support\Facades\Validator;
use App\Rate;

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
        $rate_data=Rate::where('origin_airport_code','like','%'.$request->from.'%')->where('dest_airport_code','like','%'.$request->to.'%')->get();
        return json_encode($rate_data);
    }

    public function getAirlineList(){
        $data=Rate::select('carrier_code', 'carrier_prefix')->distinct()->get();
        return json_encode($data);
    }

    public function deleteRate($carrier_code,$carrier_prefix){
        Rate::where('carrier_code', $carrier_code)->where('carrier_prefix', $carrier_prefix)->delete();
        echo "data deleted successful";
    }
}
