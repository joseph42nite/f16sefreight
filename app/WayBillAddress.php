<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WayBillAddress extends Model
{
    protected $table = 'way_bill_addresses';
    public function airWayBill()
    {
        return $this->belongsTo(AirWayBill::class, 'awb_id', 'id');
    }
}
