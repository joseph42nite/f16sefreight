<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    //
    protected $fillable = [
        'dest_airport_code',
        'zone',
        'carrier_code',
        'carrier_prefix',
        'product_name',
        'online_offline',
        'dgr',
        'origin_country_code',
        'origin_airport_code',
        'currency_code',
        'rate_range',
    ];
}
