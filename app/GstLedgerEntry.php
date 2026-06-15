<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GstLedgerEntry extends Model
{
    protected $table = 'gst_ledger_entries';

    protected $fillable = [
        'agent_id',
        'voucher_id',
        'voucher_type',
        'voucher_no',
        'voucher_date',
        'company_id',
        'cgst_rate',
        'cgst_amount',
        'sgst_rate',
        'sgst_amount',
        'igst_rate',
        'igst_amount',
        'total_tax',
    ];

    protected $casts = [
        'voucher_date' => 'date',
        'cgst_rate'    => 'decimal:2',
        'cgst_amount'  => 'decimal:2',
        'sgst_rate'    => 'decimal:2',
        'sgst_amount'  => 'decimal:2',
        'igst_rate'    => 'decimal:2',
        'igst_amount'  => 'decimal:2',
        'total_tax'    => 'decimal:2',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
