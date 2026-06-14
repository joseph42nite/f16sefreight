<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
ini_set('max_execution_time', '0');
use Illuminate\Http\Request;
use App\Imports\LocationImportClass;
use Maatwebsite\Excel\Facades\Excel;
use App\Location;

class LocationController extends Controller
{
    //
    public function importData(Request $request){
        $file = $request->file('file');
        Excel::import(new LocationImportClass, $file);
    }
    public function getLocation(){
        $data = Location::all(['destination', 'iata_code']);
        return json_encode($data);
    }
    public function delete(Request $request){
        Location::truncate();
        return "delete successfull";
    }
}
