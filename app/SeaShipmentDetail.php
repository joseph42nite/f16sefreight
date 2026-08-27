<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/** Actual shipped figures for a SEA job. One of the six soft-deleting tables. */
class SeaShipmentDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'job_id', 'carrier_id', 'vessel_name', 'voyage_no', 'vessel_flag', 'imo_number',
        'por_code', 'pol_code', 'pod_code', 'del_code', 'transshipment_required',
        'imdg_class', 'un_number', 'hbl_number', 'mbl_number', 'freight_terms',
        'piece_count', 'gross_weight', 'net_weight', 'chargeable_weight', 'volume_cbm',
        'filing_status', 'customs_broker_id', 'transporter_id', 'haulage_provider_id',
        'handling_agent_id', 'shipping_bill_no', 'shipping_bill_date',
        'igm_no', 'igm_date', 'container_type',
    ];

    protected $casts = [
        'transshipment_required' => 'boolean',
        'gross_weight'           => 'decimal:3',
        'net_weight'             => 'decimal:3',
        'chargeable_weight'      => 'decimal:3',
        'volume_cbm'             => 'decimal:3',
        'shipping_bill_date'     => 'date',
        'igm_date'               => 'date',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $detail) {
            $mode = Job::withTrashed()->whereKey($detail->job_id)->value('transport_mode');

            if ($mode !== null && $mode !== 'sea') {
                throw new \LogicException("Cannot attach sea shipment details to a '{$mode}' job.");
            }

            // Cross-field rule from guide §4.1.2: an IMDG class requires a UN number.
            if (filled($detail->imdg_class) && blank($detail->un_number)) {
                throw new \LogicException('An IMDG class requires a UN number.');
            }
        });
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function carrier()
    {
        return $this->belongsTo(Partner::class, 'carrier_id');
    }

    public function customsBroker()
    {
        return $this->belongsTo(Partner::class, 'customs_broker_id');
    }

    public function transporter()
    {
        return $this->belongsTo(Partner::class, 'transporter_id');
    }

    public function haulageProvider()
    {
        return $this->belongsTo(Partner::class, 'haulage_provider_id');
    }

    public function handlingAgent()
    {
        return $this->belongsTo(Partner::class, 'handling_agent_id');
    }
}
