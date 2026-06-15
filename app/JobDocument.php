<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JobDocument extends Model
{
    protected $table = 'job_documents';

    protected $fillable = [
        'agent_id',
        'job_id',
        'document_type',
        'filename',
        'file_path',
        'mime_type',
        'uploaded_by',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
