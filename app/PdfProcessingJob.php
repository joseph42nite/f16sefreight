<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PdfProcessingJob extends Model
{
    protected $fillable = [
        'user_id', 'original_filename', 'temp_file_path',
        'document_type', 'status', 'queue_job_id',
        'extracted_data', 'error_message',
        'started_at', 'completed_at',
    ];

    protected $casts = [
        'extracted_data' => 'array',
        'started_at'     => 'datetime',
        'completed_at'   => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope: only this user's jobs
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
