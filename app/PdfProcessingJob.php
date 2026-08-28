<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * One document extraction run.
 *
 * ⚠️ The six Freight OS columns (enquiry_id, job_id, transport_mode, extraction_path,
 * page_count, failure_code) were added by migration 2026_08_27_021600 but were NOT in
 * $fillable until 2026-08-28 — so every one was silently dropped on mass assignment and
 * CargoDataPromotionService could never find its target. Adding a column is only half the
 * change.
 */
class PdfProcessingJob extends Model
{
    protected $fillable = [
        'user_id', 'original_filename', 'temp_file_path',
        'document_type', 'status', 'queue_job_id',
        'extracted_data', 'error_message',
        'started_at', 'completed_at',
        // Freight OS — attribution and OCR routing (guide §4.1.1).
        'enquiry_id', 'job_id', 'transport_mode',
        'extraction_path', 'page_count', 'failure_code',
    ];

    protected $casts = [
        'extracted_data' => 'array',
        'started_at'     => 'datetime',
        'completed_at'   => 'datetime',
        'page_count'     => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /** The common case — extraction normally runs PRE-conversion, on the enquiry. */
    public function enquiry()
    {
        return $this->belongsTo(Enquiry::class, 'enquiry_id');
    }

    /** Set instead when the document arrives after confirmation. */
    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function corrections()
    {
        return $this->hasMany(PdfExtractionCorrection::class, 'job_id');
    }

    /**
     * Parked awaiting a human decision on spending a vision credit.
     *
     * 🔒 Nothing has been reserved and no paid call has been made. The 30-minute stale
     * sweep must EXCLUDE this state — an operator may legitimately answer an hour later —
     * and it gets its own 24h expiry instead (guide §4.7).
     */
    public function scopeAwaitingVisionConsent($query)
    {
        return $query->where('status', 'awaiting_vision_consent');
    }

    /** Scope: only this user's jobs */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
