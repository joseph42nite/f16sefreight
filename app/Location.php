<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    //
    protected $fillable = [
        'destination',
        'iata_code',
        'airport_name',
        'airport_code',
        'country_flag',
    ];
}
