<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HousewayBills extends Model
{   
    protected $table = 'house_way_bills';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
}