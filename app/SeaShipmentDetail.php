<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SeaShipmentDetail extends Model
{
    protected $table = 'sea_shipment_details';

    protected $fillable = [
        'job_id',
        'consol_type',
        'cargo_type',
        'delivery_mode',
        'vessel_name',
        'voyage_no',
        'vessel_flag',
        'imo_number',
        'por_code',
        'pol_code',
        'pod_code',
        'del_code',
        'empty_depot',
        'delivery_address',
        'do_given_to',
        'piece_count',
        'gross_weight',
        'net_weight',
        'volume_cbm',
        'vessel_etd',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
