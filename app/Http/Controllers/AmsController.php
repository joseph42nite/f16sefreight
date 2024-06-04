<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\AmsImportClass;
use Maatwebsite\Excel\Facades\Excel;
use App\Ams;

class AmsController extends Controller
{
    //
    public function importData(Request $request)
    {
        $file = $request->file('file');
        Excel::import(new AmsImportClass, $file);
    }

    public function getAms($origin)
    {
        $data = Ams::where('origin', $origin)->get(['carrier_code', 'carrier_prefix', 'origin', 'region', 'dest_airport_code', 'country_code', 'haul', 'fsc', 'scc', 'xray', 'misc', 'ctg', 'awb_fee', 'mawb', 'hawb', 'dg_fee']);
        return json_encode($data);
    }
    public function getAmsList()
    {
        $data = Ams::select('carrier_code')->distinct()->get();
        return json_encode($data);
    }
    public function delete($carrier_code, $carrier_prefix)
    {
        Ams::where('carrier_code', $carrier_code)->delete();
        echo "data deleted successful";
    }
}
