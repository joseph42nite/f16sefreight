<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccountsInvoiceBrokerageDetail extends Model
{
    protected $table = 'accounts_invoice_brokerage_details';

    protected $fillable = [
        'invoice_id',
        'brokerage_basis',
        'commission_rate',
        'base_freight_cost',
    ];

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }
}
