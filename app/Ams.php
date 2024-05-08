<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ams extends Model
{
    //
    protected $fillable = [
        'carrier_code',
        'carrier_prefix',
        'region',
        'dest_airport_code',
        'dest_country',
        'country_code',
        'haul',
        'fsc',
        'scc',
        'xray',
        'misc',
        'ctg',
        'awb_fee',
        'mawb',
        'hawb',
        'dg_fee',
    ];
}
