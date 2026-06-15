<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccountsInvoiceItem extends Model
{
    protected $table = 'accounts_invoice_items';

    protected $fillable = [
        'invoice_id',
        'house_job_id',
        'charge_type',
        'description',
        'qty',
        'unit_rate',
        'tax_rate',
        'subtotal',
        'tax_amount',
        'total_amount',
    ];

    protected $casts = [
        'qty'          => 'decimal:2',
        'unit_rate'    => 'decimal:2',
        'tax_rate'     => 'decimal:2',
        'subtotal'     => 'decimal:2',
        'tax_amount'   => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }

    public function houseJob()
    {
        return $this->belongsTo(Job::class, 'house_job_id');
    }
}
