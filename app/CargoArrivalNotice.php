<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CargoArrivalNotice extends Model
{
    protected $table = 'cargo_arrival_notices';

    protected $fillable = [
        'agent_id',
        'job_id',
        'can_no',
        'document_date',
        'free_storage_days',
        'storage_charges_start_date',
        'sent_to_consignee_at',
    ];

    protected $casts = [
        'document_date'               => 'date',
        'storage_charges_start_date'  => 'date',
        'sent_to_consignee_at'        => 'datetime',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
