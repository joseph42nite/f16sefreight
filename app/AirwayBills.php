<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AirwayBills extends Model
{
    //
    protected $table = 'air_way_bills';

    public function agentsInfo()
    {
        return $this->belongsTo(Agent::class, 'agent_id', 'id');
    }
    
    public function paymentInfo()
    {
        return $this->hasOne(PaymentInfo::class, 'awb_id', 'id');
    }

    public function wayBillAddress()
    {
        return $this->hasOne(WayBillAddress::class, 'awb_id', 'id');
    }

    public function consignmentData()
    {
        return $this->hasOne(ConsignmentData::class, 'awb_id', 'id');
    }

    public function customInfo()
    {
        return $this->hasOne(OtherCustomInformation::class, 'awb_id', 'id');
    }

    public function otherCharge()
    {
        return $this->hasMany(OtherCharge::class, 'awb_id', 'id');
    }

    public function otherCustomInformation()
    {
        return $this->hasMany(OtherCustomInformation::class, 'awb_id', 'id');
    }

    public function savedAddress()
    {
        return $this->hasOne(SavedAddress::class, 'awb_id', 'id');
    }
    // protected $fillable = [
    //     'awb_code',
    //     'awb_no',
    //     'consolidated_mawb',
    //     'awb',
    //     'departure_airport',
    //     'destination_airport',
    //     'customs_origin_code',
    //     'from', 'to', 'by','flight', 'date', 
    //     'to_2','by_2','flight_2','date_2',
    //     'to_3', 'by_3','flight_3','date_3',
    //     'accounting_information',
    //     'special_handling_code',
    //     'special_service_request',
    //     'other_service_information',
    //     'shipment_ref_no',
    //     'supplementary_shipment_info',
    // ];

    // protected $casts = [
    //     'oci_info' => 'array',
    //     'special_handling_info' => 'array'
    // ];
}
