<?php

namespace App;

use App\Concerns\BelongsToTenant;
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
    use BelongsToTenant;

    use SoftDeletes;

    protected $fillable = [
        'agent_id', 'transport_mode', 'direction', 'enquiry_no', 'quotation_no',
        'customer_id', 'sales_id', 'ops_id', 'pricing_id', 'status',
        'extracted_pieces', 'extracted_weight', 'extracted_volume',
        'cargo_description', 'cargo_type', 'cargo_data_source', 'cargo_data_promoted_at',
        'origin_code', 'dest_code', 'quoted_amount', 'quoted_currency',
        'lost_reason', 'lost_reason_custom', 'lost_at', 'lost_automatically',
        'reopened_at', 'stale_nudged_at', 'stale_nudge_count',
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
        'lost_automatically'     => 'boolean',
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

    /** The three statuses where a client is still expected to come back. */
    public const OPEN_STATUSES = [
        EnquiryStatus::New->value,
        EnquiryStatus::Quoted->value,
        EnquiryStatus::AwaitingClient->value,
    ];

    /**
     * Enquiries awaiting a client who has gone quiet. The window resolves
     * branch -> company -> config, so it is passed in rather than assumed here.
     *
     * 🔴 The debounce is `stale_nudged_at` **plus another whole window**, not
     * `whereNull`. Filtering on NULL meant a silent client was reminded about exactly
     * ONCE, ever — after which the enquiry sat in the funnel forever as neither won nor
     * lost, which is the leak this scope exists to prevent. Each attempt now needs the
     * window to elapse again, so attempt two lands a window after attempt one.
     */
    public function scopeStale($query, int $days)
    {
        return $query->whereIn('status', self::OPEN_STATUSES)
            ->where('updated_at', '<=', now()->subDays($days))
            ->where(fn ($q) => $q
                ->whereNull('stale_nudged_at')
                ->orWhere('stale_nudged_at', '<=', now()->subDays($days)));
    }

    /**
     * Silent through every nudge it was going to get — the sweep gives up here.
     *
     * ⚠️ Deliberately NOT the same shape as `stale()`: this needs the window to have
     * elapsed since the LAST nudge, so the client had the full window to answer the
     * final reminder before anything is closed on their behalf.
     */
    public function scopeExhaustedNudges($query, int $days, int $attempts)
    {
        return $query->whereIn('status', self::OPEN_STATUSES)
            ->where('stale_nudge_count', '>=', $attempts)
            ->whereNotNull('stale_nudged_at')
            ->where('stale_nudged_at', '<=', now()->subDays($days));
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
