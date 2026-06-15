<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'billing_state',
        'tier',
        'credit_limit',
        'credit_days',
        'email_domain',
        'templates_config',
    ];

    protected $casts = [
        'templates_config' => 'array',
        'credit_limit'     => 'decimal:2',
        'credit_days'      => 'integer',
    ];

    public function jobs()
    {
        return $this->hasMany(Job::class, 'client_id');
    }

    public function jobEntities()
    {
        return $this->hasMany(JobEntity::class, 'company_id');
    }

    public function accountsInvoices()
    {
        return $this->hasMany(AccountsInvoice::class, 'client_id');
    }
}
