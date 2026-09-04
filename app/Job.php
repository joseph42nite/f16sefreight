<?php

namespace App;

use App\Concerns\BelongsToTenant;
use App\Enums\JobStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * The post-conversion lifecycle — confirmed shipments only.
 *
 * A row exists here ONLY once the client confirms. `[Confirm Shipment]` is the single
 * action in the product that creates one.
 *
 * ⚠️ NOT Laravel's queue `jobs` table. This application's queue uses a different
 * connection/table; `App\Job` is the freight shipment.
 */
class Job extends Model
{
    use BelongsToTenant;

    use SoftDeletes;

    protected $table = 'jobs';

    protected $fillable = [
        'agent_id', 'enquiry_id', 'transport_mode', 'direction',
        'execution_job_no', 'job_order_no', 'quotation_no', 'customer_id',
        'ops_id', 'pending_ops_id', 'pending_ops_requested_by', 'pending_ops_requested_at',
        'pricing_id', 'parent_job_id', 'status',
        'cancellation_reason', 'cancellation_reason_custom', 'cancelled_at', 'cancelled_by',
        'cargo_type', 'consol_type', 'delivery_mode', 'booking_thru',
        'planned_clearance_date', 'awb_number', 'pickup_address', 'delivery_address',
        'is_sub_shipment', 'is_consolidation', 'completed_at',
    ];

    /**
     * Mirrors the database defaults so a freshly created model reports the same status
     * the row actually holds. Without this `$job->status` is NULL until the model is
     * refreshed — which silently wrote empty milestone names from JobObserver.
     */
    protected $attributes = [
        'status'    => 'Intake',
        'direction' => 'export',
    ];

    protected $casts = [
        'status'                   => JobStatus::class,
        // 🔴 `date:Y-m-d`, NOT `date`. The bare cast produces a Carbon at midnight in the
        // APP timezone and serialises it as UTC, so a clearance date of 5 Sep left the
        // API as "2026-09-04T18:30:00Z" — and any reader west of Asia/Kolkata renders it
        // as the 4th. A clearance date that is silently a day early is a missed flight,
        // and `slice(0, 10)` in the board would have bucketed it under the wrong day too.
        // A calendar date has no time and no timezone; this transmits it as one.
        'planned_clearance_date'   => 'date:Y-m-d',
        'pending_ops_requested_at' => 'datetime',
        'cancelled_at'             => 'datetime',
        'completed_at'             => 'datetime',
        'is_sub_shipment'          => 'boolean',
        'is_consolidation'         => 'boolean',
    ];

    /**
     * 🔴 THE MODE INVARIANT — a job populates exactly ONE detail table, never both.
     *
     * The database cannot express this: air_shipment_details and sea_shipment_details
     * are separate 1-to-1 tables and nothing stops a row appearing in each. So it is
     * guarded here and asserted in tests (guide §2.1).
     *
     * `awb_number` is AIR-ONLY. Sea and road carry MBL/HBL on sea_shipment_details and
     * must leave it NULL — a sea job with an AWB number is a data error that would
     * surface as a mis-generated customs document.
     */
    protected static function booted(): void
    {
        static::saving(function (self $job) {
            if ($job->transport_mode !== 'air' && filled($job->awb_number)) {
                throw new \LogicException(
                    "awb_number is air-only; job {$job->execution_job_no} is "
                    . "'{$job->transport_mode}'. Sea and road carry MBL/HBL on "
                    . 'sea_shipment_details.'
                );
            }
        });
    }

    public function branch()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    /** Required. Every job traces to the enquiry it converted from. */
    public function enquiry()
    {
        return $this->belongsTo(Enquiry::class, 'enquiry_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function opsUser()
    {
        return $this->belongsTo(User::class, 'ops_id');
    }

    public function pendingOpsUser()
    {
        return $this->belongsTo(User::class, 'pending_ops_id');
    }

    public function pricingOwner()
    {
        return $this->belongsTo(User::class, 'pricing_id');
    }

    /** Consolidation master. */
    public function parentJob()
    {
        return $this->belongsTo(self::class, 'parent_job_id');
    }

    public function houseJobs()
    {
        return $this->hasMany(self::class, 'parent_job_id');
    }

    /**
     * Returns NULL on a sea or road job, by design — see the mode invariant above.
     * The constraint is applied to the relation itself so eager loading behaves too.
     */
    public function airShipmentDetails()
    {
        $relation = $this->hasOne(AirShipmentDetail::class, 'job_id');

        return $this->transport_mode === 'air' ? $relation : $relation->whereRaw('1 = 0');
    }

    /** Returns NULL on an air job, by design. */
    public function seaShipmentDetails()
    {
        $relation = $this->hasOne(SeaShipmentDetail::class, 'job_id');

        return $this->transport_mode === 'sea' ? $relation : $relation->whereRaw('1 = 0');
    }

    public function entities()
    {
        return $this->hasMany(JobEntity::class, 'job_id');
    }

    public function containers()
    {
        return $this->hasMany(SeaContainer::class, 'job_id');
    }

    public function documents()
    {
        return $this->hasMany(JobDocument::class, 'job_id');
    }

    public function invoices()
    {
        return $this->hasMany(AccountsInvoice::class, 'job_id');
    }

    public function purchaseVouchers()
    {
        return $this->hasMany(AccountsPurchaseVoucher::class, 'job_id');
    }

    public function scopeForActivePortal($query)
    {
        if (app()->bound('active_portal_scope')) {
            return $query->where('transport_mode', app('active_portal_scope'));
        }

        return $query;
    }

    /**
     * Gross margin as a percentage, or NULL for an unbilled job.
     *
     * ⚠️ NULL, never -100. An unbilled job has no margin YET; reporting it as a total
     * loss would corrupt every P&L roll-up that averages it (PRD.md §7).
     * ⚠️ Never surfaced in the sales view at any tier.
     */
    public function grossMarginPct(): ?float
    {
        $revenue = (float) AccountsInvoiceItem::whereIn('invoice_id', $this->invoices()->select('id'))->sum('net_amount');

        if ($revenue <= 0.0) {
            return null;
        }

        $cost = (float) AccountsPurchaseItem::whereIn('purchase_voucher_id', $this->purchaseVouchers()->select('id'))->sum('net_amount');

        return round(($revenue - $cost) / $revenue * 100, 2);
    }
}
