<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * What the parser said, what the human changed it to, and the confidence claimed.
 *
 * `confidence_level` is the useful column: a field extracted at "high" confidence that
 * humans keep correcting is a broken template or a bad prompt, and this is the only place
 * that becomes visible.
 *
 * ⚠️ `job_id` references pdf_processing_jobs, NOT jobs — confusing, but it matches the
 * schema doc and renaming it now would break the migration.
 */
class PdfExtractionCorrection extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'job_id', 'field_name', 'original_value', 'corrected_value',
        'confidence_level', 'corrected_by', 'created_at',
    ];

    protected $casts = ['created_at' => 'datetime'];

    public function extraction()
    {
        return $this->belongsTo(PdfProcessingJob::class, 'job_id');
    }

    public function correctedBy()
    {
        return $this->belongsTo(User::class, 'corrected_by');
    }
}
