<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SeaContainer extends Model
{
    use SoftDeletes;

    protected $table = 'sea_containers';

    protected $fillable = [
        'job_id',
        'container_number',
        'seal_number',
        'size_type',
        'tare_weight',
        'payload_weight',
        'vgm_weight',
    ];

    protected $casts = [
        'tare_weight'    => 'decimal:3',
        'payload_weight' => 'decimal:3',
        'vgm_weight'     => 'decimal:3',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function items()
    {
        return $this->hasMany(SeaContainerItem::class, 'container_id');
    }
}
