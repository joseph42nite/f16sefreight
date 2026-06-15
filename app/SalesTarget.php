<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SalesTarget extends Model
{
    protected $table = 'sales_targets';

    protected $fillable = [
        'target_type',
        'target_id',
        'quarter',
        'revenue_target',
        'tonnage_target',
    ];

    protected $casts = [
        'revenue_target' => 'decimal:2',
        'tonnage_target' => 'decimal:2',
    ];
}
