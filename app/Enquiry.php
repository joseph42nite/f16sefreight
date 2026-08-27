<?php

namespace App;

use App\Enums\EnquiryStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * The pre-conversion lifecycle — every inbound client request, converted or not.
 *
 * Unconverted rows are the product, not leftovers: they ARE the funnel and the substrate
 * of the whole Sales Intelligence Engine. Deleting them destroys the denominator of every
 * sales metric.
 */
class Enquiry extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'agent_id', 'transport_mode', 'direction', 'enquiry_no', 'quotation_no',
        'customer_id', 'sales_id', 'ops_id', 'pricing_id', 'status',
        'extracted_pieces', 'extracted_weight', 'extracted_volume',
        'cargo_description', 'cargo_type', 'cargo_data_source', 'cargo_data_promoted_at',
        'origin_code', 'dest_code', 'quoted_amount', 'quoted_currency',
        'lost_reason', 'lost_reason_custom', 'lost_at', 'reopened_at', 'stale_nudged_at',
        'reinitiated_from_job_id',
    ];

    /** Mirrors the database defaults — see App\Job for why this matters. */
    protected $attributes = [
        'status'            => 'new',
        'direction'         => 'export',
        'cargo_data_source' => 'regex',
    ];

    protected $casts = [
        'status'                 => EnquiryStatus::class,
        'extracted_weight'       => 'decimal:3',
        'extracted_volume'       => 'decimal:3',
        'quoted_amount'          => 'decimal:2',
        'lost_at'                => 'datetime',
        'reopened_at'            => 'datetime',
        'stale_nudged_at'        => 'datetime',
        'cargo_data_promoted_at' => 'datetime',
    ];

    public function branch()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function salesRep()
    {
        return $this->belongsTo(User::class, 'sales_id');
    }

    public function opsUser()
    {
        return $this->belongsTo(User::class, 'ops_id');
    }

    public function pricingOwner()
    {
        return $this->belongsTo(User::class, 'pricing_id');
    }

    /**
     * MANY jobs to ONE enquiry — a single client request may split into several
     * shipments, or a consol with several house jobs.
     */
    public function jobs()
    {
        return $this->hasMany(Job::class, 'enquiry_id');
    }

    public function emailThreads()
    {
        return $this->hasMany(EmailThread::class, 'enquiry_id');
    }

    public function pdfProcessingJobs()
    {
        return $this->hasMany(PdfProcessingJob::class, 'enquiry_id');
    }

    /** Re-quote lineage: the cancelled job this enquiry was raised to replace. */
    public function reinitiatedFromJob()
    {
        return $this->belongsTo(Job::class, 'reinitiated_from_job_id');
    }

    public function scopeLost($query)
    {
        return $query->where('status', EnquiryStatus::Lost->value);
    }

    /**
     * "Converted" means a job row exists — that is the definition, not a status flag.
     * The status column is maintained alongside for query convenience, but the job is
     * the source of truth (which is why there is no enquiries.converted_job_id).
     */
    public function scopeConverted($query)
    {
        return $query->has('jobs');
    }

    /**
     * Enquiries awaiting a client who has gone quiet. The window resolves
     * branch -> company -> config, so it is passed in rather than assumed here.
     */
    public function scopeStale($query, int $days)
    {
        return $query->whereIn('status', [EnquiryStatus::New->value, EnquiryStatus::Quoted->value, EnquiryStatus::AwaitingClient->value])
            ->where('updated_at', '<=', now()->subDays($days))
            ->whereNull('stale_nudged_at');
    }

    /**
     * Chain EXPLICITLY in HTTP controllers; never make it global.
     * Queue workers, WebSocket broadcasts and crons never run BindPortalScope, so the
     * binding is absent there and this passes through unfiltered — which is exactly
     * right for a daemon processing a sea job.
     */
    public function scopeForActivePortal($query)
    {
        if (app()->bound('active_portal_scope')) {
            return $query->where('transport_mode', app('active_portal_scope'));
        }

        return $query;
    }
}
