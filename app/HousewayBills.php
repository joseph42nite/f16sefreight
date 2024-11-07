<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HousewayBills extends Model
{   
    protected $table = 'house_way_bills';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function paymentInfo()
    {
        return $this->hasOne(PaymentInfo::class, 'awb_id', 'id');
    }

    public function wayBillAddress()
    {
        return $this->hasOne(WayBillAddress::class, 'awb_id');
    }

    public function savedAddress()
    {
        return $this->hasOne(SavedAddress::class, 'awb_id', 'id');
    }

    public function consignmentData()
    {
        return $this->hasOne(ConsignmentData::class, 'awb_id', 'id');
    }

    public function otherCharge()
    {
        return $this->hasMany(OtherCharge::class, 'awb_id', 'id');
    }

    public function otherCustomInformation()
    {
        return $this->hasMany(OtherCustomInformation::class, 'awb_id', 'id');
    }
}