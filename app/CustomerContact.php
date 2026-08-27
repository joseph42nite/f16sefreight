<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * The per-client address book, and the CC source for sales outreach.
 *
 * 🔴 **NEVER set include_in_cc from harvesting code.** Harvesting is automatic; being
 * CC'd is always a human decision (guide §2.1). Over a year on one client thread the
 * harvester collects departed staff, personal addresses, the client's customs broker and
 * a competitor CC'd once on a quote — blind-CC'ing that set is simultaneously a
 * commercial incident and a DPDP one.
 */
class CustomerContact extends Model
{
    protected $fillable = [
        'company_id', 'customer_id', 'email', 'name', 'designation', 'source',
        'is_primary', 'include_in_cc', 'verified_at', 'last_seen_at',
        'message_count', 'opted_out_at',
    ];

    protected $casts = [
        'is_primary'    => 'boolean',
        'include_in_cc' => 'boolean',
        'verified_at'   => 'datetime',
        'last_seen_at'  => 'datetime',
        'opted_out_at'  => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    /**
     * The outreach recipient set. opted_out_at is ABSOLUTE — it overrides include_in_cc
     * unconditionally (DPDP Act 2023, PRD.md §9.3), so both conditions are required.
     */
    public function scopeCcEligible($query)
    {
        return $query->where('include_in_cc', true)->whereNull('opted_out_at');
    }

    public function scopeContactable($query)
    {
        return $query->whereNull('opted_out_at');
    }
}
