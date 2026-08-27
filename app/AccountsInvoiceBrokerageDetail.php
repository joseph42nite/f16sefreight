<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** 1-to-1 with a brokerage invoice. */
class AccountsInvoiceBrokerageDetail extends Model
{
    protected $fillable = ['invoice_id', 'partner_agent_id', 'brokerage_basis'];

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }

    public function partnerAgent()
    {
        return $this->belongsTo(Partner::class, 'partner_agent_id');
    }
}
