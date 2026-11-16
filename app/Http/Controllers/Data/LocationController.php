<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
ini_set('max_execution_time', '0');
use App\Location;

class LocationController extends Controller
{
    public function getLocation(){
        // 🔴 An EMPTY list is never kept (found 2026-11-16): `rememberForever` stored whatever the first call saw, so a
        // call made before the airports were loaded — or by a test run sharing this cache — left every waybill form
        // with no airports until the cache was cleared by hand.
        $cache = \Illuminate\Support\Facades\Cache::store();
        $data = $cache->get('locations_destination_iata');

        if ($data === null || count($data) === 0) {
            $data = Location::all(['destination', 'iata_code']);

            if ($data->isNotEmpty()) {
                $cache->forever('locations_destination_iata', $data);
            }
        }

        return response()->json($data);
    }
}
