<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SeaContainerItem extends Model
{
    protected $table = 'sea_container_items';

    protected $fillable = [
        'agent_id',
        'container_id',
        'job_id',
        'stuffed_pieces',
        'stuffed_weight',
        'stuffed_volume',
    ];

    protected $casts = [
        'stuffed_weight' => 'decimal:3',
        'stuffed_volume' => 'decimal:3',
    ];

    public function container()
    {
        return $this->belongsTo(SeaContainer::class, 'container_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
