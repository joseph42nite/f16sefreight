<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AccountsInvoiceConsolDetail extends Model
{
    protected $table = 'accounts_invoice_consol_details';

    protected $fillable = [
        'invoice_id',
        'profit_share_ratio',
        'partner_agent_id',
    ];

    public function invoice()
    {
        return $this->belongsTo(AccountsInvoice::class, 'invoice_id');
    }

    public function partnerAgent()
    {
        return $this->belongsTo(Company::class, 'partner_agent_id');
    }
}
