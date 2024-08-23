<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Consignee extends Model
{
    protected $table = 'consignee_details';
    
    protected $fillable = [
        'cons_name',
        'cons_account',
        'cons_address',
        'cons_city',
        'cons_post_code',
        'cons_state',
        'cons_country',
        'cons_phone',
        'cons_fax',
        'cons_telex',
    ];
}
