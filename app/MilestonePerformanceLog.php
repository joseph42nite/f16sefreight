<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MilestonePerformanceLog extends Model
{
    protected $table = 'milestone_performance_logs';

    protected $fillable = [
        'agent_id',
        'job_id',
        'milestone_name',
        'entered_at',
        'exited_at',
        'duration_seconds',
        'operator_id',
    ];

    protected $casts = [
        'entered_at' => 'datetime',
        'exited_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }
}
