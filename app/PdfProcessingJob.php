<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PdfProcessingJob extends Model
{
    protected static function booted()
    {
        static::addGlobalScope(new \App\Scopes\PortalScope());

        static::creating(function ($model) {
            if (empty($model->transport_mode)) {
                $model->transport_mode = session('active_portal_scope', 'air');
            }
        });
    }

    protected $fillable = [
        'user_id', 'original_filename', 'temp_file_path',
        'document_type', 'status', 'queue_job_id',
        'extracted_data', 'error_message',
        'started_at', 'completed_at', 'transport_mode',
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
