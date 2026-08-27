<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A party on a shipment: shipper, consignee, notify party, agent, broker, transporter.
 *
 * Polymorphic `party` resolves to Customer or Partner via the morph map.
 * ⚠️ There is no database FK on party_id — every FormRequest MUST assert the referenced
 * party shares the acting user's company_id before persisting (guide §3.2). That check
 * has no database backstop.
 *
 * Partial uniqueness (one shipper per job, many notify parties) is enforced by the
 * generated column `unique_role_gate` — do not attempt it here.
 */
class JobEntity extends Model
{
    use SoftDeletes;

    /** `unique_role_gate` is database-generated and must never be written. */
    protected $guarded = ['id', 'unique_role_gate'];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function party()
    {
        return $this->morphTo(__FUNCTION__, 'party_type', 'party_id');
    }

    public function scopeRole($query, string $role)
    {
        return $query->where('role', $role);
    }
}
