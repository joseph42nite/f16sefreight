<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountsInvoice extends Model
{
    use SoftDeletes;

    protected $table = 'accounts_invoices';

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
        'type',
        'invoice_no',
        'document_date',
        'job_id',
        'client_id',
        'billed_party_role',
        'currency',
        'exchange_rate',
        'billing_address',
        'tax_registration_no',
        'payment_terms',
        'subtotal',
        'tax_amount',
        'grand_total',
        'status',
        'is_posted',
        'due_date',
        'created_by',
    ];

    protected $casts = [
        'document_date'   => 'date',
        'due_date'        => 'date',
        'exchange_rate'   => 'decimal:6',
        'subtotal'        => 'decimal:2',
        'tax_amount'      => 'decimal:2',
        'grand_total'     => 'decimal:2',
        'is_posted'       => 'boolean',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function client()
    {
        return $this->belongsTo(Company::class, 'client_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(AccountsInvoiceItem::class, 'invoice_id');
    }

    public function brokerageDetail()
    {
        return $this->hasOne(AccountsInvoiceBrokerageDetail::class, 'invoice_id');
    }

    public function consolDetail()
    {
        return $this->hasOne(AccountsInvoiceConsolDetail::class, 'invoice_id');
    }

    public function ledgerEntries()
    {
        return $this->hasMany(AccountsLedgerEntry::class, 'source_id')->where('source_type', 'Invoice');
    }
}
