<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Airline extends Model
{
    //
    public $timestamps = false;
    protected $fillable = [
        'name',
        'code',
        'prefix',
        'country',
    ];
}