<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * A manifest filed with ICEGATE against one job — PRD §5.8 CGM Filing.
 *
 * `status` uses tab 11's words (not_filed · submitted · cleared · rejected) and is copied onto the bill's
 * `sea_shipment_details.filing_status`, so the bill and the filing never disagree. `status_log` is append-only.
 */
class ManifestFiling extends Model
{
    use BelongsToTenant;

    public const TYPES = ['CGM', 'SCMTR'];
    public const METHODS = ['auto', 'manual', 'email'];
    public const OUTCOMES = ['cleared', 'rejected'];

    protected $fillable = [
        'agent_id', 'job_id', 'icegate_id', 'filing_type', 'custom_house_code', 'amendment_no',
        'filed_at', 'sending_method', 'status', 'status_log',
    ];

    protected $casts = [
        'filed_at'   => 'datetime',
        'status_log' => 'array',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
