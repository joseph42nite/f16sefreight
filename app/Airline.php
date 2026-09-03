<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * A carrier, as platform reference data — prefix, name, and email domain.
 *
 * 🔴 **Not tenant data.** `176` is Emirates whoever is looking, so this list is curated
 * once by F16s rather than re-keyed by every branch of every tenant. `domain` is what the
 * inbox classifies mail by, and `prefix` is the first segment of every AWB number the
 * carrier issues — a mistyped one files a waybill under the wrong airline.
 *
 * ⚠️ `domain` was added 2026-09-03 and was NOT in `$fillable` at first. Adding a column is
 * only half the change: without this line every save silently dropped it, which is the same
 * defect this codebase has now hit on PdfProcessingJob, User and MailboxConnection.
 */
class Airline extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'code',
        'prefix',
        'country',
        'domain',
        'airline_address',
        'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    /** Carriers usable for classification: active, and with a domain to match on. */
    public function scopeClassifiable($query)
    {
        return $query->where('is_active', true)->whereNotNull('domain');
    }
}