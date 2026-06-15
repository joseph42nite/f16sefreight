<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Port extends Model
{
    protected $table = 'ports';

    protected $fillable = [
        'locode',
        'port_name',
        'country_code',
        'port_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
