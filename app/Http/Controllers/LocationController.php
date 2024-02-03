<?php

namespace App\Http\Controllers;

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
}
