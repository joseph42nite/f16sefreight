<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/** 1-to-1 with a consol invoice. */
class AccountsInvoiceConsolDetail extends Model
{
    protected $fillable = ['invoice_id', 'partner_agent_id', 'consol_basis'];

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }

    public function partnerAgent()
    {
        return $this->belongsTo(Partner::class, 'partner_agent_id');
    }
}
