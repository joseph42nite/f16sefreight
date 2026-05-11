<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SystemTemplate extends Model
{
    protected $fillable = ['key', 'coordinates'];

    protected $casts = [
        'coordinates' => 'array',
    ];
}
