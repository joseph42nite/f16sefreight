<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConsignmentRate extends Model
{
    protected $table = 'consignment_rate_info';
    protected $fillable = [
        'pieces',
        'description',
        'rate_class',
        'uld_rate_class',
        'service_code',
        'commodity_item',
        'country_origin_goods',
        'slac',
        'hs_code',
        'gross_weight',
        'chargable_weight',
        'weight_code', //kgs/lbs
        // $table->float('rate');
        'rate',
        'height',
        'width',
        'length',
        'unit',
        'volume',
        'dimention_unit',
        'uld_type',
        'uld_serial',
        'owner',
        'total_volume',
        'total_amount'
    ];
}
