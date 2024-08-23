<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AirwayBills extends Model
{
    //
    protected $table = 'air_way_bills';
    
    protected $fillable = [
        'awb_code',
        'awb_no',
        'consolidated_MAWB',
        'awb',
        'departure_airport',
        'destination_airport',
        'from',
        'to',
        'by',
        'flight',
        'date',
        'customs_origin_code'
    ];
}
