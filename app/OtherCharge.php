<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OtherCharge extends Model
{
    protected $table = 'other_charges_code';
    public function airWayBill()
    {
        return $this->belongsTo(AirWayBill::class, 'awb_id', 'id');
    }
}
