<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
ini_set('max_execution_time', '0');
use Illuminate\Http\Request;
use App\Location;

class LocationController extends Controller
{
    public function getLocation(){
        $data = \Illuminate\Support\Facades\Cache::rememberForever('locations_destination_iata', function() {
            return Location::all(['destination', 'iata_code']);
        });
        return response()->json($data);
    }
    public function delete(Request $request){
        Location::truncate();
        \Illuminate\Support\Facades\Cache::forget('locations_destination_iata');
        return "delete successfull";
    }
}
