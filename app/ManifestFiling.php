<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * A manifest transmitted to ICEGATE against one job.
 *
 * ❓ **The table is FIVE columns — id, agent_id, job_id, icegate_id, timestamps —
 * and PRD.md §5.8 describes a screen needing far more:** filing type (CGM/SCMTR/IGM),
 * transaction status, custom-house code, submission date/time, amendment number,
 * sending method (Auto File / Manual / Email) and a status log. None of those have
 * columns. Built to the schema doc, which is the authority; raised in GAPS.md #26
 * rather than invented here.
 */
class ManifestFiling extends Model
{
    use BelongsToTenant;

    protected $fillable = ['agent_id', 'job_id', 'icegate_id'];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
