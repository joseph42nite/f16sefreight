<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * A UN/LOCODE port — airport, seaport or inland terminal.
 *
 * Shared reference data, deliberately not tenant-scoped: no company_id, no agent_id,
 * and no portal scope applies. INBOM is the same row for every tenant.
 *
 * Not to be confused with App\Location, which is the pre-existing IATA airport lookup
 * feeding airline tariff zones (see App\Rate). Different key, air only, different job.
 */
class Port extends Model
{
    protected $fillable = [
        'locode',
        'port_name',
        'country_code',
        'port_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
