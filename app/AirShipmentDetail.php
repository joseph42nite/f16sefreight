<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** Actual shipped figures for an AIR job. A job populates this OR SeaShipmentDetail. */
class AirShipmentDetail extends Model
{
    protected $fillable = [
        'job_id', 'flight_number', 'flight_date', 'carrier_name',
        'pol_code', 'pod_code', 'do_given_to', 'pickup_address', 'delivery_address',
        'piece_count', 'gross_weight', 'chargeable_weight', 'volume_cbm',
    ];

    protected $casts = [
        'flight_date'       => 'datetime',
        'gross_weight'      => 'decimal:3',
        'chargeable_weight' => 'decimal:3',
        'volume_cbm'        => 'decimal:3',
    ];

    /** Guards the mode invariant from this side too — see App\Job::booted(). */
    protected static function booted(): void
    {
        static::saving(function (self $detail) {
            $mode = Job::withTrashed()->whereKey($detail->job_id)->value('transport_mode');

            if ($mode !== null && $mode !== 'air') {
                throw new \LogicException("Cannot attach air shipment details to a '{$mode}' job.");
            }
        });
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
