<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * The single source of every document number, scoped (agent_id, prefix, fiscal_year).
 *
 * ⚠️ Do NOT increment through this model. All numbering goes through
 * EnquirySequenceService (guide §4.4), which holds a row lock inside a transaction —
 * an ordinary Eloquent save has no lock and two operators would collide.
 */
class SequenceCounter extends Model
{
    protected $fillable = ['agent_id', 'prefix', 'fiscal_year', 'current_value'];

    protected $casts = ['current_value' => 'integer'];

    public function branch()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}
