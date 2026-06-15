<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SequenceCounter extends Model
{
    protected $table = 'sequence_counters';

    protected $fillable = [
        'agent_id',
        'prefix',
        'fiscal_year',
        'current_value',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
