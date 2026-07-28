<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SavedAddress extends Model
{
    protected $fillable = [
        'awb_id',
        'agent_id',
        'user_id',
        'address_type',
        'name',
        'name_2',
        'account',
        'address',
        'address_line_2',
        'city',
        'airport_code',
        'post_code',
        'state',
        'country',
        'phone',
        'fax',
        'telex',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

