<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ManifestFiling extends Model
{
    protected $table = 'manifest_filings';

    protected $fillable = [
        'agent_id',
        'job_id',
        'filing_reference',
        'customs_house_code',
        'transaction_status',
        'transport_mode',
        'filing_date',
        'response_payload',
    ];

    protected $casts = [
        'filing_date' => 'date',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
