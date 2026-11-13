<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ams extends Model
{
    //
    protected $fillable = [
        'carrier_code',
        'carrier_prefix',
        'origin',
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
        'fe',
        'mawb',
        'hawb',
        // The column was created as `de_fee` (2024_02_10_153807); AmsController returns it as `dg_fee`.
        'de_fee',
    ];
}
