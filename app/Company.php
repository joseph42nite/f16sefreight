<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $casts = [
        'templates_config' => 'array',
    ];
}
