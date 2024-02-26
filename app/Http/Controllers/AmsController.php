<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\AmsImportClass;
use Maatwebsite\Excel\Facades\Excel;
use App\Ams;
class AmsController extends Controller
{
    //
    public function importData(Request $request){
        $file = $request->file('file');
        Excel::import(new AmsImportClass, $file);
    }
    public function getAms(Request $request){
        $data=Ams::all(['carrier_code','carrier_prefix','fsc','scc','xray','misc','ctg','awb_fee','mawb','hawb']);
        return json_encode($data);
    }
    public function delete(){
        Ams::truncate();
        return "delete successfull";
    }
}
