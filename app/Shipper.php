<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Shipper extends Model
{
    protected $table = 'shipper_deatils';

    protected $fillable  = [
        'ship_name',
        'ship_account',
        'ship_address',
        'ship_city',
        'ship_airport_code',
        'ship_post_code',
        'ship_state',
        'ship_country',
        'ship_phone',
        'ship_fax',
        'ship_telex',
    ];
}
