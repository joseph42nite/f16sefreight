<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ams extends Model
{
    //
    protected $fillable = [
        'carrier_code',
        'carrier_prefix',
        'fsc',
        'scc',
        'xray',
        'misc',
        'ctg',
        'awb_fee',
        'mawb',
        'hawb',
    ];
}
