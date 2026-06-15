<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AirShipmentDetail extends Model
{
    protected $table = 'air_shipment_details';

    protected $fillable = [
        'job_id',
        'flight_number',
        'flight_date',
        'carrier_name',
        'pol_code',
        'pod_code',
        'do_given_to',
        'piece_count',
        'gross_weight',
        'chargeable_weight',
        'volume_cbm',
    ];

    protected $casts = [
        'flight_date' => 'datetime',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
