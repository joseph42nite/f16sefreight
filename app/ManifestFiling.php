<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * A manifest filed with ICEGATE against one job — PRD §5.8 (sea) and §5.9 (air) CGM Filing.
 *
 * `status` uses tab 11's words (not_filed · submitted · cleared · rejected) and is copied onto a sea bill's
 * `sea_shipment_details.filing_status`, so the bill and the filing never disagree. Air has no such column: an air
 * job's filing state is its filings. `status_log` is append-only.
 */
class ManifestFiling extends Model
{
    use BelongsToTenant;

    /**
     * Filing types per mode. Sea: PRD §5.8's CGM / SCMTR. Air: CGM (PRD §5.9, "matches the sea version") and IGM
     * (PRD §8.1, guide §5.4). ❓ Which of these ICEGATE actually takes per mode is for its specification to settle.
     */
    public const TYPES_BY_MODE = ['sea' => ['CGM', 'SCMTR'], 'air' => ['CGM', 'IGM']];
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
