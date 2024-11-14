<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OtherCustomInformation extends Model
{
    //
    protected $table = 'way_bill_custom_info';
    public function airWayBill()
    {
        return $this->belongsTo(AirwayBills::class, 'awb_id', 'id');
    }

    public function housewayBill()
    {
        return $this->belongsTo(HousewayBills::class, 'awb_id', 'id');
    }
}
