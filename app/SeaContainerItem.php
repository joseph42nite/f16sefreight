<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * Which HOUSE job's cargo sits in a container, and how many pieces.
 *
 * The grain is the LINK, not either job: one container carries several houses, and one
 * house can straddle two containers — which is why piece counts live here.
 */
class SeaContainerItem extends Model
{
    protected $fillable = ['agent_id', 'container_id', 'job_id', 'piece_count'];

    public function container()
    {
        return $this->belongsTo(SeaContainer::class, 'container_id');
    }

    /** The HOUSE child card, not the consolidation master. */
    public function houseJob()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }
}
