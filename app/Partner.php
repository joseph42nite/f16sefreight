<?php

namespace App;

use App\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

/**
 * A carrier, airline, co-loader, transporter, broker, agent or vendor.
 * The counterpart to Customer: money goes OUT to these.
 *
 * ⚠️ NOT the legacy App\Airline. That table is retained for the email exclusion engine's
 * carrier-DOMAIN list ("is this inbound mail from a carrier?"); accounting and
 * operational carrier records live here (PRD.md §10). Do not merge them, and do not
 * write new accounting logic against Airline.
 *
 * 🔐 Banking columns are encrypted — see Customer for the full note. Vendor payouts run
 * through these, so a truncated or plaintext value is worse here than anywhere.
 */
class Partner extends Model
{
    use BelongsToTenant;

    /** Tenant-WIDE: shared across all of this tenant's branches. */
    /**
     * 🔴 BRANCH, not company — GST registration is per state.
     *
     * The same customs broker carries a different GSTIN in Maharashtra and in Tamil Nadu:
     * separate registrations, separate returns. A company-wide row cannot hold both, so
     * whichever branch saved last would overwrite the other's number and the purchase
     * voucher raised against it would claim input credit under the wrong registration.
     *
     * ⚠️ Carriers are the exception and do not live here at all — an airline's details are
     * the same everywhere, so they are platform reference data (`airlines`) curated by
     * F16s rather than re-keyed by every branch.
     */
    protected string $tenantColumn = 'agent_id';

    /**
     * One row can act in several roles across different shipments — the same firm is
     * co-loader on one and transporter on the next. `partner_type` is only the PRIMARY
     * classification; the actual role belongs to the relationship (job_entities.role,
     * the five party FKs on sea_shipment_details).
     */
    public const TYPES = [
        'airline', 'shipping_line', 'co-loader', 'transporter',
        'customs_broker', 'agent', 'broker', 'vendor', 'other',
    ];

    protected $fillable = [
        'company_id', 'agent_id', 'name', 'partner_type', 'email', 'phone', 'address',
        'gst_no', 'pan_no', 'bank_name', 'bank_account_no', 'bank_ifsc_code',
    ];

    protected $casts = [
        'bank_account_no' => 'encrypted',
        'bank_ifsc_code'  => 'encrypted',
    ];

    protected $hidden = ['bank_account_no', 'bank_ifsc_code'];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function purchaseVouchers()
    {
        return $this->hasMany(AccountsPurchaseVoucher::class, 'vendor_id');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('partner_type', $type);
    }
}
