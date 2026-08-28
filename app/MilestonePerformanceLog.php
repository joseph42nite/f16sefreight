<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * An append-only stamp each time a job ENTERS a milestone.
 *
 * A log row per transition, not a timestamp column per milestone: a job bounced back
 * from Verification visits that milestone twice, and a single column would silently
 * overwrite the first visit.
 */
class MilestonePerformanceLog extends Model
{
    use BelongsToTenant;

    protected $fillable = ['agent_id', 'job_id', 'milestone_name', 'entered_at'];

    protected $casts = ['entered_at' => 'datetime'];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
