<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    //
    protected $fillable = [
        'dest_city_name',
        'dest_airport_code',
        'carrier_code',
        'carrier_prefix',
        'product_name',
        'dgr',
        'effective_from',
        'effective_to',
        'origin_country_code',
        'origin_airport_code',
        'currency_code',
        'rate_range',
    ];
}
