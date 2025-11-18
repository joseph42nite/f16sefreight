<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StatusReponse extends Model
{
    //
    protected $table = 'status_response';
    protected $fillable = [
        'message_id',
        'type_code',
        'issue_date_time',
        'conversation_id',
        'primary_id',
        'business_id',
        'business_name',
        'business_type_code',
        'business_status_code',
        'condition_code',
        'reason'
    ];
}