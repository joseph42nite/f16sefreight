<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class JobDocument extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'agent_id', 'job_id', 'document_type', 'file_name', 'file_path',
        'mime_type', 'file_size', 'uploaded_by',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function shareLinks()
    {
        return $this->hasMany(DocumentShareLink::class, 'job_document_id');
    }
}
