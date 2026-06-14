<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    //
    protected $fillable = [
        'destination',
        'iata_code',
        'country_code',
        'region',
        'zone',
    ];
}
