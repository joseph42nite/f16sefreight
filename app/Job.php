<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use SoftDeletes;

    protected $table = 'jobs';

    protected static function booted()
    {
        static::addGlobalScope(new \App\Scopes\PortalScope());

        static::creating(function ($model) {
            if (empty($model->transport_mode)) {
                $model->transport_mode = session('active_portal_scope', 'air');
            }
        });
    }

    protected $fillable = [
        'agent_id',
        'transport_mode',
        'direction',
        'enquiry_no',
        'execution_job_no',
        'client_id',
        'operator_id',
        'job_owner_id',
        'doc_user_id',
        'status',
        'lost_reason',
        'lost_reason_custom',
        'lost_at',
        'parent_job_id',
        'is_sub_shipment',
        'is_consolidation',
    ];

    protected $casts = [
        'status' => \App\Enums\JobStatus::class,
        'is_sub_shipment' => 'boolean',
        'is_consolidation' => 'boolean',
        'lost_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function client()
    {
        return $this->belongsTo(Company::class, 'client_id');
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function jobOwner()
    {
        return $this->belongsTo(User::class, 'job_owner_id');
    }

    public function docUser()
    {
        return $this->belongsTo(User::class, 'doc_user_id');
    }

    public function parentJob()
    {
        return $this->belongsTo(Job::class, 'parent_job_id');
    }

    public function subShipments()
    {
        return $this->hasMany(Job::class, 'parent_job_id');
    }

    public function seaShipmentDetail()
    {
        return $this->hasOne(SeaShipmentDetail::class, 'job_id');
    }

    public function airShipmentDetail()
    {
        return $this->hasOne(AirShipmentDetail::class, 'job_id');
    }

    public function llmUsageLogs()
    {
        return $this->hasMany(LlmUsageLog::class, 'job_id');
    }

    public function inboundEmails()
    {
        return $this->hasMany(InboundEmail::class, 'job_id');
    }

    public function emailThreads()
    {
        return $this->hasMany(EmailThread::class, 'job_id');
    }

    public function jobDocuments()
    {
        return $this->hasMany(JobDocument::class, 'job_id');
    }

    public function milestonePerformanceLogs()
    {
        return $this->hasMany(MilestonePerformanceLog::class, 'job_id');
    }

    public function seaContainers()
    {
        return $this->hasMany(SeaContainer::class, 'job_id');
    }

    public function cargoArrivalNotice()
    {
        return $this->hasOne(CargoArrivalNotice::class, 'job_id');
    }

    public function jobEntities()
    {
        return $this->hasMany(JobEntity::class, 'job_id');
    }

    public function accountsInvoices()
    {
        return $this->hasMany(AccountsInvoice::class, 'job_id');
    }

    public function airwayBills()
    {
        return $this->hasMany(\App\AirwayBills::class, 'job_id');
    }

    public function housewayBills()
    {
        return $this->hasMany(\App\HousewayBills::class, 'job_id');
    }
}
