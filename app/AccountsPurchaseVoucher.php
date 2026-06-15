<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccountsPurchaseVoucher extends Model
{
    protected $table = 'accounts_purchase_vouchers';

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
        'voucher_no',
        'document_date',
        'job_id',
        'vendor_id',
        'vendor_invoice_no',
        'vendor_invoice_date',
        'currency',
        'exchange_rate',
        'subtotal',
        'tax_amount',
        'grand_total',
        'status',
        'is_posted',
        'created_by',
    ];

    protected $casts = [
        'document_date'       => 'date',
        'vendor_invoice_date' => 'date',
        'exchange_rate'       => 'decimal:6',
        'subtotal'            => 'decimal:2',
        'tax_amount'          => 'decimal:2',
        'grand_total'         => 'decimal:2',
        'is_posted'           => 'boolean',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Company::class, 'vendor_id');
    }

    public function items()
    {
        return $this->hasMany(AccountsPurchaseItem::class, 'voucher_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function nextVoucherNumber(int $agentId, string $documentDate): string
    {
        $year = date('Y', strtotime($documentDate));
        return \Illuminate\Support\Facades\DB::transaction(function () use ($agentId, $year) {
            $counter = \App\SequenceCounter::where('agent_id', $agentId)
                ->where('prefix', 'PV')
                ->where('fiscal_year', $year)
                ->lockForUpdate()
                ->first();

            if (!$counter) {
                $counter = \App\SequenceCounter::create([
                    'agent_id'      => $agentId,
                    'prefix'        => 'PV',
                    'fiscal_year'   => $year,
                    'current_value' => 0,
                ]);
            }

            $counter->increment('current_value');
            $counter->refresh();

            return sprintf('PV-%s-%04d', $year, $counter->current_value);
        });
    }
}
