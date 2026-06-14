<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConsignmentData extends Model
{
    //
    protected $table = 'way_bill_consignment_data';
    public function airWayBill()
    {
        return $this->belongsTo(AirwayBills::class, 'awb_id', 'id');
    }
}
