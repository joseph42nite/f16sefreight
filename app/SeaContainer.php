<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A physical container on a vessel, owned by the MASTER job.
 *
 * container_number is NOT unique: ISO 6346 numbers are reused every voyage. Check-digit
 * validation is a form concern, not a database constraint.
 */
class SeaContainer extends Model
{
    use SoftDeletes;

    protected $fillable = ['agent_id', 'job_id', 'container_number', 'seal_number'];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function items()
    {
        return $this->hasMany(SeaContainerItem::class, 'container_id');
    }
}
