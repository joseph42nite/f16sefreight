<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JobEntity extends Model
{
    protected $table = 'job_entities';

    protected $fillable = [
        'job_id',
        'company_id',
        'role',
        'address',
        'contact_person',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
