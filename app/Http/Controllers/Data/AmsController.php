<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;

use App\Ams;

class AmsController extends Controller
{

    public function getAms($origin)
    {
        $data = Ams::where('origin', $origin)->get(['carrier_code', 'carrier_prefix', 'origin', 'region', 'dest_airport_code', 'country_code', 'haul', 'fsc', 'scc', 'xray', 'misc', 'ctg', 'awb_fee', 'mawb', 'hawb', 'dg_fee']);
        return json_encode($data);
    }
    public function delete($source)
    {
        Ams::where('origin',$source)->delete();
        echo "data deleted successful";
    }
}
