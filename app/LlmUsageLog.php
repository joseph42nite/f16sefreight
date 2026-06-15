<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LlmUsageLog extends Model
{
    protected $table = 'llm_usage_logs';

    protected $fillable = [
        'job_id',
        'model',
        'tokens_in',
        'tokens_out',
        'cost_usd',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
